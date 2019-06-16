<template>
  <div class="job-info shadow-lg">
    <div class="w-full h-full flex justify-center items-center" v-if="loading">loading..</div>
    <div v-else>
      <LocumDeclinedDetailModal :job="job" v-if="job.status === 'Declined'"/>
    </div>
  </div>
</template>
<script>
// ! import all detail modal
import LocumDeclinedDetailModal from '@/components/Jobs/LocumDeclinedDetailModal'
export default {
  transition: 'slide',
  components: {
    LocumDeclinedDetailModal
  },
  data() {
    return {
      loading: false,
      job: null
    }
  },
  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.get(`/api/v1/locum/jobs/${route.params.jobId}`)
      const job = response.data.data.job
      return {
        job
      }
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: 'This page could not be found' })
      }
      throw err
    }
  },
  mounted() {
    this.$store.commit('jobs/TOGGLE_SHIELD', true)
  }
}
</script>

<style scoped>
.job-info {
  position: fixed;
  right: 0;
  top: 0;
  width: 80%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
</style>
