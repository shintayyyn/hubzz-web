<template>
  <section></section>
</template>

<script>
  export default {
    async asyncData ({store, redirect}) {
      if (store.state.auth.loggedIn) {
        redirect('/dashboard')
      } else {
        redirect('/auth')
      }
    }
  }
</script>
