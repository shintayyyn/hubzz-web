<template>
  <div class="">
    <AppBreadcrumbs :links="links" />

    <template v-if="practice_modal">
      <SessionDetailModal
        :job="practice_job"
        @close="close"
      />
    </template>

    <template v-if="practice_modal_part">
      <SessionPartDetailModal
        :job-part="practice_job_part"
        @close="close"
      />
    </template>

    <template v-if="locum_modal">
      <JobDetailModal
        :job="locum_job"
        @close="close"
      />
    </template>

    <template v-if="locum_appointment_modal">
      <JobDetailModalAppointment
        :job="locum_appointment_job"
        @close="close"
        :isModal="false"
      />
    </template>

    <template v-if="locum_modal_part">
      <JobPartDetailModal
        :job_part="locum_job_part"
        @setJobPart="newJobPart => locum_job_part = newJobPart"
        @close="close"
        :isModal="false"
      />
    </template>
  </div>
</template>

<script>
import SessionDetailModal from "@/components/Sessions/SessionDetailModal"
import SessionPartDetailModal from "@/components/Sessions/SessionPartDetailModal"
import JobDetailModal from "@/components/Jobs/JobDetailModal"
import JobDetailModalAppointment from "@/components/Jobs/JobDetailModalAppointment"
import JobPartDetailModal from "@/components/Jobs/JobPartDetailModal"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

export default {
  components: {
    SessionDetailModal,
    SessionPartDetailModal,
    JobDetailModal,
    JobDetailModalAppointment,
    JobPartDetailModal,
    AppBreadcrumbs
  },

  data () {
    return {
      practice_modal: false,
      practice_job: null,
      practice_modal_part: false,
      practice_job_part: null,
      locum_modal: false,
      locum_job: null,
      locum_modal_part: false,
      locum_job_part: null,
      locum_appointment_modal: false,
      locum_appointment_job: null,

      links: []
    }
  },

  async asyncData ({ app, params, query, error, }) {
    try {
      let links = [
        {
          title: 'Dashboard',
          url: '/dashboard'
        },
      ]
      if (app.$auth.user.domain === "Practice") {
        let url = `/api/v1/practice/jobs`

        if (
          query
          && query.status
          && ["ongoing", "completed", "approved", "allocated",].includes(query.status.toLowerCase())
        ) {
          url = `/api/v1/practice/job-parts`
        }

        let response = await app.$axios.get(`${url}/${params.id}`)

        if (response.data.data.job) {
          let practice_job = response.data.data.job
          let practice_modal = true
          links.push({title: practice_job.title})

          return {
            practice_job,
            practice_modal,
            links
          }
        }

        if (response.data.data.job_part) {
          let practice_job_part = response.data.data.job_part
          let practice_modal_part = true
          links.push({title: practice_job_part.title})

          return {
            practice_job_part,
            practice_modal_part,
            links
          }
        }
      } else if (app.$auth.user.domain === "Locum") {
        let url = `/api/v1/locum/jobs`

        if (
          query
          && query.status
          && ["ongoing", "completed", "approved", "allocated",].includes(query.status.toLowerCase())
        ) {
          url = `/api/v1/locum/job-parts`
        }

        let response = await app.$axios.get(`${url}/${params.id}`)

        if (response.data.data.job) {
          if (response.data.data.job.type === "Platform") {
            let locum_job = response.data.data.job
            let locum_modal = true
            links.push({title: locum_job.title})

            return {
              locum_job,
              locum_modal,
              links
            }
          } else if (response.data.data.job.type === "Private") {
            let locum_appointment_job = response.data.data.job
            let locum_appointment_modal = true
            links.push({title: locum_appointment_job.title})

            return {
              locum_appointment_job,
              locum_appointment_modal,
              links
            }
          }
        }

        if (response.data.data.job_part) {
          if (response.data.data.job_part.job.type === "Platform") {
            let locum_job_part = response.data.data.job_part
            let locum_modal_part = true
            links.push({title: locum_job_part.title})

            return {
              locum_job_part,
              locum_modal_part,
              links
            }
          } else if (response.data.data.job_part.job.type === "Private") {
            let locum_appointment_job = response.data.data.job_part.job
            let locum_appointment_modal = true
            links.push({title: locum_appointment_job.title})

            return {
              locum_appointment_job,
              locum_appointment_modal,
              links
            }
          }
        }
      }
    } catch (err) {
      console.log(err, err.response)

      if (err && err.response && err.response.status === 404) {
        return error({
          status: 404,
          message: "This session could not be found",
        })
      }

      throw err
    }
  },

  methods: {
    close () {
      this.$router.push({
        path: "/dashboard",
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
