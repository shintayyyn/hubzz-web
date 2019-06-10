<template>
  <section>
    <div class="flex flex-row flex-nowrap absolute justify-start pin-t pin-l w-full">
      <span
        v-if="hasUnavailableDate(item.fullDate, 'AM')"
        class="bg-pink-light text-pink-light w-full h-2 sm:h-3 lg:h-4 rounded-tl-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'PM')"
        class="bg-pink-light text-pink-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'Whole Day')"
        class="bg-pink-light text-pink-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'OOH')"
        class="bg-pink-light text-pink-light w-full h-2 sm:h-3 lg:h-4 rounded-tr-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ['unavailabilities', 'item'],
  methods: {
    hasUnavailableDate(date, type) {
      return this.unavailabilities.find(item => item.date === date && item.shifts.find(shift => shift.name === type))
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
