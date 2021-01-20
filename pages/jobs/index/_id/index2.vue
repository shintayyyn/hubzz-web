<template>
  <div class="modal-container shadow-lg">
    <AppLoading :loading="initialLoading" spinner />

    <JobDetailModalAppointment
      v-if="job && job.type === 'Private'"
      :job="job"
      @close="close"
      @appointmentUpdated="$emit('appointmentUpdated')"
    />

    <JobDetailModal
      v-if="job && job.type === 'Platform'"
      :job="job"
      @close="close"
      @applied="$emit('applied', $event)"
      @cancelled="$emit('cancelled', $event)"
      @unassign="$emit('unassign', $event)"
    />
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import JobDetailModal from "@/components/Jobs/JobDetailModal"
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"

export default {
  transition: {
    name: "slide",
    mode: "out-in",
  },

  components: {
    AppLoading,
    JobDetailModal,
    JobDetailModalAppointment,
  },

  data () {
    return {
      initialLoading: false,
      loadingJob: false,
      job: null,
    }
  },
  
  watch: {
    $route () {
      this.loadingJob = true
      this.getLocumJob().finally(() => {
        this.loadingJob = false
      })
    },
  },

  mounted () {
    this.jobPart = null
    this.initialLoading = true
    this.getLocumJob().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {
    getLocumJob () {
      return this.$axios.get(`/api/v1/locum/jobs/${this.$route.params.id}`).then((response) => {
        this.job = response.data.data.job
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
        name: "jobs-index",
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
