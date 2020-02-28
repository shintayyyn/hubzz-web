<template>
  <section class="relative">
    <div v-if="showRefresh" class="flex flex-row flex-wrap justify-between mx-1">
      <AppButton
        :label="'Refresh'"
        :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        @click="refreshJobs"
      />
    </div>
    <div class="flex flex-row flex-wrap justify-between mx-1">
      <div class="w-2/3 py-1 sm:w-1/3">
        <div
          class="font-bold text-gray-800"
        >
          {{ $store.state.calendar.months[selectedMonth] }} {{ selectedYear }}
        </div>
      </div>
      <div class="w-1/3 py-1 px-2 flex flex-no-wrap justify-end md:justify-center items-center">
        <span class="cursor-pointer mx-2 text-gray-500" @click="adjustMonth('previous')">
          <svgicon name="arrow-up" class="fill-current" height="29" width="29" />
        </span>
        <span class="cursor-pointer mx-2 text-gray-500" @click="adjustMonth('next')">
          <svgicon name="down" class="fill-current" height="16" width="16" />
        </span>
      </div>
      <div class="w-full text-right py-1 sm:w-1/3">
        <span
          class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
          :class="$store.state.calendar.view_type === 'per_month' ? 'py-1 px-3 bg-yellow-500':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_month')"
        >Month</span>
        <span
          class="cursor-pointer px-3 text-xs sm:text-sm hover:underline"
          :class="$store.state.calendar.view_type === 'per_week' ? 'py-1 px-3 bg-yellow-500':''"
          @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_week')"
        >Week</span>
      </div>
    </div>
    <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-3 md:mt-5">
      <div class="w-full text-center text-gray-500 font-bold">
        MON
      </div>
      <div class="w-full text-center text-gray-500 font-bold">
        TUE
      </div>
      <div class="w-full text-center text-gray-500 font-bold">
        WED
      </div>
      <div class="w-full text-center text-gray-500 font-bold">
        THU
      </div>
      <div class="w-full text-center text-gray-500 font-bold">
        FRI
      </div>
      <div class="w-full text-center text-gray-500 font-bold">
        SAT
      </div>
      <div class="w-full text-center text-gray-500 font-bold">
        SUN
      </div>
    </div>

    <div class="flex flex-no-wrap justify-between mx-1 mt-2 md:mt-5">
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
          <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date">
&nbsp;
          </div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            v-if="item.day === 1"
            class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date"
            :class="[hasEvent.includes(item.fullDate) ? 'text-black' : 'text-gray-500',$store.state.calendar.date_today === item.fullDate ? 'bg-gray-300 font-bold hover:bg-gray-200':'hover:bg-gray-300 transition-hover', selectedDate === item.fullDate && 'bg-gray-200']"
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
          >
            <div class="text-xs md:text-sm z-10 md:pb-2">
              {{ (item.date) }}
            </div>
            <PerMonthDateStatus :item="item" @hasActivities="getActivities(item.fullDate)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
          <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date">
&nbsp;
          </div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            v-if="item.day === 2"
            class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date"
            :class="[hasEvent.includes(item.fullDate) ? 'text-black' : 'text-gray-500',$store.state.calendar.date_today === item.fullDate ? 'bg-gray-300 font-bold hover:bg-gray-200':'hover:bg-gray-300 transition-hover', selectedDate === item.fullDate && 'bg-gray-200']"
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
          >
            <div class="text-xs md:text-sm z-10 md:pb-2">
              {{ item.date }}
            </div>
            <PerMonthDateStatus :item="item" @hasActivities="getActivities(item.fullDate)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
          <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date">
&nbsp;
          </div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            v-if="item.day === 3"
            class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date"
            :class="[hasEvent.includes(item.fullDate) ? 'text-black' : 'text-gray-500',$store.state.calendar.date_today === item.fullDate ? 'bg-gray-300 font-bold hover:bg-gray-200':'hover:bg-gray-300 transition-hover', selectedDate === item.fullDate && 'bg-gray-200']"
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
          >
            <div class="text-xs md:text-sm z-10 md:pb-2">
              {{ (item.date) }}
            </div>
            <PerMonthDateStatus :item="item" @hasActivities="getActivities(item.fullDate)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
          <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date">
&nbsp;
          </div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            v-if="item.day === 4"
            class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date"
            :class="[hasEvent.includes(item.fullDate) ? 'text-black' : 'text-gray-500',$store.state.calendar.date_today === item.fullDate ? 'bg-gray-300 font-bold hover:bg-gray-200':'hover:bg-gray-300 transition-hover', selectedDate === item.fullDate && 'bg-gray-200']"
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
          >
            <div class="text-xs md:text-sm z-10 md:pb-2">
              {{ item.date }}
            </div>
            <PerMonthDateStatus :item="item" @hasActivities="getActivities(item.fullDate)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
          <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date">
