<template>
  <div
    class="relative rounded-lg py-3 px-5 my-1 bg-white cursor-pointer hover:bg-gray-300"
    @click="select"
  >
    <template v-if="job.type">
      <div
        class="absolute left-0 top-0 rounded-l-lg p-2 h-full"
        :class="bgStatus(job.locum_status)"
      ></div>
      <div class="ml-2">
        <div class="text-gray-500 text-xs xl:text-sm">Job Number: {{job.job_number}}</div>
        <div class="my-3 font-bold text-sm sm:text-md">{{title(job.type)}}</div>
        <div class="my-3 text-sm sm:text-md">{{surgeryName(job.type)}}</div>
        <div class="my-3 text-sm sm:text-md">{{surgeryCode(job.type)}}</div>
        <div
          class="text-gray-500 my-3 text-xs xl:text-sm"
        >From {{dateStart(job.type)}} to {{dateEnd(job.type)}}</div>
        <div class="text-gray-500 my-3 text-xs xl:text-sm">Shift: {{shift(job.type)}}</div>
        <div class="my-3 text-xs xl:text-sm break-words">{{description(job.type)}}</div>
      </div>
    </template>
    <template v-else>
      <div class="bg-pink-500 absolute left-0 top-0 rounded-l-lg p-2 h-full"></div>
      <div class="ml-2">
        <div class="my-3 font-bold text-sm sm:text-md">Unavailable</div>
        <div
          class="my-3 text-xs xl:text-sm"
          v-if="$store.state.calendar.view_type === 'per_month'"
        >Shifts: {{unavailableShift(job.shifts)}}</div>
        <div
          class="my-3 text-xs xl:text-sm"
          v-if="$store.state.calendar.view_type === 'per_week'"
        >Shift: {{unavailableShift(job.shifts)}}</div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: ["job"],
  methods: {
    select() {
      if (this.job.type) {
        this.$axios.$get(`/api/v1/locum/jobs/${this.job.id}`).then(res => {
          this.$emit("viewLocumJob", res.data.job);
        });
      } else {
        this.$router.push("/availability");
      }
    },
    title(type) {
      return type === "Private" ? "Private appointment" : this.job.title;
    },
    surgeryName(type) {
      return this.job.surgery_name;
    },
    surgeryCode(type) {
      return type === "Private"
        ? this.job.private_job.private_practice.surgery.code
        : this.job.platform_job.practice.surgery.code;
    },
    dateStart(type) {
      return this.job.date_start;
    },
    dateEnd(type) {
      return this.job.date_end;
    },
    shift(type) {
      return this.job.shift.name;
    },
    description(type) {
      return this.job.description;
    },
    unavailableShift(shifts) {
      if (this.$store.state.calendar.view_type === "per_month") {
        return shifts.map(shift => shift.name).join();
      }
      return shifts.filter(
        job => job.name === this.$store.state.calendar.selected_date_shift.shift
      )[0].name;
    },
    bgStatus(type, reminder) {
      switch (type) {
        case "Applied":
          return "bg-orange-400";
          break;
        case "Completed":
          return "bg-green-400";
          break;
        case "Current":
          return "bg-green-400";
          break;
        default:
          return "bg-red-500";
      }
    }
  }
};
</script>