<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push(
      `/my-practice/unsuccessful/${this.$route.params.practiceId}/profile`
    );
  }
};
</script>
