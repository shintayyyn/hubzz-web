<template>
  <div class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-gray-300">
    <nuxt-link
      :to="{ path: `/dashboard/${propJob.id}?status=${propJob.status}`, query: {...$route.query}}"
    >
      <div class="absolute left-0 top-0 rounded-l-lg p-2 h-full" :class="bgStatus"></div>
      <div class="ml-2">
        <div class="text-gray-500 text-xs xl:text-sm">Job Number: {{jobNumber}}</div>
        <div class="my-3 font-bold text-sm sm:text-md">{{jobTitle}}</div>
        <div class="my-3 text-sm sm:text-md">{{jobSurgeryName}}</div>
        <div class="my-3 text-sm sm:text-md">{{jobSurgeryCode}}</div>
        <div class="text-gray-500 my-3 text-xs xl:text-sm">From {{dateStart}} to {{dateEnd}}</div>
        <div class="text-gray-500 my-3 text-xs xl:text-sm">Shift: {{jobShift}}</div>
        <div class="my-3 text-xs xl:text-sm break-words">{{jobDescription}}</div>
      </div>
    </nuxt-link>
  </div>
</template>
<script>
export default {
  props: ["propJob"],
  computed: {
    isJobPart() {
      return (
        this.propJob.status &&
        ["ongoing", "completed", "approved"].includes(
          this.propJob.status.toLowerCase()
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
    },
    bgStatus() {
      let job = this.isJobPart ? this.propJob.job : this.propJob;
      switch (job.status) {
        case "Live":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-400";
          break;
        case "Allocated":
          return "bg-green-300";
          break;
        case "Ongoing":
        case "Completed":
          return "bg-green-500";
          break;
        case "Unfilled":
          return "bg-red-500";
          break;
        case "AppliedReminder":
        case "AvailableReminder":
          return "bg-gray-600";
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
    },
    jobNumber() {
      return this.isJobPart
        ? this.propJob.job_part_number
        : this.propJob.job_number;
    },
    jobTitle() {
      let job = this.isJobPart ? this.propJob.job : this.propJob;
      return job.type === "Private" ? "Private appointment" : job.title;
    },
    jobSurgeryName() {
      let job = this.isJobPart ? this.propJob.job : this.propJob;
      return job.type === "Private"
        ? job.private_job.private_practice.surgery.name
        : job.platform_job.practice.surgery.name;
    },
    jobSurgeryCode() {
      let job = this.isJobPart ? this.propJob.job : this.propJob;
      return job.type === "Private"
        ? job.private_job.private_practice.code
        : job.platform_job.practice.code;
    },
    jobShift() {
      let job = this.isJobPart ? this.propJob.job : this.propJob;
      return job.shift.name;
    },
    jobDescription() {
      let job = this.isJobPart ? this.propJob.job : this.propJob;
      return job.description;
    }
  }
};
</script>