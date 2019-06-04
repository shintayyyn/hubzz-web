<template>
  <section>
    <div class="flex flex-row flex-nowrap absolute pin-l w-full">
      <span v-if="hasAppliedJobs(item.fullDate)" class="bg-grey w-1/4 h-1 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-r justify-start w-full"
      v-if="jobs.length > 0"
    >
      <span
        v-if="hasJobs(item.fullDate, 'AM')"
        class="bg-yellow text-yellow w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasJobs(item.fullDate, 'PM')"
        class="bg-blue-light text-blue-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasJobs(item.fullDate, 'WHOLE DAY')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasJobs(item.fullDate, 'OOH')"
        class="bg-orange text-orange w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ['jobs', 'applied_jobs', 'unfilled_jobs', 'declined_jobs', 'item'],
  methods: {
    // practice
    hasJobs(date, type) {
      return this.jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasAppliedJobs(date) {
      return this.applied_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(job.platform_job.selection_date))
    },
    // it returns an array of dates
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
<style scoped>
.info {
  position: absolute;
  left: 0;
  width: 100%;
  padding-top: 100%;
}
</style>