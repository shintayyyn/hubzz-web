<template>
	<nuxt-link
		:to="{ path: job.type ? `/dashboard/${propJob.id}?status=${propJob.status}` : `/availability/${job.date}`, query: {...$route.query}}"
		class="flex flex-col items-start pl-2 rounded-lg mb-2 job-card transition-hover"
		:class="isNotUnavailable ? bgStatus : 'bg-pink-500'"
	>
		<template v-if="isNotUnavailable">
			<div class="bg-white shadow w-full rounded-t rounded-bl-lg rounded-br p-2 transition-hover">
				<div class="text-gray-600 text-sm xl:text-sm">Job ID: {{jobNumber}}</div>
				<div class="text-gray-800 my-1 font-bold">{{jobTitle}}</div>
				<div
					class="my-2 text-sm px-1 text-white rounded w-1/2 sm:w-1/4 lg:w-1/2 text-center"
					:class="shiftStyle(jobShift)"
				>{{jobShift}}</div>
				<div class="text-gray-600 mt-2 text-sm sm:text-md">{{jobSurgeryName}}</div>
				<div class="text-gray-600 mb-2 text-sm sm:text-md">{{jobSurgeryCode}}</div>
				<div class="text-gray-600 text-xs xl:text-sm font-bold text-center">
					{{$moment(dateStart).format('DD / MM / YYYY')}}
					<span class="font-normal px-1">to</span>
					{{$moment(dateEnd).format('DD / MM / YYYY')}}
				</div>
			</div>
		</template>
		<template v-if="!isNotUnavailable">
			<!-- <div class="bg-pink-500 absolute left-0 top-0 rounded-l-lg p-2 h-full"></div> -->
			<div class="bg-white shadow w-full rounded-t rounded-bl-lg rounded-br p-2 transition-hover">
				<div class="my-2 font-bold text-sm sm:text-md">Unavailable</div>
				<div
					class="my-2 text-xs xl:text-sm"
					v-if="$store.state.calendar.view_type === 'per_month'"
				>Shifts: {{unavailableShift}}</div>
				<div
					class="my-2 text-xs xl:text-sm"
					v-if="$store.state.calendar.view_type === 'per_week'"
				>Shift: {{unavailableShift}}</div>
			</div>
		</template>
		<p class="text-center text-white py-1 text-sm w-full font-bold">Click to view Details</p>
	</nuxt-link>
</template>
<script>
export default {
	props: ["propJob"],
	computed: {
		job() {
			return this.isJobPart ? this.propJob.job : this.propJob;
		},
		isJobPart() {
			return (
				this.propJob.locum_status &&
				["ongoing", "completed", "approved"].includes(
					this.propJob.locum_status.toLowerCase()
				)
			);
		},
		isNotUnavailable() {
			if (this.isJobPart) {
				if (
					this.propJob.job.type &&
					["private", "platform"].includes(this.propJob.job.type.toLowerCase())
				) {
					return true;
				}
			}
			if (!this.isJobPart) {
				if (
					this.propJob.type &&
					["private", "platform"].includes(this.propJob.type.toLowerCase())
				) {
					return true;
				} else {
					return false;
				}
			}
			// return this.isJobPart;
		},
		bgStatus() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			switch (job.locum_status) {
				case "Applied":
					return "bg-orange-400";
					break;
				case "Ongoing":
					return "bg-green-500";
					break;
				default:
					return "bg-red-500";
			}
		},
		dateStart() {
			return this.propJob.date_start;
		},
		dateEnd() {
			return this.propJob.date_end;
		},
		unavailableShift() {
			// if (this.propJob.type === "Platform") {
			let shifts = this.propJob.shifts;
			if (this.$store.state.calendar.view_type === "per_month") {
				return shifts.map(shift => shift.name).join();
			}

			if (this.$store.state.calendar.view_type === "per_week") {
				let filteredShifts = shifts.filter(
					shift =>
						shift.name === this.$store.state.calendar.selected_date_shift.shift
				);

				if (filteredShifts && filteredShifts.length > 0) {
					return filteredShifts[0].name;
				} else {
					return this.propJob.shifts[0].name;
				}
			}
			// } else if (this.propJob.type === "Private") {
			//   return this.propJob.shift.name;
			// }
		},
		jobNumber() {
			return this.isJobPart
				? this.propJob.job_part_number
				: this.propJob.job_number;
		},
		jobTitle() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.type === "Platform" ? job.title : "Private appointment";
		},
		jobSurgeryName() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.type === "Platform"
				? job.platform_job.practice.name
				: job.private_job.private_practice.name;
		},
		jobSurgeryCode() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.type === "Platform"
				? job.platform_job.practice.code
				: job.private_job.private_practice.code;
		},
		jobShift() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.shift.name;
		},
		jobDescription() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.description;
		}
	},
	methods: {
		shiftStyle(shift) {
			switch (shift) {
				case "PM":
					return "bg-blue-400";
					break;
				case "AM":
					return "bg-pink-500";
					break;

				case "Whole Day":
					return "bg-orange-500";
					break;

				case "OOH":
					return "bg-purple-500";
					break;

				default:
					break;
			}
		}
	}
};
</script>
<style scoped>
.bg-blue {
	background-color: #34bbff;
}
.bg-pink {
	background-color: #ff5abf;
}
.bg-violet {
	background-color: #947ffe;
}
.bg-orange {
	background-color: #fe703e;
}
/* .job-card {
	background-color: #45e577;
}
.job-card:hover {
	background-color: #35cc65;
} */
.job-card:hover > div {
	background-color: #f0f0f0;
}
</style>