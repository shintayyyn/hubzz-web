<template>
  <div></div>
</template>
<script>
export default {
  created() {
    this.$router.push(`/my-banks/all/${this.$route.params.userId}/profile`)
  }
}
</script>
