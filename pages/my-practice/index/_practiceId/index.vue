<template>
  <div class="modal-container shadow-lg">
    <div class="flex flex-col items-start p-4 md:p-8">
      <nuxt-link :to="{ path: `/my-practice`, query: { ...$route.query }}" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>
      <div class="w-full flex flex-row justify-start overflow-x-auto mt-4">
        <nuxt-link
          :to="{ path: `/my-practice/${$route.params.practiceId}`, query: { ...$route.query}}"
          :event="$route.name === 'my-practice-index-practiceId-index'? '' : 'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'my-practice-index-practiceId-index'? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Profile</nuxt-link>
        <nuxt-link
          :to="{ path: `/my-practice/${$route.params.practiceId}/users`, query: { ...$route.query}}"
          :event="$route.name.includes('my-practice-index-practiceId-index-users') ? '' : 'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('my-practice-index-practiceId-index-users') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Users</nuxt-link>
        <nuxt-link
          :to="{ path: `/my-practice/${$route.params.practiceId}/surgeries`, query: { ...$route.query}}"
          :event="$route.name.includes('my-practice-index-practiceId-index-surgeries') ? '' : 'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('my-practice-index-practiceId-index-surgeries') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Surgeries</nuxt-link>
        <nuxt-link
          :to="{ path: `/my-practice/${$route.params.practiceId}/standard-terms`, query: { ...$route.query}}"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('my-practice-index-practiceId-index-standard-terms') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Standard Terms</nuxt-link>
        <nuxt-link
          :to="{ path: `/my-practice/${$route.params.practiceId}/related-jobs`, query: { ...$route.query }}"
          :event="$route.name.includes('my-practice-index-practiceId-index-related-jobs') ? '' : 'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('my-practice-index-practiceId-index-related-jobs') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Related Jobs</nuxt-link>
      </div>
      <div class="w-full mt-5">
        <nuxt-child :practice="practice" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/practices/${params.practiceId}`
      );

      const practice =
        response.data && response.data.practice ? response.data.practice : null;

      return {
        practice
      };
    } catch (err) {
      throw err;
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>