<template>
  <div>
    <JobDetailModalAppointment :job="job" />
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
  transitions: {
    name: "slide",
    mode: "out-in"
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

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>
