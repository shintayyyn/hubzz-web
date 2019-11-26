<template>
  <div class="p-4 md:p-8">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>

    <div class="flex flex-row justify-start mt-4">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job_part.job.title}}</div>
      <div
        class="mx-2 py-2 px-4 rounded font-semibold"
        :class="bgStatus(job_part.status)"
      >{{status(job_part.status)}}</div>
      <div
        class="py-2 px-4 rounded font-semibold"
        :class="jobPartStatus === 'Completed' ? 'bg-green-500' : 'bg-gray-300'"
        v-if="job_part.status === 'Completed'"
      >{{jobPartStatus}}</div>
    </div>

    <div class="flex flex-col mt-4">
      <div class="flex flex-wrap justify-start">
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <SessionPartDetailModalInfo :job_part="job_part" />
            <SessionDetailModalCompleteForm
              :job="job_part"
              @completed="$emit('close')"
              v-if="job_part.status === 'Ongoing' && authPermissions.includes('Complete Sessions Job')"
            />
            <SessionDetailModalCancelForm
              :job="job_part.job"
              @cancelled="$emit('close')"
              v-if="(job_part.job.status === 'Allocated' || job_part.job.status === 'Ongoing' || job_part.job.status === 'Applied' || job_part.job.status === 'Live') && authPermissions.includes('Cancel Sessions Job')"
            />
          </div>
        </div>
        <div class="p-0 md:pr-4 w-full md:w-1/2">
          <div class="flex flex-col">
            <SessionPartDetailModalParts
              :job_id="job_part.job.id"
              :disabledLink="$route.path === '/dashboard'"
            />
            <SessionDetailModalLocum
              :job="job_part.job"
              v-if="(job_part.status === 'Allocated' || job_part.status === 'Ongoing' || job_part.status === 'Completed')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SessionPartDetailModalInfo from "@/components/Sessions/SessionPart/SessionPartDetailModalInfo";
import SessionPartDetailModalParts from "@/components/Sessions/SessionPart/SessionPartDetailModalParts";
import SessionDetailModalCancelForm from "@/components/Sessions/SessionDetailModalCancelForm";
import SessionDetailModalCompleteForm from "@/components/Sessions/SessionDetailModalCompleteForm";
import SessionDetailModalLocum from "@/components/Sessions/SessionDetailModalLocum";
export default {
  props: ["job_part"],
  components: {
    SessionPartDetailModalInfo,
    SessionPartDetailModalParts,
    SessionDetailModalCompleteForm,
    SessionDetailModalCancelForm,
    SessionDetailModalLocum
  },
  data() {
    return {
      user: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    },
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
    status(status) {
      if (status === "Available") {
        return "LIVE";
      }
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
<style scoped>
.shield {
  z-index: 511;
}
.modal-container {
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 60%;
  }
}
</style>
