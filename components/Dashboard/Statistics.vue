<template>
  <section>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="p-4 w-full sm:w-1/2 lg:w-1/4" v-for="(item, index) in statistics" :key="index">
        <div class="statistics-card rounded-lg shadow-lg p-4 hover:bg-grey-light">
          <nuxt-link :to="item.route">
            <div class="flex flex-col my-2">
              <div class="text-sm sm:text-md">{{item.label}}</div>
              <div class="font-bold text-5xl mt-2">{{item.value}}</div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      statistics: []
    }
  },
  created() {
    this.statistics = []
    if (this.$auth.user.domain === 'Locum') {
      this.getLocumStats()
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
        this.statistics.push({ label: 'Available jobs', value: responses[0].data.count, route: '/jobs' }),
          this.statistics.push({ label: 'Allocated jobs', value: responses[1].data.count, route: '/jobs' }),
          this.statistics.push({ label: 'Applied jobs', value: responses[2].data.count, route: '/jobs' }),
          this.statistics.push({ label: 'Completed jobs', value: responses[3].data.count, route: '/jobs' })
      })

    }
  }
}
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


