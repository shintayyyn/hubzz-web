<template>
	<div>
		<!-- 4 Shifts -->
		<!-- 
      <div class="bg-blue-400 h-1 w-1/2 absolute left-0 bottom-0 rounded-bl border-r-2 border-transparent"></div>
      <div class="bg-blue-400 w-1 absolute bottom-0 left-0 rounded-bl border-t-2 border-transparent" style="height:50%"></div>
      <div class="bg-orange-500 h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-transparent"></div>
      <div class="bg-orange-500 w-1 absolute top-0 left-0 rounded-tl border-b-2 border-transparent" style="height:50%"></div>

      <div class="bg-purple-500 h-1 w-1/2 absolute right-0 bottom-0 rounded-br border-l-2 border-transparent"></div>
			<div class="bg-purple-500 w-1 absolute bottom-0 right-0 rounded-br border-t-2 border-transparent" style="height:50%"></div>
      <div class="bg-pink-500 h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-transparent"></div>
			<div class="bg-pink-500 w-1 absolute top-0 right-0 rounded-tr border-b-2 border-transparent" style="height:50%"></div>
		-->

		<!-- SESSION STATUS -->

		<!-- 
		<span class="bg-red-500 w-3 h-3 rounded mx-1"></span>
		<span class="bg-yellow-500 w-3 h-3 rounded mx-1"></span>
		<span class="bg-green-500 w-3 h-3 rounded mx-1"></span> 
		-->

		<div class="flex flex-row flex-no-wrap justify-start w-full">
			<span v-if="hasActiveJobs(item.fullDate, item.day)" class="bg-green-500 w-3 h-3 rounded mx-1"></span>
			<span v-if="hasPendingJobs(item.fullDate, item.day)" class="bg-yellow-500 w-3 h-3 rounded mx-1"></span>
			<span v-if="hasUnfilledJobs(item.fullDate, item.day)" class="bg-red-500 w-3 h-3 rounded mx-1"></span>
			<template v-if="getStatusCount(item.fullDate, item.day) === 1">
				<!-- {{getStatusCount(item.fullDate, item.day)}} -->
				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="w-1 absolute bottom-0 left-0 rounded-bl"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="h-1 w-1/2 absolute left-0 top-0 rounded-tl"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="w-1 absolute top-0 left-0 rounded-tl"
					style="height:50%"
				></div>

				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="w-1 absolute bottom-0 right-0 rounded-br"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="h-1 w-1/2 absolute right-0 top-0 rounded-tr"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 1)"
					class="w-1 absolute top-0 right-0 rounded-tr"
					style="height:50%"
				></div>
			</template>
			<template v-if="getStatusCount(item.fullDate, item.day) === 2">
				<!-- left -->
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[0].style"
					class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl border-r-2 border-white"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[0].style"
					class="w-1 absolute bottom-0 left-0 rounded-bl"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[0].style"
					class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[0].style"
					class="w-1 absolute top-0 left-0 rounded-tl"
					style="height:50%"
				></div>
				<!-- right -->
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[1].style"
					class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br border-l-2 border-white"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[1].style"
					class="w-1 absolute bottom-0 right-0 rounded-br"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[1].style"
					class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 2)[1].style"
					class="w-1 absolute top-0 right-0 rounded-tr"
					style="height:50%"
				></div>
			</template>
			<template v-if="getStatusCount(item.fullDate, item.day) === 3">
				<!-- top left -->
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[0].style"
					class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[0].style"
					class="w-1 absolute top-0 left-0 rounded-tl border-b-2 border-white"
					style="height:50%"
				></div>
				<!-- top right -->
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[1].style"
					class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[1].style"
					class="w-1 absolute top-0 right-0 rounded-tr border-b-2 border-white"
					style="height:50%"
				></div>
				<!-- bottom -->
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[2].style"
					class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[2].style"
					class="w-1 absolute bottom-0 left-0 rounded-bl border-t-2 border-white"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[2].style"
					class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 3)[2].style"
					class="w-1 absolute bottom-0 right-0 rounded-br border-t-2 border-white"
					style="height:50%"
				></div>
			</template>
			<template v-if="getStatusCount(item.fullDate, item.day) === 4">
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[0].style"
					class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl border-r-2 border-transparent"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[0].style"
					class="w-1 absolute bottom-0 left-0 rounded-bl border-t-2 border-transparent"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[1].style"
					class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-transparent"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[1].style"
					class="w-1 absolute top-0 left-0 rounded-tl border-b-2 border-transparent"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[2].style"
					class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br border-l-2 border-transparent"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[2].style"
					class="w-1 absolute bottom-0 right-0 rounded-br border-t-2 border-transparent"
					style="height:50%"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[3].style"
					class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-transparent"
				></div>
				<div
					:class="statusStyle(item.fullDate, item.day, 4)[3].style"
					class="w-1 absolute top-0 right-0 rounded-tr border-b-2 border-transparent"
					style="height:50%"
				></div>
			</template>
		</div>
	</div>
