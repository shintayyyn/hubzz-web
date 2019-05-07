<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1">
      <div class="w-1/2 lg:w-1/3 text-left">
        <div class="text-xs lg:text-base">{{from}} {{selectedYear}} - {{to}} {{selectedYear}}</div>
      </div>
      <div class="w-1/2 text-right lg:w-1/3 lg:text-center">
        <span class="cursor-pointer" @click="adjustWeek('previous')">
          <svgicon name="arrow-left" height="15" width="15"/>
        </span>
        <span class="mx-4"></span>
        <span class="cursor-pointer" @click="adjustWeek('next')">
          <svgicon name="arrow-right" height="15" width="15"/>
        </span>
      </div>
      <div class="w-full lg:w-1/3 text-right">
        <span
          class="cursor-pointer px-3 text-xs lg:text-base hover:underline"
          :class="$store.state.dashboard.appointments_tab === 'per_month' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_month')"
        >Month</span>
        <span
          class="cursor-pointer px-3 text-xs lg:text-base hover:underline"
          :class="$store.state.dashboard.appointments_tab === 'per_week' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_week')"
        >Week</span>
      </div>
    </div>

    <div class="flex flex-no-wrap mx-1 mt-5 text-xs lg:text-base">
      <div class="w-full text-center text-grey font-bold"></div>
      <div class="w-full text-center text-grey font-bold">SUN</div>
      <div class="w-full text-center text-grey font-bold">MON</div>
      <div class="w-full text-center text-grey font-bold">TUE</div>
      <div class="w-full text-center text-grey font-bold">WED</div>
      <div class="w-full text-center text-grey font-bold">THU</div>
      <div class="w-full text-center text-grey font-bold">FRI</div>
      <div class="w-full text-center text-grey font-bold">SAT</div>
    </div>

    <div class="flex flex-no-wrap mx-1 mt-5 text-xs lg:text-base">
      <div class="w-full text-center text-grey-darkest"></div>
      <div
        class="w-full text-center text-grey-darkest"
        v-for="(date, index) in daysInWeek"
        :key="index"
      >{{$moment(date).format('DD')}}</div>
    </div>

    <div class="flex flex-no-wrap mx-1 mt-5 text-xs lg:text-base">
      <div class="w-full" style="min-height:50px;">AM</div>

      <template v-for="(date, index) in daysInWeek">
        <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('AM'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'AM'})"
        ></div>
        <div
          class="w-full border-r-2 border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          :class="checkShift(appointmentDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('AM')))"
          v-else-if="appointmentDates.find(item => item.date === $moment(date).format('LL'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'AM'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer bg-grey hover:bg-grey-light"
          :key="index"
          v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'AM'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'AM'})"
          v-else
        ></div>
      </template>
    </div>

    <div class="flex flex-no-wrap mx-1 text-xs lg:text-base">
      <div class="w-full" style="min-height:50px;" v-if="true">PM</div>

      <template v-for="(date, index) in daysInWeek">
        <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('PM'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'PM'})"
        ></div>
        <div
          class="w-full border-r-2 border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          :class="checkShift(appointmentDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('PM')))"
          v-else-if="appointmentDates.find(item => item.date === $moment(date).format('LL'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer bg-grey hover:bg-grey-light"
          :key="index"
          v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'PM'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'PM'})"
          v-else
        ></div>
      </template>
    </div>
    <div class="flex flex-no-wrap mx-1 text-xs lg:text-base">
      <div class="w-full" style="min-height:50px;" v-if="true">Whole-day</div>

      <template v-for="(date, index) in daysInWeek">
        <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('WHOLE DAY'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'WHOLE DAY'})"
        ></div>
        <div
          class="w-full border-r-2 border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          :class="checkShift(appointmentDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('WHOLE DAY')))"
          v-else-if="appointmentDates.find(item => item.date === $moment(date).format('LL'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer bg-grey hover:bg-grey-light"
          :key="index"
          v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'WHOLE DAY'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'WHOLE DAY'})"
          v-else
        ></div>
      </template>
    </div>
    <div class="flex flex-no-wrap mx-1 text-xs lg:text-base">
      <div class="w-full" style="min-height:50px;" v-if="true">OOH</div>

      <template v-for="(date, index) in daysInWeek">
        <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('OOH'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'OOH'})"
        ></div>
        <div
          class="w-full border-r-2 border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          :class="checkShift(appointmentDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('OOH')))"
          v-else-if="appointmentDates.find(item => item.date === $moment(date).format('LL'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer bg-grey hover:bg-grey-light"
          :key="index"
          v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'OOH'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'OOH'})"
          v-else
        ></div>
      </template>
    </div>
    <div class="flex flex-no-wrap mx-1 text-xs lg:text-base">
      <div class="w-full" style="min-height:50px;" v-if="true">Available</div>

      <template v-for="(date, index) in daysInWeek">
        <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('Available'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
        ></div>
        <div
          class="w-full border-r-2 border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          :class="checkShift(appointmentDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('Available')))"
          v-else-if="appointmentDates.find(item => item.date === $moment(date).format('LL'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer bg-grey hover:bg-grey-light"
          :key="index"
          v-else-if="$moment(date).format('LL') === $moment(new Date()).format('LL')"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
        ></div>
        <div
          class="w-full border-t-2 cursor-pointer hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: date._d, type: 'Available'})"
          v-else
        ></div>
      </template>
    </div>
  </section>
</template>
<script>
const shifts = [
  'AM', 'PM', 'Whole-day',
  'OOH', 'Available'
]
export default {
  data() {
    return {
      shifts,
      from: null,
      to: null,
      daysInWeek: [],
      selectedYear: new Date().getFullYear()
    }
  },
  computed: {
    notAvailableDates() {
      return this.$store.state.availability.notAvailableDates
    },
    appointmentDates() {
      return this.$store.state.dashboard.appointmentDates
    }
  },
  created() {
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
    adjustDaysInWeek(firstDay) {
      this.daysInWeek = []
      for (let i = 0; i < 7; i++) {
        this.daysInWeek.push(this.$moment(firstDay).add(i, 'days'))
      }
      this.getFromTo()
    },
    getDaysInWeek() {
      this.daysInWeek = []
      // get week day at current date
      let weekDay = new Date().getDay()
      // get the first day at the current week
      let firstDayInWeek = ''
      for (; weekDay >= 0; weekDay--) {
        firstDayInWeek = this.$moment(new Date()).subtract(1, 'days')
      }
      // get all the days at the current week
      this.daysInWeek.push(firstDayInWeek)
      for (let i = 0; i < 6; i++) {
        this.daysInWeek.push(this.$moment(new Date()).add(i, 'days'))
      }
      this.getFromTo()
    },
    getFromTo() {
      this.from = this.$moment(this.daysInWeek[0]).format('MMM')
      this.to = this.$moment(this.daysInWeek[6]).format('MMM')
    },
    checkShift(item) {
      if (item && item.shifts.length) {
        let type = item.shifts[0]
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
}
</script>

