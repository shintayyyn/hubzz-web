<template>
  <div
    class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-grey-lighter"
    @click="select"
  >
    <div class="absolute pin-l pin-t rounded-l-lg p-2 h-full" :class="bgStatus(job.locum_status)"></div>

    <div class="ml-2">
      <div class="text-grey-dark text-xs xl:text-sm">Job Number: {{job.job_number}}</div>
      <div class="my-3 font-bold text-sm sm:text-md">{{title}}</div>
      <div class="my-3 text-sm sm:text-md">{{surgery_name}}</div>
      <div class="my-3 text-sm sm:text-md">{{surgery_code}}</div>
      <div
        class="text-grey-dark my-3 text-xs xl:text-sm"
      >From {{job.date_start}} to {{job.date_end}}</div>
      <div class="text-grey-dark my-3 text-xs xl:text-sm">Shift {{shift}}</div>
      <div class="my-3 text-xs xl:text-sm">{{description}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['job'],
  computed: {
    title() {
      return this.job.status === 'Private' ? 'Private appointment' : this.job.platform_job.title
    },
    surgery_name() {
      return this.job.status === 'Private' ? this.job.private_job.private_practice.surgery.name : this.job.platform_job.practice.surgery.name
    },
    surgery_code() {
      return this.job.status === 'Private' ? this.job.private_job.private_practice.surgery.code : this.job.platform_job.practice.surgery.code
    },
    shift() {
      return this.job.status === 'Private' ? this.job.private_job.shift.name : this.job.platform_job.shift.name
    },
    description() {
      return this.job.status === 'Private' ? this.job.private_job.description : this.job.platform_job.description
    }

  },
  methods: {
    select() {
      this.$axios.$get(`/api/v1/locum/jobs/${this.job.id}`).then(res => {
        this.$emit('viewLocumJob', res.data.job)
      })
    },
    bgStatus(status, reminder) {
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
</script>