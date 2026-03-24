<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div
        v-if="initialLoading"
        class="relative flex w-full"
        style="min-height:80px"
      >
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppButton
          :label="'Filter'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="filterModal = !filterModal"
        />

        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="refreshJobs"
        />

        <div
          class="flex-wrap justify-start items-center z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_part_number_includes"
              class="px-1"
              :type="'text'"
              :name="'job_part_number_includes'"
              :label="'Job part number'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_title_includes"
              class="px-1"
              :type="'text'"
              :name="'job_title_includes'"
              :label="'Job Title'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_shift_id"
              class="px-1"
              :type="'select'"
              :name="'job_shift_id'"
              :label="'Shift'"
              :items="shifts"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_rate"
              class="px-1"
              :type="'text'"
              :name="'job_rate'"
              :label="'Rate £'"
              :in-style="
                'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'
              "
              :limit="8"
              @keydown="isNumber($event)"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_rate_type_id"
              class="px-1"
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
            <AppTime
              v-model="time_start"
              :name="'time_start'"
              :label="'Start Time'"
            />
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
            <AppTime
              v-model="time_end"
              :name="'time_end'"
              :label="'End Time'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppPostCode
              v-model="near_post_code"
              class="px-1"
              :name="'near_post_code'"
              :label="'Post code'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="miles"
              class="px-1"
              :type="'number'"
              :name="'miles'"
              :label="'Miles'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="invoice_status"
              class="px-1"
              :type="'select'"
              :name="'invoice_status'"
              :label="'Invoice Status'"
              :items="invoiceStatusList"
            />
          </div>

          <div class="md:px-1 flex w-full">
            <AppButton
              :label="'Clear'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="clearFilters"
            />

            <AppButton
              class="mx-2"
              :label="'Search'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="filterJob"
            />

            <AppButton
              class="mx-2 md:hidden"
              :label="'Close'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="filterModal = false"
            />
          </div>
        </div>

        <AppTable
          v-if="jobs.length > 0"
          :total="total"
          :items="jobs"
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          :loading="loading"
          :routerLink="routerLink"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        />

        <div
          v-if="!jobs.length && !loading && !isFiltered"
          class="flex justify-center py-4"
        >
          {{ noJobsToDisplay }}
        </div>

        <div
          v-if="!jobs.length && !loading && isFiltered"
          class="flex justify-center py-4"
        >
          No Jobs Found
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="$route.name === 'locum-job-parts-index-jobPartId'"
            class="shield"
            :to="{
              path: `/locum-job-parts?status=${
                $route.query.status ? $route.query.status : 'Allocated'
              }`,
              query: { ...$route.query }
            }"
          />
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
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";

