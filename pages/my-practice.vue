<template>
  <section class="account-section">
    <div class="flex flex-row justify-start overflow-x-auto">
      <nuxt-link
        to="/my-practice/favorites"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('my-practice-favorites')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Favorites</nuxt-link>
      <nuxt-link
        to="/my-practice/completed"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('my-practice-completed')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Completed</nuxt-link>
      <nuxt-link
        to="/my-practice/all"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('my-practice-all')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >All</nuxt-link>
      <nuxt-link
        to="/my-practice/Unsuccessful"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('my-practice-unsuccessful')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Unsuccessful</nuxt-link>
    </div>
    <div class="mt-5">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  middleware: "isVerified"
};
</script>
