<template>
  <div ref="modalContainer" class="px-2 max-w-3xl">
    <!-- <nuxt-link :to="'/availability'">
      <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" />
    </nuxt-link> -->

    <div class="flex justify-start font-bold text-sm sm:text-xl pt-3 mb-2">
      Availability
    </div>

    <div class="mt-4">
      <div class="relative bg-white rounded-lg border p-4">
        <AppLoading :loading="loading" spinner />

        <div v-if="false" class="font-bold text-sm sm:text-md mt-4">
          I won't be available
        </div>

        <AppInput
          v-if="true"
          v-model="availabilityType"
          type="select"
          :items="[{ label: 'I won\'t be available', value: 'unavailable' }, { label: 'I will be available', value: 'available' }]"
        />

        <div v-if="availabilityType === 'unavailable'" class="text-gray-600 font-bold italic text-sm sm:text-md mt-4">
          *Please take note that being unavailable on AM / PM Shifts would also mean that you will not be available for Whole Day Sessions.
        </div>

        <div class="flex flex-row flex-wrap justify-between mt-4">
          <div class="w-full p-0 sm:w-1/2 pr-2">
            <AppDate
              v-model="date_start"
              :name="'date_start'"
              :label="'From'"
              isAfter
              :error="formError.find(item => item.field === 'date_start')"
              required
            />
          </div>

          <div class="w-full p-0 sm:w-1/2 pl-2">
            <AppDate
              v-model="date_end"
              :name="'date_end'"
              :label="'To'"
              isAfter
              :error="formError.find(item => item.field === 'date_end')"
              required
            />
          </div>
        </div>

        <div class="flex flex-row flex-wrap items-center justify-between mt-4 relative">
          <div class="flex items-center">
            <div class="text-sm sm:text-md leading-loose mr-4">
              On theses shifts
              <span class="text-red-500">*</span>
            </div>

            <div
              v-if="formError.find(formError => formError.field === 'shift_id') && formError.find(formError => formError.field === 'shift_id').message"
              class="text-red-500 text-xs text-white"
            >
              {{ formError.find(formError => formError.field === 'shift_id').message.charAt(0).toUpperCase() + formError.find(formError => formError.field === 'shift_id').message.slice(1).replace(/_/g, " ") }}
            </div>
          </div>

          <div
            class="rounded-lg bg-gray-300 px-2 py-1 text-sm sm:text-md flex items-center"
          >
            Select all that apply.
          </div>
        </div>
        
        <div class="flex flex-row flex-wrap justify-around md:justify-between mt-4">
          <button
            v-for="shift in shifts"
            :key="shift.id"
            class="relative border border-solid rounded-lg p-5 my-2 md:m-1 text-center text-xs sm:text-sm focus:outline-none w-full sm:w-1/3 md:w-1/6 transition-hover"
            :class="{
              'bg-gray-300 cursor-not-allowed': false,
              'border-red-500': formError.find(formError => formError.field === 'shift_id'),
              'bg-yellow-500': selectedShifts.some(({ id }) => id === shift.id), 
              'hover:bg-yellow-400': !selectedShifts.some(({ id }) => id === shift.id) && !false,
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
      <AppButton label="Save" :disabled="loading" @click="updateUnavailabilities" />
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"

