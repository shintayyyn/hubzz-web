<template>
  <div class="flex flex-row flex-wrap justify-center w-full px-1">
    <span
      v-if="hasActiveJobs(item.fullDate, item.day)"
      class="bg-job-active w-2 h-2 md:w-3 md:h-3 rounded border border-white"
    />
    <span
      v-if="hasPendingJobs(item.fullDate, item.day)"
      class="bg-job-pending w-2 h-2 md:w-3 md:h-3 rounded border border-white"
    />
    <span
      v-if="hasUnfilledJobs(item.fullDate, item.day) && $auth.user.domain === 'Practice'"
      class="bg-job-unfilled w-2 h-2 md:w-3 md:h-3 rounded border border-white"
    />
    <template v-if="getStatusCount(item.fullDate, item.day) === 1">
      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="w-1 absolute bottom-0 left-0 rounded-bl"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="h-1 w-1/2 absolute left-0 top-0 rounded-tl"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="w-1 absolute top-0 left-0 rounded-tl"
        style="height:50%"
      />

      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="w-1 absolute bottom-0 right-0 rounded-br"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="h-1 w-1/2 absolute right-0 top-0 rounded-tr"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 1)"
        class="w-1 absolute top-0 right-0 rounded-tr"
        style="height:50%"
      />
    </template>
    <template v-if="getStatusCount(item.fullDate, item.day) === 2">
      <!-- left -->
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[0].style"
        class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl border-r-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[0].style"
        class="w-1 absolute bottom-0 left-0 rounded-bl"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[0].style"
        class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[0].style"
        class="w-1 absolute top-0 left-0 rounded-tl"
        style="height:50%"
      />
      <!-- right -->
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[1].style"
        class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br border-l-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[1].style"
        class="w-1 absolute bottom-0 right-0 rounded-br"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[1].style"
        class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 2)[1].style"
        class="w-1 absolute top-0 right-0 rounded-tr"
        style="height:50%"
      />
    </template>
    <template v-if="getStatusCount(item.fullDate, item.day) === 3">
      <!-- top left -->
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[0].style"
        class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[0].style"
        class="w-1 absolute top-0 left-0 rounded-tl border-b-2 border-white"
        style="height:50%"
      />
      <!-- top right -->
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[1].style"
        class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[1].style"
        class="w-1 absolute top-0 right-0 rounded-tr border-b-2 border-white"
        style="height:50%"
      />
      <!-- bottom -->
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[2].style"
        class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[2].style"
        class="w-1 absolute bottom-0 left-0 rounded-bl border-t-2 border-white"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[2].style"
        class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 3)[2].style"
        class="w-1 absolute bottom-0 right-0 rounded-br border-t-2 border-white"
        style="height:50%"
      />
    </template>
    <template v-if="getStatusCount(item.fullDate, item.day) === 4">
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[0].style"
        class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl border-r-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[0].style"
        class="w-1 absolute bottom-0 left-0 rounded-bl border-t-2 border-white"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[1].style"
        class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[1].style"
        class="w-1 absolute top-0 left-0 rounded-tl border-b-2 border-white"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[2].style"
        class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br border-l-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[2].style"
        class="w-1 absolute bottom-0 right-0 rounded-br border-t-2 border-white"
        style="height:50%"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[3].style"
        class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
      />
      <div
        :class="statusStyle(item.fullDate, item.day, 4)[3].style"
        class="w-1 absolute top-0 right-0 rounded-tr border-b-2 border-white"
        style="height:50%"
      />
    </template>
  </div>