</template>
<script>
import PerMonthInfoDateCell from "@/components/Calendar/PerMonthInfoDateCell";
export default {
	props: ["item"],
	components: {
		PerMonthInfoDateCell
	},
	computed: {
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
		getLocumCompletedJobs() {
			return this.$store.getters["jobs/getLocumCompletedJobs"];
		},
		// WHOLE
		getLocumAllocatedJobs() {
			return this.$store.getters["jobs/getLocumAllocatedJobs"];
		},
		getLocumAppliedJobs() {
			return this.$store.getters["jobs/getLocumAppliedJobs"];
		},
		getLocumAvailableJobs() {
			return this.$store.getters["jobs/getLocumAvailableJobs"];
		},
		// UNAVAILABILITIES
		getLocumUnavailabilities() {
			return this.$store.getters["jobs/getLocumUnavailabilities"];
		}
	},
	created() {
		this.$emit("hasActivities");
	},
	methods: {
		// DOUBLE CHECK LOCUM
		hasActiveJobs(date, day) {
			let hasOngoing = false;
			let hasLive = false;
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
				);
				hasLive = this.getPracticeAvailableJobs.find(
					job =>
						this.getDateArray(job.date_start, job.date_end).includes(date) &&
						((job.include_saturday === false && day !== 6) ||
							job.include_saturday === true) &&
						((job.include_sunday === false && day !== 0) ||
							job.include_sunday === true)
				);
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
				);
			}
			return hasOngoing || hasLive ? true : false;
		},
		hasPendingJobs(date, day) {
			let hasApplied = false;

			if (this.$auth.user.domain === "Practice") {
				hasApplied = this.getPracticeAppliedJobs.find(
					job =>
						this.getDateArray(job.date_start, job.date_end).includes(date) &&
						((job.include_saturday === false && day !== 6) ||
							job.include_saturday === true) &&
						((job.include_sunday === false && day !== 0) ||
							job.include_sunday === true)
				);
			}
			if (this.$auth.user.domain === "Locum") {
				hasApplied = this.getLocumAppliedJobs.find(
					job =>
						this.getDateArray(job.date_start, job.date_end).includes(date) &&
						job.shift.name === type &&
						((job.include_saturday === false && day !== 6) ||
							job.include_saturday === true) &&
						((job.include_sunday === false && day !== 0) ||
							job.include_sunday === true)
				);
			}
			return hasApplied ? true : false;
		},
		hasUnfilledJobs(date, day) {
			let hasUnfilled = this.getPracticeUnfilledJobs.find(
				job =>
					this.getDateArray(job.date_start, job.date_end).includes(date) &&
					((job.include_saturday === false && day !== 6) ||
						job.include_saturday === true) &&
					((job.include_sunday === false && day !== 0) ||
						job.include_sunday === true)
			);
			let hasDeclined = this.getPracticeDeclinedJobs.find(
				job =>
					this.getDateArray(job.date_start, job.date_end).includes(date) &&
					((job.include_saturday === false && day !== 6) ||
						job.include_saturday === true) &&
					((job.include_sunday === false && day !== 0) ||
						job.include_sunday === true)
			);

			return hasUnfilled || hasDeclined ? true : false;
		},
		hasAMShift(date, day) {
			let hasActiveAMShift = false;
			let hasPendingAMShift = false;
			let hasUnfilledAMShift = false;
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false;
				let hasLive = false;
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
					);
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				if (this.$auth.user.domain === "Locum") {
					hasOngoing = this.getLocumOngoingJobs.find(
						job_part =>
							this.getDateArray(
								job_part.date_start,
								job_part.date_end
							).includes(date) &&
							((job_part.job.include_saturday === false && day !== 6) ||
								job_part.job.include_saturday === true) &&
							((job_part.job.include_sunday === false && day !== 0) ||
								job_part.job.include_sunday === true)
					);
				}
				hasActiveAMShift = hasOngoing || hasLive ? true : false;
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false;
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasActiveAMShift = hasApplied ? true : false;
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false;
				let hasDeclined = false;
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "AM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasActiveAMShift = hasUnfilled || hasDeclined ? true : false;
			}

			return hasActiveAMShift || hasPendingAMShift || hasUnfilledAMShift
				? true
				: false;
		},
		hasPMShift(date, day) {
			let hasActivePMShift = false;
			let hasPendingPMShift = false;
			let hasUnfilledPMShift = false;
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false;
				let hasLive = false;
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
					);
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasActivePMShift = hasOngoing || hasLive ? true : false;
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false;
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasPendingPMShift = hasApplied ? true : false;
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false;
				let hasDeclined = false;
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "PM" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasUnfilledPMShift = hasUnfilled || hasDeclined ? true : false;
			}
			return hasActivePMShift || hasPendingPMShift || hasUnfilledPMShift;
		},
		hasOOHShift(date, day) {
			let hasActiveOOHShift = false;
			let hasPendingOOHShift = false;
			let hasUnfilledOOHShift = false;
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false;
				let hasLive = false;
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
					);
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasActiveOOHShift = hasOngoing || hasLive ? true : false;
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false;
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasPendingOOHShift = hasApplied ? true : false;
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false;
				let hasDeclined = false;
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "OOH" &&
							((job.include_saturday === false && day !== 6) ||
								job.include_saturday === true) &&
							((job.include_sunday === false && day !== 0) ||
								job.include_sunday === true)
					);
				}
				hasUnfilledOOHShift = hasUnfilled || hasDeclined ? true : false;
			}

			return hasActiveOOHShift || hasPendingOOHShift || hasUnfilledOOHShift;
		},
		hasWholeDayShift(date, day) {
			let hasActiveWDShift = false;
			let hasPendingWDShift = false;
			let hasUnfilledWDShift = false;
			if (this.hasActiveJobs(date, day)) {
				let hasOngoing = false;
				let hasLive = false;
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
					);
					hasLive = this.getPracticeAvailableJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					);
				}
				hasActiveWDShift = hasOngoing || hasLive ? true : false;
				if (date === "2020-02-28") {
				}
			}
			if (this.hasPendingJobs(date, day)) {
				let hasApplied = false;
				if (this.$auth.user.domain === "Practice") {
					hasApplied = this.getPracticeAppliedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					);
				}
				hasPendingWDShift = hasApplied ? true : false;
				if (date === "2020-02-28") {
				}
			}
			if (this.hasUnfilledJobs(date, day)) {
				let hasUnfilled = false;
				let hasDeclined = false;
				if (this.$auth.user.domain === "Practice") {
					hasUnfilled = this.getPracticeUnfilledJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					);
					hasDeclined = this.getPracticeDeclinedJobs.find(
						job =>
							this.getDateArray(job.date_start, job.date_end).includes(date) &&
							job.shift.name === "Whole Day"
					);
				}
				hasUnfilledWDShift = hasUnfilled || hasDeclined ? true : false;
				if (date === "2020-02-28") {
				}
			}
			return hasActiveWDShift || hasPendingWDShift || hasUnfilledWDShift;
		},
		getStatusCount(date, day) {
			let filterStatus = [
				this.hasAMShift(date, day),
				this.hasPMShift(date, day),
				this.hasOOHShift(date, day),
				this.hasWholeDayShift(date, day)
			].filter(item => item == true);
			return filterStatus.length;
		},
		statusStyle(date, day, count) {
			if (count == 1) {
				let shift;
				if (this.hasAMShift(date, day)) {
					shift = "AM";
				} else if (this.hasPMShift(date, day)) {
					shift = "PM";
				} else if (this.hasOOHShift(date, day)) {
					shift = "OOH";
				} else if (this.hasWholeDayShift(date, day)) {
					shift = "WD";
				} else {
					return;
				}
				switch (shift) {
					case "AM":
						return "bg-pink-500";
						break;
					case "PM":
						return "bg-blue-400";
						break;
					case "WD":
						return "bg-orange-500";
						break;
					case "OOH":
						return "bg-green-500";
						break;
					default:
						return "bg-gray-500";
						break;
				}
			}
			if (count > 1) {
				let shifts = [];
				if (this.hasAMShift(date, day)) {
					shifts.push({ name: "AM", style: "bg-pink-500" });
				}
				if (this.hasPMShift(date, day)) {
					shifts.push({ name: "PM", style: "bg-blue-400" });
				}
				if (this.hasOOHShift(date, day)) {
					shifts.push({ name: "OOH", style: "bg-green-500" });
				}
				if (this.hasWholeDayShift(date, day)) {
					shifts.push({ name: "WD", style: "bg-orange-500" });
				}
				return shifts;
			}
		}
	}
};
</script>