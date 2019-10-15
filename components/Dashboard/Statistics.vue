<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start lg:max-w-6xl">
      <div
        class="px-2 my-2 sm:my-4 w-full sm:w-1/2 lg:max-w-sm"
        :class="$auth.user.domain === 'Locum' ? 'md:w-1/4' : 'md:w-1/3'"
        v-for="(item, index) in statistics"
        :key="index"
      >
        <nuxt-link :to="item.route">
          <div class="statistics-card rounded-lg shadow-lg px-8 py-4 hover:bg-gray-300">
            <div class="flex flex-col my-2">
              <div class="text-sm sm:text-md">{{item.label}}</div>
              <div class="font-bold text-5xl mt-2">{{item.value}}</div>
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
        this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Available`),
        this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Current`),
        this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Applied`),
        this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Completed`)
      ]).then(responses => {
        this.statistics.push({
          label: "Available jobs",
          value: responses[0].data.count,
          route: "/jobs/available"
        }),
          this.statistics.push({
            label: "Allocated jobs",
            value: responses[1].data.count,
            route: "/jobs/allocated"
          }),
          this.statistics.push({
            label: "Applied jobs",
            value: responses[2].data.count,
            route: "/jobs/applied"
          }),
          this.statistics.push({
            label: "Completed jobs",
            value: responses[3].data.count,
            route: "/jobs/completed"
          });
      });
    },
    getPracticeStats() {
      Promise.all([
        this.$axios.$get(
          `/api/v1/practice/locums/count?practice_locum_type=Applied`
        ),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Applied`),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Current`),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Available`),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Completed`),
        this.$axios.$get(`/api/v1/practice/jobs/count?status=Unfilled`)
      ]).then(responses => {
        this.statistics.push({
          label: "My Banks",
          value: responses[0].data.count,
          route: "/my-banks"
        }),
          this.statistics.push({
            label: "Applied jobs",
            value: responses[1].data.count,
            route: "/sessions/applied"
          }),
          this.statistics.push({
            label: "Assigned jobs",
            value: responses[2].data.count,
            route: "/sessions/allocated"
          }),
          this.statistics.push({
            label: "Available jobs",
            value: responses[3].data.count,
            route: "/sessions/live"
          });
        this.statistics.push({
          label: "Completed jobs",
          value: responses[4].data.count,
          route: "/sessions/completed"
        });
        this.statistics.push({
          label: "Unfilled jobs",
          value: responses[5].data.count,
          route: "/sessions/unfilled"
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
}
</style>


