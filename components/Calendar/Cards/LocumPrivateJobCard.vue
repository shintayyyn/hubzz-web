<template>
  <div
    class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-grey-lighter"
    @click="select"
  >
    <div class="bg-green-light absolute pin-l pin-t rounded-l-lg p-2 h-full"></div>
    <div class="ml-2">
      <div class="text-grey-dark text-xs xl:text-sm">Job Number: {{job.job_number}}</div>
      <div class="my-3 font-bold text-sm sm:text-md">Private appointment</div>
      <div class="my-3 text-sm sm:text-md">{{job.private_job.private_practice.surgery.name}}</div>
      <div
        class="my-3 text-sm sm:text-md"
      >{{job.private_job.private_practice.surgery.address.line_1}}, {{job.private_job.private_practice.surgery.address.post_code}}</div>
      <div
        class="text-grey-dark my-3 text-xs xl:text-sm"
      >From {{job.private_job.date_start}} to {{job.private_job.date_end}}</div>
      <div class="text-grey-dark my-3 text-xs xl:text-sm">Shift: {{job.private_job.shift.name}}</div>
      <div class="my-3 text-xs xl:text-sm">{{job.private_job.description}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['job'],
  methods: {
    select() {
      this.$axios.$get(`/api/v1/locum/jobs/${this.job.id}`).then(res => {
        this.$emit('viewAppointmentJob', res.data.job)
      })
    }
  },
}
</script>
<style>
.info-card {
  height: 300px;
}
@media screen and (min-width: 768px) {
  .info-card {
    height: 600px;
  }
}
</style>


