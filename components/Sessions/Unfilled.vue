<template>
  <section class="__jobs-section">
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="!loadingJobs && getPracticeUnfilledJobs.length === 0"
      >You do not have any unfilled jobs</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th @click="sortBy('job_number')">
                Job number
                <svgicon class="inline" name="sort" height="12" width="12" />
              </th>
              <th>Practice / Surgery</th>
              <th>Title</th>
              <th @click="sortBy('date_start')">
                From
                <svgicon class="inline" name="sort" height="12" width="12" />
              </th>
              <th @click="sortBy('date_end')">
                To
                <svgicon class="inline" name="sort" height="12" width="12" />
              </th>
              <th @click="sortBy('date_created')">
                Created
                <svgicon class="inline" name="sort" height="12" width="12" />
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in getPracticeUnfilledJobs">
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
                <td>{{item.date_created}}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="bottom-0 w-full" v-if="getPracticeUnfilledJobs.length > 0 && totalPages > 1">
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
    AppPagination
  },
  data() {
    return {
      current_page: 1,
      params: {
        order_by: 'date_created:desc',
      },
      // sort
      sortType: '',
      job_number: true,
      date_start: true,
      date_end: true,
      date_created: true,
    }
  },
  computed: {
    getPracticeUnfilledJobs() {
      return this.$store.getters["jobs/getPracticeUnfilledJobs"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.jobs.practice_unfilled_jobs_count;
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
    setTimeout(() => {
      this.$store.commit('jobs/CLEAR_PRACTICE_UNFILLED_BADGE')
    }, 1000)
  },
  methods: {
    getJobsCount() {
      this.$store.dispatch("jobs/fetchPracticeJobs", {
        status: "Unfilled",
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
      let defaultParams = { offset: this.offset, limit: this.perPage, status: "Unfilled" }
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
