<template>
  <div class="p-4 md:p-8">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex items-center justify-start mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job.title}}</div>
      <div
        class="mx-2 text-sm sm:text-sm p-2 uppercase"
        :class="bgStatus(job.locum_status)"
      >{{job.locum_status}}</div>
    </div>
    <div class="text-xs sm:text-sm py-3">Posted {{$moment(job.date_created).format('DD/MM/YYYY')}}</div>
    <div class="flex flex-wrap justify-start">
      <div class="p-0 md:pr-4 w-full md:w-1/2">
        <div class="flex flex-col">
          <JobDetailModalInfo :job="job" />
          <JobDetailModalUnassignForm
            :job="job"
            v-if="job.locum_status === 'Allocated'"
            @close="close"
          />
          <JobDetailModalApplyForm
            :job="job"
            v-if="job.locum_status === 'Available' || job.locum_status === 'Matched'"
            :compliances="job.platform_job.compliance_documents.map(item => item.id)"
            @close="close"
          />
          <JobDetailModalCancelForm
            :job="job"
            v-if="job.locum_status === 'Applied'"
            @close="close"
          />
        </div>
      </div>
      <div class="p-0 md:pl-4 w-full md:w-1/2 mt-4 md:m-0">
        <div class="flex flex-col">
          <JobPartDetailModalParts :job_id="job.id" :disabledLink="true" />
          <JobDetailModalMap :job="job" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import JobDetailModalInfo from "@/components/Jobs/JobDetailModalInfo";
import JobPartDetailModalParts from "@/components/Jobs/JobPart/JobPartDetailModalParts";
import JobDetailModalMap from "@/components/Jobs/JobDetailModalMap";
import JobDetailModalUnassignForm from "@/components/Jobs/JobDetailModalUnassignForm";
import JobDetailModalApplyForm from "@/components/Jobs/JobDetailModalApplyForm";
import JobDetailModalCancelForm from "@/components/Jobs/JobDetailModalCancelForm";
export default {
  props: ["job"],
  components: {
    JobDetailModalInfo,
    JobPartDetailModalParts,
    JobDetailModalMap,
    JobDetailModalUnassignForm,
    JobDetailModalApplyForm,
    JobDetailModalCancelForm
  },
  methods: {
    close() {
      this.$emit("close");
    },
    bgStatus(status) {
      switch (status) {
        case "Available":
        case "Matched":
          return "bg-yellow-500";
          break;
        case "Applied":
          return "bg-orange-400 text-white";
          break;
        case "Completed":
          return "bg-green-400 text-white";
          break;
        case "Allocated":
          return "bg-green-300";
          break;
        case "Ongoing":
          return "bg-green-500 text-white";
          break;
        default:
          return "bg-red-500 text-white";
      }
    }
  }
};
</script>

