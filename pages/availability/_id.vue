<template>
  <div class="px-2 max-w-3xl">
    <!-- <nuxt-link :to="'/availability'">
      <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
    </nuxt-link> -->

    <div class="flex justify-start font-bold text-sm sm:text-xl pt-3 mb-2">
      Availability
    </div>

    <div class="mt-4">
      <div class="relative bg-white rounded-lg border p-4">
        <AppLoading :loading="loading" spinner />

        <AppFormError v-if="formError.length > 0" :formError="formError" />

        <div class="font-bold text-sm sm:text-md mt-4">
          I won't be available
        </div>

        <div class="text-gray-600 font-bold italic text-sm sm:text-md mt-4">
          *Please take note that being unavailable on AM / PM Shifts would also mean that you will not be available for Whole Day Sessions.
        </div>

        <div class="flex flex-col w-full my-6">
          <div class="text-sm sm:text-md">
            On this date
          </div>

          <div class="text-md sm:text-lg font-bold mt-2">
            {{ selectedDate ? $moment(selectedDate, 'YYYY-MM-DD').format('DD/MM/YYYY') : '' }}
          </div>
        </div>

        <div class="flex flex-row flex-wrap items-center justify-between mt-4 relative">
          <div class="text-sm sm:text-md leading-loose mr-4">
            On these shifts
          </div>

          <div
            class="rounded-lg bg-gray-300 px-2 py-1 text-sm sm:text-md flex items-center"
          >
            Select all that apply. Shifts that are already booked are greyed-out. Please take note that being unavailable on AM / PM Shifts would also mean that you will not be available for Whole Day Sessions.
          </div>

          <div
            v-if="formError.find(formError => formError.field === 'shift_id') && formError.find(formError => formError.field === 'shift_id').message"
            class="text-red-500 text-xs text-white"
          >
            {{ formError.find(formError => formError.field === 'shift_id').message.charAt(0).toUpperCase() + formError.find(formError => formError.field === 'shift_id').message.slice(1).replace(/_/g, " ") }}
          </div>
        </div>

        <div
          class="flex flex-row flex-wrap justify-around md:justify-between mt-4"
          :class="formError.find(formError => formError.field === 'shift_id') && 'error rounded-lg'"
        >
          <button
            v-for="shift in shifts"
            :key="shift.id"
            class="relative border border-solid rounded-lg p-5 my-2 md:m-1 text-center text-xs sm:text-sm focus:outline-none w-full sm:w-1/3 md:w-1/6"
            :class="{
              'bg-gray-300 cursor-not-allowed': isDisabled(shift.id),
              'bg-yellow-500': selectedShifts.some(({ id }) => id === shift.id), 
              'hover:bg-yellow-400': !selectedShifts.some(({ id }) => id === shift.id) && !isDisabled(shift.id),
            }"
            style="box-sizing:content-box;"
            @click="toggleShift(shift)"
          >
            {{ shift.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <AppButton label="Save" :disabled="loading" @click="save" />
    </div>
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
import AppFormError from "@/components/Base/AppFormError"

export default {
  components: {
    AppButton,
    AppLoading,
    AppFormError,
  },

  validate ({ app, params, }) {
    return (
      app.$moment(params.id, "YYYY-MM-DD").format("YYYY-MM-DD") === params.id
    )
  },

  data () {
    return {
      loading: true,
      shifts: [],
      date_start: null,
      date_end: null,
      formError: [],
      selectedShifts: [],
      availabilityType: 'unavailable',
      unavailability: null,
      ongoingAndAllocatedShifts: [],
    }
  },

  computed: {
    selectedDate () {
      return this.$store.state.availability.selected_date
    },
  },

  async asyncData ({ store, params, }) {
    store.commit("availability/SELECT_DATE", params.id)
  },

  mounted () {
    this.date_start = this.selectedDate
    this.date_end = this.selectedDate

    this.loading = true
    Promise
      .all([
        this.$axios.get('/api/v1/shifts')
          .then(response => this.shifts = response.data.data.shifts),

        this.$axios
          .get("/api/v1/locum/unavailabilities", {
            params: {
              date_start: this.selectedDate,
              date_end: this.selectedDate,
            },
          })
          .then(response => {
            const unavailabilities = response.data.data.unavailabilities

            if (unavailabilities.length > 0) {
              this.unavailability = unavailabilities[0]
              this.selectedShifts = [...this.unavailability.shifts,]
            }
          }),

        this.$axios
          .get("/api/v1/locum/job-parts", {
            params: {
              locum_status: ['Ongoing', 'Allocated',],
              calendar_date_start: this.selectedDate,
              calendar_date_end: this.selectedDate,
              limit: 100000000,
            },
          })
          .then(response => this.ongoingAndAllocatedShifts = response.data.data.job_parts.map(jobPart => jobPart.job.shift))
          .catch((err) => {
            console.log('err', err.response || err)
          }),
      ])
      .catch((err) => {
        console.log('err', err.response || err)
      })
      .finally(() => {
        this.loading = false
      })
  },

  methods: {
    toggleShift (shift) {
      let index = this.selectedShifts.findIndex(({ id, }) => id === shift.id)

      if (index > -1) {
        if (shift.name === 'Whole Day' && this.availabilityType === 'unavailable') {
          if (!this.selectedShifts.some(({ name, }) => name === 'AM' || name === 'PM')) {
            this.selectedShifts.splice(index, 1)
          }
        } else {
          this.selectedShifts.splice(index, 1)
        }
      } else if (!this.isDisabled(shift.id)) {
        this.selectedShifts.push(shift)

        this.addWholeDayIfAmAndPm()
      }
    },

    addWholeDayIfAmAndPm () {
      if (
        this.selectedShifts.some(({ name, }) => name === 'AM' || name === 'PM')
        && !this.selectedShifts.some(({ name, }) => name === 'Whole Day')
        && this.availabilityType === 'unavailable'
      ) {
        const wholeDayShift = this.shifts.find(({ name, }) => name === 'Whole Day')

        if (wholeDayShift) {
          this.selectedShifts.push(wholeDayShift)
        }
      }
    },

    isDisabled (id) {
      return this.ongoingAndAllocatedShifts.some(shift => shift.id === id)
    },

    save () {
      this.formError = []

      if (!this.date_start) {
        this.formError.push({
          message: 'From is required',
          field: 'date_start',
          validation: 'required',
        })
      }

      if (!this.date_end) {
        this.formError.push({
          message: 'To is required',
          field: 'date_end',
          validation: 'required',
        })
      }

      if (this.formError.length > 0) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: ["Please fill up all the forms",],
        })

        return
      }

      this.loading = true
      this.$axios
        .post(`/api/v1/locum/unavailabilities`, {
          date_start: this.date_start,
          date_end: this.date_end,
          shift_id: this.selectedShifts.map(({ id, }) => id),
        })
        .then(response => {
          this.$store.commit(
            "jobs/ADD_OR_UPDATE_LOCUM_UNAVAILABILITIES",
            response.data.data.unavailabilities
          )
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
          })

          this.$router.push('/availability')
        })
        .catch(err => {
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }

          if (err.response.data.error_messages) {
            err.response.data.error_messages.forEach(error => {
              this.formError.push(error)
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>
  .modal-container {
    z-index: 510;
  }

  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 80%;
    }
  }
</style>
