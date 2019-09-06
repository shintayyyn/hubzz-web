<template>
  <div class="flex flex-row flex-wrap justify-start">
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/available`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-related-jobs` || $route.name === `my-banks-${locumType}-userId-related-jobs-available` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Available</nuxt-link>
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/applied`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-related-jobs-applied` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Applied</nuxt-link>
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/current`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-related-jobs-current` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Current</nuxt-link>
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/completed`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-related-jobs-completed` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Completed</nuxt-link>
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/unsuccessful`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-related-jobs-unsuccessful` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Unsuccessful</nuxt-link>
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/cancelled`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-related-jobs-cancelled` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Cancelled</nuxt-link>
    <nuxt-link
      :to="`/my-banks/${locumType}/${$route.params.userId}/related-jobs/declined`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-banks-${locumType}-userId-related-jobs-declined` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Declined</nuxt-link>
  </div>
</template>
<script>
export default {
  props: ['locumType'],
}
</script>