&nbsp;
          </div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            v-if="item.day === 5"
            class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date"
            :class="[hasEvent.includes(item.fullDate) ? 'text-black' : 'text-gray-500',$store.state.calendar.date_today === item.fullDate ? 'bg-gray-300 font-bold hover:bg-gray-200':'hover:bg-gray-300 transition-hover', selectedDate === item.fullDate && 'bg-gray-200']"
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
          >
            <div class="text-xs md:text-sm z-10 md:pb-2">
              {{ (item.date) }}
            </div>
            <PerMonthDateStatus :item="item" @hasActivities="getActivities(item.fullDate)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
          <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date">
&nbsp;
          </div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            v-if="item.day === 6"
            class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date"
            :class="[hasEvent.includes(item.fullDate) ? 'text-black' : 'text-gray-500',$store.state.calendar.date_today === item.fullDate ? 'bg-gray-300 font-bold hover:bg-gray-200':'hover:bg-gray-300 transition-hover', selectedDate === item.fullDate && 'bg-gray-200']"
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
          >
            <div class="text-xs md:text-sm z-10 md:pb-2">
              {{ item.date }}
            </div>
            <PerMonthDateStatus :item="item" @hasActivities="getActivities(item.fullDate)" />
          </div>
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
          <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date">
&nbsp;
          </div>
        </div>
        <div v-for="(item, index) in daysInMonth" :key="index">
          <div
            v-if="item.day === 0"
            class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 md:w-20 date"
            :class="[hasEvent.includes(item.fullDate) ? 'text-black' : 'text-gray-500',$store.state.calendar.date_today === item.fullDate ? 'bg-gray-300 font-bold hover:bg-gray-200':'hover:bg-gray-300 transition-hover', selectedDate === item.fullDate && 'bg-gray-200']"
            @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
          >
            <div class="text-xs md:text-sm z-10 md:pb-2">
              {{ item.date }}
            </div>
            <PerMonthDateStatus :item="item" @hasActivities="getActivities(item.fullDate)" />
          </div>
        </div>
      </div>
    </div>
    <AppLoading :loading="$store.state.calendar.loading" spinner />
  </section>
