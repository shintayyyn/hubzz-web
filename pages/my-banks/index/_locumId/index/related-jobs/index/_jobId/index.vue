<template>
  <div class="">
    <AppBreadcrumbs :links="links" />
    <template v-if="job && !job_part">
      <SessionDetailModal :job="job" @close="close" />
    </template>
    <template v-if="!job && job_part">
      <SessionPartDetailModal :job-part="job_part" @close="close" />
    </template>
  </div>
</template>
<script>
import SessionDetailModal from "@/components/Sessions/SessionDetailModal"
import SessionPartDetailModal from "@/components/Sessions/SessionPartDetailModal"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    SessionDetailModal,
    SessionPartDetailModal,
    AppBreadcrumbs
  },
  data () {
    return {
      job: null,
      job_part: null
    }
  },
  async asyncData ({ app, params, query, error, store, route }) {
    try {
      let url = `/api/v1/practice/locums/${params.locumId}/jobs`

      if (
        query &&
        query.jobStatus &&
        ["ongoing", "completed", "approved", "withdrawn", "cancelled"].includes(
          query.jobStatus.toLowerCase()
        )
      ) {
        url = `/api/v1/practice/locums/${params.locumId}/job-parts`
      }


      let response = await app.$axios.get(`${url}/${params.jobId}`)
      if (response.data.data.job) {
        let job = response.data.data.job
      
        const links = [...store.state.breadcrumbs,
          {
            title: `${query.jobStatus} Jobs`,
          }
        ]
        
        return {
          job,
          links

        }
      }

      if (response.data.data.job_part) {
        let job_part = response.data.data.job_part
        console.log("job_part", job_part)
        let url = `/my-banks/${job_part.viewing_locum_user_id}/related-jobs?jobStatus=${job_part.status}`
        const links = [...store.state.breadcrumbs,
        {
          title: `${query.jobStatus} Jobs`,
          url: url
        }, {
          title: job_part.job_title,
          url: route.path
        }
      ]
        return {
          job_part,
          links
        }
      }
    } catch (err) {
      console.log(err, err.response)
      if (err && err.response && err.response.status === 404) {
        return error({
          status: 404,
          message: "This session could not be found"
        })
      }
      throw err
    }
  },
  methods: {
    close () {
      this.$router.push({
        path: `/my-banks/${this.$route.params.locumId}/related-jobs`,
        query: { ...this.$route.query }
      })
    }
  }
}
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