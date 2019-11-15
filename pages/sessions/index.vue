<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <AppButton
          :label="'Filter'"
          @click="showFilter"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          @click="refreshJobs"
          :inStyle="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        />
        <div
          v-if="!isJobPart"
          class="flex-wrap justify-start items-center z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="params.job_number"
              :type="'text'"
              :name="'job_number'"
              :label="'Job number'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppAutoComplete
              class="px-1"
              v-model="params.surgery_id"
              :name="'surgery_id'"
              :label="'Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="params.title"
              :type="'text'"
              :name="'title'"
              :label="'Job Title'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="params.shift_id"
              :type="'select'"
              :name="'shift_id'"
              :label="'Shift'"
              :items="shifts"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="params.rate"
              :type="'text'"
              :name="'rate'"
              :label="'Rate'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="params.rate_type_id"
              :type="'select'"
              :name="'rate_type_id'"
              :label="'per'"
              :items="rates"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppPostCode
              class="px-1"
              v-model="params.near_post_code"
              :name="'near_post_code'"
              :label="'Post code'"
              @onSelect="onSelect"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="params.miles"
              :type="'text'"
              :name="'miles'"
              :label="'Miles'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="params.calendar_date_start"
              :name="'calendar_date_start'"
              :label="'From'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="params.time_start" :name="'time_start'" :label="'Start Time'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="params.calendar_date_end"
              :name="'calendar_date_end'"
              :label="'To'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="params.time_end" :name="'time_end'" :label="'End Time'" />
          </div>
          <div class="md:px-1 flex w-full">
            <AppButton
              :label="'Clear'"
              @click="clearFilters"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
            <AppButton
              class="mx-2"
              :label="'Search'"
              @click="filterJob"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
            <AppButton
              class="mx-2 md:hidden"
              :label="'Close'"
              @click="showFilter"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
          </div>
        </div>
        <div
          v-if="isJobPart"
          class="flex-wrap justify-start items-center z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="jobPartParams.job_part_number"
              :type="'text'"
              :name="'job_part_number'"
              :label="'Job part number'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppAutoComplete
              class="px-1"
              v-model="jobPartParams.job_surgery_id"
              :name="'job_surgery_id'"
              :label="'Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="jobPartParams.job_title"
              :type="'text'"
              :name="'job_title'"
              :label="'Job Title'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="jobPartParams.job_shift_id"
              :type="'select'"
              :name="'job_shift_id'"
              :label="'Shift'"
              :items="shifts"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="jobPartParams.job_rate"
              :type="'text'"
              :name="'job_rate'"
              :label="'Rate'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="jobPartParams.job_rate_type_id"
              :type="'select'"
              :name="'job_rate_type_id'"
              :label="'per'"
              :items="rates"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppPostCode
              class="px-1"
              v-model="jobPartParams.near_post_code"
              :name="'near_post_code'"
              :label="'Post code'"
              @onSelect="onSelect"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="jobPartParams.miles"
              :type="'text'"
              :name="'miles'"
              :label="'Miles'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="jobPartParams.calendar_date_start"
              :name="'calendar_date_start'"
              :label="'From'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="jobPartParams.time_start" :name="'time_start'" :label="'Start Time'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="jobPartParams.calendar_date_end"
              :name="'calendar_date_end'"
              :label="'To'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="jobPartParams.time_end" :name="'time_end'" :label="'End Time'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="jobPartParams.invoice_status"
              :type="'select'"
              :name="'invoice_status'"
              :label="'Invoice Status'"
              :items="invoiceStatusList"
            />
          </div>
          <div class="md:px-1 flex w-full">
            <AppButton
              :label="'Clear'"
              @click="clearFilters"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
            <AppButton
              class="mx-2"
              :label="'Search'"
              @click="filterJob"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
            <AppButton
              class="mx-2 md:hidden"
              :label="'Close'"
              @click="showFilter"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
          </div>
        </div>
        <AppTable
          v-if="jobs.length > 0"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="isJobPart ? jobPartParams.limit : params.limit"
          :columns="columns"
          :orderBy="isJobPart ? jobPartParams.order_by :params.order_by"
          :loading="loading"
          :routerLink="'/sessions'"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        ></AppTable>
        <div v-if="!jobs.length && !loading" class="flex justify-center py-4">{{noJobsToDisplay}}</div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield"
            v-if="$route.name === 'sessions-index-id'"
            :to="{ path: `/sessions?status=${$route.query.status ? $route.query.status : 'Allocated'}`, query: {...$route.query}}"
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
import AppPostCode from "@/components/Base/AppPostCode";
import AppAutoComplete from "@/components/Base/AppAutoComplete";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import { mapGetters } from "vuex";
export default {
  props: ["invoiceStatusList", "shifts", "rates"],
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppTime,
    AppPostCode,
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
        "completed",
        "approved"
      ].includes(query.status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Session Status is Invalid" });
    }
  },
  data() {
    return {
      loading: false,
      current_page: 1,
      // app table params
      params: {
        offset: 0,
        limit: 5,
        order_by: [],
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
        order_by: [],
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
      filterModal: false,
      showTable: false,
      showRefresh: false
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
      getPracticeCancelledJobs: "jobs/getPracticeCancelledJobs"
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
          case "live":
            return this.$store.state.jobs.practice_available_jobs_count;
          case "applied":
            return this.$store.state.jobs.practice_applied_jobs_count;
          case "unsuccessful":
            return this.$store.state.jobs.practice_unsuccessful_jobs_count;
          case "declined":
            return this.$store.state.jobs.practice_declined_jobs_count;
          case "cancelled":
            return this.$store.state.jobs.practice_cancelled_jobs_count;
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
          case "approved":
          case "unfilled":
            return `You do not have any ${this.$route.query.status.toLowerCase()} jobs`;
          case "live":
            return `There are no ${this.$route.query.status.toLowerCase()} jobs nearby and suited for you at this time`;
          case "applied":
            return `There were no Locums who applied on your jobs yet`;
          case "completed":
          case "cancelled":
            return `You have not yet ${this.$route.query.status.toLowerCase()} any job`;
          default:
            return "You do not have any allocated jobs";
        }
      } else {
        return "You do not have any jobs";
      }
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
    getPracticeAllocatedJobs(newValue, oldValue) {
      if (
        this.params.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Allocated"
      ) {
        this.getJobsCount(this.params);
      }
    },
    getPracticeOngoingJobs(newValue, oldValue) {
      if (
        this.jobPartParams.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Ongoing"
      ) {
        this.getJobsCount(this.jobPartParams);
      }
    },
    getPracticeAvailableJobs(newValue, oldValue) {
      if (
        this.params.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Live"
      ) {
        this.getJobsCount(this.params);
      }
    },
    getPracticeAppliedJobs(newValue, oldValue) {
      if (
        this.params.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Applied"
      ) {
        this.getJobsCount(this.params);
      }
    },
    getPracticeUnfilledJobs(newValue, oldValue) {
      if (
        this.params.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Unfilled"
      ) {
        this.getJobsCount(this.params);
      }
    },
    getPracticeDeclinedJobs(newValue, oldValue) {
      if (
        this.params.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Declined"
      ) {
        this.getJobsCount(this.params);
      }
    },
    getPracticeCancelledJobs(newValue, oldValue) {
      if (
        this.params.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Cancelled"
      ) {
        this.getJobsCount(this.params);
      }
    },
    getPracticeCompletedJobs(newValue, oldValue) {
      if (
        this.jobPartParams.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Completed"
      ) {
        this.getJobsCount(this.jobPartParams);
      }
    },
    getPracticeApprovedJobs(newValue, oldValue) {
      if (
        this.jobPartParams.limit < newValue.length &&
        oldValue.length > 0 &&
        this.$route.query.status === "Approved"
      ) {
        this.getJobsCount(this.jobPartParams);
      }
    },
    "$route.query"({ status: newStatus }, { status: oldStatus }) {
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        // this.$store.commit("jobs/TOGGLE_LOADING", true);
        this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION");
        this.current_page = 1;
        this.showTable = false;
        this.filterModal = false;
        this.showRefresh = false;
        setTimeout(async () => {
          await this.clearFilters();
          this.loading = true;
          await this.getJobsCount(
            this.isJobPart ? this.jobPartParams : this.params
          );
          await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
          this.loading = false;
        }, 250);
      }
    }
  },
  async created() {
    this.loading = true;
    await this.getJobsCount(this.isJobPart ? this.jobPartParams : this.params);
    await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
    this.loading = false;
  },
  mounted() {
    this.$socket.on("Practice Notification Job Current", this.getJobsRealTime);
    this.$socket.on(
      "Practice Notification Job Available",
      this.getJobsRealTime
    );
    this.$socket.on("Practice Notification Job Applied", this.getJobsRealTime);
    this.$socket.on("Practice Notification Job Declined", this.getJobsRealTime);
    this.$socket.on(
      "Practice Notification Job Cancelled",
      this.getJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Part Approved",
      this.getJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Part Completed",
      this.getJobsRealTime
    );
    this.$socket.on("Practice Notification Job Updated", this.getJobsRealTime);
  },
  destroyed() {
    this.removeListener();
    this.showRefresh = false;
    this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION");
  },
  methods: {
    getJobsCount(params) {
      let status = [];
      if (!this.$route.query.status) {
        status = ["Allocated"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status === "Available"
      ) {
        status = ["Available", "Matched"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status !== "Available"
      ) {
        status = [`${this.$route.query.status}`];
      }
      this.$axios
        .$get(
          `/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}/count`,
          {
            params: {
              status,
              ...params
            }
          }
        )
        .then(res => {
          console.log("count response", res.data.count);
          if (
            this.$route.query.status &&
            ["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_PRACTICE_${this.$route.query.status.toUpperCase()}_JOB_PARTS_COUNT`,
              res.data.count
            );
          } else if (
            this.$route.query.status &&
            this.$route.query.status.toLowerCase() === "live"
          ) {
            this.$store.commit(
              `jobs/SET_PRACTICE_AVAILABLE_JOBS_COUNT`,
              res.data.count
            );
          } else if (
            this.$route.query.status &&
            !["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_PRACTICE_${this.$route.query.status.toUpperCase()}_JOBS_COUNT`,
              res.data.count
            );
          } else if (!this.$route.query.status) {
            this.$store.commit(
              "jobs/SET_PRACTICE_ALLOCATED_JOBS_COUNT",
              res.data.count
            );
          }
        })
        .catch(err => {
          console.log("err", err.response.data);
        })
        .finally(() => {
          return;
        });
    },
    getJobs(params) {
      let status = [];
      if (!this.$route.query.status) {
        status = ["Allocated"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status === "Available"
      ) {
        status = ["Available", "Matched"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status !== "Available"
      ) {
        status = [`${this.$route.query.status}`];
      }
      this.$axios
        .$get(`/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`, {
          params: {
            status,
            ...params
          }
        })
        .then(res => {
          console.log("jobs response", res.data);
          if (
            this.$route.query.status &&
            ["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_PRACTICE_${this.$route.query.status.toUpperCase()}_JOB_PARTS`,
              res.data.job_parts
            );
          } else if (
            this.$route.query.status &&
            this.$route.query.status.toLowerCase() === "live"
          ) {
            this.$store.commit(
              `jobs/SET_PRACTICE_AVAILABLE_JOBS`,
              res.data.jobs
            );
          } else if (
            this.$route.query.status &&
            !["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_PRACTICE_${this.$route.query.status.toUpperCase()}_JOBS`,
              res.data.jobs
            );
          } else if (!this.$route.query.status) {
            this.$store.commit(
              "jobs/SET_PRACTICE_ALLOCATED_JOBS",
              res.data.jobs
            );
          }
          this.showTable = true;
        })
        .catch(err => {
          console.log("err", err);
        })
        .finally(() => {
          this.$store.commit("jobs/TOGGLE_LOADING", false);
          return;
        });
    },
    getJobsRealTime(job) {
      if (!job) {
        return;
      }
      console.log("job from socket", job);
      this.showRefresh = true;
    },
    async refreshJobs() {
      this.loading = true;
      this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION");
      await this.getJobsCount(
        this.isJobPart ? this.jobPartParams : this.params
      );
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
      this.showRefresh = false;
    },
    removeListener() {
      this.$socket.removeListener(
        "Practice Notification Job Current",
        this.getJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Available",
        this.getJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Applied",
        this.getJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Declined",
        this.getJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Cancelled",
        this.getJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Part Approved",
        this.getJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Part Completed",
        this.getJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Updated",
        this.getJobsRealTime
      );
    },
    showFilter() {
      this.filterModal = !this.filterModal;
    },
    async filterJob() {
      console.log("filter job");
      this.current_page = 1;
      this.params.offset = 0;
      this.jobPartParams.offset = 0;
      this.loading = true;
      this.filterModal = false;
      await this.getJobsCount(
        this.isJobPart ? this.jobPartParams : this.params
      );
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
    },
    async sorted(order_by) {
      console.log("sort job");
      // let orderBy = [...order_by];
      // order_by.forEach((item, index) => {
      //   if (item.includes("date_time_start")) {
      //     orderBy.push(`date_start:${item.split(":")[1]}`);
      //   } else {
      //     orderBy.push(item);
      //   }
      // });
      // console.log(orderBy);
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = order_by;
      this.jobPartParams.offset = 0;
      this.jobPartParams.order_by = order_by;
      this.loading = true;
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
    },
    async pagechanged(page) {
      console.log("change page ");
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.jobPartParams.offset = this.jobPartParams.limit * (page - 1);
      this.loading = true;
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
    },
    async limitchanged(limit) {
      console.log("change limit ");
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.jobPartParams.offset = 0;
      this.jobPartParams.limit = limit;
      this.loading = true;
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
    },
    clearFilters() {
      console.log("clear filter");
      this.params.offset = 0;
      this.params.limit = 5;
      this.params.type = "";
      this.params.job_number = "";
      this.params.surgery_id = "";
      this.params.title = "";
      this.params.shift_id = "";
      this.params.rate = "";
      this.params.rate_type_id = "";
      this.params.order_by = [];

      this.jobPartParams.offset = 0;
      this.jobPartParams.limit = 5;
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
      this.jobPartParams.order_by = [];

      return;
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