</template>
<script>
import PerMonthDateStatus from "@/components/Calendar/PerMonthDateStatus"
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
export default {
  components: {
    AppLoading,
    AppButton,
    PerMonthDateStatus
  },
  data () {
    return {
      showRefresh: false,
      selectedMonth: null,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      startOfMonth: null,
      endOfMonth: null,
      hasEvent: []
    }
  },
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
    selectedDate () {
      return this.$store.state.calendar.selected_date
    }
  },
  watch: {
    selectedMonth (value) {
      this.getDaysInMonth(value, this.selectedYear)
    },
    selectedDate (newValue, oldValue) {
      if (newValue && oldValue) {
        let newMonth = this.$moment(newValue, "YYYY-MM-DD").format("M")
        let oldMonth = this.$moment(oldValue, "YYYY-MM-DD").format("M")

        let newYear = this.$moment(newValue, "YYYY-MM-DD").format("YYYY")
        let oldYear = this.$moment(oldValue, "YYYY-MM-DD").format("YYYY")

        if (newMonth !== oldMonth || newYear !== oldYear) {
          this.startOfMonth = this.$moment(newValue, "YYYY-MM-DD")
            .startOf("month")
            .format("YYYY-MM-DD")
          this.endOfMonth = this.$moment(newValue, "YYYY-MM-DD")
            .endOf("month")
            .format("YYYY-MM-DD")

          let d = new Date(newValue)
          this.selectedMonth = d.getMonth()
          this.selectedYear = d.getFullYear()

          this.getDaysInMonth(this.selectedMonth, this.selectedYear)
          this.getJobs()
        }
      }
    }
  },
  beforeDestroy () {
    // this.$store.commit("jobs/CLEAR_JOBS");
  },
  async created () {
    this.startOfMonth = this.$moment(this.selectedDate, "YYYY-MM-DD")
      .startOf("month")
      .format("YYYY-MM-DD")
    this.endOfMonth = this.$moment(this.selectedDate, "YYYY-MM-DD")
      .endOf("month")
      .format("YYYY-MM-DD")

    let d = new Date(this.selectedDate)
    this.selectedMonth = d.getMonth()
    this.selectedYear = d.getFullYear()

    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
    this.getJobs()
  },
  mounted () {
    // locum
    if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
      this.$socket.on("Locum Notification Job Available", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Matched", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Job Unsuccessful",
        this.getJobsRealTime
      )
      this.$socket.on("Locum Notification Job Current", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Ongoing", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Job Part Completed",
        this.getJobsRealTime
      )
      this.$socket.on("Locum Notification Job Completed", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Locum Invoice Updated",
        this.getJobsRealTime
      )
      this.$socket.on("Locum Notification Job Cancelled", this.getJobsRealTime)

      this.$socket.on("Locum Notification Job Amended", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Updated", this.getJobsRealTime)
      this.$socket.on("Locum Notification Job Declined", this.getJobsRealTime)
      this.$socket.on(
        "Locum Notification Job Auto Declined",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Locum Notification Job Unavailable",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Locum Notification Job Unqualified",
        this.getJobsRealTime
      )
    }
    // practice
    if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
      this.$socket.on(
        "Practice Notification Job Available",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Application",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Application Cancelled",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Current",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Ongoing",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Part Completed",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Completed",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Locum Invoice Updated",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Cancelled",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Amended",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Declined",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Auto Declined",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Update Accept",
        this.getJobsRealTime
      )
      this.$socket.on(
        "Practice Notification Job Unfilled",
        this.getJobsRealTime
      )
    }
  },
  destroyed () {
    this.removeListener()
  },
  methods: {
    async getJobsRealTime (job) {
      if (!job) {
        return
      }
      this.showRefresh = true
    },
    async refreshJobs () {
      this.showRefresh = false
      this.$store.commit("jobs/CLEAR_PRACTICE_JOB_NOTIFICATION")
      this.getJobs()
    },
    removeListener () {
      if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
        this.$socket.removeListener(
          "Locum Notification Job Available",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Matched",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Unsuccessful",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Current",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Ongoing",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Part Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Locum Invoice Updated",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Cancelled",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Amended",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Updated",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Auto Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Unavailable",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Locum Notification Job Unqualified",
          this.getJobsRealTime
        )
      }
      if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
        this.$socket.removeListener(
          "Practice Notification Job Available",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Application",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Application Cancelled",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Current",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Ongoing",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Part Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Completed",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Locum Invoice Updated",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Cancelled",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Amended",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Auto Declined",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Update Accept",
          this.getJobsRealTime
        )
        this.$socket.removeListener(
          "Practice Notification Job Unfilled",
          this.getJobsRealTime
        )
      }
    },
    getJobs () {
      // PRACTICE
      if (
        this.$auth.loggedIn &&
        this.$auth.user.domain === "Practice" &&
        this.authPermissions.includes("View Sessions Job")
      ) {
        this.$store.commit("calendar/TOGGLE_LOADING", true)

        Promise.all([
          this.$axios.$get("/api/v1/practice/jobs", {
            params: {
              status: ["Allocated", "Applied", "Unfilled", "Withdrawn", "Live"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/practice/job-parts", {
            params: {
              status: ["Ongoing", "Completed"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/practice/jobs", {
            params: {
              platform_selection_date: [
                `${this.startOfMonth}:gte`,
                `${this.endOfMonth}:lte`
              ],
              limit: 100000000,
              status: ["Live", "Applied"]
            }
          })
        ])
          .then(
            ([
              responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive,
              responseOngoingAndCompleted,
              responseReminders
            ]) => {
              this.$store.commit(
                "jobs/SET_PRACTICE_ALLOCATED_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Allocated"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_APPLIED_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Applied"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_UNFILLED_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Unfilled"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_DECLINED_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Declined"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_AVAILABLE_JOBS",
                responseAllocatedAndAppliedAndUnfilledAndDeclinedAndLive.data.jobs.filter(
                  job => job.status === "Live"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_ONGOING_JOB_PARTS",
                responseOngoingAndCompleted.data.job_parts.filter(
                  jobPart => jobPart.status === "Ongoing"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_COMPLETED_JOB_PARTS",
                responseOngoingAndCompleted.data.job_parts.filter(
                  jobPart => jobPart.status === "Completed"
                )
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_AVAILABLE_JOBS_REMINDER",
                responseReminders.data.jobs.filter(job => job.status === "Live")
              )
              this.$store.commit(
                "jobs/SET_PRACTICE_APPLIED_JOBS_REMINDER",
                responseReminders.data.jobs.filter(
                  job => job.status === "Applied"
                )
              )
              this.$store.commit("calendar/TOGGLE_LOADING", false)
            }
          )
          .finally(() => {
            this.$store.commit("calendar/TOGGLE_LOADING", false)
          })
      }
      // LOCUM
      if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
        this.$store.commit("calendar/TOGGLE_LOADING", true)
        Promise.all([
          this.$axios.$get("/api/v1/locum/jobs", {
            params: {
              locum_status: ["Allocated", "Applied", "Available"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/locum/job-parts", {
            params: {
              locum_status: ["Ongoing", "Completed"],
              calendar_date_start: `${this.startOfMonth}:gte`,
              calendar_date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          }),
          this.$axios.$get("/api/v1/locum/unavailabilities", {
            params: {
              date_start: `${this.startOfMonth}:gte`,
              date_end: `${this.endOfMonth}:lte`,
              limit: 100000000
            }
          })
        ])
          .then(
            ([
              responseAllocatedAndAppliedAndAvailable,
              responseOngoingAndCompleted,
              responseUnavailabilities
            ]) => {
              this.$store.commit(
                "jobs/SET_LOCUM_APPLIED_JOBS",
                responseAllocatedAndAppliedAndAvailable.data.jobs.filter(
                  job => job.locum_status === "Applied"
                )
              )
              this.$store.commit(
                "jobs/SET_LOCUM_ALLOCATED_JOBS",
                responseAllocatedAndAppliedAndAvailable.data.jobs.filter(
                  job => job.locum_status === "Allocated"
                )
              )
              this.$store.commit(
                "jobs/SET_LOCUM_AVAILABLE_JOBS",
                responseAllocatedAndAppliedAndAvailable.data.jobs.filter(
                  job => job.locum_status === "Available"
                )
              )
              this.$store.commit(
                "jobs/SET_LOCUM_ONGOING_JOB_PARTS",
                responseOngoingAndCompleted.data.job_parts.filter(
                  jobPart => jobPart.locum_status === "Ongoing"
                )
              )
              this.$store.commit(
                "jobs/SET_LOCUM_COMPLETED_JOB_PARTS",
                responseOngoingAndCompleted.data.job_parts.filter(
                  jobPart => jobPart.locum_status === "Completed"
                )
              )
              this.$store.commit(
                "jobs/SET_LOCUM_UNAVAILABILITIES",
                responseUnavailabilities.data.unavailabilities.filter(
                  unavailable =>
                    unavailable.shifts && unavailable.shifts.length !== 0
                )
              )
            }
          )
          .finally(() => {
            this.$store.commit("calendar/TOGGLE_LOADING", false)
          })
      }
    },
    getDaysInMonth (month, selectedYear) {
      let date = new Date(selectedYear, month, 1)
      let days = []
      while (date.getMonth() === month) {
        days.push(new Date(date))
        date.setDate(date.getDate() + 1)
      }
      let daysInMonth = []
      days.forEach(day => {
        daysInMonth.push({
          day: day.getDay(),
          date: day.getDate(),
          fullDate: this.$moment(day).format("YYYY-MM-DD")
        })
      })
      this.daysInMonth = daysInMonth
    },
    adjustMonth (type) {
      if (type === "previous") {
        if (this.selectedMonth === 0) {
          this.selectedMonth = 11
          this.selectedYear--
        } else {
          this.selectedMonth--
        }
      }
      if (type === "next") {
        if (this.selectedMonth === 11) {
          this.selectedMonth = 0
          this.selectedYear++
        } else {
          this.selectedMonth++
        }
      }

      this.startOfMonth = this.$moment(
        `${this.selectedYear}-${this.selectedMonth + 1}`,
        "YYYY-MM"
      )
        .startOf("month")
        .format("YYYY-MM-DD")

      this.endOfMonth = this.$moment(
        `${this.selectedYear}-${this.selectedMonth + 1}`,
        "YYYY-MM"
      )
        .endOf("month")
        .format("YYYY-MM-DD")

      this.$store.commit(
        "calendar/SELECT_DATE",
        this.$moment(this.$store.state.calendar.selected_date, "YYYY-MM-DD")
          .set("month", this.selectedMonth)
          .set("year", this.selectedYear)
          .format("YYYY-MM-DD")
      )
      // this.getJobs();
    },
    getActivities (date) {
      if (!this.hasEvent.includes(date)) {
        this.hasEvent.push(date)
      }
    }
  }
}
</script>

<style scoped>
.date {
  min-height: 2em;
}

@media (min-width: 768px) {
  .date {
  min-height: 4em;
}
}
</style>