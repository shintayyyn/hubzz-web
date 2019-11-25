<template>
  <div class="modal-container shadow-lg">
    <div class="flex flex-col items-start p-4 md:p-8">
      <nuxt-link :to="{ path: `/my-banks`, query: { ...$route.query }}" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
      <div class="flex flex-row justify-start overflow-x-auto mt-4">
        <nuxt-link
          :to="{ path: `/my-banks/${$route.params.locumId}`, query: { ...$route.query }}"
          :event="$route.name === 'my-banks-index-locumId-index' ? '':'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'my-banks-index-locumId-index' || $route.name === `my-banks-index-locumId-index-profile` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Profile</nuxt-link>
        <nuxt-link
          :to="{ path: `/my-banks/${$route.params.locumId}/related-jobs`, query: { ...$route.query }}"
          :event="$route.name.includes(`my-banks-index-locumId-index-related-jobs`) ? '':'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes(`my-banks-index-locumId-index-related-jobs`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Related Jobs</nuxt-link>
      </div>
      <div class="mt-5">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["locumType"]
};
</script>

