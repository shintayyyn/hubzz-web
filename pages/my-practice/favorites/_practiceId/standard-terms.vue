<template>
  <div class="w-full pl-0 lg:pl-5 mt-5 lg:mt-0 lg:w-3/4">
    <embed
      v-if="practice && practice.standard_terms"
      class="object-contain object-top"
      width="100%"
      height="auto"
      :class="practice.standard_terms.file.type == 'image' ? '' : 'document h-full w-full'"
      :src="practice.standard_terms.file.url"
    />
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  props: ["practice"]
};
</script>