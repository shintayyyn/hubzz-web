<template>
  <section class="__jobs-section" v-if="!loadingJobs">
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="getLocumUnsuccessfulJobs.length === 0"
      >You have not yet rejected for a job</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th>Job number</th>
              <th>Practice</th>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Rejected</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in getLocumUnsuccessfulJobs">
              <tr
                :key="item.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item.id)"
              >
                <td>{{item.job_number}}</td>
                <td>{{item.platform_job.practice.surgery.name}}</td>
                <td>{{item.platform_job.title}}</td>
                <td>{{item.platform_job.date_start}}</td>
                <td>{{item.platform_job.date_end}}</td>
                <td>{{item.platform_job.rejected_at}}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="absolute pin-b w-full" v-if="getLocumUnsuccessfulJobs.length > 0">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="currentPage"
        @pagechanged="pagechanged"
      />
    </div>
  </section>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
export default {
  components: {
    AppPagination
  },
  computed: {
    getLocumUnsuccessfulJobs() {
      return this.$store.getters["jobs/getLocumUnsuccessfulJobs"];
    },
    perPage() {
      return 2;
    },
    total() {
      return this.$store.state.jobs.locum_unsuccessful_jobs_count;
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
  watch: {
    getLocumUnsuccessfulJobs() {
      this.goToLastPageThatHasJob()
    },
    $route(to, from) {
      if (from.query.current_page !== to.query.current_page) {
        this.getJobs()
      }
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
        status: "Unsuccessful",
        countOnly: true
      });
    },
    getJobs() {
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1);
      this.$store.dispatch("jobs/fetchLocumJobs", {
        offset: offset,
        limit: this.perPage,
        status: "Unsuccessful"
      });
    },
    goToLastPageThatHasJob() {
      this.$store.commit('jobs/TOGGLE_LOADING', false)
      if (this.getLocumUnsuccessfulJobs.length === 0 && this.$route.query.current_page !== 1 && !this.loadingJobs) {
        this.pagechanged(this.$route.query.current_page - 1)
      }
    },
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        current_page: e || 1
      }
      this.$router.push({ query })
    },
    show(id) {
      const query = {
        ...this.$route.query
      }
      this.$router.push({ path: `/jobs/${id}`, query })
    }
  }
}
</script>
