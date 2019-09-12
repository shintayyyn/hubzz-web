<template>
  <section class="relative __jobs-section">
    <AppLoading :loading="loadingJobs" :message="'Loading'" />
    <div
      class="mt-10 w-full text-center"
      v-if="!loadingJobs && getLocumCompletedJobs.length === 0"
    >You have not yet completed any job</div>
    <div v-if="getLocumCompletedJobs.length > 0" class="overflow-x-auto overflow-y-hidden">
      <JobTable :columns="columns" :jobs="getLocumCompletedJobs" @sortBy="sortBy" @show="show" />
    </div>
    <div class="absolute bottom-0 w-full" v-if="getLocumCompletedJobs.length > 0 && totalPages > 1">
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="current_page"
        @pagechanged="pagechanged"
      />
    </div>
    <div
      class="shield"
      v-if="$route.name === 'my-practice-unsuccessful-practiceId-related-jobs-completed-jobId'"
    ></div>
    <nuxt-child />
  </section>
</template>
<script>
import JobTable from "@/components/Jobs/JobTable";
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
          label: "Marked completed by Practice",
          dataIndex: "completed_at"
        }
      ],
      // params
      current_page: 1,
      params: {
        order_by: "date_start:desc"
      },
      // sort
      sortType: "",
      job_number: true,
      rate: true,
      date_start: false,
      date_end: true
    };
  },
  computed: {
    getLocumCompletedJobs() {
      return this.$store.getters["jobs/getLocumCompletedJobs"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 10;
    },
    total() {
      return this.$store.state.jobs.locum_completed_jobs_count;
    },
    totalPages() {
      return Math.ceil(this.total / this.perPage);
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
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
      this.$store.commit("jobs/CLEAR_LOCUM_COMPLETED_BADGE");
    }, 1000);
  },
  methods: {
    getJobsCount() {
      this.$store.dispatch("jobs/fetchLocumJobs", {
        practice_id: this.$route.params.practiceId,
        status: "Completed",
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
    getJobs(page, params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.current_page = page;
      let defaultParams = {
        practice_id: this.$route.params.practiceId,
        offset: this.offset,
        limit: this.perPage,
        status: "Completed"
      };
      let jobParams = { ...params, ...defaultParams };
      this.$store.dispatch("jobs/fetchLocumJobs", jobParams).finally(() => {
        this.$store.commit("jobs/TOGGLE_LOADING", false);
      });
    },
    pagechanged(e) {
      this.current_page = e;
      this.getJobs(this.current_page, this.params);
    },
    show(id) {
      this.$router.push(
        `/my-practice/unsuccessful/${this.$route.params.practiceId}/related-jobs/completed/${id}`
      );
    }
  }
};
</script>
<style scoped>
.shield {
  z-index: 509;
}
</style>