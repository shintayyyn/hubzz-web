<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push(
      `/my-practice/favorites/${this.$route.params.practiceId}/profile`
    );
  }
};
</script>
