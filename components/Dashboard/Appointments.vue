<template>
  <div class="flex-none p-5 w-full">
    <div class="border border-solid rounded-lg shadow-md">
      <div class="flex flex-no-wrap w-full h-full" style="height:500px">
        <div :class="$store.state.mobile ? 'w-full': 'w-3/4'" class="relative py-5 px-2">
          <PerMonth v-if="$store.state.dashboard.appointments_tab === 'per_month'"/>
          <PerWeek v-if="$store.state.dashboard.appointments_tab === 'per_week'"/>
          <div class="absolute pin-b pin-r m-5">
            <div
              class="rounded-full h-10 w-10 lg:h-16 lg:w-16 flex items-center focus:outline-none justify-center bg-yellow-dark font-semibold text-xl cursor-pointer shadow-md hover:text-white"
              @click="$store.commit('TOGGLE_APPOINTMENT_MODAL', true)"
            >+</div>
          </div>
        </div>
        <div :class="$store.state.mobile ? 'hidden': 'w-1/4'">
          <AppointmentsInfo/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PerMonth from '@/components/Dashboard/AppointmentTabs/PerMonth'
import PerWeek from '@/components/Dashboard/AppointmentTabs/PerWeek'
import AppointmentsInfo from '@/components/Dashboard/AppointmentsInfo'
export default {
  components: {
    PerMonth,
    PerWeek,
    AppointmentsInfo
  }
}
</script>

