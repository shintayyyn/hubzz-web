<template>
  <div class="info-section h-full rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
    <div
      class="text-white text-xs sm:text-sm py-4 px-8"
    >{{$moment(date_info || selected_date).format('Do MMM, YYYY')}}</div>
    <div class="flex flex-col overflow-y-auto px-8 h-full info-card">
      <!-- practice -->
      <template v-for="(item, index) in foundLiveJobs">
        <LiveJobCard :job="item" :key="`${index}-${item.id}`"/>
      </template>
      <template v-for="item in foundAppliedJobs">
        <AppliedJobCard :job="item" :key="item.id"/>
      </template>
      <template v-for="item in foundUnfilledJobs">
        <UnfilledJobCard :job="item" :key="item.id"/>
      </template>
      <template v-for="item in foundDeclinedJobs">
        <DeclinedJobCard :job="item" :key="item.id"/>
      </template>
      <!-- locums -->
      <template v-for="(item, index) in foundAppointmentJobs">
        <AppointmentJobCard
          @update="$emit('update', $event)"
          :job="item"
          :key="`${index}-${item.id}`"
        />
      </template>
      <template v-for="(item, index) in foundLocumJobs">
        <LocumJobCard :job="item" :key="`${index}-${item.id}`"/>
      </template>
      <template v-for="(item, index) in foundUnavailabilities">
        <UnavailabilitiesCard :job="item" :key="`${index}-${item.id}`"/>
      </template>
    </div>
  </div>
</template>
<script>
// practice
import LiveJobCard from '@/components/Calendar/Cards/LiveJobCard'
import AppliedJobCard from '@/components/Calendar/Cards/AppliedJobCard'
import UnfilledJobCard from '@/components/Calendar/Cards/UnfilledJobCard'
import DeclinedJobCard from '@/components/Calendar/Cards/DeclinedJobCard'
// locums
import AppointmentJobCard from '@/components/Calendar/Cards/AppointmentJobCard'
import LocumJobCard from '@/components/Calendar/Cards/LocumJobCard'
import UnavailabilitiesCard from '@/components/Calendar/Cards/UnavailabilitiesCard'
export default {
  components: {
    // locums
    LiveJobCard,
    AppliedJobCard,
    UnfilledJobCard,
    DeclinedJobCard,
    // practice
    AppointmentJobCard,
    LocumJobCard,
    UnavailabilitiesCard,
  },
  data() {
    return {
      // practice
      foundLiveJobs: [],
      foundAppliedJobs: [],
      foundUnfilledJobs: [],
      foundDeclinedJobs: [],
      // locums
      foundAppointmentJobs: [],
      foundLocumJobs: [],
      foundUnavailabilities: [],
      date_info: null
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
      this.date_info = value.date
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
    unfilled_jobs() {
      return this.$store.state.calendar.unfilled_jobs
    },
    declined_jobs() {
      return this.$store.state.calendar.declined_jobs
    },
    // locums
    appointment_jobs() {
      return this.$store.state.calendar.appointment_jobs
    },
    locum_jobs() {
      return this.$store.state.calendar.locum_jobs
    },
    unavailabilities() {
      return this.$store.state.calendar.unavailabilities
    }
  },
  methods: {
    // practice
    findPerMonth(date) {
      if (this.jobs.length > 0) {
        this.foundLiveJobs = this.jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.applied_jobs.length > 0) {
        this.foundAppliedJobs = this.applied_jobs.filter(job => job.platform_job.selection_date == date)
      }
      if (this.unfilled_jobs.length > 0) {
        this.foundUnfilledJobs = this.unfilled_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.declined_jobs.length > 0) {
        this.foundDeclinedJobs = this.declined_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }

    },
    findPerWeek({ date, shift }) {
      if (this.jobs.length > 0) {
        this.foundLiveJobs = this.jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.unfilled_jobs.length > 0) {
        this.foundUnfilledJobs = this.unfilled_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      if (this.declined_jobs.length > 0) {
        this.foundDeclinedJobs = this.declined_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date) && job.platform_job.shift.name === shift)
      }
      // get all applied jobs based on selected date and shift
      // ! 
      // if (this.applied_jobs && this.applied_jobs.length > 0) {
      //   this.foundAppliedJobs = this.applied_jobs.filter(job => job.platform_job.selection_date === date && job.platform_job.shift.name === shift)
      // }
    },
    // locums
    findPerMonthLocum(date) {
      if (this.appointment_jobs.length > 0) {
        this.foundAppointmentJobs = this.appointment_jobs.filter(job => this.getDateArray(job.private_job.date_start, job.private_job.date_end).includes(date))
      }
      if (this.locum_jobs.length > 0) {
        this.foundLocumJobs = this.locum_jobs.filter(job => this.getDateArray(job.platform_job.date_start, job.platform_job.date_end).includes(date))
      }
      if (this.unavailabilities.length > 0) {
        this.foundUnavailabilities = this.unavailabilities.filter(job => job.date === date)
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


