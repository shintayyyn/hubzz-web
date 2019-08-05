<template>
  <section class="__jobs-section">
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="!loadingJobs && getLocumAllocatedJobs.length === 0 "
      >You do not have any allocated jobs</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th @click="getJobs('job_number')">Job number</th>
              <th>Practice</th>
              <th @click="getJobs('title')">Title</th>
              <th @click="getJobs('date_start')">From</th>
              <th @click="getJobs('date_end')">To</th>
              <th @click="getJobs('date_created')">Created</th>
              <th>Assigned</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in getLocumAllocatedJobs">
              <tr
                :key="item.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item.id)"
              >
                <td>{{item.job_number}}</td>
                <td>{{item.type === 'Private' ? item.private_job.private_practice.surgery.name : item.platform_job.practice.surgery.name}}</td>
                <td>{{item.type === 'Private' ? 'Private appointment' : item.title}}</td>
                <td>{{item.date_start}}</td>
                <td>{{item.date_end}}</td>
                <td>{{$moment(item.date_created).format('YYYY-MM-DD') }}</td>
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
    </div>
    <div class="absolute pin-b w-full" v-if="getLocumAllocatedJobs.length > 0">
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
  watch: {
    getLocumAllocatedJobs(newValue, oldValue) {
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
      this.$store.dispatch("jobs/fetchLocumJobs", {
        status: "Current",
        countOnly: true
      });
    },
    getJobs(sortBy) {
      let order_by = []
      if (sortBy) {
        order_by.push(`${sortBy}:desc`)
      }
      order_by = [...order_by, 'date_created:desc', 'id:desc']
      let offset = 0;
      offset = this.perPage * (parseInt(this.$route.query.current_page) - 1);
      this.$store.dispatch("jobs/fetchLocumJobs", {
        offset: offset,
        limit: this.perPage,
        status: "Current",
        order_by: order_by
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
      this.$router.push({ path: `/jobs/${id}`, query })
    }
  }
};
</script>
