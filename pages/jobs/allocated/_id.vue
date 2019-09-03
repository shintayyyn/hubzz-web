<template>
  <div>
    <JobDetailModalAppointment :job="job" v-if="job.type === 'Private'" />
    <!-- <JobDetailModalLocum :job="job" v-else /> -->
  </div>
</template>
<script>
import JobDetailModalLocum from "@/components/Jobs/JobDetailModalLocum";
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment";
export default {
  components: {
    JobDetailModalLocum,
    JobDetailModalAppointment
  },
  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.get(
        `/api/v1/locum/jobs/${route.params.id}`
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