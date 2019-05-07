<template>
  <div class="flex-none p-5 w-full">
    <div class="border border-solid rounded-lg shadow-md">
      <div class="flex flex-no-wrap w-full" style="height:500px">
        <div class="relative py-5 px-2 w-full sm:w-1/2 lg:w-3/4">
          <PerMonth v-if="$store.state.dashboard.appointments_tab === 'per_month'"/>
          <PerWeek v-if="$store.state.dashboard.appointments_tab === 'per_week'"/>
          <div class="absolute pin-b pin-r m-5">
            <div
              class="rounded-full h-10 w-10 lg:h-16 lg:w-16 flex items-center focus:outline-none justify-center bg-yellow-dark font-semibold text-xl cursor-pointer shadow-md hover:text-white"
              @click="$store.commit('TOGGLE_APPOINTMENT_MODAL', true)"
            >+</div>
          </div>
        </div>
        <div class="hidden sm:w-1/2 sm:block lg:w-1/2 lg:block xl:max-w-sm">
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
  },
  mounted() {
    // get all appointment dates
    // get all not available dates
    // set it to store
  }
}
</script>

