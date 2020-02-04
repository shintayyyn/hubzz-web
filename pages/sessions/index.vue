<template>
  <section class="relative">
    <div
      class="flex flex-row justify-start overflow-x-auto pb-3"
      v-if="$route.query.status && $route.query.status.toLowerCase() === 'applied'"
    >
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="'/sessions?status=Applied&bank=false'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'applied' && (!$route.query.bank || $route.query.bank && $route.query.bank === 'false') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Non-Bank</nuxt-link>
      <nuxt-link
        :event="$store.state.jobs.loading_jobs ? '' : 'click'"
        :to="'/sessions?status=Applied&bank=true'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'applied' && $route.query.bank && $route.query.bank === 'true' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >My Bank</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="showTable">
        <div class="flex">
          <AppButton
            class="mr-2"
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
        </div>
        <div
          v-if="!isJobPart"
          class="flex flex-col justify-start z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="flex flex-col md:flex-row h-full w-full items-end">
            <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="params.job_number_includes"
                :type="'text'"
                :name="'job_number'"
                :label="'Job number'"
              />
            </div>
            <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="params.title_includes"
                :type="'text'"
                :name="'title'"
                :label="'Job Title'"
              />
            </div>
            <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="params.rate"
                :type="'number'"
                :name="'rate'"
                :label="'Rate'"
                :inStyle="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
              />
            </div>
            <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="params.rate_type_id"
                :type="'select'"
                :name="'rate_type_id'"
                :label="'per'"
                :items="rates"
              />
            </div>
          </div>

          <div class="flex flex-col md:flex-row h-full w-full items-end">
            <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="params.shift_id"
                :type="'select'"
                :name="'shift_id'"
                :label="'Shift'"
                :items="shifts"
              />
            </div>
            <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
              <AppDate
                v-model="params.date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
              />
            </div>
            <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
              <AppDate
                v-model="params.date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
              />
            </div>
          </div>

          <div class="md:px-1 h-full flex w-full">
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
          class="flex flex-col justify-start z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="flex flex-col md:flex-row g-full items-end">
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="jobPartParams.job_part_number_includes"
                :type="'text'"
                :name="'job_part_number'"
                :label="'Job part number'"
              />
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="jobPartParams.job_title_includes"
                :type="'text'"
                :name="'job_title'"
                :label="'Job Title'"
              />
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
              <AppInput
                class="px-1"
                v-model="jobPartParams.job_rate"
                :type="'number'"
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
          </div>

          <div class="flex flex-col md:flex-row g-full items-end">
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
              <AppDate
                v-model="jobPartParams.date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
              />
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
              <AppDate
                v-model="jobPartParams.date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
              />
            </div>
          </div>

          <div
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
            v-if="$route.query.status && $route.query.status !== 'Ongoing'"
          >
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
          v-if="jobs.length > 0"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="isJobPart ? jobPartParams.limit : params.limit"
          :columns="columns"
          :orderBy="isJobPart ? jobPartParams.order_by :params.order_by"
          :loading="loading"
          :routerLink="'/sessions'"
          :minHeight="'70vh'"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted()"
        ></AppTable>
        <div
          v-if="!jobs.length && !loading && !filterText"
          class="flex justify-center py-4"
        >{{noJobsToDisplay}}</div>
        <div
          v-if="!jobs.length && !loading && filterText"
          class="flex justify-center py-4"
        >{{filterText}}</div>
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
  props: ["invoiceStatusList"],
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
        "pending",
        "allocated",
        "ongoing",
        "live",
        "applied",
        "unfilled",
        "withdrawn",
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
      filterText: "",
      loading: false,
      current_page: 1,
      // app table params
      params: {
        offset: 0,
        limit: 10,
        order_by: [],
        job_number: "",
        title: "",
        type: "",
        practice_id: "",
        shift_id: "",
        rate: "",
        rate_type_id: "",
        near_post_code: "",
        miles: "",
        calendar_date_start: "",
        calendar_date_end: "",
        time_start: "",
        time_end: "",
        viewing_locum_user_id: [],
        title_includes: "",
        job_number_includes: "",
        date_start: "",
        date_end: ""
      },
      jobPartParams: {
        offset: 0,
        limit: 10,
        order_by: [],
        job_part_number: "",
        job_title: "",
        job_type: "",
        job_practice_id: "",
        job_shift_id: "",
        job_rate: "",
        job_rate_type_id: "",
        near_post_code: "",
        miles: "",
        calendar_date_start: "",
        calendar_date_end: "",
        time_start: "",
        time_end: "",
        invoice_status: "",
        job_title_includes: "",
        job_part_number_includes: "",
        date_start: "",
        date_end: ""
      },
      shifts: [],
      rates: [],
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
      getPracticeCancelledJobs: "jobs/getPracticeCancelledJobs",
      getPracticeWithdrawnJobs: "jobs/getPracticeWithdrawnJobs",
      // whole
      getPracticePendingJobs: "jobs/getPracticePendingJobs",
      getPracticeAllocatedJobs: "jobs/getPracticeAllocatedJobs",
      getPracticeAvailableJobs: "jobs/getPracticeAvailableJobs",
      getPracticeAppliedJobs: "jobs/getPracticeAppliedJobs",
      getPracticeUnfilledJobs: "jobs/getPracticeUnfilledJobs",
      getPracticeDeclinedJobs: "jobs/getPracticeDeclinedJobs"
      // getPracticeCancelledJobs: "jobs/getPracticeCancelledJobs"
    }),
    isJobPart() {
      if (
        !this.$route.query.status ||
        (this.$route.query.status &&
          ![
            "pending",
            "ongoing",
            "completed",
            "approved",
            "cancelled",
            "withdrawn"
          ].includes(this.$route.query.status.toLowerCase()))
      ) {
        return false;
      }
      if (
        this.$route.query.status &&
        [
          "pending",
          "ongoing",
          "completed",
          "approved",
          "cancelled",
          "withdrawn"
        ].includes(this.$route.query.status.toLowerCase())
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
          case "cancelled":
            return this.$store.state.jobs.practice_cancelled_job_parts_count;
          case "withdrawn":
            return this.$store.state.jobs.practice_withdrawn_job_parts_count;
          // whole
          case "allocated":
            return this.$store.state.jobs.practice_allocated_jobs_count;
          case "live":
            return this.$store.state.jobs.practice_available_jobs_count;
          case "applied":
            return this.$store.state.jobs.practice_applied_jobs_count;
          case "unfilled":
            return this.$store.state.jobs.practice_unfilled_jobs_count;
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
          case "cancelled":
            return this.getPracticeCancelledJobs;
          case "withdrawn":
            return this.getPracticeWithdrawnJobs;
          // whole
          case "pending":
            return this.getPracticePendingJobs;
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
        }
      } else {
        return this.getPracticeAllocatedJobs;
      }
    },
    noJobsToDisplay() {
      if (this.$route.query.status) {
        switch (this.$route.query.status.toLowerCase()) {
          case "pending":
          case "allocated":
          case "ongoing":
          case "declined":
          case "approved":
          case "unfilled":
          case "live":
            return `You do not have any ${this.$route.query.status.toLowerCase()} jobs`;
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
            class: "text-center localDate"
          },
          {
            name: "Invoice status",
            dataIndex: "invoice_status",
            class: "text-center"
          },
          {
            name: "Tag",
            dataIndex: "status",
            class: "text-center"
          }
        );
      }
      return columns;
    }
  },
  watch: {
    async "$route.query"(newValue, oldValue) {
      let newStatus = newValue.status;
      let oldStatus = oldValue.status;
      let newBank = newValue.bank;
      let oldBank = oldValue.bank;
      if (
        (newStatus && newStatus !== null && newStatus !== oldStatus) ||
        (newBank && newBank !== null && newBank !== oldBank)
      ) {
        this.current_page = 1;
        this.showTable = false;
        this.filterModal = false;
        this.showRefresh = false;
        this.filterText = "";
        this.clearFilters();
        this.$nuxt.$loading.start();
        // this.loading = true;
        await this.getJobsPromiseAll();
        // this.loading = false;
        this.$nuxt.$loading.finish();
        this.showTable = true;
      }
    }
  },
  async asyncData({ app, params, query, store, auth, error }) {
    try {
      // status
      let queryStatus = query.status;
      let bankStatus = query.bank;
      let has_favorite_applicants = "";
      let status = [];
      if (!queryStatus) {
        status = ["Allocated"];
      } else if (queryStatus && queryStatus === "Completed") {
        status = ["Completed", "Terminated"];
      } else if (queryStatus && queryStatus === "Applied") {
        has_favorite_applicants = bankStatus === "true" ? true : null;
        status = ["Applied"];
      } else if (queryStatus && queryStatus === "Withdrawn") {
        status = ["Declined"];
      } else if (
        queryStatus &&
        queryStatus !== "Available" &&
        queryStatus !== "Completed"
      ) {
        status = [`${queryStatus}`];
      }
      // job part
      let isJobPart = false;
      if (
        queryStatus &&
        ["ongoing", "completed", "approved", "cancelled", "withdrawn"].includes(
          queryStatus.toLowerCase()
        )
      ) {
        isJobPart = true;
      }

      let jobParams = {
        order_by: [],
        job_number: "",
        title: "",
        type: "",
        practice_id: app.$auth.user.practice_detail.practice.id,
        shift_id: "",
        rate: "",
        rate_type_id: "",
        near_post_code: "",
        miles: "",
        calendar_date_start: "",
        calendar_date_end: "",
        time_start: "",
        time_end: ""
      };

      if (isJobPart) {
        jobParams = {
          order_by: [],
          job_part_number: "",
          job_title: "",
          job_type: "",
          job_practice_id: app.$auth.user.practice_detail.practice.id,
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
        };
      }
      console.log(jobParams);
      const [shifts, rates] = await Promise.all([
        app.$axios.$get(`/api/v1/shifts`).then(res => {
          const shifts = [];
          shifts.push({ label: "All", value: "" });
          res.data.shifts.forEach(item => {
            shifts.push({ label: item.name, value: item.id });
          });
          return shifts;
        }),
        app.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
          const rates = [];
          rates.push({ label: "All", value: "" });
          res.data.locum_detail_rate_types.forEach(item => {
            rates.push({ label: item.name, value: item.id });
          });
          return rates;
        }),
        app.$axios
          .$get(`/api/v1/practice/${isJobPart ? "job-parts" : "jobs"}/count`, {
            params: {
              status,
              ...jobParams,
              practice_id: isJobPart
                ? ""
                : app.$auth.user.practice_detail.practice.id,
              job_practice_id: isJobPart
                ? app.$auth.user.practice_detail.practice.id
                : "",
              has_favorite_applicants
            }
          })
          .then(res => {
            if (
              queryStatus &&
              [
                "ongoing",
                "completed",
                "approved",
                "cancelled",
                "withdrawn"
              ].includes(queryStatus.toLowerCase())
            ) {
              store.commit(
                `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOB_PARTS_COUNT`,
                res.data.count
              );
            } else if (queryStatus && queryStatus.toLowerCase() === "live") {
              store.commit(
                `jobs/SET_PRACTICE_AVAILABLE_JOBS_COUNT`,
                res.data.count
              );
            } else if (
              queryStatus &&
              !["ongoing", "completed", "approved"].includes(
                queryStatus.toLowerCase()
              )
            ) {
              store.commit(
                `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOBS_COUNT`,
                res.data.count
              );
            } else if (!queryStatus) {
              store.commit(
                "jobs/SET_PRACTICE_ALLOCATED_JOBS_COUNT",
                res.data.count
              );
            }
          }),
        app.$axios
          .$get(`/api/v1/practice/${isJobPart ? "job-parts" : "jobs"}`, {
            params: {
              status,
              ...jobParams,
              offset: 0,
              limit: 5,
              practice_id: isJobPart
                ? ""
                : app.$auth.user.practice_detail.practice.id,
              job_practice_id: isJobPart
                ? app.$auth.user.practice_detail.practice.id
                : "",
              has_favorite_applicants
            }
          })
          .then(res => {
            if (
              queryStatus &&
              [
                "ongoing",
                "completed",
                "approved",
                "cancelled",
                "withdrawn"
              ].includes(queryStatus.toLowerCase())
            ) {
              store.commit(
                `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOB_PARTS`,
                res.data.job_parts
              );
            } else if (queryStatus && queryStatus.toLowerCase() === "live") {
              store.commit(`jobs/SET_PRACTICE_AVAILABLE_JOBS`, res.data.jobs);
            } else if (
              queryStatus &&
              ![
                "ongoing",
                "completed",
                "approved",
                "cancelled",
                "withdrawn"
              ].includes(queryStatus.toLowerCase())
            ) {
              store.commit(
                `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOBS`,
                res.data.jobs
              );
            } else if (!queryStatus) {
              store.commit("jobs/SET_PRACTICE_ALLOCATED_JOBS", res.data.jobs);
            }
          })
      ]);

      const showTable = true;

      return {
        shifts,
        rates,
        showTable
      };
    } catch (err) {
      throw err;
    }
  },
  mounted() {
    this.$socket.on(
      "Practice Notification Job Available",
      this.getAvailableJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Application",
      this.getAppliedJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Application Cancelled",
      this.getAppliedCancelledJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Current",
      this.getCurrentJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Ongoing",
      this.getOngoingJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Part Completed",
      this.getCompletedJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Locum Invoice Updated",
      this.getApprovedJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Cancelled",
      this.getCancelledJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Amended",
      this.getAmendedJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Declined",
      this.getDeclinedJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Auto Declined",
      this.getAutoDeclinedJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Update Accept",
      this.getUpdateAcceptJobsRealTime
    );
    this.$socket.on(
      "Practice Notification Job Unfilled",
      this.getUnfilledJobsRealTime
    );
  },
  destroyed() {
    this.removeListener();
    this.showRefresh = false;
  },
  methods: {
    getJobsPromiseAll() {
      let queryStatus = this.$route.query.status;
      let bankStatus = this.$route.query.bank;
      let has_favorite_applicants = "";
      let status = [];
      if (!queryStatus) {
        status = ["Allocated"];
      } else if (queryStatus && queryStatus === "Completed") {
        status = ["Completed", "Terminated"];
      } else if (queryStatus && queryStatus === "Applied") {
        has_favorite_applicants = bankStatus === "true" ? true : false;
        status = ["Applied"];
      } else if (queryStatus && queryStatus === "Withdrawn") {
        status = ["Declined"];
      } else if (
        queryStatus &&
        queryStatus !== "Available" &&
        queryStatus !== "Completed"
      ) {
        status = [`${queryStatus}`];
      }

      return Promise.all([
        this.$axios.$get(
          `/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}/count`,
          {
            params: {
              status,
              ...(this.isJobPart ? this.jobPartParams : this.params),
              practice_id: this.isJobPart
                ? ""
                : this.$auth.user.practice_detail.practice.id,
              job_practice_id: this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
                : "",
              has_favorite_applicants
            }
          }
        ),
        this.$axios.$get(
          `/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`,
          {
            params: {
              status,
              ...(this.isJobPart ? this.jobPartParams : this.params),
              practice_id: this.isJobPart
                ? ""
                : this.$auth.user.practice_detail.practice.id,
              job_practice_id: this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
                : "",
              has_favorite_applicants
            }
          }
        )
      ]).then(([responseCount, responseJobs]) => {
        if (
          queryStatus &&
          [
            "ongoing",
            "completed",
            "approved",
            "cancelled",
            "withdrawn"
          ].includes(queryStatus.toLowerCase())
        ) {
          this.$store.commit(
            `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOB_PARTS_COUNT`,
            responseCount.data.count
          );
        } else if (queryStatus && queryStatus.toLowerCase() === "live") {
          this.$store.commit(
            `jobs/SET_PRACTICE_AVAILABLE_JOBS_COUNT`,
            responseCount.data.count
          );
        } else if (
          queryStatus &&
          ![
            "ongoing",
            "completed",
            "approved",
            "cancelled",
            "withdrawn"
          ].includes(queryStatus.toLowerCase())
        ) {
          this.$store.commit(
            `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOBS_COUNT`,
            responseCount.data.count
          );
        } else if (!queryStatus) {
          this.$store.commit(
            "jobs/SET_PRACTICE_ALLOCATED_JOBS_COUNT",
            responseCount.data.count
          );
        }

        if (
          queryStatus &&
          [
            "ongoing",
            "completed",
            "approved",
            "cancelled",
            "withdrawn"
          ].includes(queryStatus.toLowerCase())
        ) {
          return this.$store.commit(
            `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOB_PARTS`,
            responseJobs.data.job_parts
          );
        } else if (queryStatus && queryStatus.toLowerCase() === "live") {
          return this.$store.commit(
            `jobs/SET_PRACTICE_AVAILABLE_JOBS`,
            responseJobs.data.jobs
          );
        } else if (
          queryStatus &&
          ![
            "ongoing",
            "completed",
            "approved",
            "cancelled",
            "withdrawn"
          ].includes(queryStatus.toLowerCase())
        ) {
          return this.$store.commit(
            `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOBS`,
            responseJobs.data.jobs
          );
        } else if (!queryStatus) {
          return this.$store.commit(
            "jobs/SET_PRACTICE_ALLOCATED_JOBS",
            responseJobs.data.jobs
          );
        }
      });
    },
    getJobsCount(params) {
      let queryStatus = this.$route.query.status;
      let bankStatus = this.$route.query.bank;
      let has_favorite_applicants = "";
      let status = [];
      if (!queryStatus) {
        status = ["Allocated"];
      } else if (queryStatus && queryStatus === "Available") {
        status = ["Available", "Matched"];
      } else if (queryStatus && queryStatus === "Completed") {
        status = ["Completed", "Terminated"];
      } else if (queryStatus && queryStatus === "Applied") {
        has_favorite_applicants = bankStatus === "true" ? true : false;
        status = ["Applied"];
      } else if (
        queryStatus &&
        queryStatus !== "Available" &&
        queryStatus !== "Completed"
      ) {
        status = [`${queryStatus}`];
      }
      return this.$axios
        .$get(
          `/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}/count`,
          {
            params: {
              status,
              ...(this.isJobPart ? this.jobPartParams : this.params),
              practice_id: this.isJobPart
                ? ""
                : this.$auth.user.practice_detail.practice.id,
              job_practice_id: this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
                : "",
              has_favorite_applicants
            }
          }
        )
        .then(res => {
          if (
            queryStatus &&
            [
              "ongoing",
              "completed",
              "approved",
              "cancelled",
              "withdrawn"
            ].includes(queryStatus.toLowerCase())
          ) {
            return this.$store.commit(
              `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOB_PARTS_COUNT`,
              res.data.count
            );
          } else if (queryStatus && queryStatus.toLowerCase() === "live") {
            return this.$store.commit(
              `jobs/SET_PRACTICE_AVAILABLE_JOBS_COUNT`,
              res.data.count
            );
          } else if (
            queryStatus &&
            ![
              "ongoing",
              "completed",
              "approved",
              "cancelled",
              "withdrawn"
            ].includes(queryStatus.toLowerCase())
          ) {
            return this.$store.commit(
              `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOBS_COUNT`,
              res.data.count
            );
          } else if (!queryStatus) {
            return this.$store.commit(
              "jobs/SET_PRACTICE_ALLOCATED_JOBS_COUNT",
              res.data.count
            );
          }
        })
        .catch(err => {
          console.log("err", err.response || err);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [err.response.data.message]
          });
        })
        .finally(() => {
          return;
        });
    },
    getJobs(params) {
      let queryStatus = this.$route.query.status;
      let bankStatus = this.$route.query.bank;
      let has_favorite_applicants = "";
      let status = [];
      if (!queryStatus) {
        status = ["Allocated"];
      } else if (queryStatus && queryStatus === "Available") {
        status = ["Available", "Matched"];
      } else if (queryStatus && queryStatus === "Completed") {
        status = ["Completed", "Terminated"];
      } else if (queryStatus && queryStatus === "Applied") {
        has_favorite_applicants = bankStatus === "true" ? true : false;
        status = ["Applied"];
      } else if (
        queryStatus &&
        queryStatus !== "Available" &&
        queryStatus !== "Completed"
      ) {
        status = [`${queryStatus}`];
      }
      return this.$axios
        .$get(`/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`, {
          params: {
            status,
            ...(this.isJobPart ? this.jobPartParams : this.params),
            practice_id: this.isJobPart
              ? ""
              : this.$auth.user.practice_detail.practice.id,
            job_practice_id: this.isJobPart
              ? this.$auth.user.practice_detail.practice.id
              : "",
            has_favorite_applicants
          }
        })
        .then(res => {
          if (
            queryStatus &&
            ["ongoing", "completed", "approved"].includes(
              queryStatus.toLowerCase()
            )
          ) {
            return this.$store.commit(
              `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOB_PARTS`,
              res.data.job_parts
            );
          } else if (queryStatus && queryStatus.toLowerCase() === "live") {
            return this.$store.commit(
              `jobs/SET_PRACTICE_AVAILABLE_JOBS`,
              res.data.jobs
            );
          } else if (
            queryStatus &&
            !["ongoing", "completed", "approved"].includes(
              queryStatus.toLowerCase()
            )
          ) {
            return this.$store.commit(
              `jobs/SET_PRACTICE_${queryStatus.toUpperCase()}_JOBS`,
              res.data.jobs
            );
          } else if (!queryStatus) {
            return this.$store.commit(
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
    async getAvailableJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Live" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getAppliedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Applied" ||
          this.$route.query.status === "Live")
      ) {
        this.showRefresh = true;
      }
    },
    async getAppliedCancelledJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Applied" ||
          this.$route.query.status === "Live")
      ) {
        this.showRefresh = true;
      }
    },
    async getCurrentJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/sessions") &&
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
        this.$route.path.includes("/sessions") &&
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
        this.$route.path.includes("/sessions") &&
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
        this.$route.path.includes("/sessions") &&
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
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Cancelled" ||
          this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Ongoing" ||
          this.$route.query.status === "Live" ||
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
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Ongoing" ||
          this.$route.query.status === "Live" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async getDeclinedJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Declined" ||
          this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Ongoing" ||
          this.$route.query.status === "Live" ||
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
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Declined" ||
          this.$route.query.status === "Allocated")
      ) {
        this.showRefresh = true;
      }
    },
    async getUpdateAcceptJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/sessions") &&
        this.$route.query.status === "Allocated"
      ) {
        this.showRefresh = true;
      }
    },
    async getUnfilledJobsRealTime(job) {
      if (!job) {
        return;
      }
      if (
        this.$route.path.includes("/sessions") &&
        (this.$route.query.status === "Unfilled" ||
          this.$route.query.status === "Allocated" ||
          this.$route.query.status === "Ongoing" ||
          this.$route.query.status === "Live" ||
          this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true;
      }
    },

    async refreshJobs() {
      this.loading = true;
      // this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION");
      this.current_page = 1;
      this.params.offset = 0;
      this.jobPartParams.offset = 0;
      this.params.limit = 10;
      this.jobPartParams.limit = 10;
      await this.getJobsCount();
      await this.getJobs();
      this.loading = false;
      this.showRefresh = false;
    },
    removeListener() {
      this.$socket.removeListener(
        "Practice Notification Job Available",
        this.getAvailableJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Application",
        this.getAppliedJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Application Cancelled",
        this.getAppliedCancelledJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Current",
        this.getCurrentJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Ongoing",
        this.getOngoingJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Part Completed",
        this.getCompletedJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Updated",
        this.getApprovedJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Cancelled",
        this.getCancelledJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Amended",
        this.getAmendedJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Declined",
        this.getDeclinedJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Auto Declined",
        this.getAutoDeclinedJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Update Accept",
        this.getUpdateAcceptJobsRealTime
      );
      this.$socket.removeListener(
        "Practice Notification Job Unfilled",
        this.getUnfilledJobsRealTime
      );
    },
    async filterJob() {
      this.current_page = 1;
      this.params.offset = 0;
      this.jobPartParams.offset = 0;
      this.loading = true;
      this.filterModal = false;
      this.filterText = "No Jobs Found";
      await this.getJobsPromiseAll();
      this.loading = false;
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
      this.current_page = 1;
      this.params.offset = 0;
      this.params.order_by = orderBy;
      this.jobPartParams.offset = 0;
      this.jobPartParams.order_by = orderBy;
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
      this.params.limit = 10;
      this.params.type = "";
      this.params.job_number_includes = "";
      this.params.practice_id = "";
      this.params.title_includes = "";
      this.params.shift_id = "";
      this.params.rate = "";
      this.params.rate_type_id = "";
      this.params.order_by = [];

      this.jobPartParams.offset = 0;
      this.jobPartParams.limit = 10;
      this.jobPartParams.job_type = "";
      this.jobPartParams.job_part_number_includes = "";
      this.jobPartParams.job_practice_id = "";
      this.jobPartParams.job_title_includes = "";
      this.jobPartParams.job_shift_id = "";
      this.jobPartParams.job_rate = "";
      this.jobPartParams.job_rate_type_id = "";
      this.jobPartParams.invoice_status = "";
      this.jobPartParams.near_post_code = "";
      this.jobPartParams.miles = "";
      this.jobPartParams.date_start = "";
      this.jobPartParams.date_end = "";
      this.jobPartParams.time_start = "";
      this.jobPartParams.time_end = "";
      this.jobPartParams.order_by = [];

      if (this.jobs.length) {
        this.filterJob();
      } else {
        this.filterModal = false;
      }
    }
  }
};
</script>

