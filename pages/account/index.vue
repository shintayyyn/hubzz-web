<template>
  <div></div>
</template>
<script>
export default {
  created() {
    if (this.$auth.user.domain === 'Locum') {
      this.$router.push('/account/general')
    } else {
      this.$router.push('/account/user')
    }
  }
}
</script>
