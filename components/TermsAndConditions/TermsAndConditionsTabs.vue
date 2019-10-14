<template>
  <div class="flex flex-no-wrap justify-start overflow-x-auto">
    <div
      @click.prevent="goTo('termsAndConditions')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="activeTab('termsAndConditions') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Terms &amp; Conditions</div>
    <div
      @click.prevent="goTo('privacyPolicy')"
      class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
      :class="activeTab('privacyPolicy') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Privacy Policy</div>
  </div>
</template>
<script>
export default {
  props: ["activeComponent"],
  methods: {
    goTo(type) {
      this.$emit("goTo", type);
    },
    activeTab(type) {
      return this.activeComponent === type;
    }
  }
};
</script>
