<template>
  <div class="rounded-lg border bg-white p-4 my-4 font-bold text-sm leading-relaxed">
    <div v-html="terms.terms_and_conditions"></div>
  </div>
</template>
<script>
export default {
  props: ["terms"]
};
</script>


