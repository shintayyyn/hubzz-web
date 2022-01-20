<template>
  <div class="info-section h-full rounded border py-4">
    <div class="leading-relaxed px-2">
      <p class="text-gray-600 font-bold text-sm">
        Quick View
      </p>
      <!--  <p class="uppercase text-lg font-bold">
        {{ $moment(dateInfo).format('DD / MM / YYYY') }}
      </p> -->
    </div>

    <div class="flex flex-col overflow-y-auto overflow-x-hidden px-2 h-full info-card">
      <transition name="slide" mode="out-in">
        <div
          v-if="!viewPracticeJobs && !viewLocumJobs && !loading"
          key="'no-jobs'"
          class="mt-4  text-center"
        >
          No jobs on this day
        </div>

        <div v-if="viewPracticeJobs && !loading" class="py-2">
          <div v-for="job in foundPracticeJobs" :key="`${job.id}-${job.status}`">
            <PracticeJobCard
              :propJob="job"
              :hasPermissionToShow="authPermissions.includes('Show Sessions Job')"
            />
          </div>
        </div>

        <div v-if="viewLocumJobs && !loading" class="py-2">
          <div v-for="job in foundLocumJobs" :key="`${job.id}-${job.locum_status}`">
            <LocumJobCard
              :propJob="job"
              :hasPermissionToShow="authPermissions.includes('Show Sessions Job')"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import PracticeJobCard from "@/components/Calendar/Cards/PracticeJobCard"
