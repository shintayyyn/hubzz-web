<template>
  <div ref="modalContainer" class="">
    <AppLoading :loading="initialLoading" spinner :message="'Loading Job'" />
    <AppBreadcrumbs :links="links" />

    <SessionDetailModal
      v-if="job"
      :job="job"
      @close="close"
      @appointed="$emit('appointed', $event)"
      @cancelled="$emit('cancelled', $event)"
      @scrollToTop="scrollToTop()"
    />
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
import SessionDetailModal from "@/components/Sessions/SessionDetailModal"

export default {
  transition: {
    name: "slide",
    mode: "out-in",
  },

  components: {
    AppLoading,
    AppBreadcrumbs,
    SessionDetailModal,
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
      this.getJob().finally(() => {
        this.loadingJob = false
      })
    },
  },

  mounted () {
    this.jobPart = null
    this.initialLoading = true
    this.getJob().finally(() => {
      this.initialLoading = false
    })
  },

  methods: {
    getJob () {
      return this.$axios.get(`/api/v1/practice/jobs/${this.$route.params.id}`).then((response) => {
        this.job = response.data.data.job
        this.links = [
          {
            title: `${response.data.data.job.status} Sessions`,
            url: `/sessions/?status=${response.data.data.job.status}`,
          },
          {
            title: response.data.data.job.title,
          },
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
      this.$router.push({
        name: "sessions-index",
        query: {
          ...this.$route.query,
        },
      })
    },

    scrollToTop () {
      console.log('scrollToTop id index')
      this.$nextTick(() => {
        this.$emit('scrollToTop')
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
