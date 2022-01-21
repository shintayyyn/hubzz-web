<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start lg:max-w-6xl lg:min-w-5xl my-3 pr-6">
      <svgicon v-if="loadingStatistics" name="loader" width="60" height="60" />
      <div
        v-for="(item, index) in statistics"
        :key="index"
        class="px-1 my-1 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 lg:max-w-sm"
      >
        <nuxt-link
          :event="($auth.user.domain === 'Practice' && authPermissions.includes('View Sessions Job')) || $auth.user.domain === 'Locum' ? 'click' : disabled"
          :to="item.route"
        >
          <div
            class="statistics-card rounded-lg border px-4 py-2 bg-white h-full"
            :class="($auth.user.domain === 'Practice' && authPermissions.includes('View Sessions Job')) || $auth.user.domain === 'Locum'? 'hover:bg-gray-300' : ''"
          >
            <div class="flex flex-col w-full justify-between">
              <div class="text-sm sm:text-md text-gray-600">
                {{ item.label }}
              </div>
              <div class="font-bold text-4xl">
                {{ item.value }}
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      statistics: [],
      disabled: "true",
      loadingStatistics: false,
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
  },

  created () {
    this.statistics = []
    if (this.$auth.user.domain === "Locum") {
      this.getLocumStats()
    } else if (this.$auth.user.domain === "Practice") {
      this.getPracticeStats()
    }
  },

  mounted () {
    this.setLocumListeners()
    this.setPracticeListeners()
  },

  destroyed () {
    this.removeLocumListeners()
    this.removePracticeListeners()
  },

  methods: {
    setLocumListeners () {
      if (this.$socket) {
        this.$socket.on("Locum Notification Job Available", this.getLocumStats)
        this.$socket.on("Locum Notification Job Matched", this.getLocumStats)
        this.$socket.on("Locum Notification Job Applied", this.getLocumStats)
        this.$socket.on(
          "Locum Notification Job Application Cancelled",
          this.getLocumStats
        )
        this.$socket.on(
          "Locum Notification Job Application Auto Cancelled",
          this.getLocumStats
        )
        this.$socket.on(
          "Locum Notification Job Unsuccessful",
          this.getLocumStats
        )
        this.$socket.on("Locum Notification Job Allocated", this.getLocumStats)
        this.$socket.on("Locum Notification Job Ongoing", this.getLocumStats)
        this.$socket.on(
          "Locum Notification Job Part Completed",
          this.getLocumStats
        )
        this.$socket.on("Locum Notification Job Completed", this.getLocumStats)
        this.$socket.on(
          "Locum Notification Locum Invoice Updated",
          this.getLocumStats
        )
        this.$socket.on("Locum Notification Job Cancelled", this.getLocumStats)
        this.$socket.on("Locum Notification Job Amended", this.getLocumStats)
        this.$socket.on("Locum Notification Job Updated", this.getLocumStats)
        this.$socket.on("Locum Notification Job Declined", this.getLocumStats)
        this.$socket.on(
          "Locum Notification Job Terminated",
          this.getLocumStats
        )
        this.$socket.on(
          "Locum Notification Job Auto Declined",
          this.getLocumStats
        )
        this.$socket.on(
          "Locum Notification Job Unavailable",
          this.getLocumStats
        )
        this.$socket.on(
          "Locum Notification Job Unqualified",
          this.getLocumStats
        )
      }
    },

    removeLocumListeners () {
      if (this.$socket) {
        this.$socket.removeListener(
          "Locum Notification Job Available",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Matched",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Applied",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Application Cancelled",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Application Auto Cancelled",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Unsuccessful",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Allocated",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Ongoing",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Part Completed",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Completed",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Locum Invoice Updated",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Cancelled",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Amended",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Updated",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Declined",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Terminated",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Auto Declined",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Unavailable",
          this.getLocumStats
        )
        this.$socket.removeListener(
          "Locum Notification Job Unqualified",
          this.getLocumStats
        )
      }
    },

    setPracticeListeners () {
      this.$socket.on(
        "Practice Notification Job Available",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Application",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Application Cancelled",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Allocated",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Ongoing",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Part Completed",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Completed",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Locum Invoice Updated",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Cancelled",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Amended",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Declined",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Auto Declined",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Update Accept",
        this.getPracticeStats
      )
      this.$socket.on(
        "Practice Notification Job Unfilled",
        this.getPracticeStats
      )
    },

    removePracticeListeners () {
      this.$socket.removeListener(
        "Practice Notification Job Available",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Application",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Application Cancelled",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Allocated",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Ongoing",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Part Completed",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Completed",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Updated",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Cancelled",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Amended",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Declined",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Auto Declined",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Update Accept",
        this.getPracticeStats
      )
      this.$socket.removeListener(
        "Practice Notification Job Unfilled",
        this.getPracticeStats
      )
    },

    getLocumStats () {
      this.loadingStatistics = true
      this.$axios
        .get(`/api/v1/locum/me/statistics`)
        .then(response => {
          this.statistics = []

          const {
            total_available_job_count: totalAvailableJobCount = 0,
            allocated_job_count: allocatedJobCount = 0,
            applied_job_count: appliedJobCount = 0,
            ongoing_job_part_count: ongoingJobPartCount = 0,
            completed_job_part_count: completedJobPartCount = 0,
          } = response.data.data.locum_user_statistics || {}

          this.statistics.push({
            label: "Available Jobs",
            value: totalAvailableJobCount,
            route: "/jobs?status=Available",
          })

          this.statistics.push({
            label: "Allocated Jobs",
            value: allocatedJobCount,
            route: "/locum-job-parts?status=Allocated",
          })

          this.statistics.push({
            label: "Applied Jobs",
            value: appliedJobCount,
            route: "/jobs?status=Applied",
          })

          this.statistics.push({
            label: "Ongoing Job Parts",
            value: ongoingJobPartCount,
            route: "/locum-job-parts?status=Ongoing",
          })

          this.statistics.push({
            label: "Completed Job Parts",
            value: completedJobPartCount,
            route: "/locum-job-parts?status=Completed",
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
        .finally(() => {
          this.loadingStatistics = false
        })
    },

    getPracticeStats () {
      this.loadingStatistics = true
      this.$axios
        .get(`/api/v1/practice/me/practice-statistics`)
        .then(res => {
          this.statistics = []

          const {
            ongoing_job_part_count: ongoingJobPartCount = 0,
            applied_job_count: appliedJobCount = 0,
            allocated_job_count: allocatedJobCount = 0,
            live_job_count: liveJobCount = 0,
            completed_job_part_count: completedJobPartCount = 0,
            unfilled_job_count: unfilledJobCount = 0,
            to_be_completed_ongoing_job_part_count: toBeCompletedOngoingJobPartCount = 0,
          } = res.data.data.practice_statistics || {}

          this.statistics.push({
            label: "Ongoing Job Parts",
            value: ongoingJobPartCount,
            route: "/job-parts?status=Ongoing",
          })

          this.statistics.push({
            label: "Applied Jobs",
            value: appliedJobCount,
            route: "/sessions?status=Applied",
          })

          this.statistics.push({
            label: "Allocated Jobs",
            value: allocatedJobCount,
            route: "/job-parts?status=Allocated",
          })

          this.statistics.push({
            label: "Live Jobs",
            value: liveJobCount,
            route: "/sessions?status=Live",
          })

          this.statistics.push({
            label: "Completed Job Parts",
            value: completedJobPartCount,
            route: "/job-parts?status=Completed",
          })

          this.statistics.push({
            label: "Unfilled Jobs",
            value: unfilledJobCount,
            route: "/sessions?status=Unfilled",
          })

          this.statistics.push({
            label: "To Complete Ongoing Job Parts",
            value: toBeCompletedOngoingJobPartCount,
            route: "/job-parts?status=Ongoing",
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
        .finally(() => {
          this.loadingStatistics = false
        })
    },
  },
}
</script>

<style scoped>
a {
	text-decoration: none;
	color: black;
}

.statistics-card {
	min-height: 100px;
  display: flex;
	/* align-items: center; */
}
</style>
