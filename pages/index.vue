<template>
  <section class="dashboard-section px-10">
    <div class="font-bold items-start" style="font-family:Nunito">Reminders</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div v-for="(item, index) in $store.state.dashboard.reminders" :key="`${item.type}-${index}`">
        <Reminders v-if="!item.done">
          <span>
            <strong>{{item.type}}</strong>
            details
          </span>
        </Reminders>
      </div>
    </div>
    <div class="font-bold" style="font-family:Nunito">Appointments</div>
    <div class="flex flex-row flex-no-wrap justify-start">
      <Appointments/>
    </div>
    <div class="font-bold" style="font-family:Nunito">Quick Statistics</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div
        v-for="(item, index) in $store.state.dashboard.statistics"
        :key="`${item.jobs}-${index}`"
      >
        <Statistics>
          <template v-slot:jobs>
            <span>{{item.jobs}}</span>
          </template>
          <template v-slot:total>
            <span>{{item.total}}</span>
          </template>
        </Statistics>
      </div>
    </div>
  </section>
</template>

<script>
import Reminders from '@/components/Dashboard/Reminders'
import Appointments from '@/components/Dashboard/Appointments'
import Statistics from '@/components/Dashboard/Statistics'
export default {
  components: {
    Reminders,
    Appointments,
    Statistics
  }
}
</script>
