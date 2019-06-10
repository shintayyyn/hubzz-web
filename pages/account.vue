<template>
  <section>
    <div class="px-10">
      <AccountTabs/>
    </div>
    <div class="px-10 mt-5">
      <template v-if="$auth.user.domain === 'Locum'">
        <AccountGeneralForm v-if="$store.state.account.accountTab === 'general'"/>
        <AccountProfileForm v-if="$store.state.account.accountTab === 'profile'"/>
      </template>
      <template v-if="$auth.user.domain === 'Practice'">
        <AccountUserForm v-if="$store.state.account.accountTab === 'user'"/>
      </template>
      <AccountChangePasswordForm v-if="$store.state.account.accountTab === 'change-password'"/>
    </div>
  </section>
</template>
<script>
import AccountTabs from '@/components/Account/AccountTabs'
import AccountGeneralForm from '@/components/Account/AccountGeneralForm'
import AccountProfileForm from '@/components/Account/AccountProfileForm'
import AccountUserForm from '@/components/Account/AccountUserForm'
import AccountChangePasswordForm from '@/components/Account/AccountChangePasswordForm'
export default {
  components: {
    AccountTabs,
    AccountGeneralForm,
    AccountProfileForm,
    AccountUserForm,
    AccountChangePasswordForm
  },
  created() {
    // this.$store.dispatch('signUp/getProfessions')
    // this.$store.dispatch('signUp/getQualifications')
    // this.$store.dispatch('signUp/getClinicalSystems')
    // this.$store.dispatch('signUp/getSpokenLanguages')

    if (this.$auth.user.domain === 'Locum') {
      this.$store.commit('account/setActiveTab', 'general')
    } else if (this.$auth.user.domain === 'Practice') {
      this.$store.commit('account/setActiveTab', 'user')
    }
  }
}
</script>
