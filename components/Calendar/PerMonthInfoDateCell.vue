<template>
  <section>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="practice_current_jobs.length > 0"
    >
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'AM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'PM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'Whole Day')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'OOH')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="practice_applied_jobs.length > 0"
    >
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'AM')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'PM')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'Whole Day')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'OOH')"
        class="bg-orange-light text-orange-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="practice_unfilled_jobs.length > 0"
    >
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'AM')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'PM')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'Whole Day')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'OOH')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="practice_declined_jobs.length > 0"
    >
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'AM')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'PM')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'Whole Day')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'OOH')"
        class="bg-red text-red w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-l justify-start w-full"
      v-if="practice_applied_jobs_reminder.length > 0"
    >
      <span
        v-if="hasPracticeAppliedJobsReminder(item.fullDate, 'Reminder')"
        class="bg-grey-light text-grey-light w-1/4 h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-l justify-start w-full"
      v-if="practice_available_jobs_reminder.length > 0"
    >
      <span
        v-if="hasPracticeAvailableJobsReminder(item.fullDate, 'Reminder')"
        class="bg-grey-light text-grey-light w-1/4 h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="getLocumAllocatedPrivateJobs.length > 0"
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
      v-if="getLocumAllocatedCurrentJobs.length > 0"
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
      v-if="getLocumAppliedJobs.length > 0"
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
      v-if="getLocumUnavailabilities.length > 0"
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
    'practice_current_jobs', 'practice_applied_jobs', 'practice_unfilled_jobs', 'practice_declined_jobs',
    'practice_applied_jobs_reminder', 'practice_available_jobs_reminder',
    'item',
  ],
  computed: {
    getLocumAllocatedPrivateJobs() {
      return this.$store.getters['jobs/getLocumAllocatedPrivateJobs']
    },
    getLocumAllocatedCurrentJobs() {
      return this.$store.getters['jobs/getLocumAllocatedCurrentJobs']
    },
    getLocumAppliedJobs() {
      return this.$store.getters['jobs/getLocumAppliedJobs']
    },
    getLocumUnavailabilities() {
      return this.$store.getters['jobs/getLocumUnavailabilities']
    },
  },
  methods: {
    // practice
    hasPracticeCurrentJobs(date, type) {
      return this.practice_current_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasPracticeAppliedJobs(date, type) {
      return this.practice_applied_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasPracticeUnfilledJobs(date, type) {
      return this.practice_unfilled_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasPracticeDeclinedJobs(date, type) {
      return this.practice_declined_jobs.find(job => this.$moment(job.platform_job.declined_at).format('YYYY-MM-DD') === date && job.platform_job.shift.name === type)
    },
    hasPracticeAppliedJobsReminder(date, type) {
      return this.practice_applied_jobs_reminder.find(job => job.platform_job.selection_date === date && type === 'Reminder')
    },
    hasPracticeAvailableJobsReminder(date, type) {
      return this.practice_available_jobs_reminder.find(job => job.platform_job.selection_date === date && type === 'Reminder')
    },
    // locum
    hasLocumPrivateJobs(date, type) {
      return this.getLocumAllocatedPrivateJobs.find(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date) && job.private_job.shift.name === type)
    },
    hasLocumCurrentJobs(date, type) {
      return this.getLocumAllocatedCurrentJobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasLocumAppliedJobs(date, type) {
      return this.getLocumAppliedJobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasLocumUnavailabilities(date, type) {
      return this.getLocumUnavailabilities.find(job => job.date === date && job.shifts.find(shift => shift.name === type))
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