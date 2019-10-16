<template>
  <section class="relative"></section>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  async asyncData({ app, params, query, redirect, router, error }) {
    try {
      let url = `/api/v1/locum/jobs`;

      if (
        query &&
        query.status &&
        ["ongoing", "completed", "approved"].includes(
          query.status.toLowerCase()
        )
      ) {
        url = `/api/v1/locum/job-parts`;
      }

      let response = await app.$axios.get(`${url}/${params.id}`);

      if (response.data.data.job) {
        let job = response.data.data.job;
        let jobStatus = job.locum_status.toLowerCase();
        redirect(`/jobs/${jobStatus}/${params.id}`);
      }

      if (response.data.data.job_part) {
        let job_part = response.data.data.job_part;
        let jobPartStatus = job_part.locum_status.toLowerCase();
        if (query.status && jobPartStatus === query.status.toLowerCase()) {
          redirect(`/jobs/${jobPartStatus}/${params.id}`);
        } else {
          return error({
            status: 404,
            message: "This job could not be found"
          });
        }
      }
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: "This page could not be found" });
      }
      throw err;
    }
  }
};
</script>