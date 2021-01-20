<template>
  <section class="my-practice-section">
    <div class="flex flex-row justify-start overflow-x-auto mb-2 border-b border-sunglow">
      <nuxt-link
        :to="{ name: 'my-practice-index-platform'}"
        :event="$route.name === 'my-practice' || $route.name.includes('my-practice-index-platform') ? '' : 'click'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.name === 'my-practice' || $route.name.includes('my-practice-index-platform') ? 'border-b-6 border-sunglow' : 'text-gray-600'"
      >
        Platform
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'my-practice-private-practice'}"
        :event="$route.name === 'my-practice-private-practice' ? '' : 'click'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('my-practice-private-practice') ? 'border-b-6 border-sunglow' : 'text-gray-600'"
      >
        Private
      </nuxt-link>
    </div>
    <nuxt-child />
  </section>
</template>

<script>
export default {
  created () {
    if (!this.$route.query.status && this.$route.name === "my-practice") {
      this.$router.push("/my-practice/platform?status=Favorite")
    }
  },
}
</script>

