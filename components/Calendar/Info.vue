<template>
  <div class="info-section h-full rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
    <div
      class="text-white text-xs sm:text-sm py-4 px-8"
    >{{$moment(date_info || selected_date).format('Do MMM, YYYY')}}</div>
    <div class="flex flex-col overflow-y-auto px-8 h-full info-card">
      <transition name="slide" mode="out-in">
        <div
          class="mt-4 text-xl text-white"
          v-if="!viewPracticeJobs"
          key="'no-jobs'"
        >No jobs to display.</div>
        <div v-if="viewPracticeJobs">
          <div v-for="job in foundPracticeJobs" :key="job.id">
            <PracticeJobCard :job="job" @viewPracticeJob="$emit('viewPracticeJob', $event)" />
          </div>
        </div>
        <!-- locums -->
        <!-- <div v-for="(item, index) in foundLocumPrivateJobs" :key="`${index}-${item.id}`">
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
        </div>-->
      </transition>
    </div>
  </div>
</template>
<script>
// practice
import PracticeJobCard from '@/components/Calendar/Cards/PracticeJobCard'
// locums
import LocumPrivateJobCard from '@/components/Calendar/Cards/LocumPrivateJobCard'
import LocumCurrentJobCard from '@/components/Calendar/Cards/LocumCurrentJobCard'
import LocumAppliedJobCard from '@/components/Calendar/Cards/LocumAppliedJobCard'
import LocumUnavailabilitiesCard from '@/components/Calendar/Cards/LocumUnavailabilitiesCard'
export default {
  components: {
    // practice
    PracticeJobCard,
    // locums
    LocumPrivateJobCard,
    LocumCurrentJobCard,
    LocumAppliedJobCard,
    LocumUnavailabilitiesCard,
  },
  data() {
    return {
      // practice
      foundPracticeJobs: [],
      viewPracticeJobs: false,
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
      this.findPerMonthPractice(this.selected_date)
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
        this.findPerMonthPractice(value)
        return
      }
      if (this.$auth.user.domain === 'Locum') {
        this.findPerMonthLocum(value)
        return
      }
    },
    selected_date_shift(value) {
      if (this.$auth.user.domain === 'Practice') {
        this.findPerWeekPractice(value)
      }
      if (this.$auth.user.domain === 'Locum') {
        this.findPerWeekLocum(value)
      }
    },
    // practice
    getPracticeAllocatedJobs(value) {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeAppliedJobs(value) {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeUnfilledJobs(value) {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeDeclinedJobs(value) {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeAvailableJobsReminder(value) {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeAppliedJobsReminder(value) {
      this.findPerMonthPractice(this.selected_date)
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
    findPerMonthPractice(date) {
      this.viewPracticeJobs = false
      let foundPracticeCurrentJobs = []
      let foundPracticeAppliedJobs = []
      let foundPracticeUnfilledJobs = []
      let foundPracticeDeclinedJobs = []
      let foundPracticeAppliedJobsReminder = []
      let foundPracticeAvailableJobsReminder = []

      if (this.getPracticeAllocatedJobs.length > 0) {
        foundPracticeCurrentJobs = this.getPracticeAllocatedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.getPracticeAppliedJobs.length > 0) {
        foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.getPracticeDeclinedJobs.length > 0) {
        foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(job => job.platform_job.declined_at === date)
      }
      if (this.getPracticeAppliedJobsReminder.length > 0) {
        foundPracticeAppliedJobsReminder = this.getPracticeAppliedJobsReminder.filter(job => job.platform_job.selection_date === date)
      }
      if (this.getPracticeAvailableJobsReminder.length > 0) {
        foundPracticeAvailableJobsReminder = this.getPracticeAvailableJobsReminder.filter(job => job.platform_job.selection_date === date)
      }
      this.foundPracticeJobs = [
        ...foundPracticeCurrentJobs, ...foundPracticeAppliedJobs, ...foundPracticeUnfilledJobs,
        ...foundPracticeDeclinedJobs, ...foundPracticeAppliedJobsReminder, ...foundPracticeAvailableJobsReminder
      ]
      if (this.foundPracticeJobs.length > 0) {
        setTimeout(() => {
          this.viewPracticeJobs = true
        }, 500)
      }
    },
    findPerWeekPractice({ date, shift }) {
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
.info-card {
  height: 300px;
}
@media screen and (min-width: 768px) {
  .info-card {
    height: 600px;
  }
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


