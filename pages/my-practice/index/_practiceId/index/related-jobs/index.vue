<template>
  <section class="relative">
    <div
      class="flex flex-row justify-start overflow-x-auto py-3 mb-3"
      v-if="$route.query.jobStatus && ['available', 'public', 'bank'].includes($route.query.jobStatus.toLowerCase())"
    >
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Available`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'available'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Available</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Public`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'public'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Public</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.status}&jobStatus=Bank`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'bank'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Bank</nuxt-link>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="relative flex w-full" v-if="initialLoading" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
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
          class="flex-wrap justify-start items-end z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="type"
              :type="'select'"
              :name="'type'"
              :label="'Type'"
              :items="practiceTypeList"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="job_number"
              :type="'text'"
              :name="'job_number'"
              :label="'Job number'"
            />
          </div>
          <div
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
            v-if="!$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() !== 'private')"
          >
            <!-- <AppAutoComplete
              class="px-1"
              v-model="search_practice"
              :name="'practice_id'"
              :label="'Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :data="'surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
              @add="addPractice"
            />-->
            <AppInput
              v-model="practice_id"
              :type="'select'"
              :name="'practice_id'"
              :placeholder="'Select...'"
              :label="'Surgery'"
              :items="practiceLists"
            />
          </div>
          <div
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
            v-if="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'private'"
          >
            <!-- <AppAutoComplete
              class="px-1"
              v-model="search_private_practice"
              :name="'job_private_practice_id'"
              :label="'Private Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :data="'surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
              @add="addPrivatePractice"
            />-->
            <AppInput
              v-model="private_practice_id"
              :type="'select'"
              :name="'practice_id'"
              :placeholder="'Select...'"
              :label="'Surgery'"
              :items="practiceLists"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="title"
              :type="'text'"
              :name="'title'"
              :label="'Job Title'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="shift_id"
              :type="'select'"
              :name="'shift_id'"
              :label="'Shift'"
              :items="shifts"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="rate"
              :type="'number'"
              :name="'rate'"
              :label="'Rate'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="rate_type_id"
              :type="'select'"
              :name="'rate_type_id'"
              :label="'per'"
              :items="rates"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="calendar_date_start"
              :name="'calendar_date_start'"
              :label="'From'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="time_start" :name="'time_start'" :label="'Start Time'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="calendar_date_end"
              :name="'calendar_date_end'"
              :label="'To'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="time_end" :name="'time_end'" :label="'End Time'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppPostCode
              class="px-1"
              v-model="near_post_code"
              :name="'near_post_code'"
              :label="'Post code'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput class="px-1" v-model="miles" :type="'text'" :name="'miles'" :label="'Miles'" />
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
              v-model="job_type"
              :type="'select'"
              :name="'job_type'"
              :label="'Type'"
              :items="practiceTypeList"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="job_part_number"
              :type="'text'"
              :name="'job_part_number'"
              :label="'Job part number'"
            />
          </div>
          <!-- <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppAutoComplete
              class="px-1"
              v-model="job_practice_id"
              :name="'job_practice_id'"
              :label="'Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppAutoComplete
              class="px-1"
              v-model="job_private_practice_id"
              :name="'job_practice_id'"
              :label="'Private Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
            />
          </div>-->
          <div
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
            v-if="!$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() !== 'private')"
          >
            <!-- <AppAutoComplete
              class="px-1"
              v-model="search_practice"
              :name="'job_practice_id'"
              :label="'Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :data="'surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
              @add="addPractice"
            />-->
            <AppInput
              v-model="job_practice_id"
              :type="'select'"
              :name="'practice_id'"
              :placeholder="'Select...'"
              :label="'Surgery'"
              :items="practiceLists"
            />
          </div>
          <div
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
            v-if="$route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'private'"
          >
            <!-- <AppAutoComplete
              class="px-1"
              v-model="search_private_practice"
              :name="'job_private_practice_id'"
              :label="'Private Surgery'"
              :url="'/api/v1/locum/surgeries'"
              :data="'surgeries'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem'"
              @add="addPrivatePractice"
            />-->
            <AppInput
              v-model="job_private_practice_id"
              :type="'select'"
              :name="'practice_id'"
              :placeholder="'Select...'"
              :label="'Surgery'"
              :items="practiceLists"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="job_title"
              :type="'text'"
              :name="'job_title'"
              :label="'Job Title'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="job_shift_id"
              :type="'select'"
              :name="'job_shift_id'"
              :label="'Shift'"
              :items="shifts"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="job_rate"
              :type="'number'"
              :name="'job_rate'"
              :label="'Rate'"
              :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="job_rate_type_id"
              :type="'select'"
              :name="'job_rate_type_id'"
              :label="'per'"
              :items="rates"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="calendar_date_start"
              :name="'calendar_date_start'"
              :label="'From'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="time_start" :name="'time_start'" :label="'Start Time'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="calendar_date_end"
              :name="'calendar_date_end'"
              :label="'To'"
              :format="'YYYY-MM-DD'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppTime v-model="time_end" :name="'time_end'" :label="'End Time'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppPostCode
              class="px-1"
              v-model="near_post_code"
              :name="'near_post_code'"
              :label="'Post code'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput class="px-1" v-model="miles" :type="'text'" :name="'miles'" :label="'Miles'" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              class="px-1"
              v-model="invoice_status"
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
          v-if="jobs.length > 0"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="limit"
          :columns="columns"
          :orderBy="order_by"
          :loading="loading"
          :routerLink="`/my-practice/${$route.params.practiceId}/related-jobs`"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        ></AppTable>
        <!-- <div
          class="relative flex w-full"
          v-if="jobs.length === 0 && loading"
          style="min-height:80px"
        >
          <AppLoading :loading="loading" spinner />
        </div>-->
        <div
          v-if="!jobs.length && !loading && !isFiltered"
          class="flex justify-center py-4"
        >{{noJobsToDisplay}}</div>
        <div
          v-if="!jobs.length && !loading && isFiltered"
          class="flex justify-center py-4"
        >No Jobs Found</div>
        <transition name="fade" mode="out-in">
          <nuxt-link
            class="shield"
            v-if="$route.name === 'my-practice-index-practiceId-index-related-jobs-index-jobId'"
            :to="{ path: `/my-practice/${$route.params.practiceId}/related-jobs?status=${$route.query.jobStatus ? $route.query.jobStatus : 'Allocated'}`, query: {...$route.query}}"
          ></nuxt-link>
        </transition>
        <div>
          <nuxt-child
            @appointmentUpdated="appointmentUpdated"
            @applied="filterJobList"
            @cancelled="filterJobList"
            @unassign="filterJobList"
          />
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
export default {
  props: ["invoiceStatusList", "practiceTypeList"],
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
      query.jobStatus &&
      ![
        "allocated",
        "ongoing",
        "available",
        "public",
        "bank",
        "applied",
        "unsuccessful",
        "withdrawn",
        "cancelled",
        "completed",
        "approved",
        "private"
      ].includes(query.jobStatus.toLowerCase())
    ) {
      return error({ status: 404, message: "This Job Status is Invalid" });
    }
  },
  data() {
    return {
      practiceLists: [],
      total: 0,
      jobs: [],
      initialLoading: false,
      loading: false,
      current_page: 1,
      // app table params
      search_practice: null,
      search_private_practice: null,
      offset: 0,
      limit: 5,
      order_by: [],
      job_number: "",
      job_part_number: "",
      title: "",
      job_title: "",
      type: "",
      job_type: "",
      practice_id: "",
      job_practice_id: "",
      private_practice_id: "",
      job_private_practice_id: "",
      shift_id: "",
      job_shift_id: "",
      rate: "",
      job_rate: "",
      rate_type_id: "",
      job_rate_type_id: "",
      near_post_code: "",
      miles: "",
      calendar_date_start: "",
      calendar_date_end: "",
      time_start: "",
      time_end: "",
      invoice_status: "",
      shifts: [],
      rates: [],
      filterModal: false,
      isFiltered: false,
      showRefresh: false
    };
  },
  computed: {
    isJobPart() {
      if (
        !this.$route.query.jobStatus ||
        (this.$route.query.jobStatus &&
          ![
            "ongoing",
            "completed",
            "approved",
            "cancelled",
            "withdrawn"
          ].includes(this.$route.query.jobStatus.toLowerCase()))
      ) {
        return false;
      }
      if (
        this.$route.query.jobStatus &&
        ["ongoing", "completed", "approved", "cancelled", "withdrawn"].includes(
          this.$route.query.jobStatus.toLowerCase()
        )
      ) {
        return true;
      }
    },
    noJobsToDisplay() {
      let queryStatus = this.$route.query.jobStatus
        ? this.$route.query.jobStatus.toLowerCase()
        : "";
      switch (queryStatus) {
        case "allocated":
        case "ongoing":
        case "declined":
        case "cancelled":
        case "withdrawn":
        case "approved":
        case "private":
          return `You do not have any ${queryStatus} jobs`;
        case "available":
        case "matched":
          return `There are no ${queryStatus} jobs nearby and suited for you at this time`;
        case "public":
        case "bank":
          return `There are no available jobs nearby and suited for you at this time`;
        case "applied":
        case "unsuccessful":
          return `You have not yet ${
            queryStatus === "applied" ? "applied" : "rejected"
          } for a job`;
        case "completed":
          return "You have not yet completed any job";

        default:
          return "You do not have any allocated jobs";
      }
    },
    columns() {
      let columns = [];
      let queryStatus = this.$route.query.jobStatus
        ? this.$route.query.jobStatus.toLowerCase()
        : "allocated";
      if (
        ["ongoing", "completed", "approved", "cancelled", "withdrawn"].includes(
          queryStatus
        )
      ) {
        columns.push(
          {
            name: "Job Part Number",
            dataIndex: "job_part_number",
            sortable: true
          },
          {
            name: "Surgery",
            dataIndex: "practice_name",
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
            dataIndex: "job.shift.name",
            class: "text-center",
            sortable: true
          },
          {
            name: "Rate",
            dataIndex: "job.rate",
            sortable: true,
            class: "text-center"
          },
          {
            name: "per",
            dataIndex: "job.locum_detail_rate_type.name",
            class: "text-center",
            sortable: true
          }
        );
      } else if (
        ![
          "ongoing",
          "completed",
          "approved",
          "cancelled",
          "withdrawn"
        ].includes(queryStatus)
      ) {
        columns.push(
          {
            name: "Job Number",
            dataIndex: "job_number",
            sortable: true
          },
          {
            name: "Surgery",
            dataIndex: "practice_name",
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
            dataIndex: "rate",
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
          dataIndex: "date_start",
          sortable: true,
          class: "text-center"
        },
        {
          name: "To",
          dataIndex: "date_end",
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
      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "job.platform_job.declined_at",
          class: "text-center localDate"
        });
      }
      if (queryStatus === "cancelled") {
        columns.push({
          name: "Cancelled At",
          dataIndex: "job.platform_job.cancelled_at",
          class: "text-center localDate"
        });
      }
      if (["completed", "approved"].includes(queryStatus)) {
        columns.push(
          {
            name: "Completed At",
            dataIndex: "completed_at",
            class: "text-center localDate"
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
    }
  },
  watch: {
    async "$route.query"(newValue, oldValue) {
      let newStatus = newValue.jobStatus;
      let oldStatus = oldValue.jobStatus;
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1;
        this.filterModal = false;
        this.showRefresh = false;
        this.total = 0;
        this.jobs = [];
        this.clearFilters();
        this.isFiltered = false;
        this.initialLoading = true;
        await this.getJobsPromiseAll();
        this.initialLoading = false;
      }
    }
  },
  async asyncData({ app, params, query, store, error }) {
    try {
      let locum_status = [];
      let queryStatus = query.jobStatus;

      if (!queryStatus) {
        locum_status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
          case "Available":
          case "Bank":
            locum_status = ["Matched"];
            break;
          case "Public":
            locum_status = ["Available"];
            break;
          case "Completed":
            locum_status = ["Completed", "Terminated"];
            break;
          case "Private":
            locum_status = [];
            break;
          case "Withdrawn":
            locum_status = ["Declined"];
            break;
          default:
            locum_status = [`${queryStatus}`];
            break;
        }
      }

      let isJobPart = false;
      if (
        queryStatus &&
        ["ongoing", "completed", "approved", "cancelled", "withdrawn"].includes(
          queryStatus.toLowerCase()
        )
      ) {
        isJobPart = true;
      }

      let offset = 0;
      let limit = 5;
      let order_by = [];
      let job_number = "";
      let job_part_number = "";
      let title = "";
      let job_title = "";
      let type = "";
      let job_type = "";
      let practice_id = params.practiceId;
      let job_practice_id = params.practiceId;
      let shift_id = "";
      let job_shift_id = "";
      let rate = "";
      let job_rate = "";
      let rate_type_id = "";
      let job_rate_type_id = "";
      let near_post_code = "";
      let miles = "";
      let calendar_date_start = "";
      let calendar_date_end = "";
      let time_start = "";
      let time_end = "";
      let invoice_status = "";

      const [shifts, rates, total, jobs] = await Promise.all([
        app.$axios.$get(`/api/v1/shifts`).then(res => {
          let shifts = [];
          shifts.push({ label: "All", value: "" });
          res.data.shifts.forEach(shift => {
            shifts.push({ label: shift.name, value: shift.id });
          });
          return shifts;
        }),
        app.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
          let rates = [];
          rates.push({ label: "All", value: "" });
          res.data.locum_detail_rate_types.forEach(rateType => {
            rates.push({ label: rateType.name, value: rateType.id });
          });
          return rates;
        }),
        app.$axios
          .$get(`/api/v1/locum/${isJobPart ? "job-parts" : "jobs"}/count`, {
            params: {
              locum_status,
              order_by: [],
              job_number: !isJobPart ? job_number : "",
              job_part_number: isJobPart ? job_part_number : "",
              title: !isJobPart ? title : "",
              job_title: isJobPart ? job_title : "",
              type: !isJobPart ? type : "",
              job_type: isJobPart ? job_type : "",
              practice_id: !isJobPart ? practice_id : "",
              job_practice_id: isJobPart ? job_practice_id : "",
              shift_id: !isJobPart ? shift_id : "",
              job_shift_id: isJobPart ? job_shift_id : "",
              rate: !isJobPart ? rate : "",
              job_rate: isJobPart ? job_rate : "",
              rate_type_id: !isJobPart ? rate_type_id : "",
              job_rate_type_id: isJobPart ? job_rate_type_id : "",
              near_post_code: isJobPart ? near_post_code : "",
              miles: isJobPart ? miles : "",
              calendar_date_start: isJobPart ? calendar_date_start : "",
              calendar_date_end: isJobPart ? calendar_date_end : "",
              time_start: isJobPart ? time_start : "",
              time_end: isJobPart ? time_end : "",
              invoice_status: isJobPart ? invoice_status : "",
              type: queryStatus === "Private" ? "Private" : "Platform",
              practice_is_favorite_of_locum: queryStatus === "Bank" ? true : ""
            }
          })
          .then(res => {
            let total = 0;
            total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(`/api/v1/locum/${isJobPart ? "job-parts" : "jobs"}`, {
            params: {
              offset: 0,
              limit: 5,
              locum_status,
              order_by: [],
              job_number: !isJobPart ? job_number : "",
              job_part_number: isJobPart ? job_part_number : "",
              title: !isJobPart ? title : "",
              job_title: isJobPart ? job_title : "",
              type: !isJobPart ? type : "",
              job_type: isJobPart ? job_type : "",
              practice_id: !isJobPart ? practice_id : "",
              job_practice_id: isJobPart ? job_practice_id : "",
              shift_id: !isJobPart ? shift_id : "",
              job_shift_id: isJobPart ? job_shift_id : "",
              rate: !isJobPart ? rate : "",
              job_rate: isJobPart ? job_rate : "",
              rate_type_id: !isJobPart ? rate_type_id : "",
              job_rate_type_id: isJobPart ? job_rate_type_id : "",
              near_post_code: isJobPart ? near_post_code : "",
              miles: isJobPart ? miles : "",
              calendar_date_start: isJobPart ? calendar_date_start : "",
              calendar_date_end: isJobPart ? calendar_date_end : "",
              time_start: isJobPart ? time_start : "",
              time_end: isJobPart ? time_end : "",
              invoice_status: isJobPart ? invoice_status : "",
              type: queryStatus === "Private" ? "Private" : "Platform",
              practice_is_favorite_of_locum: queryStatus === "Bank" ? true : ""
            }
          })
          .then(res => {
            let jobs = 0;
            jobs =
              res.data && res.data.jobs
                ? res.data.jobs
                : res.data.job_parts
                ? res.data.job_parts
                : [];
            return jobs;
          })
      ]);

      return {
        shifts,
        rates,
        total,
        jobs
      };
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.$axios
      .$get(`/api/v1/locum/practices`, {
        params: {
          status: "Active",
          locum_practice_type: "Applied"
        }
      })
      .then(res => {
        this.practiceLists = res.data.practices.map(item => {
          return {
            label: item.name,
            value: item.id
          };
        });
        console.log(res);
      });
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
      "Locum Notification Job Terminated",
      this.getTerminatedJobsRealTime
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
    addPractice(payload) {
      this.search_practice = payload.name;
      this.practice_id = payload.id;
    },
    addPrivatePractice(payload) {
      this.search_private_practice = payload.name;
      this.private_practice_id = payload.id;
    },
    filterJobList(id) {
      this.jobs = this.jobs.filter(item => item.id !== id);
    },
    getJobsPromiseAll() {
      let locum_status = [];
      let queryStatus = this.$route.query.jobStatus;

      if (queryStatus) {
        switch (queryStatus) {
          case "Available":
          case "Bank":
            locum_status = ["Matched"];
            break;
          case "Public":
            locum_status = ["Available"];
            break;
          case "Completed":
            locum_status = ["Completed", "Terminated"];
            break;
          case "Private":
            locum_status = [];
            break;
          case "Withdrawn":
            locum_status = ["Declined"];
            break;
          default:
            locum_status = [`${queryStatus}`];
            break;
        }
      } else if (!queryStatus) {
        locum_status = ["Allocated"];
      }
      console.log(this.practice_id);
      return Promise.all([
        this.$axios.$get(
          `/api/v1/locum/${this.isJobPart ? "job-parts" : "jobs"}/count`,
          {
            params: {
              locum_status,
              order_by: [],
              job_number: !this.isJobPart ? this.job_number : "",
              job_part_number: this.isJobPart ? this.job_part_number : "",
              title: !this.isJobPart ? this.title : "",
              job_title: this.isJobPart ? this.job_title : "",
              type: !this.isJobPart ? this.type : "",
              job_type: this.isJobPart ? this.job_type : "",
              practice_id: !this.isJobPart ? this.$route.params.practiceId : "",
              job_practice_id: this.isJobPart
                ? this.$route.params.practiceId
                : "",
              shift_id: !this.isJobPart ? this.shift_id : "",
              job_shift_id: this.isJobPart ? this.job_shift_id : "",
              rate: !this.isJobPart ? this.rate : "",
              job_rate: this.isJobPart ? this.job_rate : "",
              rate_type_id: !this.isJobPart ? this.rate_type_id : "",
              job_rate_type_id: this.isJobPart ? this.job_rate_type_id : "",
              near_post_code: this.isJobPart ? this.near_post_code : "",
              miles: this.isJobPart ? this.miles : "",
              calendar_date_start: this.isJobPart
                ? this.calendar_date_start
                : "",
              calendar_date_end: this.isJobPart ? this.calendar_date_end : "",
              time_start: this.isJobPart ? this.time_start : "",
              time_end: this.isJobPart ? this.time_end : "",
              invoice_status: this.isJobPart ? this.invoice_status : "",
              type: queryStatus === "Private" ? "Private" : "Platform",
              practice_is_favorite_of_locum: queryStatus === "Bank" ? true : ""
            }
          }
        ),
        this.$axios.$get(
          `/api/v1/locum/${this.isJobPart ? "job-parts" : "jobs"}`,
          {
            params: {
              offset: 0,
              limit: 5,
              locum_status,
              order_by: [],
              job_number: !this.isJobPart ? this.job_number : "",
              job_part_number: this.isJobPart ? this.job_part_number : "",
              title: !this.isJobPart ? this.title : "",
              job_title: this.isJobPart ? this.job_title : "",
              type: !this.isJobPart ? this.type : "",
              job_type: this.isJobPart ? this.job_type : "",
              practice_id: !this.isJobPart ? this.$route.params.practiceId : "",
              job_practice_id: this.isJobPart
                ? this.$route.params.practiceId
                : "",
              shift_id: !this.isJobPart ? this.shift_id : "",
              job_shift_id: this.isJobPart ? this.job_shift_id : "",
              rate: !this.isJobPart ? this.rate : "",
              job_rate: this.isJobPart ? this.job_rate : "",
              rate_type_id: !this.isJobPart ? this.rate_type_id : "",
              job_rate_type_id: this.isJobPart ? this.job_rate_type_id : "",
              near_post_code: this.isJobPart ? this.near_post_code : "",
              miles: this.isJobPart ? this.miles : "",
              calendar_date_start: this.isJobPart
                ? this.calendar_date_start
                : "",
              calendar_date_end: this.isJobPart ? this.calendar_date_end : "",
              time_start: this.isJobPart ? this.time_start : "",
              time_end: this.isJobPart ? this.time_end : "",
              invoice_status: this.isJobPart ? this.invoice_status : "",
              type: queryStatus === "Private" ? "Private" : "Platform",
              practice_is_favorite_of_locum: queryStatus === "Bank" ? true : ""
            }
          }
        )
      ])
        .then(([responseCount, responseJobs]) => {
          this.jobs =
            responseJobs.data && responseJobs.data.jobs
              ? responseJobs.data.jobs
              : responseJobs.data.job_parts
              ? responseJobs.data.job_parts
              : [];
          this.total = responseCount.data.count;
        })
        .catch(err => {
          console.log("err", err.response || err);
          throw err;
        });
    },
    getJobs() {
      let locum_status = [];
      let queryStatus = this.$route.query.jobStatus;

      if (!queryStatus) {
        locum_status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
          case "Available":
          case "Bank":
            locum_status = ["Matched"];
            break;
          case "Public":
            locum_status = ["Available"];
            break;
          case "Completed":
            locum_status = ["Completed", "Terminated"];
            break;
          case "Withdrawn":
            locum_status = ["Declined"];
            break;
          case "Private":
            locum_status = [];
            break;
          default:
            locum_status = [`${queryStatus}`];
            break;
        }
      }

      return this.$axios
        .$get(`/api/v1/locum/${this.isJobPart ? "job-parts" : "jobs"}`, {
          params: {
            offset: this.offset,
            limit: this.limit,
            locum_status,
            order_by: this.order_by,
            job_number: !this.isJobPart ? this.job_number : "",
            job_part_number: this.isJobPart ? this.job_part_number : "",
            title: !this.isJobPart ? this.title : "",
            job_title: this.isJobPart ? this.job_title : "",
            type: !this.isJobPart ? this.type : "",
            job_type: this.isJobPart ? this.job_type : "",
            practice_id: !this.isJobPart ? this.$route.params.practiceId : "",
            job_practice_id: this.isJobPart
              ? this.$route.params.practiceId
              : "",
            shift_id: !this.isJobPart ? this.shift_id : "",
            job_shift_id: this.isJobPart ? this.job_shift_id : "",
            rate: !this.isJobPart ? this.rate : "",
            job_rate: this.isJobPart ? this.job_rate : "",
            rate_type_id: !this.isJobPart ? this.rate_type_id : "",
            job_rate_type_id: this.isJobPart ? this.job_rate_type_id : "",
            near_post_code: this.isJobPart ? this.near_post_code : "",
            miles: this.isJobPart ? this.miles : "",
            calendar_date_start: this.isJobPart ? this.calendar_date_start : "",
            calendar_date_end: this.isJobPart ? this.calendar_date_end : "",
            time_start: this.isJobPart ? this.time_start : "",
            time_end: this.isJobPart ? this.time_end : "",
            invoice_status: this.isJobPart ? this.invoice_status : "",
            type: queryStatus === "Private" ? "Private" : "Platform",
            practice_is_favorite_of_locum: queryStatus === "Bank" ? true : ""
          }
        })
        .then(res => {
          this.jobs =
            res.data && res.data.jobs
              ? res.data.jobs
              : res.data.job_parts
              ? res.data.job_parts
              : [];
        })
        .catch(err => {
          console.log("err", err.response || err);
          throw err;
        });
    },
    async getAvailableJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        this.$route.query.jobStatus === "Available"
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
        (this.$route.query.jobStatus === "Available" ||
          this.$route.query.jobStatus === "Matched")
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
        (this.$route.query.jobStatus === "Unsuccessful" ||
          this.$route.query.jobStatus === "Applied")
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
        (this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Applied")
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
        (this.$route.query.jobStatus === "Ongoing" ||
          this.$route.query.jobStatus === "Allocated")
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
        (this.$route.query.jobStatus === "Completed" ||
          this.$route.query.jobStatus === "Ongoing")
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
        (this.$route.query.jobStatus === "Approved" ||
          this.$route.query.jobStatus === "Completed")
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
        (this.$route.query.jobStatus === "Cancelled" ||
          this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Ongoing" ||
          this.$route.query.jobStatus === "Available" ||
          this.$route.query.jobStatus === "Matched" ||
          this.$route.query.jobStatus === "Applied")
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
        (!this.$route.query.jobStatus ||
          this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Ongoing" ||
          this.$route.query.jobStatus === "Available" ||
          this.$route.query.jobStatus === "Matched" ||
          this.$route.query.jobStatus === "Applied")
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
        (this.$route.query.jobStatus === "Available" ||
          this.$route.query.jobStatus === "Matched")
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
        (this.$route.query.jobStatus === "Declined" ||
          this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getTerminatedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        this.$route.query.jobStatus === "Ongoing"
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
        (this.$route.query.jobStatus === "Declined" ||
          this.$route.query.jobStatus === "Allocated")
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
        this.$route.query.jobStatus === "Available"
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
        (this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Available" ||
          this.$route.query.jobStatus === "Matched" ||
          this.$route.query.jobStatus === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async appointmentUpdated() {
      // this.loading = true;
      // await this.getJobsCount(
      //   this.isJobPart ? this.jobPartParams : this.params
      // );
      // await this.getJobs(this.isJobPart ? this.jobPartParams : this.params);
      // this.loading = false;
    },
    async refreshJobs() {
      this.current_page = 1;
      this.offset = 0;
      this.limit = 5;
      this.initialLoading = true;
      await this.getJobsPromiseAll();
      this.initialLoading = false;
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
        "Locum Notification Job Terminated",
        this.getTerminatedJobsRealTime
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
      this.current_page = 1;
      this.offset = 0;
      this.limit = 5;
      this.initialLoading = true;
      this.isFiltered = true;
      await this.getJobsPromiseAll();
      this.initialLoading = false;
      this.filterModal = false;
    },
    async sorted(order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1];
        let sorting = item.split(":")[0];
        switch (sorting) {
          case "date_time_start":
            sorting = "date_start";
            break;
          case "date_time_end":
            sorting = "date_end";
            break;
          case "rate_name":
            sorting = "rate";
            break;
          default:
            sorting;
        }
        return `${sorting}:${order}`;
      });
      this.current_page = 1;
      this.offset = 0;
      this.order_by = orderBy;
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },
    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },
    async limitchanged(limit) {
      this.current_page = 1;
      this.offset = 0;
      this.limit = limit;
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },
    clearFilters() {
      this.search_practice = null;
      this.search_private_practice = null;
      this.offset = 0;
      this.limit = 5;
      this.order_by = [];
      this.job_number = "";
      this.job_part_number = "";
      this.title = "";
      this.job_title = "";
      this.type = "";
      this.job_type = "";
      this.practice_id = "";
      this.job_practice_id = "";
      this.private_practice_id = "";
      this.job_private_practice_id = "";
      this.shift_id = "";
      this.job_shift_id = "";
      this.rate = "";
      this.job_rate = "";
      this.rate_type_id = "";
      this.job_rate_type_id = "";
      this.near_post_code = "";
      this.miles = "";
      this.calendar_date_start = "";
      this.calendar_date_end = "";
      this.time_start = "";
      this.time_end = "";
      this.invoice_status = "";
    }
  }
};
</script>

