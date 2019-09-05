<template>
  <div class="w-full pl-0 lg:pl-5 mt-5 lg:mt-0 lg:w-3/4">
    <embed
      v-if="standard_terms"
      class="object-contain object-top"
      width="100%"
      height="auto"
      :class="standard_terms.file.type == 'image' ? '' : 'document h-full w-full'"
      :src="standard_terms.file.url"
    />
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  async asyncData({ app, error, params }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}`
      );
      const standard_terms =
        response.data &&
        response.data.practice &&
        response.data.practice.standard_terms
          ? response.data.practice.standard_terms
          : null;
      return {
        standard_terms
      };
    } catch (err) {
      console.log(err);
    }
  }
};
</script>