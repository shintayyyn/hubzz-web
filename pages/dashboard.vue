<template>
  <section class="dashboard-section">
    <div class="reminders-section" v-if="$auth.user.domain === 'Locum'">
      <Reminders />
    </div>
    <div v-if="userIsAuthorized" class="appointment-section">
      <div class="text-sm sm:text-sm font-bold">Appointments</div>
      <Calendar />
    </div>
    <div v-if="userIsAuthorized" class="statistics-section">
      <div class="text-sm sm:text-base font-bold">Quick Statistics</div>
      <Statistics />
    </div>
    <div v-if="!userIsAuthorized && $auth.user.domain === 'Practice'">
      <div
        class="text-sm sm:text-base font-bold"
      >Please complete the Practice Verification Steps in order to have a complete access in the platform.</div>
    </div>
    <div v-if="!userIsAuthorized && $auth.user.domain === 'Locum'">
      <div
        v-if="$auth.user.locum_detail.compliance_documents.length === 0"
        class="text-sm sm:text-base font-bold"
      >Please complete the required Locum Compliance Documents in order to have a complete access in the platform.</div>

      <div
        v-else-if="$auth.user.locum_detail.compliance_documents.length > 0"
        class="text-sm sm:text-base font-bold"
      >Please wait for HUBZZ to verify your compliance requirements.</div>
    </div>

    <transition name="fade" mode="out-in">
      <nuxt-link class="shield" v-if="$route.name === 'dashboard-id'" :to="'/dashboard'"></nuxt-link>
    </transition>
    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
import Calendar from "@/components/Calendar";
import Reminders from "@/components/Dashboard/Reminders";
import Statistics from "@/components/Dashboard/Statistics";
export default {
  components: {
    Calendar,
    Reminders,
    Statistics
  },
  computed: {
    userIsAuthorized() {
      if (this.$auth.loggedIn) {
        let domain = this.$auth.user.domain;
        let accountStatus = this.$auth.user.status;
        if (domain === "Locum") {
          if (accountStatus === "Active" || accountStatus === "Dormant") {
            return true;
          }
          return false;
        }
        if (domain === "Practice") {
          let practiceStatus = this.$auth.user.practice_detail.practice.status;
          if (accountStatus === "Active" && practiceStatus === "Active") {
            return true;
          }
          return false;
        }
      }
      return false;
    }
  }
};
</script>
<style scoped>
.dashboard-section {
  height: auto;
  width: 100%;
}
</style>

