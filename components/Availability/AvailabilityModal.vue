<template>
  <!-- class="absolute pin-r pin-t p-10 bg-white shadow-lg"
    style="height:1500px"
  :style="$store.state.mobile ? 'width:100%' : 'width:80%'"-->
  <div>
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>

    <div class="font-bold text-lg my-5" style="font-family: Nunito">Availability</div>
    <div class="w-full lg:w-5/6 border-solid rounded-lg shadow-lg p-5">
      <div class="text-sm font-bold">I won't be available for...</div>
      <div class="mt-3 text-sm">On this date</div>
      <div
        class="font-bold text-xl mt-4"
      >{{$moment($store.state.availability.select_date).format('ddd DD MMMM YYYY')}}</div>
      <div class="flex flex-row flex-wrap justify-between mt-4">
        <div class="text-sm xl:text-base">On these shifts</div>
        <div
          class="text-sm xl:text-base px-1 border-solid rounded-lg bg-grey-light"
        >Select all that apply. Shifts that are already booked are greyed-out.</div>
      </div>
      <div class="flex flex-row flex-wrap justify-start mt-4">
        <div
          v-for="(item, index) in shifts"
          :key="index"
          :class="[selectedShifts.includes(item.value) ? 'bg-yellow': '', item.value === disabledShift ? 'bg-grey-light text-grey-dark':'cursor-pointer hover:bg-yellow']"
          class="border border-solid rounded-lg px-8 py-5 m-2 text-sm xl:text-base"
          @click.prevent="select(item.value)"
        >{{item.label}}</div>
      </div>

      <div class="mt-4">
        <button
          class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
          @click.prevent="save"
        >Save</button>
      </div>
    </div>
  </div>
</template>
<script>
const shifts = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
  { value: 'WHOLE DAY', label: 'Whole day' },
  { value: 'OOH', label: 'OOH' },
]
export default {
  data() {
    return {
      shifts,
      selectedShifts: [],
      disabledShift: ''
    }
  },
  computed: {
    appointmentDates() {
      return this.$store.state.dashboard.appointmentDates
    },
    unavailableDates() {
      return this.$store.state.availability.unavailableDates
    },
  },
  created() {
    // check if this selected date is already in not available date
    let item = this.unavailableDates.find(item => item.date === this.$moment(this.$store.state.availability.select_date).format('LL'))
    if (item && item.date) {
      // get the selected shifts on this item
      item.shifts.forEach(shift => {
        this.selectedShifts.push(shift)
      })
    }
    // check if there is an appointment date based on the selected date
    let appointment = this.appointmentDates.find(appointment => this.getDateArray(appointment.from, appointment.to).includes(this.$moment(this.$store.state.availability.select_date).format('YYYY-MM-DD')))
    // disabled the shift based on the appointment date selected shifts
    if (appointment && appointment.shifts) {
      this.disabledShift = appointment.shifts
    }
  },
  methods: {
    select(shift) {
      if (shift === this.disabledShift) {
        return
      }
      if (this.selectedShifts.includes(shift)) {
        let index = this.selectedShifts.findIndex(item => item === shift)
        this.selectedShifts.splice(index, 1)
      } else {
        this.selectedShifts.push(shift)
      }
    },
    save() {
      // post request to API
      // pass the selected date and shifts
      if (this.selectedShifts.length > 0) {
        this.$store.commit('availability/SET_NOT_AVAILABLE_DATE',
          { selectedDate: this.$moment(this.$store.state.availability.select_date).format('LL'), selectedShifts: this.selectedShifts }
        )
      } else {
        // pass the selected date on remove
        this.$store.commit('availability/REMOVE_NOT_AVAILABLE_DATE', this.$moment(this.$store.state.availability.select_date).format('LL'))
      }
      document.body.style.overflow = 'auto'
      this.$store.commit('TOGGLE_AVAILABILITY_MODAL', false)
    },
    validateAvailabilityDates(dates, shifts) {

    },
    getDateArray(startDate, stopDate) {
      var dateArray = [];
      var currentDate = this.$moment(startDate);
      var stopDate = this.$moment(stopDate);
      while (currentDate <= stopDate) {
        dateArray.push(this.$moment(currentDate).format('YYYY-MM-DD'))
        currentDate = this.$moment(currentDate).add(1, 'days');
      }
      return dateArray;
    },
    close() {
      this.$store.commit('TOGGLE_AVAILABILITY_MODAL', false)
    }
  }
}
</script>
