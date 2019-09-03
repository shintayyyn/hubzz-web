<template>
  <div class="flex flex-no-wrap justify-start overflow-x-auto">
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('termsAndConditions')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.query.active_tab === 'termsAndConditions' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Terms & Conditions</div>
    <div
      style="font-family:Nunito"
      @click.prevent="goTo('privacyPolicy')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="$route.query.active_tab === 'privacyPolicy' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
      };
      this.$router.push({ query });
    }
  }
};
</script>
