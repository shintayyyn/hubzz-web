<template>
  <div class="modal-container shadow-lg">
    <template v-if="practice_modal">
      <SessionDetailModal @close="close" :job="practice_job" />
    </template>
    <template v-if="practice_modal_part">
      <SessionPartDetailModal @close="close" :job_part="practice_job_part" />
    </template>
    <template v-if="locum_modal">
      <LocumJobDetailModal @close="close" :job="locum_job" />
    </template>
    <template v-if="locum_modal_part">
      <LocumJobPartDetailModal @close="close" :job_part="locum_job_part" />
    </template>
  </div>
</template>
<script>
import SessionDetailModal from "@/components/Sessions/SessionDetailModal";
import SessionPartDetailModal from "@/components/Sessions/SessionPartDetailModal";
import LocumJobDetailModal from "@/components/Jobs/JobDetailModal";
import LocumJobPartDetailModal from "@/components/Jobs/JobPartDetailModal";
export default {
  components: {
    SessionDetailModal,
    SessionPartDetailModal,
    LocumJobDetailModal,
    LocumJobPartDetailModal
  },
  data() {
    return {
      practice_modal: false,
      practice_job: null,
      practice_modal_part: false,
      practice_job_part: null,
      locum_modal: false,
      locum_job: null,
      locum_modal_part: false,
      locum_job_part: null
    };
  },
  async asyncData({ app, params, query, redirect, router, error }) {
    try {
      if (app.$auth.user.domain === "Practice") {
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
          let practice_job = response.data.data.job;
          let practice_modal = true;
          return {
            practice_job,
            practice_modal
          };
        }

        if (response.data.data.job_part) {
          let practice_job_part = response.data.data.job_part;
          let practice_modal_part = true;
          return {
            practice_job_part,
            practice_modal_part
          };
        }
      } else if (app.$auth.user.domain === "Locum") {
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
          let locum_job = response.data.data.job;
          let locum_modal = true;
          return {
            locum_job,
            locum_modal
          };
        }

        if (response.data.data.job_part) {
          let locum_job_part = response.data.data.job_part;
          let locum_modal_part = true;
          return {
            locum_job_part,
            locum_modal_part
          };
        }
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
        path: "/dashboard"
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