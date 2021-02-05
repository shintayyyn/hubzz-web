<template>
  <div ref="modalContainer" class="">
    <AppLoading :loading="initialLoading" spinner :message="'Loading Job'" />
    <AppBreadcrumbs :links="links" />

    <SessionPartDetailModal
      v-if="jobPart"
      :job-part="jobPart"
      :loadingJobPart="loadingJobPart"
      @close="close"
      @scrollToTop="scrollToTop()"
    />
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
import SessionPartDetailModal from "@/components/Sessions/SessionPartDetailModal"

export default {
  transition: {
    name: 'slide',
    mode: 'out-in',
  },

  components: {
    AppLoading,
    AppBreadcrumbs,
    SessionPartDetailModal,
  },

  data () {
    return {
      initialLoading: false,
      loadingJobPart: false,
      links: []
    }
  },

  computed: {
    jobPart: {
      get () {
        return this.$store.getters['jobParts/getJobPart']
      },

      set (jobPart) {
        this.$store.commit('jobParts/setJobPart', jobPart)
      },
    },

    jobPartId () {
      return this.jobPart ? this.jobPart.id : null
    },
  },

  watch: {
    $route () {
      this.loadingJobPart = true
      this.getJobPart().finally(() => {
        this.loadingJobPart = false
      })
    },
  },

  mounted () {
    this.jobPart = null
    this.initialLoading = true
    this.getJobPart().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {
    getJobPart () {
      return this.$axios.get(`/api/v1/practice/job-parts/${this.$route.params.jobPartId}`).then((response) => {
        let jobPart = response.data.data.job_part
        this.jobPart = jobPart
        console.log("route", this.$route)
        this.links = [
          {
            title: `${jobPart.status } Sessions`,
            url: `/job-parts/?status=${jobPart.status}`
          },
          {
            title: jobPart.title
          }
        ]
      }).catch((err) => {
        console.log('err', err.response || err)

        if (err.response && err.response.status === 404) {
          this.$nuxt.error({
            status: 404,
            message: "This session could not be found.",
          })
        } else {
          this.$nuxt.error(err)
        }
      })
    },

    close () {
      const { query, } = this.$route

      this.$router.push({
        name: "job-parts-index",
        query,
      })
    },

    scrollToTop () {
      this.$nextTick(() => {
        this.$refs.modalContainer.scrollTop = 0
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
