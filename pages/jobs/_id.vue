<template>
  <div class="job-info shadow-lg">
    <LocumAppointmentModal
      :job="job"
      v-if="(job.locum_status === 'Current' && job.type === 'Private') || (job.locum_status === 'Completed' && job.type === 'Private')"
    />
    <LocumAllocatedDetailModal
      :job="job"
      v-if="job.locum_status === 'Current' && job.type === 'Platform'"
    />
    <LocumAvailableDetailModal :job="job" v-if="job.locum_status === 'Available'"/>
    <LocumAppliedDetailModal :job="job" v-if="job.locum_status === 'Applied'"/>
    <LocumUnsuccessfullDetailModal :job="job" v-if="job.locum_status === 'Unsuccessful'"/>
    <LocumDeclinedDetailModal :job="job" v-if="job.locum_status === 'Declined'"/>
    <LocumCompletedDetailModal
      :job="job"
      v-if="job.locum_status === 'Completed' && job.type === 'Platform'"
    />
    <!-- <div class="w-full h-full flex justify-center items-center" v-if="loading">loading..</div>
    <div v-else>
      <LocumDeclinedDetailModal :job="job" v-if="job.status === 'Declined'"/>
    </div>-->
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
  data() {
    return {
      // loading: false,
    }
  },
  async asyncData({ app, route, store, error }) {
    try {
      store.commit('jobs/TOGGLE_SHIELD', true)
      let response = await app.$axios.get(`/api/v1/locum/jobs/${route.params.id}`)
      const job = response.data.data.job
      console.log(job)
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
