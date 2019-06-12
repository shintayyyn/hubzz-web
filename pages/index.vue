<template>
  <section class="px-5">
    <template v-if="$auth.user.domain === 'Locum'">
      <Reminders/>
    </template>
    <div class="flex flex-row flex-no-wrap justify-start">
      <Calendar/>
    </div>
    <Statistics/>
  </section>
</template>

<script>
import Calendar from '@/components/Calendar'
import Reminders from '@/components/Dashboard/Reminders'
import Statistics from '@/components/Dashboard/Statistics'
export default {
  components: {
    Calendar,
    Reminders,
    Statistics
  },
  middleware: 'isAuthenticated',
  data() {
    return {
      statistics: []
    }
  },
  created() {
    this.statistics = []
    // practice - get mylocums and jobs count
    if (this.$auth.user.domain === 'Practice') {
      this.$axios.$get(`/api/v1/practice/locums/count`).then(res => {
        this.statistics.push({ label: 'My Banks', count: res.data.count, route: '/my-banks' })
      })
      this.$axios.$get(`/api/v1/practice/jobs/count?status=Applied`).then(res => {
        this.statistics.push({ label: 'Applied Jobs', count: res.data.count, route: '/sessions' })
      })
      this.$axios.$get(`/api/v1/practice/jobs/count?status=Current`).then(res => {
        this.statistics.push({ label: 'Assigned Jobs', count: res.data.count, route: '/sessions' })
      })
      this.$axios.$get(`/api/v1/practice/jobs/count?status=Available`).then(res => {
        this.statistics.push({ label: 'Available Jobs', count: res.data.count, route: '/sessions' })
      })
    }
    if (this.$auth.user.domain === 'Locum') {
      this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Available`).then(res => {
        this.statistics.push({ label: 'Available jobs', count: res.data.count, route: '/jobs' })
      })
      this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Current`).then(res => {
        this.statistics.push({ label: 'Allocated jobs', count: res.data.count, route: '/jobs' })
      })
      this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Applied`).then(res => {
        this.statistics.push({ label: 'Applied jobs', count: res.data.count, route: '/jobs' })
      })
      this.$axios.$get(`/api/v1/locum/jobs/count?locum_status=Completed`).then(res => {
        this.statistics.push({ label: 'Completed jobs', count: res.data.count, route: '/jobs' })
      })
    }
  }
}
</script>
