<template>
  <div class="p-4 md:p-8">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start items-center my-3">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job_part.job.title}}</div>
      <div
        class="mx-2 text-sm sm:text-sm py-2 px-4 rounded font-semibold"
        :class="bgStatus(job_part.locum_status)"
      >{{status(job_part.locum_status)}}</div>
      <div
        class="mx-2 text-sm sm:text-sm py-2 px-4 rounded font-semibold"
        :class="jobPartStatus === 'Completed' ? 'bg-green-500' : 'bg-gray-300'"
        v-if="job_part.locum_status === 'Completed'"
      >{{jobPartStatus}}</div>
    </div>
    <div class="text-xs sm:text-sm py-2">Posted {{$moment(job_part.date_created).format('DD/MM/YYYY')}}</div>
    <div class="flex flex-row flex-wrap justify-start">
      <div class="p-0 md:pr-4 w-full md:w-1/2">
        <JobPartDetailModalParts class="md:hidden" :parts="job_part.job.job_parts" :job_id="job_part.job.id" />
        <JobPartDetailModalInfo :job_part="job_part" />
      </div>
      <div class="p-0 md:pl-4 my-4 md:m-0 w-full md:w-1/2">
        <div class="flex flex-col">
          <JobPartDetailModalParts class="hidden md:block" :parts="job_part.job.job_parts" :job_id="job_part.job.id" />
          <JobDetailModalMap :job="job_part.job" />
          <JobDetailModalUnassignForm
            :job="job_part.job"
            v-if="job_part.locum_status === 'Current'"
            @close="close"
            @removeJobPart="removeJobPart"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import JobPartDetailModalInfo from "@/components/Jobs/JobPart/JobPartDetailModalInfo";
import JobPartDetailModalParts from "@/components/Jobs/JobPart/JobPartDetailModalParts";
//
import JobDetailModalInfo from "@/components/Jobs/JobDetailModalInfo";
import JobDetailModalMap from "@/components/Jobs/JobDetailModalMap";
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm";
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm";
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm";
export default {
  props: ["job_part"],
 
  components: {
    JobPartDetailModalInfo,
    JobPartDetailModalParts,
    //
    JobDetailModalInfo,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm
  },
  mounted() {
    // console.log("qweweqw",this.job_part);
  },

  computed: {
    jobPartStatus() {
      let status = "TO BE INVOICED";
      if (this.job_part.disputed) {
        status = "DISPUTED";
      }
      if (this.job_part.invoiced && this.job_part.issued) {
        status = "INVOICED";
      }
      return status;
    }
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
      if (status === "Ongoing") {
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
          return "bg-green-400 text-white";
          break;
        case "Allocated":
          return "bg-green-400";
          break;
        default:
          return "bg-red-500 text-white";
      }
    }
  }
};
</script>

