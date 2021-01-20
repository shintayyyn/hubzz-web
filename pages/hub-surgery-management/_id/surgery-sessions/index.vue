<template>
  <section class="relative">
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppTable
          v-if="jobs && jobs.length > 0"
          :total="total"
          :items="jobs"
          :currentPage="current_page"
          :perPage="limit"
          :columns="columns"
          :orderBy="order_by"
          :loading="loading"
          :routerLink="routerLink"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <template v-slot:actions="slotProps">
            <div class="flex flex-wrap justify-center">
              <div
                class="my-1 p-2 bg-yellow-400 font-bold rounded-lg focus:outline-none"
                @click="
                  $router.push({
                    path: `/hub-surgery-management/${$route.params.id}/surgery-sessions/${slotProps.item.id}`,
                    query: {...$route.query}
                  })
                "
              >
                View
              </div>
            </div>
          </template>
        </AppTable>

        <div
          v-if="(jobs && !jobs.length) && !loading && !isFiltered"
          class="flex justify-center py-4"
        >
          {{ noJobsToDisplay }}
        </div>

        <div
          v-if="(jobs && !jobs.length) && !loading && isFiltered"
          class="flex justify-center py-4"
        >
          No Jobs Found
        </div>
        
        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="
              $route.name === 'hub-surgery-management-id-surgery-sessions-index-sessionId'
                || $route.name === 'hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId'
            "
            class="shield"
            :to="{ path: `/hub-surgery-management/${$route.params.id}/surgery-sessions`, query: {...$route.query}}"
          />
        </transition>

        <div>
          <nuxt-child />
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
import AppLoading from "@/components/Base/AppLoading"

