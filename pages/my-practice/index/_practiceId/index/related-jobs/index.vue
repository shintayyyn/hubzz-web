<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="toggleTable">
        <AppLoading :loading="loadingJobs" spinner />
        <AppButton
          class="relative md:hidden"
          :label="'Filter'"
          @click="showFilter()"
          :inStyle="'padding:5px 14px;margin-bottom:5px; font-size:14px;'"
        />
        <div
          v-if="!isJobPart"
          class="md:relative md:flex flex-wrap justify-start items-center"
          :class="filterToggle ? 'z-10 absolute w-full bg-white shadow-md p-3' : 'hidden'"
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
              @click="showFilter"
              :inStyle="'padding:5px 14px;margin-bottom:5px'"
            />
          </div>
        </div>
        <div
          v-if="isJobPart"
          class="md:relative md:flex flex-wrap justify-start items-center"
          :class="filterToggle ? 'z-10 absolute w-full bg-white shadow-md p-3' : 'hidden'"
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
          :loading="loadingJobs"
          :routerLink="`/my-practice/${this.$route.params.practiceId}/related-jobs`"
          @show="show"
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
            v-if="$route.name === `my-practice-index-practiceId-index-related-jobs-index-jobId`"
            :to="{ path: `/my-practice/${$route.params.practiceId}/related-jobs`, query: {...$route.query}}"
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
      query.job_status &&
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
      ].includes(query.job_status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Job Status is Invalid" });
    }
  },
  data() {
    return {
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
        !this.$route.query.job_status ||
        (this.$route.query.job_status &&
          !["ongoing", "completed", "approved"].includes(
            this.$route.query.job_status.toLowerCase()
          ))
      ) {
        return false;
      }
      if (
        this.$route.query.job_status &&
        ["ongoing", "completed", "approved"].includes(
          this.$route.query.job_status.toLowerCase()
        )
      ) {
        return true;
      }
    },
    total() {
      if (this.$route.query.job_status) {
        switch (this.$route.query.job_status.toLowerCase()) {
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
      } else {
        return this.$store.state.jobs.locum_allocated_jobs_count;
      }
    },
    jobs() {
      if (this.$route.query.job_status) {
        switch (this.$route.query.job_status.toLowerCase()) {
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
      } else {
        return this.getLocumAllocatedJobs;
      }
    },
    noJobsToDisplay() {
      if (this.$route.query.job_status) {
        switch (this.$route.query.job_status.toLowerCase()) {
          case "allocated":
          case "ongoing":
          case "declined":
          case "cancelled":
          case "withdrawn":
          case "approved":
            return `You do not have any ${this.$route.query.job_status.toLowerCase()} jobs`;
          case "available":
          case "matched":
            return `There are no ${this.$route.query.job_status.toLowerCase()} jobs nearby and suited for you at this time`;
          case "applied":
          case "unsuccessful":
            return `You have not yet ${
              this.$route.query.job_status.toLowerCase() === "applied"
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
      let url = "jobs/fetchLocumJobs";
      if (
        this.$route.query.job_status &&
        ["ongoing", "completed", "approved"].includes(
          this.$route.query.job_status.toLowerCase()
        )
      ) {
        url = "jobs/fetchLocumJobParts";
      }
      return url;
    },
    columns() {
      let columns = [];
      let queryStatus = this.$route.query.job_status
        ? this.$route.query.job_status.toLowerCase()
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
            name: "Job Part Number",
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
    "$route.query"({ job_status: newStatus }, { job_status: oldStatus }) {
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.toggleTable = false;
        setTimeout(() => {
          this.clearJobsBadge(newStatus);
          this.clearFilters();
        }, 1000);
        this.getJobsCount(this.isJobPart ? this.jobPartParams : this.params);
      }
    }
  },
  created() {
    this.getJobsCount(this.isJobPart ? this.jobPartParams : this.params);
    setTimeout(() => {
      this.clearJobsBadge(
        this.$route.query.job_status
          ? this.$route.query.job_status
          : "Allocated"
      );
    }, 250);
  },
  methods: {
    clearJobsBadge(status) {
      let jobStatus = status.toUpperCase();
      return this.$store.commit(`jobs/CLEAR_LOCUM_${jobStatus}_BADGE`);
    },
    showFilter() {
      return (this.filterToggle = !this.filterToggle);
    },
    filterJob() {
      this.current_page = 1;
      this.params.offset = 0;
      this.jobPartParams.offset = 0;
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      let jobStatus = this.$route.query.job_status
        ? this.$route.query.job_status.toUpperCase()
        : "ALLOCATED";
      if (["ONGOING", "COMPLETED", "APPROVED"].includes(jobStatus)) {
        this.$store.commit(`jobs/SET_LOCUM_${jobStatus}_JOB_PARTS`, []);
      }
      if (!["ONGOING", "COMPLETED", "APPROVED"].includes(jobStatus)) {
        this.$store.commit(`jobs/SET_LOCUM_${jobStatus}_JOBS`, []);
      }
      this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
    },
    getJobsCount(params) {
      this.$store.commit("jobs/TOGGLE_LOADING", true);
      this.$store
        .dispatch(`${this.dispatchUrl}`, {
          locum_status: [
            `${
              this.$route.query.job_status
                ? this.$route.query.job_status
                : "Allocated"
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
          locum_status: [
            `${
              this.$route.query.job_status
                ? this.$route.query.job_status
                : "Allocated"
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
      this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
    },
    pagechanged(page) {
      this.current_page = page;
      this.params.offset = this.params.limit * (page - 1);
      this.jobPartParams.offset = this.jobPartParams.limit * (page - 1);
      this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
    },
    limitchanged(limit) {
      this.current_page = 1;
      this.params.offset = 0;
      this.params.limit = limit;
      this.jobPartParams.offset = 0;
      this.jobPartParams.limit = limit;
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
    // show(item) {
    //   this.$router.push({
    //     path: `/my-practice/${this.$route.params.practiceId}/related-jobs/${item.id}`,
    //     query: { ...this.$route.query }
    //   });
    // },
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

