<template>
  <div class="rounded-r-lg appointment-section h-full">
    <div
      class="text-white text-xs xl:text-base py-4 px-8"
    >{{$moment(selectedDate).format('Do MMM, YYYY')}}</div>

    <div
      v-if="$store.state.dashboard.appointments_tab === 'per_month' && getAppointmentsPerMonth && getAppointmentsPerMonth.length > 0"
      class="flex flex-col overflow-y-auto px-8 h-full"
      style="height:400px"
    >
      <div
        class="relative rounded-lg py-3 px-5 my-1 bg-white info-card cursor-pointer hover:bg-grey-lighter"
        v-for="(item, index) in getAppointmentsPerMonth"
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

    <div
      v-if="$store.state.dashboard.appointments_tab === 'per_week' && getAppointmentsPerWeek"
      class="flex flex-col overflow-y-auto px-8 h-full"
      style="height:400px"
    >
      <div
        class="relative rounded-lg py-3 px-5 my-1 bg-white info-card cursor-pointer hover:bg-grey-lighter"
        @click="edit(getAppointmentsPerWeek)"
      >
        <div
          class="absolute pin-l pin-t rounded-l-lg p-2 h-full"
          :class="checkShift(getAppointmentsPerWeek.shifts)"
        ></div>
        <div class="ml-2">
          <div
            class="text-grey-dark text-xs xl:text-sm"
          >Job Number: {{getAppointmentsPerWeek.job_number}}</div>
          <div class="my-3 font-bold text-sm xl:text-md">Private appointment</div>
          <div class="my-3 text-sm xl:text-md">{{getAppointmentsPerWeek.practice.name}}</div>
          <div
            class="my-3 text-sm xl:text-md"
          >{{getAppointmentsPerWeek.practice.address.line_3}}, {{getAppointmentsPerWeek.practice.address.post_code}}</div>
          <div
            class="text-xs text-grey-dark mt-1"
          >From {{$moment(getAppointmentsPerWeek.from).format('DD/MM/YYYY')}} to {{$moment(getAppointmentsPerWeek.to).format('DD/MM/YYYY')}}</div>
          <div class="text-xs text-grey-dark mt-1">Shift: {{getAppointmentsPerWeek.shifts}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    selectedDate() {
      return this.$store.state.dashboard.select_date
    },
    selectedShift() {
      return this.$store.state.dashboard.select_shift
    },
    // get all appointments base on selected date or per month pov
    getAppointmentsPerMonth() {
      return this.$store.getters['dashboard/getAppointmentsPerMonth']
    },
    // get all appointments base on selected date on per week pov
    getAppointmentsPerWeek() {
      return this.$store.getters['dashboard/getAppointmentsPerWeek']
    },
    unavailableDates() {
      return this.$store.state.availability.unavailableDates
    },
    // unavailable() {
    //   let unavailable = this.unavailableDates.find(date => date.date === this.selectedDate)
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
    //   let unavailableOnWeek = this.unavailableDates.find(data => data.date === this.selectedWeekDate && data.shifts.includes(this.selectedWeekDateType))
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


