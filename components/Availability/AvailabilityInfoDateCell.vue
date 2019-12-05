<template>
  <section>
    <div class="flex flex-row flex-no-wrap absolute justify-start top-0 left-0 w-full">
      <span
        v-if="hasUnavailableDate(item.fullDate, 'AM')"
        class="bg-pink-400 text-pink-400 w-full h-2 sm:h-3 lg:h-4 rounded-tl-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'PM')"
        class="bg-pink-400 text-pink-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'Whole Day')"
        class="bg-pink-400 text-pink-400 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'OOH')"
        class="bg-pink-400 text-pink-400 w-full h-2 sm:h-3 lg:h-4 rounded-tr-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
    </div>
    <div class="flex flex-row flex-no-wrap absolute justify-start bottom-0 left-0 w-full">
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'AM')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'PM')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'Whole Day')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumOngoingJobs(item.fullDate, 'OOH')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
    </div>
    <div class="flex flex-row flex-no-wrap absolute justify-start bottom-0 left-0 w-full">
      <span
        v-if="hasLocumAllocatedJobs(item.fullDate, 'AM')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumAllocatedJobs(item.fullDate, 'PM')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumAllocatedJobs(item.fullDate, 'Whole Day')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumAllocatedJobs(item.fullDate, 'OOH')"
        class="bg-gray-300 text-gray-300 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ["item"],
  computed: {
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAllocatedJobs() {
      return this.$store.getters["jobs/getLocumAllocatedJobs"];
    },
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    }
  },
  methods: {
    hasUnavailableDate(date, type) {
      return this.getLocumUnavailabilities.find(
        item =>
          item.date === date && item.shifts.find(shift => shift.name === type)
      );
    },
    hasLocumAllocatedJobs(date, type) {
      return this.getLocumAllocatedJobs.find(
        job =>
          this.getDateArray(job.date_start, job.date_end).includes(date) &&
          job.shift.name === type
      );
    },
    hasLocumOngoingJobs(date, type) {
      return this.getLocumOngoingJobs.find(
        job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          ) && job_part.job.shift.name === type
      );
    }
  }
};
</script>
