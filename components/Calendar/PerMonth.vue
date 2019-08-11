<template>
  <section class="per-month-section">
    <div class="flex flex-row flex-wrap justify-between mx-1">
      <div class="w-2/3 py-1 sm:w-1/3">
        <div
          class="text-xs sm:text-sm"
        >{{$store.state.calendar.months[selectedMonth]}} {{selectedYear}}</div>
      </div>
      <div class="w-1/3 py-1 flex flex-no-wrap justify-center">
        <span class="cursor-pointer" @click="adjustMonth('previous')">
          <svgicon name="arrow-left" height="12" width="12" />
        </span>
        <span class="mx-4"></span>
        <span class="cursor-pointer" @click="adjustMonth('next')">
          <svgicon name="arrow-right" height="12" width="12" />
        </span>
      </div>
      <div class="w-full text-right py-1 sm:w-1/3">
        <span
          class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
          :class="$store.state.calendar.view_type === 'per_month' ? 'py-1 px-3 bg-yellow-400':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_month')"
        >Month</span>
        <span
          class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
          :class="$store.state.calendar.view_type === 'per_week' ? 'py-1 px-3 bg-yellow-400':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_week')"
        >Week</span>
      </div>
    </div>
    <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-3 md:mt-5">
      <div class="w-full text-center text-grey font-bold">MON</div>
      <div class="w-full text-center text-grey font-bold">TUE</div>
      <div class="w-full text-center text-grey font-bold">WED</div>
      <div class="w-full text-center text-grey font-bold">THU</div>
      <div class="w-full text-center text-grey font-bold">FRI</div>
      <div class="w-full text-center text-grey font-bold">SAT</div>
      <div class="w-full text-center text-grey font-bold">SUN</div>
    </div>

    <div class="flex flex-no-wrap justify-between mx-1 mt-2 md:mt-5">
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-400 text-lg font-bold':'hover:bg-gray-200'"
            v-if="item.day === 1"
          >
            <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-400 text-lg font-bold':'hover:bg-gray-200'"
            v-if="item.day === 2"
          >
            <div class="text-xs md:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-400 text-lg font-bold':'hover:bg-gray-200'"
            v-if="item.day === 3"
          >
            <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-400 text-lg font-bold':'hover:bg-gray-200'"
            v-if="item.day === 4"
          >
            <div class="text-xs md:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-400 text-lg font-bold':'hover:bg-gray-200'"
            v-if="item.day === 5"
          >
            <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-400 text-lg font-bold':'hover:bg-gray-200'"
            v-if="item.day === 6"
          >
            <div class="text-xs md:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell :item="item" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-400 text-lg font-bold':'hover:bg-gray-200'"
            v-if="item.day === 0"
          >
            <div class="text-xs md:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell :item="item" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import PerMonthInfoDateCell from '@/components/Calendar/PerMonthInfoDateCell'
export default {
  components: {
    PerMonthInfoDateCell
  },
  data() {
    return {
      selectedMonth: null,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      startOfMonth: null,
      endOfMonth: null,
    }
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear)
    },
  },
  created() {
    let selectedDate = this.$store.state.calendar.selected_date
    this.startOfMonth = this.$moment(selectedDate).startOf('month').format('YYYY-MM-DD')
    this.endOfMonth = this.$moment(selectedDate).endOf('month').format('YYYY-MM-DD')
    let d = new Date(selectedDate)
    this.selectedMonth = d.getMonth()
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
    this.getJobs()
  },
  methods: {
    getJobs() {
      if (this.$auth.user.domain === 'Practice') {
        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: this.startOfMonth,
          date_end: this.endOfMonth,
          status: "Current"
        });

        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: this.startOfMonth,
          date_end: this.endOfMonth,
          status: "Applied"
        });

        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: this.startOfMonth,
          date_end: this.endOfMonth,
          status: "Unfilled"
        });

        this.$store.dispatch("jobs/fetchPracticeJobs", {
          data_start: this.startOfMonth,
          date_end: this.endOfMonth,
          status: "Declined"
        });

        this.$store.dispatch("jobs/fetchPracticeJobsReminder", {
          platform_selection_date_start: this.startOfMonth,
          platform_selection_date_end: this.endOfMonth,
          status: "Available"
        });

        this.$store.dispatch("jobs/fetchPracticeJobsReminder", {
          platform_selection_date_start: this.startOfMonth,
          platform_selection_date_end: this.endOfMonth,
          status: "Applied"
        });
      }
      if (this.$auth.user.domain === 'Locum') {
        this.$store.dispatch("jobs/fetchLocumJobs", {
          date_start: this.startOfMonth,
          date_end: this.endOfMonth,
          status: "Current"
        });

        this.$store.dispatch("jobs/fetchLocumJobs", {
          date_start: this.startOfMonth,
          date_end: this.endOfMonth,
          status: "Applied"
        });

        this.$store.dispatch("jobs/fetchLocumUnavailabilities", {
          date_start: this.startOfMonth,
          date_end: this.endOfMonth,
        });
      }
    },
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
          fullDate: this.$moment(day).format('YYYY-MM-DD')
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
      this.startOfMonth = this.$moment(`${this.selectedYear}-${this.selectedMonth + 1}`).startOf('month').format('YYYY-MM-DD')
      this.endOfMonth = this.$moment(`${this.selectedYear}-${this.selectedMonth + 1}`).endOf('month').format('YYYY-MM-DD')
      this.getJobs()
    }
  }
}
</script>