</template>
<script>
export default {
	props: ["item"],
	computed: {
		// PRACTICE
		// PARTS
		getPracticeOngoingJobs () {
			return this.$store.getters["jobs/getPracticeOngoingJobs"]
		},
		getPracticeCompletedJobs () {
			return this.$store.getters["jobs/getPracticeCompletedJobs"]
		},
		// WHOLE
		getPracticeAllocatedJobs () {
			return this.$store.getters["jobs/getPracticeAllocatedJobs"]
		},
		getPracticeAppliedJobs () {
			return this.$store.getters["jobs/getPracticeAppliedJobs"]
		},
		getPracticeUnfilledJobs () {
			return this.$store.getters["jobs/getPracticeUnfilledJobs"]
		},
		getPracticeDeclinedJobs () {
			return this.$store.getters["jobs/getPracticeDeclinedJobs"]
		},
		getPracticeAvailableJobs () {
			return this.$store.getters["jobs/getPracticeAvailableJobs"]
		},
		// REMINDERS
		getPracticeAvailableJobsReminder () {
			return this.$store.getters["jobs/getPracticeAvailableJobsReminder"]
		},
		getPracticeAppliedJobsReminder () {
			return this.$store.getters["jobs/getPracticeAppliedJobsReminder"]
		},

		// LOCUM
		// PARTS
		getLocumOngoingJobs () {
			return this.$store.getters["jobs/getLocumOngoingJobs"]
		},
		getLocumCompletedJobs () {
			return this.$store.getters["jobs/getLocumCompletedJobs"]
		},
		// WHOLE
		getLocumAllocatedJobs () {
			return this.$store.getters["jobs/getLocumAllocatedJobs"]
		},
		getLocumAppliedJobs () {
			return this.$store.getters["jobs/getLocumAppliedJobs"]
		},
		getLocumAvailableJobs () {
			return this.$store.getters["jobs/getLocumAvailableJobs"]
		},
		getLocumBankJobs () {
			return this.$store.getters["jobs/getLocumBankJobs"]
		},
		getLocumMatchedJobs () {
			return this.$store.getters["jobs/getLocumMatchedJobs"]
		},
		// UNAVAILABILITIES
		getLocumUnavailabilities () {
			return this.$store.getters["jobs/getLocumUnavailabilities"]
		}
	},
	methods: {
		hasActiveJobs (date, day) {
			let hasOngoing = false
			let hasLive = false
			let hasMatched = false
			let hasBank = false
			if (this.$auth.user.domain === "Practice") {
				hasOngoing = this.getPracticeOngoingJobs.find(
					job_part =>
						this.getDateArray(job_part.date_start, job_part.date_end).includes(
							date
						) &&
						((job_part.job.include_saturday === false && day !== 6) ||
							job_part.job.include_saturday === true) &&
						((job_part.job.include_sunday === false && day !== 0) ||
							job_part.job.include_sunday === true)
				)
				hasLive = this.getPracticeAvailableJobs.find(
					job =>
						this.getDateArray(job.date_start, job.date_end).includes(date) &&
						((job.include_saturday === false && day !== 6) ||
							job.include_saturday === true) &&
						((job.include_sunday === false && day !== 0) ||
							job.include_sunday === true)
				)
			}
			if (this.$auth.user.domain === "Locum") {
				hasOngoing = this.getLocumOngoingJobs.find(
					job_part =>
						this.getDateArray(job_part.date_start, job_part.date_end).includes(
							date
						) &&
						((job_part.job.include_saturday === false && day !== 6) ||
							job_part.job.include_saturday === true) &&
						((job_part.job.include_sunday === false && day !== 0) ||
							job_part.job.include_sunday === true)
				)
				// hasLive = this.getLocumAvailableJobs.find(
				// 	job =>
				// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
				// 		((job.include_saturday === false && day !== 6) ||
				// 			job.include_saturday === true) &&
				// 		((job.include_sunday === false && day !== 0) ||
				// 			job.include_sunday === true)
				// );
				// hasMatched = this.getLocumMatchedJobs.find(
				// 	job =>
				// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
				// 		((job.include_saturday === false && day !== 6) ||
				// 			job.include_saturday === true) &&
				// 		((job.include_sunday === false && day !== 0) ||
				// 			job.include_sunday === true)
				// );
				// hasBank = this.getLocumBankJobs.find(
				// 	job =>
				// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
				// 		((job.include_saturday === false && day !== 6) ||
				// 			job.include_saturday === true) &&
				// 		((job.include_sunday === false && day !== 0) ||
				// 			job.include_sunday === true)
				// );
			}
			if (hasOngoing) {
				this.$emit("hasActivities")
			}
			return hasOngoing || hasLive || hasMatched || hasBank ? true : false
		},
		hasPendingJobs (date, day) {
			let hasApplied = false

			if (this.$auth.user.domain === "Practice") {
				hasApplied = this.getPracticeAppliedJobs.find(
					job =>
						this.getDateArray(job.date_start, job.date_end).includes(date) &&
						((job.include_saturday === false && day !== 6) ||
							job.include_saturday === true) &&
						((job.include_sunday === false && day !== 0) ||
							job.include_sunday === true)
				)
			}
			if (this.$auth.user.domain === "Locum") {
				hasApplied = this.getLocumAppliedJobs.find(
					job =>
						this.getDateArray(job.date_start, job.date_end).includes(date) &&
						((job.include_saturday === false && day !== 6) ||
							job.include_saturday === true) &&
						((job.include_sunday === false && day !== 0) ||
							job.include_sunday === true)
				)
			}
			if (hasApplied) {
				this.$emit("hasActivities")
			}
			return hasApplied ? true : false
		},
		hasUnfilledJobs (date, day) {
			let hasUnfilled = this.getPracticeUnfilledJobs.find(
				job =>
					this.getDateArray(job.date_start, job.date_end).includes(date) &&
					((job.include_saturday === false && day !== 6) ||
						job.include_saturday === true) &&
					((job.include_sunday === false && day !== 0) ||
						job.include_sunday === true)
			)
			let hasDeclined = this.getPracticeDeclinedJobs.find(
				job =>
					this.getDateArray(job.date_start, job.date_end).includes(date) &&
					((job.include_saturday === false && day !== 6) ||
						job.include_saturday === true) &&
					((job.include_sunday === false && day !== 0) ||
						job.include_sunday === true)
			)

			if (hasUnfilled || hasDeclined) {
				this.$emit("hasActivities")
			}

			return hasUnfilled || hasDeclined ? true : false
		},
		hasAMShift (date, day) {
			let hasActiveAMShift = false
			let hasPendingAMShift = false
			let hasUnfilledAMShift = false
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false
				let hasLive = false
				let hasMatched = false
				let hasBank = false

				if (this.$auth.user.domain === "Practice") {
					hasOngoing = this.getPracticeOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "AM" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasOngoing = this.getLocumOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "AM" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					// hasLive = this.getLocumAvailableJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "AM" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasMatched = this.getLocumMatchedJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "AM" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasBank = this.getLocumBankJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "AM" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
				}
				hasActiveAMShift = hasOngoing ? true : false
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasApplied = this.getLocumAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				hasPendingAMShift = hasApplied ? true : false
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false
				let hasDeclined = false
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				hasUnfilledAMShift = hasUnfilled || hasDeclined ? true : false
			}
			return hasActiveAMShift || hasPendingAMShift || hasUnfilledAMShift
				? true
				: false
		},
		hasPMShift (date, day) {
			let hasActivePMShift = false
			let hasPendingPMShift = false
			let hasUnfilledPMShift = false
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false
				let hasLive = false
				let hasMatched = false
				let hasBank = false
				if (this.$auth.user.domain === "Practice") {
					hasOngoing = this.getPracticeOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "PM" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasOngoing = this.getLocumOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "PM" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					// hasLive = this.getLocumAvailableJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "PM" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasMatched = this.getLocumMatchedJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "PM" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasBank = this.getLocumBankJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "PM" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
				}
				hasActivePMShift = hasOngoing ? true : false
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasApplied = this.getLocumAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				hasPendingPMShift = hasApplied ? true : false
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false
				let hasDeclined = false
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				hasUnfilledPMShift = hasUnfilled || hasDeclined ? true : false
			}
			return hasActivePMShift || hasPendingPMShift || hasUnfilledPMShift
		},
		hasOOHShift (date, day) {
			let hasActiveOOHShift = false
			let hasPendingOOHShift = false
			let hasUnfilledOOHShift = false
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false
				let hasLive = false
				let hasMatched = false
				let hasBank = false
				if (this.$auth.user.domain === "Practice") {
					hasOngoing = this.getPracticeOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "OOH" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasOngoing = this.getLocumOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "OOH" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					// hasLive = this.getLocumAvailableJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "OOH" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasMatched = this.getLocumMatchedJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "OOH" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasBank = this.getLocumBankJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "OOH" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
				}
				hasActiveOOHShift = hasOngoing ? true : false
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasApplied = this.getLocumAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				hasPendingOOHShift = hasApplied ? true : false
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false
				let hasDeclined = false
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				hasUnfilledOOHShift = hasUnfilled || hasDeclined ? true : false
			}

			return hasActiveOOHShift || hasPendingOOHShift || hasUnfilledOOHShift
		},
		hasWholeDayShift (date, day) {
			let hasActiveWDShift = false
			let hasPendingWDShift = false
			let hasUnfilledWDShift = false
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false
				let hasLive = false
				let hasMatched = false
				let hasBank = false
				if (this.$auth.user.domain === "Practice") {
					hasOngoing = this.getPracticeOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "Whole Day" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasOngoing = this.getLocumOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							job_part.job.shift.name === "Whole Day" &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					)
					// hasLive = this.getLocumAvailableJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "Whole Day" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasMatched = this.getLocumMatchedJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "Whole Day" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
					// hasBank = this.getLocumBankJobs.find(
					// 	job =>
					// 		this.getDateArray(job.date_start, job.date_end).includes(date) &&
					// 		job.shift.name === "Whole Day" &&
					// 		((job.include_saturday === false && day !== 6) ||
					// 			job.include_saturday === true) &&
					// 		((job.include_sunday === false && day !== 0) ||
					// 			job.include_sunday === true)
					// );
				}
				hasActiveWDShift = hasOngoing ? true : false
				if (date === "2020-02-28") {
				}
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					)
				}
				if (this.$auth.user.domain === "Locum") {
					hasApplied = this.getLocumAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					)
				}
				hasPendingWDShift = hasApplied ? true : false
				if (date === "2020-02-28") {
				}
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false
				let hasDeclined = false
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					)
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					)
				}
				hasUnfilledWDShift = hasUnfilled || hasDeclined ? true : false
				if (date === "2020-02-28") {
				}
			}
			return hasActiveWDShift || hasPendingWDShift || hasUnfilledWDShift
		},
		getStatusCount (date, day) {
			let filterStatus = [
				this.hasAMShift(date, day),
				this.hasPMShift(date, day),
				this.hasOOHShift(date, day),
				this.hasWholeDayShift(date, day)
			].filter(item => item == true)
			return filterStatus.length
		},
		statusStyle (date, day, count) {
			if (count == 1) {
				let shift
				if (this.hasAMShift(date, day)) {
					shift = "AM"
				} else if (this.hasPMShift(date, day)) {
					shift = "PM"
				} else if (this.hasOOHShift(date, day)) {
					shift = "OOH"
				} else if (this.hasWholeDayShift(date, day)) {
					shift = "WD"
				} else {
					return
				}
				switch (shift) {
					case "AM":
						return "bg-shift-am"
						break
					case "PM":
						return "bg-shift-pm"
						break
					case "WD":
						return "bg-shift-whole-day"
						break
					case "OOH":
						return "bg-shift-ooh"
						break
					default:
						return ""
						break
				}
			}
			if (count > 1) {
				let shifts = []
				if (this.hasAMShift(date, day)) {
					shifts.push({ name: "AM", style: "bg-shift-am" })
				}
				if (this.hasPMShift(date, day)) {
					shifts.push({ name: "PM", style: "bg-shift-pm" })
				}
				if (this.hasOOHShift(date, day)) {
					shifts.push({ name: "OOH", style: "bg-shift-ooh" })
				}
				if (this.hasWholeDayShift(date, day)) {
					shifts.push({ name: "WD", style: "bg-shift-whole-day" })
				}
				return shifts
			}
		}
	}
}
</script>
<style scoped>
.bg-job-active {
	background-color: #38b460;
}

.bg-job-pending {
	background-color: #ffa901;
}

.bg-job-unfilled {
	background-color: #cd1424;
}

.bg-shift-whole-day {
	background-color: #fe703e;
}
.bg-shift-am {
	background-color: #ff59ca;
}
.bg-shift-pm {
	background-color: #34bbff;
}
.bg-shift-ooh {
	background-color: #947ffe;
}
</style>