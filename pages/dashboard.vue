<template>
  <section class="dashboard-section">
    <div class="reminders-section" v-if="$auth.user.domain === 'Locum'">
      <Reminders/>
    </div>
    <div v-if="userIsAuthorized" class="appointment-section">
      <div class="text-xs sm:text-sm font-bold">Appointments</div>
      <Calendar/>
    </div>
    <div v-if="userIsAuthorized" class="statistics-section">
      <div class="text-sm sm:text-base font-bold">Quick Statistics</div>
      <Statistics/>
    </div>
    <div v-if="!userIsAuthorized && $auth.user.domain === 'Practice'">
       <div class="text-sm sm:text-base font-bold">Please complete the Practice Verification Steps in order to have a complete access in the platform.</div>
    </div>
    <div v-if="!userIsAuthorized && $auth.user.domain === 'Locum'">
        <div v-if="!complianceDocs" class="text-sm sm:text-base font-bold">
         Please complete the required Locum Compliance Documents in order to have a complete access in the platform.
        </div>

        <div v-else-if="complianceDocs" class="text-sm sm:text-base font-bold">
         Please wait for HUBZZ to verify your compliance requirements.
        </div>
    </div>
  
  </section>
</template>

<script>
import Calendar from '@/components/Calendar'
import Reminders from '@/components/Dashboard/Reminders'
import Statistics from '@/components/Dashboard/Statistics'
export default {
  data(){
    return{
      userIsAuthorized:false,
      complianceDocs:[]
    }
    
  },
  components: {
    Calendar,
    Reminders,
    Statistics,
  },
  
  created(){
    if(this.$auth.loggedIn){
      let domain = this.$auth.user.domain
      let isActivated = this.$auth.user.is_actived;
      let accountStatus = this.$auth.user.status
      if(domain === 'Locum'){
        let complianceDocs = this.$auth.user.locum_detail.compliance_documents
      }
    

      if(domain === 'Practice' && isActivated === true){
        this.userIsAuthorized = true
        console.log("practice user is authorized")
      }else if(domain === 'Locum' && accountStatus === "Active" || accountStatus === "Dormant"){
        this.userIsAuthorized = true
        console.log("locum user is authorized")
      }else{
        this.userIsAuthorized = false
        console.log("user is not authorized")
      }

    } 
  }
}
</script>
<style scoped>
.dashboard-section {
  height: auto;
  width: 100%;
}
</style>

