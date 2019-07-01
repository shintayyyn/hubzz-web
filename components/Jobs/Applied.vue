<template>
  <section class="applied-section overflow-x-auto">
    <div
      class="mt-10 w-full text-center"
      style="font-family: Nunito"
      v-if="jobs.length === 0"
    >You have not yet applied for a job</div>
    <div v-else class="mt-4">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Job number</th>
            <th>Practice</th>
            <th>Title</th>
            <th>From</th>
            <th>To</th>
            <th>Applied</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in jobs">
            <tr
              :key="item.id"
              class="job-card shadow-md cursor-pointer text-xs text-left"
              @click="show(item.id)"
            >
              <td>{{item.job_number}}</td>
              <td>{{item.platform_job.practice.surgery.name}}</td>
              <td>{{item.platform_job.title}}</td>
              <td>{{item.platform_job.date_start}}</td>
              <td>{{item.platform_job.date_end}}</td>
              <!-- ! get date applied -->
              <td>the date this user applied</td>
            </tr>
            <tr :key="`${item.id}-${index}`">
              <td></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      jobs: [],
    }
  },
  created() {
    this.$axios.$get(`/api/v1/locum/jobs?locum_status=Applied`).then(res => {
      this.jobs = res.data.jobs
    })
  },
  methods: {
    show(id) {
      this.$router.push(`/jobs/${id}?job_status=applied`)
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
a {
  text-decoration: none;
  color: black;
}
table {
  width: 920px;
}
table thead th {
  padding: 15px;
}
table tbody td {
  padding: 15px;
}
</style>