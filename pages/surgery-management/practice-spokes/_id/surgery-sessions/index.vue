<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="toggleTable">
        <AppTable
          v-if="jobs.length > 0"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="isJobPart ? jobPartParams.limit : params.limit"
          :columns="columns"
          :orderBy="isJobPart ? jobPartParams.order_by :params.order_by"
          :loading="loadingJobs"
          :routerLink="`/surgery-management/practice-spokes/${$route.params.id}/surgery-sessions`"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        ></AppTable>
        <div
          v-if="!jobs.length && !loadingJobs"
          class="flex justify-center py-4"
        >{{noJobsToDisplay}}</div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield"
            v-if="$route.name === 'surgery-management-practice-spokes-id-surgery-sessions-index-sessionId'"
            :to="{ path: `/surgery-management/practice-spokes/${$route.params.id}/surgery-sessions?status=${$route.query.status ? $route.query.status : 'Allocated'}`, query: {...$route.query}}"
          ></nuxt-link>
        </transition>
        <div>
          <nuxt-child />
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import debounce from "lodash.debounce";
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppTime from "@/components/Base/AppTime";
import AppAutoComplete from "@/components/Base/AppAutoComplete";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import { mapGetters } from "vuex";
export default {
  props: ["shifts", "rates"],
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppTime,
    AppAutoComplete,
    AppButton,
    AppLoading
  },
  middleware({ query, redirect, error }) {
    if (
      query.status &&
      ![
        "allocated",
        "ongoing",
        "live",
        "applied",
        "unfilled",
        "declined",
        "cancelled",
        "withdrawn",
        "completed",
        "approved"
      ].includes(query.status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Session Status is Invalid" });
    }
  },
  data() {
    return {
      spokeSurgeryId: null,
      current_page: 1,
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: ["date_created:desc"],
        job_number: "",
        title: "",
        type: "",
        surgery_id: "",
        shift_id: "",
        rate: "",
        rate_type_id: "",
        near_post_code: "",
        miles: "",
        calendar_date_start: "",
        calendar_date_end: "",
        time_start: "",
        time_end: ""
      },
      jobPartParams: {
        offset: 0,
        limit: 5,
        order_by: ["job_date_created:desc"],
        job_part_number: "",
        job_title: "",
        job_type: "",
        job_surgery_id: "",
        job_shift_id: "",
        job_rate: "",
        job_rate_type_id: "",
        near_post_code: "",
        miles: "",
        calendar_date_start: "",
        calendar_date_end: "",
        time_start: "",
        time_end: "",
        invoice_status: ""
      },
      // app table column
      filterToggle: false,
      toggleTable: false
    };
  },
  computed: {
    ...mapGetters({
      // parts
      getPracticeOngoingJobs: "jobs/getPracticeOngoingJobs",
      getPracticeCompletedJobs: "jobs/getPracticeCompletedJobs",
      getPracticeApprovedJobs: "jobs/getPracticeApprovedJobs",
      // whole
      getPracticeAllocatedJobs: "jobs/getPracticeAllocatedJobs",
      getPracticeAvailableJobs: "jobs/getPracticeAvailableJobs",
      getPracticeAppliedJobs: "jobs/getPracticeAppliedJobs",
      getPracticeUnfilledJobs: "jobs/getPracticeUnfilledJobs",
      getPracticeDeclinedJobs: "jobs/getPracticeDeclinedJobs",
      getPracticeCancelledJobs: "jobs/getPracticeCancelledJobs",
      getPracticeWithdrawnJobs: "jobs/getPracticeWithdrawnJobs"
    }),
    isJobPart() {
      if (
        !this.$route.query.status ||
        (this.$route.query.status &&
          !["ongoing", "completed", "approved"].includes(
            this.$route.query.status.toLowerCase()
          ))
      ) {
        return false;
      }
      if (
        this.$route.query.status &&
        ["ongoing", "completed", "approved"].includes(
          this.$route.query.status.toLowerCase()
        )
      ) {
        return true;
      }
    },
    total() {
      if (this.$route.query.status) {
        switch (this.$route.query.status.toLowerCase()) {
          // parts
          case "ongoing":
            return this.$store.state.jobs.practice_ongoing_job_parts_count;
          case "completed":
            return this.$store.state.jobs.practice_completed_job_parts_count;
          case "approved":
            return this.$store.state.jobs.practice_approved_job_parts_count;
          // whole
          case "allocated":
            return this.$store.state.jobs.practice_allocated_jobs_count;
          case "available":
            return this.$store.state.jobs.practice_available_jobs_count;
          case "applied":
            return this.$store.state.jobs.practice_applied_jobs_count;
          case "unsuccessful":
            return this.$store.state.jobs.practice_unsuccessful_jobs_count;
          case "declined":
            return this.$store.state.jobs.practice_declined_jobs_count;
          case "cancelled":
            return this.$store.state.jobs.practice_cancelled_jobs_count;
          case "withdrawn":
            return this.$store.state.jobs.practice_withdrawn_jobs_count;
          default:
            return this.$store.state.jobs.practice_allocated_jobs_count;
        }
      } else {
        return this.$store.state.jobs.practice_allocated_jobs_count;
      }
    },
    jobs() {
      if (this.$route.query.status) {
        switch (this.$route.query.status.toLowerCase()) {
          // parts
          case "ongoing":
            return this.getPracticeOngoingJobs;
          case "completed":
            return this.getPracticeCompletedJobs;
          case "approved":
            return this.getPracticeApprovedJobs;
          // whole
          case "allocated":
            return this.getPracticeAllocatedJobs;
          case "live":
            return this.getPracticeAvailableJobs;
          case "applied":
            return this.getPracticeAppliedJobs;
          case "unfilled":
            return this.getPracticeUnfilledJobs;
          case "declined":
            return this.getPracticeDeclinedJobs;
          case "cancelled":
            return this.getPracticeCancelledJobs;
          case "withdrawn":
            return this.getPracticeWithdrawnJobs;
        }
      } else {
        return this.getPracticeAllocatedJobs;
      }
    },
    noJobsToDisplay() {
      if (this.$route.query.status) {
        switch (this.$route.query.status.toLowerCase()) {
          case "allocated":
          case "ongoing":
          case "declined":
          case "cancelled":
          case "withdrawn":
          case "approved":
            return `You do not have any ${this.$route.query.status.toLowerCase()} jobs`;
          case "live":
            return `There are no ${this.$route.query.status.toLowerCase()} jobs nearby and suited for you at this time`;
          case "applied":
          case "unfilled":
            return `You have not yet ${
              this.$route.query.status.toLowerCase() === "applied"
                ? "applied"
                : "rejected"
            } for a job`;
          case "completed":
            return "You have not yet completed any job";
          default:
            return "You do not have any allocated jobs";
        }
      } else {
        return "You do not have any jobs";
      }
    },
    loadingJobs() {
      return this.$store.state.jobs.loading_jobs;
    },
    dispatchUrl() {
      let url = "jobs/fetchPracticeJobs";
      if (
        this.$route.query.status &&
        ["ongoing", "completed", "approved"].includes(
          this.$route.query.status.toLowerCase()
        )
      ) {
        url = "jobs/fetchPracticeJobParts";
      }
      return url;
    },
    columns() {
      let columns = [];
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "allocated";
      if (["ongoing", "completed", "approved"].includes(queryStatus)) {
        columns.push(
          {
            name: "Job Part Number",
            dataIndex: "job_part_number",
            sortable: true
          },
          {
            name: "Practice",
            dataIndex: "job_surgery_name",
            class: "text-center",
            sortable: true
          },
          {
            name: "Title",
            dataIndex: "job_title",
            class: "text-center",
            sortable: true
          },
          {
            name: "Shift",
            dataIndex: "job_shift",
            class: "text-center",
            sortable: true
          },
          {
            name: "Rate",
            dataIndex: "job_rate",
            sortable: true,
            class: "text-center"
          },
          {
            name: "per",
            dataIndex: "job_rate_type",
            class: "text-center",
            sortable: true
          }
        );
      } else if (!["ongoing", "completed", "approved"].includes(queryStatus)) {
        columns.push(
          {
            name: "Job Number",
            dataIndex: "job_number",
            sortable: true
          },
          {
            name: "Practice",
            dataIndex: "surgery_name",
            class: "text-center",
            sortable: true
          },
          {
            name: "Title",
            dataIndex: "title",
            class: "text-center",
            sortable: true
          },
          {
            name: "Shift",
            dataIndex: "shift_name",
            class: "text-center",
            sortable: true
          },
          {
            name: "Rate",
            dataIndex: "rate_name",
            sortable: true,
            class: "text-center"
          },
          {
            name: "per",
            dataIndex: "rate_type_name",
            class: "text-center",
            sortable: true
          }
        );
      }
      columns.push(
        {
          name: "From",
          dataIndex: "date_time_start",
          sortable: true,
          class: "text-center"
        },
        {
          name: "To",
          dataIndex: "date_time_end",
          sortable: true,
          class: "text-center"
        }
      );
      if (queryStatus === "allocated") {
        columns.push({
          name: "Assigned",
          dataIndex: "assigned_to",
          class: "text-center"
        });
      }
      if (queryStatus === "applied") {
        columns.push({
          name: "Applicants",
          dataIndex: "applicants_count",
          class: "text-center"
        });
      }
      if (queryStatus === "unfilled") {
        columns.push({
          name: "Rejected At",
          dataIndex: "platform_job.appointed_at",
          class: "text-center localDate"
        });
      }
      if (queryStatus === "declined") {
        columns.push({
          name: "Rejected At",
          dataIndex: "platform_job.declined_at",
          class: "text-center localDate"
        });
      }
      if (queryStatus === "cancelled") {
        columns.push({
          name: "Cancelled At",
          dataIndex: "platform_job.cancelled_at",
          class: "text-center localDate"
        });
      }
      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "platform_job.withdrawn_at",
          class: "text-center localDate"
        });
      }
      if (["completed", "approved"].includes(queryStatus)) {
        columns.push(
          {
            name: "Completed At",
            dataIndex: "completed_at",
            class: "text-center localDate",
            sortable: true
          },
          {
            name: "Status",
            dataIndex: "invoice_status",
            class: "text-center"
          }
        );
      }
      return columns;
    }
  },
  watch: {
    "$route.query"({ status: newStatus }, { status: oldStatus }) {
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.toggleTable = false;
        this.filterToggle = false;
        setTimeout(() => {
          this.clearJobsBadge(newStatus);
          this.clearFilters();
        }, 1000);
        this.getJobsCount(this.isJobPart ? this.jobPartParams : this.params);
      }
    }
  },
  async asyncData({ app, route }) {
    try {
      const response = await app.$axios.get(
        `/api/v1/practice/me/practice-surgeries/${route.params.id}`
      );
      const spokeSurgeryId =
        response.data &&
        response.data.data &&
        response.data.data.practice_surgery &&
        response.data.data.practice_surgery.surgery &&
        response.data.data.practice_surgery.surgery.id
          ? response.data.data.practice_surgery.surgery.id
          : null;

      return {
        spokeSurgeryId
      };
    } catch (err) {
      console.log("get surgery error", err);
    }
  },
  created() {
    this.getJobsCount(this.isJobPart ? this.jobPartParams : this.params);
    setTimeout(() => {
      this.clearJobsBadge(
        this.$route.query.status ? this.$route.query.status : "Allocated"
      );
    }, 250);
  },
  methods: {
    clearJobsBadge(status) {
      let jobStatus = status.toUpperCase();
      return this.$store.commit(`jobs/CLEAR_PRACTICE_${jobStatus}_BADGE`);
    },
    showFilter() {
      return (this.filterToggle = !this.filterToggle);
    },
    filterJob() {
      this.current_page = 1;
      this.params.offset = 0;
      this.jobPartParams.offset = 0;
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      let jobStatus = this.$route.query.status
        ? this.$route.query.status.toUpperCase()
        : "ALLOCATED";
      if (["ONGOING", "COMPLETED", "APPROVED"].includes(jobStatus)) {
        this.$store.commit(`jobs/SET_PRACTICE_${jobStatus}_JOB_PARTS`, []);
      }
      if (!["ONGOING", "COMPLETED", "APPROVED"].includes(jobStatus)) {
        this.$store.commit(`jobs/SET_PRACTICE_${jobStatus}_JOBS`, []);
      }
      this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.filterToggle = false;
    },
    getJobsCount(params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$store
        .dispatch(`${this.dispatchUrl}`, {
          surgery_id: this.spokeSurgeryId,
          status: [
            `${
              this.$route.query.status ? this.$route.query.status : "Allocated"
            }`
          ],
          countOnly: true,
          ...params
        })
        .finally(() => {
          this.getJobs(params);
        });
    },
    getJobs(params) {
      this.$store.commit("jobs/CLEAR_JOBS");
      this.$store
        .dispatch(`${this.dispatchUrl}`, {
          surgery_id: this.spokeSurgeryId,
          status: [
            `${
              this.$route.query.status ? this.$route.query.status : "Allocated"
            }`
          ],
          ...params
        })
        .finally(() => {
          this.$store.commit("jobs/TOGGLE_LOADING", false);
          this.toggleTable = true;
        });
    },
    sorted(order_by) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.jobPartParams.offset = 0;
      this.jobPartParams.order_by = order_by;
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.jobPartParams.offset = this.jobPartParams.limit * (page - 1);
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.jobPartParams.offset = 0;
      this.jobPartParams.limit = limit;
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
    },
    clearFilters() {
      this.params.type = "";
      this.params.job_number = "";
      this.params.surgery_id = "";
      this.params.title = "";
      this.params.shift_id = "";
      this.params.rate = "";
      this.params.rate_type_id = "";

      this.jobPartParams.job_type = "";
      this.jobPartParams.job_part_number = "";
      this.jobPartParams.job_surgery_id = "";
      this.jobPartParams.job_title = "";
      this.jobPartParams.job_shift_id = "";
      this.jobPartParams.job_rate = "";
      this.jobPartParams.job_rate_type_id = "";
      this.jobPartParams.invoice_status = "";

      this.jobPartParams.near_post_code = "";
      this.jobPartParams.miles = "";
      this.jobPartParams.calendar_date_start = "";
      this.jobPartParams.calendar_date_end = "";
      this.jobPartParams.time_start = "";
      this.jobPartParams.time_end = "";
      this.params.order_by = ["date_created:desc"];
      this.jobPartParams.order_by = ["date_created:desc"];
    },
    onSelect(value) {
      let address_components = value.details.result.address_components;
      let postal_code = address_components.find(component =>
        component.types.includes("postal_code")
      );
      if (!postal_code) {
        this.params.near_post_code = "";
        this.jobPartParams.near_post_code = "";

        return;
      }
      this.params.near_post_code = postal_code.long_name;
      this.jobPartParams.near_post_code = postal_code.long_name;
      this.getJobsCount(this.isJobPart ? this.jobPartParams : this.params);
    }
  }
};
</script>

