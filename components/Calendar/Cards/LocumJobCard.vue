<template>
	<nuxt-link
		:to="link"
		class="flex flex-col items-start pl-2 rounded-lg mb-2 job-card transition-hover"
		:class="bgStatus"
	>
		<template>
			<div class="bg-white shadow w-full rounded-t rounded-bl-lg rounded-br p-2 transition-hover">
				<div
					class="text-gray-600 text-sm xl:text-sm"
				>{{ propJob.locum_status !== 'Permanent' ? `Job ID: ${jobNumber}` : 'Permanent / Salaried Role' }}</div>
				<div class="text-gray-800 my-1 font-bold">{{ jobTitle }}</div>
				<div
					class="my-2 text-sm px-1 text-white rounded w-1/2 sm:w-1/4 lg:w-1/2 text-center"
					:class="shiftStyle(jobShift)"
				>{{ jobShift }}</div>
				<div class="text-gray-600 mt-2 text-sm sm:text-md">{{ jobSurgeryName }}</div>
				<div class="text-gray-600 mb-2 text-sm sm:text-md">{{ jobSurgeryCode }}</div>
				<div class="text-gray-600 text-xs xl:text-sm font-bold text-center">
					<template v-if="propJob.locum_status === 'Permanent'">{{interviewDate}}</template>
					<template v-else>
						{{ $moment(dateStart).format('DD / MM / YYYY') }}
						<span class="font-normal px-1">to</span>
						{{ $moment(dateEnd).format('DD / MM / YYYY') }}
					</template>
				</div>
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
			if (
				this.propJob &&
				this.propJob.job &&
				this.propJob.job.type === "Private"
			) {
				return true;
			}
			return (
				this.propJob.locum_status &&
				["ongoing", "completed", "approved"].includes(
					this.propJob.locum_status.toLowerCase()
				)
			);
		},
		link() {
			if (this.propJob.locum_status !== "Permanent") {
				return {
					path: this.job.type
						? `/dashboard/${this.propJob.id}?status=${this.propJob.status}`
						: `/availability/${this.job.date}`,
					query: { ...this.$route.query }
				};
			} else {
				return `/permanent-jobs/${this.propJob.permanent_job_id}`;
			}
		},
		// isNotUnavailable () {
		// 	if (this.isJobPart) {
		// 		if (
		// 			this.propJob.job.type &&
		// 			["private", "platform"].includes(this.propJob.job.type.toLowerCase())
		// 		) {
		// 			return true
		// 		}
		// 	}
		// 	if (!this.isJobPart) {
		// 		if (
		// 			this.propJob.type &&
		// 			["private", "platform"].includes(this.propJob.type.toLowerCase())
		// 		) {
		// 			return true
		// 		} else {
		// 			return false
		// 		}
		// 	}
		// 	// return this.isJobPart;
		// },
		bgStatus() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			// if (job.type === "Private") {
			// 	if (job.locum_status === )
			// }

			switch (job.locum_status) {
				case "Applied":
				case "Allocated":
					return `bg-job-pending`;
					break;
				case "Ongoing":
					return `bg-job-active`;
					break;
				case "Permanent":
					return `bg-blue-500`;
					break;
				default:
					return `bg-gray-500`;
			}
		},
		dateStart() {
			return this.propJob.date_start;
		},
		dateEnd() {
			return this.propJob.date_end;
		},
		interviewDate() {
			return this.$moment(this.propJob.invitation_schedule).format(
				"DD / MM / YYYY | hh:mm A"
			);
		},
		jobNumber() {
			return this.isJobPart
				? this.propJob.job_part_number
				: this.propJob.job_number;
		},
		jobTitle() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.locum_status === "Permanent"
				? job.permanent_job.title
				: job.type === "Platform"
				? job.title
				: "Private appointment";
		},
		jobSurgeryName() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.locum_status === "Permanent"
				? "surgery"
				: job.type === "Platform"
				? job.platform_job.practice.name
				: job.private_job.private_practice.name;
		},
		jobSurgeryCode() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.locum_status === "Permanent"
				? "surgery"
				: job.type === "Platform"
				? job.platform_job.practice.code
				: job.private_job.private_practice.code;
		},
		jobShift() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.locum_status === "Permanent" ? "Interview" : job.shift.name;
		},
		jobDescription() {
			let job = this.isJobPart ? this.propJob.job : this.propJob;
			return job.description;
		}
	},
	methods: {
		shiftStyle(shift) {
			if (this.propJob.locum_status === "Permanent") {
				return "bg-blue-500";
			} else {
				switch (shift) {
					case "PM":
						return "bg-shift-pm";
						break;
					case "AM":
						return "bg-shift-am";
						break;

					case "Whole Day":
						return "bg-shift-whole-day";
						break;

					case "OOH":
						return "bg-shift-ooh";
						break;
					default:
						break;
				}
			}
		}
	}
};
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
.job-card:hover > div {
	background-color: #f0f0f0;
}
</style>