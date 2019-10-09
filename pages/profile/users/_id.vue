<template>
  <div class="modal-container shadow-lg">
    <div class="p-8 max-w-3xl">
      <div @click="$router.push('/profile/users')" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex justify-start overflow-x-auto py-3 mt-4">
        <div class="relative">
          <nuxt-link
            :to="`/profile/users/${$route.params.id}/general`"
            class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['profile-users-id-general', 'profile-users-id'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >General</nuxt-link>
        </div>
        <div class="relative">
          <nuxt-link
            :to="`/profile/users/${$route.params.id}/change-password`"
            class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="$route.name === 'profile-users-id-change-password'  ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >Change Password</nuxt-link>
        </div>
      </div>
      <div class="mt-5">
        <nuxt-child :user="user" @updateUser="$emit('updateUser', $event)" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/practice/practice-users/${params.id}`
      );
      const user =
        response.data && response.data.user ? response.data.user : null;

      return {
        user
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
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
    width: 70%;
  }
}
</style>