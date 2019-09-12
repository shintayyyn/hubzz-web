<template>
  <div class="modal-container shadow-lg">
    <JobDetailModal :job="job" @close="$router.push(`/sessions/applied`)" />
  </div>
</template>
<script>
import JobDetailModal from "@/components/Sessions/JobDetailModal";
export default {
  components: {
    JobDetailModal
  },
  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.get(
        `/api/v1/practice/jobs/${route.params.id}`
      );
      const job =
        response.data && response.data.data && response.data.data.job
          ? response.data.data.job
          : null;
      return {
        job
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