<template>
  <div class="rounded-lg border bg-white p-4 my-4 text-sm leading-relaxed">
    <div v-html="terms.terms_and_conditions" />
  </div>
</template>
<script>
export default {
  props: ["terms"]
};
</script>
