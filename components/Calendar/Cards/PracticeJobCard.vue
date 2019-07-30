<template>
  <div
    class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-grey-lighter"
    @click="select"
  >
    <div
      class="absolute pin-l pin-t rounded-l-lg p-2 h-full"
      :class="bgStatus(job.status, job.platform_job.selection_date)"
    ></div>

    <div class="ml-2">
      <div class="text-grey-dark text-xs xl:text-sm">Job Number: {{job.job_number}}</div>
      <div class="my-3 font-bold text-sm sm:text-md">{{job.title}}</div>
      <div class="my-3 text-sm sm:text-md">{{job.platform_job.practice.surgery.name}}</div>
      <div class="my-3 text-sm sm:text-md">{{job.platform_job.practice.surgery.code}}</div>
      <div
        class="text-grey-dark my-3 text-xs xl:text-sm"
      >From {{job.date_start}} to {{job.date_end}}</div>
      <div class="text-grey-dark my-3 text-xs xl:text-sm">Shift {{job.shift.name}}</div>
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
    bgStatus(status, reminder) {
      if (reminder) {
        return 'bg-grey'
      } else {
        switch (status) {
          case 'Applied':
            return 'bg-orange-dark';
            break;
          case 'Completed':
            return 'bg-green-light';
            break;
          case 'Current':
            return 'bg-green-light';
            break;
          default:
            return 'bg-red'
        }
      }
    }
  }
}
</script>