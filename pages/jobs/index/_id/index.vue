<template>
  <div>
    <AppLoading :loading="initialLoading" spinner :message="'Loading Job'" />

    <AppBreadcrumbs :links="links" />

    <JobDetailModalAppointment
      v-if="job && job.type === 'Private'"
      :job="job"
      :isModal="false"
      @close="close"
      @appointmentUpdated="$emit('appointmentUpdated')"
    />

    <LocumUserJobView
      v-if="job && job.type === 'Platform'"
      :jobId="parseInt($route.params.id, 10)"
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
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
import LocumUserJobView from "@/components/Jobs/LocumUserJobView"
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"

export default {
  transition: {
    name: "slide",
    mode: "out-in",
  },

  components: {
    AppLoading,
    AppBreadcrumbs,
    LocumUserJobView,
    JobDetailModalAppointment,
  },

  data () {
    return {
      initialLoading: false,
      loadingJob: false,
      job: null,
      links: [],
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
      return this.$axios.get(`/api/v2/locum/locum-user-jobs/${this.$route.params.id}`).then((response) => {
        this.job = response.data.data.job

        if (this.job.type === 'Private') {
          this.links = [
            {
              title: `Private Job`,
              url: `/jobs/?status=Private`,
            },
            {
              title: this.job.title,
            },
          ]
        } else {
          this.links = [
            {
              title: `${this.job.locum_job_status} Job`,
              url: `/jobs/?status=${this.job.locum_job_status}`,
            },
            {
              title: this.job.title,
            },
          ]
        }
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
