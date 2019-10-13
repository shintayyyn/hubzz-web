<template>
  <section class="relative">
    <AppTable
      v-if="getLocumOngoingJobs.length > 0"
      :total="total"
      :items="getLocumOngoingJobs"
      :loading="loading"
      :currentPage="current_page"
      :perPage="params.limit"
      :columns="columns"
      :orderBy="params.order_by"
      @show="show"
    />
    <div v-else class="flex justify-center">You do not have any ongoing jobs</div>
    <transition name="fade">
      <div
        class="shield"
        v-if="$route.name === 'jobs-ongoing-id'"
        @click="$router.push('/jobs/ongoing')"
      ></div>
    </transition>
    <nuxt-child />
  </section>
</template>
<script>
import JobTable from "@/components/Jobs/JobTable";
import AppPagination from "@/components/Base/AppPagination";
import AppJobFilter from "@/components/Base/AppJobFilter";
import AppLoading from "@/components/Base/AppLoading";
import AppTable from "@/components/Base/AppTable";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppTable,
    JobTable,
    AppPagination,
    AppJobFilter,
    AppLoading
  },
  data() {
    return {
      loading: false,
      current_page: 1,
      params: {
        limit: 10,
        order_by: []
      },
      // table
      columns: [
        {
          name: "Job part number",
          dataIndex: "job_part_number",
          sortable: true
        },
        {
          name: "Practice",
          dataIndex: "job.platform_job.practice.surgery.name"
        },
        {
          name: "Title",
          dataIndex: "job.title"
        },
        {
          name: "Shift",
          dataIndex: "job.shift.name"
        },
        {
          name: "Rate",
          dataIndex: "job.rate",
          sortable: true
        },
        {
          name: "per",
          dataIndex: "job.locum_detail_rate_type.name"
        },
        {
          name: "From",
          dataIndex: "date_start",
          sortable: true
        },
        {
          name: "To",
          dataIndex: "date_end",
          sortable: true
        },
        {
          name: "Assigned",
          dataIndex:
            "job.platform_job.appointed_to_locum.user.personal_detail.name"
        }
      ],
      // params
      current_page: 1,
      //   params: {
      //     shift_id: "",
      //     rate: "",
      //     locum_detail_rate_type_id: "",
      //     near_post_code: "",
      //     miles: "",
      //     surgery_name: "",
      //     order_by: "date_created:desc"
      //   },
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
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    offset() {
      return this.perPage * (this.current_page - 1);
    },
    perPage() {
      return 10;
    },
    total() {
      return this.$store.state.jobs.locum_ongoing_jobs_count;
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
    // setTimeout(() => {
    //   this.$store.commit("jobs/CLEAR_LOCUM_ALLOCATED_BADGE");
    // }, 1000);
  },
  methods: {
    getJobsCount() {
      this.$store.dispatch("jobs/fetchLocumJobParts", {
        locum_job_status: "Current",
        date_start: [`${this.$moment("2019-11-10").format("YYYY-MM-DD")}:lte`],
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
      this.params.shift_id = "";
      this.params.rate = "";
      this.params.locum_detail_rate_type_id = "";
      this.params.near_post_code = "";
      this.params.miles = "";
      this.params.surgery_name = "";
      this.params.order_by = "date_created:desc";
      this.getJobs(this.current_page, this.params);
    },
    getJobs(page, params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.current_page = page;
      let defaultParams = {
        offset: this.offset,
        limit: this.perPage,
        locum_job_status: "Ongoing"
      };
      let jobParams = { ...params, ...defaultParams };
      this.$store.dispatch("jobs/fetchLocumJobParts", jobParams).finally(() => {
        this.$store.commit("jobs/TOGGLE_LOADING", false);
      });
    },
    pagechanged(e) {
      this.current_page = e;
      this.getJobs(this.current_page, this.params);
    },
    show(item) {
      // this.$router.push(`/jobs/ongoing/${item.id}`);
      this.$router.push(`/jobs/${item.id}?status=ongoing`);
    }
  }
};
</script>