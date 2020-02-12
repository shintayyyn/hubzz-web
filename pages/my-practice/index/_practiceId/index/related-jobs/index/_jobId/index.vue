<template>
  <div class="modal-container shadow-lg">
    <template v-if="job && !job_part">
      <JobDetailModalAppointment :job="job" v-if="!activeJobTypePlatform" @close="close" />
      <JobDetailModal :job="job" v-if="activeJobTypePlatform" @close="close" />
    </template>
    <template v-if="!job && job_part">
      <JobDetailModalAppointment :job="job_part.job" v-if="!activeJobTypePlatform" @close="close" />
      <JobPartDetailModal :job_part="job_part" v-if="activeJobTypePlatform" @close="close" />
    </template>
  </div>
</template>
<script>
import JobDetailModal from "@/components/Jobs/JobDetailModal";
import JobPartDetailModal from "@/components/Jobs/JobPartDetailModal";
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    JobDetailModal,
    JobPartDetailModal,
    JobDetailModalAppointment
  },
  data() {
    return {
      job: null,
      job_part: null
    };
  },
  computed: {
    activeJobTypePlatform() {
      if (this.job) {
        return this.job.type === "Platform" ? true : false;
      }
      if (this.job_part) {
        return this.job_part.job.type === "Platform" ? true : false;
      }
    },
    jobStatus() {
      return this.job ? this.job.locum_status : this.job_part.locum_status;
    }
  },
  async asyncData({ app, params, query, redirect, router, error }) {
    try {
      let url = `/api/v1/locum/jobs`;

      if (
        query &&
        query.jobStatus &&
        ["ongoing", "completed", "approved", "withdrawn", "cancelled"].includes(
          query.jobStatus.toLowerCase()
        )
      ) {
        url = `/api/v1/locum/job-parts`;
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
        return error({ status: 404, message: "This job could not be found" });
      }
      throw err;
    }
  },
  methods: {
    close() {
      this.$router.push({
        path: `/my-practice/${this.$route.params.practiceId}/related-jobs`,
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