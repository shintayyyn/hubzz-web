<template>
  <section>
    <div class="px-10">
      <AccountTabs/>
    </div>
    <div class="px-10 mt-5">
      <AccountGeneralForm v-if="$store.state.account.accountTab === 'general'"/>
      <AccountProfileForm v-if="$store.state.account.accountTab === 'profile'"/>
      <AccountChangePasswordForm v-if="$store.state.account.accountTab === 'change-password'"/>
    </div>
  </section>
</template>
<script>
import AccountTabs from '@/components/Account/AccountTabs'
import AccountGeneralForm from '@/components/Account/AccountGeneralForm'
import AccountProfileForm from '@/components/Account/AccountProfileForm'
import AccountChangePasswordForm from '@/components/Account/AccountChangePasswordForm'
export default {
  components: {
    AccountTabs,
    AccountGeneralForm,
    AccountProfileForm,
    AccountChangePasswordForm
  },
  created() {
    this.$store.dispatch('signUp/getProfessions')
    this.$store.dispatch('signUp/getQualifications')
    this.$store.dispatch('signUp/getClinicalSystems')
    this.$store.dispatch('signUp/getSpokenLanguages')
  }
}
</script>
