<template>
  <div
    class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-grey-lighter"
    @click="select"
  >
    <template v-if="job.status">
      <div class="absolute pin-l pin-t rounded-l-lg p-2 h-full" :class="bgStatus(job.locum_status)"></div>
      <div class="ml-2">
        <div class="text-grey-dark text-xs xl:text-sm">Job Number: {{job.job_number}}</div>
        <div class="my-3 font-bold text-sm sm:text-md">{{title(job.status)}}</div>
        <div class="my-3 text-sm sm:text-md">{{surgeryName(job.status)}}</div>
        <div class="my-3 text-sm sm:text-md">{{surgeryCode(job.status)}}</div>
        <div
          class="text-grey-dark my-3 text-xs xl:text-sm"
        >From {{dateStart(job.status)}} to {{dateEnd(job.status)}}</div>
        <div class="text-grey-dark my-3 text-xs xl:text-sm">Shift {{shift(job.status)}}</div>
        <div class="my-3 text-xs xl:text-sm">{{description(job.status)}}</div>
      </div>
    </template>
    <template v-else>
      <div class="bg-pink absolute pin-l pin-t rounded-l-lg p-2 h-full"></div>
      <div class="ml-2">
        <div class="my-3 font-bold text-sm sm:text-md">Unavailable</div>
        <div
          class="my-3 text-xs xl:text-sm"
          v-if="$store.state.calendar.view_type === 'per_month'"
        >Shifts: {{unavailableShift(job.shifts)}}</div>
        <div
          class="my-3 text-xs xl:text-sm"
          v-if="$store.state.calendar.view_type === 'per_week'"
        >Shift: {{unavailableShift(job.shifts)}}</div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: ['job'],
  methods: {
    select() {
      if (this.job.status) {
        this.$axios.$get(`/api/v1/locum/jobs/${this.job.id}`).then(res => {
          this.$emit('viewLocumJob', res.data.job)
        })
      } else {
        this.$router.push('/availability')
      }
    },
    title(status) {
      return status === 'Private' ? 'Private appointment' : this.job.title
    },
    surgeryName(status) {
      return status === 'Private' ? this.job.private_job.private_practice.surgery.name : this.job.platform_job.practice.surgery.name
    },
    surgeryCode(status) {
      return status === 'Private' ? this.job.private_job.private_practice.surgery.code : this.job.platform_job.practice.surgery.code
    },
    dateStart(status) {
      return status === 'Private' ? this.job.private_job.date_start : this.job.platform_job.date_start
    },
    dateEnd(status) {
      return status === 'Private' ? this.job.private_job.date_end : this.job.platform_job.date_end
    },
    shift(status) {
      return status === 'Private' ? this.job.private_job.shift.name : this.job.platform_job.shift.name
    },
    description(status) {
      return status === 'Private' ? this.job.private_job.description : this.job.platform_job.description
    },
    unavailableShift(shifts) {
      if (this.$store.state.calendar.view_type === 'per_month') {
        return shifts.map(shift => shift.name).join()
      }
      return shifts.filter(job => job.name === this.$store.state.calendar.selected_date_shift.shift || 'AM')[0].name
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