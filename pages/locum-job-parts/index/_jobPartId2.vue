<template>
  <div class="modal-container shadow-lg">
    <AppLoading :loading="initialLoading" spinner />

    <JobDetailModalAppointment
      v-if="jobPart && jobPart.job && jobPart.job.type === 'Private'"
      :job="jobPart.job"
      @close="close"
      @appointmentUpdated="appointmentUpdatedHandler"
    />

    <JobPartDetailModal
      v-if="jobPart && jobPart.job && jobPart.job.type === 'Platform'"
      :job_part="jobPart"
      :loadingJobPart="loadingJobPart"
      @setJobPart="newJobPart => jobPart = newJobPart"
      @close="close"
    />
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import JobPartDetailModal from "@/components/Jobs/JobPartDetailModal"
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"

export default {
  transition: {
    name: 'slide',
    mode: 'out-in',
  },

  components: {
    AppLoading,
    JobPartDetailModal,
    JobDetailModalAppointment,
  },

  data () {
    return {
      initialLoading: false,
      loadingJobPart: false,
      jobPart: null,
    }
  },

  watch: {
    $route () {
      this.loadingJobPart = true
      this.getLocumJobPart().finally(() => {
        this.loadingJobPart = false
      })
    },
  },

  mounted () {
    this.jobPart = null
    this.initialLoading = true
    this.getLocumJobPart().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {
    appointmentUpdatedHandler () {
      this.$emit('appointmentUpdated')
    },

    getLocumJobPart () {
      return this.$axios.get(`/api/v1/locum/job-parts/${this.$route.params.jobPartId}`).then((response) => {
        this.jobPart = response.data.data.job_part
      }).catch((err) => {
        console.log('err', err.response || err)

        if (err.response && err.response.status === 404) {
          this.$nuxt.error({
            status: 404,
            message: "This job could not be found.",
          })
        } else {
          this.$nuxt.error(err)
        }
      })
    },

    close () {
      const { query, } = this.$route

      this.$router.push({
        name: 'locum-job-parts-index',
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
