<template>
  <section>
    <div class="flex flex-row flex-nowrap absolute pin-l w-full">
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
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="appointment_jobs.length > 0"
    >
      <span
        v-if="hasAppointmentJobs(item.fullDate, 'AM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasAppointmentJobs(item.fullDate, 'PM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasAppointmentJobs(item.fullDate, 'Whole Day')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasAppointmentJobs(item.fullDate, 'OOH')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-b pin-l justify-start w-full"
      v-if="locum_jobs.length > 0"
    >
      <span
        v-if="hasLocumJobs(item.fullDate, 'AM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-bl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumJobs(item.fullDate, 'PM')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumJobs(item.fullDate, 'Whole day')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasLocumJobs(item.fullDate, 'OOH')"
        class="bg-green-light text-green-light w-full h-2 sm:h-3 lg:h-4 rounded-br-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
    <div
      class="flex flex-row flex-nowrap absolute pin-t pin-l justify-start w-full"
      v-if="unavailabilities.length > 0"
    >
      <span
        v-if="hasUnavailabilities(item.fullDate, 'AM')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4 rounded-tl-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasUnavailabilities(item.fullDate, 'PM')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasUnavailabilities(item.fullDate, 'Whole Day')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
      <span
        v-if="hasUnavailabilities(item.fullDate, 'OOH')"
        class="bg-pink text-pink w-full h-2 sm:h-3 lg:h-4 rounded-tr-lg"
      >.</span>
      <span v-else class="text-white w-full h-2 sm:h-3 lg:h-4"></span>
    </div>
  </section>
</template>
<script>
export default {
  props: ['jobs', 'applied_jobs', 'unfilled_jobs', 'declined_jobs', 'appointment_jobs', 'locum_jobs', 'unavailabilities', 'item'],
  methods: {
    // practice
    hasJobs(date, type) {
      return this.jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasAppliedJobs(date) {
      return this.applied_jobs.find(job => job.platform_job.selection_date === date)
    },
    hasUnfilledJobs(date, type) {
      return this.unfilled_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    hasDeclinedJobs(date, type) {
      return this.declined_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    },
    // locum
    hasAppointmentJobs(date, type) {
      return this.appointment_jobs.find(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date) && job.private_job.shift.name === type)
    },
    hasUnavailabilities(date, type) {
      return this.unavailabilities.find(job => job.date === date && job.shifts.find(shift => shift.name === type))
    },
    hasLocumJobs(date, type) {
      return this.locum_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
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