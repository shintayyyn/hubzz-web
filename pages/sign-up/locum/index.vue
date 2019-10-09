<template>
  <div class="w-full" ref="signUpContainer">
    <ProgressBar :percentage="percentage" />
    <div class="w-full xl:max-w-2xl p-6">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="mb-6 mt-1 mx-4" style="flex: 0 1 600px;">
          <nuxt-link to="/" class="text-black focus:outline-none">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div class="mt-1 text-xl font-bold">Sign up for a Locum account</div>
        </div>
      </div>

      <transition name="slide" mode="out-in">
        <component :is="activeTab"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import ProgressBar from "~/components/SignUp/ProgressBar.vue";
import LocumAccountDetails from "~/components/SignUp/SignUpLocum/LocumAccountDetails.vue";
import LocumAddressDetails from "~/components/SignUp/SignUpLocum/LocumAddressDetails.vue";
import LocumProfessionalDetails from "~/components/SignUp/SignUpLocum/LocumProfessionalDetails.vue";
import LocumCredentialDetails from "~/components/SignUp/SignUpLocum/LocumCredentialDetails.vue";
export default {
  layout: "auth",
  components: {
    ProgressBar,
    LocumAccountDetails,
    LocumAddressDetails,
    LocumProfessionalDetails,
    LocumCredentialDetails
  },
  computed: {
    activeTab() {
      return this.$store.getters["sign-up/activeTab"];
    },
    percentage() {
      switch (this.activeTab) {
        case "LocumAccountDetails":
          return 25;
          break;
        case "LocumAddressDetails":
          return 50;
          break;
        case "LocumProfessionalDetails":
          return 75;
          break;
        case "LocumCredentialDetails":
          return 100;
          break;
        default:
          return 0;
      }
    }
  }
};
</script>