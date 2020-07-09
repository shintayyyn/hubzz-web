<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
    </transition>

    <div>
      <div class="flex">
        <AppButton
          class="mr-2"
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
      </div>

      <div
        class="flex flex-col justify-start z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
        :class="filterModal ? 'flex' : 'hidden'"
      >
        <div class="flex flex-col md:flex-row g-full items-end">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_part_number_includes"
              class="px-1"
              :type="'text'"
              :name="'job_part_number'"
              :label="'Job part number'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_title_includes"
              class="px-1"
              :type="'text'"
              :name="'job_title'"
              :label="'Job Title'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_rate"
              class="px-1"
              :type="'text'"
              :name="'job_rate'"
              :label="'Rate £'"
              :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
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
        </div>

        <div class="flex flex-col md:flex-row g-full items-end">
          <div class="md:px-1 h-full w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="profession_id"
              :type="'select'"
              :name="'profession_id'"
              :label="'Roles'"
              :placeholder="'Select...'"
              :items="professions"
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
            <AppDate
              v-model="calendar_date_start"
              :name="'calendar_date_start'"
              :label="'From'"
              :format="'YYYY-MM-DD'"
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
        </div>

        <div
          v-if="$route.query.status && $route.query.status === 'Ongoing'"
          class="md:px-1 w-full lg:w-1/4 md:w-1/3"
        >
          <AppInput
            v-model="ended"
            class="px-1"
            :type="'select'"
            :name="'ended'"
            :label="'Status'"
            :items="[{label: 'All', value: null}, {label: 'For Completion', value: true}, {label: 'Ongoing', value: false}]"
          />
        </div>

        <div
          v-if="$route.query.status && $route.query.status !== 'Ongoing'"
          class="md:px-1 w-full lg:w-1/4 md:w-1/3"
        >
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
        v-if="jobs.length > 0 && !initialLoading"
        :total="total"
        :items="jobs"
        :current-page="current_page"
        :per-page="limit"
        :columns="columns"
        :order-by="order_by"
        :loading="loading"
        :routerLink="routerLink"
        :min-height="'55vh'"
        :customWidth="1400"
        @pagechanged="pagechanged"
        @limitchanged="limitchanged"
        @sorted="sorted"
      >
        <template v-slot:shifts="slotProps">
          {{ slotProps.item.shifts.map(item => item.name).join(', ') }}
        </template>

        <template v-slot:rate_type="slotProps">
          {{ slotProps.item.locum_detail_rate_types.map(item => item.name).join(', ') }}
        </template>

        <template v-slot:rates="slotProps">
          {{ slotProps.item.min_rate === slotProps.item.max_rate ? `£${slotProps.item.max_rate}` : `£${slotProps.item.min_rate} - £${ slotProps.item.max_rate}` }}
        </template>

        <template v-slot:ended="slotProps">
          <div class="flex items-center justify-center">
            <div class="rounded-full px-6 py-1">
              {{ slotProps.item.ended ? "For Completion" : "Ongoing" }}
            </div>
          </div>
        </template>
      </AppTable>

      <div v-if="!jobs.length && !initialLoading && !loading && !isFiltered" class="flex justify-center py-4">
        {{ noJobsToDisplay }}
      </div>

      <div v-if="!jobs.length && !initialLoading && !loading && isFiltered" class="flex justify-center py-4">
        No Jobs Found
      </div>

      <transition name="fade" mode="out-in">
        <nuxt-link
          v-if="showShield"
          class="shield"
          :to="{ name: 'job-parts-index', query: $route.query }"
        />
      </transition>

      <div>
        <nuxt-child @cancelled="filterJobList" @appointed="filterJobList" />
      </div>
    </div>
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"

