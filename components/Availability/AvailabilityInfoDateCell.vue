<template>
  <section>
    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start w-full">
      <span
        v-if="isNotAvailable(item.fullDate, 'AM')"
        class="bg-pink-light text-pink-light w-full rounded-tl-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="isNotAvailable(item.fullDate, 'PM')"
        class="bg-pink-light text-pink-light w-full"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="isNotAvailable(item.fullDate, 'WHOLE DAY')"
        class="bg-pink-light text-pink-light w-full"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="isNotAvailable(item.fullDate, 'OOH')"
        class="bg-pink-light text-pink-light w-full rounded-tr-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
    </div>
    <div class="flex flex-row flex-no-wrap absolute pin-b pin-r justify-start w-full">
      <span
        v-if="hasAppointment(item.fullDate, 'AM')"
        class="bg-grey text-grey w-full rounded-bl-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
      <span v-if="hasAppointment(item.fullDate, 'PM')" class="bg-grey text-grey w-full">.</span>
      <span v-else class="w-full text-white"></span>
      <span v-if="hasAppointment(item.fullDate, 'WHOLE DAY')" class="bg-grey text-grey w-full">.</span>
      <span v-else class="w-full text-white"></span>
      <span
        v-if="hasAppointment(item.fullDate, 'OOH')"
        class="bg-grey text-grey w-full rounded-br-lg"
      >.</span>
      <span v-else class="w-full text-white"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ['appointmentDates', 'notAvailableDates', 'item'],
  methods: {
    isNotAvailable(date, type) {
      return this.notAvailableDates.find(item => item.date === this.$moment(date).format('LL') && item.shifts.includes(type))
    },
    hasAppointment(date, shift) {
      return this.appointmentDates.find(appointment => this.getDateArray(appointment.from, appointment.to).includes(this.$moment(date).format('YYYY-MM-DD')) && appointment.shifts === shift)
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
