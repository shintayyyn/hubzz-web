<template>
  <section class="dashboard-section px-4">
    <template v-if="$auth.user.domain === 'Locums'">
      <div class="font-bold items-start" style="font-family:Nunito">Reminders</div>
      <div class="flex flex-row flex-wrap justify-start">
        <div
          v-for="(item, index) in $store.state.dashboard.reminders"
          :key="`${item.type}-${index}`"
        >
          <Reminders v-if="!item.done">
            <span>
              <strong>{{item.type}}</strong>
              details
            </span>
          </Reminders>
        </div>
      </div>
    </template>
    <div
      class="font-bold"
      style="font-family:Nunito"
      v-if="$auth.user.domain === 'Locums'"
    >Appointments</div>
    <div class="flex flex-row flex-no-wrap justify-start">
      <Calendar v-if="$auth.user.domain === 'Practice'"/>
      <Appointments v-if="$auth.user.domain === 'Locums'"/>
    </div>
    <div class="font-bold" style="font-family:Nunito">Quick Statistics</div>
    <div class="flex flex-row flex-wrap justify-start">
      <Statistics
        v-for="(item,index) in statistics"
        :key="index"
        :label="item.label"
        :count="item.count"
        :route="item.route"
      />
    </div>
  </section>
</template>

<script>
// practice
import Calendar from '@/components/Calendar'
// locums
import Reminders from '@/components/Dashboard/Reminders'
import Appointments from '@/components/Dashboard/Appointments'
//
import Statistics from '@/components/Dashboard/Statistics'
export default {
  components: {
    Calendar,
    Reminders,
    Appointments,
    Statistics
  },
  middleware: 'isAuthenticated',
  data() {
    return {
      statistics: []
    }
  },
  created() {
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
      // const promises = [
      //   this.$axios.$get(`/api/v1/practice/applied-jobs/count`),
      //   this.$axios.$get(`/api/v1/practice/current-jobs/count`),
      //   this.$axios.$get(`/api/v1/practice/available-jobs/count`)
      // ]
      // if (this.$auth.user.domain === 'Practice') {
      //   Promise.all(promises).then(res => {
      //     res.forEach(item => {
      //       this.statistics.push({ label})
      //     })
      //   })
      // }
    }

  }
}
</script>
