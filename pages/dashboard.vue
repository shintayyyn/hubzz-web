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
}
</script>
<style scoped>
.dashboard-section {
  height: auto;
  width: 100%;
}
</style>

