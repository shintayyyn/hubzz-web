<template>
  <div class="w-full">
    <ProgressBar :percentage="percentage"/>
    <div class="w-full p-6">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="mb-6 mt-1 mx-4" style="flex: 0 1 600px;">
          <nuxt-link to="/sign-in" class="text-black focus:outline-none">
            <svgicon name="left-arrow" height="32" width="32"/>
          </nuxt-link>
          <div class="mt-1 text-xl font-bold">Sign up for a Locum account</div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <LocumAccountDetails v-if="$store.state.signUp.activeTab === 'account_details'"/>
        <LocumAddressDetails v-if="$store.state.signUp.activeTab === 'address_details'"/>
        <LocumProfessionalDetails v-if="$store.state.signUp.activeTab === 'professional_details'"/>
        <LocumCredentialDetails v-if="$store.state.signUp.activeTab === 'credential_details'"/>
      </transition>
    </div>
  </div>
</template>

<script>
import ProgressBar from '~/components/SignUp/ProgressBar.vue'
import LocumAccountDetails from '~/components/SignUp/SignUpLocum/LocumAccountDetails.vue'
import LocumAddressDetails from '~/components/SignUp/SignUpLocum/LocumAddressDetails.vue'
import LocumProfessionalDetails from '~/components/SignUp/SignUpLocum/LocumProfessionalDetails.vue'
import LocumCredentialDetails from '~/components/SignUp/SignUpLocum/LocumCredentialDetails.vue'
export default {
  layout: 'auth',
  computed: {
    percentage() {
      let tab = this.$store.state.signUp.activeTab
      switch (tab) {
        case 'account_details':
          return 25
          break;
        case 'address_details':
          return 50
          break;
        case 'professional_details':
          return 75
          break;
        case 'credential_details':
          return 100
          break;
        default:
          return 0
      }
    }
  },
  mounted() {
    this.$store.commit('signUp/SET_ACTIVE_TAB', 'account_details')
    this.$store.dispatch('signUp/getProfessions')
    this.$store.dispatch('signUp/getQualifications')
    this.$store.dispatch('signUp/getClinicalSystems')
    this.$store.dispatch('signUp/getSpokenLanguages')
    this.$store.dispatch('signUp/getPracticeTypes')
  },
  components: {
    ProgressBar,
    LocumAccountDetails,
    LocumAddressDetails,
    LocumProfessionalDetails,
    LocumCredentialDetails
  }
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>