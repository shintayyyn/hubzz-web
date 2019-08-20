<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push(`/my-banks/appointed/${this.$route.params.userId}/profile`)
  }
}
</script>
