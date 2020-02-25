<template>
  <div class="error-container flex flex-col justify-center px-4">
    <h1 v-if="error.statusCode === 401">
      <span
        v-if="error.response && error.response.data && error.response.data.message"
      >{{error.response.data.response.data.message}}</span>
      <span v-if="!error.response">You are not authorized to view this page.</span>
    </h1>
    <h1 v-else-if="error.statusCode === 400">
      <span v-if="error.message">{{error.response.data.message}}</span>
    </h1>
    <h1 v-else-if="error.statusCode === 404">
      <span class="text-xl" v-if="error.message">{{error.message}}</span>
    </h1>
    <h1 v-else-if="error.statusCode === 404" class="text-xl">Page not found</h1>
    <h1 v-else>
      <span v-if="error.message">Something went wrong.</span>
    </h1>
    <p>
      Go back to
      <nuxt-link :to="'/'" class="font-bold cursor-pointer hover:underline">Home page</nuxt-link>.
    </p>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "auth",
  mounted() {
    console.log(this.error);
  }
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
