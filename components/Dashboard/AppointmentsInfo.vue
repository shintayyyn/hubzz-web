<template>
    <div class="rounded-r-lg bg-grey-darkest px-6 py-8" style="height:100%">
        <div class="text-white">
            {{$store.state.dashboard.select_date ? $moment($store.state.dashboard.select_date).format('Do MMMM, YYYY') : $moment($store.state.dateToday).format('Do MMMM, YYYY')}}
        </div>

        <template v-if="$store.state.dashboard.appointments_tab === 'per_month'">
            <transition name="slide-info" mode="out-in">
                <div class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card" v-if="unavailable" key="available">
                    <div class="absolute pin-l pin-t bg-pink-light rounded-l-lg p-2 h-full"></div>
                    <div class="ml-2">
                        <div class="font-bold text-sm">Unavailable</div>
                        <div class="text-xs mt-1">Shifts: {{unavailable.join(',')}}</div>
                    </div>
                </div>
                 <div v-else key="unavailable">
                   <div class="text-white text-sm mt-10">No Jobs to display.</div>
               </div>
            </transition>
        </template>

        <template v-if="$store.state.dashboard.appointments_tab === 'per_week'">
            <transition name="slide-info" mode="out-in">
                <div class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card" v-if="unavailableOnWeek" key="available">
                    <div class="absolute pin-l pin-t bg-pink-light rounded-l-lg p-2 h-full"></div>
                    <div class="ml-2">
                        <div class="font-bold text-sm">Unavailable</div>
                        <div class="text-xs mt-1">Shifts: {{unavailableOnWeek}}</div>
                    </div>
                </div>
                 <div v-else key="unavailable">
                   <div class="text-white text-sm mt-10">No Jobs to display.</div>
               </div>
            </transition>
        </template>
        
    </div>
</template>
<script>
export default {
    computed: {
        selectedDate () {
            return this.$moment(this.$store.state.dashboard.select_date).format('LL')
        },
        notAvailableDates () {
            return this.$store.state.availability.notAvailableDates
        },
        unavailable () {
            let unavailable = this.notAvailableDates.find(date => date.date === this.selectedDate)
            if (!unavailable) {
                return null
            }
            return unavailable.shifts
        },
        selectedWeekDate () {
            return this.$moment(this.$store.state.dashboard.week_date).format('LL')
        },
        selectedWeekDateType () {
            return this.$store.state.dashboard.week_date_type
        },
        unavailableOnWeek () {
            let unavailableOnWeek = this.notAvailableDates.find(data => data.date === this.selectedWeekDate && data.shifts.includes(this.selectedWeekDateType))
            if (!unavailableOnWeek) {
                return null
            }
            return unavailableOnWeek.shifts.find(item => item === this.selectedWeekDateType)
        }
    },
    created () {
        // ! work on unavailable shifts arrangement
    }
}
</script>
<style scoped>
.slide-info-enter-active, .slide-info-leave-active {
  transition: all .1s ease-in-out;
}
.slide-info-enter, .slide-info-leave-to {
  transform: translateX(10px)
}
</style>


