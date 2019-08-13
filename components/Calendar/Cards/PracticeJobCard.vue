<template>
  <div
    class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-gray-300"
    @click="select"
  >
    <div
      class="absolute left-0 top-0 rounded-l-lg p-2 h-full"
      :class="bgStatus(job.status, job.platform_job.selection_date, job)"
    ></div>

    <div class="ml-2">
      <div class="text-gray-500 text-xs xl:text-sm">Job Number: {{job.job_number}}</div>
      <div class="my-3 font-bold text-sm sm:text-md">{{job.title}}</div>
      <div class="my-3 text-sm sm:text-md">{{job.platform_job.practice.surgery.name}}</div>
      <div class="my-3 text-sm sm:text-md">{{job.platform_job.practice.surgery.code}}</div>
      <div class="text-gray-500 my-3 text-xs xl:text-sm">From {{job.date_start}} to {{job.date_end}}</div>
      <div class="text-gray-500 my-3 text-xs xl:text-sm">Shift {{job.shift.name}}</div>
      <div class="my-3 text-xs xl:text-sm">{{job.description}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['job'],
  methods: {
    select() {
      this.$axios.$get(`/api/v1/practice/jobs/${this.job.id}`).then(res => {
        this.$emit('viewPracticeJob', res.data.job)
      })
    },
    bgStatus(status, reminder, job) {
      if (reminder && status !== 'Unfilled') {
        return 'bg-gray-900'
      } else {
        switch (status) {
          case 'Applied':
            return 'bg-orange-400';
            break;
          case 'Completed':
            return 'bg-green-400';
            break;
          case 'Current':
            return 'bg-green-600';
            break;
          case 'Unfilled':
            return 'bg-red-500';
            break;
          default:
            return 'bg-red-500'
        }
      }
    }
  }
}
</script>