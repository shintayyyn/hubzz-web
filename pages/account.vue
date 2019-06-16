<template>
  <section class="account-section">
    <AppHeader/>
    <AccountTabs/>
    <div class="px-5 mt-5">
      <nuxt-child/>
    </div>
  </section>
</template>
<script>
import AppHeader from '@/components/AppHeader'
import AccountTabs from '@/components/Account/AccountTabs'
export default {
  components: {
    AppHeader,
    AccountTabs,
  },
  created() {
    if (this.$auth.user.domain === 'Locum') {
      this.$router.push('/account/general')
    } else if (this.$auth.user.domain === 'Practice') {
      this.$router.push('/account/user')
    }
  }
}
</script>
<style scoped>
.account-section {
  padding: 5px;
}
</style>
