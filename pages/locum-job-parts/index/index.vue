<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppFilter searchLabel="Job Search" @onTabChange="onTabChange">
          <template v-slot:search>
            <div class="w-32">
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

            <div class="w-32">
              <AppInput
                v-model="job_rate_type_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'job_rate_type_id'"
                :label="'per'"
                :items="rates"
                nolabel
                border
              />
            </div>

            <div class="w-32">
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

            <div class="" style="width: 8em">
              <AppDate
                v-model="calendar_date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                inClass="text-center"
                nolabel
                border
              />
            </div>

            <div class="" style="width: 7em">
              <AppTime v-model="time_start" :name="'time_start'" :label="'Start Time'" :wrapperClass="'px-1'" nolabel border />
            </div>

            <div class="" style="width: 8em">
              <AppDate
                v-model="calendar_date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                inClass="text-center"
                nolabel
                border
              />
            </div>

            <div class="" style="width: 7em">
              <AppTime v-model="time_end" :name="'time_end'" :label="'End Time'" :wrapperClass="'px-1'" nolabel border />
            </div>
            
            <div class="">
              <AppPostCode
                v-model="near_post_code"
                :wrapperClass="'px-1'"
                :name="'near_post_code'"
                :label="'Post code'"
                nolabel
                border
              />
            </div>

            <div class="">
              <AppInput v-model="miles" :wrapperClass="'px-1'" :type="'number'" :name="'miles'" :label="'Miles'" nolabel border />
            </div>
          
            <AppButton
              class="mr-1"
              :label="'Search'"
              @click="filterJob"
            />
          </template>
          <template v-slot:filter>
            <div class="">
              <AppInput
                v-model="job_part_number_includes"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'job_part_number_includes'"
                :label="'Job part number'"
                nolabel
                border
              />
            </div>

            <div class="">
              <AppInput
                v-model="job_title_includes"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'job_title_includes'"
                :label="'Job Title'"
                nolabel
                border
              />
            </div>

            <div class="w-32">
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

            <div class="w-32">
              <AppInput
                v-model="job_rate_type_id"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'job_rate_type_id'"
                :label="'per'"
                :items="rates"
                nolabel
                border
              />
            </div>

            <div class="w-32">
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

            <div class="" style="width: 8em">
              <AppDate
                v-model="calendar_date_start"
                :name="'calendar_date_start'"
                :label="'From'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                inClass="text-center"
                nolabel
                border
              />
            </div>

            <div class="" style="width: 7em">
              <AppTime v-model="time_start" :name="'time_start'" :label="'Start Time'" :wrapperClass="'px-1'" nolabel border />
            </div>

            <div class="" style="width: 8em">
              <AppDate
                v-model="calendar_date_end"
                :name="'calendar_date_end'"
                :label="'To'"
                :format="'YYYY-MM-DD'"
                :wrapperClass="'px-1'"
                inClass="text-center"
                nolabel
                border
              />
            </div>

            <div class="" style="width: 7em">
              <AppTime v-model="time_end" :name="'time_end'" :label="'End Time'" :wrapperClass="'px-1'" nolabel border />
            </div>

            <div class="w-32">
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

            <AppButton
              class="mr-1"
              :label="'Apply'"
              @click="filterJob"
            />

            <AppButton
              :label="'Clear'"
              customTheme="border hover:bg-gray-200"
              @click="clearFilters"
            />
          </template>
          <template v-slot:extraButton>
            <AppButton
              v-if="showRefresh"
              :label="'Refresh'"
              customTheme="border hover:bg-gray-200"
              @click="refreshJobs"
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
        <div v-if="filterModal" class="flex flex-col md:flex-row items-start mt-2">
          <div class="">
            <AppInput
              v-model="job_part_number_includes"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'job_part_number_includes'"
              :label="'Job part number'"
              nolabel
              border
            />
          </div>

          <div class="">
            <AppInput
              v-model="job_title_includes"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'job_title_includes'"
              :label="'Job Title'"
              nolabel
              border
            />
          </div>

          <div class="w-32">
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

          <div class="">
            <AppInput
              v-model="job_rate"
              :wrapperClass="'px-1'"
              :type="'text'"
              :name="'job_rate'"
              :label="'Rate £'"
              :limit="8"
              @keydown="isNumber($event)"
              nolabel
              border
            />
          </div>

          <div class="w-32">
            <AppInput
              v-model="job_rate_type_id"
              :wrapperClass="'px-1'"
              :type="'select'"
              :name="'job_rate_type_id'"
              :label="'per'"
              :items="rates"
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
              nolabel
              border
            />
          </div>

          <div class="">
            <AppTime v-model="time_start" :name="'time_start'" :label="'Start Time'" :wrapperClass="'px-1'" nolabel border/>
          </div>

          <div class="">
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

          <div class="">
            <AppTime v-model="time_end" :name="'time_end'" :label="'End Time'" :wrapperClass="'px-1'"/>
          </div>

          <div class="">
            <AppPostCode
              v-model="near_post_code"
              :wrapperClass="'px-1'"
              :name="'near_post_code'"
              :label="'Post code'"
              nolabel
              border
            />
          </div>

          <div class="">
            <AppInput v-model="miles" :wrapperClass="'px-1'" :type="'number'" :name="'miles'" :label="'Miles'" nolabel border />
          </div>

          <div class="w-32">
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
        </div>
        </transition> -->
        <div>
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
            :customWidth="800"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          />
        </div>
        

        <div v-if="!jobs.length && !loading && !isFiltered" class="flex justify-center py-4">
          {{ noJobsToDisplay }}
        </div>

        <div v-if="!jobs.length && !loading && isFiltered" class="flex justify-center py-4">
          No Jobs Found
        </div>

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="$route.name === 'locum-job-parts-index-jobPartId'"
            class="shield"
            :to="{ path: `/locum-job-parts?status=${$route.query.status ? $route.query.status : 'Allocated'}`, query: {...$route.query}}"
          />
        </transition>

        <div>
          <nuxt-child
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
import AppFilter from "@/components/Base/AppFilter"

