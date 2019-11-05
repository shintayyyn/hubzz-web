<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start lg:max-w-6xl">
      <div
        class="sm:px-2 my-2 sm:my-4 w-full sm:w-1/2 lg:max-w-sm"
        :class="$auth.user.domain === 'Locum' ? 'md:w-1/4' : 'md:w-1/3'"
        v-for="(item, index) in statistics"
        :key="index"
      >
        <nuxt-link :to="item.route">
          <div class="statistics-card rounded-lg shadow-md px-4 md:px-8 py-4 bg-white hover:bg-gray-300">
            <div class="flex flex-col">
              <div class="text-sm sm:text-md">{{item.label}}</div>
              <div class="font-bold text-5xl">{{item.value}}</div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      statistics: []
    };
  },
  created() {
    this.statistics = [];
    if (this.$auth.user.domain === "Locum") {
      this.getLocumStats();
    } else if (this.$auth.user.domain === "Practice") {
      this.getPracticeStats();
    }
  },
  methods: {
    getLocumStats() {
      Promise.all([
        this.$axios.$get(
          `/api/v1/locum/jobs/count?locum_status=Available&locum_status=Matched`
        ),
        this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Allocated`),
        this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Applied`),
        this.$axios.$get(`/api/v1/locum/job-parts/count?locum_status=Completed`)
      ]).then(responses => {
        this.statistics.push({
          label: "Available Jobs",
          value: responses[0].data.count,
          route: "/jobs?status=Available"
        }),
          this.statistics.push({
            label: "Allocated Jobs",
            value: responses[1].data.count,
            route: "/jobs?status=Allocated"
          }),
          this.statistics.push({
            label: "Applied Jobs",
            value: responses[2].data.count,
            route: "/jobs?status=Applied"
          }),
          this.statistics.push({
            label: "Completed Job Parts",
            value: responses[3].data.count,
            route: "/jobs?status=Completed"
          });
      });
    },
    getPracticeStats() {
      Promise.all([
        this.$axios.$get(
          `/api/v1/practice/locums/count?practice_locum_type=Applied`
        ),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Applied`),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Allocated`),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Live`),
        this.$axios.$get(`/api/v1/practice/job-parts/count?status=Completed`),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Unfilled`)
      ]).then(responses => {
        this.statistics.push({
          label: "My Banks",
          value: responses[0].data.count,
          route: "/my-banks?status=Applied"
        }),
          this.statistics.push({
            label: "Applied Jobs",
            value: responses[1].data.count,
            route: "/sessions?status=Applied"
          }),
          this.statistics.push({
            label: "Assigned Jobs",
            value: responses[2].data.count,
            route: "/sessions?status=Allocated"
          }),
          this.statistics.push({
            label: "Available Jobs",
            value: responses[3].data.count,
            route: "/sessions?status=Live"
          });
        this.statistics.push({
          label: "Completed Job Parts",
          value: responses[4].data.count,
          route: "/sessions?status=Completed"
        });
        this.statistics.push({
          label: "Unfilled Jobs",
          value: responses[5].data.count,
          route: "/sessions?status=Unfilled"
        });
      });
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
.statistics-card {
  min-height: 130px;
  display: flex;
  align-items: center;
}
</style>


