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
  </section>
</template>

<script>
import Calendar from '@/components/Calendar'
import Reminders from '@/components/Dashboard/Reminders'
import Statistics from '@/components/Dashboard/Statistics'
export default {
  data(){
    return{
      userIsAuthorized:false
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

      if(domain === 'Practice' && isActivated === true){
        this.userIsAuthorized = true
        console.log("practice user is authorized")
      }else if(domain === 'Locum' && accountStatus === "Active"){
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

