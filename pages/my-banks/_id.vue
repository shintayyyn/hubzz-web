<template>
  <div class="modal-container shadow-lg">
    <MyLocumDetailModal :user="user" :job="job" />
  </div>
</template>
<script>
import MyLocumDetailModal from '@/components/MyBanks/MyLocumDetailModal'
export default {
  components: {
    MyLocumDetailModal,
  },
  async asyncData({ app, route, store, error }) {
    try {
      let userRes = await app.$axios.get(`/api/v1/practice/locums/${route.params.id}`)
      const user = userRes.data.data.user
      let jobRes = await app.$axios.get(`/api/v1/practice/jobs/${route.params.id}`)
      const job = jobRes.data.data.job
      return {
        user,
        job,
      }
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: 'This page could not be found' })
      }
      throw err
    }
  },
//   beforeDestroy() {
//     this.$store.commit('jobs/TOGGLE_SHIELD', false)
//   },
//   created() {
//     this.$store.commit('jobs/TOGGLE_SHIELD', true)
//   },
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #edf2f7;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>
