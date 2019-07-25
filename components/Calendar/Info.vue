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
      <div v-for="(item, index) in foundPracticeCurrentJobs" :key="`${index}-${item.id}`">
        <PracticeCurrentJobCard
          @viewPracticeAllocatedJob="$emit('viewPracticeAllocatedJob', $event)"
          :job="item"
        />
      </div>
      <div v-for="(item, index) in foundPracticeAppliedJobs" :key="`${index}-${item.id}`">
        <PracticeAppliedJobCard
          @viewPracticeAppliedJob="$emit('viewPracticeAppliedJob', $event)"
          :job="item"
        />
      </div>
      <div v-for="(item, index) in foundPracticeUnfilledJobs" :key="`${index}-${item.id}`">
        <PracticeUnfilledJobCard
          @viewPracticeUnfilledJob="$emit('viewPracticeUnfilledJob', $event)"
          :job="item"
        />
      </div>
      <div v-for="(item, index) in foundPracticeDeclinedJobs" :key="`${index}-${item.id}`">
        <PracticeDeclinedJobCard
          @viewPracticeDeclinedJob="$emit('viewPracticeDeclinedJob', $event)"
          :job="item"
        />
      </div>
      <div v-for="(item, index) in foundPracticeAppliedJobsReminder" :key="`${index}-${item.id}`">
        <PracticeAppliedJobReminderCard
          @viewPracticeAppliedJob="$emit('viewPracticeAppliedJob', $event)"
          :job="item"
        />
      </div>
      <div v-for="(item, index) in foundPracticeAvailableJobsReminder" :key="`${index}-${item.id}`">
        <PracticeAvailableJobReminderCard
          @viewPracticeLiveJob="$emit('viewPracticeLiveJob', $event)"
          :job="item"
        />
      </div>
      <!-- locums -->
      <div v-for="(item, index) in foundLocumPrivateJobs" :key="`${index}-${item.id}`">
        <LocumPrivateJobCard @viewAppointmentJob="$emit('viewAppointmentJob', $event)" :job="item" />
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
        <LocumUnavailabilitiesCard :job="item" />
      </div>
      <!-- </transition-group> -->
    </div>
  </div>
