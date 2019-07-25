<template>
  <div class="modal-container shadow-lg">
    <!-- <LiveDetailModal :job="job" v-if="job.status === 'Available'" />
    <AppliedDetailModal :job="job" v-if="job.status === 'Applied'" />
    <AllocatedDetailModal :job="job" v-if="job.status === 'Current'" />
    <CompletedDetailModal :job="job" v-if="job.status === 'Completed'" />
    <UnfilledDetailModal :job="job" v-if="job.status === 'Unfilled'" />
    <CancelledDetailModal :job="job" v-if="job.status === 'Cancelled'" />
    <DeclinedDetailModal :job="job" v-if="job.status === 'Declined'" />-->
  </div>
</template>
<script>
import LiveDetailModal from '@/components/Sessions/LiveDetailModal'
import AppliedDetailModal from '@/components/Sessions/AppliedDetailModal'
import AllocatedDetailModal from '@/components/Sessions/AllocatedDetailModal'
import CompletedDetailModal from '@/components/Sessions/CompletedDetailModal'
import UnfilledDetailModal from '@/components/Sessions/UnfilledDetailModal'
import CancelledDetailModal from '@/components/Sessions/CancelledDetailModal'
import DeclinedDetailModal from '@/components/Sessions/DeclinedDetailModal'
export default {
  components: {
    LiveDetailModal,
    AppliedDetailModal,
    AllocatedDetailModal,
    CompletedDetailModal,
    UnfilledDetailModal,
    CancelledDetailModal,
    DeclinedDetailModal,
  },
  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.get(`/api/v1/practice/jobs/${route.params.id}`)
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
  beforeDestroy() {
    this.$store.commit('jobs/TOGGLE_SHIELD', false)
  },
  created() {
    this.$store.commit('jobs/TOGGLE_SHIELD', true)
  },
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
