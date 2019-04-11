<template>
  <section>
    <div class="px-10">
      <AccountTabs />
    </div>
    <div class="px-10 mt-5" >
      <AccountGeneralForm v-if="$store.state.account.activeTab === 'general'"/>
      <AccountProfileForm v-if="$store.state.account.activeTab === 'profile'"/>
      <AccountChangePasswordForm v-if="$store.state.account.activeTab === 'change-password'"/>
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
  }
}
</script>
