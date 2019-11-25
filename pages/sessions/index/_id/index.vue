<template>
  <div class="modal-container shadow-lg">
    <template v-if="job && !job_part">
      <JobDetailModal :job="job" @close="close" />
    </template>
    <template v-if="!job && job_part">
      <JobPartDetailModal :job_part="job_part" @close="close" />
    </template>
  </div>
</template>
<script>
import JobDetailModal from "@/components/Sessions/JobDetailModal";
import JobPartDetailModal from "@/components/Sessions/JobPartDetailModal";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    JobDetailModal,
    JobPartDetailModal
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
        query.status &&
        ["ongoing", "completed", "approved"].includes(
          query.status.toLowerCase()
        )
      ) {
        url = `/api/v1/practice/job-parts`;
      }

      let response = await app.$axios.get(`${url}/${params.id}`);
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
  watch: {
    $route({ params }) {
      if (params && params.id) {
        this.removeNotification(parseInt(params.id));
      }
    }
  },
  mounted() {
    this.removeNotification(parseInt(this.$route.params.id));
  },
  methods: {
    close() {
      this.$router.push({
        path: `/sessions`,
        query: { ...this.$route.query }
      });
    },
    removeNotification(id) {
      let index = this.$store.state.jobs.practice_job_notifications.findIndex(
        job => job.id === id
      );
      if (index >= 0) {
        this.$store.commit("jobs/REMOVE_PRACTICE_JOB_NOTIFICATION", id);
      }
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