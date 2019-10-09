<template>
  <div class="error-container">
    <h1 v-if="[401, 404].includes(error.statusCode)">
      <span v-if="error.message">{{error.message}}</span>
      <span v-if="!error.message">You are not authorized to view this page.</span>
    </h1>
    <h1 v-else>Page not found.</h1>
    <!-- <h1 v-else>{{error.message}}</h1> -->
    <nuxt-link to="/">Home page</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "auth"
};
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
