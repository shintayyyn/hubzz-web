<template>
  <section>
    <div class="flex flex-row flex-no-wrap absolute justify-start top-0 left-0 w-full">
      <span
        v-if="hasUnavailableDate(item.fullDate, 'AM')"
        class="bg-pink-200 text-pink-200 w-full h-2 sm:h-3 lg:h-4 rounded-tl-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'PM')"
        class="bg-pink-200 text-pink-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'Whole Day')"
        class="bg-pink-200 text-pink-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasUnavailableDate(item.fullDate, 'OOH')"
        class="bg-pink-200 text-pink-200 w-full h-2 sm:h-3 lg:h-4 rounded-tr-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
    </div>
    <div class="flex flex-row flex-no-wrap absolute justify-start bottom-0 left-0 w-full">
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'AM')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'PM')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'Whole Day')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumPrivateJobs(item.fullDate, 'OOH')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
    </div>
    <div class="flex flex-row flex-no-wrap absolute justify-start bottom-0 left-0 w-full">
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'AM')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'PM')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'Whole Day')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
      <span
        v-if="hasLocumCurrentJobs(item.fullDate, 'OOH')"
        class="bg-gray-200 text-gray-200 w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="w-full h-2 sm:h-3 lg:h-4 text-white"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ['item'],
  computed: {
    getLocumAllocatedPrivateJobs() {
      return this.$store.getters['jobs/getLocumAllocatedPrivateJobs']
    },
    getLocumAllocatedCurrentJobs() {
      return this.$store.getters['jobs/getLocumAllocatedCurrentJobs']
    },
    getLocumUnavailabilities() {
      return this.$store.getters['jobs/getLocumUnavailabilities']
    },
  },
  methods: {
    hasUnavailableDate(date, type) {
      return this.getLocumUnavailabilities.find(item => item.date === date && item.shifts.find(shift => shift.name === type))
    },
    hasLocumPrivateJobs(date, type) {
      return this.getLocumAllocatedPrivateJobs.find(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date) && job.private_job.shift.name === type)
    },
    hasLocumCurrentJobs(date, type) {
      return this.getLocumAllocatedCurrentJobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
  }
}
</script>
