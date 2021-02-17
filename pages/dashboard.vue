<template>
  <section class="dashboard-section">
      <nuxt-child />
  </section>
</template>

<script>
import Calendar from "@/components/Calendar"
import Reminders from "@/components/Dashboard/Reminders"
import Statistics from "@/components/Dashboard/Statistics"
import AppButton from "@/components/Base/AppButton"

export default {
  components: {
    Calendar,
    Reminders,
    Statistics,
    AppButton,
  },

  computed: {
    userIsAuthorized () {
      if (this.$auth.loggedIn) {
        let domain = this.$auth.user.domain

        let accountStatus = this.$auth.user.status

        if (domain === 'Locum') {
          if (accountStatus === 'Active' || accountStatus === 'Dormant') {
            return true
          }

          return false
        }

        if (domain === 'Practice') {
          const practice = this.$auth.user.practice_detail.practice
          let practiceStatus = this.$auth.user.practice_detail.practice.status

          if (accountStatus === 'Active' 
              && (practiceStatus === 'Active' || practiceStatus === 'Dormant') 
              && (['Hub', 'Stand Alone',].includes(practice.type) || (practice.type === 'Spoke' && practice.parent_practice_id !== null))
          ) {
            return true
          }

          return false
        }
      }

      return false
    },
  },

  watch: {
    "$route.path" (value) {
      if (value !== "/dashboard") {
        // document.body.style.overflow = "hidden"
      } else if (value === "/dashboard") {
        document.body.style.overflow = "auto"
      }
    },
  },

}
</script>

<style scoped>
  .shield {
    z-index: 509;
  }

  .dashboard-section {
    height: auto;
    width: 100%;
  }
</style>
