<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push(
      `/my-practice/favorites/${this.$route.params.practiceId}/related-jobs/allocated`
    );
  }
};
</script>
