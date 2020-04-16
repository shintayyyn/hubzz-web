<template>
  <div class="modal-container bg-white shadow-lg">
    <div class="flex flex-col items-start p-4 md:p-8 max-w-3xl">
      <nuxt-link :to="'/profile/users'" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link>

      <div class="w-full flex justify-start overflow-x-auto py-3 mt-4">
        <div class="relative">
          <nuxt-link
            :to="`/profile/users/${$route.params.id}`"
            class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['profile-users-id-general', 'profile-users-id'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >
            General
          </nuxt-link>
        </div>

        <div v-if="authPermissions.includes('Update Profile Users')" class="relative">
          <nuxt-link
            :to="`/profile/users/${$route.params.id}/change-password`"
            class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="$route.name === 'profile-users-id-change-password' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >
            Change Password
          </nuxt-link>
        </div>
      </div>

      <div class="w-full mt-5">
        <nuxt-child @updateUser="$emit('updateUser', $event)" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    computed: {

      authPermissions () {
        return this.$store.getters["permissions"]
      },

    },

  }
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
