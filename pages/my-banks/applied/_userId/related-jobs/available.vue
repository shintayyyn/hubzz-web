<template>
  <section class="__jobs-section">
    <AppLoading :loading="loadingJobs" :message="'Loading'" />
    <div
      class="mt-10 w-full text-center"
      v-if="!loadingJobs && getPracticeAvailableJobs.length === 0"
    >There are no available jobs nearby and suited for you at this time</div>
    <div v-if="getPracticeAvailableJobs.length > 0" class="overflow-x-auto overflow-y-hidden">
      <JobTable :columns="columns" :jobs="getPracticeAvailableJobs" @sortBy="sortBy" @show="show" />
    </div>
    <div
      class="absolute bottom-0 w-full"
      v-if="getPracticeAvailableJobs.length > 0 && totalPages > 1"
    >
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
      @click="$router.go(-1)"
    ></div>
    <nuxt-child />
  </section>
</template>
<script>
import JobTable from "@/components/Sessions/JobTable";
import AppPagination from "@/components/Base/AppPagination";
import AppLoading from "@/components/Base/AppLoading";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    JobTable,
    AppPagination,
    AppLoading
  },
  data() {
    return {
      user: null,
      // table
      columns: [
        {
          label: "Job number",
          dataIndex: "job_number",
          sortable: true
        },
        {
          label: "Practice",
          dataIndex: "practice"
        },
        {
          label: "Title",
          dataIndex: "title"
        },
        {
          label: "Shift",
          dataIndex: "shift"
        },
        {
          label: "Rate",
          dataIndex: "rate",
          sortable: true
        },
        {
          label: "per",
          dataIndex: "per"
        },
        {
          label: "From",
          dataIndex: "date_start",
          sortable: true
        },
        {
          label: "To",
          dataIndex: "date_end",
          sortable: true
        },
        {
          label: "Created",
          dataIndex: "date_created",
          sortable: true
        }
      ],
      // params
      current_page: 1,
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
    getPracticeAvailableJobs() {
      return this.$store.getters["jobs/getPracticeAvailableJobs"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 5;
    },
    total() {
      return this.$store.state.jobs.practice_available_jobs_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    }
  },
  created() {
    this.getJobsCount();
    this.getJobs(this.current_page, this.params);
    setTimeout(() => {
      this.$store.commit("jobs/CLEAR_PRACTICE_AVAILABLE_BADGE");
    }, 1000);
  },
  async asyncData({ app, params, error }) {
    try {
      const responseUser = await app.$axios.$get(
        `/api/v1/practice/locums/${params.userId}`
      );
      const user =
        responseUser.data && responseUser.data.user
          ? responseUser.data.user
          : null;
      return {
        user
      };
    } catch (err) {
      throw err;
    }
  },
  methods: {
    getJobsCount() {
      this.$store.dispatch("jobs/fetchPracticeJobs", {
        locum_detail_id: this.user.locum_detail.id,
        status: ["Available"],
        countOnly: true
      });
    },
    getJobs(page, params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.current_page = page;
      let defaultParams = {
        locum_detail_id: this.user.locum_detail.id,
        offset: this.offset,
        limit: this.perPage,
        status: ["Available"]
      };
      let jobParams = { ...params, ...defaultParams };
      this.$store.dispatch("jobs/fetchPracticeJobs", jobParams).finally(() => {
        this.$store.commit("jobs/TOGGLE_LOADING", false);
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
  z-index: 511;
}
</style>
