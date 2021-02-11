<template>
  <section  class="my-practice-section">
    <div v-if="!$route.params.practiceId" class="flex flex-row justify-start overflow-x-auto border-b border-gray-500">
      <nuxt-link
        to="/my-practice/platform?status=Favorite"
        :event="$route.query.status && $route.query.status === 'Favorite' ? '' : 'click'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="(!$route.query.status && $route.name.includes('my-practice-index-platform')) || ($route.query.status && $route.query.status.toLowerCase() === 'favorite') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Favorites
      </nuxt-link>
      
      <nuxt-link
        to="/my-practice/platform?status=Completed"
        :event="$route.query.status && $route.query.status === 'Completed' ? '' : 'click'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'completed' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Completed
      </nuxt-link>
      <nuxt-link
        to="/my-practice/platform?status=Applied"
        :event="$route.query.status && $route.query.status === 'Applied' ? '' : 'click'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'applied' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Applied
      </nuxt-link>
      <nuxt-link
        to="/my-practice/platform?status=Unsuccessful"
        :event="$route.query.status && $route.query.status === 'Unsuccessful' ? '' : 'click'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'unsuccessful' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Unsuccessful
      </nuxt-link>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  middleware: "isVerified",
  transition: {
    name: "fade",
    mode: "out-in",
  },
}
</script>
