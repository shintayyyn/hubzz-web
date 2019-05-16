<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1">
      <div class="w-1/2 xl:w-1/3 text-left">
        <div
          class="text-xs lg:text-base"
        >{{$store.state.dashboard.months[selectedMonth]}} {{selectedYear}}</div>
      </div>
      <div class="w-1/2 text-right xl:w-1/3 xl:text-center">
        <span class="cursor-pointer" @click="adjustMonth('previous')">
          <svgicon name="arrow-left" height="15" width="15"/>
        </span>
        <span class="mx-4"></span>
        <span class="cursor-pointer" @click="adjustMonth('next')">
          <svgicon name="arrow-right" height="15" width="15"/>
        </span>
      </div>
      <div class="w-full xl:w-1/3 text-right">
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
      <div class="w-full text-center text-grey font-bold">SUN</div>
      <div class="w-full text-center text-grey font-bold">MON</div>
      <div class="w-full text-center text-grey font-bold">TUE</div>
      <div class="w-full text-center text-grey font-bold">WED</div>
      <div class="w-full text-center text-grey font-bold">THU</div>
      <div class="w-full text-center text-grey font-bold">FRI</div>
      <div class="w-full text-center text-grey font-bold">SAT</div>
    </div>

    <div class="flex flex-no-wrap mx-1 mt-5">
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 7">
          <div class="m-1 h-8 w-auto lg:h-12">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 w-auto lg:h-12"
            :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 0"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell
              :unavailableDates="unavailableDates"
              :appointmentDates="appointmentDates"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
          <div class="m-1 h-8 w-auto lg:h-12">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 w-auto lg:h-12"
            :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 1"
          >
            <div class="text-xs lg:text-base z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :unavailableDates="unavailableDates"
              :appointmentDates="appointmentDates"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
          <div class="m-1 h-8 w-auto lg:h-12">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 w-auto lg:h-12"
            :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 2"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell
              :unavailableDates="unavailableDates"
              :appointmentDates="appointmentDates"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
          <div class="m-1 h-8 w-auto lg:h-12">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 w-auto lg:h-12"
            :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 3"
          >
            <div class="text-xs lg:text-base z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :unavailableDates="unavailableDates"
              :appointmentDates="appointmentDates"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
          <div class="m-1 h-8 w-auto lg:h-12">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 w-auto lg:h-12"
            :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 4"
          >
            <div class="text-xs lg:text-base z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell
              :unavailableDates="unavailableDates"
              :appointmentDates="appointmentDates"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
          <div class="m-1 h-8 w-auto lg:h-12">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 w-auto lg:h-12"
            :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 5"
          >
            <div class="text-xs lg:text-base z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :unavailableDates="unavailableDates"
              :appointmentDates="appointmentDates"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
          <div class="m-1 h-8 w-auto lg:h-12">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 w-auto lg:h-12"
            :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 6"
          >
            <div class="text-xs lg:text-base z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :unavailableDates="unavailableDates"
              :appointmentDates="appointmentDates"
              :item="item"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import PerMonthInfoDateCell from '@/components/Dashboard/AppointmentTabs/PerMonthInfoDateCell'
export default {
  components: {
    PerMonthInfoDateCell
  },
  data() {
    return {
      selectedMonth: null,
      selectedYear: new Date().getFullYear(),
      daysInMonth: []
    }
  },
  computed: {
    dateToday() {
      return this.$store.state.dateToday
    },
    unavailableDates() {
      return this.$store.state.availability.unavailableDates
    },
    appointmentDates() {
      return this.$store.state.dashboard.appointmentDates
    }
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear)
    }
  },
  mounted() {
    // dispatch the appointment dates from store/api
    // set it to store

    // get current month and year
    let d = new Date()
    this.selectedMonth = d.getMonth()

    // get days in current month
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
  },
  methods: {
    getDaysInMonth(month, selectedYear) {
      let date = new Date(selectedYear, month, 1);
      let days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      let daysInMonth = []
      days.forEach(day => {
        daysInMonth.push({
          day: day.getDay(),
          date: day.getDate(),
          fullDate: this.$moment(new Date(day.getFullYear(), day.getMonth(), day.getDate()).toDateString())._d
        })
      })
      this.daysInMonth = daysInMonth
    },
    adjustMonth(type) {
      if (type === 'previous') {
        if (this.selectedMonth === 0) {
          this.selectedMonth = 11
          this.selectedYear--
        } else {
          this.selectedMonth--
        }
      }
      if (type === 'next') {
        if (this.selectedMonth === 11) {
          this.selectedMonth = 0
          this.selectedYear++
        } else {
          this.selectedMonth++
        }
      }
    }
  }
}
</script>

