<template>
  <section>
    <div class="px-10">
      <JobsTabs/>
    </div>
    <div class="px-10 mt-5">
      <AllocatedJobs v-if="$store.state.jobs.activeTab === 'allocated'"/>
      <AvailableJobs v-if="$store.state.jobs.activeTab === 'available'"/>
      <AppliedJobs v-if="$store.state.jobs.activeTab === 'applied'"/>
      <UnsuccessfulJobs v-if="$store.state.jobs.activeTab === 'unsuccessful'"/>
      <DeclinedJobs v-if="$store.state.jobs.activeTab === 'declined'"/>
      <CompletedJobs v-if="$store.state.jobs.activeTab === 'completed'"/>
    </div>
  </section>
</template>
<script>
import JobsTabs from '@/components/Jobs/JobsTabs'
import AllocatedJobs from '@/components/Jobs/AllocatedJobs'
import AvailableJobs from '@/components/Jobs/AvailableJobs'
import AppliedJobs from '@/components/Jobs/AppliedJobs'
import UnsuccessfulJobs from '@/components/Jobs/UnsuccessfulJobs'
import DeclinedJobs from '@/components/Jobs/DeclinedJobs'
import CompletedJobs from '@/components/Jobs/CompletedJobs'
export default {
  components: {
    JobsTabs,
    AllocatedJobs,
    AvailableJobs,
    AppliedJobs,
    UnsuccessfulJobs,
    DeclinedJobs,
    CompletedJobs
  }
}
</script>
