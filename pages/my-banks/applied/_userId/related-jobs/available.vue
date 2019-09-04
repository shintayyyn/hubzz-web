<template>
  <section class="__jobs-section">
    <AppLoading :loading="loading" :message="'Loading'" />
    <div class="overflow-x-auto">
      <div
        class="mt-10 w-full text-center"
        style="font-family: Nunito"
        v-if="!loading && jobs.length === 0"
      >There are no available jobs nearby and suited for you at this time</div>
      <div v-if="jobs.length > 0" class="overflow-x-auto overflow-y-hidden">
        <table>
          <thead>
            <tr class="text-xs text-left">
              <th @click="sortBy('job_number')">
                Job number
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th>Practice</th>
              <th>Title</th>
              <th>Shift</th>
              <th @click="sortBy('rate')">
                Rate
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th>Per</th>
              <th @click="sortBy('date_start')">
                From
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th @click="sortBy('date_end')">
                To
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
              <th @click="sortBy('date_created')">
                Created
                <svgicon class="inline align-baseline" name="sort" height="12" width="12" />
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in jobs">
              <tr
                :key="item.id"
                class="__job-card shadow-md cursor-pointer text-xs text-left"
                @click="show(item.id)"
              >
                <td>{{item.job_number}}</td>
                <td>{{item.platform_job.practice.surgery.name}}</td>
                <td>{{item.title}}</td>
                <td>{{item.shift.name}}</td>
                <td>{{item.rate}}</td>
                <td>{{item.locum_detail_rate_type.name}}</td>
                <td>{{item.date_start}}</td>
                <td>{{item.date_end}}</td>
                <td>{{$moment(item.date_created).format('YYYY-MM-DD') }}</td>
              </tr>
              <tr :key="`${item.id}-${index}`">
                <td></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="bottom-0 w-full" v-if="jobs.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div
      class="shield"
      v-if="$route.name === 'my-banks-applied-userId-related-jobs-available-jobId'"
    ></div>
    <nuxt-child />
  </section>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import AppLoading from "@/components/Base/AppLoading";
import * as chatApi from "@/api/chat";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppPagination,
    AppLoading
  },
  data() {
    return {
      user: null,
      total: 0,
      jobs: [],
      //
      current_page: 1,
      loading: false,
      params: {
        order_by: "date_created:desc"
      },
      // sort
      sortType: "",
      job_number: true,
      rate: true,
      date_start: true,
      date_end: true,
      date_created: false
    };
  },
  computed: {
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
  },
  async asyncData({ app, params, error }) {
    try {
      // user
      const responseUser = await app.$axios.$get(
        `/api/v1/practice/locums/${params.userId}`
      );
      const user =
        responseUser.data && responseUser.data.user
          ? responseUser.data.user
          : null;
      // count
      const responseCount = await app.$axios.$get(
        `/api/v1/practice/jobs/count?locum_detail_id=${user.locum_detail.id}&locum_status=Available`
      );
      const total =
        responseCount.data && responseCount.data.count
          ? responseCount.data.count
          : 0;
      // jobs
      const responseJobs = await app.$axios.$get(
        `/api/v1/practice/jobs?locum_detail_id=${user.locum_detail.id}&locum_status=Available&offset=0&limit=5`
      );
      const jobs =
        responseJobs.data && responseJobs.data.jobs
          ? responseJobs.data.jobs
          : [];
      return {
        user,
        total,
        jobs
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    getJobs(page, params) {
      this.loading = true;
      this.current_page = page;
      const jobParams = { ...params };
      this.$axios
        .$get(
          `/api/v1/practice/jobs?locum_detail_id=${this.user.locum_detail.id}&locum_status=Available&offset=${this.offset}&limit=${this.perPage}`,
          { params: jobParams }
        )
        .then(res => {
          this.jobs = res.data.jobs;
          this.loading = false;
        });
    },
    sortBy(sortedBy) {
      switch (sortedBy) {
        case "rate":
          this.rate = !this.rate;
          this.sortType = this.rate;
        case "job_number":
          this.job_number = !this.job_number;
          this.sortType = this.job_number;
          break;
        case "date_start":
          this.date_start = !this.date_start;
          this.sortType = this.date_start;
          break;
        case "date_end":
          this.date_end = !this.date_end;
          this.sortType = this.date_end;
          break;
        case "date_created":
          this.date_created = !this.date_created;
          this.sortType = this.date_created;
          break;
      }
      this.params.order_by = `${sortedBy}:${this.sortType ? "asc" : "desc"}`;
      this.current_page = 1;
      this.getJobs(this.current_page, this.params);
    },
    pagechanged(e) {
      this.current_page = e;
      this.getJobs(this.current_page, this.params);
    },
    show(id) {
      this.$router.push(
        `/my-banks/applied/${this.$route.params.userId}/related-jobs/available/${id}`
      );
    }
  }
};
</script>
<style scoped>
.shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
</style>
