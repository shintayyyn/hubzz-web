<template>
  <div class="p-4 md:p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>

    <div class="flex flex-row justify-start mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{ job_part.job.title }}</div>
      <div
        class="mx-2 py-2 px-4 rounded font-semibold"
        :class="bgStatus(job_part.locum_status)"
      >{{ job_part.locum_status }}</div>
      <div
        class="py-2 px-4 rounded font-semibold"
        :class="
						jobPartStatus === 'Completed' ? 'bg-green-500' : 'bg-gray-300'
					"
        v-if="job_part.locum_status === 'Completed'"
      >{{ jobPartStatus }}</div>
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
    close() {
      this.$emit("close");
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
