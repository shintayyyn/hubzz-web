<template>
  <section>
    <div class="relative calendar bg-white border border-solid shadow-md my-4 rounded-lg lg:max-w-6xl">
      <div class="relative flex flex-row flex-wrap w-full h-full">
        <div
          class="relative w-full lg:w-2/3 px-2 md:px-5 pb-4"
          :class="authPermissions.includes('Create Sessions Job') ? 'pt-5' : 'pt-2'"
        >
          <PerMonth
            v-if="$store.state.calendar.view_type === 'per_month'"
            @getCalendarJobAndJobParts="getCalendarJobAndJobParts"
          />

          <PerWeek
            v-if="$store.state.calendar.view_type === 'per_week'"
            @getCalendarJobAndJobParts="getCalendarJobAndJobParts"
          />
        </div>

        <div class="w-full lg:w-1/3">
          <Info />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PerMonth from "@/components/Calendar/PerMonth"
import PerWeek from "@/components/Calendar/PerWeek"
import Info from "@/components/Calendar/Info"

export default {
  components: {
    PerMonth,
    PerWeek,
    Info,
  },
  
  computed: {
    loading () {
      return this.$store.state.calendar.loading
    },

    create_job_modal () {
      return this.$store.state.calendar.create_job_modal
    },

    authPermissions () {
      return this.$store.getters["permissions"]
    },

    canCreateJob () {
      if (this.$auth.user.domain === "Locum") {
        return false
      } else if (
        !this.authPermissions.includes("Create Sessions Job")
        || (
          this.$auth.user.practice_detail.practice.type === "Spoke"
          && this.$auth.user.practice_detail.practice.parent_practice_id
          && !this.$auth.user.practice_detail.practice.allow_surgery_create_sessions
        )
      ) {
        return false
      }
      
      return true
    },
  },

  created () {
    this.$store.commit("calendar/SET_DATE_TODAY")
  },

  methods: {
    getCalendarJobAndJobParts (calendarDateStart, calendarDateEnd) {
      if (this.$auth.loggedIn && this.$auth.user.domain === 'Practice'&& this.authPermissions.includes('View Sessions Job')) {
        this.$store.commit('calendar/TOGGLE_LOADING', true)

        Promise.all([
          this.$axios.get('/api/v1/practice/job-parts', {
            params: {
              status: ['Withdrawn', 'Allocated',],
              calendar_date_start: `${calendarDateStart}:gte`,
              calendar_date_end: `${calendarDateEnd}:lte`,
              reposted: false,
              limit: 100000000,
            },
          }).then(response => response.data.data.job_parts),

          this.$axios.get('/api/v1/practice/jobs', {
            params: {
              status: ['Applied', 'Unfilled', 'Live',],
              calendar_date_start: `${calendarDateStart}:gte`,
              calendar_date_end: `${calendarDateEnd}:lte`,
              reposted: false,
              limit: 100000000,
            },
          }).then(response => response.data.data.jobs),
        ]).then(([jobParts, jobs,]) => {
          const allocatedJobParts = jobParts.filter(({ status, }) => status === 'Allocated')
          const withdrawnJobParts = jobParts.filter(({ status, }) => status === 'Withdrawn')

          this.$store.commit('jobs/SET_PRACTICE_ALLOCATED_JOB_PARTS', allocatedJobParts)
          this.$store.commit('jobs/SET_PRACTICE_WITHDRAWN_JOB_PARTS', withdrawnJobParts)

          const liveJobs = jobs.filter(({ status, }) => status === 'Live')
          const appliedJobs = jobs.filter(({ status, }) => status === 'Applied')
          const unfilledJobs = jobs.filter(({ status, }) => status === 'Unfilled')

          this.$store.commit('jobs/SET_PRACTICE_AVAILABLE_JOBS', liveJobs)
          this.$store.commit('jobs/SET_PRACTICE_APPLIED_JOBS', appliedJobs)
          this.$store.commit('jobs/SET_PRACTICE_UNFILLED_JOBS', unfilledJobs)
        }).finally(() => {
          this.$store.commit('calendar/TOGGLE_LOADING', false)
        })
      }

      if (this.$auth.loggedIn && this.$auth.user.domain === 'Locum') {
        this.$store.commit('calendar/TOGGLE_LOADING', true)

        Promise.all([
          this.$axios.get('/api/v1/locum/job-parts', {
            params: {
              locum_status: ['Allocated', 'Ongoing'],
              calendar_date_start: `${calendarDateStart}:gte`,
              calendar_date_end: `${calendarDateEnd}:lte`,
              limit: 100000000,
            },
          }).then(response => response.data.data.job_parts),

          this.$axios.get('/api/v1/locum/jobs', {
            params: {
              locum_status: ['Applied',],
              job_type: ['Platform', 'Private',],
              calendar_date_start: `${calendarDateStart}:gte`,
              calendar_date_end: `${calendarDateEnd}:lte`,
              limit: 100000000,
            },
          }).then(response => response.data.data.jobs),
            
          this.$auth.user.view_permanent_jobs
            ? this.$axios.get('/api/v1/locum/permanent-job-applications', {
              params: {
                application_status: 'For Interview',
                calendar_date_start: `${calendarDateStart}:gte`,
                calendar_date_end: `${calendarDateEnd}:lte`,
                limit: 100000000,
              },
            }).then(response => response.data.data.permanent_job_applications)
            : [],
        ]).then(([jobParts, jobs, permanentJobApplications,]) => {
          const allocatedJobParts = jobParts.filter(({ status, type, }) => status === 'Allocated' && type === 'Platform')
          const privateJobParts = jobParts.filter(({ type, }) => type === 'Private')

          this.$store.commit('jobs/SET_LOCUM_ALLOCATED_JOB_PARTS', allocatedJobParts)
          this.$store.commit('jobs/SET_LOCUM_PRIVATE_JOB_PARTS', privateJobParts)

          this.$store.commit('jobs/SET_LOCUM_APPLIED_JOBS', jobs)
          this.$store.commit('jobs/SET_LOCUM_PERMANENT_JOBS', permanentJobApplications)
        }).finally(() => {
          this.$store.commit('calendar/TOGGLE_LOADING', false)
        })
      }
    },
  },
}
</script>

<style scoped>
  .calendar {
    height: auto;
  }

  @media screen and (min-width: 991px) {
    .calendar {
      height: auto;
    }
  }
</style>
