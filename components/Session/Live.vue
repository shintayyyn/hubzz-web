<template>
  <div
    class="mt-10 w-full text-center"
    style="font-family: Nunito"
    v-if="jobs.length === 0"
  >You do not have any live jobs</div>
  <div v-else class="overflow-x-auto overflow-y-hidden">
    <table style="min-width:1000px">
      <thead>
        <tr class="text-xs sm:text-sm text-left">
          <th style="min-width:100px">Job number</th>
          <th style="min-width:300px">Practice</th>
          <th style="min-width:100px">Title</th>
          <th style="min-width:200px">From</th>
          <th style="min-width:200px">To</th>
          <th style="min-width:150px">Created</th>
          <th style="min-width:120px">Locums applied</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="rounded-lg shadow-lg hover:bg-grey-light cursor-pointer"
          v-for="item in jobs"
          :key="item.id"
          @click="show(item.id)"
        >
          <td class="p-4" style="min-width:100px">{{item.job_number}}</td>
          <td class="p-4" style="min-width:300px">{{item.platform_job.practice.surgery.name}}</td>
          <td class="p-4" style="min-width:100px">{{item.platform_job.title}}</td>
          <td
            class="p-4"
            style="min-width:200px"
          >{{item.platform_job.date_start}} {{item.platform_job.time_start}}</td>
          <td
            class="p-4"
            style="min-width:200px"
          >{{item.platform_job.date_end}} {{item.platform_job.time_end}}</td>
          <td class="p-4" style="min-width:150px">{{item.platform_job.date_created}}</td>
          <td class="p-4" style="min-width:120px">{{item.applicants_count}}</td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="flex flex-row flex-nowrap justify-between px-2 mb-6 text-xs sm:text-sm">
      <div style="width:10%">Job number</div>
      <div style="width:20%">Practice</div>
      <div style="width:10%">Title</div>
      <div style="width:19%">From</div>
      <div style="width:19%">To</div>
      <div style="width:10%">Created</div>
      <div style="width:12%">Locums applied</div>
    </div>
    <div class="flex flex-col">
      <div
        class="rounded-lg shadow-lg py-4 px-2 my-3 cursor-pointer hover:bg-grey-light"
        @click="show(item.id)"
        v-for="item in jobs"
        :key="item.id"
      >
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
    </div>-->
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
    this.$axios.$get(`/api/v1/practice/available-jobs`).then(res => {
      this.jobs = res.data.jobs
    })
  },
  methods: {
    show(id) {
      this.$store.commit('session/SET_JOB_DETAIL_ID', id)
      this.$store.commit('SET_JOBDETAIL_MODAL', true)
      this.$store.commit('SET_JOBDETAIL_SHIELD', true)
      let d = document.getElementsByClassName('job-detail-modal')[0]
      d.classList.toggle('toggled-right')
      document.body.style.overflow = 'hidden'
    }
  }
}
</script>
<style>
tbody:before {
  content: "-";
  display: block;
  line-height: 1em;
  color: transparent;
}
</style>
