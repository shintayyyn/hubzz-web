<template>
  <div class="w-full">
    <ProgressBar :percentage="percentage"/>
    <div class="w-full p-6">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="mb-6 mt-1 mx-4" style="flex: 0 1 600px;">
          <nuxt-link to="/sign-up" class="focus:outline-none text-black">
            <svgicon name="left-arrow" height="32" width="32"/>
          </nuxt-link>
          <div class="mt-1 text-xl font-bold">Sign up for a Practice</div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <PracticeDetails v-if="$store.state.signUp.activeTab === 'practice_details'"/>
        <PracticeAccountDetails
          v-if="$store.state.signUp.activeTab === 'practice_account_details'"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import ProgressBar from '~/components/SignUp/ProgressBar.vue'
import PracticeDetails from '~/components/SignUp/SignUpPractice/PracticeDetails.vue'
import PracticeAccountDetails from '~/components/SignUp/SignUpPractice/PracticeAccountDetails.vue'
export default {
  layout: 'auth',
  computed: {
    percentage() {
      let tab = this.$store.state.signUp.activeTab
      switch (tab) {
        case 'practice_details':
          return 75
          break;
        case 'practice_account_details':
          return 100
          break;
        default:
          return 0
      }
    }
  },
  mounted() {
    this.$store.commit('signUp/SET_ACTIVE_TAB', 'practice_details')
  },
  components: {
    ProgressBar,
    PracticeDetails,
    PracticeAccountDetails
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



