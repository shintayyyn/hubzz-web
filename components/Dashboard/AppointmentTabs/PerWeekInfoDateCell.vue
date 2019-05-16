<template>
  <div>
    <div
      v-if="hasAppointment(date, shift)"
      class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-yellow hover:bg-grey-light"
      @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: shift})"
    >www</div>
    <div
      v-else-if="isToday(date)"
      class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-grey-light hover:bg-grey-light"
      @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: shift})"
    >qqq</div>
    <div
      v-else
      class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
      @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: shift})"
    >qwe</div>
  </div>
</template>
<script>
export default {
  props: ['date', 'unavailableDates', 'appointmentDates', 'shift'],
  data() {
    shift: ''
  },
  mounted() {
    this.shift = this.shift
    console.log(this.date)
    console.log(this.appointmentDates)
  },
  methods: {
    hasAppointment(date, shift) {
      return this.appointmentDates.find(appointment => this.getDateArray(appointment.from, appointment.to).includes(this.$moment(this.date).format('YYYY-MM-DD')) && appointment.shifts === shift)
    },
    isToday(date) {
      if (this.$moment(date).format('YYYY-MM-DD') === this.$moment(new Date()).format('YYYY-MM-DD')) {
        return true
      } else {
        return false
      }
    },
    checkShift(item) {
      if (item && item.shifts.length) {
        let type = item.shifts[0]
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
