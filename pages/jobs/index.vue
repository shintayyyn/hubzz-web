<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
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
          class="flex-wrap justify-start items-end z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_number_includes"
              class="px-1"
              :type="'text'"
              :name="'job_number_includes'"
              :label="'Job number'"
            />
          </div>

          <div
            v-if="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() !== 'private')"
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
          >
            <AppInput
              v-model="practice_id"
              :type="'select'"
              :name="'practice_id'"
              :placeholder="'Select...'"
              :label="'Surgery'"
              :items="practiceLists"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="title_includes"
              class="px-1"
              :type="'text'"
              :name="'title_includes'"
              :label="'Job Title'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="shift_id"
              class="px-1"
              :type="'select'"
              :name="'shift_id'"
              :label="'Shift'"
              :items="shifts"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="rate"
              class="px-1"
              :type="'text'"
              :name="'rate'"
              :label="'Rate £'"
              :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
              :limit="8"
              @keydown="isNumber($event)"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="rate_type_id"
              class="px-1"
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
              v-model="near_post_code"
              class="px-1"
              :name="'near_post_code'"
              :label="'Post code'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="miles" class="px-1" :type="'number'" :name="'miles'" :label="'Miles'" />
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
              k="filterJob"
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

        <div v-if="!jobs.length && !loading && !isFiltered" class="flex justify-center py-4">
          {{ noJobsToDisplay }}
        </div>

        <div v-if="!jobs.length && !loading && isFiltered" class="flex justify-center py-4">
          No Jobs Found
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="$route.name === 'jobs-index-id' || $route.name === 'jobs-index-id-job-parts-jobPartId'"
            class="shield"
            :to="{ path: `/jobs?status=${$route.query.status ? $route.query.status : 'Allocated'}`, query: {...$route.query}}"
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
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppTime from "@/components/Base/AppTime"
import AppPostCode from "@/components/Base/AppPostCode"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"

