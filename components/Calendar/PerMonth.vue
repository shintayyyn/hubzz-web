<template>
  <section class="relative flex flex-col justify-between h-full pt-3">
    <div>
      <div class="flex flex-row flex-wrap justify-between mx-1">
        <div class="w-1/2 flex items-center justify-between">
          <span class="cursor-pointer mr-2" @click="adjustMonth('previous')">
            <svgicon name="caret-down" class="fill-current" height="16" width="16" style="transform: rotate(180deg)" />
          </span>
          <div
            class="font-bold text-gray-800"
          >
            {{ $store.state.calendar.months[selectedMonth] }} {{ selectedYear }}
          </div>
           

          <span class="cursor-pointer mx-2" @click="adjustMonth('next')">
            <svgicon name="caret-down" class="fill-current" height="16" width="16" />
          </span>
        </div>
        <div class="w-1/2 flex items-center" :class="showRefresh ? 'justify-between' : 'justify-end'">
          <div v-if="showRefresh" class="ml-2">
            <AppButton
              :label="'Refresh'"
              :in-style="'font-size:12px;'"
              :inClass="'text-xs py-1 px-4 rounded'"
              @click="refreshJobs"
            />
          </div>
          <div class="flex items-center">
            <span
              class="text-xs py-1 px-4 rounded transition-hover"
              :class="$store.state.calendar.view_type === 'per_month' ? 'bg-orange-500 text-white font-bold cursor-default':'border hover:bg-gray-400 cursor-pointer'"
              @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_month')"
            >Month</span>

            <span
              class="text-xs py-1 px-4 rounded transition-hover ml-2"
              :class="$store.state.calendar.view_type === 'per_week' ? 'bg-orange-500 text-white font-bold cursor-default':'border hover:bg-gray-400 cursor-pointer'"
              @click="$store.commit('calendar/TOGGLE_CALENDAR_VIEW_TYPE', 'per_week')"
            >Week</span>
         </div>
        </div>
      </div>
      <!--  <div class="w-2/3 py-1 sm:w-1/3">
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
        </div> -->

        <!-- <div class="w-full text-right py-1 sm:w-1/3">
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
        </div> -->

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

      <div class="flex flex-no-wrap justify-between mx-1 mt-2 md:mt-5 md:mb-4">
        <div class="flex flex-col w-full items-center">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
            <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date">
&nbsp;
            </div>
          </div>

          <div v-for="(item, index) in daysInMonth" :key="index" class="w-full flex justify-center">
            <div
              v-if="item.day === 1"
              class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date"
              :class="[
                jobsInMonth.find(jobDate => jobDate.date === item.fullDate)
                  ? 'date-color'
                  : 'text-gray-500',
                $store.state.calendar.date_today === item.fullDate
                  ? 'bg-gray-300 font-bold hover:bg-gray-200'
                  :'hover:bg-gray-300 transition-hover',
                selectedDate === item.fullDate && 'bg-gray-200',
              ]"
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            >
              <template v-if="$auth.user.domain === 'Locum' && getLocumPermanentJobs.length">
                <svgicon
                  v-if="getLocumPermanentJobs.find(job => $moment(job.invitation_schedule).format('YYYY-MM-DD') === item.fullDate)"
                  name="pushpin"
                  width="14"
                  height="14"
                  class="fill-current text-blue-500 -mt-3"
                />
              </template>

              <div class="text-xs md:text-sm z-10 md:pb-2">
                {{ (item.date) }}
              </div>

              <PerMonthInfo
                :item="item"
                :info="jobsInMonth.find(jobDate => jobDate.date === item.fullDate)"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full items-center">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
            <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date">
&nbsp;
            </div>
          </div>

          <div v-for="(item, index) in daysInMonth" :key="index" class="w-full flex justify-center">
            <div
              v-if="item.day === 2"
              class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date"
              :class="[
                jobsInMonth.find(jobDate => jobDate.date === item.fullDate)
                  ? 'date-color'
                  : 'text-gray-500',
                $store.state.calendar.date_today === item.fullDate
                  ? 'bg-gray-300 font-bold hover:bg-gray-200'
                  :'hover:bg-gray-300 transition-hover',
                selectedDate === item.fullDate && 'bg-gray-200'
              ]"
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            >
              <template v-if="$auth.user.domain === 'Locum' && getLocumPermanentJobs.length">
                <svgicon
                  v-if="getLocumPermanentJobs.find(job => $moment(job.invitation_schedule).format('YYYY-MM-DD') === item.fullDate)"
                  name="pushpin"
                  width="14"
                  height="14"
                  class="fill-current text-blue-500 -mt-3"
                />
              </template>

              <div class="text-xs md:text-sm z-10 md:pb-2">
                {{ item.date }}
              </div>

              <PerMonthInfo
                :item="item"
                :info="jobsInMonth.find(jobDate => jobDate.date === item.fullDate)"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full items-center">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
            <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date">
