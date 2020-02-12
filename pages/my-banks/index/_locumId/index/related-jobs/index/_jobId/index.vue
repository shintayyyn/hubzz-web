<template>
  <div class="modal-container shadow-lg">
    <template v-if="job && !job_part">
      <SessionDetailModal :job="job" @close="close" />
    </template>
    <template v-if="!job && job_part">
      <SessionPartDetailModal :job_part="job_part" @close="close" />
    </template>
  </div>
</template>
<script>
import SessionDetailModal from "@/components/Sessions/SessionDetailModal";
import SessionPartDetailModal from "@/components/Sessions/SessionPartDetailModal";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    SessionDetailModal,
    SessionPartDetailModal
  },
  data() {
    return {
      job: null,
      job_part: null
    };
  },
  async asyncData({ app, params, query, redirect, router, error }) {
    try {
      let url = `/api/v1/practice/jobs`;

      if (
        query &&
        query.jobStatus &&
        ["ongoing", "completed", "approved", "withdrawn", "cancelled"].includes(
          query.jobStatus.toLowerCase()
        )
      ) {
        url = `/api/v1/practice/job-parts`;
      }

      let response = await app.$axios.get(`${url}/${params.jobId}`);
      if (response.data.data.job) {
        let job = response.data.data.job;
        return {
          job
        };
      }

      if (response.data.data.job_part) {
        let job_part = response.data.data.job_part;
        return {
          job_part
        };
      }
    } catch (err) {
      console.log(err, err.response);
      if (err && err.response && err.response.status === 404) {
        return error({
          status: 404,
          message: "This session could not be found"
        });
      }
      throw err;
    }
  },
  methods: {
    close() {
      this.$router.push({
        path: `/my-banks/${this.$route.params.locumId}/related-jobs`,
        query: { ...this.$route.query }
      });
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
    width: 70%;
  }
}
</style>