</template>
<script>
// practice
import PracticeCurrentJobCard from '@/components/Calendar/Cards/PracticeCurrentJobCard'
import PracticeAppliedJobCard from '@/components/Calendar/Cards/PracticeAppliedJobCard'
import PracticeUnfilledJobCard from '@/components/Calendar/Cards/PracticeUnfilledJobCard'
import PracticeDeclinedJobCard from '@/components/Calendar/Cards/PracticeDeclinedJobCard'
import PracticeAppliedJobReminderCard from '@/components/Calendar/Cards/PracticeAppliedJobReminderCard'
import PracticeAvailableJobReminderCard from '@/components/Calendar/Cards/PracticeAvailableJobReminderCard'
// locums
import LocumPrivateJobCard from '@/components/Calendar/Cards/LocumPrivateJobCard'
import LocumCurrentJobCard from '@/components/Calendar/Cards/LocumCurrentJobCard'
import LocumAppliedJobCard from '@/components/Calendar/Cards/LocumAppliedJobCard'
import LocumUnavailabilitiesCard from '@/components/Calendar/Cards/LocumUnavailabilitiesCard'
export default {
  components: {
    // practice
    PracticeCurrentJobCard,
    PracticeAppliedJobCard,
    PracticeUnfilledJobCard,
    PracticeDeclinedJobCard,
    PracticeAppliedJobReminderCard,
    PracticeAvailableJobReminderCard,
    // locums
    LocumPrivateJobCard,
    LocumCurrentJobCard,
    LocumAppliedJobCard,
    LocumUnavailabilitiesCard,
  },
  data() {
    return {
      // practice
      foundPracticeCurrentJobs: [],
      foundPracticeAppliedJobs: [],
      foundPracticeUnfilledJobs: [],
      foundPracticeDeclinedJobs: [],
      foundPracticeAppliedJobsReminder: [],
      foundPracticeAvailableJobsReminder: [],
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
      // // ! fix practice job card
      // this.date_info = value.date
      // this.foundLocumPrivateJobs = []
      // this.foundLocumCurrentJobs = []
      // this.foundLocumAppliedJobs = []
      // this.foundLocumUnavailabilities = []
      // this.foundPracticeCurrentJobs = []
      // this.foundPracticeAppliedJobs = []
      // this.foundPracticeUnfilledJobs = []
      // this.foundPracticeDeclinedJobs = []
      // this.foundPracticeAppliedJobsReminder = []
      // this.foundPracticeAvailableJobsReminder = []
      if (this.$auth.user.domain === 'Practice') {
        this.findPerWeek(value)
      }
      if (this.$auth.user.domain === 'Locum') {
        this.findPerWeekLocum(value)
      }
    },
    // practice
    getPracticeAllocatedJobs(value) {
      this.findPerMonth(this.selected_date)
    },
    getPracticeAppliedJobs(value) {
      this.findPerMonth(this.selected_date)
    },
    getPracticeUnfilledJobs(value) {
      this.findPerMonth(this.selected_date)
    },
    getPracticeDeclinedJobs(value) {
      this.findPerMonth(this.selected_date)
    },
    getPracticeAvailableJobsReminder(value) {
      this.findPerMonth(this.selected_date)
    },
    getPracticeAppliedJobsReminder(value) {
      this.findPerMonth(this.selected_date)
    },
    // locum
    getLocumAllocatedPrivateJobs(value) {
      this.findPerMonthLocum(this.selected_date)
    },
    getLocumAllocatedCurrentJobs(value) {
      this.findPerMonthLocum(this.selected_date)
    },
    getLocumAppliedJobs(value) {
      this.findPerMonthLocum(this.selected_date)
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
    getPracticeAllocatedJobs() {
      return this.$store.getters['jobs/getPracticeAllocatedJobs']
    },
    getPracticeAppliedJobs() {
      return this.$store.getters['jobs/getPracticeAppliedJobs']
    },
    getPracticeUnfilledJobs() {
      return this.$store.getters['jobs/getPracticeUnfilledJobs']
    },
    getPracticeDeclinedJobs() {
      return this.$store.getters['jobs/getPracticeDeclinedJobs']
    },
    getPracticeAvailableJobsReminder() {
      return this.$store.getters['jobs/getPracticeAvailableJobsReminder']
    },
    getPracticeAppliedJobsReminder() {
      return this.$store.getters['jobs/getPracticeAppliedJobsReminder']
    },
    // locums
    getLocumAllocatedPrivateJobs() {
      return this.$store.getters['jobs/getLocumAllocatedPrivateJobs']
    },
    getLocumAllocatedCurrentJobs() {
      return this.$store.getters['jobs/getLocumAllocatedCurrentJobs']
    },
    getLocumAppliedJobs() {
      return this.$store.getters['jobs/getLocumAppliedJobs']
    },
    getLocumUnavailabilities() {
      return this.$store.getters['jobs/getLocumUnavailabilities']
    },
  },
  methods: {
    // practice
    findPerMonth(date) {
      if (this.getPracticeAllocatedJobs.length > 0) {
        this.foundPracticeCurrentJobs = this.getPracticeAllocatedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.getPracticeAppliedJobs.length > 0) {
        this.foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        this.foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.getPracticeDeclinedJobs.length > 0) {
        this.foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(job => job.platform_job.declined_at === date)
      }
      if (this.getPracticeAppliedJobsReminder.length > 0) {
        this.foundPracticeAppliedJobsReminder = this.getPracticeAppliedJobsReminder.filter(job => job.platform_job.selection_date === date)
      }
      if (this.getPracticeAvailableJobsReminder.length > 0) {
        this.foundPracticeAvailableJobsReminder = this.getPracticeAvailableJobsReminder.filter(job => job.platform_job.selection_date === date)
      }
    },
    findPerWeek({ date, shift }) {
      if (this.getPracticeAllocatedJobs.length > 0) {
        this.foundPracticeCurrentJobs = this.getPracticeAllocatedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.getPracticeAppliedJobs.length > 0) {
        this.foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        this.foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.getPracticeDeclinedJobs.length > 0) {
        this.foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.getPracticeAvailableJobsReminder.length > 0) {
        this.foundPracticeAvailableJobsReminder = this.getPracticeAvailableJobsReminder.filter(job => job.platform_job.selection_date === date)
      }
      if (this.getPracticeAppliedJobsReminder.length > 0) {
        this.foundPracticeAppliedJobsReminder = this.getPracticeAppliedJobsReminder.filter(job => job.platform_job.selection_date === date)
      }
    },
    // locums
    findPerMonthLocum(date) {
      this.foundLocumPrivateJobs = this.getLocumAllocatedPrivateJobs.filter(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date))
      this.foundLocumCurrentJobs = this.getLocumAllocatedCurrentJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      this.foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      this.foundLocumUnavailabilities = this.getLocumUnavailabilities.filter(job => job.date === date)
    },
    findPerWeekLocum({ date, shift }) {
      if (this.getLocumAllocatedPrivateJobs.length > 0) {
        this.foundLocumPrivateJobs = this.getLocumAllocatedPrivateJobs.filter(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date) && job.private_job.shift.name === shift)
      }
      if (this.getLocumAllocatedCurrentJobs.length > 0) {
        this.foundLocumCurrentJobs = this.getLocumAllocatedCurrentJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.getLocumAppliedJobs.length > 0) {
        this.foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && shift === 'Available')
      }
      if (this.getLocumUnavailabilities.length > 0) {
        this.foundLocumUnavailabilities = this.getLocumUnavailabilities.filter(job => job.date === date && job.shifts.map(shift => shift.name).includes(shift))
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


