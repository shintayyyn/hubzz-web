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
        <AppFilter searchLabel="Job Search" @onTabChange="onTabChange">
          <template v-slot:extraButton>
            <AppButton
              v-if="showRefresh"
              :label="'Refresh'"
              :in-style="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
              customTheme="border-2"
              @click="refreshJobs"
            />
          </template>
          <template v-slot:search>
            <div class="w-32">
              <AppInput
                v-model="profession_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'profession_id'"
                :label="'Roles'"
                :placeholder="'Select...'"
                :items="professions"
                nolabel
                border
              />
            </div>
            <div class="">
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
            <div class="w-32">
              <AppInput
                v-model="rate_type_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'rate_type_id'"
                :label="'Rate types'"
                :items="rates"
                nolabel
                border
              />
            </div>
            <div class="w-32">
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
            <div class="">
              <AppDate
                v-model="calendar_date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                :floatRight="$route.query.status !== 'Live'"
                nolabel
                border
              />
            </div>
            <div class="">
              <AppDate
                v-model="calendar_date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                :floatRight="$route.query.status !== 'Live'"
                nolabel
                border
              />
            </div>
            <AppButton class="mr-1" :label="'Search'" @click="filterJob" />
          </template>

          <template v-slot:filter>
            <div class="">
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
            <div class="">
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
            <div class="w-32">
              <AppInput
                v-model="profession_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'profession_id'"
                :label="'Roles'"
                :placeholder="'Select...'"
                :items="professions"
                nolabel
                border
              />
            </div>
            <div class="">
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
            <div class="w-32">
              <AppInput
                v-model="rate_type_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'rate_type_id'"
                :label="'Rate types'"
                :items="rates"
                nolabel
                border
              />
            </div>
            <div class="w-32">
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
            <div class="">
              <AppDate
                v-model="calendar_date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                :floatRight="$route.query.status !== 'Live'"
                nolabel
                border
              />
            </div>
            <div class="">
              <AppDate
                v-model="calendar_date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                :floatRight="$route.query.status !== 'Live'"
                nolabel
                border
              />
            </div>
            <div v-if="$route.query.status === 'Live'" class="w-32">
              <AppInput
                v-model="favorite_only"
                :type="'select'"
                :name="'favorite_only'"
                :label="'Favourite Only'"
                :placeholder="'Select...'"
                :items="[
                  { label: 'All', value: '' },
                  { label: 'Yes', value: true },
                  { label: 'No', value: false }
                ]"
                :wrapperClass="'px-1'"
                nolabel
                border
              />
            </div>
            <AppButton class="mr-1" :label="'Apply'" @click="filterJob" />

            <AppButton
              :label="'Clear'"
              customTheme="border hover:bg-gray-200"
              @click="clearFilters"
            />
          </template>
        </AppFilter>
        <!-- <div class="flex items-center">
          <button @click="filterModal = !filterModal" class="flex items-center justify-between text-sm p-1 border rounded mr-1">
            <p class="mx-2">Filter</p>
            <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterModal ? 'transform: rotate(180deg)' : ''" /></span>
          </button>

          <transition name="fade">
          <div class="md:px-1 flex w-full" v-if="filterModal">
            <AppButton
              :label="'Clear'"
              :in-style="'padding:5px 14px;margin-bottom:0'"
              @click="clearFilters"
            />

            <AppButton
              class="mx-2"
              :label="'Search'"
              :in-style="'padding:5px 14px;margin-bottom:0'"
              @click="filterJob"
            />
          </div>
          </transition>

          <AppButton
            v-if="showRefresh"
            :label="'Refresh'"
            :in-style="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
            customTheme="border-2"
            @click="refreshJobs"
          />
        </div>
        <transition name="drop-down">
        <div class="flex flex-col md:flex-row items-start mt-2" v-if="filterModal">
            <div class="">
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
            <div class="">
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
            <div class="">
              <AppInput
                v-model="rate"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'rate'"
                :label="'Rate £'"
                :limit="8"
                @keydown="isNumber($event)"
                nolabel
                border
              />
            </div>
            <div class="w-32">
              <AppInput
                v-model="rate_type_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'rate_type_id'"
                :label="'Rate types'"
                :items="rates"
                nolabel
                border
              />
            </div>
            <div class="w-32">
              <AppInput
                v-model="profession_id"
                :type="'select'"
                :name="'profession_id'"
                :label="'Roles'"
                :placeholder="'Select...'"
                :items="professions"
                nolabel
                border
              />
            </div>
            <div class="w-32">
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
            <div class="">
              <AppDate
                v-model="calendar_date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                :floatRight="$route.query.status !== 'Live'"
                nolabel
                border
              />
            </div>
            <div class="">
              <AppDate
                v-model="calendar_date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                :floatRight="$route.query.status !== 'Live'"
                nolabel
                border
              />
            </div>
            <div class="w-32" v-if="$route.query.status === 'Live'">
              <AppInput
                v-model="favorite_only"
                :type="'select'"
                :name="'favorite_only'"
                :label="'Favorite Only'"
                :placeholder="'Select...'"
                :items="[{label: 'All', value: ''}, {label: 'Yes', value: true}, {label: 'No', value: false}]"
                :wrapperClass="'px-1'"
                nolabel
                border
              />
            </div>
        </div>
        </transition> -->

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
          :min-height="'55vh'"
          :customWidth="800"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:practice="slotProps">
            <div>
              {{ slotProps.item.practice_name }}
              <template v-if="slotProps.item.parent_practice_name">
                <br>
                <small>({{ slotProps.item.parent_practice_name }})</small>
              </template>
            </div>
          </template>
        </AppTable>

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
        <!-- 
        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="$route.name === 'sessions-index-id' || $route.name === 'sessions-index-id-job-parts-jobPartId'"
            class="shield"
            :to="{ path: `/sessions?status=${$route.query.status ? $route.query.status : 'Allocated'}`, query: {...$route.query}}"
          />
        </transition> -->

        <div>
          <!-- <nuxt-child @cancelled="filterJobList" @appointed="filterJobList" /> -->
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
import AppFilter from "@/components/Base/AppFilter"