export default {
  components: {
    AppTable,
    AppInput,
    AppDate,
    AppButton,
    AppLoading,
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
      showShield: false,
      total: 0,
      jobs: [],
      initialLoading: false,
      loading: false,
      current_page: 1,
      // app table params
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
      shift_id: "",
      profession_id: "",
      favorite_only: "",
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
      professions: [],
      ended: null,
      filterModal: false,
      isFiltered: false,
      showRefresh: false,
    }
  },

  computed: {
    isJobPart () {
      return true
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
        return `There were no Locums who applied on your jobs yet`
      case "completed":
      case "cancelled":
        return `You have not yet ${queryStatus} any job`
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
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
        },
        {
          name: "Practice",
          dataIndex: "practice_name",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Profession",
          dataIndex: "profession_name",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Title",
          dataIndex: "job_title",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Shifts",
          dataIndex: "job.shift.name",
          slotName: "shifts",
          class: "text-center",
          sortable: true,
        },
        {
          name: "Rates",
          dataIndex: "job.rate",
          slotName: "rates",
          sortable: true,
          class: "text-center currency",
        },
        {
          name: "Rate Type",
          dataIndex: "job.locum_detail_rate_type.name",
          class: "text-center",
          slotName: "rate_type",
          sortable: true,
        }
      )

      columns.push(
        {
          name: "From",
          dataIndex: "date_time_start",
          sortable: true,
          class: "text-center",
        },
        {
          name: "To",
          dataIndex: "date_time_end",
          sortable: true,
          class: "text-center",
        }
      )

      if (queryStatus === "allocated") {
        columns.push({
          name: "Assigned",
          dataIndex: "assigned_to",
          class: "text-center",
        })
      }

      if (queryStatus === "ongoing") {
        columns.push({
          name: "Status",
          dataIndex: "ended",
          slotName: "ended",
          class: "text-center",
          sortable: true,
        })
      }

      if (queryStatus === "live") {
        columns.push({
          name: "Favorite only",
          dataIndex: "favorite_only",
          class: "text-center",
          sortable: true,
        })
      }

      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "job.platform_job.declined_at",
          class: "text-center localDate",
        })
      }

      if (queryStatus === "cancelled") {
        columns.push(
          {
            name: "Cancelled At",
            dataIndex: "job.platform_job.cancelled_at",
            class: "text-center localDate",
          },
          {
            name: "Tag",
            dataIndex: "tag_status",
            class: "text-center",
          }
        )
      }

      if (["completed",].includes(queryStatus)) {
        columns.push(
          {
            name: "Completed At",
            dataIndex: "completed_at",
            class: "text-center localDate",
          },
          {
            name: "Invoice status",
            dataIndex: "invoice_status",
            class: "text-center",
          }
        )
      }

      if (["approved",].includes(queryStatus)) {
        columns.push(
          {
            name: "Approved At",
            dataIndex: "approved_at",
            class: "text-center localDate",
            sortable: true,
          },
          {
            name: "Invoice status",
            dataIndex: "invoice_status",
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
        await this.getJobsPromiseAll()
        this.initialLoading = false
      }
    },

    $route () {
      this.showShield = this.$route.name === 'job-parts-index-jobPartId'
    },
  },
  
  mounted () {
    this.showShield = this.$route.name === 'job-parts-index-jobPartId'

    this.$socket.on('Practice Notification Job Available', this.getAvailableJobsRealTime)
    this.$socket.on('Practice Notification Job Application', this.getAppliedJobsRealTime)
    this.$socket.on('Practice Notification Job Application Cancelled', this.getAppliedCancelledJobsRealTime)
    this.$socket.on('Practice Notification Job Allocated', this.getCurrentJobsRealTime)
    this.$socket.on('Practice Notification Job Ongoing', this.getOngoingJobsRealTime)
    this.$socket.on('Practice Notification Job Part Completed', this.getCompletedJobsRealTime)
    this.$socket.on('Practice Notification Job Completed', this.getCompletedJobsRealTime)
    this.$socket.on('Practice Notification Locum Invoice Updated', this.getApprovedJobsRealTime)
    this.$socket.on('Practice Notification Job Cancelled', this.getCancelledJobsRealTime)
    this.$socket.on('Practice Notification Job Amended', this.getAmendedJobsRealTime)
    this.$socket.on('Practice Notification Job Declined', this.getDeclinedJobsRealTime)
    this.$socket.on('Practice Notification Job Auto Declined', this.getAutoDeclinedJobsRealTime)
    this.$socket.on('Practice Notification Job Update Accept', this.getUpdateAcceptJobsRealTime)
    this.$socket.on('Practice Notification Job Unfilled', this.getUnfilledJobsRealTime)

    this.current_page = 1
    this.filterModal = false
    this.showRefresh = false
    this.total = 0
    this.jobs = []
    this.clearFilters()
    this.isFiltered = false
    this.initialLoading = true
    this.getJobsPromiseAll().finally(() => {
      this.initialLoading = false
    })

    Promise.all([
      this.$axios.get('/api/v1/professions?limit=999')
        .then(response => response.data.data.professions.map(profession => ({
          label: profession.name,
          value: profession.id,
        }))),
        
      this.$axios.get('/api/v1/shifts?limit=999')
        .then(response => response.data.data.shifts.map(shift => ({
          label: shift.name,
          value: shift.id,
        }))),
        
      this.$axios.get('/api/v1/locum-detail-rate-types?limit=999')
        .then(response => response.data.data.locum_detail_rate_types.map(locumDetailRateType => ({
          label: locumDetailRateType.name,
          value: locumDetailRateType.id,
        }))),
    ]).then((responses) => {
      const [professions, shifts, rates,] = responses

      this.professions = professions
      this.shifts = shifts
      this.rates = rates
    })
  },

  destroyed () {
    this.$socket.removeListener('Practice Notification Job Available', this.getAvailableJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Application', this.getAppliedJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Application Cancelled', this.getAppliedCancelledJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Allocated', this.getCurrentJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Ongoing', this.getOngoingJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Part Completed', this.getCompletedJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Completed', this.getCompletedJobsRealTime)
    this.$socket.removeListener('Practice Notification Locum Invoice Updated', this.getApprovedJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Cancelled', this.getCancelledJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Amended', this.getAmendedJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Declined', this.getDeclinedJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Auto Declined', this.getAutoDeclinedJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Update Accept', this.getUpdateAcceptJobsRealTime)
    this.$socket.removeListener('Practice Notification Job Unfilled', this.getUnfilledJobsRealTime)

    this.showRefresh = false
  },

  methods: {
    routerLink (jobOrJobPart) {
      return {
        name: "job-parts-index-jobPartId",
        params: {
          jobPartId: jobOrJobPart.id,
        },
        query: {
          ...this.$route.query,
        },
      }
    },

    filterJobList (id) {
      this.jobs = this.jobs.filter(item => item.id !== id)
    },

    getJobsPromiseAll () {
      let status = []
      let queryStatus = this.$route.query.status
      // let bankStatus = this.$route.query.bank;

      if (!queryStatus) {
        status = ["Allocated",]
      } else if (queryStatus) {
        switch (queryStatus) {
        case "Completed":
          status = ["Completed", "Terminated",]
          break
        default:
          status = [`${queryStatus}`,]
          break
        }
      }

      return Promise.all([
        this.$axios.$get('/api/v1/practice/job-parts/count', {
          params: {
            status,
            order_by: [],
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
            near_post_code: this.near_post_code,
            miles: this.miles,
            calendar_date_start: this.calendar_date_start,
            calendar_date_end: this.calendar_date_end,
            time_start: this.time_start,
            time_end: this.time_end,
            invoice_status: this.invoice_status,
            viewing_locum_user_id: this.viewing_locum_user_id,
            title_includes: !this.isJobPart ? this.title_includes : "",
            job_title_includes: this.isJobPart ? this.job_title_includes : "",
            job_number_includes: !this.isJobPart
              ? this.job_number_includes
              : "",
            job_part_number_includes: this.isJobPart
              ? this.job_part_number_includes
              : "",
            // has_favorite_applicants:
            //   queryStatus === "Applied" && bankStatus === "true"
            //     ? true
            //     : queryStatus === "Applied" &&
            //       (bankStatus === "false" || !bankStatus)
            //     ? false
            //     : null,
            profession_id: this.profession_id,
            favorite_only: this.favorite_only,
            ended: this.ended,
          },
        }),
        this.$axios.$get('/api/v1/practice/job-parts', {
          params: {
            offset: 0,
            limit: 5,
            status,
            order_by: [],
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
            near_post_code: this.near_post_code,
            miles: this.miles,
            calendar_date_start: this.calendar_date_start,
            calendar_date_end: this.calendar_date_end,
            time_start: this.time_start,
            time_end: this.time_end,
            invoice_status: this.isJobPart ? this.invoice_status : "",
            viewing_locum_user_id: this.viewing_locum_user_id,
            title_includes: !this.isJobPart ? this.title_includes : "",
            job_title_includes: this.isJobPart ? this.job_title_includes : "",
            job_number_includes: !this.isJobPart
              ? this.job_number_includes
              : "",
            job_part_number_includes: this.isJobPart
              ? this.job_part_number_includes
              : "",
            // has_favorite_applicants:
            //   queryStatus === "Applied" && bankStatus === "true"
            //     ? true
            //     : queryStatus === "Applied" &&
            //       (bankStatus === "false" || !bankStatus)
            //     ? false
            //     : null,
            profession_id: this.profession_id,
            favorite_only: this.favorite_only,
            ended: this.ended,
          },
        }),
      ]).then(([responseCount, responseJobs,]) => {
        this.jobs = responseJobs.data.job_parts.map(item => {
          return {
            ...item,
            profession_name: item.profession.name,
            // isGp: item.profession.name === "GP" ? "GP" : "Non-GP",
            assigned_to: item.job.platform_job.appointed_to_locum && item.job.platform_job.appointed_to_locum.user
              ? item.job.platform_job.appointed_to_locum.user.personal_detail.name
              : null,
            tag_status: item.terminated ? "Terminated" : item.status,
            date_time_start: `${this.$moment(item.date_start).format(
              "DD-MM-YYYY"
            )} | ${item.time_start}`,
            date_time_end: `${this.$moment(item.date_end).format(
              "DD-MM-YYYY"
            )} | ${item.time_end}`,
          }
        })
        
        this.total = responseCount.data.count
      }).catch(err => {
        console.log("err", err.response || err)
        throw err
      }).finally(() => {
        return
      })
    },

    getJobs () {
      let status = []
      let queryStatus = this.$route.query.status
      // let bankStatus = this.$route.query.bank;

      if (!queryStatus) {
        status = ["Allocated",]
      } else if (queryStatus) {
        switch (queryStatus) {
        case "Completed":
          status = ["Completed", "Terminated",]
          break
        default:
          status = [`${queryStatus}`,]
          break
        }
      }

      return this.$axios
        .$get(`/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`, {
          params: {
            offset: this.offset,
            limit: this.limit,
            status,
            order_by: this.order_by,
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
            calendar_date_start: this.isJobPart ? this.calendar_date_start : "",
            calendar_date_end: this.isJobPart ? this.calendar_date_end : "",
            time_start: this.isJobPart ? this.time_start : "",
            time_end: this.isJobPart ? this.time_end : "",
            invoice_status: this.isJobPart ? this.invoice_status : "",
            viewing_locum_user_id: this.viewing_locum_user_id,
            title_includes: !this.isJobPart ? this.title_includes : "",
            job_title_includes: this.isJobPart ? this.job_title_includes : "",
            job_number_includes: !this.isJobPart
              ? this.job_number_includes
              : "",
            job_part_number_includes: this.isJobPart
              ? this.job_part_number_includes
              : "",
            ended: this.ended,
            // has_favorite_applicants:
            //   queryStatus === "Applied" && bankStatus === "true"
            //     ? true
            //     : queryStatus === "Applied" &&
            //       (bankStatus === "false" || !bankStatus)
            //     ? false
            //     : null
          },
        })
        .then(res => {
          this.jobs
            = res.data && res.data.jobs
              ? res.data.jobs.map(item => {
                return {
                  ...item,
                  isGp:
                      item.platform_job.profession.name === "GP"
                        ? "GP"
                        : "Non-GP",
                  profession_name: item.platform_job.profession.name,
                  assigned_to: item.platform_job.appointed_to_locum.user
                    ? item.platform_job.appointed_to_locum.user
                      .personal_detail.name
                    : null,
                  date_time_start: `${this.$moment(item.date_start).format(
                    "DD-MM-YYYY"
                  )} | ${item.time_start}`,
                  date_time_end: `${this.$moment(item.date_end).format(
                    "DD-MM-YYYY"
                  )} | ${item.time_end}`,
                }
              })
              : res.data.job_parts
                ? res.data.job_parts.map(item => {
                  return {
                    ...item,
                    profession_name: item.profession.name,
                    isGp: item.profession.name === "GP" ? "GP" : "Non-GP",
                    tag_status: item.terminated ? "Terminated" : item.status,
                    date_time_start: `${this.$moment(item.date_start).format(
                      "DD-MM-YYYY"
                    )} | ${item.time_start}`,
                    date_time_end: `${this.$moment(item.date_end).format(
                      "DD-MM-YYYY"
                    )} | ${item.time_end}`,
                  }
                })
                : []
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
      this.limit = 5
      this.initialLoading = true
      await this.getJobsPromiseAll()
      this.initialLoading = false
      this.showRefresh = false
    },

    async filterJob () {
      this.current_page = 1
      this.offset = 0
      this.limit = 5
      this.initialLoading = true
      this.isFiltered = true
      await this.getJobsPromiseAll()
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
      this.limit = 5
      this.order_by = []
      this.job_number = ""
      this.job_part_number = ""
      this.title = ""
      this.job_title = ""
      this.type = ""
      this.job_type = ""
      this.practice_id = ""
      this.job_practice_id = ""
      this.shift_id = ""
      this.job_shift_id = ""
      this.rate = ""
      this.job_rate = ""
      this.rate_type_id = ""
      this.job_rate_type_id = ""
      this.near_post_code = ""
      this.miles = ""
      this.calendar_date_start = ""
      this.calendar_date_end = ""
      this.time_start = ""
      this.time_end = ""
      this.invoice_status = ""
      this.viewing_locum_user_id = []
      this.title_includes = ""
      this.job_title_includes = ""
      this.job_number_includes = ""
      this.job_part_number_includes = ""
      this.profession_id = ""
      this.favorite_only = ""
      this.ended = null
    },
  },
}
</script>
