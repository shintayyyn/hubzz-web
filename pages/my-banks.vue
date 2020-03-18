<template>
  <section class="my-banks-section">
    <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center">
      <div class="flex w-full md:w-4/5 overflow-x-auto">
        <nuxt-link
          to="/my-banks?status=Favorite"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks' && !$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'favorite') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Favorites</nuxt-link>
        <nuxt-link
          to="/my-banks?status=Completed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'completed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Completed</nuxt-link>
        <nuxt-link
          to="/my-banks?status=Applied"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
        <nuxt-link
          to="/my-banks?status=Appointed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'appointed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Appointed</nuxt-link>
        <nuxt-link
          to="/my-banks?status=Rejected"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'rejected' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Rejected</nuxt-link>
        <nuxt-link
          to="/my-banks?status=Withdrawn"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'withdrawn' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
        <nuxt-link
          to="/my-banks?status=Lates"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query.status && $route.query.status.toLowerCase() === 'lates' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Lates</nuxt-link>
        <nuxt-link
          :to="{ name: 'my-banks-reports'}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-reports' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Reports</nuxt-link>
      </div>
      <div class="flex mt-2 md:mt-0">
        <nuxt-link
          to="/invite"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="'border rounded-lg border-yellow-500 bg-yellow-500'"
        >Invite Locum</nuxt-link>
      </div>
    </div>
    <div class="mt-2">
      <nuxt-child />
    </div>
  </section>
</template>
<script>
export default {
  middleware: "isVerified"
};
</script>
