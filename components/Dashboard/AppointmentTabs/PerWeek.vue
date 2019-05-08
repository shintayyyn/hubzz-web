<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1">
      <div class="w-1/2 lg:w-1/3 text-left">
        <div class="text-xs xl:text-base">{{from}} {{selectedYear}} - {{to}} {{selectedYear}}</div>
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
          class="cursor-pointer px-3 text-xs xl:text-base hover:underline"
          :class="$store.state.dashboard.appointments_tab === 'per_month' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_month')"
        >Month</span>
        <span
          class="cursor-pointer px-3 text-xs xl:text-base hover:underline"
          :class="$store.state.dashboard.appointments_tab === 'per_week' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_week')"
        >Week</span>
      </div>
    </div>

    <div class="flex flex-no-wrap mx-1 mt-5 text-xs xl:text-base">
      <div class="w-full text-center text-grey font-bold"></div>
      <div class="w-1/2 lg:w-full text-center text-grey font-bold">SUN</div>
      <div class="w-1/2 lg:w-full text-center text-grey font-bold">MON</div>
      <div class="w-1/2 lg:w-full text-center text-grey font-bold">TUE</div>
      <div class="w-1/2 lg:w-full text-center text-grey font-bold">WED</div>
      <div class="w-1/2 lg:w-full text-center text-grey font-bold">THU</div>
      <div class="w-1/2 lg:w-full text-center text-grey font-bold">FRI</div>
      <div class="w-1/2 lg:w-full text-center text-grey font-bold">SAT</div>
    </div>

    <div class="flex flex-no-wrap mx-1 mt-5 text-xs xl:text-base">
      <div class="w-full text-center text-grey-darkest"></div>
      <div
        class="w-1/2 lg:w-full text-center text-grey-darkest"
        v-for="(date, index) in daysInWeek"
        :key="index"
      >{{$moment(date).format('DD')}}</div>
    </div>

    <div class="flex flex-no-wrap mx-1 mt-5 text-xs xl:text-base" style="height:50px;">
      <div class="w-full">AM</div>

      <template v-for="(date, index) in daysInWeek">
        <!-- <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('AM'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'AM'})"
        ></div>-->
        <div
          v-if="hasAppointment(date, 'AM')"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-yellow hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'AM'})"
        ></div>
        <div
          v-else-if="isToday(date)"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-grey-light hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'AM'})"
        ></div>
        <div
          v-else
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'AM'})"
        ></div>
      </template>
    </div>
    <div class="flex flex-no-wrap mx-1 text-xs xl:text-base" style="height:50px;">
      <div class="w-full">PM</div>

      <template v-for="(date, index) in daysInWeek">
        <!-- <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('PM'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'PM'})"
        ></div>-->
        <div
          v-if="hasAppointment(date, 'PM')"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-blue-light hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'PM'})"
        ></div>
        <div
          v-else-if="isToday(date)"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-grey-light hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'PM'})"
        ></div>
        <div
          v-else
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'PM'})"
        ></div>
      </template>
    </div>
    <div class="flex flex-no-wrap mx-1 text-xs xl:text-base" style="height:50px;">
      <div class="w-full">Whole-day</div>

      <template v-for="(date, index) in daysInWeek">
        <!-- <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('WHOLE DAY'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'WHOLE DAY'})"
        ></div>-->
        <div
          v-if="hasAppointment(date, 'WHOLE DAY')"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'WHOLE DAY'})"
        ></div>
        <div
          v-else-if="isToday(date)"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-grey-light hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'WHOLE DAY'})"
        ></div>
        <div
          v-else
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'WHOLE DAY'})"
        ></div>
      </template>
    </div>
    <div class="flex flex-no-wrap mx-1 text-xs xl:text-base" style="height:50px;">
      <div class="w-full">OOH</div>

      <template v-for="(date, index) in daysInWeek">
        <!-- <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('OOH'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'OOH'})"
        ></div>-->
        <div
          v-if="hasAppointment(date, 'OOH')"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-orange hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'OOH'})"
        ></div>
        <div
          v-else-if="isToday(date)"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-grey-light hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'OOH'})"
        ></div>
        <div
          v-else
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'OOH'})"
        ></div>
      </template>
    </div>
    <div class="flex flex-no-wrap mx-1 text-xs xl:text-base" style="height:50px;">
      <div class="w-full">Available</div>
      <template v-for="(date, index) in daysInWeek">
        <!-- <div
          class="w-full border-r-2 border-t-2 bg-pink-light cursor-pointer hover:bg-grey-light"
          :key="index"
          v-if="notAvailableDates.find(item => item.date === $moment(date).format('LL') && item.shifts.includes('Available'))"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'Available'})"
        ></div>-->
        <div
          v-if="hasAppointment(date, 'Available')"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-orange hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'Available'})"
        ></div>
        <div
          v-else-if="isToday(date)"
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey bg-grey-light hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'Available'})"
        ></div>
        <div
          v-else
          class="w-1/2 lg:w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="$store.commit('dashboard/SELECT_WEEK_DATE', {date: $moment(date).format('YYYY-MM-DD'), type: 'Available'})"
        ></div>
      </template>
    </div>
  </section>
</template>
<script>
import PerWeekInfoDateCell from '@/components/Dashboard/AppointmentTabs/PerWeekInfoDateCell'
export default {
  components: {
    PerWeekInfoDateCell
  },
  data() {
    return {
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
    },
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
    hasAppointment(date, shift) {
      return this.appointmentDates.find(appointment => this.getDateArray(appointment.from, appointment.to).includes(this.$moment(date).format('YYYY-MM-DD')) && appointment.shifts === shift)
    },
    isToday(date) {
      if (this.$moment(date).format('YYYY-MM-DD') === this.$moment(new Date()).format('YYYY-MM-DD')) {
        return true
      } else {
        return false
      }
    },
    getDateArray(start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
        arr.push(this.$moment(new Date(dt)).format('YYYY-MM-DD'));
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    },
  }
}
</script>

