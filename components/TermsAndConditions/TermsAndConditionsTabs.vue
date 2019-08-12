<template>
  <div class="flex flex-no-wrap justify-start">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('termsAndConditions')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.active_tab === 'termsAndConditions' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Terms & Conditions</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('privacyPolicy')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.query.active_tab === 'privacyPolicy' ? 'border rounded-lg border-yellow-400 bg-yellow-400' : 'text-gray-500'"
    >Privacy Policy</div>
  </div>
</template>
<script>
export default {
  methods: {
    goTo(type) {
      const query = {
        ...this.$route.query,
        active_tab: type
      }
      this.$router.push({ query })
    }
  }
}
</script>
