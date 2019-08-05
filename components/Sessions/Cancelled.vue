<template>
  <section class="__jobs-section">
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="!loadingJobs && getPracticeCancelledJobs.length === 0"
      >You do not have any live jobs</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th>Job number</th>
              <th>Practice</th>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Cancelled</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in getPracticeCancelledJobs">
              <tr
                :key="item.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item.id)"
              >
                <td>{{item.job_number}}</td>
                <td>{{item.platform_job.practice.surgery.name}}</td>
                <td>{{item.title}}</td>
                <td>{{item.date_start}}</td>
                <td>{{item.date_end}}</td>
                <td>{{$moment(item.platform_job.cancelled_at).format('YYYY-MM-DD HH:mm:ss')}}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="absolute pin-b w-full" v-if="getPracticeCancelledJobs.length > 0">
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
    getPracticeCancelledJobs() {
      return this.$store.getters["jobs/getPracticeCancelledJobs"];
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.jobs.practice_cancelled_jobs_count;
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
    getPracticeCancelledJobs(newValue, oldValue) {
      if (newValue.length !== 0 && (oldValue.length > newValue.length)) {
        this.getJobs()
      }
      if (newValue.length === 0 && this.$route.query.current_page !== 1) {
        this.pagechanged(this.totalPages)
      }
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
      this.$store.dispatch("jobs/fetchPracticeJobs", {
        status: "Cancelled",
        countOnly: true
      });
    },
    getJobs() {
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1);
      this.$store.dispatch("jobs/fetchPracticeJobs", {
        offset: offset,
        limit: this.perPage,
        status: "Cancelled"
      });
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
      this.$router.push({ path: `/sessions/${id}`, query })
    }
  }
}
</script>
