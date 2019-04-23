<template>
  <div class="w-full">
    <ProgressBar :percentage="percentage"/>
    <div class="w-full p-6">

      <div class="flex w-full justify-center xl:justify-start">
        <div class="mb-6 mt-1 mx-4" style="flex: 0 1 600px;">
          <button @click.prevent="$store.commit('SET_ACTIVE_TAB', 'sign_in')" class="focus:outline-none">
            <svgicon name="arrow-left-solid" height="32" width="32"/>
          </button>
          <div class="mt-1 text-xl font-bold">Sign up for a Locum account </div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <AccountDetails v-if="$store.state.signUp.activeTab === 'account_details'" />
        <AddressDetails v-if="$store.state.signUp.activeTab === 'address_details'" />
        <ProfessionalDetails v-if="$store.state.signUp.activeTab === 'professional_details'" />
      </transition>

    </div>
  </div>
</template>

<script>
  import ProgressBar from '~/components/SignUp/ProgressBar.vue'
  import AccountDetails from '~/components/Auth/SignUp/SignUpLocum/AccountDetails.vue'
  import AddressDetails from '~/components/Auth/SignUp/SignUpLocum/AddressDetails.vue'
  import ProfessionalDetails from '~/components/Auth/SignUp/SignUpLocum/ProfessionalDetails.vue'
  export default {
    computed: {
      percentage () {
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
          default:
            return 0
        }
      }
    },
    components: {
      ProgressBar,
      AccountDetails,
      AddressDetails,
      ProfessionalDetails
    }
  }
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>



