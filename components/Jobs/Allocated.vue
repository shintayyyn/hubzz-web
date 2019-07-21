<template>
  <section class="allocated-section overflow-x-auto">
    <div
      class="mt-10 w-full text-center"
      style="font-family: Nunito"
      v-if="getLocumAllocatedJobs.length === 0 && !loadingJobs"
    >You do not have any allocated jobs</div>
    <div v-else class="mt-4">
      <table>
        <thead>
          <tr class="text-xs sm:text-sm text-left">
            <th>Job number</th>
            <th>Practice</th>
            <th>Title</th>
            <th>From</th>
            <th>To</th>
            <th>Created</th>
            <th>Assigned</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in getLocumAllocatedJobs">
            <tr
              :key="item.id"
              class="job-card shadow-md cursor-pointer text-xs text-left"
              @click="show(item.id)"
            >
              <td>{{item.job_number}}</td>
              <td>{{item.type === 'Private' ? item.private_job.private_practice.surgery.name : item.platform_job.practice.surgery.name}}</td>
              <td>{{item.type === 'Private' ? 'Private appointment' : item.platform_job.title}}</td>
              <td>{{item.type === 'Private' ? item.private_job.date_start : item.platform_job.date_start}}</td>
              <td>{{item.type === 'Private' ? item.private_job.date_end : item.platform_job.date_end}}</td>
              <td>{{item.created_at | localDate }}</td>
              <td v-if="item.type === 'Private'">N/A</td>
              <td v-else>{{item.platform_job.appointed_at | localDate}}</td>
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
  computed: {
    getLocumAllocatedJobs() {
      return this.$store.getters["jobs/getLocumAllocatedJobs"];
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.jobs.locum_allocated_jobs_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    currentPage() {
      return parseInt(this.$route.query.current_page);
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      current_page: this.$route.query.current_page || 1
    };
    this.$router.push({ query });
    this.getJobsCount();
    this.getJobs();
  },
  methods: {
    getJobsCount() {
      this.$store.dispatch("jobs/fetchLocumJobs", {
        countOnly: true
      });
    },
    getJobs() {
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1);
      this.$store.dispatch("jobs/fetchLocumJobs", {
        offset: offset,
        limit: this.perPage,
        status: "Current"
      });
    },
    show(id) {
      this.$router.push(`/jobs/${id}?job_status=allocated`);
    }
  }
};
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