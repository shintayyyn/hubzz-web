<template>
  <nuxt-link
    :to="link"
    class="flex flex-col items-start pl-2 pb-2 rounded-lg mb-2 job-card transition-hover shadow-md"
    :class="[bgStatus, hasPermissionToShow ? 'show' : 'cursor-default']"
  >
    <div class="bg-white shadow w-full rounded-t rounded-bl-lg rounded-br p-2 transition-hover">
      <div class="text-gray-600 text-sm xl:text-sm">
        Job ID: {{ jobNumber }}
      </div>
      <div class="text-gray-800 my-1 font-bold">
        {{ jobTitle }}
      </div>
       <!--<div class="flex flex-wrap items-center w-full">
        <div v-for="shift in jobShift" :key="shift.id" class="w-1/2">
          <div
            :key="shift.id"
            class="my-1 mx-1 text-sm px-1 text-white rounded text-center"
            :class="shiftStyle(shift.name)"
          >
            {{ shift.name }}
          </div>
        </div> 
      </div>-->
      <div class="text-gray-600 mt-2 text-sm sm:text-md">
        {{ jobSurgeryName }}
      </div>
      <div class="text-gray-600 mb-2 text-sm sm:text-md">
        {{ jobSurgeryCode }}
      </div>
      <div class="text-gray-600 text-xs xl:text-sm font-bold text-center">
        {{ $moment(dateStart).format('DD / MM / YYYY') }}
        <span class="font-normal px-1">to</span>
        {{ $moment(dateEnd).format('DD / MM / YYYY') }}
      </div>
    </div>
    <!-- <p
      v-if="hasPermissionToShow"
      class="text-center text-white py-1 text-sm w-full font-bold"
    >
      Click to view Details
    </p> -->
  </nuxt-link>
</template>

<script>
export default {
  props: {
    propJob: {
      type: Object,
      default: () => null,
    },

    hasPermissionToShow: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isJobPart () {
      return (
        this.propJob.status
				&& ["ongoing", "completed", "approved", "withdrawn", "allocated",].includes(this.propJob.status.toLowerCase())
      )
    },

    link () {
      let job = this.isJobPart ? this.propJob.job : this.propJob

      let id = this.propJob.status === "Ongoing" || this.propJob.status === "Allocated"
        ? this.propJob.id
        : job.id

      return {
        path: this.hasPermissionToShow
          ? `/dashboard/${id}?status=${this.propJob.status}`
          : "/dashboard",
        query: { ...this.$route.query, },
      }
    },

    bgStatus () {
      let job = this.isJobPart
        ? this.propJob.status === "Allocated"
          ? this.propJob
          : this.propJob.job
        : this.propJob
      switch (job.status) {
      case "Allocated":
        return "bg-job-active"
      case "Applied":
        return "bg-job-pending"
      case "Unfilled":
      case "Withdrawn":
      case "Declined":
        return "bg-job-unfilled"
      default:
        return "bg-gray-500"
      }
    },
    dateStart () {
      return this.propJob.date_start
    },
    dateEnd () {
      return this.propJob.date_end
    },
    // unavailableShift() {
    // 	let shifts = this.propJob.shifts;
    // 	if (this.$store.state.calendar.view_type === "per_month") {
    // 		return shifts.map(shift => shift.name).join();
    // 	}

    // 	if (this.$store.state.calendar.view_type === "per_week") {
    // 		let filteredShifts = shifts.filter(
    // 			shift =>
    // 				shift.name === this.$store.state.calendar.selected_date_shift.shift
    // 		);

    // 		if (filteredShifts && filteredShifts.length > 0) {
    // 			return filteredShifts[0].name;
    // 		} else {
    // 			return this.propJob.shifts[0].name;
    // 		}
    // 	}
    // },
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
    // },
    jobNumber () {
      return this.isJobPart
        ? this.propJob.job_part_number
        : this.propJob.job_number
    },
    jobTitle () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.type === "Private" ? "Private appointment" : job.title
    },
    jobSurgeryName () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.type === "Private"
        ? job.private_job.private_practice.surgery.name
        : job.platform_job
          ? job.platform_job.practice.surgery.name
          : job.job_practice_name
    },
    jobSurgeryCode () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.type === "Private"
        ? job.private_job.private_practice.code
        : job.platform_job
          ? job.platform_job.practice.code
          : job.job_practice_code
    },
    jobShift () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.shifts
    },
    jobDescription () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.description
    },
  },
  methods: {
    shiftStyle (shift) {
      switch (shift) {
      case "PM":
        return "bg-shift-pm"
      case "AM":
        return "bg-shift-am"
      case "Whole Day":
        return "bg-shift-whole-day"
      case "OOH":
        return "bg-shift-ooh"
      default:
        return ""
      }
    },
  },
}
</script>

<style scoped>
/* .bg-job-active {
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
} */
/* .job-card {
	background-color: #45e577;
}
.job-card:hover {
	background-color: #35cc65;
} */
.job-card {
  box-shadow: 1px -1px 6px #ddd;
}
.job-card.show:hover > div {
	background-color: #f0f0f0;
}
</style>
