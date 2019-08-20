<template>
  <div class="modal-container shadow-lg">
    <JobDetailModal :job="job" @close="$router.push('/sessions')" />
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
      let jobRes = await app.$axios.get(
        `/api/v1/practice/jobs/${route.params.id}`
      );
      const job = jobRes.data.data.job;
      return {
        job
      };
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: "This page could not be found" });
      }
      throw err;
    }
  },
  beforeDestroy() {
    this.$store.commit("jobs/TOGGLE_SHIELD", false);
  },
  created() {
    this.$store.commit("jobs/TOGGLE_SHIELD", true);
  }
};
</script>