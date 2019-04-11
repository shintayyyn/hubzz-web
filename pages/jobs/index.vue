<template>
  <section>
    <div class="px-10">
      <JobsTabs />
    </div>
    <div class="px-10 mt-5" >
      <CurrentJobs v-if="$store.state.jobs.activeTab === 'current'"/>
      <AvailableJobs v-if="$store.state.jobs.activeTab === 'available'"/>
      <AppliedJobs v-if="$store.state.jobs.activeTab === 'applied'"/>
      <RejectedJobs v-if="$store.state.jobs.activeTab === 'rejected'"/>
      <DeclinedJobs v-if="$store.state.jobs.activeTab === 'declined'"/>
      <CompletedJobs v-if="$store.state.jobs.activeTab === 'completed'"/>
    </div>
  </section>
</template>
<script>
import JobsTabs from '@/components/Jobs/JobsTabs'
import CurrentJobs from '@/components/Jobs/CurrentJobs'
import AvailableJobs from '@/components/Jobs/AvailableJobs'
import AppliedJobs from '@/components/Jobs/AppliedJobs'
import RejectedJobs from '@/components/Jobs/RejectedJobs'
import DeclinedJobs from '@/components/Jobs/DeclinedJobs'
import CompletedJobs from '@/components/Jobs/CompletedJobs'
export default {
  components: {
    JobsTabs,
    CurrentJobs,
    AvailableJobs,
    AppliedJobs,
    RejectedJobs,
    DeclinedJobs,
    CompletedJobs
  }
}
</script>
