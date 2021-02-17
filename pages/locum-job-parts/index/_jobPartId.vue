<template>
  <div class="">
    <AppLoading :loading="initialLoading" spinner :message="'Loading Job'"/>
    <AppBreadcrumbs :links="links" />

    <JobDetailModalAppointment
      v-if="jobPart && jobPart.type === 'Private'"
      :job="job"
      :isModal="false"
      @close="close"
      @appointmentUpdated="appointmentUpdatedHandler"
    />

    <LocumUserJobPartView
      v-if="jobPart && jobPart.type === 'Platform'"
      :job_part="jobPart"
      :job_part_job="job"
      :loadingJobPart="loadingJobPart"
      @setJobPart="newJobPart => jobPart = newJobPart"
      @close="close"
    />
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
import LocumUserJobPartView from "@/components/Jobs/LocumUserJobPartView"
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"

export default {
  transition: {
    name: 'slide',
    mode: 'out-in',
  },

  components: {
    AppLoading,
    AppBreadcrumbs,
    LocumUserJobPartView,
    JobDetailModalAppointment,
  },

  data () {
    return {
      initialLoading: false,
      loadingJobPart: false,
      jobPart: null,
      job: null,
      links: []
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
      this.getJob()
      console.log("job_part", this.jobPart)
      console.log("job", this.job)
      this.links = [
          {
            title: `${this.jobPart.locum_job_part_status} Jobs`,
            url: `/locum-job-parts/?status=${this.jobPart.locum_job_part_status}`
          },
          {
            title: this.jobPart.title
          }
        ]
      this.initialLoading = false
    })
  },

  methods: {
    appointmentUpdatedHandler () {
      this.$emit('appointmentUpdated')
    },

    getLocumJobPart () {
      return this.$axios.get(`/api/v2/locum/locum-user-job-parts/${this.$route.params.jobPartId}`).then((response) => {
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
    getJob() {
      if (this.jobPart && this.jobPart.job_id) {
        this.$axios.get(`/api/v1/locum/jobs/${this.jobPart.job_id}`,).then((response) => {
          console.log("response", response)
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
      }
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