export default {
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppTime,
    AppPostCode,
    AppButton,
    AppLoading
  },

  props: {
    invoiceStatusList: {
      type: Array,
      default: () => []
    },
    practiceTypeList: {
      type: Array,
      default: () => []
    }
  },

  middleware({ query, error }) {
    if (
      query.status &&
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
      ].includes(query.status.toLowerCase())
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
      viewing_locum_user_id: [],
      title_includes: "",
      job_title_includes: "",
      job_number_includes: "",
      job_part_number_includes: "",
      shifts: [],
      rates: [],
      filterModal: false,
      isFiltered: false,
      showRefresh: false
    };
  },

  computed: {
    isJobPart() {
      return true;
    },

    getRequestQueryFilters() {
      let locum_status = [];

      let queryStatus = this.$route.query.status;

      if (queryStatus) {
        switch (queryStatus) {
        // case "Bank":
        //   locum_status = ["Matched"];
        //   break;
        case "Completed":
          locum_status = ["Completed"];
          break;
        case "Available":
          locum_status = ["Matched", "Available"];
          break;
          // case "Public":
          //   locum_status = ["Available"];
          //   break;
        case "Private":
          locum_status = [];
          break;
        default:
          locum_status = [`${queryStatus}`];
          break;
        }
      } else if (!queryStatus) {
        locum_status = ["Allocated"];
      }

      return {
        locum_status,
        practice_id:
          !this.isJobPart && (!queryStatus || queryStatus !== "Private")
            ? this.practice_id
            : "",
        job_practice_id:
          this.isJobPart && (!queryStatus || queryStatus !== "Private")
            ? this.job_practice_id
            : "",
        private_practice_id:
          !this.isJobPart && queryStatus === "Private"
            ? this.private_practice_id
            : "",
        job_private_practice_id:
          this.isJobPart && queryStatus === "Private"
            ? this.job_private_practice_id
            : "",
        shift_id: !this.isJobPart ? this.shift_id : "",
        job_shift_id: this.isJobPart ? this.job_shift_id : "",
        rate: !this.isJobPart ? this.rate : "",
        job_rate: this.isJobPart ? this.job_rate : "",
        rate_type_id: !this.isJobPart ? this.rate_type_id : "",
        job_rate_type_id: this.isJobPart ? this.job_rate_type_id : "",
        near_post_code: this.near_post_code,
        miles: this.miles,
        calendar_date_start: this.calendar_date_start,
        calendar_date_end: this.calendar_date_end,
        time_start: this.time_start,
        time_end: this.time_end,
        invoice_status: this.invoice_status,
        viewing_locum_user_id: [],
        title_includes: !this.isJobPart ? this.title_includes : "",
        job_title_includes: this.isJobPart ? this.job_title_includes : "",
        job_number_includes: !this.isJobPart ? this.job_number_includes : "",
        job_part_number_includes: this.isJobPart
          ? this.job_part_number_includes
          : "",
        type: !this.isJobPart
          ? queryStatus === "Private"
            ? "Private"
            : "Platform"
          : "",
        job_type: this.isJobPart
          ? queryStatus === "Private"
            ? "Private"
            : "Platform"
          : ""
        // practice_is_favorite_of_locum: queryStatus === "Bank" ? true : ""
      };
    },

    noJobsToDisplay() {
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "";
      switch (queryStatus) {
      case "allocated":
      case "ongoing":
      case "declined":
      case "cancelled":
      case "withdrawn":
      case "approved":
      case "private":
      case "unsuccessful":
        return `You do not have any ${queryStatus} jobs`;
      case "available":
      case "matched":
      case "public":
      case "bank":
        return `Currently, there are no available jobs nearby that match your profile.`;
      case "applied":
        return `You have not yet applied for a job`;
      case "completed":
        return "You have not yet completed any job";

      default:
        return "You do not have any allocated jobs";
      }
    },

    columns() {
      let columns = [];

      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "allocated";

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
          name: "Shifts",
          dataIndex: "job_part_shift_names_formatted",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Rates",
          dataIndex: "job_part_rate_ranged_formatted",
          sortable: true,
          class: "text-center"
        },
        {
          name: "Rate Type",
          dataIndex: "job_part_rate_type_names_formatted",
          sortable: true,
          class: "text-center"
        }
      );

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
          dataIndex: "platform_job.appointed_at_in_gb_formatted",
          class: "text-center"
        });
      }

      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "declined_at_in_gb_formatted",
          class: "text-center"
        });
      }

      if (queryStatus === "cancelled") {
        columns.push(
          {
            name: "Cancelled At",
            dataIndex: "cancelled_at_in_gb_formatted",
            class: "text-center"
          },
          {
            name: "Tag",
            dataIndex: "tag_status",
            class: "text-center"
          }
        );
      }

      if (["completed"].includes(queryStatus)) {
        columns.push(
          {
            name: "Completed At",
            dataIndex: "completed_at_in_gb_formatted",
            class: "text-center"
          },
          {
            name: "Invoice status",
            dataIndex: "invoice_status",
            class: "text-center"
          }
        );
      }

      if (["approved"].includes(queryStatus)) {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center"
        });
      }

      return columns;
    }
  },

  watch: {
    async "$route.query"(newValue, oldValue) {
      let newStatus = newValue.status;
      let oldStatus = oldValue.status;
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1;
        this.filterModal = false;
        this.showRefresh = false;
        this.total = 0;
        this.jobs = [];
        this.clearFilters();
        this.isFiltered = false;
        this.initialLoading = true;
        await this.getLocumJobParts();
        this.initialLoading = false;
      }
    }
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
      "Locum Notification Job Allocated",
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
      "Locum Notification Job Completed",
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

    this.current_page = 1;
    this.filterModal = false;
    this.showRefresh = false;
    this.total = 0;
    this.jobs = [];
    this.clearFilters();
    this.isFiltered = false;
    this.initialLoading = true;
    this.getLocumJobParts().finally(() => {
      this.initialLoading = false;
    });

    Promise.all([
      this.$axios.$get(`/api/v1/shifts`).then(res => {
        let shifts = [];
        shifts.push({ label: "All", value: "" });
        res.data.shifts.forEach(shift => {
          shifts.push({ label: shift.name, value: shift.id });
        });
        return shifts;
      }),

      this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
        let rates = [];
        rates.push({ label: "All", value: "" });
        res.data.locum_detail_rate_types.forEach(rateType => {
          rates.push({ label: rateType.name, value: rateType.id });
        });
        return rates;
      })
    ]).then(responses => {
      const [shifts, rates] = responses;

      this.shifts = shifts;
      this.rates = rates;
    });

    this.$axios
      .$get(`/api/v1/locum/practices`, {
        params: {
          status: "Active",
          locum_practice_type: "Applied"
        }
      })
      .then(res => {
        this.practiceLists = res.data.practices.map(item => ({
          label: item.name,
          value: item.id
        }));
      });
  },

  destroyed() {
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
      "Locum Notification Job Allocated",
      this.getCurrentJobsRealTime
    );
    this.$socket.removeListener(
      "Locum Notification Job Ongoing",
      this.getOngoingJobsRealTime
    );
    this.$socket.removeListener(
      "Locum Notification Job Part",
      this.getCompletedJobsRealTime
    );
    this.$socket.removeListener(
      "Locum Notification Job Completed",
      this.getCompletedJobsRealTime
    );
    this.$socket.removeListener(
      "Locum Notification Locum Invoice ",
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
      "Locum Notification Job Auto ",
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

    this.showRefresh = false;
  },

  methods: {
    routerLink(jobOrJobPart) {
      return {
        name: "locum-job-parts-index-jobPartId",
        params: {
          jobPartId: jobOrJobPart.id
        },
        query: {
          ...this.$route.query
        }
      };
    },

    addPractice(payload) {
      this.search_practice = payload.name;
      this.practice_id = payload.id;
    },

    addPrivatePractice(payload) {
      this.search_private_practice = payload.name;
      this.private_practice_id = payload.id;
    },

    async filterJobList() {
      // this.jobs = this.jobs.filter(item => item.id !== id);
      this.loading = true;
      await this.getJobs();
      this.loading = false;
    },

    getLocumJobParts() {
      return Promise.all([
        this.$axios.get("/api/v1/locum/job-parts/count", {
          params: {
            ...this.getRequestQueryFilters
          }
        }),

        this.$axios.get("/api/v1/locum/job-parts", {
          params: {
            offset: 0,
            limit: 5,
            order_by: [],
            ...this.getRequestQueryFilters
          }
        })
      ])
        .then(([responseCount, responseJobs]) => {
          this.total = responseCount.data.data.count;
          this.jobs = responseJobs.data.data.job_parts.map(item => ({
            ...item,
            tag_status: item.terminated ? "Terminated" : item.locum_status,
            date_time_start: `${this.$moment(item.date_start).format(
              "DD-MM-YYYY"
            )} | ${item.time_start}`,
            date_time_end: `${this.$moment(item.date_end).format(
              "DD-MM-YYYY"
            )} | ${item.time_end}`
          }));
        })
        .catch(err => {
          console.log("err", err.response || err);
          throw err;
        });
    },

    getJobs() {
      return this.$axios
        .get("/api/v1/locum/job-parts", {
          params: {
            offset: this.offset,
            limit: this.limit,
            order_by: this.order_by,
            ...this.getRequestQueryFilters
          }
        })
        .then(res => {
          this.jobs = res.data.data.job_parts.map(item => ({
            ...item,
            tag_status: item.terminated ? "Terminated" : item.locum_status,
            date_time_start: `${this.$moment(item.date_start).format(
              "DD-MM-YYYY"
            )} | ${item.time_start}`,
            date_time_end: `${this.$moment(item.date_end).format(
              "DD-MM-YYYY"
            )} | ${item.time_end}`
          }));
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
        (this.$route.query.status === "Available" ||
          this.$route.query.status === "Matched")
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

    async getTerminatedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/jobs") &&
        this.$route.query.status === "Ongoing"
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
      await this.getLocumJobParts();
      this.initialLoading = false;
      this.showRefresh = false;
    },

    async filterJob() {
      this.current_page = 1;
      this.offset = 0;
      this.limit = 5;
      this.initialLoading = true;
      this.isFiltered = true;
      await this.getLocumJobParts();
      this.initialLoading = false;
      this.filterModal = false;
    },

    async sorted(order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1];
        let sorting = item.split(":")[0];
        switch (sorting) {
        case "practice_name":
          sorting = this.isJobPart ? "job_surgery" : "surgery";
          break;
        case "date_time_start":
          sorting = "date_start";
          break;
        case "date_time_end":
          sorting = "date_end";
          break;
        case "calendar_date_start":
          sorting = "calendar_date_start";
          break;
        case "calendar_date_end":
          sorting = "calendar_date_end";
          break;
        case "rate_name":
          sorting = "rate";
          break;
        default:
          sorting;
        }
        return `${sorting}:${order}`;
      });
      if (orderBy.includes("date_start:desc")) {
        orderBy.push("time_start:desc");
      } else if (orderBy.includes("date_start:asc")) {
        orderBy.push("time_start:asc");
      } else if (orderBy.includes("date_end:asc")) {
        orderBy.push("time_end:asc");
      } else if (orderBy.includes("date_end:desc")) {
        orderBy.push("time_end:desc");
      }
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
      this.viewing_locum_user_id = [];
      this.title_includes = "";
      this.job_title_includes = "";
      this.job_number_includes = "";
      this.job_part_number_includes = "";
    }
  }
};
</script>
