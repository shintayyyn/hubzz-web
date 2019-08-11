<template>
  <section class="__jobs-section">
    <AppJobFilter @getJobs="getJobs(1, params)" :params="params" />
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="!loadingJobs && getLocumCancelledJobs.length === 0"
      >You have not yet cancelled any job</div>
      <div v-else class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs sm:text-sm text-left">
              <th @click="sortBy('job_number')">
                Job number
                <svgicon name="sort" height="12" width="12" />
              </th>
              <th>Practice</th>
              <th>Title</th>
              <th @click="sortBy('date_start')">
                From
                <svgicon name="sort" height="12" width="12" />
              </th>
              <th @click="sortBy('date_end')">
                To
                <svgicon name="sort" height="12" width="12" />
              </th>
              <th>Cancelled At</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in getLocumCancelledJobs">
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
                <td>{{item.platform_job.cancelled_at | localDate}}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="absolute bottom-0 w-full" v-if="getLocumCancelledJobs.length > 0 && totalPages > 1">
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
import AppJobFilter from '@/components/Base/AppJobFilter'
export default {
  components: {
    AppPagination,
    AppJobFilter,
  },
  data() {
    return {
      current_page: 1,
      params: {
        shift_id: '',
        rate: '',
        locum_detail_rate_type_id: '',
        near_post_code: '',
        miles: '',
        surgery_name: '',
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
    getLocumCancelledJobs() {
      return this.$store.getters["jobs/getLocumCancelledJobs"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.jobs.locum_cancelled_jobs_count;
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
      this.$store.dispatch("jobs/fetchLocumJobs", {
        status: "Cancelled",
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
      let defaultParams = { offset: this.offset, limit: this.perPage, status: "Cancelled" }
      let jobParams = { ...params, ...defaultParams }
      this.$store.dispatch("jobs/fetchLocumJobs", jobParams);
    },
    pagechanged(e) {
      this.current_page = e
      this.getJobs(this.current_page, this.params)
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
