<template>
  <div class="rounded-lg shadow-lg pt-10 px-5 pb-5 font-bold text-sm">
    <div v-html="terms.terms_and_conditions"></div>
  </div>
</template>
<script>
export default {
  props: ["terms"]
};
</script>


