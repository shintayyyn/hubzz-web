<template>
  <section>
    <div class="flex flex-row flex-wrap mx-1">
      <div class="w-2/3 sm:w-1/3">
        <div
          class="text-xs sm:text-sm"
        >{{$moment(daysInWeek[0]).format('MMM')}} {{$moment(daysInWeek[0]).format('YYYY')}} - {{$moment(daysInWeek[6]).format('MMM')}} {{$moment(daysInWeek[6]).format('YYYY')}}</div>
      </div>
      <div class="w-1/3 text-right sm:w-1/3 sm:text-center">
        <span class="cursor-pointer" @click="adjustWeek('previous')">
          <svgicon name="arrow-left" height="12" width="12"/>
        </span>
        <span class="mx-4"></span>
        <span class="cursor-pointer" @click="adjustWeek('next')">
          <svgicon name="arrow-right" height="12" width="12"/>
        </span>
      </div>
      <div class="w-full text-right sm:w-1/3">
        <span
          class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
          :class="$store.state.calendar.view_type === 'per_month' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_month')"
        >Month</span>
        <span
          class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
          :class="$store.state.calendar.view_type === 'per_week' ? 'py-1 px-3 bg-yellow-dark':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_week')"
        >Week</span>
      </div>
    </div>

    <div class="flex flex-nowrap justify-between text-xs sm:text-sm mx-1 mt-5">
      <div class="w-full text-center text-grey font-bold"></div>
      <div class="w-full text-center text-grey font-bold">MON</div>
      <div class="w-full text-center text-grey font-bold">TUE</div>
      <div class="w-full text-center text-grey font-bold">WED</div>
      <div class="w-full text-center text-grey font-bold">THU</div>
      <div class="w-full text-center text-grey font-bold">FRI</div>
      <div class="w-full text-center text-grey font-bold">SAT</div>
      <div class="w-full text-center text-grey font-bold">SUN</div>
    </div>

    <div class="flex flex-nowrap justify-between text-xs sm:text-sm mx-1 mt-5">
      <div class="w-full text-center text-grey-darkest"></div>
      <div
        class="w-full text-center text-grey-darkest font-bold"
        v-for="(date, index) in daysInWeek"
        :key="index"
      >{{$moment(date).format('DD')}}</div>
    </div>

    <div class="flex flex-nowrap justify-between text-xs mx-1 mt-5" style="height:50px;">
      <div class="w-full text-left">AM</div>
      <template v-for="(date, index) in daysInWeek">
        <div
          v-if="hasLocumPrivateJobs(date, 'AM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'AM')"
        ></div>
        <div
          v-else-if="hasLocumCurrentJob(date, 'AM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'AM')"
        ></div>
        <!-- <div
          v-else-if="hasLocumAppliedJobs(date, 'AM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-orange-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'AM')"
        ></div>-->
        <div
          v-else-if="hasLocumUnavailabilities(date, 'AM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-pink hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'AM')"
        ></div>
        <div
          v-else-if="currentDate(date)"
          class="w-full cursor-pointer border-t-2 border-grey bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'AM')"
        ></div>
        <div
          v-else
          class="w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'AM')"
        ></div>
      </template>
    </div>
    <div class="flex flex-nowrap justify-between text-xs mx-1" style="height:50px;">
      <div class="w-full text-left">PM</div>
      <template v-for="(date, index) in daysInWeek">
        <div
          v-if="hasLocumPrivateJobs(date, 'PM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'PM')"
        ></div>
        <div
          v-else-if="hasLocumCurrentJob(date, 'PM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'PM')"
        ></div>
        <!-- <div
          v-else-if="hasLocumAppliedJobs(date, 'PM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'PM')"
        ></div>-->
        <div
          v-else-if="hasLocumUnavailabilities(date, 'PM')"
          class="w-full cursor-pointer border-t-2 border-grey bg-pink hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'PM')"
        ></div>
        <div
          v-else-if="currentDate(date)"
          class="w-full cursor-pointer border-t-2 border-grey bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'PM')"
        ></div>
        <div
          v-else
          class="w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'PM')"
        ></div>
      </template>
    </div>
    <div class="flex flex-nowrap justify-between text-xs mx-1" style="height:50px;">
      <div class="w-full text-left">OOH</div>
      <template v-for="(date, index) in daysInWeek">
        <div
          v-if="hasLocumPrivateJobs(date, 'OOH')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'OOH')"
        ></div>
        <div
          v-else-if="hasLocumCurrentJob(date, 'OOH')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'OOH')"
        ></div>
        <!-- <div
          v-else-if="hasLocumAppliedJobs(date, 'OOH')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'OOH')"
        ></div>-->
        <div
          v-else-if="hasLocumUnavailabilities(date, 'OOH')"
          class="w-full cursor-pointer border-t-2 border-grey bg-pink hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'OOH')"
        ></div>
        <div
          v-else-if="currentDate(date)"
          class="w-full cursor-pointer border-t-2 border-grey bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'OOH')"
        ></div>
        <div
          v-else
          class="w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'OOH')"
        ></div>
      </template>
    </div>
    <div class="flex flex-nowrap justify-between text-xs mx-1" style="height:50px;">
      <div class="w-full text-left">Whole-day</div>
      <template v-for="(date, index) in daysInWeek">
        <div
          v-if="hasLocumPrivateJobs(date, 'Whole Day')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'Whole Day')"
        ></div>
        <div
          v-else-if="hasLocumCurrentJob(date, 'Whole Day')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'Whole Day')"
        ></div>
        <!-- <div
          v-else-if="hasLocumAppliedJobs(date, 'Whole Day')"
          class="w-full cursor-pointer border-t-2 border-grey bg-green-light hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'Whole Day')"
        ></div>-->
        <div
          v-else-if="hasLocumUnavailabilities(date, 'Whole Day')"
          class="w-full cursor-pointer border-t-2 border-grey bg-pink hover:bg-grey-light"
          :key="`${date}-${index}`"
          @click="selectDateShift(date, 'Whole Day')"
        ></div>
        <div
          v-else-if="currentDate(date)"
          class="w-full cursor-pointer border-t-2 border-grey bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'Whole Day')"
        ></div>
        <div
          v-else
          class="w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
          :key="index"
          @click="selectDateShift(date, 'Whole Day')"
        ></div>
      </template>
    </div>
    <template v-if="$auth.user.domain === 'Practice'">
      <div class="flex flex-nowrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left">Reminder</div>
        <template v-for="(date, index) in daysInWeek">
          <div
            v-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-grey bg-grey-light"
            :key="index"
            @click="selectDateShift(date, 'REMINDER')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
            :key="index"
            @click="selectDateShift(date, 'REMINDER')"
          ></div>
        </template>
      </div>
    </template>
    <template v-if="$auth.user.domain === 'Locum'">
      <div class="flex flex-nowrap justify-between text-xs mx-1" style="height:50px;">
        <div class="w-full text-left">Available</div>
        <template v-for="(date, index) in daysInWeek">
          <div
            v-if="hasLocumAppliedJobs(date, 'Available')"
            class="w-full cursor-pointer border-t-2 border-grey bg-orange-light hover:bg-grey-light"
            :key="`${date}-${index}`"
            @click="selectDateShift(date, 'Available')"
          ></div>
          <div
            v-else-if="currentDate(date)"
            class="w-full cursor-pointer border-t-2 border-grey bg-grey-light"
            :key="index"
            @click="selectDateShift(date, 'Available')"
          ></div>
          <div
            v-else
            class="w-full cursor-pointer border-t-2 border-grey hover:bg-grey-light"
            :key="index"
            @click="selectDateShift(date, 'Available')"
          ></div>
        </template>
      </div>
    </template>
  </section>
