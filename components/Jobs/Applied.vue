<template>
  <div
    class="mt-10 w-full text-center"
    style="font-family: Nunito"
    v-if="jobs.length === 0"
  >You have not yet applied for a job</div>
  <div v-else class="overflow-x-auto overflow-y-hidden">
    <table class="table">
      <thead>
        <tr class="text-xs sm:text-sm text-left">
          <th style="min-width:120px">Job number</th>
          <th style="min-width:100px">Practice</th>
          <th style="min-width:100px">Title</th>
          <th style="min-width:50px">From</th>
          <th style="min-width:50px">To</th>
          <th style="min-width:50px">Applied</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in jobs">
          <tr
            :key="`${item.id}-${index}`"
            class="job-card rounded-lg shadow-md cursor-pointer text-xs lg:text-sm"
            @click="show(item.id)"
          >
            <td style="min-width:120px">{{item.job_number}}</td>
            <td style="min-width:100px">{{item.platform_job.practice.surgery.name}}</td>
            <td style="min-width:100px">{{item.platform_job.title}}</td>
            <td style="min-width:50px">{{item.platform_job.date_start}}</td>
            <td style="min-width:50px">{{item.platform_job.date_end}}</td>
            <!-- // ! get date applied -->
            <td style="min-width:50px">the date this user applied</td>
          </tr>
          <tr>
            <td></td>
          </tr>
        </template>
      </tbody>
    </table>
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
    // get applied jobs
    this.$axios.$get(`/api/v1/locum/jobs?locum_status=Applied`).then(res => {
      console.log(res)
      this.jobs = res.data.jobs
    })
  },
  methods: {
    show(id) {
      this.$store.commit('jobs/SET_JOB_ID', id)
      this.$store.commit('SET_LOCUM_APPLIED_DETAIL_MODAL', true)
      this.$store.commit('SET_LOCUM_APPLIED_DETAIL_SHIELD', true)
      this.$store.commit('TOGGLED_RIGHT', 'locum-applied-detail-modal')
      document.body.style.overflow = 'hidden'
    }
  }
}
</script>
<style scoped>
.job-card:hover {
  background-color: #dee1e5;
  transition: background-color 0.5s ease-in-out;
}
.job-card {
  background-color: white;
  transition: background-color 0.5s ease-in-out;
}
table {
  min-width: 850px;
}
table thead th {
  padding: 15px;
}
table tbody td {
  padding: 10px;
}
</style>