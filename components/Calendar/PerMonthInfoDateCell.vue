<template>
  <section>
    <template v-if="$auth.user.domain === 'Practice'">
      <!-- PRACTICE -->
      <!-- PARTS -->
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getPracticeOngoingJobs.length > 0"
      >
        <span
          v-if="hasPracticeOngoingJobs(item.fullDate, 'AM', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeOngoingJobs(item.fullDate, 'PM', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeOngoingJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeOngoingJobs(item.fullDate, 'OOH', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getPracticeAllocatedJobs.length > 0"
      >
        <span
          v-if="hasPracticeAllocatedJobs(item.fullDate, 'AM', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAllocatedJobs(item.fullDate, 'PM', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAllocatedJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAllocatedJobs(item.fullDate, 'OOH', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <!-- WHOLE -->
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getPracticeAppliedJobs.length > 0"
      >
        <span
          v-if="hasPracticeAppliedJobs(item.fullDate, 'AM', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAppliedJobs(item.fullDate, 'PM', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAppliedJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAppliedJobs(item.fullDate, 'OOH', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getPracticeUnfilledJobs.length > 0"
      >
        <span
          v-if="hasPracticeUnfilledJobs(item.fullDate, 'AM', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeUnfilledJobs(item.fullDate, 'PM', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeUnfilledJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeUnfilledJobs(item.fullDate, 'OOH', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getPracticeDeclinedJobs.length > 0"
      >
        <span
          v-if="hasPracticeDeclinedJobs(item.fullDate, 'AM', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeDeclinedJobs(item.fullDate, 'PM', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeDeclinedJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeDeclinedJobs(item.fullDate, 'OOH', item.day)"
          class="bg-red-500 text-red-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getPracticeAvailableJobs.length > 0"
      >
        <span
          v-if="hasPracticeAvailableJobs(item.fullDate, 'AM', item.day)"
          class="bg-yellow-500 text-yellow-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAvailableJobs(item.fullDate, 'PM', item.day)"
          class="bg-yellow-500 text-yellow-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAvailableJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-yellow-500 text-yellow-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasPracticeAvailableJobs(item.fullDate, 'OOH', item.day)"
          class="bg-yellow-500 text-yellow-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <!-- REMINDERS -->
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
    </template>

    <template v-if="$auth.user.domain === 'Locum'">
      <!-- LOCUM -->
      <!-- PARTS -->
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getLocumOngoingJobs.length > 0"
      >
        <span
          v-if="hasLocumOngoingJobs(item.fullDate, 'AM', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumOngoingJobs(item.fullDate, 'PM', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumOngoingJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumOngoingJobs(item.fullDate, 'OOH', item.day)"
          class="bg-green-500 text-green-500 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <!-- WHOLE -->
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getLocumAllocatedJobs.length > 0"
      >
        <span
          v-if="hasLocumAllocatedJobs(item.fullDate, 'AM', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumAllocatedJobs(item.fullDate, 'PM', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumAllocatedJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumAllocatedJobs(item.fullDate, 'OOH', item.day)"
          class="bg-green-300 text-green-300 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <div
        class="flex flex-row flex-no-wrap absolute bottom-0 left-0 justify-start w-full"
        v-if="getLocumAppliedJobs.length > 0"
      >
        <span
          v-if="hasLocumAppliedJobs(item.fullDate, 'AM', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumAppliedJobs(item.fullDate, 'PM', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumAppliedJobs(item.fullDate, 'Whole Day', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
        <span
          v-if="hasLocumAppliedJobs(item.fullDate, 'OOH', item.day)"
          class="bg-orange-200 text-orange-200 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
        >.</span>
        <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      </div>
      <!-- UNAVAILABILITIES -->
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
    </template>
  </section>
</template>
<script>
export default {
  props: ["item"],
  computed: {
    // PRACTICE
    // PARTS
    getPracticeOngoingJobs() {
      return this.$store.getters["jobs/getPracticeOngoingJobs"];
    },
    // WHOLE
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
    getPracticeAvailableJobs() {
      return this.$store.getters["jobs/getPracticeAvailableJobs"];
    },
    // REMINDERS
    getPracticeAvailableJobsReminder() {
      return this.$store.getters["jobs/getPracticeAvailableJobsReminder"];
    },
    getPracticeAppliedJobsReminder() {
      return this.$store.getters["jobs/getPracticeAppliedJobsReminder"];
    },

    // LOCUM
    // PARTS
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    // WHOLE
    getLocumAllocatedJobs() {
      return this.$store.getters["jobs/getLocumAllocatedJobs"];
    },
    // getLocumAllocatedPrivateJobs() {
    //   return this.$store.getters["jobs/getLocumAllocatedPrivateJobs"];
    // },
    // getLocumAllocatedPlatformJobs() {
    //   return this.$store.getters["jobs/getLocumAllocatedPlatformJobs"];
    // },
    getLocumAppliedJobs() {
      return this.$store.getters["jobs/getLocumAppliedJobs"];
    },
    // UNAVAILABILITIES
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    }
  },
  methods: {
    // PRACTICE
    // PARTS
    hasPracticeOngoingJobs(date, type, day) {
      return this.getPracticeOngoingJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) &&
          job_part.job.shift.name === type &&
          ((job_part.job.include_saturday === false && day !== 6) ||
            job_part.job.include_saturday === true) &&
          ((job_part.job.include_sunday === false && day !== 0) ||
            job_part.job.include_sunday === true)
      );
    },
    // WHOLE
    hasPracticeAllocatedJobs(date, type, day) {
      return this.getPracticeAllocatedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      );
    },
    hasPracticeAppliedJobs(date, type, day) {
      return this.getPracticeAppliedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      );
    },
    hasPracticeUnfilledJobs(date, type, day) {
      return this.getPracticeUnfilledJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      );
    },
    hasPracticeDeclinedJobs(date, type, day) {
      return this.getPracticeDeclinedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      );
    },
    hasPracticeAvailableJobs(date, type, day) {
      return this.getPracticeAvailableJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      );
    },
    // REMINDERS
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
    // PARTS
    hasLocumOngoingJobs(date, type, day) {
      return this.getLocumOngoingJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) &&
          job_part.job.shift.name === type &&
          ((job_part.job.include_saturday === false && day !== 6) ||
            job_part.job.include_saturday === true) &&
          ((job_part.job.include_sunday === false && day !== 0) ||
            job_part.job.include_sunday === true)
      );
    },
    // WHOLE
    hasLocumAllocatedJobs(date, type, day) {
      return this.getLocumAllocatedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      );
    },
    hasLocumAppliedJobs(date, type, day) {
      return this.getLocumAppliedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type &&
          ((job.include_saturday === false && day !== 6) ||
            job.include_saturday === true) &&
          ((job.include_sunday === false && day !== 0) ||
            job.include_sunday === true)
      );
    },
    // UNAVAILABILITIES
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