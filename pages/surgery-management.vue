<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  middleware: "isVerified",
  created() {
    if (this.$auth.user.practice_detail.practice.type === "Hub") {
      this.$router.push("/surgery-management/practice-spokes");
    } else if (this.$auth.user.practice_detail.practice.type !== "Hub") {
      this.$router.push("/surgery-management/practice-hub");
    }
  }
};
</script>

<style>
</style>