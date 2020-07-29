<template>
  <div class="error-container flex flex-col justify-center px-4">
    <h1 v-if="error.statusCode === 401 || error.statusCode === 403">
      <span>You are not authorized to view this page.</span>
    </h1>

    <h1 v-if="error.statusCode === 404">
      <span class="text-xl">Page not found</span>
    </h1>

    <h1 v-if="error.statusCode !== 401 && error.statusCode !== 403 &&error.statusCode !== 404">
      <span>{{ error.message || 'Something Went Wrong!' }}</span>
    </h1>
    
    <p>
      <span>Go back to</span>
      <nuxt-link :to="'/'" class="font-bold cursor-pointer hover:underline">
        Home page
      </nuxt-link>
      <span>.</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },

  layout: "auth",

  mounted () {
    console.log(this.error)
  },
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
  }
</style>
