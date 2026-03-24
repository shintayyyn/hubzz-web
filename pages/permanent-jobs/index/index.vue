<template>
  <section class="flex flex-col items-start w-full">
    <div class="w-full lg:w-1/2 mt-2">
      <AppInputSmall
        v-if="$auth.user.domain === 'Locum'"
        v-model="search"
        :type="'text'"
        :name="'search'"
        :button="true"
        :buttonLabel="'Search'"
        :placeholder="'Title / Practice Name / Profession'"
        :disabled="loading"
        @click="searchSubmit(search)"
      />
    </div>

    <!-- Filters -->
    <div
      v-if="$auth.user.domain === 'Practice'"
      class="w-full"
    >
      <AppFilter :enableSearch="false" :enableFilter="$auth.user.domain === 'Practice'">
        <template v-if="$auth.user.domain === 'Practice'" v-slot:extraButtonFirst>
          <AppInputSmall
            v-model="search"
            :type="'text'"
            :name="'search'"
            :button="true"
            :buttonLabel="'Search'"
            :placeholder="'Title / Practice Name'"
            :disabled="loading"
            :inStyle="'margin:0'"
            @click="getJobs(params)"
          />
        </template>
        <template v-if="$auth.user.domain === 'Practice'" v-slot:filter>
          <div class="w-full md:w-32">
            <AppInput
              v-model="params.job_type"
              :type="'select'"
              :name="'job_type'"
              :label="'Job Type'"
              :placeholder="'Select...'"
              :items="job_types"
              :wrapperClass="'px-1'"
              nolabel
              border
            />
          </div>

          <div class="w-full md:w-1/6">
            <AppInput
              v-model="params.profession_id"
              :type="'select'"
              :name="'profession'"
              :label="'Profession'"
              :placeholder="'Select...'"
              :items="professions"
              :wrapperClass="'px-1'"
              nolabel
              border
            />
          </div>
          <div v-if="$route.query.status !== 'Pending'" class="w-full md:w-1/6">
            <AppInput
              v-model="params.job_posting_status"
              :type="'select'"
              :name="'Permanent Job Status'"
              :label="'Permanent Job Status'"
              :placeholder="'Select...'"
              :items="permanent_job_status"
              :wrapperClass="'px-1'"
              nolabel
              border
            />
          </div>

          <div class="w-full md:w-auto">
            <AppDate v-model="params.date_posted_start" label="Date Start" format="YYYY-MM-DD" :wrapperClass="'px-1'" nolabel border />
          </div>

          <div class="w-full md:w-auto">
            <AppDate v-model="params.date_posted_end" label="Date End" format="YYYY-MM-DD" :wrapperClass="'px-1'" nolabel border />
          </div>

          <AppButton
            label="Apply"
            customTheme="border hover:bg-gray-200"
            class="mx-2"
            @click="getJobs(params)"
          />
          <AppButton
            label="Clear"
            @click="filterReset"
          />
        </template>
        <template v-if="$auth.user.domain === 'Practice'" v-slot:extraFarRight>
          <button
            class="px-3 py-1 text-sm font-bold cursor-pointer justify-end my-2"
            :class="'border rounded-lg border-sunglow bg-sunglow'"
            @click="$router.push('/permanent-jobs/create')"
          >
            + Create Salaried Role 
          </button>
        </template>
      </AppFilter>
    </div>
    <!-- Filters end here -->

    <transition name="fade" mode="out-in">
      <div v-if="loading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="loading" spinner />
      </div>

      <template v-if="$auth.user.domain === 'Practice' && !loading">
        <AppTable
          v-if="permanent_jobs_for_practice_count > 0"
          class="w-full"
          :total="permanent_jobs_for_practice_count"
          :items="permanent_jobs_for_practice"
          :current-page="current_page"
          :per-page="params.limit"
          :columns="practiceColumns"
          :loading="loading"
          :router-link="'/permanent-jobs'"
          :customWidth="800"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
        >
          <template v-slot:salary_slot="slotProps">
            <template
              v-if="slotProps.item.salary_amount !== 0"
            >
              {{ slotProps.item.salary_amount | currency }}
            </template>
            <template v-else>
              N/A
            </template>
          </template>

          <template
            v-slot:date_posted="slotProps"
          >
            {{ $moment(slotProps.item.date_posted).format("DD/MM/YYYY") }}
          </template>

          <template
            v-slot:date_closing="slotProps"
          >
            {{ $moment(slotProps.item.date_closing).format("DD/MM/YYYY") }}
          </template>

          <template v-slot:status_slot="slotProps">
            <div v-if="slotProps.item.status" class="flex items-center justify-center">
              {{ slotProps.item.status }}
            </div>
          </template>

          <template v-if="$route.query.status === 'Closed'" v-slot:closing_tag="slotProps">
            <div class="flex items-center justify-center">
              {{ jobClosingTag(slotProps.item) }}
            </div>
          </template>
        </AppTable>
        <p
          v-else
          class="text-gray-600 px-3 py-2"
        >
          No {{ $route.query.status ? $route.query.status : 'Available' }} Jobs Found.
        </p>
      </template>

      <template v-if="$auth.user.domain === 'Locum' && !loading">
        <AppTable
          v-if="permanent_jobs_for_locum_count > 0"
          class="w-full"
          :total="permanent_jobs_for_locum_count"
          :items="permanent_jobs_for_locum"
          :current-page="current_page"
          :per-page="params.limit"
          :columns="locumColumns"
          :loading="loading"
          :router-link="'/permanent-jobs'"
          :customWidth="900"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
        >
          <template v-slot:salary_slot="slotProps">
            <template
              v-if="slotProps.item.salary_amount !== 0"
            >
              {{ slotProps.item.salary_amount | currency }}
            </template>
            <template v-else>
              N/A
            </template>
          </template>

          <template v-slot:status_slot="slotProps">
            <div class="flex items-center justify-center">
              {{ slotProps.item.status === 'Closed' && slotProps.item.job_posting_status === 'Available' ? 'Rejected' : slotProps.item.status }}
            </div>
          </template>

          <template
            v-slot:date_posted="slotProps"
          >
            {{ $moment(slotProps.item.date_posted).format("DD/MM/YYYY") }}
          </template>

          <template
            v-slot:date_closing="slotProps"
          >
            {{ $moment(slotProps.item.date_closing).format("DD/MM/YYYY") }}
          </template>

          <template v-if="$route.query.status === 'Closed'" v-slot:closing_tag="slotProps">
            <div class="flex items-center justify-center">
              {{ jobClosingTag(slotProps.item) }} 
            </div>
          </template>
        </AppTable>
        <p
          v-else
          class="text-gray-600 px-3 py-2"
        >
          No {{ $route.query.status ? $route.query.status : 'Available' }} Jobs Found.
        </p>
      </template>
    </transition>

    <div
      v-if="['permanent-jobs-index-id','permanent-jobs-index-create'].includes($route.name)"
      class="shield"
      @click="$router.go(-1)"
    />
    <nuxt-child />
  </section>