&nbsp;
            </div>
          </div>
          <div v-for="(item, index) in daysInMonth" :key="index" class="w-full flex justify-center">
            <div
              v-if="item.day === 3"
              class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date"
              :class="[
                jobsInMonth.find(jobDate => jobDate.date === item.fullDate)
                  ? 'date-color'
                  : 'text-gray-500',
                $store.state.calendar.date_today === item.fullDate
                  ? 'bg-gray-300 font-bold hover:bg-gray-200'
                  :'hover:bg-gray-300 transition-hover',
                selectedDate === item.fullDate && 'bg-gray-200',
              ]"
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            >
              <template v-if="$auth.user.domain === 'Locum' && getLocumPermanentJobs.length">
                <svgicon
                  v-if="getLocumPermanentJobs.find(job => $moment(job.invitation_schedule).format('YYYY-MM-DD') === item.fullDate)"
                  name="pushpin"
                  width="14"
                  height="14"
                  class="fill-current text-blue-500 -mt-3"
                />
              </template>

              <div class="text-xs md:text-sm z-10 md:pb-2">
                {{ (item.date) }}
              </div>

              <PerMonthInfo
                :item="item"
                :info="jobsInMonth.find(jobDate => jobDate.date === item.fullDate)"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full items-center">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
            <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date">
&nbsp;
            </div>
          </div>

          <div v-for="(item, index) in daysInMonth" :key="index" class="w-full flex justify-center">
            <div
              v-if="item.day === 4"
              class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date"
              :class="[
                jobsInMonth.find(jobDate => jobDate.date === item.fullDate)
                  ? 'date-color'
                  : 'text-gray-500',
                $store.state.calendar.date_today === item.fullDate
                  ? 'bg-gray-300 font-bold hover:bg-gray-200'
                  :'hover:bg-gray-300 transition-hover',
                selectedDate === item.fullDate && 'bg-gray-200',
              ]"
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            >
              <template v-if="$auth.user.domain === 'Locum' && getLocumPermanentJobs.length">
                <svgicon
                  v-if="getLocumPermanentJobs.find(job => $moment(job.invitation_schedule).format('YYYY-MM-DD') === item.fullDate)"
                  name="pushpin"
                  width="14"
                  height="14"
                  class="fill-current text-blue-500 -mt-3"
                />
              </template>

              <div class="text-xs md:text-sm z-10 md:pb-2">
                {{ item.date }}
              </div>

              <PerMonthInfo
                :item="item"
                :info="jobsInMonth.find(jobDate => jobDate.date === item.fullDate)"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full items-center">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
            <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date">
&nbsp;
            </div>
          </div>

          <div v-for="(item, index) in daysInMonth" :key="index" class="w-full flex justify-center">
            <div
              v-if="item.day === 5"
              class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date"
              :class="[
                jobsInMonth.find(jobDate => jobDate.date === item.fullDate)
                  ? 'date-color'
                  : 'text-gray-500',
                $store.state.calendar.date_today === item.fullDate
                  ? 'bg-gray-300 font-bold hover:bg-gray-200'
                  :'hover:bg-gray-300 transition-hover',
                selectedDate === item.fullDate && 'bg-gray-200',
              ]"
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            >
              <template v-if="$auth.user.domain === 'Locum' && getLocumPermanentJobs.length">
                <svgicon
                  v-if="getLocumPermanentJobs.find(job => $moment(job.invitation_schedule).format('YYYY-MM-DD') === item.fullDate)"
                  name="pushpin"
                  width="14"
                  height="14"
                  class="fill-current text-blue-500 -mt-3"
                />
              </template>

              <div class="text-xs md:text-sm z-10 md:pb-2">
                {{ (item.date) }}
              </div>

              <PerMonthInfo
                :item="item"
                :info="jobsInMonth.find(jobDate => jobDate.date === item.fullDate)"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full items-center">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
            <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date">
