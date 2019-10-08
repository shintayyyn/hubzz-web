<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push(`/profile/users/${this.$route.params.id}/general`);
  }
};
</script>