<template>
  <div class="p-8 max-w-5xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
  </div>
</template>
<script>
import JobDetailModalInfo from "@/components/Jobs/JobDetailModalInfo";
import JobDetailModalMap from "@/components/Jobs/JobDetailModalMap";
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm";
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm";
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm";
export default {
  props: ["job_part"],
  components: {
    JobDetailModalInfo,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm
  },
  methods: {
    removeJobPart(id) {
      this.$store.commit("jobs/REMOVE_LOCUM_ONGOING_JOB", id);
    },
    close() {
      this.$emit("close");
    },
    status(status) {
      if (status === "Available") {
        return "LIVE";
      }
      if (status === "Current") {
        return "ONGOING";
      }
      return status.toUpperCase();
    },
    bgStatus(status) {
      switch (status) {
        case "Available":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-400 text-white";
          break;
        case "Completed":
          return "bg-green-400";
          break;
        case "Current":
          return "bg-green-400";
          break;
        default:
          return "bg-red-500 text-white";
      }
    }
  }
};
</script>

