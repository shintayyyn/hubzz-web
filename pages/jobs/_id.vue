<template>
  <div class="modal-container shadow-lg">
    <LocumAppointmentModal
      :job="job"
      v-if="(job.locum_status === 'Current' && job.type === 'Private') || (job.locum_status === 'Completed' && job.type === 'Private')"
    />
    <LocumAllocatedDetailModal
      :job="job"
      v-if="job.status === 'Current' && job.type === 'Platform'"
    />
    <LocumAvailableDetailModal :job="job" v-if="job.status === 'Available'"/>
    <LocumAppliedDetailModal :job="job" v-if="job.status === 'Applied'"/>
    <LocumUnsuccessfullDetailModal :job="job" v-if="job.status === 'Unsuccessful'"/>
    <LocumDeclinedDetailModal :job="job" v-if="job.status === 'Declined'"/>
    <LocumCompletedDetailModal
      :job="job"
      v-if="job.status === 'Completed' && job.type === 'Platform'"
    />
  </div>
</template>
<script>
// ! import all detail modal
import LocumAppointmentModal from '@/components/Jobs/LocumAppointmentModal'
import LocumAllocatedDetailModal from '@/components/Jobs/LocumAllocatedDetailModal'
import LocumAvailableDetailModal from '@/components/Jobs/LocumAvailableDetailModal'
import LocumAppliedDetailModal from '@/components/Jobs/LocumAppliedDetailModal'
import LocumUnsuccessfullDetailModal from '@/components/Jobs/LocumUnsuccessfullDetailModal'
import LocumDeclinedDetailModal from '@/components/Jobs/LocumDeclinedDetailModal'
import LocumCompletedDetailModal from '@/components/Jobs/LocumCompletedDetailModal'
export default {
  transition: 'slide',
  components: {
    LocumAppointmentModal,
    LocumAllocatedDetailModal,
    LocumAvailableDetailModal,
    LocumAppliedDetailModal,
    LocumUnsuccessfullDetailModal,
    LocumDeclinedDetailModal,
    LocumCompletedDetailModal,
  },
  async asyncData({ app, route, store, error }) {
    try {
      let response = await app.$axios.get(`/api/v1/locum/jobs/${route.params.id}`)
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
  }
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