&nbsp;
            </div>
          </div>

          <div v-for="(item, index) in daysInMonth" :key="index" class="w-full flex justify-center">
            <div
              v-if="item.day === 6"
              class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date"
              :class="[
                jobsInMonth.find(jobDate => jobDate.date === item.fullDate)
                  ? 'date-color'
                  : 'text-gray-500',
                $store.state.calendar.date_today === item.fullDate
                  ? 'bg-gray-300 font-bold hover:bg-gray-200'
                  :'hover:bg-gray-300 transition-hover',
                selectedDate === item.fullDate && 'bg-gray-200',
              ]"
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            >
              <template v-if="$auth.user.domain === 'Locum' && getLocumPermanentJobs.length">
                <svgicon
                  v-if="getLocumPermanentJobs.find(job => $moment(job.invitation_schedule).format('YYYY-MM-DD') === item.fullDate)"
                  name="pushpin"
                  width="14"
                  height="14"
                  class="fill-current text-blue-500 -mt-3"
                />
              </template>

              <div class="text-xs md:text-sm z-10 md:pb-2">
                {{ item.date }}
              </div>

              <PerMonthInfo
                :item="item"
                :info="jobsInMonth.find(jobDate => jobDate.date === item.fullDate)"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full items-center">
          <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
            <div class="m-1 h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date">
&nbsp;
            </div>
          </div>

          <div v-for="(item, index) in daysInMonth" :key="index" class="w-full flex justify-center">
            <div
              v-if="item.day === 0"
              class="relative rounded-lg m-1 cursor-pointer flex flex-col justify-center items-center h-12 sm:h-16 md:h-20 w-auto sm:w-16 xl:w-20 p-1 date"
              :class="[
                jobsInMonth.find(jobDate => jobDate.date === item.fullDate)
                  ? 'date-color'
                  : 'text-gray-500',
                $store.state.calendar.date_today === item.fullDate
                  ? 'bg-gray-300 font-bold hover:bg-gray-200'
                  :'hover:bg-gray-300 transition-hover',
                selectedDate === item.fullDate && 'bg-gray-200',
              ]"
              @click="$store.commit('calendar/SELECT_DATE', item.fullDate)"
            >
              <template v-if="$auth.user.domain === 'Locum' && getLocumPermanentJobs.length">
                <svgicon
                  v-if="getLocumPermanentJobs.find(job => $moment(job.invitation_schedule).format('YYYY-MM-DD') === item.fullDate)"
                  name="pushpin"
                  width="14"
                  height="14"
                  class="fill-current text-blue-500 -mt-3"
                />
              </template>

              <div class="text-xs md:text-sm z-10 md:pb-2">
                {{ item.date }}
              </div>

              <PerMonthInfo
                :item="item"
                :info="jobsInMonth.find(jobDate => jobDate.date === item.fullDate)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <span class="mt-4">
      <!-- <svgicon
        name="info"
        width="16"
        height="16"
        class="fill-current cursor-pointer hover:text-gray-700"
        @click="legendsModal=true"
      /> -->
      <span class="bg-gray-900 cursor-pointer hover:bg-gray-800 transition-hover px-3 rounded text-white" @click="legendsModal=true">i</span>
    </span>

    <transition name="fade">
      <div v-if="legendsModal" class="message-modal z-50">
        <div class="w-full flex flex-col bg-white p-4 rounded-lg shadow-lg">
          <p class="flex items-center justify-between flex-no-wrap font-bold">
            <span>Legend</span>

            <span class="cursor-pointer hover:text-gray-600" @click="legendsModal=false">
              <svgicon name="cancel" width="12" height="12" class="fill-current" />
            </span>
          </p>

          <div class="mt-2 flex flex-col md:flex-row">
            <div class="md:w-3/5">
              <p>Job Status</p>

              <div class="flex items-center">
                <span class="bg-job-active w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Allocated Jobs
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-job-pending w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Applied Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Practice'" class="flex items-center">
                <span class="bg-job-unfilled w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Unfilled Jobs, Withdrawn Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Practice'" class="flex items-center">
                <span class="bg-gray-500 w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Live Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Locum'" class="flex items-center">
                <span class="bg-blue-500 w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Ongoing Private Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Locum'" class="flex items-center">
                <span>
                  <svgicon name="pushpin" width="17" height="17" class="fill-current text-blue-500 -mt-3" />
                </span>

                <p class="ml-2">
                  For Interview Permanent Jobs
                </p>
              </div>

              <div v-if="$auth.user.domain === 'Locum'" class="flex items-center">
                <span class="bg-red-400 w-2 h-2 md:w-3 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Not Availabile
                </p>
              </div>
            </div>

            <div class="md:w-2/5">
              <p>Shifts</p>

              <div class="flex items-center">
                <span class="bg-shift-whole-day w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  Whole Day
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-shift-am w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  AM
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-shift-pm w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  PM
                </p>
              </div>

              <div class="flex items-center">
                <span class="bg-shift-ooh w-12 h-2 md:w-20 md:h-3 rounded border border-white p-2" />

                <p class="ml-2">
                  OOH
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="legendsModal" class="shield" @click="legendsModal=false" />

    <AppLoading :loading="$store.state.calendar.loading" spinner />
  </section>
