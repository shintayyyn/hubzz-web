<template>
  <section>
    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start w-full">
      <span
        v-if="notAvailableDates.find(date => date.from === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
        class="bg-pink-light text-pink-light w-full rounded-tl-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="notAvailableDates.find(date => date.from === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
        class="bg-pink-light text-pink-light w-full"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="notAvailableDates.find(date => date.from === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
        class="bg-pink-light text-pink-light w-full"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="notAvailableDates.find(date => date.from === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
        class="bg-pink-light text-pink-light w-full rounded-tr-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
    </div>
    <div class="flex flex-row flex-no-wrap absolute pin-b pin-r justify-start w-full">
      <span
        v-if="hasAppointment($moment(item.fullDate).format('YYYY-MM-DD'), 'AM')"
        class="bg-yellow text-yellow w-full rounded-bl-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="hasAppointment($moment(item.fullDate).format('YYYY-MM-DD'), 'PM')"
        class="bg-blue-light text-blue-light w-full"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="hasAppointment($moment(item.fullDate).format('YYYY-MM-DD'), 'WHOLE DAY')"
        class="bg-green-light text-green-light w-full"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="hasAppointment($moment(item.fullDate).format('YYYY-MM-DD'), 'OOH')"
        class="bg-orange text-orange w-full rounded-br-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ['notAvailableDates', 'appointmentDates', 'item'],
  methods: {
    hasAppointment(date, type) {
      return this.appointmentDates.find(appointment => this.getDateArray(appointment.from, appointment.to).includes(date) && appointment.shifts === type)
    },
    getDateArray(start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format('YYYY-MM-DD'));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    }
  }
}
</script>
