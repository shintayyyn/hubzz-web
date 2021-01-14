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
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['profile-users-id-general', 'profile-users-id'].includes($route.name) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >
            General
          </nuxt-link>
        </div>

        <div v-if="authPermissions.includes('Update Profile Users') && practiceUser && practiceUser.status !== 'Deactivated'" class="relative">
          <nuxt-link
            :to="`/profile/users/${$route.params.id}/change-password`"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="$route.name === 'profile-users-id-change-password' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
          >
            Change Password
          </nuxt-link>
        </div>
      </div>

      <div class="w-full mt-5">
        <nuxt-child :user="practiceUser" @updateUser="$emit('updateUser', $event)" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {

    data () {
      return {
        practiceUser: null,
      }
    },

    computed: {

      authPermissions () {
        return this.$store.getters["permissions"]
      },

    },

    async asyncData ({ app, params, error }) {
      try {
        const {
          id: practiceUserId,
        } = params

        const practiceUser = await app.$axios.get(`/api/v1/practice/practice-users/${practiceUserId}`)
          .then(response => response.data.data.user)

        return {
          practiceUser,
        }
      } catch (err) {
        console.log("err", err || err.response)
        return error({ status: 404, message: "Page Not Found" })
      }
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