</template>
<script>
export default {
  data() {
    return {
      // weekOfTheYear: null,
      firstDayOfTheWeek: null,
      lastDayOfTheWeek: null,
      // practice
      jobs: [],
      applied_jobs_with_selection_date: [],
      unfilled_jobs: [],
      declined_jobs: [],
    }
  },
  created() {
    this.firstDayOfTheWeek = this.$moment().day('Monday').format('YYYY-MM-DD')
    this.lastDayOfTheWeek = this.$moment().add(1, 'week').day('sunday').format('YYYY-MM-DD')
    // this.weekOfTheYear = this.$moment().week()
    this.getJobs()
  },
  computed: {
    // locum
    locum_private_jobs() {
      return this.$store.state.calendar.locum_private_jobs
    },
    locum_current_jobs() {
      return this.$store.state.calendar.locum_current_jobs
    },
    locum_applied_jobs() {
      return this.$store.state.calendar.locum_applied_jobs
    },
    locum_unavailabilities() {
      return this.$store.state.calendar.locum_unavailabilities
    },
    daysInWeek() {
      let weekLists = []
      for (let i = 0; i < 7; i++) {
        weekLists.push(this.$moment(this.firstDayOfTheWeek).add(i, 'days').format('YYYY-MM-DD'))
      }
      return weekLists
    },
    selectedYear() {
      return this.$moment(this.firstDayOfTheWeek).format('YYYY')
    }
  },
  methods: {
    getJobs() {
      if (this.$auth.user.domain === 'Practice') {
        this.$axios.$get(`/api/v1/practice/calendars/weekly/${this.$moment(this.daysInWeek[6]).format('YYYY')}/${this.weekOfTheYear}`).then(res => {
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
      }
      if (this.$auth.user.domain === 'Locum') {
        // current(private), current(platform)
        this.$axios.$get(`/api/v1/locum/jobs?locum_status=Current&date_start=${this.firstDayOfTheWeek}&date_end=${this.lastDayOfTheWeek}`).then(res => {
          // console.log(res.data)
          if (res.data.jobs && res.data.jobs.length > 0) {
            this.$store.commit('calendar/SET_LOCUM_PRIVATE_JOBS', res.data.jobs.filter(job => job.type === 'Private'))
            this.$store.commit('calendar/SET_LOCUM_CURRENT_JOBS', res.data.jobs.filter(job => job.type === 'Platform'))
          }
        })
        // applied
        this.$axios.$get(`/api/v1/locum/jobs?locum_status=Applied&date_start=${this.firstDayOfTheWeek}&date_end=${this.lastDayOfTheWeek}`).then(res => {
          // console.log(res.data)
          if (res.data.jobs && res.data.jobs.length > 0) {
            this.$store.commit('calendar/SET_LOCUM_APPLIED_JOBS', res.data.jobs)
          }
        })
        // unavailabilities
        this.$axios.$get(`/api/v1/locum/unavailabilities?date_start=${this.firstDayOfTheWeek}&date_end=${this.lastDayOfTheWeek}`).then(res => {
          // console.log(res)
          if (res.data.unavailabilities && res.data.unavailabilities.length > 0) {
            this.$store.commit('calendar/SET_LOCUM_UNAVAILABILITIES', res.data.unavailabilities)
          }
        })
      }
    },
    selectDateShift(date, shift) {
      this.$store.commit('calendar/SELECT_DATE_SHIFT', { date: date, shift: shift })
    },
    adjustWeek(type) {
      if (type === 'next') {
        this.firstDayOfTheWeek = this.$moment(this.daysInWeek[6]).add(1, 'days').format('YYYY-MM-DD')
        this.lastDayOfTheWeek = this.$moment(this.daysInWeek[6]).add(7, 'days').format('YYYY-MM-DD')
      }
      if (type === 'previous') {
        this.firstDayOfTheWeek = this.$moment(this.daysInWeek[0]).subtract(7, 'days').format('YYYY-MM-DD')
        this.lastDayOfTheWeek = this.$moment(this.daysInWeek[0]).subtract(1, 'days').format('YYYY-MM-DD')
      }
      this.getJobs()
    },
    currentDate(date) {
      if (date === this.$moment(new Date()).format('YYYY-MM-DD')) {
        return true
      } else {
        return false
      }
    },
    // locums
    hasLocumPrivateJobs(date, type) {
      if (this.locum_private_jobs && this.locum_private_jobs.length > 0) {
        return this.locum_private_jobs.find(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date) && job.private_job.shift.name === type)
      }
    },
    hasLocumCurrentJob(date, type) {
      if (this.locum_current_jobs && this.locum_current_jobs.length > 0) {
        return this.locum_current_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
      }
    },
    hasLocumAppliedJobs(date, type) {
      return this.locum_applied_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
    },
    hasLocumUnavailabilities(date, type) {
      if (this.locum_unavailabilities && this.locum_unavailabilities.length > 0) {
        return this.locum_unavailabilities.find(job => job.date === date && job.shifts.find(shift => shift.name === type))
      }
    },
    // hasJobs(date, type) {
    //   if (this.jobs && this.jobs.length > 0) {
    //     return this.jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    //   }
    // },
    // hasAppliedJobs(date) {
    //   if (this.applied_jobs_with_selection_date && this.applied_jobs_with_selection_date.length > 0) {
    //     return this.applied_jobs_with_selection_date.find(job => job.platform_job.selection_date === date)
    //   }
    // },
    // hasUnfilledJobs(date, type) {
    //   if (this.unfilled_jobs && this.unfilled_jobs.length > 0) {
    //     return this.unfilled_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    //   }
    // },
    // hasDeclinedJobs(date, type) {
    //   if (this.declined_jobs && this.declined_jobs.length > 0) {
    //     return this.declined_jobs.find(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === type)
    //   }
    // },
    // it returns an array of dates
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
<style scoped>
</style>
