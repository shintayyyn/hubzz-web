<template>
  <div class="info-section h-full rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
    <div class="text-white text-sm py-4 px-8">{{$moment(dateInfo).format('Do MMM, YYYY')}}</div>
    <div class="flex flex-col overflow-y-auto overflow-x-hidden px-8 h-full info-card">
      <transition name="slide" mode="out-in">
        <div
          class="mt-4 md:text-xl text-white"
          v-if="!viewPracticeJobs && !viewLocumJobs && !loading"
          key="'no-jobs'"
        >No jobs to display.</div>
        <div v-if="viewPracticeJobs && !loading">
          <div v-for="job in foundPracticeJobs" :key="job.id">
            <PracticeJobCard :propJob="job" @viewPracticeJob="$emit('viewPracticeJob', $event)" />
          </div>
        </div>
        <div v-if="viewLocumJobs && !loading">
          <div v-for="job in foundLocumJobs" :key="job.id">
            <LocumJobCard :propJob="job" @viewLocumJob="$emit('viewLocumJob', $event)" />
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
      // date_info: null,
      // date_info_week: null
    };
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
      // this.date_info = value
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
    },
    // PRACTICE
    // parts
    getPracticeOngoingJobs(value) {
      this.findPerMonthPractice(this.selected_date);
    },
    // getPracticeAllocatedPartJobs(value) {
    //   this.findPerMonthPractice(this.selected_date);
    // },
    // whole
    getPracticeAllocatedJobs(value) {
      this.findPerMonthPractice(this.selected_date);
    },
    getPracticeAppliedJobs(value) {
      this.findPerMonthPractice(this.selected_date);
    },
    getPracticeUnfilledJobs(value) {
      this.findPerMonthPractice(this.selected_date);
    },
    getPracticeDeclinedJobs(value) {
      this.findPerMonthPractice(this.selected_date);
    },
    getPracticeAvailableJobsReminder(value) {
      this.findPerMonthPractice(this.selected_date);
    },
    getPracticeAppliedJobsReminder(value) {
      this.findPerMonthPractice(this.selected_date);
    },
    // LOCUM
    // parts
    getLocumOngoingJobs(value) {
      this.findPerMonthLocum(this.selected_date);
    },
    getLocumAllocatedPrivatePartJobs(value) {
      this.findPerMonthLocum(this.selected_date);
    },
    getLocumAllocatedPlatformPartJobs(value) {
      this.findPerMonthLocum(this.selected_date);
    },
    // whole
    getLocumAppliedJobs(value) {
      this.findPerMonthLocum(this.selected_date);
    },
    getLocumUnavailabilities(value) {
      this.findPerMonthLocum(this.selected_date);
    }
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
    // parts
    getPracticeOngoingJobs() {
      return this.$store.getters["jobs/getPracticeOngoingJobs"];
    },
    // getPracticeAllocatedPartJobs() {
    //   return this.$store.getters["jobs/getPracticeAllocatedPartJobs"];
    // },
    // whole
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
    getPracticeAvailableJobsReminder() {
      return this.$store.getters["jobs/getPracticeAvailableJobsReminder"];
    },
    getPracticeAppliedJobsReminder() {
      return this.$store.getters["jobs/getPracticeAppliedJobsReminder"];
    },
    // LOCUM
    // parts
    getLocumOngoingJobs() {
      return this.$store.getters["jobs/getLocumOngoingJobs"];
    },
    getLocumAllocatedPrivatePartJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPrivatePartJobs"];
    },
    getLocumAllocatedPlatformPartJobs() {
      return this.$store.getters["jobs/getLocumAllocatedPlatformPartJobs"];
    },
    // whole
    getLocumAppliedJobs() {
      return this.$store.getters["jobs/getLocumAppliedJobs"];
    },
    getLocumUnavailabilities() {
      return this.$store.getters["jobs/getLocumUnavailabilities"];
    }
  },
  methods: {
    // practice
    findPerMonthPractice(date) {
      this.loading = true;
      this.viewPracticeJobs = false;
      let foundPracticeOngoingJobs = [];
      let foundPracticeAllocatedJobs = [];
      let foundPracticeAppliedJobs = [];
      let foundPracticeUnfilledJobs = [];
      let foundPracticeDeclinedJobs = [];
      let foundPracticeAppliedJobsReminder = [];
      let foundPracticeAvailableJobsReminder = [];

      if (this.getPracticeOngoingJobs.length > 0) {
        foundPracticeOngoingJobs = this.getPracticeOngoingJobs.filter(job =>
          this.getDateArray(job.date_start, job.date_end).includes(date)
        );
      }
      // if (this.getPracticeAllocatedPartJobs.length > 0) {
      //   foundPracticeAllocatedJobs = this.getPracticeAllocatedPartJobs.filter(
      //     job => this.getDateArray(job.date_start, job.date_end).includes(date)
      //   );
      // }
      if (this.getPracticeAllocatedJobs.length > 0) {
        foundPracticeAllocatedJobs = this.getPracticeAllocatedJobs.filter(job =>
          this.getDateArray(job.date_start, job.date_end).includes(date)
        );
      }
      if (this.getPracticeAppliedJobs.length > 0) {
        foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(job =>
          this.getDateArray(job.date_start, job.date_end).includes(date)
        );
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(job =>
          this.getDateArray(job.date_start, job.date_end).includes(date)
        );
      }
      if (this.getPracticeDeclinedJobs.length > 0) {
        foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(job =>
          this.getDateArray(job.date_start, job.date_end).includes(date)
        );
        // foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(job => this.$moment(job.platform_job.declined_at).format('YYYY-MM-DD') === date)
      }
      if (this.getPracticeAppliedJobsReminder.length > 0) {
        foundPracticeAppliedJobsReminder = this.getPracticeAppliedJobsReminder.filter(
          job => job.platform_job.selection_date === date
        );
      }
      if (this.getPracticeAvailableJobsReminder.length > 0) {
        foundPracticeAvailableJobsReminder = this.getPracticeAvailableJobsReminder.filter(
          job => job.platform_job.selection_date === date
        );
      }
      this.foundPracticeJobs = [
        ...foundPracticeOngoingJobs,
        ...foundPracticeAllocatedJobs,
        ...foundPracticeAppliedJobs,
        ...foundPracticeUnfilledJobs,
        ...foundPracticeDeclinedJobs,
        ...foundPracticeAppliedJobsReminder,
        ...foundPracticeAvailableJobsReminder
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
      let foundPracticeAllocatedJobs = [];
      let foundPracticeAppliedJobs = [];
      let foundPracticeUnfilledJobs = [];
      let foundPracticeDeclinedJobs = [];
      let foundPracticeAppliedJobsReminder = [];
      let foundPracticeAvailableJobsReminder = [];

      if (this.getPracticeOngoingJobs.length > 0) {
        foundPracticeOngoingJobs = this.getPracticeOngoingJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) && job_part.job.shift.name === shift
        );
      }
      // if (this.getPracticeAllocatedPartJobs.length > 0) {
      //   foundPracticeAllocatedJobs = this.getPracticeAllocatedPartJobs.filter(
      //     job_part =>
      //       this.getDateArray(job_part.date_start, job_part.date_end).includes(
      //         date
      //       ) && job_part.job.shift.name === shift
      //   );
      // }
      if (this.getPracticeAllocatedJobs.length > 0) {
        foundPracticeAllocatedJobs = this.getPracticeAllocatedJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) && job_part.job.shift.name === shift
        );
      }
      if (this.getPracticeAppliedJobs.length > 0) {
        foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === shift
        );
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === shift
        );
      }
      if (this.getPracticeDeclinedJobs.length > 0) {
        foundPracticeDeclinedJobs = this.getPracticeDeclinedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            job.shift.name === shift
        );
      }
      if (this.getPracticeAvailableJobsReminder.length > 0) {
        foundPracticeAvailableJobsReminder = this.getPracticeAvailableJobsReminder.filter(
          job => job.platform_job.selection_date === date
        );
      }
      if (this.getPracticeAppliedJobsReminder.length > 0) {
        foundPracticeAppliedJobsReminder = this.getPracticeAppliedJobsReminder.filter(
          job => job.platform_job.selection_date === date
        );
      }
      this.foundPracticeJobs = [
        ...foundPracticeOngoingJobs,
        ...foundPracticeAllocatedJobs,
        ...foundPracticeAppliedJobs,
        ...foundPracticeUnfilledJobs,
        ...foundPracticeDeclinedJobs,
        ...foundPracticeAppliedJobsReminder,
        ...foundPracticeAvailableJobsReminder
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
    // locums
    findPerMonthLocum(date) {
      this.viewLocumJobs = false;
      this.loading = true;
      let foundLocumOngoingJobs = [];
      let foundLocumAllocatedPrivatePartJobs = [];
      let foundLocumAllocatedPlatformPartJobs = [];
      let foundLocumAppliedJobs = [];
      let foundLocumUnavailabilities = [];
      // parts
      if (this.getLocumOngoingJobs.length > 0) {
        foundLocumOngoingJobs = this.getLocumOngoingJobs.filter(job_part =>
          this.getDateArray(job_part.date_start, job_part.date_end).includes(
            date
          )
        );
      }
      if (this.getLocumAllocatedPrivatePartJobs.length > 0) {
        foundLocumAllocatedPrivatePartJobs = this.getLocumAllocatedPrivatePartJobs.filter(
          job => this.getDateArray(job.date_start, job.date_end).includes(date)
        );
      }
      if (this.getLocumAllocatedPlatformPartJobs.length > 0) {
        foundLocumAllocatedPlatformPartJobs = this.getLocumAllocatedPlatformPartJobs.filter(
          job => this.getDateArray(job.date_start, job.date_end).includes(date)
        );
      }
      // whole
      if (this.getLocumAppliedJobs.length > 0) {
        foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(job =>
          this.getDateArray(job.date_start, job.date_end).includes(date)
        );
      }
      if (this.getLocumUnavailabilities.length > 0) {
        foundLocumUnavailabilities = this.getLocumUnavailabilities.filter(
          job => job.date === date
        );
      }
      this.foundLocumJobs = [
        ...foundLocumOngoingJobs,
        ...foundLocumAllocatedPrivatePartJobs,
        ...foundLocumAllocatedPlatformPartJobs,
        ...foundLocumAppliedJobs,
        ...foundLocumUnavailabilities
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
      let foundLocumAllocatedPrivatePartJobs = [];
      let foundLocumAllocatedPlatformPartJobs = [];
      let foundLocumAppliedJobs = [];
      let foundLocumUnavailabilities = [];
      // parts
      if (this.getLocumOngoingJobs.length > 0) {
        foundLocumOngoingJobs = this.getLocumOngoingJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) && job_part.job.shift.name === shift
        );
      }
      if (this.getLocumAllocatedPrivatePartJobs.length > 0) {
        foundLocumAllocatedPrivatePartJobs = this.getLocumAllocatedPrivatePartJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) && job_part.job.shift.name === shift
        );
      }
      if (this.getLocumAllocatedPlatformPartJobs.length > 0) {
        foundLocumAllocatedPlatformPartJobs = this.getLocumAllocatedPlatformPartJobs.filter(
          job_part =>
            this.getDateArray(job_part.date_start, job_part.date_end).includes(
              date
            ) && job_part.job.shift.name === shift
        );
      }
      // whole
      if (this.getLocumAppliedJobs.length > 0) {
        foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(
          job =>
            this.getDateArray(job.date_start, job.date_end).includes(date) &&
            shift === "Available"
        );
      }
      if (this.getLocumUnavailabilities.length > 0) {
        foundLocumUnavailabilities = this.getLocumUnavailabilities.filter(
          job =>
            job.date === date &&
            job.shifts.map(shift => shift.name).includes(shift)
        );
      }
      this.foundLocumJobs = [
        ...foundLocumOngoingJobs,
        ...foundLocumAllocatedPrivatePartJobs,
        ...foundLocumAllocatedPlatformPartJobs,
        ...foundLocumAppliedJobs,
        ...foundLocumUnavailabilities
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
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>


