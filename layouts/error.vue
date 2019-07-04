<template>
  <div class="error-container">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>{{error.message}}</h1>
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'auth',
}
</script>
<style scoped>
.error-container {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  max-width: 600px;
  height: 500px;
  padding: 1px;
}
</style>
