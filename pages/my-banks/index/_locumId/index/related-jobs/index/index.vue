<template>
  <section class="relative">
    <AppBreadcrumbs :links="links" />
    <!-- <div
      class="flex flex-row justify-start overflow-x-auto py-3 mb-3"
      v-if="$route.query.jobStatus && ['available', 'public', 'bank'].includes($route.query.jobStatus.toLowerCase())"
    >
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Available`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'available'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Available</nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="`/my-banks/${$route.params.locumId}/related-jobs?status=${$route.query.status}&jobStatus=Public`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'public'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Public</nuxt-link>
      </div>
    </div>-->
    <transition name="fade" mode="out-in">
      <div
        v-if="initialLoading"
        class="relative flex w-full"
        style="min-height:80px"
      >
        <AppLoading :loading="initialLoading" spinner />
      </div>
      <div v-if="!initialLoading">
        <AppFilter :enableSearch="false">
          <template v-slot:extraButton>
            <AppButton
              v-if="showRefresh"
              :label="'Refresh'"
              customTheme="border"
              @click="refreshJobs"
            />
          </template>
          <template v-slot:filter>
            <template v-if="!isJobPart">
              <div class="flex-1">
                <AppInput
                  v-model="job_number_includes"
                  :wrapperClass="'px-1'"
                  :type="'text'"
                  :name="'job_number'"
                  :label="'Job number'"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="title_includes"
                  :wrapperClass="'px-1'"
                  :type="'text'"
                  :name="'title'"
                  :label="'Job Title'"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="rate"
                  :wrapperClass="'px-1'"
                  :type="'text'"
                  :name="'rate'"
                  :label="'Rate £'"
                  :limit="8"
                  nolabel
                  border
                  @keydown="isNumber($event)"
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="rate_type_id"
                  :wrapperClass="'px-1'"
                  :type="'select'"
                  :name="'rate_type_id'"
                  :label="'Rate Type'"
                  :items="rates"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="shift_id"
                  :wrapperClass="'px-1'"
                  :type="'select'"
                  :name="'shift_id'"
                  :label="'Shift'"
                  :items="shifts"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppDate
                  v-model="calendar_date_start"
                  :name="'calendar_date_start'"
                  :label="'From'"
                  :format="'YYYY-MM-DD'"
                  :wrapperClass="'px-1'"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppDate
                  v-model="calendar_date_end"
                  :name="'calendar_date_end'"
                  :label="'To'"
                  :format="'YYYY-MM-DD'"
                  :wrapperClass="'px-1'"
                  nolabel
                  border
                />
              </div>
            </template>
            <template v-if="isJobPart">
              <div class="flex-1">
                <AppInput
                  v-model="job_part_number_includes"
                  :wrapperClass="'px-1'"
                  :type="'text'"
                  :name="'job_part_number'"
                  :label="'Job part number'"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="job_title_includes"
                  :wrapperClass="'px-1'"
                  :type="'text'"
                  :name="'job_title'"
                  :label="'Job Title'"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="job_rate"
                  :wrapperClass="'px-1'"
                  :type="'text'"
                  :name="'job_rate'"
                  :label="'Rate £'"
                  :limit="8"
                  nolabel
                  border
                  @keydown="isNumber($event)"
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="job_rate_type_id"
                  :wrapperClass="'px-1'"
                  :type="'select'"
                  :name="'job_rate_type_id'"
                  :label="'Rate Type'"
                  :items="rates"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppInput
                  v-model="job_shift_id"
                  :wrapperClass="'px-1'"
                  :type="'select'"
                  :name="'job_shift_id'"
                  :label="'Shift'"
                  :items="shifts"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppDate
                  v-model="calendar_date_start"
                  :name="'calendar_date_start'"
                  :label="'From'"
                  :format="'YYYY-MM-DD'"
                  :wrapperClass="'px-1'"
                  nolabel
                  border
                />
              </div>
              <div class="flex-1">
                <AppDate
                  v-model="calendar_date_end"
                  :name="'calendar_date_end'"
                  :label="'To'"
                  :format="'YYYY-MM-DD'"
                  :wrapperClass="'px-1'"
                  nolabel
                  border
                />
              </div>
              <div
                v-if="
                  $route.query.jobStatus && $route.query.jobStatus !== 'Ongoing'
                "
                class="md:px-1 flex-1"
              >
                <AppInput
                  v-model="invoice_status"
                  :wrapperClass="'px-1'"
                  :type="'select'"
                  :name="'invoice_status'"
                  :label="'Invoice Status'"
                  :items="invoiceStatusList"
                  nolabel
                  border
                />
              </div>
            </template>
            <AppButton class="mx-2" :label="'Apply'" @click="filterJob" />
            <AppButton
              :label="'Clear'"
              :customTheme="'border'"
              @click="clearFilters"
            />
          </template>
        </AppFilter>
        <!-- <div class="flex">
          <button @click="filterModal = !filterModal" class="flex items-center justify-between text-sm p-1 border rounded mr-1">
            <p class="mx-2">Filter</p>
            <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterModal ? 'transform: rotate(180deg)' : ''" /></span>
          </button>
          <transition name="fade">
            <div class="md:px-1 h-full flex w-full" v-if="filterModal">
              <AppButton
                :label="'Clear'"
                :inStyle="'padding:5px 14px;margin-bottom:0'"
                @click="clearFilters"
              />
              <AppButton
                class="mx-2"
                :label="'Search'"
                :inStyle="'padding:5px 14px;margin-bottom:0'"
                @click="filterJob"
              />
            </div>
          </transition>
          <AppButton
            v-if="showRefresh"
            :label="'Refresh'"
            :inStyle="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
            customTheme="border-2"
            @click="refreshJobs"
          />
        </div>
        <transition name="dropd-down">
        <div v-if="filterModal && !isJobPart" class="flex flex-col md:flex-row items-start mt-2">
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="job_number_includes"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'job_number'"
                :label="'Job number'"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="title_includes"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'title'"
                :label="'Job Title'"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="rate"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'rate'"
                :label="'Rate £'"
                :limit="8"
                @keydown="isNumber($event)"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="rate_type_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'rate_type_id'"
                :label="'per'"
                :items="rates"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="shift_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'shift_id'"
                :label="'Shift'"
                :items="shifts"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppDate
                v-model="calendar_date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppDate
                v-model="calendar_date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
              />
            </div>
        </div>
        <div v-if="filterModal && isJobPart" class="flex flex-col md:flex-row items-start mt-2">
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="job_part_number_includes"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'job_part_number'"
                :label="'Job part number'"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="job_title_includes"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'job_title'"
                :label="'Job Title'"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="job_rate"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'job_rate'"
                :label="'Rate £'"
                :limit="8"
                @keydown="isNumber($event)"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="job_rate_type_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'job_rate_type_id'"
                :label="'per'"
                :items="rates"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppInput
                v-model="job_shift_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'job_shift_id'"
                :label="'Shift'"
                :items="shifts"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppDate
                v-model="calendar_date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
              />
            </div>
            <div class="md:px-1 flex-1">
              <AppDate
                v-model="calendar_date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
              />
            </div>

          <div
            v-if="$route.query.jobStatus && $route.query.jobStatus !== 'Ongoing'"
            class="md:px-1 flex-1"
          >
            <AppInput
              v-model="invoice_status"
              :wrapperClass="'px-1'"
              :type="'select'"
              :name="'invoice_status'"
              :label="'Invoice Status'"
              :items="invoiceStatusList"
            />
          </div>
        </div>
        </transition> -->
        <AppTable
          v-if="jobs.length > 0"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="limit"
          :columns="columns"
          :orderBy="order_by"
          :loading="loading"
          :routerLink="`/my-banks/${$route.params.locumId}/related-jobs`"
          :minHeight="'70vh'"
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
            v-if="
              $route.name ===
                'my-banks-index-locumId-index-related-jobs-index-jobId'
            "
            class="shield"
            :to="{
              path: `/my-banks/${$route.params.locumId}/related-jobs`,
              query: { ...$route.query }
            }"
          />
        </transition>
        <div>
          <nuxt-child @cancelled="filterJobList" @appointed="filterJobList" />
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import AppTable from "@/components/Base/AppTable";
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
import AppFilter from "@/components/Base/AppFilter";
export default {
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppButton,
    AppLoading,
    AppBreadcrumbs,
    AppFilter
  },

  props: {
    invoiceStatusList: {
      type: Array,
      default: () => []
    }
  },

  middleware({ query, error }) {
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
        "approved"
      ].includes(query.jobStatus.toLowerCase())
    ) {
      return error({ status: 404, message: "This Session Status is Invalid" });
    }
  },
  data() {
    return {
      total: 0,
      jobs: [],
      initialLoading: false,
      loading: false,
      current_page: 1,
      // app table params
      viewing_locum_user_id: null,
      offset: 0,
      limit: 15,
      order_by: [],
      job_number: "",
      job_part_number: "",
      title: "",
      job_title: "",
      type: "",
      job_type: "",
      practice_id: "",
      job_practice_id: "",
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

      return false;
    },
    noJobsToDisplay() {
      let queryStatus = this.$route.query.jobStatus
        ? this.$route.query.jobStatus.toLowerCase()
        : "";
      switch (queryStatus) {
      case "pending":
      case "allocated":
      case "ongoing":
      case "declined":
      case "approved":
      case "unfilled":
      case "live":
      case "public":
        return `You do not have any ${queryStatus} jobs`;
      case "applied":
        return `There have been no applications for this job`;
      case "completed":
      case "cancelled":
        return `You have not yet ${queryStatus} any job`;
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
            name: "Job Part No.",
            dataIndex: "job_part_number",
            sortable: true,
            width: 150
          },
          {
            name: "Practice",
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
            sortable: true,
            width: 150
          },
          {
            name: "Rate",
            dataIndex: "job.rate",
            class: "text-center",
            sortable: true,
            width: 120
          },
          {
            name: "Rate Type",
            dataIndex: "job.locum_detail_rate_type.name",
            class: "text-center",
            sortable: true,
            width: 150
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
            sortable: true,
            width: 150
          },
          {
            name: "Practice",
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
            sortable: true,
            width: 150
          },
          {
            name: "Rate",
            dataIndex: "rate",
            class: "text-center",
            sortable: true,
            width: 120
          },
          {
            name: "Rate Type",
            dataIndex: "rate_type_name",
            class: "text-center",
            sortable: true,
            width: 150
          }
        );
      }
      columns.push(
        {
          name: "From",
          dataIndex: "date_start",
          sortable: true,
          class: "text-center",
          width: 100
        },
        {
          name: "To",
          dataIndex: "date_end",
          sortable: true,
          class: "text-center",
          width: 100
        }
      );
      if (queryStatus === "allocated") {
        columns.push({
          name: "Assigned",
          dataIndex: "assigned_to",
          class: "text-center"
        });
      }
      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "declined_at_in_gb_formatted",
          class: "text-center",
          width: 150
        });
      }
      if (queryStatus === "cancelled") {
        columns.push({
          name: "Cancelled At",
          dataIndex: "cancelled_at_in_gb_formatted",
          class: "text-center",
          width: 150
        });
      }
      if (["completed"].includes(queryStatus)) {
        columns.push({
          name: "Completed At",
          dataIndex: "completed_at_in_gb_formatted",
          class: "text-center",
          width: 150
        });
      }
      if (["approved"].includes(queryStatus)) {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          width: 150
        });
      }

      if (["completed"].includes(queryStatus)) {
        columns.push({
          name: "Invoice status",
          dataIndex: "invoice_status",
          class: "text-center",
          width: 120
        });
      }

      if (["completed", "approved"].includes(queryStatus)) {
        columns.push({
          name: "Tag",
          dataIndex: "status",
          class: "text-center",
          width: 100
        });
      }
      return columns;
    },
    links() {
      console.log("getBreadcrumbs");
      // const breadcrumbs = this.$store.getters['getBreadcrumbs']
      return [
        ...this.$store.state.breadcrumbs,
        {
          title: `${
            this.$route.query.jobStatus
              ? this.$route.query.jobStatus
              : "Allocated"
          } Jobs`,
          url: this.$route.path
        }
      ];
    }
  },
  watch: {
    async "$route.query"(newValue, oldValue) {
      let newJobStatus = newValue.jobStatus;
      let oldJobStatus = oldValue.jobStatus;
      let newBank = newValue.bank;
      let oldBank = oldValue.bank;
      if (
        (newJobStatus &&
          newJobStatus !== null &&
          newJobStatus !== oldJobStatus) ||
        (newBank && newBank !== null && newBank !== oldBank)
      ) {
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
  async asyncData({ app, params, query }) {
    try {
      let locum_status = [];
      let queryStatus = query.jobStatus;
      // let bankStatus = query.bank;

      if (!queryStatus) {
        locum_status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
        case "Completed":
          locum_status = ["Completed", "Terminated"];
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

      // let viewing_locum_user_id = params.locumId;
      let job_number = "";
      let job_part_number = "";
      let title = "";
      let job_title = "";
      let type = "";
      let job_type = "";
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
        app.$axios.$get(`/api/v1/shifts`, { cache: true }).then(res => {
          const shifts = [];
          shifts.push({ label: "All", value: null });
          res.data.shifts.forEach(item => {
            shifts.push({ label: item.name, value: item.id });
          });
          return shifts;
        }),
        app.$axios
          .$get(`/api/v1/locum-detail-rate-types`, { cache: true })
          .then(res => {
            const rates = [];
            rates.push({ label: "All", value: null });
            res.data.locum_detail_rate_types.forEach(item => {
              rates.push({ label: item.name, value: item.id });
            });
            return rates;
          }),
        app.$axios
          .$get(
            `/api/v1/practice/locums/${params.locumId}/${
              isJobPart ? "job-parts" : "jobs"
            }/count`,
            {
              cache: true,
              params: {
                locum_status,
                order_by: [],
                job_number: !isJobPart ? job_number : "",
                job_part_number: isJobPart ? job_part_number : "",
                title: !isJobPart ? title : "",
                job_title: isJobPart ? job_title : "",
                type: !isJobPart ? type : "",
                job_type: isJobPart ? job_type : "",
                practice_id: !isJobPart
                  ? app.$auth.user.practice_detail.practice.id
                  : "",
                job_practice_id: isJobPart
                  ? app.$auth.user.practice_detail.practice.id
                  : "",
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
                title_includes: "",
                job_title_includes: "",
                job_number_includes: "",
                job_part_number_includes: ""
                // has_favorite_applicants:
                //   queryStatus === "Applied" && bankStatus === "true"
                //     ? true
                //     : queryStatus === "Applied" &&
                //       (bankStatus === "false" || !bankStatus)
                //     ? false
                //     : null
              }
            }
          )
          .then(res => {
            let total = 0;
            total = res.data.count;
            return total;
          }),
        app.$axios
          .$get(
            `/api/v1/practice/locums/${params.locumId}/${
              isJobPart ? "job-parts" : "jobs"
            }`,
            {
              cache: true,
              params: {
                offset: 0,
                limit: 15,
                locum_status,
                order_by: [],
                job_number: !isJobPart ? job_number : "",
                job_part_number: isJobPart ? job_part_number : "",
                title: !isJobPart ? title : "",
                job_title: isJobPart ? job_title : "",
                type: !isJobPart ? type : "",
                job_type: isJobPart ? job_type : "",
                practice_id: !isJobPart
                  ? app.$auth.user.practice_detail.practice.id
                  : "",
                job_practice_id: isJobPart
                  ? app.$auth.user.practice_detail.practice.id
                  : "",
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
                title_includes: "",
                job_title_includes: "",
                job_number_includes: "",
                job_part_number_includes: ""
                // has_favorite_applicants:
                //   queryStatus === "Applied" && bankStatus === "true"
                //     ? true
                //     : queryStatus === "Applied" &&
                //       (bankStatus === "false" || !bankStatus)
                //     ? false
                //     : null
              }
            }
          )
          .then(res => {
            let jobs = 0;
            jobs =
              res.data && res.data.jobs
                ? res.data.jobs.map(item => {
                  return {
                    ...item,
                    assigned_to: item.platform_job.appointed_to_locum.user
                      ? item.platform_job.appointed_to_locum.user
                        .personal_detail.name
                      : null
                  };
                })
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
      "Practice Notification Job Allocated",
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
      "Practice Notification Job Completed",
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
    filterJobList(id) {
      this.jobs = this.jobs.filter(item => item.id !== id);
    },
    getJobsPromiseAll() {
      let locum_status = [];
      let queryStatus = this.$route.query.jobStatus;
      // let bankStatus = this.$route.query.bank;

      if (!queryStatus) {
        locum_status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
        case "Completed":
          locum_status = ["Completed", "Terminated"];
          break;
        default:
          locum_status = [`${queryStatus}`];
          break;
        }
      }

      return Promise.all([
        this.$axios.$get(
          `/api/v1/practice/locums/${this.$route.params.locumId}/${
            this.isJobPart ? "job-parts" : "jobs"
          }/count`,
          {
            cache: true,
            params: {
              locum_status,
              order_by: [],
              job_number: !this.isJobPart ? this.job_number : "",
              job_part_number: this.isJobPart ? this.job_part_number : "",
              title: !this.isJobPart ? this.title : "",
              job_title: this.isJobPart ? this.job_title : "",
              type: !this.isJobPart ? this.type : "",
              job_type: this.isJobPart ? this.job_type : "",
              practice_id: !this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
                : "",
              job_practice_id: this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
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
              title_includes: this.title_includes,
              job_title_includes: this.job_title_includes,
              job_number_includes: this.job_number_includes
              // has_favorite_applicants:
              //   queryStatus === "Applied" && bankStatus === "true"
              //     ? true
              //     : queryStatus === "Applied" &&
              //       (bankStatus === "false" || !bankStatus)
              //     ? false
              //     : null
            }
          }
        ),
        this.$axios.$get(
          `/api/v1/practice/locums/${this.$route.params.locumId}/${
            this.isJobPart ? "job-parts" : "jobs"
          }`,
          {
            cache: true,
            params: {
              offset: 0,
              limit: 15,
              locum_status,
              order_by: [],
              job_number: !this.isJobPart ? this.job_number : "",
              job_part_number: this.isJobPart ? this.job_part_number : "",
              title: !this.isJobPart ? this.title : "",
              job_title: this.isJobPart ? this.job_title : "",
              type: !this.isJobPart ? this.type : "",
              job_type: this.isJobPart ? this.job_type : "",
              practice_id: !this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
                : "",
              job_practice_id: this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
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
              title_includes: this.title_includes,
              job_title_includes: this.job_title_includes,
              job_number_includes: this.job_number_includes,
              job_part_number_includes: this.job_part_number_includes

              // has_favorite_applicants:
              //   queryStatus === "Applied" && bankStatus === "true"
              //     ? true
              //     : queryStatus === "Applied" &&
              //       (bankStatus === "false" || !bankStatus)
              //     ? false
              //     : null
            }
          }
        )
      ])
        .then(([responseCount, responseJobs]) => {
          this.jobs =
            responseJobs.data && responseJobs.data.jobs
              ? responseJobs.data.jobs.map(item => {
                return {
                  ...item,
                  assigned_to: item.platform_job.appointed_to_locum.user
                    ? item.platform_job.appointed_to_locum.user
                      .personal_detail.name
                    : null
                };
              })
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
      // let bankStatus = this.$route.query.bank;

      if (!queryStatus) {
        locum_status = ["Allocated"];
      } else if (queryStatus) {
        switch (queryStatus) {
        case "Completed":
          locum_status = ["Completed", "Terminated"];
          break;
        default:
          locum_status = [`${queryStatus}`];
          break;
        }
      }

      return this.$axios
        .$get(
          `/api/v1/practice/locums/${this.$route.params.locumId}/${
            this.isJobPart ? "job-parts" : "jobs"
          }`,
          {
            cache: true,
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
              practice_id: !this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
                : "",
              job_practice_id: this.isJobPart
                ? this.$auth.user.practice_detail.practice.id
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
              title_includes: this.title_includes,
              job_title_includes: this.job_title_includes,
              job_number_includes: this.job_number_includes
              // has_favorite_applicants:
              //   queryStatus === "Applied" && bankStatus === "true"
              //     ? true
              //     : queryStatus === "Applied" &&
              //       (bankStatus === "false" || !bankStatus)
              //     ? false
              //     : null
            }
          }
        )
        .then(res => {
          this.jobs =
            res.data && res.data.jobs
              ? res.data.jobs.map(item => {
                return {
                  ...item,
                  assigned_to: item.platform_job.appointed_to_locum.user
                    ? item.platform_job.appointed_to_locum.user
                      .personal_detail.name
                    : null
                };
              })
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
        this.$route.path.includes("/sessions") &&
        (this.$route.query.jobStatus === "Live" ||
          this.$route.query.jobStatus === "Applied")
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
        (this.$route.query.jobStatus === "Applied" ||
          this.$route.query.jobStatus === "Live")
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
        (this.$route.query.jobStatus === "Applied" ||
          this.$route.query.jobStatus === "Live")
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
        this.$route.path.includes("/sessions") &&
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
        this.$route.path.includes("/sessions") &&
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
        this.$route.path.includes("/sessions") &&
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
        this.$route.path.includes("/sessions") &&
        (this.$route.query.jobStatus === "Cancelled" ||
          this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Ongoing" ||
          this.$route.query.jobStatus === "Live" ||
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
        this.$route.path.includes("/sessions") &&
        (this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Ongoing" ||
          this.$route.query.jobStatus === "Live" ||
          this.$route.query.jobStatus === "Applied")
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
        (this.$route.query.jobStatus === "Declined" ||
          this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Ongoing" ||
          this.$route.query.jobStatus === "Live" ||
          this.$route.query.jobStatus === "Applied")
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
        (this.$route.query.jobStatus === "Declined" ||
          this.$route.query.jobStatus === "Allocated")
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
        this.$route.query.jobStatus === "Allocated"
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
        (this.$route.query.jobStatus === "Unfilled" ||
          this.$route.query.jobStatus === "Allocated" ||
          this.$route.query.jobStatus === "Ongoing" ||
          this.$route.query.jobStatus === "Live" ||
          this.$route.query.jobStatus === "Applied")
      ) {
        this.showRefresh = true;
      }
    },
    async refreshJobs() {
      this.current_page = 1;
      this.offset = 0;
      this.limit = 15;
      this.initialLoading = true;
      await this.getJobsPromiseAll();
      this.initialLoading = false;
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
        "Practice Notification Job Allocated",
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
        "Practice Notification Job Completed",
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
      this.offset = 0;
      this.limit = 15;
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
        case "calendar_date_start":
          sorting = "calendar_date_start";
          break;
        case "calendar_date_end":
          sorting = "calendar_date_end";
          break;
        case "job.rate":
          sorting = "job_rate";
          break;
        case "job.locum_detail_rate_type.name":
          sorting = "job_rate_type_name";
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
      this.offset = 0;
      this.limit = 15;
      this.order_by = [];
      this.job_number = "";
      this.job_part_number = "";
      this.title = "";
      this.job_title = "";
      this.type = "";
      this.job_type = "";
      this.practice_id = "";
      this.job_practice_id = "";
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
