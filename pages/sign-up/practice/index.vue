<template>
  <div class="w-full">
    <ProgressBar :percentage="percentage" />
    <div class="relative w-full xl:max-w-3xl p-4 md:p-6 md:px-32 xl:p-6">
      <div class="flex w-full xl:justify-start">
        <div class="flex flex-col items-start mb-6 mt-1 md:mx-4">
          <nuxt-link to="/" class="focus:outline-none text-black">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div class="mt-1 text-xl font-bold">Sign up for a Practice</div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <component :is="activeTab" @nextTab="activeTab = $event"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import ProgressBar from "~/components/SignUp/ProgressBar.vue";
import PracticeDetails from "~/components/SignUp/SignUpPractice/PracticeDetails.vue";
import PracticeAccountDetails from "~/components/SignUp/SignUpPractice/PracticeAccountDetails.vue";
export default {
  layout: "auth",
  components: {
    ProgressBar,
    PracticeDetails,
    PracticeAccountDetails
  },
  data() {
    return {
      activeTab: "PracticeDetails"
    };
  },
  computed: {
    percentage() {
      switch (this.activeTab) {
        case "PracticeDetails":
          return 75;
          break;
        case "PracticeAccountDetails":
          return 100;
          break;
        default:
          return 0;
      }
    }
  }
};
</script>
<style scoped>
</style>



