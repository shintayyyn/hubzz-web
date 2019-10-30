<template>
  <div class="modal-container shadow-lg">
    <template v-if="job && !job_part">
      <JobDetailModal :job="job" @close="close" />
    </template>
    <template v-if="!job && job_part">
      <!-- <JobPartDetailModal :job_part="job_part" v-if="activeJobTypePlatform" @close="close" /> -->
    </template>
  </div>
</template>
<script>
import JobDetailModal from "@/components/Sessions/JobDetailModal";
import JobPartDetailModal from "@/components/Sessions/JobPartDetailModal";
export default {
  components: {
    JobDetailModal,
    JobPartDetailModal
  },
  // async asyncData({ app, route, store, error }) {
  //   try {
  //     let response = await app.$axios.get(
  //       `/api/v1/practice/jobs/${route.params.id}`
  //     );
  //     const job =
  //       response.data && response.data.data && response.data.data.job
  //         ? response.data.data.job
  //         : null;
  //     return {
  //       job
  //     };
  //   } catch (err) {
  //     if (
  //       err.response &&
  //       (err.response.status === 401 || err.response.status === 404)
  //     ) {
  //       error(err.response.data);
  //       return;
  //     }
  //     throw err;
  //   }
  // },
  async asyncData({ app, params, query, redirect, router, error }) {
    try {
      let url = `/api/v1/practice/jobs`;

      if (
        query &&
        query.status &&
        ["ongoing", "completed", "approved"].includes(
          query.status.toLowerCase()
        )
      ) {
        url = `/api/v1/practice/job-parts`;
      }

      let response = await app.$axios.get(`${url}/${params.id}`);
      console.log("response", response);
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
        path: `/jobs`,
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
    width: 80%;
  }
}
</style>