<template>
    <section>
        <div class="flex justify-start">
            <div style="width:40%">
                <div class="float-left">
                    {{from}} {{selectedYear}} - {{to}} {{selectedYear}}
                </div>
            </div>
            <div style="width:20%">
                <span class="cursor-pointer" @click="adjustWeek('previous')" v-text="'<'"></span>
                <span class="mx-4"></span>
                <span class="cursor-pointer" @click="adjustWeek('next')" v-text="'>'"></span>
            </div>
            <div style="width:30%">
                <div class="float-right">
                    <span class="cursor-pointer px-3 text-sm hover:underline" 
                        :class="$store.state.dashboard.appointments_tab === 'per_month' ? 'py-1 px-3 bg-yellow-dark':''"
                        @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_month')">Month</span>
                    <span class="cursor-pointer px-3 text-sm hover:underline" 
                        :class="$store.state.dashboard.appointments_tab === 'per_week' ? 'py-1 px-3 bg-yellow-dark':''"
                        @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_week')">Week</span>
                </div>
            </div>
        </div> 

        <div class="flex flex-no-wrap mx-5 mt-5">
            <div class="text-grey font-bold ml-1" style="width:100%"></div>
            <div class="text-grey font-bold ml-1" style="width:100%">SUN</div>
            <div class="text-grey font-bold ml-1" style="width:100%">MON</div>
            <div class="text-grey font-bold ml-1" style="width:100%">TUE</div>
            <div class="text-grey font-bold ml-1" style="width:100%">WED</div>
            <div class="text-grey font-bold ml-1" style="width:100%">THU</div>
            <div class="text-grey font-bold ml-1" style="width:100%">FRI</div>
            <div class="text-grey font-bold ml-1" style="width:100%">SAT</div>
        </div>

        <div class="flex flex-no-wrap mx-5 mt-2">
            <div class="text-grey font-bold ml-1" style="width:100%"></div>
            <div class="text-xl text-grey-darkest font-bold ml-1" style="width:100%" v-for="(date, index) in daysInWeek" :key="index">
                {{$moment(date).format('DD')}}
            </div>
        </div>  

        <div class="mt-5">
            <div class="flex flex-no-wrap mx-5">
                <div class="flex justify-center items-center text-sm" style="width:100%;height:50px;" v-if="true">AM</div>

                <template  v-for="(date, index) in daysInWeek">
                    <div class="border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('AM'))"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'AM'})"></div>
                    <div class="border-t-2 cursor-pointer bg-grey hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'AM'})"></div>
                    <div class="border-t-2 cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                         @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'AM'})"
                        v-else></div>
                </template>
                
                
                
            </div>
            <div class="flex flex-no-wrap mx-5">
                <div class="flex justify-center items-center text-sm" style="width:100%;height:50px;" v-if="true">PM</div>
               
                <template  v-for="(date, index) in daysInWeek">
                    <div class="border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('PM'))"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'PM'})"></div>
                    <div class="border-t-2 cursor-pointer bg-grey hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'PM'})"></div>
                    <div class="border-t-2 cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                         @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'PM'})"
                        v-else></div>
                </template>

            </div>
            <div class="flex flex-no-wrap mx-5">
                <div class="flex justify-center items-center text-sm" style="width:100%;height:50px;" v-if="true">Whole-day</div>

                 <template  v-for="(date, index) in daysInWeek">
                    <div class="border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('WHOLE DAY'))"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'WHOLE DAY'})"></div>
                    <div class="border-t-2 cursor-pointer bg-grey hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'WHOLE DAY'})"></div>
                    <div class="border-t-2 cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                         @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'WHOLE DAY'})"
                        v-else></div>
                </template>

            </div>
            <div class="flex flex-no-wrap mx-5">
                <div class="flex justify-center items-center text-sm" style="width:100%;height:50px;" v-if="true">OOH</div>
                
                 <template  v-for="(date, index) in daysInWeek">
                    <div class="border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('OOH'))"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'OOH'})"></div>
                    <div class="border-t-2 cursor-pointer bg-grey hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'OOH'})"></div>
                    <div class="border-t-2 cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                         @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'OOH'})"
                        v-else></div>
                </template>

            </div>
            <div class="flex flex-no-wrap mx-5">
                <div class="flex justify-center items-center text-sm" style="width:100%;height:50px;" v-if="true">Available</div>
                
                 <template  v-for="(date, index) in daysInWeek">
                    <div class="border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('Available'))"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"></div>
                    <div class="border-t-2 cursor-pointer bg-grey hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"></div>
                    <div class="border-t-2 cursor-pointer hover:bg-grey-light" style="width:100%;height:50px;" :key="index"
                        @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
                        v-else></div>
                </template>

            </div>
        </div>

    </section>
</template>
<script>
const shifts = [
    'AM', 'PM', 'Whole-day',
    'OOH', 'Available'
]
export default {
    data () {
        return {
            shifts,
            from: null,
            to: null,
            daysInWeek: [],
            selectedYear: new Date().getFullYear()
        }
    },
    computed: {
        notAvailableDates () {
            return this.$store.state.availability.notAvailableDates
        }
    },
    created () {
        this.getDaysInWeek()
    },
    methods: {
        adjustWeek(type) {
            if (type === 'next') {
                this.adjustDaysInWeek(this.$moment(this.daysInWeek[6]).add(1, 'days'))
            }
            if (type === 'previous') {
                this.adjustDaysInWeek(this.$moment(this.daysInWeek[0]).subtract(7, 'days'))
            }
        },
        adjustDaysInWeek (firstDay) {
            this.daysInWeek = []
            for (let i=0;i<7;i++) {
                this.daysInWeek.push(this.$moment(firstDay).add(i, 'days'))
            }
            this.getFromTo()
        },
        getDaysInWeek () {
            this.daysInWeek = []
            // get week day at current date
            let weekDay = new Date().getDay()
            // get the first day at the current week
            let firstDayInWeek = ''
            for (;weekDay>=0;weekDay--) {
                firstDayInWeek = this.$moment(new Date()).subtract(1, 'days')
            }
            // get all the days at the current week
            this.daysInWeek.push(firstDayInWeek)
            for (let i=0;i<6;i++) {
                this.daysInWeek.push(this.$moment(new Date()).add(i, 'days'))
            }
            this.getFromTo()
        },
        getFromTo () {
            this.from = this.$moment(this.daysInWeek[0]).format('MMM')
            this.to = this.$moment(this.daysInWeek[6]).format('MMM')
        }
    }
}
</script>

