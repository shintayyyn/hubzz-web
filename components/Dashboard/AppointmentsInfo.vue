<template>
    <div class="rounded-r-lg bg-grey-darkest px-6 py-8" style="height:100%">
        <div class="text-white">
            {{$store.state.dashboard.select_date ? $moment($store.state.dashboard.select_date).format('Do MMMM, YYYY') : $moment($store.state.dateToday).format('Do MMMM, YYYY')}}
        </div>

        <template v-if="$store.state.dashboard.appointments_tab === 'per_month'">
            <transition-group name="slide-info" mode="out-in">
                <div class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card" v-if="appointmentDates" key="appointment">
                    <div class="absolute pin-l pin-t rounded-l-lg p-2 h-full"
                        :class="checkShift(appointmentDates.shifts[0])"></div>
                    <div class="ml-2">
                        <div class="text-grey-dark text-xs">Job Number here:</div>
                        <div class="my-3 font-bold text-md">Private appointment</div>
                        <div class="my-3 text-md">Practice name here</div>
                        <div class="my-3 text-md">Practice address here</div>
                        <div class="text-xs text-grey-dark mt-1">
                            From {{$moment(appointmentDates.date).format('DD/MM/YYYY')}} to {{$moment(appointmentDates.date).format('DD/MM/YYYY')}}
                        </div>
                        <div class="text-xs text-grey-dark mt-1">Shift: {{appointmentDates.shifts[0]}}</div>
                    </div>
                </div>
                <div class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card" v-if="unavailable" key="available">
                    <div class="absolute pin-l pin-t bg-pink-light rounded-l-lg p-2 h-full"></div>
                    <div class="ml-2">
                        <div class="font-bold text-sm">Unavailable</div>
                        <div class="text-xs mt-1">Shifts: {{unavailable.join(',')}}</div>
                    </div>
                </div>
                // ! fix later
                <div v-if="false" key="unavailable">
                   <div class="text-white text-sm mt-10">No Jobs to display.</div>
                </div>
            </transition-group>
        </template>

        <template v-if="$store.state.dashboard.appointments_tab === 'per_week'">
            <transition-group name="slide-info" mode="out-in">
                <div class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card" v-if="appointmentDatesOnWeek" key="appointment">
                    <div class="absolute pin-l pin-t rounded-l-lg p-2 h-full"
                        :class="checkShift(appointmentDatesOnWeek.shifts[0])"></div>
                    <div class="ml-2">
                        <div class="text-grey-dark text-xs">Job Number here:</div>
                        <div class="my-3 font-bold text-md">Private appointment</div>
                        <div class="my-3 text-md">Practice name here</div>
                        <div class="my-3 text-md">Practice address here</div>
                        <div class="text-xs text-grey-dark mt-1">
                            From {{$moment(appointmentDatesOnWeek.date).format('DD/MM/YYYY')}} to {{$moment(appointmentDatesOnWeek.date).format('DD/MM/YYYY')}}
                        </div>
                        <div class="text-xs text-grey-dark mt-1">Shift: {{appointmentDatesOnWeek.shifts[0]}}</div>
                    </div>
                </div>

                <div class="mt-8 relative rounded-lg py-3 px-5 bg-white info-card" v-if="unavailableOnWeek" key="available">
                    <div class="absolute pin-l pin-t bg-pink-light rounded-l-lg p-2 h-full"></div>
                    <div class="ml-2">
                        <div class="font-bold text-sm">Unavailable</div>
                        <div class="text-xs mt-1">Shifts: {{unavailableOnWeek}}</div>
                    </div>
                </div>

                 <div v-if="false" key="unavailable">
                   <div class="text-white text-sm mt-10">No Jobs to display.</div>
               </div>
            </transition-group>
        </template>
        
    </div>
</template>
<script>
export default {
    computed: {
        selectedDate () {
            return this.$moment(this.$store.state.dashboard.select_date).format('LL')
        },
        appointmentDates () {
            return this.$store.state.dashboard.appointmentDates.find(date => date.date === this.selectedDate)
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
        appointmentDatesOnWeek () {
            return this.$store.state.dashboard.appointmentDates.find(data => data.date === this.selectedWeekDate)
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
    },
    methods: {
        checkShift (type) {
            if (type === 'AM') {
                return 'bg-yellow'
            }
            if (type === 'PM') {
                return 'bg-blue-light'
            }
            if (type === 'WHOLE DAY') {
                return 'bg-green-light'
            }
            if (type === 'OOH') {
                return 'bg-orange'
            }
        }
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