export default {
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppButton,
    AppLoading,
    AppFilter,
  },

  props: {
    invoiceStatusList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

  middleware ({ query, error, }) {
    if (
      query.status
      && ![
        "pending",
        "allocated",
        "ongoing",
        "live",
        "applied",
        "unfilled",
        "withdrawn",
        "cancelled",
        "completed",
        "approved",
      ].includes(query.status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Session Status is Invalid", })
    }
  },

  data () {
    return {
      filterTab: null,
      total: 0,
      jobs: [],
      initialLoading: false,
      loading: false,
      current_page: 1,
      // app table params
      offset: 0,
      limit: 20,
      order_by: [],
      job_number: "",
      title: "",
      type: "",
      job_type: "",
      shift_id: "",
      profession_id: "",
      favorite_only: "",
      job_shift_id: "",
      rate: "",
      job_rate: "",
      rate_type_id: "",
      near_post_code: "",
      miles: "",
      calendar_date_start: "",
      calendar_date_end: "",
      time_start: "",
      time_end: "",
      title_includes: "",
      job_number_includes: "",
      shifts: [],
      rates: [],
      professions: [],
      filterModal: false,
      isFiltered: false,
      showRefresh: false,
    }
  },

  computed: {
    getRequestQueryFilters () {
      return {
        // practice_id: this.$route.query.status === "Pending" ? null : this.$auth.user.practice_detail.practice.id,
        practice_job_status: this.$route.query.status || "Allocated",
        type: this.type,
        shift_id_includes: this.shift_id,
        rate_range_includes: this.rate,
        rate_type_id_includes: this.rate_type_id,
        near_postcode: this.near_post_code,
        near_postcode_travel_miles: this.miles,
        calendar_date_start: this.calendar_date_start,
        calendar_date_end: this.calendar_date_end,
        time_start: this.time_start,
        time_end: this.time_end,
        title_includes: this.title_includes,
        job_number_includes: this.job_number_includes,
        profession_id: this.profession_id,
        favorite_only: this.favorite_only,
      }
    },

    noJobsToDisplay () {
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : ""
      switch (queryStatus) {
      case "pending":
      case "allocated":
      case "ongoing":
      case "declined":
      case "withdrawn":
      case "approved":
      case "unfilled":
      case "live":
        return `You do not have any ${queryStatus} jobs`
      case "applied":
        return `There have been no applications for this job`
      case "completed":
      case "cancelled":
        return `You have not yet ${queryStatus} any job`
      default:
        return "You do not have any allocated jobs"
      }
    },

    columns () {
      const queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "allocated"

      const columns = [
        {
          name: "Job Number",
          dataIndex: "job_number",
          sortable: true,
          width: 120,
        },
        {
          slot: true,
          slotName: "practice",
          name: "Practice",
          dataIndex: "practice_name",
          class: "text-center",
          sortable: true,
        },
        // {
        //   name: "Practice",
        //   dataIndex: "practice_name",
        //   class: "text-center",
        //   sortable: true,
        // },
        // {
        //   name: "Hub",
        //   dataIndex: "parent_practice_name",
        //   class: "text-center",
        //   sortable: true,
        // },
        {
          name: "Profession",
          dataIndex: "profession_name",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Title",
          dataIndex: "title",
          class: "text-center break-words",
          sortable: true,
        },
        {
          name: "Shifts",
          dataIndex: "shift_names",
          sortable: true,
          class: "text-center",
          width: 150,
        },
        {
          name: "Rates",
          dataIndex: "rate_range_formatted",
          sortable: true,
          class: "text-center",
          width: 150,
        },
        {
          name: "Rate Type",
          dataIndex: "rate_type_names",
          sortable: true,
          class: "text-center",
          width: 170,
        },
        {
          name: "From",
          dataIndex: "datetime_start_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 130,
        },
        {
          name: "To",
          dataIndex: "datetime_end_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 130,
        },
      ]

      if (queryStatus === "live") {
        columns.push({
          name: "Favourite only",
          dataIndex: "favorite_only_formatted",
          class: "text-center",
          sortable: true,
          width: 100,
        })
      }

      if (queryStatus === "applied") {
        columns.push({
          name: "Applicants",
          dataIndex: "applicants_count",
          sortable: true,
          class: "text-center",
          width: 100,
        })
      }

      return columns
    },
  },

  watch: {
    async "$route.query" (newValue, oldValue) {
      let newStatus = newValue.status
      let oldStatus = oldValue.status
      // let newBank = newValue.bank;
      // let oldBank = oldValue.bank;
      if (
        newStatus
        && newStatus !== null
        && newStatus !== oldStatus
        // || (newBank && newBank !== null && newBank !== oldBank)
      ) {
        this.current_page = 1
        this.filterModal = false
        this.showRefresh = false
        this.total = 0
        this.jobs = []
        this.clearFilters()
        this.isFiltered = false
        this.initialLoading = true
        await this.getSessions()
        this.initialLoading = false
      }
    },
  },

  mounted () {
    this.$socket.on(
      "Practice Notification Job Available",
      this.getAvailableJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Application",
      this.getAppliedJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Application Cancelled",
      this.getAppliedCancelledJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Allocated",
      this.getCurrentJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Ongoing",
      this.getOngoingJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Part Completed",
      this.getCompletedJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Completed",
      this.getCompletedJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Locum Invoice Updated",
      this.getApprovedJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Cancelled",
      this.getCancelledJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Amended",
      this.getAmendedJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Declined",
      this.getDeclinedJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Auto Declined",
      this.getAutoDeclinedJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Update Accept",
      this.getUpdateAcceptJobsRealTime
    )
    this.$socket.on(
      "Practice Notification Job Unfilled",
      this.getUnfilledJobsRealTime
    )

    this.current_page = 1
    this.filterModal = false
    this.showRefresh = false
    this.total = 0
    this.jobs = []
    this.clearFilters()
    this.isFiltered = false
    this.initialLoading = true
    this.getSessions().finally(() => {
      this.initialLoading = false
    })

    Promise.all([
      this.$axios.get("/api/v1/professions?limit=999").then(response =>
        response.data.data.professions.map(profession => ({
          label: profession.name,
          value: profession.id,
        }))
      ),

      this.$axios.get("/api/v1/shifts?limit=999").then(response =>
        response.data.data.shifts.map(shift => ({
          label: shift.name,
          value: shift.id,
        }))
      ),

      this.$axios
        .get("/api/v1/locum-detail-rate-types?limit=999")
        .then(response =>
          response.data.data.locum_detail_rate_types.map(
            locumDetailRateType => ({
              label: locumDetailRateType.name,
              value: locumDetailRateType.id,
            })
          )
        ),
    ]).then(responses => {
      const [professions, shifts, rates,] = responses

      this.professions = professions
      this.shifts = [{ label: "All", value: "", }, ...shifts,]
      this.rates = [{ label: "All", value: "", }, ...rates,]
    })
  },

  destroyed () {
    this.$socket.removeListener(
      "Practice Notification Job Available",
      this.getAvailableJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Application",
      this.getAppliedJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Application Cancelled",
      this.getAppliedCancelledJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Allocated",
      this.getCurrentJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Ongoing",
      this.getOngoingJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Part Completed",
      this.getCompletedJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Completed",
      this.getCompletedJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Locum Invoice Updated",
      this.getApprovedJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Cancelled",
      this.getCancelledJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Amended",
      this.getAmendedJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Declined",
      this.getDeclinedJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Auto Declined",
      this.getAutoDeclinedJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Update Accept",
      this.getUpdateAcceptJobsRealTime
    )
    this.$socket.removeListener(
      "Practice Notification Job Unfilled",
      this.getUnfilledJobsRealTime
    )

    this.showRefresh = false
  },

  methods: {
    onTabChange (tab) {
      if (tab && this.filterTab !== tab) {
        this.clearFilters()
        this.filterTab = tab
      } else if (!tab && !this.filterTab) {
        this.filterTab = tab
      }
    },

    routerLink (jobOrJobPart) {
      return {
        name: "sessions-index-id",
        params: {
          id: jobOrJobPart.id,
        },
        query: {
          ...this.$route.query,
        },
      }
    },

    filterJobList (id) {
      this.jobs = this.jobs.filter(item => item.id !== id)
    },

    getSessions () {
      return Promise.all([
        this.$axios.get("/api/v2/practice/practice-jobs/count", {
          params: {
            ...this.getRequestQueryFilters,
          },
        }),

        this.$axios.get("/api/v2/practice/practice-jobs", {
          params: {
            ...this.getRequestQueryFilters,
            offset: this.offset,
            limit: this.limit,
            order_by: [],
          },
        }),
      ])
        .then(([responseCount, responseJobs,]) => {
          this.total = responseCount.data.data.count
          this.jobs = responseJobs.data.data.jobs
        })
        .catch(err => {
          console.log("err", err.response || err)
          throw err
        })
    },

    getJobs () {
      return this.$axios
        .get("/api/v2/practice/practice-jobs", {
          params: {
            ...this.getRequestQueryFilters,
            offset: this.offset,
            limit: this.limit,
            order_by: this.order_by,
          },
        })
        .then(responseJobs => {
          this.jobs = responseJobs.data.data.jobs
        })
        .catch(err => {
          console.log("err", err.response || err)
          throw err
        })
    },

    async getAvailableJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Live"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getAppliedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Applied"
          || this.$route.query.status === "Live")
      ) {
        this.showRefresh = true
      }
    },

    async getAppliedCancelledJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Applied"
          || this.$route.query.status === "Live")
      ) {
        this.showRefresh = true
      }
    },

    async getCurrentJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Allocated"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getOngoingJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Ongoing"
          || this.$route.query.status === "Allocated")
      ) {
        this.showRefresh = true
      }
    },

    async getCompletedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Completed"
          || this.$route.query.status === "Ongoing")
      ) {
        this.showRefresh = true
      }
    },

    async getApprovedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Approved"
          || this.$route.query.status === "Completed")
      ) {
        this.showRefresh = true
      }
    },

    async getCancelledJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Cancelled"
          || this.$route.query.status === "Allocated"
          || this.$route.query.status === "Ongoing"
          || this.$route.query.status === "Live"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getAmendedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Allocated"
          || this.$route.query.status === "Ongoing"
          || this.$route.query.status === "Live"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getDeclinedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Declined"
          || this.$route.query.status === "Allocated"
          || this.$route.query.status === "Ongoing"
          || this.$route.query.status === "Live"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getAutoDeclinedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Declined"
          || this.$route.query.status === "Allocated")
      ) {
        this.showRefresh = true
      }
    },

    async getUpdateAcceptJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && this.$route.query.status === "Allocated"
      ) {
        this.showRefresh = true
      }
    },

    async getUnfilledJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/sessions")
        && (this.$route.query.status === "Unfilled"
          || this.$route.query.status === "Allocated"
          || this.$route.query.status === "Ongoing"
          || this.$route.query.status === "Live"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async refreshJobs () {
      this.current_page = 1
      this.offset = 0
      this.limit = 20
      this.initialLoading = true
      await this.getSessions()
      this.initialLoading = false
      this.showRefresh = false
    },

    async filterJob () {
      this.current_page = 1
      this.offset = 0
      this.limit = 20
      this.initialLoading = true
      this.isFiltered = true
      await this.getSessions()
      this.initialLoading = false
      this.filterModal = false
    },

    async sorted (order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1]
        let sorting = item.split(":")[0]
        switch (sorting) {
        case "date_time_start":
          sorting = "date_start"
          break
        case "date_time_end":
          sorting = "date_end"
          break
        case "calendar_date_start":
          sorting = "calendar_date_start"
          break
        case "calendar_date_end":
          sorting = "calendar_date_end"
          break
        case "job.rate":
          sorting = "job_rate"
          break
        case "job.locum_detail_rate_type.name":
          sorting = "job_rate_type_name"
          break
        case "isGp":
          sorting = "profession_name"
          break
        default:
          sorting
        }
        return `${sorting}:${order}`
      })
      if (orderBy.includes("date_start:desc")) {
        orderBy.push("time_start:desc")
      } else if (orderBy.includes("date_start:asc")) {
        orderBy.push("time_start:asc")
      } else if (orderBy.includes("date_end:asc")) {
        orderBy.push("time_end:asc")
      } else if (orderBy.includes("date_end:desc")) {
        orderBy.push("time_end:desc")
      }
      this.current_page = 1
      this.offset = 0
      this.order_by = orderBy
      this.loading = true
      await this.getJobs()
      this.loading = false
    },

    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getJobs()
      this.loading = false
    },

    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getJobs()
      this.loading = false
    },

    clearFilters () {
      this.offset = 0
      this.limit = 20
      this.order_by = []
      this.job_number = ""
      this.title = ""
      this.type = ""
      this.job_type = ""
      this.shift_id = ""
      this.job_shift_id = ""
      this.rate = ""
      this.job_rate = ""
      this.rate_type_id = ""
      this.near_post_code = ""
      this.miles = ""
      this.calendar_date_start = ""
      this.calendar_date_end = ""
      this.time_start = ""
      this.time_end = ""
      this.title_includes = ""
      this.job_number_includes = ""
      this.profession_id = ""
      this.favorite_only = ""
    },
  },
}
</script>
