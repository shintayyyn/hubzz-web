<template>
  <div
    class="absolute pin-r pin-t z-10 p-10 bg-white shadow-lg"
    style="height:1500px"
    :style="$store.state.mobile ? 'width:100%' : 'width:90%'"
  >
    <div @click="$store.commit('TOGGLE_AVAILABILITY_RANGE_MODAL', false)" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="font-bold text-lg my-5" style="font-family: Nunito">Availability</div>
    <div class="w-full lg:w-5/6 border-solid rounded-lg shadow-lg p-5">
      <div class="text-sm font-bold">I won't be available...</div>
      <div class="relative flex flex-row flex-wrap">
        <div class="w-full lg:w-1/2 px-3">
          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="from" class="text-sm">From</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-grey-light"
                style="width:100%"
                :class="[setFocus === 'from' ? 'border-yellow':'', formError.find(item => item.field === 'from') ? 'border-red':'']"
              >
                <input
                  type="date"
                  ref="from"
                  class="focus:outline-none font-bold text-sm text-center"
                  style="height:40px;"
                  @focus="setFocus = 'from'"
                  @blur="setFocus = ''"
                  v-model="form.from"
                  :min="$moment().format('YYYY-MM-DD')"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
              v-if="formError.find(item => item.field === 'from')"
            >{{formError.find(item => item.field === 'from').message}}</div>
          </div>
        </div>
        <div class="w-full lg:w-1/2 px-3">
          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="to" class="text-sm">To</label>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div
                class="flex flex-col border-b-2 border-grey-light"
                style="width:100%"
                :class="[setFocus === 'to' ? 'border-yellow':'', formError.find(item => item.field === 'to') ? 'border-red':'']"
              >
                <input
                  type="date"
                  ref="to"
                  class="focus:outline-none font-bold text-sm text-center"
                  style="height:40px;"
                  @focus="setFocus = 'to'"
                  @blur="setFocus = ''"
                  v-model="form.to"
                  :min="$moment().format('YYYY-MM-DD')"
                >
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1 text-xs xl:text-base"
              v-if="formError.find(item => item.field === 'to')"
            >{{formError.find(item => item.field === 'to').message}}</div>
          </div>
        </div>
      </div>
      <div class="text-sm xl:text-base mt-4">
        On these shifts
        <span
          class="inline-block rounded-lg bg-grey-light px-2 py-1"
        >Select all that apply</span>
      </div>
      <div class="flex flex-row flex-wrap justify-start mt-4">
        <div
          v-for="(item, index) in shifts"
          :key="index"
          class="border border-solid rounded-lg px-8 py-5 m-2 text-sm xl:text-base cursor-pointer"
          :class="selectedShifts.includes(item.id) ? 'bg-yellow':'hover:bg-yellow'"
          @click.prevent="select(item.id)"
        >{{item.name}}</div>
      </div>
    </div>
    <div class="mt-4">
      <button
        class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg"
        @click.prevent="add"
      >Add</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        from: null,
        to: null
      },
      selectedShifts: [],
      setFocus: '',
      formError: [],
      errorMessage: '',
      shifts: [],
    }
  },
  computed: {
    unavailableDates() {
      return this.$store.state.availability.unavailableDates
    },
    appointmentDates() {
      return this.$store.state.dashboard.appointmentDates
    }
  },
  created() {
    // get all shifts
    this.$axios
      .$get(`/api/v1/shifts`)
      .then(res => {
        res.data.shifts.forEach(item => {
          this.shifts.push({ id: item.id, name: item.name })
        })
      })
  },
  methods: {
    select(shift) {
      if (this.selectedShifts.includes(shift)) {
        let index = this.selectedShifts.findIndex(item => item === shift)
        this.selectedShifts.splice(index, 1)
      } else {
        this.selectedShifts.push(shift)
      }
    },
    add() {
      this.formError = []
      this.errorMessage = ''
      this.Validate(this.form)
      // this.ValidateDate(this.form.from, this.form.to)
      let dates = this.getDateArray(this.form.from, this.form.to)
      if (this.$store.state.dashboard.appointmentDates.length > 0) {
        console.log(this.$store.stat.dashboard.appointmentDates)
      } else {
        // get all the date from form.from to form.to
        let dates = this.getDateArray(this.form.from, this.form.to)
        // loop - check if the date is already in the unavailableDates array
        let unavailableDates = this.$store.state.availability.unavailableDates
        console.log(dates)
        console.log(unavailableDates)
        if (unavailableDates.length > 0) {
          unavailableDates.forEach(notAvailable => {
            dates.forEach(date => {
              // if same date, update
              if (this.$moment(notAvailable.date).format('YYYY-MM-DD') === date) {
                // ! asd
              }
            })
          })
        } else {
          // add
        }
      }
      if (!this.formError.length) {
      }
      // while (currentDate <= stopDate) {
      //   dateRange.push(this.$moment(currentDate)._d)
      //   currentDate = this.$moment(currentDate).add(1, 'days');
      // }
      // dateRange.forEach(date => {
      //   this.$store.commit('availability/setSelectedDate', date)
      //   this.$store.commit('availability/setNotAvailableDate', this.selectedShifts)
      // })

      // this.$store.commit('TOGGLE_AVAILABILITY_RANGE_MODAL', false)
      //   this.$store.commit('availability/setNotAvailableDateRange', {dateRange: dateRange, shifts: this.selectedShifts})
    },
    validateAppointmentDates(newDates, newShift) {
      let hasError = false
      // get all the old appointments from api/store excluding the present one
      let oldAppointmentFromAPI = this.$store.state.dashboard.appointmentDates.filter(item => item.job_number !== this.form.job_number)
      oldAppointmentFromAPI.forEach(oldAppointment => {
        // get the span date of each old appointment
        let oldDates = this.getDateArray(oldAppointment.from, oldAppointment.to)
        // and their shifts
        let oldShift = oldAppointment.shifts
        // validate
        newDates.forEach(newDate => {
          oldDates.forEach(oldDate => {
            // if the old date and new date is same and either of the appointment has a whole day shift return err
            if (oldDate === newDate && (oldShift === 'WHOLE DAY' || newShift === 'WHOLE DAY')) {
              hasError = true
            }
            if (oldDate === newDate && oldShift === newShift) {
              hasError = true
            }
          })
        })
      })
      if (hasError) {
        this.errorMessage = "Dates on your appointment clash with your other appointments"
        this.formError.push(
          { field: 'from', message: 'Conflict Dates', validation: 'conflict' },
          { field: 'to', message: 'Conflict Dates', validation: 'conflict' },
          { field: 'shift', message: 'Conflict Dates', validation: 'conflict' }
        )
      }
    },
    getDateArray(start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format('YYYY-MM-DD'));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    },
  }
}
</script>
