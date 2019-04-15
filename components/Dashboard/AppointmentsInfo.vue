<template>
    <div class="rounded-r-lg bg-grey-darkest px-6 py-8" style="height:100%">
        <div class="text-white">
            {{$store.state.dashboard.select_date ? $moment($store.state.dashboard.select_date).format('Do MMMM, YYYY') : $moment($store.state.dateToday).format('Do MMMM, YYYY')}}
        </div>
        <div class="mt-8 relative rounded-lg py-3 px-5 bg-white" v-if="unavailable">
            <div class="absolute pin-l pin-t bg-pink-light rounded-l-lg p-2 h-full"></div>
            <div class="ml-2">
                <div class="font-bold text-sm">Unavailable</div>
                <div class="text-xs mt-1">Shifts: {{unavailable.join(',')}}</div>
                <div>{{unavailable}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
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
        }
    },
    created () {
        console.log(this.selectedDate)
        console.log(this.notAvailableDates)
    }
}
</script>