export default {
  components: {
    AppInput,
    AppDate,
    AppButton,
    AppLoading,
  },

  data () {
    return {
      loading: true,
      shifts: [],
      date_start: null,
      date_end: null,
      selectedShifts: [],
      formError: [],
      availabilityType: 'unavailable',
    }
  },

  watch: {
    date_start () {
      this.formError = this.formError.filter(formError => formError.field !== 'date_start')

      if (!this.date_start) {
        this.formError.push({
          message: 'From is required',
          field: 'date_start',
          validation: 'required',
        })
      }
    },

    date_end () {
      this.formError = this.formError.filter(formError => formError.field !== 'date_end')

      if (!this.date_end) {
        this.formError.push({
          message: 'To is required',
          field: 'date_end',
          validation: 'required',
        })
      }
    },

    // selectedShifts () {
    //   this.formError = this.formError.filter(formError => formError.field !== 'shift_id')

    //   if (this.selectedShifts.length === 0) {
    //     this.formError.push({
    //       message: 'Shifts is required',
    //       field: 'shift_id',
    //       validation: 'required',
    //     })
    //   }
    // },

    availabilityType () {
      this.addWholeDayIfAmAndPm()
    },
  },

  mounted () {
    this.loading = true
    this.$axios.get('/api/v1/shifts')
      .then(response => this.shifts = response.data.data.shifts)
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
        if (shift.name === 'Whole Day') {
          if (
            (
              this.availabilityType === 'unavailable'
              && !this.selectedShifts.some(({ name, }) => name === 'AM' || name === 'PM')
            )
            || this.availabilityType === 'available'
          ) {
            this.selectedShifts.splice(index, 1)
          }

        } else {
          this.selectedShifts.splice(index, 1)
        }

        const wholeDayIndex = this.selectedShifts.findIndex(({ name, }) => name === 'Whole Day')

        if (
          (shift.name === 'AM' || shift.name === 'AM')
          && this.availabilityType === 'available'
          && wholeDayIndex > -1
        ) {
          this.selectedShifts.splice(wholeDayIndex, 1)
        } 
      } else {
        this.selectedShifts.push(shift)

        this.addWholeDayIfAmAndPm()
      }
    },

    addWholeDayIfAmAndPm () {
      if (
        (
          this.selectedShifts.some(({ name, }) => name === 'AM' || name === 'PM')
          && !this.selectedShifts.some(({ name, }) => name === 'Whole Day')
          && this.availabilityType === 'unavailable'
        )
        ||         (
          this.selectedShifts.some(({ name, }) => name === 'AM')
          && this.selectedShifts.some(({ name, }) => name === 'PM')
          && !this.selectedShifts.some(({ name, }) => name === 'Whole Day')
          && this.availabilityType === 'available'
        )
      ) {
        const wholeDayShift = this.shifts.find(({ name, }) => name === 'Whole Day')

        if (wholeDayShift) {
          this.selectedShifts.push(wholeDayShift)
        }
      }
      

      if (
        this.availabilityType === 'available'
        && this.selectedShifts.some(({ name, }) => name === 'Whole Day')
        && !this.selectedShifts.some(({ name, }) => name === 'PM')
      ) {
        const pmShift = this.shifts.find(({ name, }) => name === 'PM')

        if (pmShift) {
          this.selectedShifts.push(pmShift)
        }
      }
      

      if (
        this.availabilityType === 'available'
        && this.selectedShifts.some(({ name, }) => name === 'Whole Day')
        && !this.selectedShifts.some(({ name, }) => name === 'AM')
      ) {
        const amShift = this.shifts.find(({ name, }) => name === 'AM')

        if (amShift) {
          this.selectedShifts.push(amShift)
        }
      }
    },

    updateUnavailabilities () {
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

      // if (this.selectedShifts.length === 0) {
      //   this.formError.push({
      //     message: 'Shifts is required',
      //     field: 'shift_id',
      //     validation: 'required',
      //   })
      // }

      if (this.formError.length > 0) {
        this.$nextTick(() => {
          this.$refs.modalContainer.scrollTop = 0
        })
        
        // this.$store.commit("SET_NOTIFICATION", {
        // 	enabled: true,
        // 	status: "danger",
        // 	text: ["Please fill up all the forms"]
        // });
        return
      }

      const selectedShiftIds = this.selectedShifts.map(({ id, }) => id)

      const notSelectedShiftIds = this.shifts
        .map(({ id, }) => id)
        .filter(id => selectedShiftIds.indexOf(id) === -1)

      this.loading = true
      this.$axios
        .post(`/api/v1/locum/unavailabilities`, {
          date_start: this.date_start,
          date_end: this.date_end,
          shift_id: this.availabilityType === 'unavailable'
            ? selectedShiftIds
            : notSelectedShiftIds,
        })
        .then(response => {
          this.$store.commit("jobs/ADD_OR_UPDATE_LOCUM_UNAVAILABILITIES", response.data.data.unavailabilities)

          const message = this.availabilityType === 'unavailable'
            ? 'Unavailability Created Successfully'
            : this.availabilityType === 'available'
              ? 'Availability Created Successfully'
              : response.data.message

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${message}`,],
          })

          this.$router.push('/availability')
        })
        .catch(err => {
          err.response.data.error_messages.forEach(error => {
            this.formError.push(error)
          })

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: this.formError.map(error => error.message),
          })
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
