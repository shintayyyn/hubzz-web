<template>
  <section class="account-section">
    <AccountTabs/>
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent"/>
      </transition>
    </div>
  </section>
</template>
<script>
import AccountTabs from '@/components/Account/AccountTabs'
import General from '@/components/Account/General'
import Profile from '@/components/Account/Profile'
import User from '@/components/Account/User'
import ChangePassword from '@/components/Account/ChangePassword'
export default {
  components: {
    AccountTabs,
    General,
    Profile,
    User,
    ChangePassword,
  },
  created() {
    let firstTab = ''
    this.$auth.user.domain === 'Locum' ? firstTab = 'general' : firstTab = 'user'
    const query = {
      ...this.$route.query,
      account_tab: this.$route.query.account_tab || firstTab
    }
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      if (this.$route.query.account_tab === 'general') {
        return 'General'
      }
      if (this.$route.query.account_tab === 'profile') {
        return 'Profile'
      }
      if (this.$route.query.account_tab === 'user') {
        return 'User'
      }
      if (this.$route.query.account_tab === 'change-password') {
        return 'ChangePassword'
      }
    }
  },
}
</script>