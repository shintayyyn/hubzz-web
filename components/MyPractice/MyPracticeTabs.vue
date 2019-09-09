<template>
  <div class="flex flex-row flex-wrap justify-start">
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/profile`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-practice-${practiceType}-practiceId-profile` || $route.name === `my-practice-${practiceType}-practiceId` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Profile</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/users`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-practice-${practiceType}-practiceId-users` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Users</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/surgeries`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-practice-${practiceType}-practiceId-surgeries` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Surgeries</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/standard-terms`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name === `my-practice-${practiceType}-practiceId-standard-terms` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Standard Terms</nuxt-link>
    <nuxt-link
      :to="`/my-practice/${practiceType}/${$route.params.practiceId}/related-jobs`"
      class="mr-5 p-3 text-sm font-bold cursor-pointer"
      :class="$route.name.includes(`my-practice-${practiceType}-practiceId-related-jobs`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
    >Related Jobs</nuxt-link>
  </div>
</template>
<script>
export default {
  props: ["practiceType"]
};
</script>