export default {
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppTime,
    AppPostCode,
    AppButton,
    AppLoading,
  },

  props: {
    invoiceStatusList: {
      type: Array,
      default: () => [],
    },
    practiceTypeList: {
      type: Array,
      default: () => [],
    },
  },

  middleware ({ query, error, }) {
    if (
      query.status
      && ![
        "allocated",
        "ongoing",
        "available",
        "applied",
        "unsuccessful",
        "withdrawn",
        "cancelled",
        "completed",
        "approved",
        "private",
      ].includes(query.status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Job Status is Invalid", })
    }
  },

  data () {
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
      limit: 20,
      order_by: [],
      job_number: "",
      title: "",
      type: "",
      practice_id: "",
      shift_id: "",
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
      filterModal: false,
      isFiltered: false,
      showRefresh: false,
    }
  },

  computed: {
    getRequestQueryFilters () {
      let locum_status = []

      let queryStatus = this.$route.query.status

      if (queryStatus) {
        switch (queryStatus) {
        case "Available":
          locum_status = ["Matched", "Available",]
          break
        case "Private":
          locum_status = []
          break
        default:
          locum_status = [`${queryStatus}`,]
          break
        }
      } else if (!queryStatus) {
        locum_status = ["Allocated",]
      }

      return {
        locum_job_status: locum_status,
        practice_id: this.practice_id,
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
        type: queryStatus === "Private"
          ? "Private"
          : "Platform",
      }
    },

    noJobsToDisplay () {
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : ""
      switch (queryStatus) {
      case "allocated":
      case "ongoing":
      case "declined":
      case "cancelled":
      case "withdrawn":
      case "approved":
      case "private":
        return `You do not have any ${queryStatus} jobs`
      case "available":
      case "matched":
        return `There are no ${queryStatus} jobs nearby and suited for you at this time`
      case "public":
      case "bank":
        return `There are no available jobs nearby and suited for you at this time`
      case "applied":
      case "unsuccessful":
        return `You have not yet ${
          queryStatus === "applied" ? "applied" : "rejected"
        } for a job`
      case "completed":
        return "You have not yet completed any job"

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
          width: 130
        },
        {
          name: "Surgery",
          dataIndex: "practice_name",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Title",
          dataIndex: "title",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Shifts",
          dataIndex: "shift_names",
          sortable: true,
          class: "text-center",
          width: 150
        },
        {
          name: "Rates",
          dataIndex: "rate_range_formatted",
          sortable: true,
          class: "text-center",
          width: 120
        },
        {
          name: "Rate Type",
          dataIndex: "rate_type_names",
          sortable: true,
          class: "text-center",
          width: 120
        },
        {
          name: "From",
          dataIndex: "datetime_start_in_gb_formatted",
          sortable: true,
          class: "text-center",
          width: 150
        },
        {
          name: "To",
          dataIndex: "datetime_end_in_gb_formatted",
          sortable: true,
          class: "text-center",
          width: 150
        },
      ]

      if (queryStatus === "applied") {
        columns.push({
          name: "Applicants",
          dataIndex: "applicants_count",
          sortable: true,
          class: "text-center",
        })
      }

      if (queryStatus === "unsuccessful") {
        columns.push({
          name: "Rejected At",
          dataIndex: "appointed_at_in_gb_formatted",
          sortable: true,
          class: "text-center",
          width: 150
        })
      }

      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "declined_at_in_gb_formatted",
          sortable: true,
          class: "text-center",
        })
      }

      if (queryStatus === "cancelled") {
        columns.push(
          {
            name: "Cancelled At",
            dataIndex: "cancelled_at_in_gb_formatted",
            sortable: true,
            class: "text-center",
          },
          {
            name: "Tag",
            dataIndex: "tag_status",
            sortable: true,
            class: "text-center",
          }
        )
      }
      
      return columns
    },
  },

  watch: {
    async "$route.query" (newValue, oldValue) {
      let newStatus = newValue.status
      let oldStatus = oldValue.status
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1
        this.filterModal = false
        this.showRefresh = false
        this.total = 0
        this.jobs = []
        this.clearFilters()
        this.isFiltered = false
        this.initialLoading = true
        await this.getLocumJobs()
        this.initialLoading = false
      }
    },
  },

  mounted () {
    this.$socket.on('Locum Notification Job Available', this.getAvailableJobsRealTime)
    this.$socket.on('Locum Notification Job Matched', this.getMatchedJobsRealTime)
    this.$socket.on('Locum Notification Job Unsuccessful', this.getUnsuccessfulJobsRealTime)
    this.$socket.on('Locum Notification Job Allocated', this.getCurrentJobsRealTime)
    this.$socket.on('Locum Notification Job Ongoing', this.getOngoingJobsRealTime)
    this.$socket.on('Locum Notification Job Part Completed', this.getCompletedJobsRealTime)
    this.$socket.on('Locum Notification Job Completed', this.getCompletedJobsRealTime)
    this.$socket.on('Locum Notification Locum Invoice Updated', this.getApprovedJobsRealTime)
    this.$socket.on('Locum Notification Job Cancelled', this.getCancelledJobsRealTime)
    this.$socket.on('Locum Notification Job Amended', this.getAmendedJobsRealTime)
    this.$socket.on('Locum Notification Job Updated', this.getUpdatedJobsRealTime)
    this.$socket.on('Locum Notification Job Declined', this.getDeclinedJobsRealTime)
    this.$socket.on('Locum Notification Job Terminated', this.getTerminatedJobsRealTime)
    this.$socket.on('Locum Notification Job Auto Declined', this.getAutoDeclinedJobsRealTime)
    this.$socket.on('Locum Notification Job Unavailable', this.getUnavailableJobsRealTime)
    this.$socket.on('Locum Notification Job Unqualified', this.getUnqualifiedJobsRealTime)

    this.current_page = 1
    this.filterModal = false
    this.showRefresh = false
    this.total = 0
    this.jobs = []
    this.clearFilters()
    this.isFiltered = false
    this.initialLoading = true
    this.getLocumJobs().finally(() => {
      this.initialLoading = false
    })

    Promise.all([
      this.$axios.$get(`/api/v1/shifts`).then(res => {
        let shifts = []
        shifts.push({ label: "All", value: "", })
        res.data.shifts.forEach(shift => {
          shifts.push({ label: shift.name, value: shift.id, })
        })
        return shifts
      }),

      this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
        let rates = []
        rates.push({ label: "All", value: "", })
        res.data.locum_detail_rate_types.forEach(rateType => {
          rates.push({ label: rateType.name, value: rateType.id, })
        })
        return rates
      }),
    ]).then((responses) => {
      const [shifts, rates,] = responses

      this.shifts = shifts
      this.rates = rates
    })

    this.$axios.$get(`/api/v1/locum/practices`, {
      params: {
        status: "Active",
        locum_practice_type: "Applied",
      },
    }).then(res => {
      this.practiceLists = res.data.practices.map(item => ({
        label: item.name,
        value: item.id,
      }))
    })
  },

  destroyed () {
    this.$socket.removeListener('Locum Notification Job Available', this.getAvailableJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Matched', this.getMatchedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Unsuccessful', this.getUnsuccessfulJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Allocated', this.getCurrentJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Ongoing', this.getOngoingJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Part', this.getCompletedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Completed', this.getCompletedJobsRealTime)
    this.$socket.removeListener('Locum Notification Locum Invoice ', this.getApprovedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Cancelled', this.getCancelledJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Amended', this.getAmendedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Updated', this.getUpdatedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Declined', this.getDeclinedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Terminated', this.getTerminatedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Auto ', this.getAutoDeclinedJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Unavailable', this.getUnavailableJobsRealTime)
    this.$socket.removeListener('Locum Notification Job Unqualified', this.getUnqualifiedJobsRealTime)

    this.showRefresh = false
  },

  methods: {
    routerLink (jobOrJobPart) {
      return {
        name: "jobs-index-id",
        params: {
          id: jobOrJobPart.id,
        },
        query: {
          ...this.$route.query,
        },
      }
    },

    async filterJobList () {
      // this.jobs = this.jobs.filter(item => item.id !== id);
      this.loading = true
      await this.getJobs()
      this.loading = false
    },

    getLocumJobs () {
      return Promise.all([
        this.$axios.get('/api/v2/locum/locum-user-jobs/count', {
          params: {
            ...this.getRequestQueryFilters,
          },
        }),
        this.$axios.get('/api/v2/locum/locum-user-jobs', {
          params: {
            offset: 0,
            limit: 20,
            order_by: [],
            ...this.getRequestQueryFilters,
          },
        }),
      ]).then(([responseCount, responseJobs,]) => {
        this.total = responseCount.data.data.count
        this.jobs = responseJobs.data.data.jobs
      }).catch(err => {
        console.log("err", err.response || err)
        throw err
      })
    },

    getJobs () {
      return this.$axios.get('/api/v2/locum/locum-user-jobs', {
        params: {
          offset: this.offset,
          limit: this.limit,
          order_by: this.order_by,
          ...this.getRequestQueryFilters,
        },
      }).then(response => {
        this.jobs = response.data.data.jobs
      }).catch(err => {
        console.log("err", err.response || err)
        throw err
      })
    },

    async getAvailableJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && this.$route.query.status === "Available"
      ) {
        this.showRefresh = true
      }
    },

    async getMatchedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && (this.$route.query.status === "Available"
          || this.$route.query.status === "Matched")
      ) {
        this.showRefresh = true
      }
    },

    async getUnsuccessfulJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && (this.$route.query.status === "Unsuccessful"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getCurrentJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
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
        this.$route.path.includes("/jobs")
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
        this.$route.path.includes("/jobs")
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
        this.$route.path.includes("/jobs")
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
        this.$route.path.includes("/jobs")
        && (this.$route.query.status === "Cancelled"
          || this.$route.query.status === "Allocated"
          || this.$route.query.status === "Ongoing"
          || this.$route.query.status === "Available"
          || this.$route.query.status === "Matched"
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
        this.$route.path.includes("/jobs")
        && (!this.$route.query.status
          || this.$route.query.status === "Allocated"
          || this.$route.query.status === "Ongoing"
          || this.$route.query.status === "Available"
          || this.$route.query.status === "Matched"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getUpdatedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && (this.$route.query.status === "Available"
          || this.$route.query.status === "Matched")
      ) {
        this.showRefresh = true
      }
    },

    async getDeclinedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && (this.$route.query.status === "Declined"
          || this.$route.query.status === "Allocated"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async getTerminatedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && this.$route.query.status === "Ongoing"
      ) {
        this.showRefresh = true
      }
    },

    async getAutoDeclinedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && (this.$route.query.status === "Declined"
          || this.$route.query.status === "Allocated")
      ) {
        this.showRefresh = true
      }
    },

    async getUnavailableJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && this.$route.query.status === "Available"
      ) {
        this.showRefresh = true
      }
    },

    async getUnqualifiedJobsRealTime (job) {
      if (!job) {
        return
      }
      if (
        this.$route.path.includes("/jobs")
        && (this.$route.query.status === "Allocated"
          || this.$route.query.status === "Available"
          || this.$route.query.status === "Matched"
          || this.$route.query.status === "Applied")
      ) {
        this.showRefresh = true
      }
    },

    async appointmentUpdated () {
      // this.loading = true;
      // await this.getJobsCount(this.params);
      // await this.getJobs(this.params);
      // this.loading = false;
    },

    async refreshJobs () {
      this.current_page = 1
      this.offset = 0
      this.limit = 20
      this.initialLoading = true
      await this.getLocumJobs()
      this.initialLoading = false
      this.showRefresh = false
    },

    async filterJob () {
      this.current_page = 1
      this.offset = 0
      this.limit = 20
      this.initialLoading = true
      this.isFiltered = true
      await this.getLocumJobs()
      this.initialLoading = false
      this.filterModal = false
    },

    async sorted (order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1]
        let sorting = item.split(":")[0]
        switch (sorting) {
        case "practice_name":
          sorting = "surgery"
          break
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
        case "rate_name":
          sorting = "rate"
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
      this.search_practice = null
      this.search_private_practice = null
      this.offset = 0
      this.limit = 20
      this.order_by = []
      this.job_number = ""
      this.title = ""
      this.type = ""
      this.practice_id = ""
      this.shift_id = ""
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
    },

  },

}
</script>