export default {
  components: {
    AppTable,
    AppLoading,
  },

  middleware ({ query, error, }) {
    if (
      query.jobStatus
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
      ].includes(query.jobStatus.toLowerCase())
    ) {
      return error({ status: 404, message: "This Session Status is Invalid", })
    }
  },

  data () {
    return {
      total: 0,
      jobs: [],
      initialLoading: false,
      loading: false,
      current_page: 1,
      // app table params
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
      showRefresh: false,
    }
  },

  computed: {
    isJobPart () {
      return !this.$route.query.jobStatus
        || [
          'allocated',
          'ongoing',
          'completed',
          'approved',
          'cancelled',
          'withdrawn',
        ].includes(this.$route.query.jobStatus.toLowerCase())
    },

    noJobsToDisplay () {
      let queryStatus = this.$route.query.jobStatus
        ? this.$route.query.jobStatus.toLowerCase()
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
      let queryStatus = this.$route.query.jobStatus
        ? this.$route.query.jobStatus.toLowerCase()
        : "allocated"

      if (this.isJobPart) {
        columns.push(
          {
            name: "Job Part Number",
            dataIndex: "job_part_number",
            sortable: true,
            width: 150
          },
          {
            name: "Practice",
            dataIndex: "practice_name",
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
            dataIndex: "job_part_shift_names_formatted",
            class: "text-center",
            sortable: true,
            width: 150
          },
          {
            name: "Rates",
            dataIndex: "job_part_rate_ranged_formatted",
            sortable: true,
            class: "text-center",
            width: 120
          },
          {
            name: "Rate Types",
            dataIndex: "job_part_rate_type_names_formatted",
            class: "text-center",
            sortable: true,
            width: 150
          },
        )
      } else {
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
            dataIndex: "job_shift_names_formatted",
            class: "text-center",
            sortable: true,
            width: 150
          },
          {
            name: "Rates",
            dataIndex: "job_rate_ranged_formatted",
            sortable: true,
            class: "text-center",
            width: 120
          },
          {
            name: "Rate Types",
            dataIndex: "job_rate_type_names_formatted",
            class: "text-center",
            sortable: true,
            width: 150
          },
        )
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
      )

      if (queryStatus === "allocated") {
        columns.push({
          name: "Assigned",
          dataIndex:
            "platform_job.appointed_to_locum.user.personal_detail.name",
          class: "text-center",
        })
      }

      if (queryStatus === "withdrawn") {
        columns.push({
          name: "Withdrawn At",
          dataIndex: "declined_at_in_gb_formatted",
          class: "text-center",
          width: 150
        })
      }

      if (queryStatus === "cancelled") {
        columns.push({
          name: "Cancelled At",
          dataIndex: "cancelled_at_in_gb_formatted",
          class: "text-center",
          width: 150
        })
      }

      if (["completed",].includes(queryStatus)) {
        columns.push({
          name: "Completed At",
          dataIndex: "completed_at_in_gb_formatted",
          class: "text-center",
          width: 150
        })
      }

      if (["approved",].includes(queryStatus)) {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          width: 150
        })
      }

      if (["completed",].includes(queryStatus)) {
        columns.push(
          {
            name: "Invoice status",
            dataIndex: "invoice_status",
            class: "text-center",
          },
        )
      }

      if (["completed", "approved",].includes(queryStatus)) {
        columns.push(
          {
            name: "Tag",
            dataIndex: "status",
            class: "text-center",
            width: 100
          }
        )
      }

      return columns
    },

    params () {
      const status = this.$route.query.jobStatus || 'Allocated'

      const practiceSurgeryId = this.$route.params.id

      return this.isJobPart
        ? {
          practice_surgery_id: practiceSurgeryId,
          status,
          job_part_number: this.job_part_number,
          job_title: this.job_title,
          job_type: this.job_type,
          job_shift_id: this.job_shift_id,
          job_rate: this.job_rate,
          job_rate_type_id: this.job_rate_type_id,
          near_post_code: this.near_post_code,
          miles: this.miles,
          calendar_date_start: this.calendar_date_start,
          calendar_date_end: this.calendar_date_end,
          time_start: this.time_start,
          time_end: this.time_end,
          invoice_status: this.invoice_status,
          job_title_includes: this.job_title_includes,
          job_number_includes: this.job_number_includes,
          job_part_number_includes: this.job_part_number_includes,
        }
        : {
          practice_surgery_id: practiceSurgeryId,
          status,
          job_number: this.job_number,
          title: this.title,
          type: this.type,
          shift_id: this.shift_id,
          rate: this.rate,
          rate_type_id: this.rate_type_id,
          near_post_code: this.near_post_code,
          miles: this.miles,
          calendar_date_start: this.calendar_date_start,
          calendar_date_end: this.calendar_date_end,
          time_start: this.time_start,
          time_end: this.time_end,
          invoice_status: this.invoice_status,
          title_includes: this.title_includes,
          job_number_includes: this.job_number_includes,
        }
    },
  },

  watch: {
    async "$route.query" (newValue, oldValue) {
      let newStatus = newValue.jobStatus
      let oldStatus = oldValue.jobStatus
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
        this.isFiltered = false
        this.initialLoading = true
        await this.getJobsPromiseAll()
        this.initialLoading = false
      }
    },
  },

  mounted () {
    this.current_page = 1
    this.filterModal = false
    this.showRefresh = false
    this.total = 0
    this.jobs = []
    this.isFiltered = false
    this.initialLoading = true
    this.getJobsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {
    routerLink (jobOrJobPart) {
      if (this.isJobPart) {
        return {
          name:
            "hub-surgery-management-id-surgery-sessions-index-sessionId-job-parts-jobPartId",
          params: {
            ...this.$route.params,
            sessionId: jobOrJobPart.job_id,
            jobPartId: jobOrJobPart.id,
          },
          query: {
            ...this.$route.query,
          },
        }
      }

      return {
        name: "hub-surgery-management-id-surgery-sessions-index-sessionId",
        params: {
          ...this.$route.params,
          sessionId: jobOrJobPart.id,
        },
        query: {
          ...this.$route.query,
        },
      }
    },

    getJobsPromiseAll () {
      return Promise.all([
        this.$axios.get(`/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}/count`, {
          params: {
            ...this.params,
          },
        }).then(response => response.data.data.count),

        this.$axios.get(`/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`, {
          params: {
            ...this.params,
            order_by: [],
            offset: 0,
            limit: 15,
          },
        }).then(response => this.isJobPart ? response.data.data.job_parts : response.data.data.jobs),
      ]).then(([jobOrJobPartCount, jobOrJobParts,]) => {
        this.jobs = jobOrJobParts
        this.total = jobOrJobPartCount
      }).catch(err => {
        console.log("err", err.response || err)
        throw err
      })
    },

    getJobs () {
      return this.$axios.get(`/api/v1/practice/${this.isJobPart ? "job-parts" : "jobs"}`, {
        params: {
          ...this.params,
          order_by: this.order_by,
          offset: this.offset,
          limit: this.limit,
        },
      }).then((response) => {
        this.jobs = this.isJobPart
          ? response.data.data.job_parts
          : response.data.data.jobs
      }).catch(err => {
        console.log("err", err.response || err)
        throw err
      })
    },
    
    async refreshJobs () {
      this.current_page = 1
      this.offset = 0
      this.limit = 15
      this.initialLoading = true
      await this.getJobsPromiseAll()
      this.initialLoading = false
      this.showRefresh = false
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
        default:
          sorting
        }
        return `${sorting}:${order}`
      })
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
  },
}
</script>
