<template>
  <div class="info-section h-full rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
    <div
      class="text-white text-xs sm:text-sm py-4 px-8"
    >{{$moment(date_info || selected_date).format('Do MMM, YYYY')}}</div>
    <div class="flex flex-col overflow-y-auto px-8 h-full info-card">
      <!-- <transition-group name="fade-card"> -->
      <div
        class="mt-4 text-xl text-white"
        v-if="noJobsToDisplay"
        key="'no-jobs'"
      >No jobs to display.</div>
      <div v-for="(item, index) in foundPracticeAvailableJobs" :key="`${index}-${item.id}`">
        <PracticeAvailableJobCard :job="item"/>
      </div>
      <div v-for="item in foundPracticeAppliedJobs" :key="item.id">
        <PracticeAppliedJobCard :job="item"/>
      </div>
      <div v-for="item in foundPracticeUnfilledJobs" :key="item.id">
        <PracticeUnfilledJobCard :job="item"/>
      </div>
      <div v-for="item in foundPracticeDeclinedJobs" :key="item.id">
        <PracticeDeclinedJobCard :job="item"/>
      </div>
      <!-- locums -->
      <div v-for="(item, index) in foundLocumPrivateJobs" :key="`${index}-${item.id}`">
        <LocumPrivateJobCard @viewAppointmentJob="$emit('viewAppointmentJob', $event)" :job="item"/>
      </div>
      <div v-for="(item, index) in foundLocumCurrentJobs" :key="`${index}-${item.id}`">
        <LocumCurrentJobCard
          @viewLocumCurrentJob="$emit('viewLocumCurrentJob', $event)"
          :job="item"
        />
      </div>
      <div v-for="(item, index) in foundLocumAppliedJobs" :key="`${index}-${item.id}`">
        <LocumAppliedJobCard
          @viewLocumAppliedJob="$emit('viewLocumAppliedJob', $event)"
          :job="item"
        />
      </div>

      <div v-for="(item, index) in foundLocumUnavailabilities" :key="`${index}-${item.id}`">
        <LocumUnavailabilitiesCard :job="item"/>
      </div>
      <!-- </transition-group> -->
    </div>
  </div>
