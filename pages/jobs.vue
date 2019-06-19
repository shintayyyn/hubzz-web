<template>
  <section class="jobs-section">
    <JobsTabs/>
    <div class="px-5 mt-5">
      <transition name="slide" mode="out-in">
        <Component :is="componentName"/>
      </transition>
    </div>
    <div class="job-detail-shield" v-if="$store.state.jobs.shield"></div>
    <nuxt-child/>
  </section>
</template>
<script>
import JobsTabs from '@/components/Jobs/JobsTabs'
import Allocated from '@/components/Jobs/Allocated'
import Available from '@/components/Jobs/Available'
import Applied from '@/components/Jobs/Applied'
import Rejected from '@/components/Jobs/Rejected'
import Declined from '@/components/Jobs/Declined'
import Completed from '@/components/Jobs/Completed'
export default {
  components: {
    JobsTabs,
    Allocated,
    Available,
    Applied,
    Rejected,
    Declined,
    Completed
  },
  computed: {
    componentName() {
      if (this.$route.query.job_status === 'allocated') {
        return 'Allocated'
      }
      if (this.$route.query.job_status === 'available') {
        return 'available'
      }
      if (this.$route.query.job_status === 'applied') {
        return 'Applied'
      }
      if (this.$route.query.job_status === 'rejected') {
        return 'Rejected'
      }
      if (this.$route.query.job_status === 'declined') {
        return 'Declined'
      }
      if (this.$route.query.job_status === 'completed') {
        return 'Completed'
      }
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      job_status: this.$route.query.job_status || 'allocated'
    }
    this.$router.push({ query })
  }
}
</script>
<style scoped>
.jobs-section {
  padding: 5px;
}
.job-detail-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 509;
}
</style>

