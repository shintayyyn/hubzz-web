<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <AppButton
          :label="'Filter'"
          @click="filterModal = !filterModal"
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
              v-model="params.type"
              :type="'select'"
              :name="'type'"
              :label="'Type'"
              :items="practiceTypeList"
            />
          </div>
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
              @click="filterModal = false"
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
              v-model="jobPartParams.job_type"
              :type="'select'"
              :name="'job_type'"
              :label="'Type'"
              :items="practiceTypeList"
            />
          </div>
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
              @click="filterModal = false"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
          </div>
        </div>
        <AppTable
          v-if="jobs.length > 0 && !loading"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="isJobPart ? jobPartParams.limit : params.limit"
          :columns="columns"
          :orderBy="isJobPart ? jobPartParams.order_by :params.order_by"
          :loading="loading"
          :routerLink="routerLink"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        ></AppTable>
        <div v-if="!jobs.length && !loading" class="flex justify-center py-4">{{noJobsToDisplay}}</div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield"
            v-if="$route.name === 'jobs-index-id'"
            :to="{ path: `/jobs?status=${$route.query.status ? $route.query.status : 'Allocated'}`, query: {...$route.query}}"
          ></nuxt-link>
        </transition>
        <div>
          <nuxt-child @appointmentUpdated="appointmentUpdated" />
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
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
  props: ["invoiceStatusList", "practiceTypeList", "shifts", "rates"],
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
        "available",
        "matched",
        "applied",
        "unsuccessful",
        "declined",
        "cancelled",
        "withdrawn",
        "completed",
        "approved"
      ].includes(query.status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Job Status is Invalid" });
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
      getLocumOngoingJobs: "jobs/getLocumOngoingJobs",
      getLocumCompletedJobs: "jobs/getLocumCompletedJobs",
      getLocumApprovedJobs: "jobs/getLocumApprovedJobs",
      // whole
      getLocumAllocatedJobs: "jobs/getLocumAllocatedJobs",
      getLocumAvailableJobs: "jobs/getLocumAvailableJobs",
      getLocumMatchedJobs: "jobs/getLocumMatchedJobs",
      getLocumAppliedJobs: "jobs/getLocumAppliedJobs",
      getLocumUnsuccessfulJobs: "jobs/getLocumUnsuccessfulJobs",
      getLocumDeclinedJobs: "jobs/getLocumDeclinedJobs",
      getLocumCancelledJobs: "jobs/getLocumCancelledJobs",
      getLocumWithdrawnJobs: "jobs/getLocumWithdrawnJobs"
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
            return this.$store.state.jobs.locum_ongoing_job_parts_count;
          case "completed":
            return this.$store.state.jobs.locum_completed_job_parts_count;
          case "approved":
            return this.$store.state.jobs.locum_approved_job_parts_count;
          // whole
          case "allocated":
            return this.$store.state.jobs.locum_allocated_jobs_count;
          case "available":
            return this.$store.state.jobs.locum_available_jobs_count;
          case "matched":
            return this.$store.state.jobs.locum_matched_jobs_count;
          case "applied":
            return this.$store.state.jobs.locum_applied_jobs_count;
          case "unsuccessful":
            return this.$store.state.jobs.locum_unsuccessful_jobs_count;
          case "declined":
            return this.$store.state.jobs.locum_declined_jobs_count;
          case "cancelled":
            return this.$store.state.jobs.locum_cancelled_jobs_count;
          case "withdrawn":
            return this.$store.state.jobs.locum_withdrawn_jobs_count;
          default:
            return this.$store.state.jobs.locum_allocated_jobs_count;
        }
      }
      if (!this.$route.query.status) {
        return this.$store.state.jobs.locum_allocated_jobs_count;
      }
    },
    jobs() {
      if (this.$route.query.status) {
        switch (this.$route.query.status.toLowerCase()) {
          // parts
          case "ongoing":
            return this.getLocumOngoingJobs;
          case "completed":
            return this.getLocumCompletedJobs;
          case "approved":
            return this.getLocumApprovedJobs;
          // whole
          case "allocated":
            return this.getLocumAllocatedJobs;
          case "available":
            return this.getLocumAvailableJobs;
          case "matched":
            return this.getLocumMatchedJobs;
          case "applied":
            return this.getLocumAppliedJobs;
          case "unsuccessful":
            return this.getLocumUnsuccessfulJobs;
          case "declined":
            return this.getLocumDeclinedJobs;
          case "cancelled":
            return this.getLocumCancelledJobs;
          case "withdrawn":
            return this.getLocumWithdrawnJobs;
        }
      }
      if (!this.$route.query.status) {
        return this.getLocumAllocatedJobs;
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
          case "available":
          case "matched":
            return `There are no ${this.$route.query.status.toLowerCase()} jobs nearby and suited for you at this time`;
          case "applied":
          case "unsuccessful":
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
            name: "Surgery",
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
            name: "Surgery",
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
      if (queryStatus === "applied") {
        columns.push({
          name: "Applicants",
          dataIndex: "applicants_count",
          class: "text-center"
        });
      }
      if (queryStatus === "unsuccessful") {
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
            name: "Invoice status",
            dataIndex: "invoice_status",
            class: "text-center"
          },
          {
            name: "Tag",
            dataIndex: "locum_status",
            class: "text-center"
          }
        );
      }
      return columns;
    },
    routerLink() {
      return `/jobs`;
    }
  },
  watch: {
    "$route.query"(newValue, oldValue) {
      let newStatus = newValue.status;
      let oldStatus = oldValue.status;
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
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
    this.$socket.on(
      "Locum Notification Job Available",
      this.getAvailableJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Matched",
      this.getMatchedJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Unsuccessful",
      this.getUnsuccessfulJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Current",
      this.getCurrentJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Ongoing",
      this.getOngoingJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Part Completed",
      this.getCompletedJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Locum Invoice Updated",
      this.getApprovedJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Cancelled",
      this.getCancelledJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Amended",
      this.getAmendedJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Updated",
      this.getUpdatedJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Declined",
      this.getDeclinedJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Auto Declined",
      this.getAutoDeclinedJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Unavailable",
      this.getUnavailableJobsRealTime
    );
    this.$socket.on(
      "Locum Notification Job Unqualified",
      this.getUnqualifiedJobsRealTime
    );
  },
  destroyed() {
    this.removeListener();
    this.showRefresh = false;
  },
  methods: {
    getJobsCount(params) {
      this.loading = true;
      let locum_status = [];
      if (!this.$route.query.status) {
        locum_status = ["Allocated"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status === "Available"
      ) {
        locum_status = ["Available", "Matched"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status === "Completed"
      ) {
        locum_status = ["Completed", "Terminated"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status !== "Available" &&
        this.$route.query.status !== "Completed"
      ) {
        locum_status = [`${this.$route.query.status}`];
      }
      this.$axios
        .$get(`/api/v1/locum/${this.isJobPart ? "job-parts" : "jobs"}/count`, {
          params: {
            locum_status,
            ...params
          }
        })
        .then(res => {
          console.log("count response", res.data.count);
          if (
            this.$route.query.status &&
            ["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_LOCUM_${this.$route.query.status.toUpperCase()}_JOB_PARTS_COUNT`,
              res.data.count
            );
          } else if (
            this.$route.query.status &&
            !["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_LOCUM_${this.$route.query.status.toUpperCase()}_JOBS_COUNT`,
              res.data.count
            );
          } else if (!this.$route.query.status) {
            this.$store.commit(
              "jobs/SET_LOCUM_ALLOCATED_JOBS_COUNT",
              res.data.count
            );
          }
        })
        .catch(err => {
          this.loading = false;
          console.log("err", err.response.data);
        })
        .finally(() => {
          return;
        });
    },
    getJobs(params) {
      let locum_status = [];
      if (!this.$route.query.status) {
        locum_status = ["Allocated"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status === "Available"
      ) {
        locum_status = ["Available", "Matched"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status === "Completed"
      ) {
        locum_status = ["Completed", "Terminated"];
      } else if (
        this.$route.query.status &&
        this.$route.query.status !== "Available" &&
        this.$route.query.status !== "Completed"
      ) {
        locum_status = [`${this.$route.query.status}`];
      }
      this.$axios
        .$get(`/api/v1/locum/${this.isJobPart ? "job-parts" : "jobs"}`, {
          params: {
            locum_status,
            ...params
          }
        })
        .then(res => {
          if (
            this.$route.query.status &&
            ["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_LOCUM_${this.$route.query.status.toUpperCase()}_JOB_PARTS`,
              res.data.job_parts
            );
          } else if (
            this.$route.query.status &&
            !["ongoing", "completed", "approved"].includes(
              this.$route.query.status.toLowerCase()
            )
          ) {
            this.$store.commit(
              `jobs/SET_LOCUM_${this.$route.query.status.toUpperCase()}_JOBS`,
              res.data.jobs
            );
          } else if (!this.$route.query.status) {
            this.$store.commit("jobs/SET_LOCUM_ALLOCATED_JOBS", res.data.jobs);
          }
          this.showTable = true;
        })
        .catch(err => {
          console.log("err", err);
        })
        .finally(() => {
          this.loading = false;
          return;
        });
    },
    async getAvailableJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        this.$route.query.status === "Available"
      ) {
        this.showRefresh = true;
      }
    },
    async getMatchedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (!this.$route.query.status || this.$route.query.status === "Matched")
      ) {
        this.showRefresh = true;
      }
    },
    async getUnsuccessfulJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Unsuccessful" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getCurrentJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getOngoingJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Ongoing" ||
          this.$route.query.status === "Allocated")
      ) {
        this.showRefresh = true;
      }
    },
    async getCompletedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Completed" ||
          this.$route.query.status === "Ongoing")
      ) {
        this.showRefresh = true;
      }
    },
    async getApprovedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Approved" ||
          this.$route.query.status === "Completed")
      ) {
        this.showRefresh = true;
      }
    },
    async getCancelledJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Cancelled" ||
          this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Ongoing" ||
          this.$route.query.status === "Available" ||
          this.$route.query.status === "Matched" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getAmendedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (!this.$route.query.status ||
          this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Ongoing" ||
          this.$route.query.status === "Available" ||
          this.$route.query.status === "Matched" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getUpdatedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Available" ||
          this.$route.query.status === "Matched")
      ) {
        this.showRefresh = true;
      }
    },
    async getDeclinedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Declined" ||
          this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getAutoDeclinedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Declined" ||
          this.$route.query.status === "Allocated")
      ) {
        this.showRefresh = true;
      }
    },
    async getUnavailableJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        this.$route.query.status === "Available"
      ) {
        this.showRefresh = true;
      }
    },
    async getUnqualifiedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        (this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Available" ||
          this.$route.query.status === "Matched" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async appointmentUpdated() {
      this.loading = true;
      // this.$store.commit("jobs/CLEAR_LOCUM_JOB_NOTIFICATION");
      await this.getJobsCount(
        this.isJobPart ? this.jobPartParams : this.params
      );
      // console.log(this.current_page, this.total);
      // return Math.ceil(this.total / this.perPage);
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
    },
    async refreshJobs() {
      this.loading = true;
      // this.$store.commit("jobs/CLEAR_LOCUM_JOB_NOTIFICATION");
      this.current_page = 1;
      this.params.offset = 0;
      this.jobPartParams.offset = 0;
      this.params.limit = 5;
      this.jobPartParams.limit = 5;
      await this.getJobsCount(
        this.isJobPart ? this.jobPartParams : this.params
      );
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
      this.showRefresh = false;
    },
    removeListener() {
      this.$socket.removeListener(
        "Locum Notification Job Available",
        this.getAvailableJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Matched",
        this.getMatchedJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Unsuccessful",
        this.getUnsuccessfulJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Current",
        this.getCurrentJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Ongoing",
        this.getOngoingJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Part Completed",
        this.getCompletedJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Updated",
        this.getApprovedJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Cancelled",
        this.getCancelledJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Amended",
        this.getAmendedJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Updated",
        this.getUpdatedJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Declined",
        this.getDeclinedJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Auto Declined",
        this.getAutoDeclinedJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Unavailable",
        this.getUnavailableJobsRealTime
      );
      this.$socket.removeListener(
        "Locum Notification Job Unqualified",
        this.getUnqualifiedJobsRealTime
      );
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
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.jobPartParams.offset = this.jobPartParams.limit * (page - 1);
      this.loading = true;
      await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      this.loading = false;
    },
    async limitchanged(limit) {
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

