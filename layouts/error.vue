<template>
  <div class="error-container flex flex-col justify-center px-4">
    <h1 v-if="[401, 404].includes(error.statusCode)">
      <span v-if="error.message">{{error.message}}</span>
      <span v-if="!error.message">You are not authorized to view this page.</span>
    </h1>
    <h1 v-else class="text-xl">Page not found.</h1>
    <!-- <h1 v-else>{{error.message}}</h1> -->
    <p>Go back to <span @click="$router.push('/')" class="font-bold cursor-pointer hover:underline">Home page</span>.</p>
    <!-- <p>Go back to <nuxt-link to="/" class="font-bold cursor-pointer hover:underline">Home page</nuxt-link>.</p> -->
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
}
</style>
