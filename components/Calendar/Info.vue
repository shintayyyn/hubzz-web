<template>
  <div class="info-section h-full rounded-b-lg lg:rounded-b-none lg:rounded-r-lg pb-4">
    <div class="text-center leading-relaxed py-4">
      <p class="text-gray-900 quick-view text-sm">QUICK VIEW</p>
      <p
        class="text-white uppercase text-lg font-bold"
      >{{ $moment(dateInfo).format('Do MMMM, YYYY') }}</p>
    </div>
    <div class="flex flex-col overflow-y-auto overflow-x-hidden px-2 mx-2 h-full info-card">
      <transition name="slide" mode="out-in">
        <div
          v-if="!viewPracticeJobs && !viewLocumJobs && !loading"
          key="'no-jobs'"
          class="mt-4 text-white text-center"
        >No jobs to display.</div>
        <div v-if="viewPracticeJobs && !loading">
          <div v-for="job in foundPracticeJobs" :key="`${job.id}-${job.status}`">
            <PracticeJobCard :propJob="job" />
          </div>
        </div>
        <div v-if="viewLocumJobs && !loading">
          <div v-for="job in foundLocumJobs" :key="`${job.id}-${job.locum_status}`">
            <LocumJobCard :propJob="job" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import PracticeJobCard from "@/components/Calendar/Cards/PracticeJobCard";
