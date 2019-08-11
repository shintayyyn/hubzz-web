<template>
  <section class="__jobs-section">
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="!loadingJobs && getPracticeAllocatedJobs.length === 0"
      >No locums are assigned to jobs yet</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th @click="sortBy('job_number')">
                Job number
                <svgicon name="sort" height="12" width="12" />
              </th>
              <th>Practice / Surgery</th>
              <th>Title</th>
              <th @click="sortBy('date_start')">
                From
                <svgicon name="sort" height="12" width="12" />
              </th>
              <th @click="sortBy('date_end')">
                To
                <svgicon name="sort" height="12" width="12" />
              </th>
              <th>Locum</th>
              <th>Assigned</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in getPracticeAllocatedJobs">
              <tr
                :key="item.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item.id, item.platform_job.appointed_to_locum.user.id)"
              >
                <td>{{item.job_number}}</td>
                <td>{{item.platform_job.practice.surgery.name}}</td>
                <td>{{item.title}}</td>
                <td>{{item.date_start}}</td>
                <td>{{item.date_end}}</td>
                <td>{{item.platform_job.appointed_to_locum.user.personal_detail.name}}</td>
                <td>{{$moment(item.platform_job.appointed_at).format('YYYY-MM-DD')}}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div
      class="absolute bottom-0 w-full"
      v-if="getPracticeAllocatedJobs.length > 0 && totalPages > 1"
    >
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
  </section>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
export default {
  components: {
    AppPagination,
  },
  data() {
    return {
      current_page: 1,
      params: {
        order_by: 'date_start:desc',
      },
      // sort
      sortType: '',
      job_number: true,
      date_start: false,
      date_end: true,
    }
  },
  computed: {
    getPracticeAllocatedJobs() {
      return this.$store.getters["jobs/getPracticeAllocatedJobs"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.jobs.practice_allocated_jobs_count;
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
    this.getJobsCount();
    this.getJobs(this.current_page, this.params);
  },
  methods: {
    getJobsCount() {
      this.$store.dispatch("jobs/fetchPracticeJobs", {
        status: "Current",
        countOnly: true
      });
    },
    sortBy(sortedBy) {
      switch (sortedBy) {
        case 'job_number':
          this.job_number = !this.job_number
          this.sortType = this.job_number
          break;
        case 'date_start':
          this.date_start = !this.date_start
          this.sortType = this.date_start
          break;
        case 'date_end':
          this.date_end = !this.date_end
          this.sortType = this.date_end
          break;
        case 'date_created':
          this.date_created = !this.date_created
          this.sortType = this.date_created
          break;
      }
      this.params.order_by = `${sortedBy}:${this.sortType ? 'asc' : 'desc'}`
      this.current_page = 1
      this.getJobs(this.current_page, this.params)
    },
    getJobs(page, params) {
      this.current_page = page
      let defaultParams = { offset: this.offset, limit: this.perPage, status: "Current" }
      let jobParams = { ...params, ...defaultParams }
      this.$store.dispatch("jobs/fetchPracticeJobs", jobParams);
    },
    pagechanged(e) {
      this.current_page = e
      this.getJobs(this.current_page, this.params)
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
