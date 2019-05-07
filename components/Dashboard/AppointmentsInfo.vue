<template>
  <div class="rounded-r-lg appointment-section h-full">
    <div
      class="text-white text-xs xl:text-base py-4 px-8"
    >{{$moment(selectedDate).format('Do MMM, YYYY')}}</div>
    <!-- <template v-if="$store.state.dashboard.appointments_tab === 'per_month'">
      <transition-group name="slide-info" mode="out-in">
        <div
          class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card"
          v-if="appointmentDates"
          key="appointment"
        >
          <div
            class="absolute pin-l pin-t rounded-l-lg p-2 h-full"
            :class="checkShift(appointmentDates.shifts)"
          ></div>
          <div class="ml-2">
            <div class="text-grey-dark text-xs xl:text-base"></div>
            <div class="my-3 font-bold text-md">Private appointment</div>
            <div class="my-3 text-md">Practice name here</div>
            <div class="my-3 text-md">Practice address here</div>
            <div
              class="text-xs text-grey-dark mt-1"
            >From {{$moment(appointmentDates.date).format('DD/MM/YYYY')}} to {{$moment(appointmentDates.date).format('DD/MM/YYYY')}}</div>
            <div class="text-xs text-grey-dark mt-1">Shift: {{appointmentDates.shifts[0]}}</div>
          </div>
        </div>
        <div
          class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card"
          v-if="unavailable"
          key="available"
        >
          <div class="absolute pin-l pin-t bg-pink-light rounded-l-lg p-2 h-full"></div>
          <div class="ml-2">
            <div class="font-bold text-sm">Unavailable</div>
            <div class="text-xs mt-1">Shifts: {{unavailable.join(',')}}</div>
          </div>
        </div>// ! fix later
        <div v-if="false" key="unavailable">
          <div class="text-white text-sm mt-10">No Jobs to display.</div>
        </div>
      </transition-group>
    </template>-->

    <div
      v-if="$store.state.dashboard.appointments_tab === 'per_month' && getAppointments.length > 0"
      class="flex flex-col overflow-y-auto px-8 h-full"
      style="height:400px"
    >
      <div
        class="relative rounded-lg py-3 px-5 my-1 bg-white info-card cursor-pointer hover:bg-grey-lighter"
        v-for="(item, index) in getAppointments"
        :key="`${item}-${index}`"
        @click="edit(item)"
      >
        <div class="absolute pin-l pin-t rounded-l-lg p-2 h-full" :class="checkShift(item.shifts)"></div>
        <div class="ml-2">
          <div class="text-grey-dark text-xs xl:text-sm">Job Number: {{item.job_number}}</div>
          <div class="my-3 font-bold text-sm xl:text-md">Private appointment</div>
          <div class="my-3 text-sm xl:text-md">{{item.practice.name}}</div>
          <div
            class="my-3 text-sm xl:text-md"
          >{{item.practice.address.line_3}}, {{item.practice.address.post_code}}</div>
          <div
            class="text-xs text-grey-dark mt-1"
          >From {{$moment(item.from).format('DD/MM/YYYY')}} to {{$moment(item.to).format('DD/MM/YYYY')}}</div>
          <div class="text-xs text-grey-dark mt-1">Shift: {{item.shifts}}</div>
        </div>
      </div>
    </div>

    <!-- <template v-if="$store.state.dashboard.appointments_tab === 'per_week'">
      <transition-group name="slide-info" mode="out-in">
        <div
          class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card"
          v-if="appointmentDatesOnWeek"
          key="appointment"
        >
          <div
            class="absolute pin-l pin-t rounded-l-lg p-2 h-full"
            :class="checkShift(appointmentDatesOnWeek.shifts[0])"
          ></div>
          <div class="ml-2">
            <div class="text-grey-dark text-xs">Job Number here:</div>
            <div class="my-3 font-bold text-md">Private appointment</div>
            <div class="my-3 text-md">Practice name here</div>
            <div class="my-3 text-md">Practice address here</div>
            <div
              class="text-xs text-grey-dark mt-1"
            >From {{$moment(appointmentDatesOnWeek.date).format('DD/MM/YYYY')}} to {{$moment(appointmentDatesOnWeek.date).format('DD/MM/YYYY')}}</div>
            <div class="text-xs text-grey-dark mt-1">Shift: {{appointmentDatesOnWeek.shifts[0]}}</div>
          </div>
        </div>

        <div
          class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card"
          v-if="unavailableOnWeek"
          key="available"
        >
          <div class="absolute pin-l pin-t bg-pink-light rounded-l-lg p-2 h-full"></div>
          <div class="ml-2">
            <div class="font-bold text-sm">Unavailable</div>
            <div class="text-xs mt-1">Shifts: {{unavailableOnWeek}}</div>
          </div>
        </div>

        <div v-if="false" key="unavailable">
          <div class="text-white text-sm mt-10">No Jobs to display.</div>
        </div>
      </transition-group>
    </template>-->
  </div>
</template>
<script>
export default {
  computed: {
    selectedDate() {
      return this.$store.state.dashboard.select_date
      // return this.$moment(this.$store.state.dashboard.select_date).format('LL')
    },
    // get all appointments base on selected date
    getAppointments() {
      return this.$store.getters['dashboard/getAppointments']
    },
    notAvailableDates() {
      return this.$store.state.availability.notAvailableDates
    },
    // unavailable() {
    //   let unavailable = this.notAvailableDates.find(date => date.date === this.selectedDate)
    //   if (!unavailable) {
    //     return null
    //   }
    //   return unavailable.shifts
    // },
    // selectedWeekDateType() {
    //   return this.$store.state.dashboard.week_date_type
    // },
    // appointmentDatesOnWeek() {
    //   return this.$store.state.dashboard.appointmentDates.find(data => data.date === this.selectedWeekDate)
    // },
    // unavailableOnWeek() {
    //   let unavailableOnWeek = this.notAvailableDates.find(data => data.date === this.selectedWeekDate && data.shifts.includes(this.selectedWeekDateType))
    //   if (!unavailableOnWeek) {
    //     return null
    //   }
    //   return unavailableOnWeek.shifts.find(item => item === this.selectedWeekDateType)
    // }
  },
  mounted() {
    // ! work on unavailable shifts arrangement
  },
  methods: {
    edit(item) {
      this.$store.commit('dashboard/SET_EDIT_APPOINTMENT_DATE', item)
      this.$store.commit('TOGGLE_APPOINTMENT_MODAL', true)
    },
    checkShift(type) {
      if (type === 'AM') {
        return 'bg-yellow'
      }
      if (type === 'PM') {
        return 'bg-blue-light'
      }
      if (type === 'WHOLE DAY') {
        return 'bg-green-light'
      }
      if (type === 'OOH') {
        return 'bg-orange'
      }
    }
  }
}
</script>
<style scoped>
.slide-info-enter-active,
.slide-info-leave-active {
  transition: all 0.1s ease-in-out;
}
.slide-info-enter,
.slide-info-leave-to {
  transform: translateX(10px);
}
.appointment-section {
  background-image: url("/images/hubzz-bg.png");
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: lightgrey;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>


