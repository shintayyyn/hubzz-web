<template>
  <section>
    <!-- <div class="flex flex-row flex-nowrap absolute pin-l w-full">
      <span v-if="hasAppliedJobs(item.fullDate)" class="bg-grey w-1/4 h-1 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-t pin-r justify-start w-full"
      v-if="jobs.length > 0"
    >
      <span
        v-if="hasJobs(item.fullDate, 'AM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-tl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasJobs(item.fullDate, 'PM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasJobs(item.fullDate, 'Whole day')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasJobs(item.fullDate, 'OOH')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-tr-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-r justify-start w-full"
      v-if="unfilled_jobs.length > 0"
    >
      <span
        v-if="hasUnfilledJobs(item.fullDate, 'AM')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasUnfilledJobs(item.fullDate, 'PM')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasUnfilledJobs(item.fullDate, 'Whole day')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasUnfilledJobs(item.fullDate, 'OOH')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-r justify-start w-full"
      v-if="declined_jobs.length > 0"
    >
      <span
        v-if="hasDeclinedJobs(item.fullDate, 'AM')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasDeclinedJobs(item.fullDate, 'PM')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasDeclinedJobs(item.fullDate, 'Whole day')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasDeclinedJobs(item.fullDate, 'OOH')"
        class="bg-red-light text-red-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>-->
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="locum_private_jobs.length > 0"
    >
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'AM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'PM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'Whole Day')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'OOH')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="locum_current_jobs.length > 0"
    >
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'AM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'PM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'Whole day')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'OOH')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="locum_applied_jobs.length > 0"
    >
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'AM')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'PM')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'Whole day')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'OOH')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-t pin-l justify-start w-full"
      v-if="locum_unavailabilities.length > 0"
    >
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'AM')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4 rounded-tl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'PM')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'Whole Day')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'OOH')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4 rounded-tr-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: [
    'locum_private_jobs', 'locum_current_jobs', 'locum_applied_jobs', 'locum_unavailabilities',
    'item',
  ],
  methods: {
    // practice
    hasJobs(date, type) {
      // return this.jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasAppliedJobs(date) {
      // return this.applied_jobs.find(job => job.platform_job.selection_date === date)
    },
    hasUnfilledJobs(date, type) {
      // return this.unfilled_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasDeclinedJobs(date, type) {
      // return this.declined_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    // locum
    hasLocumPrivateJobs(date, type) {
      return this.locum_private_jobs.find(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date) && job.private_job.shift.name === type)
    },
    hasLocumCurrentJobs(date, type) {
      return this.locum_current_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasLocumAppliedJobs(date, type) {
      return this.locum_applied_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasLocumUnavailabilities(date, type) {
      return this.locum_unavailabilities.find(job => job.date === date && job.shifts.find(shift => shift.name === type))
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