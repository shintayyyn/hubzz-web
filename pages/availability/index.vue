<template>
  <section class="availability-section">
    <div class="text-base md:text-lg font-bold">
      I'm available for...
    </div>
    <div class="availability-shift rounded-lg shadow-lg mt-5">
      <div class="relative w-full p-5">
        <AppLoading :loading="loading" spinner />
        <div class="flex flex-col">
          <div class="flex flex-row flex-wrap items-center justify-between">
            <div class="flex flex-col leading-none">
              <div class="text-base md:text-lg mr-2">
                The shifts I am available for
                <span class="text-red-500">*</span>
              </div>
              <transition name="fade">
                <div
                  v-if="shifts_error"
                  class="text-red-500 text-sm md:text-base text-white md:py-0"
                >
                  Select at least one shift
                </div>
              </transition>
            </div>
            <div
              class="py-2 px-3 my-1 md:my-0 rounded-lg text-base md:text-lg bg-gray-300 leading-tight"
            >
              Select all that apply
            </div>
          </div>
          <div
            class="flex flex-row justify-around md:justify-between flex-wrap mt-5 rounded-lg"
            :class="shifts_error && 'error'"
          >
            <div
              v-for="item in shifts"
              :key="item.id"
              class="relative border border-solid rounded-lg p-2 md:p-5 m-2 w-full sm:w-1/4 md:w-1/6 text-sm md:text-base text-center cursor-pointer transition-hover"
              :class="[selectedShifts.includes(item.id) ? 'bg-yellow-500 hover:bg-yellow-400': 'hover:bg-yellow-500', shifts_error ? 'border-red-500' : '']"
              style="box-sizing:content-box;"
              @click="select(item.id)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <div class="mx-2 mt-4">
          <AppButton
            :label="'Update'"
            :disabled="loading"
            style="padding: 8px 16px;"
            @click="update"
          />
        </div>
      </div>
    </div>

    <template v-if="['Active', 'Dormant'].includes($auth.user.status)">
      <div class="mt-5">
        <div class="text-base md:text-lg font-bold">
          When I won't be available
        </div>
        <div
          class="text-sm md:text-base"
        >
          Add a date range from the + button below or click on a date to add or remove
        </div>
      </div>
      <div class="mt-4 mb-12">
        <div class="availability-calendar relative rounded-lg shadow-lg p-5">
          <AvailabilityCalendar />
          <div class="absolute bottom-0 right-0 -my-2 -mx-1 md:-m-6">
            <nuxt-link :to="'/availability/create'">
              <div
                class="rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-2xl sm:text-3xl md:text-4xl flex items-center focus:outline-none justify-center bg-yellow-500 font-semibold cursor-pointer shadow-md hover:text-white"
              >
                +
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <nuxt-link :to="'/availability'">
          <transition name="fade" mode="out-in">
            <div
              v-if="['availability-id','availability-create'].includes($route.name)"
              class="shield"
            />
          </transition>
        </nuxt-link>
      </transition>
      <nuxt-child
        :selectedDate="selectedDate"
        :unavailableDate="unavailableDate"
        :allocatedDate="allocatedDate"
        :ongoingDate="ongoingDate"
      />
    </template>
  </section>
</template>

<script>
import AvailabilityCalendar from "@/components/Availability/AvailabilityCalendar"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"

export default {
  components: {
    AvailabilityCalendar,
    AppLoading,
    AppButton,
  },

  data () {
    return {
      loading: false,
      selectedShifts: [],
      shifts: [],
      shifts_error: false,

      modal: false,
      type: "",
      selectedDate: null,
      unavailableDate: null,
      allocatedDate: null,
      ongoingDate: null,
    }
  },

  watch: {
    "$route.name" (value) {
      if (["availability-id", "availability-create",].includes(value)) {
        document.body.style.overflow = "hidden"
      } else if (!["availability-id", "availability-create",].includes(value)) {
        document.body.style.overflow = "auto"
      }
    },

    selectedShifts (value) {
      if (value.length >= 1) {
        this.shifts_error = false
      }
    },
  },

  async asyncData ({ app, store, }) {
    store.commit("availability/SET_DATE_TODAY")

    try {
      const [selectedShifts, shifts,] = await Promise.all([
        app.$axios.$get(`/api/v1/me`).then(res => {
          const selectedShifts = res.data.user.locum_detail.shifts.map(
            shift => shift.id
          )

          return selectedShifts
        }),
        app.$axios.$get(`/api/v1/shifts`).then(res => {
          const shifts = res.data.shifts.sort((a, b) => a.id - b.id)

          return shifts
        }),
      ])

      return {
        selectedShifts,
        shifts,
      }
    } catch (err) {
      console.log("err", err)
      if (err.response.data.message) {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${err.response.data.message}`,],
        })
      }
      throw err
    }
  },

  methods: {
    select (id) {
      let shiftId = this.selectedShifts.find(item => item === id)
      if (!shiftId) {
        this.selectedShifts.push(id)
      } else {
        let shiftIndex = this.selectedShifts.findIndex(item => item === id)
        this.selectedShifts.splice(shiftIndex, 1)
      }
    },

    update () {
      this.shifts_error = false

      // if (this.selectedShifts.length === 0) {
      // 	this.shifts_error = true;
      // } else {
      this.loading = true
      this.shifts_error = false
      this.$axios
        .$put(`/api/v1/locum/me/shifts`, { shift_id: this.selectedShifts, })
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: ["Shift updated!",],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`,],
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
      // }
    },
    // add() {
    //   this.unavailableDate = null;
    //   this.appointmentDate = null;
    //   document.body.style.overflow = "hidden";
    //   this.type = "range";
    //   this.modal = true;
    // }
    // open({ selectedDate, unavailableDate, allocatedDate, ongoingDate }) {
    //   this.selectedDate = selectedDate;
    //   this.unavailableDate = unavailableDate;
    //   this.allocatedDate = allocatedDate;
    //   this.ongoingDate = ongoingDate;
    //   this.$router.push({
    //     path: `/availability/${selectedDate}`
    //   });
    // }
  },
}
</script>

<style scoped>
  .availability-shift {
    max-width: 800px;
  }

  .availability-calendar {
    height: auto;
    max-width: 800px;
  }

  @media screen and (min-width: 568px) {
    .availability-calendar {
      height: 450px;
    }
  }

  @media screen and (min-width: 768px) {
    .availability-calendar {
      height: auto;
    }
  }

  .shield {
    z-index: 509;
  }

  /* .modal-container {
    z-index: 510;
  }

  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 80%;
    }
  } */
</style>

