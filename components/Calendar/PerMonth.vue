<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1 pt-5 px-5">
      <div class="w-1/2 xl:w-1/3 text-left">
        <div
          class="text-xs lg:text-base"
        >{{$store.state.calendar.months[selectedMonth]}} {{selectedYear}}</div>
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
      <div class="w-full mt-2 xl:mt-0 xl:w-1/3 text-right">
        <span
          class="cursor-pointer px-3 text-xs lg:text-base hover:underline"
          :class="$store.state.calendar.view_type === 'per_month' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_month')"
        >Month</span>
        <span
          class="cursor-pointer px-3 text-xs lg:text-base hover:underline"
          :class="$store.state.calendar.view_type === 'per_week' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_week')"
        >Week</span>
      </div>
    </div>
    <div class="flex flex-nowrap justify-between text-xs lg:text-base mx-1 mt-5 px-5">
      <div class="w-full text-center text-grey font-bold">SUN</div>
      <div class="w-full text-center text-grey font-bold">MON</div>
      <div class="w-full text-center text-grey font-bold">TUE</div>
      <div class="w-full text-center text-grey font-bold">WED</div>
      <div class="w-full text-center text-grey font-bold">THU</div>
      <div class="w-full text-center text-grey font-bold">FRI</div>
      <div class="w-full text-center text-grey font-bold">SAT</div>
    </div>

    <div class="flex flex-nowrap justify-between mx-1 mt-5 px-5">
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 7">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 0"
          >
            <div class="text-xs lg:text-sm z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell
              :jobs="jobs"
              :applied_jobs="applied_jobs_with_selection_date"
              :unfilled_jobs="unfilled_jobs"
              :declined_jobs="declined_jobs"
              :locum_jobs="locum_jobs"
              :unavailabilities="unavailabilities"
              :item="item"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
          <div class="m-1 h-8 sm:h-12 md:h-16 lg:h-20 w-auto">&nbsp;</div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            class="relative border border-solid rounded-lg m-1 cursor-pointer flex justify-center items-center h-8 sm:h-12 md:h-16 lg:h-20 w-auto"
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 1"
          >
            <div class="text-xs lg:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :jobs="jobs"
              :applied_jobs="applied_jobs_with_selection_date"
              :unfilled_jobs="unfilled_jobs"
              :declined_jobs="declined_jobs"
              :locum_jobs="locum_jobs"
              :unavailabilities="unavailabilities"
              :item="item"
            />
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
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 2"
          >
            <div class="text-xs lg:text-sm z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell
              :jobs="jobs"
              :applied_jobs="applied_jobs_with_selection_date"
              :unfilled_jobs="unfilled_jobs"
              :declined_jobs="declined_jobs"
              :locum_jobs="locum_jobs"
              :unavailabilities="unavailabilities"
              :item="item"
            />
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
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 3"
          >
            <div class="text-xs lg:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :jobs="jobs"
              :applied_jobs="applied_jobs_with_selection_date"
              :unfilled_jobs="unfilled_jobs"
              :declined_jobs="declined_jobs"
              :locum_jobs="locum_jobs"
              :unavailabilities="unavailabilities"
              :item="item"
            />
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
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 4"
          >
            <div class="text-xs lg:text-sm z-10">{{(item.date)}}</div>
            <PerMonthInfoDateCell
              :jobs="jobs"
              :applied_jobs="applied_jobs_with_selection_date"
              :unfilled_jobs="unfilled_jobs"
              :declined_jobs="declined_jobs"
              :locum_jobs="locum_jobs"
              :unavailabilities="unavailabilities"
              :item="item"
            />
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
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 5"
          >
            <div class="text-xs lg:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :jobs="jobs"
              :applied_jobs="applied_jobs_with_selection_date"
              :unfilled_jobs="unfilled_jobs"
              :declined_jobs="declined_jobs"
              :locum_jobs="locum_jobs"
              :unavailabilities="unavailabilities"
              :item="item"
            />
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
            :class="$store.state.calendar.date_today === item.fullDate ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
            v-if="item.day === 6"
          >
            <div class="text-xs lg:text-sm z-10">{{item.date}}</div>
            <PerMonthInfoDateCell
              :jobs="jobs"
              :applied_jobs="applied_jobs_with_selection_date"
              :unfilled_jobs="unfilled_jobs"
              :declined_jobs="declined_jobs"
              :locum_jobs="locum_jobs"
              :unavailabilities="unavailabilities"
              :item="item"
            />
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
      // practice
      jobs: [],
      applied_jobs_with_selection_date: [],
      unfilled_jobs: [],
      declined_jobs: [],
      // locum
      locum_jobs: [],
      unavailabilities: []
    }
  },

  computed: {
    // locum
    // unavailableDates() {
    //   return this.$store.state.availability.unavailableDates
    // },
    // appointmentDates() {
    //   return this.$store.state.dashboard.appointmentDates
    // }
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear)
    }
  },
  created() {
    // get current month and year
    let d = new Date()
    this.selectedMonth = d.getMonth()

    // get days in current month
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)

    // get jobs
    this.getJobs()
  },
  methods: {
    getJobs() {
      if (this.$auth.user.domain === 'Practice') {
        // live(color code per shift), applied(amber), current(green), unfilled(red)
        this.$axios.$get(`/api/v1/practice/calendars/monthly/${this.selectedYear}/${this.selectedMonth + 1}`).then(res => {
          // get jobs (green)
          if (res.data.jobs && res.data.jobs.length > 0) {
            this.jobs = res.data.jobs
            this.$store.commit('calendar/SET_JOBS', res.data.jobs)
          }
          // applied jobs with selection date (grey / reminders)
          if (res.data.applied_jobs_with_selection_date && res.data.applied_jobs_with_selection_date.length > 0) {
            this.applied_jobs_with_selection_date = res.data.applied_jobs_with_selection_date
            this.$store.commit('calendar/SET_APPLIED_JOBS', res.data.applied_jobs_with_selection_date)
          }
          // unfilled job (red)
          if (res.data.unfilled_jobs && res.data.unfilled_jobs.length > 0) {
            this.unfilled_jobs = res.data.unfilled_jobs
            this.$store.commit('calendar/SET_UNFILLED_JOBS', res.data.unfilled_jobs)
          }
          // decline jobs (red)
          if (res.data.declined_jobs && res.data.declined_jobs.length > 0) {
            this.declined_jobs = res.data.declined_jobs
            this.$store.commit('calendar/SET_DECLINED_JOBS', res.data.declined_jobs)
          }
        })
        return
      }
      if (this.$auth.user.domain === 'Locum') {
        this.$axios.$get(`/api/v1/locum/calendars/monthly/${this.selectedYear}/${this.selectedMonth + 1}`).then(res => {
          console.log(res)
          if (res.data.jobs && res.data.jobs.length > 0) {
            this.locum_jobs = res.data.jobs
          }
          if (res.data.unavailabilities && res.data.unavailabilities.length > 0) {
            this.unavailabilities = res.data.unavailabilities
          }
        })
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
          fullDate: this.$moment(new Date(day.getFullYear(), day.getMonth(), day.getDate()).toDateString()).format('YYYY-MM-DD')
          // fullDate: this.$moment(new Date(day.getFullYear(), day.getMonth(), day.getDate()).toDateString())._d
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
      this.getJobs()
    }
  }
}
</script>

