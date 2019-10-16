<template>
  <section>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getPracticeAllocatedJobs.length > 0"
    >
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'AM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'PM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'Whole Day')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeCurrentJobs(item.fullDate, 'OOH')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getPracticeAppliedJobs.length > 0"
    >
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'AM')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'PM')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'Whole Day')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAppliedJobs(item.fullDate, 'OOH')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getPracticeUnfilledJobs.length > 0"
    >
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'AM')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'PM')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'Whole Day')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeUnfilledJobs(item.fullDate, 'OOH')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getPracticeDeclinedJobs.length > 0"
    >
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'AM')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'PM')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'Whole Day')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeDeclinedJobs(item.fullDate, 'OOH')"
        class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute left-0 justify-start w-full"
      v-if="getPracticeAppliedJobsReminder.length > 0"
    >
      <span
        v-if="hasPracticeAppliedJobsReminder(item.fullDate, 'Reminder')"
        class="bg-gray-300 text-gray-300 w-1/4 h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute left-0 justify-start w-full"
      v-if="getPracticeAvailableJobsReminder.length > 0"
    >
      <span
        v-if="hasPracticeAvailableJobsReminder(item.fullDate, 'Reminder')"
        class="bg-gray-300 text-gray-300 w-1/4 h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getLocumOngoingJobs.length > 0"
    >
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'AM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'PM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'Whole Day')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'OOH')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getLocumAllocatedPrivateJobs.length > 0"
    >
      <span
        v-if="hasLocumAllocatedPrivateJobs(item.fullDate, 'AM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPrivateJobs(item.fullDate, 'PM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPrivateJobs(item.fullDate, 'Whole Day')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPrivateJobs(item.fullDate, 'OOH')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getLocumAllocatedPlatformJobs.length > 0"
    >
      <span
        v-if="hasLocumAllocatedPlatformJobs(item.fullDate, 'AM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPlatformJobs(item.fullDate, 'PM')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPlatformJobs(item.fullDate, 'Whole day')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPlatformJobs(item.fullDate, 'OOH')"
        class="bg-green-400 text-green-400 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getLocumAppliedJobs.length > 0"
    >
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'AM')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'PM')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'Whole day')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAppliedJobs(item.fullDate, 'OOH')"
        class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute top-0 left-0 justify-start w-full"
      v-if="getLocumUnavailabilities.length > 0"
    >
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'AM')"
        class="bg-pink-500 text-pink-500 w-full h-2 sm:h-3 lg:h-4 rounded-tl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'PM')"
        class="bg-pink-500 text-pink-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'Whole Day')"
        class="bg-pink-500 text-pink-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumUnavailabilities(item.fullDate, 'OOH')"
        class="bg-pink-500 text-pink-500 w-full h-2 sm:h-3 lg:h-4 rounded-tr-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ["item"],
  computed: {
    // practice
    getPracticeAllocatedJobs() {
      return this.$store.getters["jobs/getPracticeAllocatedJobs"];
    },
    getPracticeAppliedJobs() {
      return this.$store.getters["jobs/getPracticeAppliedJobs"];
    },
    getPracticeUnfilledJobs() {
      return this.$store.getters["jobs/getPracticeUnfilledJobs"];
    },
    getPracticeDeclinedJobs() {
      return this.$store.getters["jobs/getPracticeDeclinedJobs"];
    },
    getPracticeAvailableJobsReminder() {
      return this.$store.getters["jobs/getPracticeAvailableJobsReminder"];
    },
    getPracticeAppliedJobsReminder() {
      return this.$store.getters["jobs/getPracticeAppliedJobsReminder"];
    },
    // locum
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAllocatedPrivateJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPrivateJobs"];
    },
    getLocumAllocatedPlatformJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPlatformJobs"];
    },
    getLocumAppliedJobs() {
      return this.$store.getters["jobs/getLocumAppliedJobs"];
    },
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    }
  },
  methods: {
    // practice
    hasPracticeCurrentJobs(date, type) {
      return this.getPracticeAllocatedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasPracticeAppliedJobs(date, type) {
      return this.getPracticeAppliedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasPracticeUnfilledJobs(date, type) {
      return this.getPracticeUnfilledJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasPracticeDeclinedJobs(date, type) {
      return this.getPracticeDeclinedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasPracticeAppliedJobsReminder(date, type) {
      return this.getPracticeAppliedJobsReminder.find(
        job => job.selection_date === date && type === "Reminder"
      );
    },
    hasPracticeAvailableJobsReminder(date, type) {
      return this.getPracticeAvailableJobsReminder.find(
        job => job.selection_date === date && type === "Reminder"
      );
    },
    // locum
    hasLocumOngoingJobs(date, type) {
      return this.getLocumOngoingJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) && job_part.job.shift.name === type
      );
    },
    hasLocumAllocatedPrivateJobs(date, type) {
      return this.getLocumAllocatedPrivateJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasLocumAllocatedPlatformJobs(date, type) {
      return this.getLocumAllocatedPlatformJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasLocumAppliedJobs(date, type) {
      return this.getLocumAppliedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasLocumUnavailabilities(date, type) {
      return this.getLocumUnavailabilities.find(
        job =>
          job.date === date && job.shifts.find(shift => shift.name === type)
      );
    }
  }
};
</script>
<style scoped>
.info {
  position: absolute;
  left: 0;
  width: 100%;
  padding-top: 100%;
}
</style>