export default {
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppTime,
    AppPostCode,
    AppButton,
    AppLoading,
    AppFilter,
  },

  props: {
    invoiceStatusList: {
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
        "withdrawn",
        "cancelled",
        "completed",
        "approved",
      ].includes(query.status.toLowerCase())
    ) {
      return error({ status: 404, message: "This Job Status is Invalid", })
    }
  },

  data () {
    return {
      filterTab: null,
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

      job_part_number: "",
      job_title: "",
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

      shifts: [],
      rates: [],
      filterModal: false,
      isFiltered: false,
      showRefresh: false,
    }
  },

  computed: {
    getRequestQueryFilters () {
      return {
        locum_job_part_status: this.$route.query.status || 'Allocated',
        shift_id_includes: this.job_shift_id,
        rate_range_includes: this.job_rate,
        rate_type_id_includes: this.job_rate_type_id,
        near_postcode: this.near_post_code,
        near_postcode_travel_miles: this.miles,
        calendar_date_start: this.calendar_date_start,
        calendar_date_end: this.calendar_date_end,
        time_start: this.time_start,
        time_end: this.time_end,
        locum_invoice_status: this.invoice_status,
        title_includes: this.job_title_includes,
        job_part_number_includes: this.job_part_number_includes,
        type: this.$route.query.status === "Private"
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
      let columns = []

      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "allocated"

      columns.push(
        {
          name: "Job Part No.",
          dataIndex: "job_part_number",
          sortable: true,
          width: 150,
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
          sortable: true,
          class: "text-center",
          width: 130,
        },
        {
          name: "To",
          dataIndex: "datetime_end_in_gb_formatted",
          sortable: true,
          class: "text-center",
          width: 130,
        }
      )

      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "declined_at_in_gb_formatted",
          sortable: true,
          class: "text-center",
          width: 150,
        })
      }

      if (queryStatus === "cancelled") {
        columns.push(
          {
            name: "Cancelled At",
            dataIndex: "cancelled_at_in_gb_formatted",
            sortable: true,
            class: "text-center",
            width: 150,
          },
          {
            name: "Tag",
            dataIndex: "tag_status",
            sortable: true,
            class: "text-center",
            width: 100,
          }
        )
      }

      if (["completed",].includes(queryStatus)) {
        columns.push(
          {
            name: "Completed At",
            dataIndex: "completed_at_in_gb_formatted",
            sortable: true,
            class: "text-center",
            width: 150,
          },
          {
            name: "Invoice status",
            dataIndex: "locum_invoice_status",
            sortable: true,
            class: "text-center",
            width: 125,
          }
        )
      }

      if (["approved",].includes(queryStatus)) {
        columns.push(
          {
            name: "Approved At",
            dataIndex: "approved_at_in_gb_formatted",
            sortable: true,
            class: "text-center",
            width: 150,
          },
        )
      }

      return columns
    },
  },

  watch: {
    async "$route.query" (newValue, oldValue) {
      let newStatus = newValue.status
      let oldStatus = oldValue.status
      if (newStatus !== oldStatus) {
        this.current_page = 1
        this.filterModal = false
        this.showRefresh = false
        this.total = 0
        this.jobs = []
        this.clearFilters()
        this.isFiltered = false
        this.initialLoading = true
        await this.getLocumJobParts()
        this.initialLoading = false
      }
    },
  },

  mounted () {
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

    this.current_page = 1
    this.filterModal = false
    this.showRefresh = false
    this.total = 0
    this.jobs = []
    this.clearFilters()
    this.isFiltered = false
    this.initialLoading = true
    this.getLocumJobParts().finally(() => {
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

    this.showRefresh = false
  },

  methods: {
    onTabChange (tab) {
      if (tab && this.filterTab !== tab) {
        this.clearFilters()
        this.filterTab = tab
      }else if (!tab && !this.filterTab) {
        this.filterTab = tab
      }
    },
    
    routerLink (jobOrJobPart) {
      return {
        name: "locum-job-parts-index-jobPartId",
        params: {
          jobPartId: jobOrJobPart.id,
        },
        query: {
          ...this.$route.query,
        },
      }
    },

    async filterJobList () {
      this.loading = true
      await this.getJobs()
      this.loading = false
    },

    getLocumJobParts () {
      return Promise.all([
        this.$axios.get('/api/v2/locum/locum-user-job-parts/count', {
          params: {
            ...this.getRequestQueryFilters,
          },
        }),

        this.$axios.get('/api/v2/locum/locum-user-job-parts', {
          params: {
            offset: 0,
            limit: 20,
            order_by: [],
            ...this.getRequestQueryFilters,
          },
        }),
      ]).then(([responseCount, responseJobs,]) => {
        this.total = responseCount.data.data.count
        this.jobs = responseJobs.data.data.job_parts
      }).catch(err => {
        console.log("err", err.response || err)
        throw err
      })
    },

    getJobs () {
      return this.$axios.get('/api/v2/locum/locum-user-job-parts', {
        params: {
          offset: this.offset,
          limit: this.limit,
          order_by: this.order_by,
          ...this.getRequestQueryFilters,
        },
      }).then(res => {
        this.jobs = res.data.data.job_parts
      }).catch(err => {
        console.log("err", err.response || err)
        throw err
      })
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

    async refreshJobs () {
      this.current_page = 1
      this.offset = 0
      this.limit = 20
      this.initialLoading = true
      await this.getLocumJobParts()
      this.initialLoading = false
      this.showRefresh = false
    },

    async filterJob () {
      this.current_page = 1
      this.offset = 0
      this.limit = 20
      this.initialLoading = true
      this.isFiltered = true
      await this.getLocumJobParts()
      this.initialLoading = false
      this.filterModal = false
    },

    async sorted (order_by) {
      this.current_page = 1
      this.offset = 0
      this.order_by = order_by
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
      this.job_shift_id = ""
      this.job_rate = ""
      this.job_rate_type_id = ""
      this.near_post_code = ""
      this.miles = ""
      this.calendar_date_start = ""
      this.calendar_date_end = ""
      this.time_start = ""
      this.time_end = ""
      this.invoice_status = ""
      this.job_title_includes = ""
      this.job_part_number_includes = ""
    },

  },

}
</script>