import LocumJobCard from "@/components/Calendar/Cards/LocumJobCard"
export default {
  components: {
    PracticeJobCard,
    LocumJobCard,
  },

  props: {
    locumUnavailabilities: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      foundPracticeJobs: [],
      viewPracticeJobs: false,
      foundLocumJobs: [],
      viewLocumJobs: false,
      loading: false,
    }
  },
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
    view_type () {
      return this.$store.state.calendar.view_type
    },
    dateInfo () {
      // console.log("qa test alvin", this.$store.state.calendar);
      if (this.$store.state.calendar.view_type === "per_month") {
        return this.$store.state.calendar.selected_date
      }
      return this.$store.state.calendar.selected_date_shift.date
    },
    selected_date () {
      return this.$store.state.calendar.selected_date
    },
    selected_date_shift () {
      return this.$store.state.calendar.selected_date_shift
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
  },
  watch: {
    view_type (value) {
      if (value === "per_month") {
        if (this.$auth.user.domain === "Practice") {
          this.findPerMonthPractice(this.$store.state.calendar.selected_date)
          return
        }
        if (this.$auth.user.domain === "Locum") {
          this.findPerMonthLocum(this.$store.state.calendar.selected_date)
          return
        }
      }
      if (value === "per_week") {
        if (this.$auth.user.domain === "Practice") {
          this.findPerWeekPractice(
            this.$store.state.calendar.selected_date_shift
          )
          return
        }
        if (this.$auth.user.domain === "Locum") {
          this.findPerWeekLocum(this.$store.state.calendar.selected_date_shift)
          return
        }
      }
    },
    selected_date (value) {
      this.date_info = value
      if (this.$auth.user.domain === "Practice") {
        this.findPerMonthPractice(value)
        return
      }
      if (this.$auth.user.domain === "Locum") {
        this.findPerMonthLocum(value)
        return
      }
    },
    selected_date_shift (value) {
      // this.date_info_week = value.date
      if (this.$auth.user.domain === "Practice") {
        this.findPerWeekPractice(value)
      }
      if (this.$auth.user.domain === "Locum") {
        this.findPerWeekLocum(value)
      }
    },
    // practice
    getPracticeAvailableJobs () {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeOngoingJobs () {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeWithdrawnJobs () {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeAppliedJobs () {
      this.findPerMonthPractice(this.selected_date)
    },
    getPracticeUnfilledJobs () {
      this.findPerMonthPractice(this.selected_date)
    },
    // locum
    // getLocumOngoingJobs() {
    // 	this.findPerMonthLocum(this.selected_date);
    // },
    getLocumAppliedJobs () {
      this.findPerMonthLocum(this.selected_date)
    },
    getLocumPrivateJobParts () {
      this.findPerMonthLocum(this.selected_date)
    },
    getLocumPermanentJobs () {
      this.findPerMonthLocum(this.selected_date)
    },
  },
  created () {
    if (this.$auth.user.domain === "Practice") {
      this.findPerMonthPractice(this.selected_date)
      return
    }
    if (this.$auth.user.domain === "Locum") {
      this.findPerMonthLocum(this.selected_date)
      return
    }
  },
  methods: {
    includesWeekends (job, date) {
      let day = new Date(date).getDay()
      return (
        ((job.include_saturday === false && day !== 6)
					|| job.include_saturday === true)
				&& ((job.include_sunday === false && day !== 0)
					|| job.include_sunday === true)
      )
    },

    // PRACTICE
    findPerMonthPractice (date) {
      this.loading = true
      this.viewPracticeJobs = false
      // let foundPracticeOngoingJobs = [];
      let foundPracticeWithdrawnJobs = []
      let foundPracticeAppliedJobs = []
      let foundPracticeUnfilledJobs = []
      let foundPracticeAllocatedJobs = []
      let foundPracticeLiveJobs = []

      // if (this.getPracticeOngoingJobs.length > 0) {
      // 	foundPracticeOngoingJobs = this.getPracticeOngoingJobs.filter(
      // 		job_part => job_part.dates.includes(date)
      // 	);
      // }
      if (this.getPracticeAvailableJobs.length > 0) {
        foundPracticeLiveJobs = this.getPracticeAvailableJobs.filter(
          job => job.dates[0] === date
        )
      }
      if (this.getPracticeAllocatedPartJobs.length > 0) {
        foundPracticeAllocatedJobs = this.getPracticeAllocatedPartJobs.filter(
          job_part => job_part.dates.includes(date)
        )
      }
      if (this.getPracticeWithdrawnJobs.length > 0) {
        foundPracticeWithdrawnJobs = this.getPracticeWithdrawnJobs.filter(
          job_part => job_part.dates.includes(date)
        )
      }
      if (this.getPracticeAppliedJobs.length > 0) {
        foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(job =>
          job.dates.includes(date)
        )
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(job =>
          job.dates.includes(date)
        )
      }
      this.foundPracticeJobs = [
        // ...foundPracticeOngoingJobs,
        ...foundPracticeLiveJobs,
        ...foundPracticeWithdrawnJobs,
        ...foundPracticeAppliedJobs,
        ...foundPracticeUnfilledJobs,
        ...foundPracticeAllocatedJobs,
      ]

      if (this.foundPracticeJobs.length > 0) {
        setTimeout(() => {
          this.viewPracticeJobs = true
        }, 500)
      }
      setTimeout(() => {
        this.loading = false
      }, 600)
    },

    findPerWeekPractice ({ date, shift, }) {
      this.loading = true
      this.viewPracticeJobs = false
      // let foundPracticeOngoingJobs = []
      let foundPracticeWithdrawnJobs = []
      let foundPracticeAppliedJobs = []
      let foundPracticeUnfilledJobs = []
      let foundPracticeAllocatedJobs = []
      let foundPracticeLiveJobs = []
      // PARTS
      // if (this.getPracticeOngoingJobs.length > 0) {
      // 	foundPracticeOngoingJobs = this.getPracticeOngoingJobs.filter(
      // 		job_part =>
      // 			job_part.dates.includes(date) && job_part.job.shift.name === shift
      // 	);
      // }
      if (this.getPracticeAllocatedPartJobs.length > 0) {
        foundPracticeAllocatedJobs = this.getPracticeAllocatedPartJobs.filter(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === shift)
        )
      }
      if (this.getPracticeWithdrawnJobs.length > 0) {
        foundPracticeWithdrawnJobs = this.getPracticeWithdrawnJobs.filter(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === shift)
        )
      }
      // WHOLE
      if (this.getPracticeAvailableJobs.length > 0) {
        foundPracticeLiveJobs = this.getPracticeAvailableJobs.filter(
          job => job.dates[0] === date && job.shifts.find(s => s.name === shift)
        )
      }
      if (this.getPracticeAppliedJobs.length > 0) {
        foundPracticeAppliedJobs = this.getPracticeAppliedJobs.filter(
          job =>
            job.dates.includes(date) && job.shifts.find(s => s.name === shift)
        )
      }
      if (this.getPracticeUnfilledJobs.length > 0) {
        foundPracticeUnfilledJobs = this.getPracticeUnfilledJobs.filter(
          job =>
            job.dates.includes(date) && job.shifts.find(s => s.name === shift)
        )
      }
      this.foundPracticeJobs = [
        // ...foundPracticeOngoingJobs,
        ...foundPracticeLiveJobs,
        ...foundPracticeWithdrawnJobs,
        ...foundPracticeAppliedJobs,
        ...foundPracticeUnfilledJobs,
        ...foundPracticeAllocatedJobs,
      ]

      if (this.foundPracticeJobs.length > 0) {
        setTimeout(() => {
          this.viewPracticeJobs = true
        }, 500)
      }
      setTimeout(() => {
        this.loading = false
      }, 600)
    },
    // LOCUMS
    findPerMonthLocum (date) {
      this.viewLocumJobs = false
      this.loading = true
      // let foundLocumOngoingJobs = [];
      let foundLocumAppliedJobs = []
      let foundLocumPrivateJobs = []
      let foundPermanentJobs = []
      let foundLocumAllocatedJobs = []
      // if (this.getLocumOngoingJobs.length > 0) {
      // 	foundLocumOngoingJobs = this.getLocumOngoingJobs.filter(job_part =>
      // 		job_part.dates.includes(date)
      // 	);
      // }
      if (this.getLocumAppliedJobs.length > 0) {
        foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(job =>
          job.dates.includes(date)
        )
      }
      if (this.getLocumAllocatedPartJobs.length > 0) {
        foundLocumAllocatedJobs = this.getLocumAllocatedPartJobs.filter(
          job_part => job_part.dates.includes(date)
        )
      }
      if (this.getLocumPrivateJobParts.length > 0) {
        foundLocumPrivateJobs = this.getLocumPrivateJobParts.filter(job_part =>
          job_part.dates.includes(date)
        )
      }
      if (this.getLocumPermanentJobs.length > 0) {
        foundPermanentJobs = this.getLocumPermanentJobs.filter(job =>
          this.getDateArray(job.date_time_start, job.date_time_end).includes(
            date
          )
        )
      }

      this.foundLocumJobs = [
        // ...foundLocumOngoingJobs,
        ...foundLocumAllocatedJobs,
        ...foundLocumAppliedJobs,
        ...foundLocumPrivateJobs,
        ...foundPermanentJobs,
      ]
      if (this.foundLocumJobs.length > 0) {
        setTimeout(() => {
          this.viewLocumJobs = true
        }, 500)
      }
      setTimeout(() => {
        this.loading = false
      }, 600)
    },
    findPerWeekLocum ({ date, shift, }) {
      this.viewLocumJobs = false
      this.loading = false
      // let foundLocumOngoingJobs = [];
      let foundLocumAppliedJobs = []
      let foundLocumPrivateJobs = []
      let foundLocumAllocatedJobs = []
      let foundPermanentJobs = []

      // if (this.getLocumOngoingJobs.length > 0) {
      // 	foundLocumOngoingJobs = this.getLocumOngoingJobs.filter(
      // 		job_part =>
      // 			job_part.dates.includes(date) && job_part.job.shift.name === shift
      // 	);
      // }
      if (this.getLocumAllocatedPartJobs.length > 0) {
        foundLocumAllocatedJobs = this.getLocumAllocatedPartJobs.filter(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === shift)
        )
      }
      if (this.getLocumAppliedJobs.length > 0) {
        foundLocumAppliedJobs = this.getLocumAppliedJobs.filter(
          job =>
            job.dates.includes(date)
						&& job.shifts.includes(s => s.name === "Available")
        )
      }
      if (this.getLocumPrivateJobParts.length > 0) {
        foundLocumPrivateJobs = this.getLocumPrivateJobParts.filter(
          job_part =>
            job_part.dates.includes(date)
						&& job_part.job.shifts.find(s => s.name === shift)
        )
      }
      if (this.getLocumPermanentJobs.length > 0) {
        foundPermanentJobs = this.getLocumPermanentJobs.filter(job =>
          this.getDateArray(job.date_time_start, job.date_time_end).includes(
            date
          )
        )
      }

      this.foundLocumJobs = [
        // ...foundLocumOngoingJobs,
        ...foundLocumAllocatedJobs,
        ...foundLocumAppliedJobs,
        ...foundLocumPrivateJobs,
        ...foundPermanentJobs,
      ]
      if (this.foundLocumJobs.length > 0) {
        setTimeout(() => {
          this.viewLocumJobs = true
        }, 500)
      }
      setTimeout(() => {
        this.loading = false
      }, 600)
    },
  },
}
</script>
<style scoped>
.info-section {
	/* background-image: url("/images/hubzz-bg.png"); */
	/* background-image: linear-gradient(#60686a, #363d40); */
}
.quick-view {
	/* text-shadow: 0 2px #7d888a; */
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


