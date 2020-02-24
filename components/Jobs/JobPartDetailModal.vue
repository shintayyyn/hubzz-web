<template>
  <div class="p-4 md:p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>

    <div class="flex flex-row justify-start mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{ job_part.job.title }}</div>
      <div
        class="py-2 px-4 mx-1 rounded font-semibold"
        :class="bgStatus(job_part.locum_status)"
      >{{ status(job_part.locum_status) }}</div>
      <div
        class="py-2 px-4 mx-1 rounded font-semibold bg-gray-300"
        v-if="['Completed','Cancelled'].includes(job_part.locum_status) && tagStatus(job_part)"
      >{{ tagStatus(job_part) }}</div>
    </div>

    <div
      class="text-xs sm:text-sm py-3"
    >Posted {{ $moment(job_part.date_created).format("DD/MM/YYYY") }}</div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 lg:pr-4 w-full lg:w-1/2">
          <div class="flex flex-col">
            <JobPartDetailModalInfo :job_part="job_part" />
            <JobDetailModalUnassignForm
              :ref="'unassignForm'"
              :job="job_part.job"
              @unassign="$emit('close')"
              v-if="job_part.locum_status === 'Ongoing'"
            />
          </div>
        </div>
        <div class="p-0 md:pl-4 w-full md:w-1/2 order-first md:order-none">
          <div class="flex flex-col">
            <JobPartDetailModalParts :job_id="job_part.job.id" />
            <JobDetailModalMap :job="job_part.job" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import JobPartDetailModalInfo from "@/components/Jobs/JobPart/JobPartDetailModalInfo";
import JobPartDetailModalParts from "@/components/Jobs/JobPart/JobPartDetailModalParts";
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
    JobDetailModalInfo,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm
  },
  methods: {
    tagStatus(job_part) {
      let status = "";
      if (job_part.locum_status === "Completed") {
        status = "TO BE INVOICED";
        if (job_part.disputed && job_part.issued) {
          status = "DISPUTED";
        } else if (job_part.invoiced && job_part.issued) {
          status = "INVOICED";
        }
        return status;
      } else if (job_part.locum_status === "Cancelled") {
        return job_part.terminated ? "TERMINATED" : null;
      }
    },
    status(status) {
      return status.toUpperCase();
    },
    bgStatus(status) {
      switch (status) {
        case "Ongoing":
        case "Completed":
        case "Approved":
          return "bg-green-600 text-white";
          break;
        default:
          return "bg-red-500 text-white";
      }
    }
  }
};
</script>
