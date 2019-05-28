<template>
  <div
    class="mt-10 w-full text-center"
    style="font-family: Nunito"
    v-if="jobs.length === 0"
  >You do not have any completed jobs</div>
  <div v-else>
    <div class="flex flex-row flex-nowrap justify-between px-2 mb-6 text-xs sm:text-sm">
      <div style="width:10%">Job number</div>
      <div style="width:20%">Practice</div>
      <div style="width:10%">Title</div>
      <div style="width:19%">From</div>
      <div style="width:19%">To</div>
      <div style="width:10%">Created</div>
      <div style="width:12%">Locums applied</div>
    </div>
    <div class="flex flex-col">
      <div class="rounded-full shadow-lg py-4 px-2 my-3" v-for="item in jobs" :key="item.id">
        <div class="flex flex-row flex-nowrap justify-between text-xs">
          <div style="width:10%">{{item.job_number}}</div>
          <template v-if="item.type === 'Platform'">
            <div style="width:20%">{{item.platform_job.practice.surgery.name}}</div>
            <div style="width:10%">{{item.platform_job.title}}</div>
            <div style="width:19%">{{item.platform_job.date_start}} {{item.platform_job.time_start}}</div>
            <div style="width:19%">{{item.platform_job.date_end}} {{item.platform_job.time_end}}</div>
            <div style="width:10%">{{item.platform_job.date_created}}</div>
            <div style="width:12%">{{item.applicants_count}}</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      jobs: []
    }
  },
  created() {
    // get available jobs
    this.$axios.$get(`/api/v1/practice/completed-jobs`).then(res => {
      this.jobs = res.data.jobs
      console.log(this.jobs)
    })
  }
}
</script>