import LocumJobCard from "@/components/Calendar/Cards/LocumJobCard";
export default {
  components: {
    PracticeJobCard,
    LocumJobCard
  },
  data() {
    return {
      foundPracticeJobs: [],
      viewPracticeJobs: false,
      foundLocumJobs: [],
      viewLocumJobs: false,
      loading: false
    };
  },
  computed: {
    view_type() {
      return this.$store.state.calendar.view_type;
    },
    dateInfo() {
      if (this.$store.state.calendar.view_type === "per_month") {
        return this.$store.state.calendar.selected_date;
      }
      return this.$store.state.calendar.selected_date_shift.date;
    },
    selected_date() {
      return this.$store.state.calendar.selected_date;
    },
    selected_date_shift() {
      return this.$store.state.calendar.selected_date_shift;
    },
    // PRACTICE
    // PARTS
    getPracticeOngoingJobs() {
      return this.$store.getters["jobs/getPracticeOngoingJobs"];
    },
    getPracticeCompletedJobs() {
      return this.$store.getters["jobs/getPracticeCompletedJobs"];
    },
    // WHOLE
    getPracticeAllocatedJobs() {
      return this.$store.getters["jobs/getPracticeAllocatedJobs"];
    },
    getPracticeAppliedJobs() {
      return this.$store.getters["jobs/getPracticeAppliedJobs"];
    },
    getPracticeUnfilledJobs() {
      return this.$store.getters["jobs/getPracticeUnfilledJobs"];
    },
    getPracticeDeclinedJobs() {
      return this.$store.getters["jobs/getPracticeDeclinedJobs"];
    },
    getPracticeAvailableJobs() {
      return this.$store.getters["jobs/getPracticeAvailableJobs"];
    },
    // REMINDERS
    getPracticeAvailableJobsReminder() {
      return this.$store.getters["jobs/getPracticeAvailableJobsReminder"];
    },
    getPracticeAppliedJobsReminder() {
      return this.$store.getters["jobs/getPracticeAppliedJobsReminder"];
    },
    // LOCUM
    // PARTS
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAppliedJobs() {
      return this.$store.getters["jobs/getLocumAppliedJobs"];
    },
    getLocumPrivateJobParts() {
      return this.$store.getters["jobs/getLocumPrivateJobParts"];
    }
  },
  watch: {
    view_type(value) {
      if (value === "per_month") {
        if (this.$auth.user.domain === "Practice") {
          this.findPerMonthPractice(this.$store.state.calendar.selected_date);
          return;
        }
        if (this.$auth.user.domain === "Locum") {
          this.findPerMonthLocum(this.$store.state.calendar.selected_date);
          return;
        }
      }
      if (value === "per_week") {
        if (this.$auth.user.domain === "Practice") {
          this.findPerWeekPractice(
            this.$store.state.calendar.selected_date_shift
          );
          return;
        }
        if (this.$auth.user.domain === "Locum") {
          this.findPerWeekLocum(this.$store.state.calendar.selected_date_shift);
          return;
        }
      }
    },
    selected_date(value) {
      this.date_info = value;
      if (this.$auth.user.domain === "Practice") {
        this.findPerMonthPractice(value);
        return;
      }
      if (this.$auth.user.domain === "Locum") {
        this.findPerMonthLocum(value);
        return;
      }
    },
    selected_date_shift(value) {
      // this.date_info_week = value.date
      if (this.$auth.user.domain === "Practice") {
        this.findPerWeekPractice(value);
      }
      if (this.$auth.user.domain === "Locum") {
        this.findPerWeekLocum(value);
      }
    }
  },
  created() {
    if (this.$auth.user.domain === "Practice") {
      this.findPerMonthPractice(this.selected_date);
      return;
    }
    if (this.$auth.user.domain === "Locum") {
      this.findPerMonthLocum(this.selected_date);
      return;
    }
  },
  methods: {
    includesWeekends(job, date) {
      let day = new Date(date).getDay();
      return (
        ((job.include_saturday === false && day !== 6) ||
          job.include_saturday === true) &&
        ((job.include_sunday === false && day !== 0) ||
          job.include_sunday === true)
      );
    },
    // PRACTICE
    findPerMonthPractice(date) {
      this.loading = true;
      this.viewPracticeJobs = false;
      let foundPracticeOngoingJobs = [];
      // let foundPracticeCompletedJobs = [];
      // let foundPracticeAllocatedJobs = [];
      let foundPracticeAppliedJobs = [];
      let foundPracticeUnfilledJobs = [];
      let foundPracticeDeclinedJobs = [];
      let foundPracticeAvailableJobs = [];
      // let foundPracticeAppliedJobsReminder = [];
      // let foundPracticeAvailableJobsReminder = [];
      // PARTS
      if (this.getPracticeOngoingJobs.length > 0) {
        foundPracticeOngoingJobs = this.getPracticeOngoingJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            this.includesWeekends(job.job, date)
        );
      }
      // if (this.getPracticeCompletedJobs.length > 0) {
      //   foundPracticeCompletedJobs = this.getPracticeCompletedJobs.filter(
      //     job =>
      //       this.getDateArray(job.date_start, job.date_end).includes(date) &&
      //       this.includesWeekends(job.job, date)
      //   );
      // }
      // WHOLE
      // if (this.getPracticeAllocatedJobs.length > 0) {
      //   foundPracticeAllocatedJobs = this.getPracticeAllocatedJobs.filter(
      //     job =>
      //       this.getDateArray(job.date_start, job.date_end).includes(date) &&
      //       this.includesWeekends(job, date)
      //   );
      // }
      if (this.getPracticeAppliedJobs.length > 0) {
        foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            this.includesWeekends(job, date)
        );
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            this.includesWeekends(job, date)
        );
      }
      if (this.getPracticeDeclinedJobs.length > 0) {
        foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            this.includesWeekends(job, date)
        );
      }
      // if (this.getPracticeAvailableJobs.length > 0) {
      //   foundPracticeAvailableJobs = this.getPracticeAvailableJobs.filter(
      //     job =>
      //       this.getDateArray(job.date_start, job.date_end).includes(date) &&
      //       this.includesWeekends(job, date)
      //   )
      // }
      // REMINDERS
      // if (this.getPracticeAppliedJobsReminder.length > 0) {
      //   foundPracticeAppliedJobsReminder = this.getPracticeAppliedJobsReminder.filter(
      //     job => job.platform_job.selection_date === date
      //   );
      //   foundPracticeAppliedJobsReminder = foundPracticeAppliedJobsReminder.map(
      //     item => {
      //       return {
      //         ...item,
      //         status: "AppliedReminder"
      //       };
      //     }
      //   );
      // }

      // if (this.getPracticeAvailableJobsReminder.length > 0) {
      //   foundPracticeAvailableJobsReminder = this.getPracticeAvailableJobsReminder.filter(
      //     job => job.platform_job.selection_date === date
      //   );
      //   foundPracticeAvailableJobsReminder = foundPracticeAvailableJobsReminder.map(
      //     item => {
      //       return {
      //         ...item,
      //         status: "AvailableReminder"
      //       };
      //     }
      //   );
      // }
      this.foundPracticeJobs = [
        ...foundPracticeOngoingJobs,
        // ...foundPracticeCompletedJobs,
        // ...foundPracticeAllocatedJobs,
        ...foundPracticeAppliedJobs,
        ...foundPracticeUnfilledJobs,
        ...foundPracticeDeclinedJobs
        // ...foundPracticeAvailableJobs,
        // ...foundPracticeAppliedJobsReminder,
        // ...foundPracticeAvailableJobsReminder
      ];

      if (this.foundPracticeJobs.length > 0) {
        setTimeout(() => {
          this.viewPracticeJobs = true;
        }, 500);
      }
      setTimeout(() => {
        this.loading = false;
      }, 600);
    },
    findPerWeekPractice({ date, shift }) {
      this.loading = true;
      this.viewPracticeJobs = false;
      let foundPracticeOngoingJobs = [];
      let foundPracticeCompletedJobs = [];
      let foundPracticeAllocatedJobs = [];
      let foundPracticeAppliedJobs = [];
      let foundPracticeUnfilledJobs = [];
      let foundPracticeDeclinedJobs = [];
      let foundPracticeAvailableJobs = [];
      let foundPracticeAppliedJobsReminder = [];
      let foundPracticeAvailableJobsReminder = [];
      // PARTS
      if (this.getPracticeOngoingJobs.length > 0) {
        foundPracticeOngoingJobs = this.getPracticeOngoingJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) &&
            job_part.job.shift.name === shift &&
            this.includesWeekends(job_part.job, date)
        );
      }
      // if (this.getPracticeCompletedJobs.length > 0) {
      //   foundPracticeCompletedJobs = this.getPracticeCompletedJobs.filter(
      //     job_part =>
      //       this.getDateArray(job_part.date_start, job_part.date_end).includes(
      //         date
      //       ) &&
      //       job_part.job.shift.name === shift &&
      //       this.includesWeekends(job_part.job, date)
      //   )
      // }
      // WHOLE
      // if (this.getPracticeAllocatedJobs.length > 0) {
      //   foundPracticeAllocatedJobs = this.getPracticeAllocatedJobs.filter(
      //     job =>
      //       this.getDateArray(job.date_start, job.date_end).includes(date) &&
      //       job.shift.name === shift &&
      //       this.includesWeekends(job, date)
      //   )
      // }
      if (this.getPracticeAppliedJobs.length > 0) {
        foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === shift &&
            this.includesWeekends(job, date)
        );
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === shift &&
            this.includesWeekends(job, date)
        );
      }
      if (this.getPracticeDeclinedJobs.length > 0) {
        foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === shift &&
            this.includesWeekends(job, date)
        );
      }
      // if (this.getPracticeAvailableJobs.length > 0) {
      //   foundPracticeAvailableJobs = this.getPracticeAvailableJobs.filter(
      //     job =>
      //       this.getDateArray(job.date_start, job.date_end).includes(date) &&
      //       job.shift.name === shift &&
      //       this.includesWeekends(job, date)
      //   )
      // }
      // REMINDERS
      // if (this.getPracticeAvailableJobsReminder.length > 0) {
      //   foundPracticeAvailableJobsReminder = this.getPracticeAvailableJobsReminder.filter(
      //     job => job.platform_job.selection_date === date
      //   )
      //   foundPracticeAvailableJobsReminder = foundPracticeAvailableJobsReminder.map(
      //     item => {
      //       return {
      //         ...item,
      //         status: "AppliedReminder"
      //       }
      //     }
      //   )
      // }
      // if (this.getPracticeAppliedJobsReminder.length > 0) {
      //   foundPracticeAppliedJobsReminder = this.getPracticeAppliedJobsReminder.filter(
      //     job => job.platform_job.selection_date === date
      //   )
      //   foundPracticeAppliedJobsReminder = foundPracticeAppliedJobsReminder.map(
      //     item => {
      //       return {
      //         ...item,
      //         status: "AvailableReminder"
      //       }
      //     }
      //   )
      // }
      this.foundPracticeJobs = [
        ...foundPracticeOngoingJobs,
        // ...foundPracticeCompletedJobs,
        // ...foundPracticeAllocatedJobs,
        ...foundPracticeAppliedJobs,
        ...foundPracticeUnfilledJobs,
        ...foundPracticeDeclinedJobs
        // ...foundPracticeAvailableJobs,
        // ...foundPracticeAppliedJobsReminder,
        // ...foundPracticeAvailableJobsReminder
      ];

      if (this.foundPracticeJobs.length > 0) {
        setTimeout(() => {
          this.viewPracticeJobs = true;
        }, 500);
      }
      setTimeout(() => {
        this.loading = false;
      }, 600);
    },
    // LOCUMS
    findPerMonthLocum(date) {
      this.viewLocumJobs = false;
      this.loading = true;
      let foundLocumOngoingJobs = [];
      let foundLocumAppliedJobs = [];
      let foundLocumPrivateJobs = [];

      if (this.getLocumOngoingJobs.length > 0) {
        foundLocumOngoingJobs = this.getLocumOngoingJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) && this.includesWeekends(job_part.job, date)
        );
      }
      if (this.getLocumAppliedJobs.length > 0) {
        foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            this.includesWeekends(job, date)
        );
      }
      if (this.getLocumPrivateJobParts.length > 0) {
        foundLocumPrivateJobs = this.getLocumPrivateJobParts.filter(job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          )
        );
      }

      this.foundLocumJobs = [
        ...foundLocumOngoingJobs,
        ...foundLocumAppliedJobs,
        ...foundLocumPrivateJobs
      ];
      if (this.foundLocumJobs.length > 0) {
        setTimeout(() => {
          this.viewLocumJobs = true;
        }, 500);
      }
      setTimeout(() => {
        this.loading = false;
      }, 600);
    },
    findPerWeekLocum({ date, shift }) {
      this.viewLocumJobs = false;
      this.loading = false;
      let foundLocumOngoingJobs = [];
      let foundLocumAppliedJobs = [];
      let foundLocumPrivateJobs = [];

      if (this.getLocumOngoingJobs.length > 0) {
        foundLocumOngoingJobs = this.getLocumOngoingJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) &&
            job_part.job.shift.name === shift &&
            this.includesWeekends(job_part.job, date)
        );
      }
      if (this.getLocumAppliedJobs.length > 0) {
        foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            shift === "Available" &&
            this.includesWeekends(job, date)
        );
      }
      if (this.getLocumPrivateJobParts.length > 0) {
        foundLocumPrivateJobs = this.getLocumPrivateJobParts.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) &&
            job_part.job.shift.name === shift &&
            this.includesWeekends(job_part.job, date)
        );
      }
      this.foundLocumJobs = [
        ...foundLocumOngoingJobs,
        ...foundLocumAppliedJobs,
        ...foundLocumPrivateJobs
      ];
      if (this.foundLocumJobs.length > 0) {
        setTimeout(() => {
          this.viewLocumJobs = true;
        }, 500);
      }
      setTimeout(() => {
        this.loading = false;
      }, 600);
    }
  }
};
</script>
<style scoped>
.info-section {
  /* background-image: url("/images/hubzz-bg.png"); */
  background-image: linear-gradient(#60686a, #363d40);
}
.quick-view {
  text-shadow: 0 2px #7d888a;
  letter-spacing: 4px;
}
.info-card {
  height: 300px;
}
@media screen and (min-width: 768px) {
  .info-card {
    height: 100%;
    max-height: 550px;
  }
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #202226;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb {
  background: #949fa5;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>