</template>
<script>
// practice
import PracticeAvailableJobCard from '@/components/Calendar/Cards/PracticeAvailableJobCard'
import PracticeAppliedJobCard from '@/components/Calendar/Cards/PracticeAppliedJobCard'
import PracticeUnfilledJobCard from '@/components/Calendar/Cards/PracticeUnfilledJobCard'
import PracticeDeclinedJobCard from '@/components/Calendar/Cards/PracticeDeclinedJobCard'
// locums
import LocumPrivateJobCard from '@/components/Calendar/Cards/LocumPrivateJobCard'
import LocumCurrentJobCard from '@/components/Calendar/Cards/LocumCurrentJobCard'
import LocumAppliedJobCard from '@/components/Calendar/Cards/LocumAppliedJobCard'
import LocumUnavailabilitiesCard from '@/components/Calendar/Cards/LocumUnavailabilitiesCard'
export default {
  components: {
    // practice
    PracticeAvailableJobCard,
    PracticeAppliedJobCard,
    PracticeUnfilledJobCard,
    PracticeDeclinedJobCard,
    // locums
    LocumPrivateJobCard,
    LocumCurrentJobCard,
    LocumAppliedJobCard,
    LocumUnavailabilitiesCard,
  },
  data() {
    return {
      // practice
      foundPracticeAvailableJobs: [],
      foundPracticeAppliedJobs: [],
      foundPracticeUnfilledJobs: [],
      foundPracticeDeclinedJobs: [],
      // locums
      foundLocumPrivateJobs: [],
      foundLocumCurrentJobs: [],
      foundLocumAppliedJobs: [],
      foundLocumUnavailabilities: [],
      // 
      date_info: null
    }
  },
  created() {
    if (this.$auth.user.domain === 'Practice') {
      this.findPerMonth(this.selected_date)
      return
    }
    if (this.$auth.user.domain === 'Locum') {
      this.findPerMonthLocum(this.selected_date)
      return
    }
  },
  watch: {
    selected_date(value) {
      this.date_info = value
      if (this.$auth.user.domain === 'Practice') {
        this.findPerMonth(value)
        return
      }
      if (this.$auth.user.domain === 'Locum') {
        this.findPerMonthLocum(value)
        return
      }
    },
    selected_date_shift(value) {
      // ! fix practice job card
      this.date_info = value.date
      this.foundLocumPrivateJobs = []
      this.foundLocumCurrentJobs = []
      this.foundLocumAppliedJobs = []
      this.foundLocumUnavailabilities = []
      this.foundPracticeAvailableJobs = []
      this.foundPracticeAppliedJobs = []
      this.foundPracticeUnfilledJobs = []
      this.foundPracticeDeclinedJobs = []
      if (this.$auth.user.domain === 'Practice') {
        this.findPerWeek(value)
      }
      if (this.$auth.user.domain === 'Locum') {
        this.findPerWeekLocum(value)
      }
    },
  },
  computed: {
    selected_date() {
      return this.$store.state.calendar.selected_date
    },
    selected_date_shift() {
      return this.$store.state.calendar.selected_date_shift
    },
    noJobsToDisplay() {
      if (this.$auth.user.domain === 'Locum') {
        return !this.foundLocumPrivateJobs.length &&
          !this.foundLocumCurrentJobs.length &&
          !this.foundLocumAppliedJobs.length &&
          !this.foundLocumUnavailabilities.length
      }
    },
    // practice
    practice_available_jobs() {
      return this.$store.state.calendar.practice_available_jobs
    },
    practice_available_jobs_reminder() {
      return this.$store.state.calendar.practice_available_jobs_reminder
    },
    practice_applied_jobs() {
      return this.$store.state.calendar.practice_applied_jobs
    },
    practice_applied_jobs_reminder() {
      return this.$store.state.calendar.practice_applied_jobs_reminder
    },
    practice_unfilled_jobs() {
      return this.$store.state.calendar.practice_unfilled_jobs
    },
    practice_declined_jobs() {
      return this.$store.state.calendar.practice_declined_jobs
    },
    // locums
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
    }
  },
  methods: {
    // practice
    findPerMonth(date) {
      if (this.practice_available_jobs.length > 0) {
        this.foundPracticeAvailableJobs = this.practice_available_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.practice_applied_jobs.length > 0) {
        this.foundPracticeAppliedJobs = this.practice_applied_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.practice_unfilled_jobs.length > 0) {
        this.foundPracticeUnfilledJobs = this.practice_unfilled_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.practice_declined_jobs.length > 0) {
        this.foundPracticeDeclinedJobs = this.practice_declined_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
    },
    findPerWeek({ date, shift }) {
      if (this.practice_available_jobs.length > 0) {
        this.foundPracticeAvailableJobs = this.practice_available_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.unfilled_jobs.length > 0) {
        this.foundPracticeUnfilledJobs = this.unfilled_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.declined_jobs.length > 0) {
        this.foundPracticeDeclinedJobs = this.declined_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      // get all applied jobs based on selected date and shift
      // ! 
      // if (this.applied_jobs && this.applied_jobs.length > 0) {
      //   this.foundPracticeAppliedJobs = this.applied_jobs.filter(job => job.platform_job.selection_date === date && job.platform_job.shift.name === shift)
      // }
    },
    // locums
    findPerMonthLocum(date) {
      if (this.locum_private_jobs.length > 0) {
        this.foundLocumPrivateJobs = this.locum_private_jobs.filter(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date))
      }
      if (this.locum_current_jobs.length > 0) {
        this.foundLocumCurrentJobs = this.locum_current_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.locum_applied_jobs.length > 0) {
        this.foundLocumAppliedJobs = this.locum_applied_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.locum_unavailabilities.length > 0) {
        this.foundLocumUnavailabilities = this.locum_unavailabilities.filter(job => job.date === date)
      }
    },
    findPerWeekLocum({ date, shift }) {
      if (this.locum_private_jobs.length > 0) {
        this.foundLocumPrivateJobs = this.locum_private_jobs.filter(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date) && job.private_job.shift.name === shift)
      }
      if (this.locum_current_jobs.length > 0) {
        this.foundLocumCurrentJobs = this.locum_current_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.locum_applied_jobs.length > 0) {
        this.foundLocumAppliedJobs = this.locum_applied_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && shift === 'Available')
      }
      if (this.locum_unavailabilities.length > 0) {
        this.foundLocumUnavailabilities = this.locum_unavailabilities.filter(job => job.date === date && job.shifts.map(shift => shift.name).includes(shift))
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
<style scoped>
.info-section {
  background-image: url("/images/hubzz-bg.png");
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: lightgrey;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>


