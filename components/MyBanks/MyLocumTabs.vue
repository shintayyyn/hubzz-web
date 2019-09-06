<template>
  <div class="flex flex-row flex-wrap justify-start">
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/profile`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-profile` || $route.name === `my-banks-${locumType}-userId` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Profile</nuxt-link>
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name.includes(`my-banks-${locumType}-userId-related-jobs`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Related Jobs</nuxt-link>
  </div>
</template>
<script>
export default {
  props: ["locumType"]
};
</script>

