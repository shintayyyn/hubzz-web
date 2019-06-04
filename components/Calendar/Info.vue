<template>
  <div class="rounded-br-lg rounded-bl-lg md:rounded-bl-none md:rounded-r-lg info-section h-full">
    <div
      class="text-white text-xs xl:text-base py-4 px-8"
    >{{$moment(selected_date).format('Do MMM, YYYY')}}</div>
    <div class="flex flex-col overflow-y-auto px-8 h-full info-card">
      <template v-for="(item, index) in foundLiveJobs">
        <LiveJobCard :job="item" :key="`${index}-${item.id}`"/>
      </template>
      <template v-for="item in foundAppliedJobs">
        <AppliedJobCard :job="item" :key="item.id"/>
      </template>
    </div>
  </div>
</template>
<script>
import LiveJobCard from '@/components/Calendar/Cards/LiveJobCard'
import AppliedJobCard from '@/components/Calendar/Cards/AppliedJobCard'
export default {
  components: {
    LiveJobCard,
    AppliedJobCard,
  },
  data() {
    return {
      foundLiveJobs: [],
      foundAppliedJobs: []
    }
  },
  watch: {
    selected_date(value) {
      if (this.$auth.user.domain === 'Practice') {
        this.findPerMonth(value)
      }
    },
    selected_date_shift(value) {
      if (this.$auth.user.domain === 'Practice') {
        this.findPerWeek(value)
      }
    }
  },
  computed: {
    selected_date() {
      return this.$store.state.calendar.selected_date
    },
    selected_date_shift() {
      return this.$store.state.calendar.selected_date_shift
    },
    // practice
    jobs() {
      return this.$store.state.calendar.jobs
    },
    applied_jobs() {
      return this.$store.state.calendar.applied_jobs_with_selection_date
    },
  },
  methods: {
    findPerMonth(date) {
      // get all jobs based on selected date
      if (this.jobs.length > 0) {
        this.foundLiveJobs = this.jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      // get all applied jobs based on selected date
      if (this.applied_jobs.length > 0) {
        this.foundAppliedJobs = this.applied_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(job.platform_job.selection_date))
      }
    },
    findPerWeek({ date, shift }) {
      // get all jobs based on selected date and shift
      if (this.jobs.length > 0) {
        this.foundLiveJobs = this.jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
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
    edit(item) {
      this.$store.commit('dashboard/SET_EDIT_APPOINTMENT_DATE', item)
      this.$store.commit('TOGGLE_APPOINTMENT_MODAL', true)
    },

  }
}
</script>
<style scoped>
/* .slide-info-enter-active,
.slide-info-leave-active {
  transition: all 0.1s ease-in-out;
}
.slide-info-enter,
.slide-info-leave-to {
  transform: translateX(10px);
} */
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


