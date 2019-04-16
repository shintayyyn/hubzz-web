<template>
    <div class="flex-none p-5 w-full">
        <div class="border border-solid rounded-lg shadow-md" style="height:500px;">

            <div class="flex flex-no-wrap w-full h-full">
                <div :class="$store.state.mobile ? 'w-full': 'w-3/4'" class="p-5">
                    <PerMonth v-if="$store.state.dashboard.appointments_tab === 'per_month'"/>
                    <PerWeek v-if="$store.state.dashboard.appointments_tab === 'per_week'"/>
                    <div class="float-right">
                        <div class="rounded-full h-16 w-16 flex items-center justify-center bg-yellow-dark font-semibold text-xl cursor-pointer shadow-md hover:text-white"
                            @click="$store.commit('TOGGLE_APPOINTMENT_MODAL', true)">
                            +
                        </div>
                    </div>
                </div>
                <div :class="$store.state.mobile ? 'hidden': 'w-1/4'">
                    <AppointmentsInfo />
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

