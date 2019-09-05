<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push(
      `/my-practice/all/${this.$route.params.practiceId}/profile`
    );
  }
};
</script>
