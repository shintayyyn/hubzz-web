<template>
  <div class="max-w-3xl">
    <LocumDetailJobsModalTabs />
    <div>
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" :user="user" :jobs="jobs" />
      </transition>
    </div>
  </div>
</template>
</<script>
import LocumDetailJobsModalTabs from '@/components/MyBanks/LocumDetailJobsModalTabs'
import LocumAvailableJobs from '@/components/MyBanks/LocumAvailableJobs'
import LocumAppliedJobs from '@/components/MyBanks/LocumAppliedJobs'
import LocumCurrentJobs from '@/components/MyBanks/LocumCurrentJobs'
import LocumCompletedJobs from '@/components/MyBanks/LocumCompletedJobs'
import LocumUnsuccessfulJobs from '@/components/MyBanks/LocumUnsuccessfulJobs'
import LocumCancelledJobs from '@/components/MyBanks/LocumCancelledJobs'
import LocumDeclinedJobs from '@/components/MyBanks/LocumDeclinedJobs'
export default {
    props:['user','jobs'],
    components:{
      LocumDetailJobsModalTabs,
      locum_available: LocumAvailableJobs,
      locum_applied: LocumAppliedJobs,
      locum_current: LocumCurrentJobs,
      locum_completed: LocumCompletedJobs,
      locum_unsuccessful: LocumUnsuccessfulJobs,
      locum_cancelled: LocumCancelledJobs,
      locum_declined: LocumDeclinedJobs
    },

    computed: {
      activeComponent(){
        return this.$route.query.locum_jobs
      }
    },
    data(){
        return{

        }
    },
    created(){
      console.log(this.jobs)
      const query = {
        ...this.$route.query,
        locum_jobs: this.$route.query.locum_jobs || 'locum_available'

      }
      this.$router.push({ query })
      
    },
    methods:{
        show(id) {
            const query = {
            ...this.$route.query
            }
        this.$router.push({ path: `/sessions/${id}`, query })
        }
        
    }
}
</script>
