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
        >
          {{ propJob.locum_status !== 'Permanent' ? `Job ID: ${jobNumber}` : 'Permanent / Salaried Role' }}
        </div>
        <div class="text-gray-800 my-1 font-bold">
          {{ jobTitle }}
        </div>
        <div
          v-if="propJob.locum_status === 'Permanent'"
          class="my-2 text-sm px-1 text-white rounded w-1/2 sm:w-1/4 lg:w-1/2 text-center"
          :class="shiftStyle(jobShift)"
        >
          {{ jobShift }}
        </div>
        <div v-else class="flex flex-wrap items-center w-full">
          <div v-for="shift in jobShift" :key="shift.id" class="w-1/2">
            <div
              :key="shift.id"
              class="my-1 mx-1 text-sm px-1 text-white rounded text-center"
              :class="shiftStyle(shift.name)"
            >
              {{ shift.name }}
            </div>
          </div>
        </div>
        <div class="text-gray-600 mt-2 text-sm sm:text-md">
          {{ jobSurgeryName }}
        </div>
        <div class="text-gray-600 mb-2 text-sm sm:text-md">
          {{ jobSurgeryCode }}
        </div>
        <div class="text-gray-600 text-xs xl:text-sm font-bold text-center">
          <template v-if="propJob.locum_status === 'Permanent'">
            {{ interviewDate }}
          </template>
          <template v-else>
            {{ $moment(dateStart).format('DD/MM/YYYY') }}
            <span class="font-normal px-1">to</span>
            {{ $moment(dateEnd).format('DD/MM/YYYY') }}
          </template>
        </div>
      </div>
    </template>
    <p
      class="text-center py-1 text-sm w-full font-bold"
      :class="['Applied'].includes(job.locum_status) ? 'text-black' : 'text-white'"
    >
      Click to view Details
    </p>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    propJob: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    job () {
      return this.isJobPart ? this.propJob.job : this.propJob
    },

    isJobPart () {
      if (
        (this.propJob && this.propJob.job)
				|| (this.propJob.job && this.propJob.job.type === "Private")
      ) {
        return true
      }

      return (
        this.propJob.locum_status
				&& ["ongoing", "allocated",].includes(this.propJob.locum_status.toLowerCase())
      )
    },

    link () {
      let job = this.propJob

      console.log('link', job)

      if (job.locum_status === "Permanent") {
        return `/permanent-jobs/${this.propJob.permanent_job_id}`
      }

      if (!this.job.type) {
        return {
          path: `/availability/${this.job.date}`,
        }
      }

      let status = job.type === "Private"
        ? "Private"
        : job.status

      let id = ["Ongoing",].includes(this.propJob.status) && this.propJob.job.type === "Platform"
        ? this.propJob.id
        : this.propJob.job
          ? this.propJob.job.id
          : this.propJob.id

      return {
        path: `/dashboard/${id}?status=${status}`,
        query: { ...this.$route.query, },
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
    bgStatus () {
      // let job = this.isJobPart ? this.propJob.job : this.propJob
      // if (job.type === "Private") {
      // 	if (job.locum_status === )
      // }
      switch (this.propJob.locum_status) {
      case "Applied":
        return `bg-job-pending`
      case "Allocated":
        return `bg-job-active`
      case "Ongoing":
        return `bg-blue-500`
      case "Permanent":
        return `bg-blue-300`
      default:
        return `bg-gray-500`
      }
    },
    dateStart () {
      return this.propJob.date_start
    },
    dateEnd () {
      return this.propJob.date_end
    },
    interviewDate () {
      return this.$moment(
        this.propJob.invitation_schedule,
        "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
      ).format("DD/MM/YYYY, h:mm A")
    },
    jobNumber () {
      return this.isJobPart
        ? this.propJob.job_part_number
        : this.propJob.job_number
    },
    jobTitle () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.locum_status === "Permanent"
        ? job.permanent_job.title
        : job.type === "Platform"
          ? job.title
          : "Private appointment"
    },
    jobSurgeryName () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.locum_status === "Permanent"
        ? job.permanent_job.practice.name
        : job.type === "Platform"
          ? job.platform_job.practice.name
          : job.private_job.private_practice.name
    },
    jobSurgeryCode () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.locum_status === "Permanent"
        ? job.permanent_job.practice.code
        : job.type === "Platform"
          ? job.platform_job.practice.code
          : job.private_job.private_practice.code
    },
    jobShift () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.locum_status === "Permanent" ? "Interview" : job.shifts
    },
    jobDescription () {
      let job = this.isJobPart ? this.propJob.job : this.propJob
      return job.description
    },
  },
  methods: {
    shiftStyle (shift) {
      if (this.propJob.locum_status === "Permanent") {
        return "bg-blue-500"
      } else {
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
          break
        }
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
.job-card:hover > div {
	background-color: #f0f0f0;
}
</style>
