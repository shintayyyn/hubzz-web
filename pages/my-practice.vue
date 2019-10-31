<template>
  <section class="my-practice-section">
    <div class="flex flex-row justify-start overflow-x-auto">
      <nuxt-link
        to="/my-practice?status=Favorite"
        :event="$route.query.status && $route.query.status === 'Favorite' ? '' : 'click'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'favorite')  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Favorites</nuxt-link>
      <nuxt-link
        to="/my-practice?status=Completed"
        :event="$route.query.status && $route.query.status === 'Completed' ? '' : 'click'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'completed'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Completed</nuxt-link>
      <nuxt-link
        to="/my-practice?status=Applied"
        :event="$route.query.status && $route.query.status === 'Applied' ? '' : 'click'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'applied'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Applied</nuxt-link>
      <nuxt-link
        to="/my-practice?status=Unsuccessful"
        :event="$route.query.status && $route.query.status === 'Unsuccessful' ? '' : 'click'"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$route.query.status && $route.query.status.toLowerCase() === 'unsuccessful'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
