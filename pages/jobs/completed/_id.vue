<template>
  <div class="modal-container shadow-lg">
    <JobDetailModalAppointment :job="job_part.job" v-if="job_part.job.type === 'Private'" />
    <JobPartDetailModal
      :job_part="job_part"
      v-if="job_part.job.type === 'Platform'"
      @close="$router.push('/jobs/completed')"
    />
  </div>
</template>
<script>
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment";
import JobPartDetailModal from "@/components/Jobs/JobPartDetailModal";
export default {
  components: {
    JobDetailModalAppointment,
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
