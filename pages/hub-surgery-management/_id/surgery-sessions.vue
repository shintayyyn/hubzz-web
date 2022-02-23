<template>
  <section class="surgery-sessions-sections">
    <!-- <div class="relative flex-col w-full lg:w-1/8 sm:w-1/4">
      <AppLoading :loading="loading" spinner />

      <div class="flex flex-row justify-start overflow-x-auto">
        <div class="flex flex-col mb-2">
          <label for="search" class="text-xs sm:text-sm">Job number</label>

          <div class="flex flex-row justify-start">
            <input
              v-model="search"
              type="text"
              class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full shadow-none"
            >
          </div>

          <transition name="fade" mode="out-in">
            <div v-if="noFoundJob" class="text-xs text-red-500">
              No matching job number
            </div>
          </transition>
        </div>
      </div>

      <div class="flex justify-start">
        <div
          class="bg-yellow-500 hover:text-white cursor-pointer shadow-lg rounded-lg px-2 py-1 font-bold mb-5 min-w-sm"
          @click="findJobNumber"
        >
          Search
        </div>
      </div>
    </div> -->

    <div v-if="!$route.params.jobId && !$route.params.sessionId && !$route.params.jobPartId" class="flex flex-row justify-start overflow-x-auto mt-2 border-b border-gray-500">
      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Pending`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'pending'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Pending
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Allocated`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          !$route.query.jobStatus || ($route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'allocated')
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Allocated
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Ongoing`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'ongoing'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Ongoing
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Live`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'live'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Live
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Applied`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'applied'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Applied
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Unfilled`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'unfilled'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Unfilled
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Withdrawn`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'withdrawn'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Withdrawn
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Cancelled`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'cancelled'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Cancelled
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Completed`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'completed'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Completed
      </nuxt-link>

      <nuxt-link
        :to="`/hub-surgery-management/${$route.params.id}/surgery-sessions?jobStatus=Approved`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="
          $route.query.jobStatus && $route.query.jobStatus.toLowerCase() === 'approved'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Approved
      </nuxt-link>
    </div>

    <div class="mt-5">
      <nuxt-child
        :shifts="shifts"
        :rates="rates"
        :spokePracticeId="spokePracticeId"
      />
    </div>

    <transition name="shield" mode="out-in">
      <div
        v-if="create_job_surgery_modal"
        class="shield"
        @click="close"
      />
    </transition>

    <transition name="slide" mode="out-in">
      <template v-if="create_job_surgery_modal">
        <div class="modal-container shadow-lg">
          <CreateJobModal :job="repost_job" />
        </div>
      </template>
    </transition>
  </section>
</template>

<script>
import CreateJobModal from "@/components/CreateJobModal"
// import AppLoading from "@/components/Base/AppLoading"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    CreateJobModal,
    // AppLoading,
  },

  data () {
    return {
      search: null,
      noFoundJob: false,
      loading: false,
      shifts: [],
      rates: [],
      spokePracticeId: null,
    }
  },

  computed: {
    create_job_surgery_modal () {
      return this.$store.state.calendar.create_job_surgery_modal
    },
    repost_job () {
      return this.$store.state.calendar.repost_job
    },
  },

  async asyncData ({ app, error, store, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Surgery Sessions') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch (err) {
      console.log('err', err.response || err)
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
    }
  },

  created () {
    this.$axios
      .$get(`/api/v1/practice/me/practice-surgeries/${this.$route.params.id}`)
      .then(res => {
        this.spokePracticeId
					= res.data
					&& res.data.practice_surgery
					&& res.data.practice_surgery.child_practice_id
            ? res.data.practice_surgery.child_practice_id
            : null
      }),
    this.$axios.$get(`/api/v1/shifts`).then(res => {
      this.shifts = []
      this.shifts.push({ label: "All", value: "", })
      res.data.shifts.forEach(item => {
        this.shifts.push({ label: item.name, value: item.id, })
      })
    })
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rates = []
      this.rates.push({ label: "All", value: "", })
      res.data.locum_detail_rate_types.forEach(item => {
        this.rates.push({ label: item.name, value: item.id, })
      })
    })
  },

  methods: {
    close () {
      this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", false)
    },
    async findJobNumber () {
      if (!this.search) {
        return
      }

      this.loading = true

      let resJob = await this.findJob()
      let resJobPart = await this.findJobParts()
      let job = null
      let urlPath = null
      this.noFoundJob = false

      this.loading = false

      if (resJob.length > 0) {
        job = resJob[0]
        urlPath = `/hub-surgery-management/${this.$route.params.id}/surgery-sessions/${job.id}`
      }

      if (resJobPart.length > 0) {
        job = resJobPart[0]
        urlPath = `/hub-surgery-management/${this.$route.params.id}/surgery-sessions/${job.job.id}/job-parts/${job.id}`
      }

      if (resJob.length > 0 || resJobPart.length > 0) {
        this.$router.push({
          path: `/hub-surgery-management/${this.$route.params.id}/surgery-sessions`,
          query: { jobStatus: job.status, },
        })

        setTimeout(() => {
          this.$router.push({
            path: urlPath,
            query: { jobStatus: job.status, },
          })
        }, 500)
      }

      if (resJob.length === 0 && resJobPart.length === 0) {
        this.noFoundJob = true
      }
    },
    findJob () {
      return this.$axios
        .$get(`/api/v1/practice/jobs`, {
          params: {
            status: [
              "Pending",
              "Live",
              "Applied",
              "Unfilled",
            ],
            job_number: this.search,
            practice_id: this.spokePracticeId,
          },
        })
        .then(res => {
          return res.data.jobs
        })
        .catch(err => {
          console.log("job err", err.response)
          return []
        })
    },
    findJobParts () {
      return this.$axios
        .$get(`/api/v1/practice/job-parts`, {
          params: {
            status: [
              "Allocated",
              "Ongoing",
              "Withdrawn",
              "Cancelled",
              "Completed",
              "Approved",
              "Terminated",
            ],
            job_part_number: this.search,
            job_practice_id: this.spokePracticeId,
          },
        })
        .then(res => {
          return res.data.job_parts
        })
        .catch(err => {
          console.log("job part err", err.response)
          return []
        })
    },
  },
}
</script>

<style scoped>
  .shield {
    z-index: 600;
  }

  .modal-container {
    z-index: 601;
  }

  @media (min-width: 1200px) {
    .modal-container {
      width: 70%;
    }
  }
</style>
