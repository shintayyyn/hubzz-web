<template>
  <section class="my-banks-section">
    <div class="mb-5 text-sm font-bold cursor-pointer">My Locums</div>
    <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center">
      <div class="flex justify-between md:justify-start w-full md:w-4/5 overflow-x-auto">
        <nuxt-link
          to="/my-banks/favourites"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-favourites' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Favourites</nuxt-link>
        <nuxt-link
          to="/my-banks/applied"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-applied' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Applied</nuxt-link>
        <nuxt-link
          to="/my-banks/appointed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-appointed' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Appointed</nuxt-link>
        <nuxt-link
          to="/my-banks/rejected"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-rejected' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Rejected</nuxt-link>
        <nuxt-link
          to="/my-banks/withdrawn"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-withdrawn' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Withdrawn</nuxt-link>
      </div>
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
