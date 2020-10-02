<template>
  <section class="sign-in-card">
    <div class="flex flex-col">
      <div class="flex flex-row flex-no-wrap justify-center md:mb-16">
        <nuxt-link
          :to="'/'"
          :event="$route.name === 'index' ? '' : 'click'"
          class="px-8 md:px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
          :class="$route.name === 'index' ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
        >
          Sign In
        </nuxt-link>

        <nuxt-link
          :to="'/sign-up'"
          :event="$route.name === 'index-sign-up' ? '' : 'click'"
          class="px-8 md:px-12 py-5 font-bold text-sm cursor-pointer focus:outline-none"
          :class="$route.name === 'index-sign-up' ? 'rounded-full bg-yellow-500 text-black' : 'text-gray-600'"
        >
          Sign Up
        </nuxt-link>
      </div>

      <div class="px-5 mt-5">
        <nuxt-child />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: "auth",
}
</script>

<style scoped>
  .sign-in-card {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    max-width: 600px;
    max-height: 700px;
    padding: 20px 1px;
  }

  @media screen and (max-width: 1200px) {
    .sign-in-card {
      position: relative;
    }
  }
</style>

