<template>
  <div class="modal-container shadow-lg">
    <JobPartDetailModalAppointment
      :job_part="job_part"
      v-if="job_part.job.type === 'Private'"
      @close="$router.push('/jobs/ongoing')"
    />
    <JobPartDetailModal
      :job_part="job_part"
      v-if="job_part.job.type === 'Platform'"
      @close="$router.push('/jobs/ongoing')"
    />
  </div>
</template>
<script>
import JobPartDetailModalAppointment from "@/components/Jobs/JobPartDetailModalAppointment";
import JobPartDetailModal from "@/components/Jobs/JobPartDetailModal";
export default {
  components: {
    JobPartDetailModalAppointment,
    JobPartDetailModal
  },
  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.get(
        `/api/v1/locum/job-parts/${route.params.id}`
      );

      const job_part = response.data.data.job_part;

      return {
        job_part
      };
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: "This page could not be found" });
      }
      throw err;
    }
  }
};
</script>

<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>