</template>

<script>
import PerMonthInfo from "@/components/Calendar/PerMonthInfo"
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
    AppLoading,
    AppButton,
    PerMonthInfo,
  },

  props: {
    locumUnavailabilities: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      showRefresh: false,
      selectedMonth: null,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      startOfMonth: null,
      endOfMonth: null,
      hasEvent: [],
      legendsModal: false,
    }
  },

  computed: {
    view_permanent_jobs () {
      return this.$store.getters["getViewPermanentJobs"]
    },

    selectedDate () {
      return this.$store.state.calendar.selected_date
    },

    // LOCUM
    getLocumOngoingJobs () {
      return this.$store.getters["jobs/getLocumOngoingJobs"]
    },

    getLocumAllocatedPartJobs () {
      return this.$store.getters["jobs/getLocumAllocatedPartJobs"]
    },

    getLocumAppliedJobs () {
      return this.$store.getters["jobs/getLocumAppliedJobs"]
    },

    getLocumPrivateJobParts () {
      return this.$store.getters["jobs/getLocumPrivateJobParts"]
    },

    getLocumPermanentJobs () {
      return this.$store.getters["jobs/getLocumPermanentJobs"]
    },

    // PRACTICE
    getPracticeOngoingJobs () {
      return this.$store.getters["jobs/getPracticeOngoingJobs"]
    },

    getPracticeAvailableJobs () {
      return this.$store.getters["jobs/getPracticeAvailableJobs"]
    },

    getPracticeWithdrawnJobs () {
      return this.$store.getters["jobs/getPracticeWithdrawnJobs"]
    },

    getPracticeAppliedJobs () {
      return this.$store.getters["jobs/getPracticeAppliedJobs"]
    },

    getPracticeUnfilledJobs () {
      return this.$store.getters["jobs/getPracticeUnfilledJobs"]
    },

    getPracticeAllocatedPartJobs () {
      return this.$store.getters["jobs/getPracticeAllocatedPartJobs"]
    },

    jobsInMonth () {
      let jobsInMonth = []

      if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
        let jobs = [
          ...this.getPracticeAppliedJobs,
          ...this.getPracticeUnfilledJobs,
          ...this.getPracticeAvailableJobs,
        ]

        let jobParts = [
          // ...this.getPracticeOngoingJobs,
          ...this.getPracticeWithdrawnJobs,
          ...this.getPracticeAllocatedPartJobs,
        ]

        this.daysInMonth.forEach(days => {
          if (jobs.length > 0) {
            jobs.forEach(job => {
              if (job.status !== "Live") {
                if (job.dates.includes(days.fullDate)) {
                  if (jobsInMonth.length === 0) {
                    let shifts = []
                    let shiftSchedule = job.schedules.filter(
                      item => item.date === days.fullDate
                    )
                    if (shiftSchedule.length) {
                      shiftSchedule.forEach(sched => {
                        if (!shifts.includes(sched.shift.name)) {
                          shifts.push(sched.shift.name)
                        }
                      })
                    }
                    jobsInMonth.push({
                      date: days.fullDate,
                      shifts: shifts,
                      status: [job.status,],
                      jobs: [job,],
                    })
                  } else {
                    let dateExist = jobsInMonth.find(
                      item => item.date === days.fullDate
                    )
                      ? true
                      : false
                    if (dateExist) {
                      let findDate = jobsInMonth.find(
                        item => item.date === days.fullDate
                      )
                      if (job.shifts.length) {
                        job.shifts.forEach(shift => {
                          if (!findDate.shifts.includes(shift.name)) {
                            findDate.shifts.push(shift.name)
                          }
                        })
                      }

                      if (!findDate.status.includes(job.status)) {
                        findDate.status.push(job.status)
                      }
                      findDate.jobs.push(job)
                    } else {
                      let shifts = []
                      let shiftSchedule = job.schedules.filter(
                        item => item.date === days.fullDate
                      )
                      if (shiftSchedule.length) {
                        shiftSchedule.forEach(sched => {
                          if (!shifts.includes(sched.shift.name)) {
                            shifts.push(sched.shift.name)
                          }
                        })
                      }
                      jobsInMonth.push({
                        date: days.fullDate,
                        shifts: shifts,
                        status: [job.status,],
                        jobs: [job,],
                      })
                    }
                  }
                }
              } else {
                if (job.dates[0] === days.fullDate) {
                  if (jobsInMonth.length === 0) {
                    let shifts = []
                    if (job.shifts.length) {
                      job.shifts.forEach(shift => {
                        shifts.push(shift.name)
                      })
                    }
                    jobsInMonth.push({
                      date: days.fullDate,
                      shifts: shifts,
                      status: [job.status,],
                      jobs: [job,],
                    })
                  } else {
                    let dateExist = jobsInMonth.find(
                      item => item.date === days.fullDate
                    )
                      ? true
                      : false
                    if (dateExist) {
                      let findDate = jobsInMonth.find(
                        item => item.date === days.fullDate
                      )
                      if (job.shifts.length) {
                        job.shifts.forEach(shift => {
                          if (!findDate.shifts.includes(shift.name)) {
                            findDate.shifts.push(shift.name)
                          }
                        })
                      }
                      if (!findDate.status.includes(job.status)) {
                        findDate.status.push(job.status)
                      }
                      findDate.jobs.push(job)
                    } else {
                      let shifts = []
                      if (job.shifts.length) {
                        job.shifts.forEach(shift => {
                          shifts.push(shift.name)
                        })
                      }
                      jobsInMonth.push({
                        date: days.fullDate,
                        shifts: shifts,
                        status: [job.status,],
                        jobs: [job,],
                      })
                    }
                  }
                }
              }
            })
          }

          if (jobParts.length > 0) {
            jobParts.forEach(jobPart => {
              if (jobPart.dates.includes(days.fullDate)) {
                if (jobsInMonth.length === 0) {
                  let shifts = []
                  let shiftSchedule = jobPart.schedules.filter(
                    item => item.date === days.fullDate
                  )
                  if (shiftSchedule.length) {
                    shiftSchedule.forEach(sched => {
                      if (!shifts.includes(sched.shift.name)) {
                        shifts.push(sched.shift.name)
                      }
                    })
                  }
                  jobsInMonth.push({
                    date: days.fullDate,
                    shifts: shifts,
                    status: [jobPart.status,],
                    jobs: [jobPart,],
                  })
                } else {
                  let dateExist = jobsInMonth.find(
                    item => item.date === days.fullDate
                  )
                    ? true
                    : false
                  if (dateExist) {
                    let findDate = jobsInMonth.find(
                      item => item.date === days.fullDate
                    )
                    let shiftSchedule = jobPart.schedules.filter(
                      item => item.date === days.fullDate
                    )
                    if (shiftSchedule.length) {
                      shiftSchedule.forEach(sched => {
                        if (!findDate.shifts.includes(sched.shift.name)) {
                          findDate.shifts.push(sched.shift.name)
                        }
                      })
                    }

                    if (!findDate.status.includes(jobPart.status)) {
                      findDate.status.push(jobPart.status)
                    }
                    findDate.jobs.push(jobPart)
                  } else {
                    let shifts = []
                    let shiftSchedule = jobPart.schedules.filter(
                      item => item.date === days.fullDate
                    )
                    if (shiftSchedule.length) {
                      shiftSchedule.forEach(sched => {
                        if (!shifts.includes(sched.shift.name)) {
                          shifts.push(sched.shift.name)
                        }
                      })
                    }
                    jobsInMonth.push({
                      date: days.fullDate,
                      shifts: shifts,
                      status: [jobPart.status,],
                      jobs: [jobPart,],
                    })
                  }
                }
              }
            })
          }
        })
      } else if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
        let jobs = [...this.getLocumAppliedJobs,]
        let jobParts = [
          // ...this.getLocumOngoingJobs,
          ...this.getLocumAllocatedPartJobs,
          ...this.getLocumPrivateJobParts,
        ]
        this.daysInMonth.forEach(days => {
          if (jobs.length > 0) {
            jobs.forEach(job => {
              if (job.dates.includes(days.fullDate)) {
                if (jobsInMonth.length === 0) {
                  let shifts = []
                  if (job.shifts.length) {
                    job.shifts.forEach(shift => {
                      if (!shifts.includes(shift.name)) {
                        shifts.push(shift.name)
                      }
                    })
                  }
                  jobsInMonth.push({
                    date: days.fullDate,
                    shifts: shifts,
                    status: [job.locum_status,],
                    jobs: [job,],
                  })
                } else {
                  let dateExist = jobsInMonth.find(
                    item => item.date === days.fullDate
                  )
                    ? true
                    : false
                  if (dateExist) {
                    let findDate = jobsInMonth.find(
                      item => item.date === days.fullDate
                    )
                    if (job.shifts.length) {
                      job.shifts.forEach(shift => {
                        if (!findDate.shifts.includes(shift.name)) {
                          findDate.shifts.push(shift.name)
                        }
                      })
                    }
                    if (!findDate.status.includes(job.locum_status)) {
                      findDate.status.push(job.locum_status)
                    }
                    findDate.jobs.push(job)
                  } else {
                    let shifts = []
                    if (job.shifts.length) {
                      job.shifts.forEach(shift => {
                        if (!shifts.includes(shift.name)) {
                          shifts.push(shift.name)
                        }
                      })
                    }
                    jobsInMonth.push({
                      date: days.fullDate,
                      shifts: shifts,
                      status: [job.locum_status,],
                      jobs: [job,],
                    })
                  }
                }
              }
            })
          }

          if (jobParts.length > 0) {
            jobParts.forEach(jobPart => {
              if (jobPart.dates.includes(days.fullDate)) {
                if (jobsInMonth.length === 0) {
                  let shifts = []
                  // if (jobPart.job.shifts.length) {
                  // 	jobPart.job.shifts.forEach(shift => {
                  // 		shifts.push(shift.name);
                  // 	});
                  // }
                  let shiftSchedule = jobPart.schedules.filter(
                    item => item.date === days.fullDate
                  )
                  if (shiftSchedule.length) {
                    shiftSchedule.forEach(sched => {
                      if (!shifts.includes(sched.shift.name)) {
                        shifts.push(sched.shift.name)
                      }
                    })
                  }
                  jobsInMonth.push({
                    date: days.fullDate,
                    shifts: shifts,
                    status: [jobPart.locum_status,],
                    jobs: [jobPart,],
                  })
                } else {
                  let dateExist = jobsInMonth.find(
                    item => item.date === days.fullDate
                  )
                    ? true
                    : false
                  if (dateExist) {
                    let findDate = jobsInMonth.find(
                      item => item.date === days.fullDate
                    )

                    let shiftSchedule = jobPart.schedules.filter(
                      item => item.date === days.fullDate
                    )
                    if (shiftSchedule.length) {
                      shiftSchedule.forEach(sched => {
                        if (!findDate.shifts.includes(sched.shift.name)) {
                          findDate.shifts.push(sched.shift.name)
                        }
                      })
                    }
                    if (!findDate.status.includes(jobPart.locum_status)) {
                      findDate.status.push(jobPart.locum_status)
                    }
                    findDate.jobs.push(jobPart)
                  } else {
                    let shifts = []
                    let shiftSchedule = jobPart.schedules.filter(
                      item => item.date === days.fullDate
                    )
                    if (shiftSchedule.length) {
                      shiftSchedule.forEach(sched => {
                        if (!shifts.includes(sched.shift.name)) {
                          shifts.push(sched.shift.name)
                        }
                      })
                    }
                    jobsInMonth.push({
                      date: days.fullDate,
                      shifts: shifts,
                      status: [jobPart.locum_status,],
                      jobs: [jobPart,],
                    })
                  }
                }
              }
            })
          }


          if (this.getLocumPermanentJobs.length > 0) {
            this.getLocumPermanentJobs.forEach(item => {
              if (
                this.getDateArray(
                  item.date_time_start,
                  item.date_time_end
                ).includes(days.fullDate)
              ) {
                if (jobsInMonth.length === 0) {
                  jobsInMonth.push({
                    date: days.fullDate,
                    shifts: [],
                    status: [],
                    jobs: [item,],
                  })
                } else {
                  let dateExist = jobsInMonth.find(
                    item => item.date === days.fullDate
                  )
                    ? true
                    : false
                  if (dateExist) {
                    let findDate = jobsInMonth.find(
                      item => item.date === days.fullDate
                    )
                    findDate.jobs.push(item)
                  } else {
                    jobsInMonth.push({
                      date: days.fullDate,
                      shifts: [],
                      status: [],
                      jobs: [item,],
                    })
                  }
                }
              }
            })
          }

        })

        jobsInMonth.forEach((dateInCalendar) => {
          dateInCalendar.dateUnavailabilities = dateInCalendar.dateUnavailabilities || []
        })

        this.locumUnavailabilities.forEach((locumUnavailability) => {
          if (locumUnavailability.shifts.length) {
            const dateInCalendar = jobsInMonth.find(dateInCalendar => dateInCalendar.date === locumUnavailability.date)

            if (dateInCalendar) {
              dateInCalendar.dateUnavailabilities.push(locumUnavailability)

              // locumUnavailability.shifts.forEach((shift) => {
              //   if (!dateInCalendar.shifts.includes(shift.name)) {
              //     dateInCalendar.shifts.push(shift.name)
              //   }
              // })
            } else {
              jobsInMonth.push({
                date: locumUnavailability.date,
                // shifts: locumUnavailability.shifts.map((shift) => shift.name),
                shifts: [],
                status: [],
                jobs: [],
                dateUnavailabilities: [locumUnavailability,],
              })
            }
          }
        })
      }

      console.log("jobsInMonth", jobsInMonth)

      return jobsInMonth
    },
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
    },

    view_permanent_jobs () {
      if (this.$auth.user.domain === "Locum") {
        this.getJobs()
      }
    },
  },

  mounted () {
    if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
      this.$socket.on(
        "Locum Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Locum Notification Job Unqualified",
        this.jobsRealTimeHandler
      )
    }

    if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
      this.$socket.on(
        "Practice Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Application",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Application Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Update Accept",
        this.jobsRealTimeHandler
      )
      this.$socket.on(
        "Practice Notification Job Unfilled",
        this.jobsRealTimeHandler
      )
    }

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

  destroyed () {
    if (this.$auth.loggedIn && this.$auth.user.domain === "Locum") {
      this.$socket.removeListener(
        "Locum Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Locum Notification Job Unqualified",
        this.jobsRealTimeHandler
      )
    }

    if (this.$auth.loggedIn && this.$auth.user.domain === "Practice") {
      this.$socket.removeListener(
        "Practice Notification Job Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Application",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Application Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Allocated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Ongoing",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Locum Invoice Updated",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Cancelled",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Amended",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Auto Declined",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Update Accept",
        this.jobsRealTimeHandler
      )
      this.$socket.removeListener(
        "Practice Notification Job Unfilled",
        this.jobsRealTimeHandler
      )
    }
  },

  methods: {
    async jobsRealTimeHandler (job) {
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

    getJobs () {
      this.$emit(
        "getCalendarJobAndJobParts",
        this.startOfMonth,
        this.endOfMonth
      )
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
          fullDate: this.$moment(day).format("YYYY-MM-DD"),
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

      const selectedDate = this.$moment(
        this.$store.state.calendar.selected_date,
        "YYYY-MM-DD"
      )
        .set("month", this.selectedMonth)
        .set("year", this.selectedYear)
        .format("YYYY-MM-DD")

      this.$store.commit("calendar/SELECT_DATE", selectedDate)
    },

    getActivities (date) {
      if (!this.hasEvent.includes(date)) {
        this.hasEvent.push(date)
      }
    },
  },
}
</script>

<style scoped>
.date {
	min-height: 2em;
	min-width: 90%;
}

.date-color {
	color: #45494d;
}

.message-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	z-index: 60;
}

.shield {
  z-index: 55;
}

@media (min-width: 375px) {
	.date {
		min-width: 2.4em;
	}
}

@media (min-width: 480px) {
	.date {
		min-width: 3em;
	}
}

@media (min-width: 640px) {
	.date {
		min-width: 4em;
	}
}

@media (min-width: 768px) {
	.message-modal {
		min-width: 550px;
	}
	.date {
		min-height: 4em;
		min-width: 5em;
	}
}
</style>
