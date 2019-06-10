<template>
  <div
    class="mt-10 w-full text-center"
    style="font-family: Nunito"
    v-if="jobs.length === 0"
  >You do not have any live jobs</div>
  <div v-else class="overflow-x-auto overflow-y-hidden">
    <table class="table">
      <thead>
        <tr class="text-xs lg:text-sm text-left">
          <th style="min-width:120px">Job number</th>
          <th style="min-width:100px">Practice</th>
          <th style="min-width:100px">Title</th>
          <th style="min-width:50px">From</th>
          <th style="min-width:50px">To</th>
          <th style="min-width:50xp">Locum</th>
          <th style="min-width:50px">Assigned</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in jobs">
          <tr
            :key="`${item.id}-${index}`"
            class="rounded-lg shadow-md hover:bg-grey-light cursor-pointer text-xs lg:text-sm"
            @click="show(item.id, item.platform_job.appointed_to_locum.user.id)"
          >
            <td style="min-width:120px">{{item.job_number}}</td>
            <td style="min-width:100px">{{item.platform_job.practice.surgery.name}}</td>
            <td style="min-width:100px">{{item.platform_job.title}}</td>
            <td style="min-width:50px">{{item.platform_job.date_start}}</td>
            <td style="min-width:50px">{{item.platform_job.date_end}}</td>
            <td
              style="min-width:50px"
            >{{item.platform_job.appointed_to_locum.user.personal_detail.name}}</td>
            <td
              style="min-width:50px"
            >{{$moment(item.platform_job.appointed_at).format('YYYY-MM-DD')}}</td>
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
    this.$axios.$get(`/api/v1/practice/jobs?status=Current`).then(res => {
      this.jobs = res.data.jobs
    })
  },
  methods: {
    show(id, userId) {
      this.$store.commit('session/SET_JOB_DETAIL_ID', id)
      this.$store.commit('session/SET_USER_ID', userId)
      document.body.style.overflow = 'hidden'
      this.$store.commit('TOGGLED_RIGHT', 'allocated-detail-modal')
      this.$store.commit('SET_ALLOCATEDDETAIL_MODAL', true)
      this.$store.commit('SET_ALLOCATEDDETAIL_SHIELD', true)
    }
  }
}
</script>
<style scoped>
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