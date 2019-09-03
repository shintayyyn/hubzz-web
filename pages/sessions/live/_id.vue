<template>
  <JobDetailModal :job="job" @close="$router.push(`/sessions/live`)" />
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
      const job = response.data.data.job;
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