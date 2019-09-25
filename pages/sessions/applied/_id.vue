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
      if (
        !app.$auth.user.practice_detail.role.permissions
          .map(item => item.name)
          .includes("Show Sessions Job")
      ) {
        error({
          statusCode: 401,
          message: "You're Not Authorized To View This Page"
        });
      }
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