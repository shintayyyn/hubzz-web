<template>
  <section>
    <!-- PRACTICE -->
    <!-- parts -->
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getPracticeOngoingJobs.length > 0"
    >
      <span
        v-if="hasPracticeOngoingJobs(item.fullDate, 'AM')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeOngoingJobs(item.fullDate, 'PM')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeOngoingJobs(item.fullDate, 'Whole Day')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeOngoingJobs(item.fullDate, 'OOH')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getPracticeAllocatedJobs.length > 0"
    >
      <span
        v-if="hasPracticeAllocatedJobs(item.fullDate, 'AM')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAllocatedJobs(item.fullDate, 'PM')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAllocatedJobs(item.fullDate, 'Whole Day')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasPracticeAllocatedJobs(item.fullDate, 'OOH')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <!-- whole -->
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
        class="bg-gray-600 text-gray-600 w-1/4 h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute left-0 justify-start w-full"
      v-if="getPracticeAvailableJobsReminder.length > 0"
    >
      <span
        v-if="hasPracticeAvailableJobsReminder(item.fullDate, 'Reminder')"
        class="bg-gray-600 text-gray-600 w-1/4 h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <!-- LOCUM -->
    <!-- parts -->
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getLocumOngoingJobs.length > 0"
    >
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'AM')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'PM')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'Whole Day')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'OOH')"
        class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getLocumAllocatedPrivatePartJobs.length > 0"
    >
      <span
        v-if="hasLocumAllocatedPrivatePartJobs(item.fullDate, 'AM')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPrivatePartJobs(item.fullDate, 'PM')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPrivatePartJobs(item.fullDate, 'Whole Day')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPrivatePartJobs(item.fullDate, 'OOH')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
      v-if="getLocumAllocatedPlatformPartJobs.length > 0"
    >
      <span
        v-if="hasLocumAllocatedPlatformPartJobs(item.fullDate, 'AM')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPlatformPartJobs(item.fullDate, 'PM')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPlatformPartJobs(item.fullDate, 'Whole Day')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumAllocatedPlatformPartJobs(item.fullDate, 'OOH')"
        class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <!-- whole -->
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
    // PRACTICE
    // parts
    getPracticeOngoingJobs() {
      return this.$store.getters["jobs/getPracticeOngoingJobs"];
    },
    // getPracticeAllocatedPartJobs() {
    //   return this.$store.getters["jobs/getPracticeAllocatedPartJobs"];
    // },
    // whole
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

    // LOCUM
    // parts
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAllocatedPrivatePartJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPrivatePartJobs"];
    },
    getLocumAllocatedPlatformPartJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPlatformPartJobs"];
    },
    // whole
    getLocumAppliedJobs() {
      return this.$store.getters["jobs/getLocumAppliedJobs"];
    },
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    }
  },
  methods: {
    // PRACTICE
    // parts
    hasPracticeOngoingJobs(date, type) {
      return this.getPracticeOngoingJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) && job_part.job.shift.name === type
      );
    },
    // whole
    hasPracticeAllocatedJobs(date, type) {
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
        job => job.platform_job.selection_date === date && type === "Reminder"
      );
    },
    hasPracticeAvailableJobsReminder(date, type) {
      return this.getPracticeAvailableJobsReminder.find(
        job => job.platform_job.selection_date === date && type === "Reminder"
      );
    },

    // LOCUM
    // parts
    hasLocumOngoingJobs(date, type) {
      return this.getLocumOngoingJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) && job_part.job.shift.name === type
      );
    },
    hasLocumAllocatedPrivatePartJobs(date, type) {
      return this.getLocumAllocatedPrivatePartJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) && job_part.job.shift.name === type
      );
    },
    hasLocumAllocatedPlatformPartJobs(date, type) {
      return this.getLocumAllocatedPlatformPartJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) && job_part.job.shift.name === type
      );
    },
    // whole
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