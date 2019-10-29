<template>
  <div class="rounded-lg shadow-lg bg-white px-8 py-4 my-4 font-bold text-sm leading-relaxed">
    <div v-html="terms.terms_and_conditions"></div>
  </div>
</template>
<script>
export default {
  props: ["terms"]
};
</script>


