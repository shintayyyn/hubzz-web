<template>
  <section class="relative">
    <AppLoading :loading="loadingJobs" :message="'Loading'" />
    <AppJobFilter @clear="clearFilters" @getJobs="getJobs(1, params)" :params="params" />
    <div
      class="mt-10 w-full text-center"
      v-if="!loadingJobs && getPracticeAppliedJobs.length === 0 "
    >You do not have any allocated jobs</div>
    <div v-if="getPracticeAppliedJobs.length > 0" class="overflow-x-auto overflow-y-hidden">
      <JobTable :columns="columns" :jobs="getPracticeAppliedJobs" @sortBy="sortBy" @show="show" />
    </div>
    <div class="w-full mt-4" v-if="getPracticeAppliedJobs.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div class="shield" v-if="$route.name === 'sessions-applied-id'"></div>
    <nuxt-child />
  </section>
</template>
<script>
import JobTable from "@/components/Sessions/JobTable";
import AppPagination from "@/components/Base/AppPagination";
import AppJobFilter from "@/components/Base/AppJobFilter";
import AppLoading from "@/components/Base/AppLoading";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    JobTable,
    AppPagination,
    AppJobFilter,
    AppLoading
  },
  data() {
    return {
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
          label: "Rate Type",
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
        // {
        //   label: "Created",
        //   dataIndex: "date_created",
        //   sortable: true
        // },
        {
          label: "Applied",
          dataIndex: "date_applied"
        }
      ],
      // params
      current_page: 1,
      params: {
        shift_id: "",
        rate: "",
        locum_detail_rate_type_id: "",
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
    getPracticeAppliedJobs() {
      return this.$store.getters["jobs/getPracticeAppliedJobs"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 10;
    },
    total() {
      return this.$store.state.jobs.practice_applied_jobs_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    },
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  beforeCreate() {
    this.$store.commit("jobs/TOGGLE_LOADING", true);
  },
  beforeDestroy() {
    this.$store.commit("jobs/CLEAR_JOBS");
  },
  created() {
    this.getJobsCount();
    this.getJobs(this.current_page, this.params);
    setTimeout(() => {
      this.$store.commit("jobs/CLEAR_PRACTICE_APPLIED_BADGE");
    }, 1000);
  },
  methods: {
    getJobsCount() {
      this.$store.dispatch("jobs/fetchPracticeJobs", {
        status: "Applied",
        countOnly: true
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
    clearFilters() {
      (this.params.shift_id = ""),
        (this.params.rate = ""),
        (this.params.locum_detail_rate_type_id = ""),
        (this.params.order_by = "date_created:desc"),
        this.getJobs(this.current_page, this.params);
    },
    getJobs(page, params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.current_page = page;
      let defaultParams = {
        offset: this.offset,
        limit: this.perPage,
        status: "Applied"
      };
      let jobParams = { ...params, ...defaultParams };
      this.$store.dispatch("jobs/fetchPracticeJobs", jobParams).finally(() => {
        this.$store.commit("jobs/TOGGLE_LOADING", false);
      });
    },
    pagechanged(e) {
      this.current_page = e;
      this.getJobs(this.current_page, this.params);
    },
    show(id) {
      if (this.authPermissions.includes("Show Sessions Job")) {
        this.$router.push(`/sessions/applied/${id}`);
      }
    }
  }
};
</script>
