<template>
  <div class="modal-container shadow-lg">
    <JobDetailModalAppointment
      v-if="!activeJobTypePlatform"
      :job="jobPart.job"
      @close="close"
      @appointmentUpdated="$emit('appointmentUpdated')"
    />
    <JobPartDetailModal v-if="activeJobTypePlatform" :job_part="jobPart" @close="close" />
  </div>
</template>

<script>
import JobPartDetailModal from "@/components/Jobs/JobPartDetailModal"
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"

export default {
  transition: {
    name: "slide",
    mode: "out-in",
  },

  components: {
    JobPartDetailModal,
    JobDetailModalAppointment,
  },

  data () {
    return {
      jobPart: null,
    }
  },

  computed: {
    activeJobTypePlatform () {
      return this.jobPart && this.jobPart.job.type === "Platform"
    },
  },

  async asyncData ({ app, params, error, }) {
    try {
      const { jobPartId, } = params

      let response = await app.$axios.get(
        `/api/v1/locum/job-parts/${jobPartId}`
      )

      let jobPart = response.data.data.job_part

      return {
        jobPart,
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return error({
          status: 404,
          message: "This job could not be found.",
        })
      }

      throw err
    }
  },

  methods: {
    close () {
      const { query, } = this.$route

      this.$router.push({
        name: "locum-job-parts-index",
        query,
      })
    },
  },
}
</script>

<style scoped>
.modal-container {
  z-index: 510;
}

@media screen and (min-width: 1200px) {
  .modal-container {
    width: 90%;
  }
}
</style>
