<template>
  <div class="rounded-lg border bg-white p-4 my-4 text-sm leading-relaxed">
    <div class="ql-editor" v-html="terms.privacy_policy"></div>
  </div>
</template>
<script>
export default {
  props: {
    terms: {
      type: Object,
      default: null
    }
  }
};
</script>
