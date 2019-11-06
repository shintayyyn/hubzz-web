<template>
  <div class="rounded-lg shadow-lg bg-white p-4 md:p-8 my-4 font-bold text-sm leading-relaxed">
    <div v-html="terms.privacy_policy"></div>
  </div>
</template>
<script>
export default {
  props: ["terms"]
};
</script>