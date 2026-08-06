<template>
  <section>
    <div v-if="loadingStatistics" class="flex items-center gap-2 py-4 text-sm text-gray-500">
      <svgicon name="loader" width="24" height="24" />
      Loading...
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:max-w-6xl my-3 pr-6"
    >
      <div
        v-for="(item, index) in statistics"
        :key="index"
        :class="isLinkEnabled(item) ? 'cursor-pointer' : 'cursor-default'"
        @click="
          isLinkEnabled(item)
            ? $router.push({ name: item.routeName, query: { status: item.status } })
            : null
        "
      >
        <div
          class="statistics-card rounded-lg border bg-white p-4 h-full transition-all"
          :class="isLinkEnabled(item) ? 'hover:shadow-md hover:border-gray-400' : ''"
        >
          <div class="flex flex-col h-full">
            <div class="text-xs font-semibold uppercase tracking-wide text-gray-700 mb-2 leading-tight">
              {{ item.label }}
            </div>
            <div class="font-bold text-3xl text-gray-900 mt-auto">
              {{ item.value }}
            </div>
            <div v-if="isLinkEnabled(item)" class="mt-2 text-xs text-gray-700">
              View &rarr;
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      statistics: [],
      disabled: "true",
      loadingStatistics: false
    };
  },

  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    //new computed
    isLinkEnabled() {
      return item => {
        if (this.$auth.user.domain === "Locum") return true;
        if (this.$auth.user.domain === "Practice") {
          if (item.routeName === "sessions-index") {
            return this.authPermissions.includes("View Sessions Job");
          }
          return true;
        }
        return false;
      };
    }
    //end
  },

  created() {
    this.statistics = [];
    if (this.$auth.user.domain === "Locum") {
      this.getLocumStats();
    } else if (this.$auth.user.domain === "Practice") {
      this.getPracticeStats();
    }
  },

  mounted() {
    this.setLocumListeners();
    this.setPracticeListeners();
  },

  destroyed() {
    this.removeLocumListeners();
    this.removePracticeListeners();
  },
  methods: {
    setLocumListeners() {
      if (this.$socket) {
        this.$socket.on("Locum Notification Job Available", this.getLocumStats);
        this.$socket.on("Locum Notification Job Matched", this.getLocumStats);
        this.$socket.on("Locum Notification Job Applied", this.getLocumStats);
        this.$socket.on(
          "Locum Notification Job Application Cancelled",
          this.getLocumStats
        );
        this.$socket.on(
          "Locum Notification Job Application Auto Cancelled",
          this.getLocumStats
        );
        this.$socket.on(
          "Locum Notification Job Unsuccessful",
          this.getLocumStats
        );
        this.$socket.on("Locum Notification Job Allocated", this.getLocumStats);
        this.$socket.on("Locum Notification Job Ongoing", this.getLocumStats);
        this.$socket.on(
          "Locum Notification Job Part Completed",
          this.getLocumStats
        );
        this.$socket.on("Locum Notification Job Completed", this.getLocumStats);
        this.$socket.on(
          "Locum Notification Locum Invoice Updated",
          this.getLocumStats
        );
        this.$socket.on("Locum Notification Job Cancelled", this.getLocumStats);
        this.$socket.on("Locum Notification Job Amended", this.getLocumStats);
        this.$socket.on("Locum Notification Job Updated", this.getLocumStats);
        this.$socket.on("Locum Notification Job Declined", this.getLocumStats);
        this.$socket.on(
          "Locum Notification Job Terminated",
          this.getLocumStats
        );
        this.$socket.on(
          "Locum Notification Job Auto Declined",
          this.getLocumStats
        );
        this.$socket.on(
          "Locum Notification Job Unavailable",
          this.getLocumStats
        );
        this.$socket.on(
          "Locum Notification Job Unqualified",
          this.getLocumStats
        );
      }
    },

    removeLocumListeners() {
      if (this.$socket) {
        this.$socket.removeListener(
          "Locum Notification Job Available",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Matched",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Applied",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Application Cancelled",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Application Auto Cancelled",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Unsuccessful",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Allocated",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Ongoing",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Part Completed",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Completed",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Locum Invoice Updated",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Cancelled",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Amended",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Updated",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Declined",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Terminated",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Auto Declined",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Unavailable",
          this.getLocumStats
        );
        this.$socket.removeListener(
          "Locum Notification Job Unqualified",
          this.getLocumStats
        );
      }
    },

    setPracticeListeners() {
      this.$socket.on(
        "Practice Notification Job Available",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Application",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Application Cancelled",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Allocated",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Ongoing",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Part Completed",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Completed",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Locum Invoice Updated",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Cancelled",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Amended",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Declined",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Auto Declined",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Update Accept",
        this.getPracticeStats
      );
      this.$socket.on(
        "Practice Notification Job Unfilled",
        this.getPracticeStats
      );
    },

    removePracticeListeners() {
      this.$socket.removeListener(
        "Practice Notification Job Available",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Application",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Application Cancelled",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Allocated",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Ongoing",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Part Completed",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Completed",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Updated",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Cancelled",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Amended",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Declined",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Auto Declined",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Update Accept",
        this.getPracticeStats
      );
      this.$socket.removeListener(
        "Practice Notification Job Unfilled",
        this.getPracticeStats
      );
    },
    getLocumStats() {
      this.loadingStatistics = true;
      this.$axios
        .get(`/api/v1/locum/me/statistics`, { cache: true })
        .then(response => {
          this.statistics = [];
          const {
            total_available_job_count: totalAvailableJobCount = 0,
            allocated_job_count: allocatedJobCount = 0,
            applied_job_count: appliedJobCount = 0,
            ongoing_job_part_count: ongoingJobPartCount = 0,
            completed_job_part_count: completedJobPartCount = 0
          } = response.data.data.locum_user_statistics || {};

          this.statistics.push({
            label: "Available Jobs",
            value: totalAvailableJobCount,
            routeName: "jobs-index",
            status: "Available"
          });
          this.statistics.push({
            label: "Allocated Jobs",
            value: allocatedJobCount,
            routeName: "locum-job-parts-index",
            status: "Allocated"
          });
          this.statistics.push({
            label: "Applied Jobs",
            value: appliedJobCount,
            routeName: "jobs-index",
            status: "Applied"
          });
          this.statistics.push({
            label: "Ongoing Job Parts",
            value: ongoingJobPartCount,
            routeName: "locum-job-parts-index",
            status: "Ongoing"
          });
          this.statistics.push({
            label: "Completed Job Parts",
            value: completedJobPartCount,
            routeName: "locum-job-parts-index",
            status: "Completed"
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
        })
        .finally(() => {
          this.loadingStatistics = false;
        });
    },
    //changed from route to routname
    getPracticeStats() {
      this.loadingStatistics = true;
      this.$axios
        .get(`/api/v1/practice/me/practice-statistics`, { cache: true })
        .then(res => {
          this.statistics = [];
          const {
            ongoing_job_part_count: ongoingJobPartCount = 0,
            applied_job_count: appliedJobCount = 0,
            allocated_job_count: allocatedJobCount = 0,
            live_job_count: liveJobCount = 0,
            completed_job_part_count: completedJobPartCount = 0,
            unfilled_job_count: unfilledJobCount = 0,
            to_be_completed_ongoing_job_part_count: toBeCompletedOngoingJobPartCount = 0
          } = res.data.data.practice_statistics || {};

          this.statistics.push({
            label: "Ongoing Job Parts",
            value: ongoingJobPartCount,
            routeName: "job-parts-index",
            status: "Ongoing"
          });
          this.statistics.push({
            label: "Applied Jobs",
            value: appliedJobCount,
            routeName: "sessions-index",
            status: "Applied"
          });
          this.statistics.push({
            label: "Allocated Jobs",
            value: allocatedJobCount,
            routeName: "job-parts-index",
            status: "Allocated"
          });
          this.statistics.push({
            label: "Live Jobs",
            value: liveJobCount,
            routeName: "sessions-index",
            status: "Live"
          });
          this.statistics.push({
            label: "Completed Job Parts",
            value: completedJobPartCount,
            routeName: "job-parts-index",
            status: "Completed"
          });
          this.statistics.push({
            label: "Unfilled Jobs",
            value: unfilledJobCount,
            routeName: "sessions-index",
            status: "Unfilled"
          });
          this.statistics.push({
            label: "To Complete Ongoing",
            value: toBeCompletedOngoingJobPartCount,
            routeName: "job-parts-index",
            status: "Ongoing"
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
        })
        .finally(() => {
          this.loadingStatistics = false;
        });
    }
  }
};
//end
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

.statistics-card {
  display: flex;
  min-height: 90px;
}
</style>
