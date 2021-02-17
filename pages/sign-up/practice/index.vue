<template>
  <div class="w-full">
    <ProgressBar :percentage="percentage" />
    <div class="relative w-full xl:max-w-3xl p-4">
      <div class="flex w-full xl:justify-start">
        <div class="flex flex-col items-start mb-2 mt-2 md:mx-4">
          <nuxt-link to="/sign-up" class="focus:outline-none text-black">
            <svgicon name="left-arrow" height="32" width="32" />
          </nuxt-link>
          <div class="mt-2 text-xl font-bold">
            Sign up for a Practice
          </div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <component :is="activeTab" @nextTab="activeTab = $event" />
      </transition>
    </div>
  </div>
</template>

<script>
import ProgressBar from "~/components/SignUp/ProgressBar"
import PracticeDetails from "~/components/SignUp/SignUpPractice/PracticeDetails"
import PracticeSurgeryDetails from "~/components/SignUp/SignUpPractice/PracticeSurgeryDetails"
import PracticeAccountDetails from "~/components/SignUp/SignUpPractice/PracticeAccountDetails"
export default {
  layout: "auth",
  components: {
    ProgressBar,
    PracticeDetails,
    PracticeSurgeryDetails,
    PracticeAccountDetails,
  },
  data () {
    return {
      activeTab: "PracticeDetails",
    }
  },
  computed: {
    percentage () {
      switch (this.activeTab) {
      case "PracticeDetails":
        return 75
        break
      case "PracticeSurgeryDetails":
        return 85
        break
      case "PracticeAccountDetails":
        return 100
        break
      default:
        return 0
      }
    },
  },
}
</script>
<style scoped>
</style>