</template>

<script>
import debounce from "lodash.debounce"
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"
import AppFilter from "@/components/Base/AppFilter"
import AppInputSmall from "@/components/Base/AppInputSmall"
export default {
  components: {
    AppLoading,
    AppTable,
    AppInput,
    AppButton,
    AppDate,
    AppFilter,
    AppInputSmall,
  },

  middleware ({ query, error, }) {
    if (query.status && !["available", "closed", "unfilled", "pending",]
      .includes(query.status.toLowerCase())
    ) {
      return error({
        status: 404,
        message: "This Permanent Job Status is Invalid",
      })
    }
  },

  data () {
    return {
      search: "",
      filterModal: false,
      total: 0,
      current_page: 1,
      // app table params
      params: {
        job_id: null,
        limit: 15,
        offset: 0,
        search: "",

        // new
        title: "",
        surgery: "",
        job_type: "",
        profession: "",
        date_posted_start: "",
        date_posted_end: "",
        job_posting_status: "",
      },
      loading: false,
      defaultColumns: [
        {
          name: "ID",
          dataIndex: "id",
          width: 70,
        },
        {
          name: "Title",
          dataIndex: "title",
          class: "text-center",
          // width: 150,
        },
        {
          name: "Surgery",
          dataIndex: "practice_name",
          class: "text-center",
          // width: 100,
        },
        {
          name: "Salary £",
          slotName: "salary_slot",
          dataIndex: "",
          class: "text-center",
          width: 100,
        },
        {
          name: "Posted",
          dataIndex: "",
          slotName: "date_posted",
          class: "text-center",
          // width: 100,
        },
        {
          name: "Closes",
          dataIndex: "",
          slotName: "date_closing",
          class: "text-center",
          // width: 100,
        },
        {
          name: "Work Hours",
          dataIndex: "work_hours",
          class: "text-center",
          width: 100,
        },
        {
          name: "Profession",
          dataIndex: "profession_name",
          class: "text-center",
          width: 100,
        },
        {
          name: "Industry",
          dataIndex: "industry_type",
          class: "text-center",
          width: 80,
        },
      ],

      locumColumns: [],
      practiceColumns: [],

      permanent_jobs_for_practice: [],
      permanent_jobs_for_practice_count: 0,

      permanent_job_applications_count: 0,
      permanent_job_applications: [],

      permanent_jobs_for_locum_count: 0,
      permanent_jobs_for_locum: [],

      job_types: [
        {
          label: "Part Time",
          value: "Part Time",
        },
        {
          label: "Full Time",
          value: "Full Time",
        },
      ],
      permanent_job_status: [],
      professions: [],
      professions_categories: [],
    }
  },

  computed: {
    locum_permanent_job_count () {
      return this.$store.state.permanentjobs.locum_permanent_job_count
    },
    locum_permanent_jobs () {
      return this.$store.state.permanentjobs.locum_permanent_jobs
    },
    practice_permanent_job_count () {
      return this.$store.state.permanentjobs.practice_permanent_job_count
    },
    practice_permanent_jobs () {
      return this.$store.state.permanentjobs.practice_permanent_jobs
    },
    permanent_job_applications_state_count () {
      return this.$store.state.permanent_job_applications_count
    },
    permanent_job_applications_state () {
      return this.$store.state.permanent_job_applications
    },
  },

  watch: {
    "$route.query.status" (newStatus) {
      this.params = {}
      this.current_page = 1
      this.search = ""
      console.log('newStatus', newStatus)
      Promise.all([(this.locumColumns = []), (this.practiceColumns = []),]).then(
        () => {
          if (this.$auth.user.domain === "Locum") {
            this.locumColumns = this.defaultColumns
          } else if (this.$auth.user.domain === "Practice") {
            this.practiceColumns = this.defaultColumns
          }
          if (!newStatus || newStatus !== "Closed" || newStatus === "Pending") {
            if (!newStatus) {
              newStatus = "Available"
            }
            if (this.$auth.user.domain === "Locum") {
              this.locumColumns = [
                ...this.defaultColumns,
                {
                  name: "Status",
                  slot: true,
                  slotName: "status_slot",
                  dataIndex: "",
                  class: "text-center",
                  width: 120,
                },
              ]
            } else if (this.$auth.user.domain === "Practice") {
              this.practiceColumns = [
                ...this.defaultColumns,
                {
                  name: "Status",
                  slot: true,
                  slotName: "status_slot",
                  dataIndex: "",
                  class: "text-center",
                  width: 120,
                },
              ]
            }
          } else if (newStatus === "Closed") {
            if (this.$auth.user.domain === "Locum") {
              this.locumColumns = [
                ...this.defaultColumns,
                {
                  name: "Closed At",
                  dataIndex: "closed_at_in_gb_formatted",
                  class: "text-center",
                  width: 150,
                },
                {
                  name: "Status",
                  slot: true,
                  slotName: "status_slot",
                  dataIndex: "",
                  class: "text-center",
                  width: 100,
                },
                {
                  name: "Closing tag",
                  slot: true,
                  slotName: "closing_tag",
                  dataIndex: "",
                  class: "text-center",
                  width: 100,
                },
              ]
            } else if (this.$auth.user.domain === "Practice") {
              this.practiceColumns = [
                ...this.defaultColumns,
                {
                  name: "Closed At",
                  dataIndex: "closed_at_in_gb_formatted",
                  class: "text-center",
                  width: 150,
                },
                {
                  name: "Status",
                  slot: true,
                  slotName: "status_slot",
                  dataIndex: "",
                  class: "text-center",
                  // width: 120,
                },
                {
                  name: "Closing tag",
                  slot: true,
                  slotName: "closing_tag",
                  dataIndex: "",
                  class: "text-center",
                  // width: 150,
                },
              ]
            }
          }
          if (this.$auth.user.domain === "Locum") {
            const params = {
              job_posting_status: newStatus ? newStatus : "",
              locum_user_id: this.$auth.user.id,
              near_post_code: this.$auth.user.locum_postcode,
              limit: 15,
            }
            setTimeout(async () => {
              this.loading = true
              await this.getPermanentJobsForLocum(params)
              this.loading = false
            })
            this.loading = false
          } else if (this.$auth.user.domain === "Practice") {
            console.log('practice search', newStatus)
            let practice_type = this.$auth.user.practice_detail.practice.type
            const params = {
              job_posting_status: newStatus ? newStatus : "",
              logged_in_practice_id: this.$auth.user.logged_in_practice,
              // practice_id: practice_type === "Hub" && newStatus === "Pending"
              //   ? null
              //   : this.$auth.user.practice_id,
              parent_practice_id: practice_type === "Hub" && newStatus === "Pending"
                ? this.$auth.user.practice_id
                : null,
              limit: 15,
            }
            setTimeout(async () => {
              this.loading = true
              await this.getPermanentJobsForPractice(params)
              this.loading = false
            })
          }
        }
      )

      if (
        !this.$route.query.status
				|| this.$route.query.status === "Available"
      ) {
        this.permanent_job_status = [
          {
            label: "Available",
            value: "Available",
          },
          {
            label: "Applied",
            value: "Applied",
          },
        ]
      } else if (this.$route.query.status === "Closed") {
        this.permanent_job_status = [
          {
            label: "Closed due to Specified Reason",
            value: "Closed with Reason",
          },
          {
            label: "Closed for being Unfilled",
            value: "Unfilled",
          },
        ]
      }
    },

    search (value) {
      this.searchSubmit(value)
    },
  },

  async asyncData ({ app, route, store, error, }) {
    try {
      // FOR PRACTICE ONLY
      let permanent_jobs_for_practice = ""
      let permanent_jobs_for_practice_count = ""
      // FOR LOCUM ONLY
      let permanent_job_applications_count = ""
      let permanent_job_applications = ""
      let permanent_jobs_for_locum = ""
      let permanent_jobs_for_locum_count = ""

      let params = {}

      // for filters
      let professions = []
      let professions_categories = []

      // ------------------FOR LOCUM---------------
      if (app.$auth.user.domain === "Locum") {
        params = {
          job_posting_status: route.query.status
            ? route.query.status
            : "Available",
          locum_user_id: app.$auth.user.id,
          near_post_code: app.$auth.user.locum_postcode,
          limit: 15,
        }
        let response = await app.$axios.$get(
          `/api/v1/locum/permanent-jobs/count`,
          { params, }
        )
        permanent_jobs_for_locum_count
					= response.data && response.data.count ? response.data.count : null

        await store.commit(
          "permanentjobs/SET_LOCUM_PERMANENT_JOB_COUNT",
          permanent_jobs_for_locum_count
        )

        response = await app.$axios.$get(`/api/v1/locum/permanent-jobs`, {
          params,
        })

        permanent_jobs_for_locum = response.data && response.data.permanent_jobs
          ? response.data.permanent_jobs
          : null

        response = await app.$axios.$get(
          `/api/v1/locum/permanent-job-applications/count`
        )
        permanent_job_applications_count
					= response.data && response.data.count ? response.data.count : null

        await store.commit(
          "permanentjobs/SET_PERMANENT_JOB_APPLICATIONS_COUNT",
          permanent_job_applications_count
        )

        response = await app.$axios.$get(
          `/api/v1/locum/permanent-job-applications`
        )

        permanent_job_applications = response.data && response.data.permanent_job_applications
          ? response.data.permanent_job_applications
          : null

        permanent_jobs_for_locum = permanent_jobs_for_locum.map(
          permanent_job => {
            const permanent_job_app_found = permanent_job_applications.find(
              permanent_job_application =>
                permanent_job_application.permanent_job_id === permanent_job.id
            )
            if (permanent_job_app_found) {
              if (permanent_job_app_found.application_status === "Rejected") {
                permanent_job.status = "Closed"
              } else {
                permanent_job.status
									= permanent_job_app_found.application_status_formatted
              }
            } else {
              if (permanent_job.job_posting_status === "Closed") {
                permanent_job.status = "Closed"
              } else if (permanent_job.job_posting_status === "Unfilled") {
                permanent_job.status = "Unfilled"
              } else if (permanent_job.job_posting_status === "Available") {
                permanent_job.status = "Available"
              }
            }
            return permanent_job
          }
        )

        await store.commit(
          "permanentjobs/SET_LOCUM_PERMANENT_JOBS",
          permanent_jobs_for_locum
        )
      } else if (app.$auth.user.domain === "Practice") {
        // ---------------FOR PRACTICE-------------
        let practice_type = app.$auth.user.practice_detail.practice.type
        params = {
          job_posting_status: route.query.status
            ? route.query.status
            : "Available",
          logged_in_practice_id: app.$auth.user.logged_in_practice,
          // practice_id: practice_type === "Hub" && route.query.status === "Pending"
          //   ? null
          //   : app.$auth.user.practice_id,
          parent_practice_id: practice_type === "Hub" && route.query.status === "Pending"
            ? app.$auth.user.practice_id
            : null,
          limit: 15,
        }
        let response = await app.$axios.$get(
          `/api/v1/practice/permanent-jobs/count`,
          { params, }
        )
        permanent_jobs_for_practice_count
					= response.data && response.data.count ? response.data.count : null

        await store.commit(
          "permanentjobs/SET_PRACTICE_PERMANENT_JOB_COUNT",
          permanent_jobs_for_practice_count
        )

        response = await app.$axios.$get(`/api/v1/practice/permanent-jobs`, {
          params,
        })

        permanent_jobs_for_practice = response.data && response.data.permanent_jobs
          ? response.data.permanent_jobs
          : null

        permanent_job_applications_count
					= response.data && response.data.count ? response.data.count : null

        await store.commit(
          "permanentjobs/SET_PERMANENT_JOB_APPLICATIONS_COUNT",
          permanent_job_applications_count
        )

        response = await app.$axios.$get(
          `/api/v1/practice/permanent-job-applications`
        )

        permanent_job_applications = response.data && response.data.permanent_job_applications
          ? response.data.permanent_job_applications
          : null

        await store.commit(
          "permanentjobs/SET_PERMANENT_JOB_APPLICATIONS",
          permanent_job_applications
        )

        permanent_jobs_for_practice = permanent_jobs_for_practice.map(
          permanent_job => {
            if (permanent_job.permanent_job_applications.length > 0) {
              console.log(permanent_job.permanent_job_applications.filter(permJobApp => permJobApp.application_status === 'Rejected'))
              if (route.query.status === permanent_job.job_posting_status) {
                permanent_job.status = permanent_job.job_posting_status
              } else {
                if ( permanent_job.permanent_job_applications.filter(permJobApp => permJobApp.application_status === 'Rejected').length > 0) {
                  permanent_job.status = permanent_job.job_posting_status
                } else {
                  permanent_job.status = "Applied"
                }
              }
            } else {
              permanent_job.status = permanent_job.job_posting_status
            }
            return permanent_job
          }
        )

        await store.commit(
          "permanentjobs/SET_PRACTICE_PERMANENT_JOBS",
          permanent_jobs_for_practice
        )
      }

      await app.$axios.get(`/api/v1/professions`).then(response => {
        response.data.data.professions.forEach(item => {
          professions.push({ label: item.name, value: item.id, })
          professions_categories.push(item)
        })
      })

      return {
        permanent_jobs_for_practice_count,
        permanent_jobs_for_practice,
        permanent_jobs_for_locum_count,
        permanent_jobs_for_locum,
        permanent_job_applications_count,
        permanent_job_applications,

        professions,
        professions_categories,
        // params,
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data)
        return
      }
      throw err
    }
  },

  created () {
    if (this.$auth.user.domain === "Locum") {
      this.locumColumns = [
        ...this.defaultColumns,
        {
          name: "Status",
          slot: true,
          slotName: "status_slot",
          dataIndex: "",
          class: "text-center",
          width: 100,
        },
      ]

      if (this.$route.query.status) {
        this.locumColumns = [
          ...this.defaultColumns,
          {
            name: "Closed At",
            dataIndex: "closed_at",
            class: "text-center localDate",
            width: 140,
          },
          {
            name: "Status",
            slot: true,
            slotName: "status_slot",
            dataIndex: "",
            class: "text-center",
            width: 100,
          },
          {
            name: "Closing Tag",
            slot: true,
            slotName: "closing_tag",
            dataIndex: "",
            class: "text-center",
            width: 130,
          },
        ]
      }
    } else if (this.$auth.user.domain === "Practice") {
      this.practiceColumns = [
        ...this.defaultColumns,
        {
          name: "Status",
          slot: true,
          slotName: "status_slot",
          dataIndex: "",
          class: "text-center",
          width: 100,
        },
      ]
      if (this.$route.query.status) {
        this.practiceColumns = [
          ...this.defaultColumns,
          {
            name: "Closed At",
            dataIndex: "closed_at",
            class: "text-center localDate",
            width: 140,
          },
          {
            name: "Status",
            slot: true,
            slotName: "status_slot",
            dataIndex: "",
            class: "text-center",
            width: 100,
          },
          {
            name: "Closing Tag",
            slot: true,
            slotName: "closing_tag",
            dataIndex: "",
            class: "text-center",
            width: 130,
          },
        ]
      }
    }
    if (!this.$route.query.status || this.$route.query.status === "Available") {
      this.permanent_job_status = [
        {
          label: "Available",
          value: "Available",
        },
        {
          label: "Applied",
          value: "Applied",
        },
      ]
    } else if (this.$route.query.status === "Closed") {
      this.permanent_job_status = [
        {
          label: "Closed due to Specified Reason",
          value: "Closed with Reason",
        },
        {
          label: "Closed for being Unfilled",
          value: "Unfilled",
        },
      ]
    }
  },

  methods: {
    filterReset () {
      console.log('clear')
      this.params = {
        title : "",
        surgery : "",
        job_type : "",
        profession_id : "",
        date_posted_start : "",
        date_posted_end : "",
        permanent_job_status : "",
      }
      this.search = ""

      const params = {
        search: "",
        title: "",
        surgery: "",
        job_type: "",
        profession_id: "",
        date_posted_start: "",
        date_posted_end: "",
        permanent_job_status: "",
      }

      this.getJobs(params)
    },
    statusStyle (jobStatus) {
      switch (jobStatus) {
      case "Available":
        return "bg-green-500 text-white"
      case "Applied":
        return "bg-yellow-600 text-white"
      case "For Interview":
        return "bg-green-800 text-white"
      case "Accepted":
        return "bg-green-700 text-white"
      case "Hired":
      case "Offered":
        return "bg-green-600 text-white"
      case "Rejected":
      case "Declined":
        return "bg-red-700 text-white"
      case "Pending":
        return "bg-orange-500 text-white"
      case "Closed":
        return "bg-gray-700 text-white"
      case "Unfilled":
      case "Unsuccessful":
        return "bg-gray-400"
      default:
        return
      }
    },
    jobClosingTag (item) {
      let closingTag = ""
      if (this.$auth.user.domain === "Locum") {
        const permJobApp = item.permanent_job_applications.find(
          permJobApp =>
            permJobApp.applicant_locum_user_id === this.$auth.user.id
        )
        if (permJobApp && permJobApp.application_status === "Rejected") {
          closingTag = "Rejected"
        } else if (permJobApp && permJobApp.rejected_by_locum_at) {
          closingTag = "Interview Declined"
        } 
      } else {
        closingTag = item.hired_through
      }

      switch (closingTag) {
      case "Filled through HUBZZ":
        return "Filled through HUBZZ"
      case "Filled through Recruitment Agency":
        return "Filled through Recruitment Agency"
      case "Filled by Direct Applicant":
        return "Filled by Direct Applicant"
      case "Filled by Advert":
        return "Filled by Advert"
      case "Filled Internally":
        return "Filled Internally"
      case "Withdrawn":
        return "Withdrawn"
      case "Unfilled":
        return "Unfilled" 
      default:
        return "Closed By Practice"
      }
    },
    getJobs (params) {
      if (this.$auth.user.domain === "Locum") {
        this.getPermanentJobsForLocum(params)
      }
      if (this.$auth.user.domain === "Practice") {
        this.getPermanentJobsForPractice(params)
      }
    },

    searchSubmit: debounce(function (value) {
      this.params.search = value
      this.current_page = 1

      if (this.$auth.user.domain === "Locum") {
        this.getPermanentJobsForLocum(this.params)
      }
      if (this.$auth.user.domain === "Practice") {
        this.getPermanentJobsForPractice(this.params)
      }
    }, 500),

    async getPermanentJobsForLocum (params) {
      params = {
        ...params,
        locum_user_id: this.$auth.user.id,
        near_post_code: this.$auth.user.locum_postcode,
        job_posting_status: 
          params.job_posting_status 
            ? params.job_posting_status 
            : this.$route.query.status === 'Closed'
              ? 'Closed'
              : this.$route.query.status === 'Pending'
                ? 'Pending'
                : 'Available',
        search: params.search,
      }
      this.loading = true
      try {
        await this.$axios
          .$get(`/api/v1/locum/permanent-jobs/count`, { params, })
          .then(res => {
            this.permanent_jobs_for_locum_count
              = res.data && res.data.count ? res.data.count : 0
          })

        await this.$axios
          .$get(`/api/v1/locum/permanent-jobs`, { params, })
          .then(res => {
            this.permanent_jobs_for_locum = res.data && res.data.permanent_jobs
              ? res.data.permanent_jobs
              : null
          })

        await this.$axios
          .$get(`/api/v1/locum/permanent-job-applications/count`)
          .then(res => {
            this.permanent_job_applications_count
              = res.data && res.data.count ? res.data.count : 0
          })

        await this.$axios
          .$get(`/api/v1/locum/permanent-job-applications`)
          .then(res => {
            this.permanent_job_applications = res.data && res.data.permanent_job_applications
              ? res.data.permanent_job_applications
              : null
          })

        this.permanent_jobs_for_locum = await this.permanent_jobs_for_locum.map(
          permanent_job => {
            const permanent_job_app_found = this.permanent_job_applications.find(
              permanent_job_application =>
                permanent_job_application.permanent_job_id === permanent_job.id
            )

            if (permanent_job_app_found) {
              if (permanent_job_app_found.application_status === "Rejected") {
                permanent_job.status = "Closed"
              } else {
                permanent_job.status
                  = permanent_job_app_found.application_status_formatted
              }
            } else {
              if (permanent_job.job_posting_status === "Closed") {
                permanent_job.status = "Closed"
              } else if (permanent_job.job_posting_status === "Unfilled") {
                permanent_job.status = "Unfilled"
              } else if (permanent_job.job_posting_status === "Available") {
                permanent_job.status = "Available"
              }
            }

            return permanent_job
          }
        )
        
        this.loading = false
      } catch (err) {
        console.log('err', err)

        this.loading = false
      }
    },

    async getPermanentJobsForPractice (params) {
      let practice_type = this.$auth.user.practice_detail.practice.type
      params = {
        ...params,
        logged_in_practice_id: this.$auth.user.logged_in_practice,
        // practice_id: practice_type === "Hub" && this.$route.query.status === "Pending"
        //   ? null
        //   : this.$auth.user.practice_id,
        parent_practice_id: practice_type === "Hub" && this.$route.query.status === "Pending"
          ? this.$auth.user.practice_id
          : null,
        job_posting_status: 
          params.job_posting_status 
            ? params.job_posting_status 
            : this.$route.query.status === 'Closed'
              ? 'Closed'
              : this.$route.query.status === 'Pending'
                ? 'Pending'
                : 'Available',
        search: params.search,
      }
      console.log('get perm jobs for practice', params)
      await this.$axios
        .$get("/api/v1/practice/permanent-jobs/count", { params, })
        .then(res => {
          this.permanent_jobs_for_practice_count
						= res.data && res.data.count ? res.data.count : null
        })

      await this.$axios
        .$get(`/api/v1/practice/permanent-jobs`, { params, })
        .then(res => {
          this.permanent_jobs_for_practice = res.data && res.data.permanent_jobs
            ? res.data.permanent_jobs
            : null
        })

      await this.$axios
        .$get(`/api/v1/practice/permanent-job-applications/count`)
        .then(res => {
          this.permanent_job_applications_count
						= res.data && res.data.count ? res.data.count : null
        })

      await this.$axios
        .$get(`/api/v1/practice/permanent-job-applications`)
        .then(res => {
          this.permanent_job_applications = res.data && res.data.permanent_job_applications
            ? res.data.permanent_job_applications
            : null
        })

      this.permanent_jobs_for_practice = await this.permanent_jobs_for_practice.map(
        permanent_job => {
          const permanent_job_app_found = this.permanent_job_applications.find(
            permanent_job_application =>
              permanent_job_application.permanent_job_id === permanent_job.id
          )

          if (permanent_job_app_found) {
            if (this.$route.query.status) {
              permanent_job.status = permanent_job.job_posting_status
            } else {
              permanent_job.status = "Applied"
            }
          } else {
            permanent_job.status = permanent_job.job_posting_status
          }

          return permanent_job
        }
      )
    },
    async pagechanged (page) {
      this.current_page = page
      this.params.offset = this.params.limit * (page - 1)
      this.loading = true
      this.getJobs(this.params)
      this.loading = false
    },
    async limitchanged (limit) {
      this.current_page = 1
      this.params.offset = 0
      this.params.limit = limit
      this.loading = true
      this.getJobs(this.params)
      this.loading = false
    },
  },
}
</script>
