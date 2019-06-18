<template>
  <section class="dashboard-section">
    <div class="reminders-section" v-if="$auth.user.domain === 'Locum'">
      <Reminders/>
    </div>
    <div class="appointment-section">
      <div class="text-xs sm:text-sm font-bold">Appointments</div>
      <Calendar/>
    </div>
    <div class="statistics-section">
      <div class="text-sm sm:text-base font-bold">Quick Statistics</div>
      <Statistics/>
    </div>
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
    Statistics,
  },
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
  },
}
</script>
<style scoped>
.dashboard-section {
  height: auto;
  width: 100%;
}
.create-job-modal-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
</style>

