<template>
  <div class="">
    <div class="flex flex-col items-start">
      <!-- <nuxt-link :to="'/profile/users'" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </nuxt-link> -->

      <div class="w-full flex justify-start overflow-x-auto mb-3 border-b border-sunglow">
          <nuxt-link
            :to="`/profile/users/${$route.params.id}`"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="['profile-users-id-general', 'profile-users-id'].includes($route.name) ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            General
          </nuxt-link>
        <template v-if="authPermissions.includes('Update Profile Users') && practiceUser && practiceUser.status !== 'Deactivated'" >
          <nuxt-link
            :to="`/profile/users/${$route.params.id}/change-password`"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
            :class="$route.name === 'profile-users-id-change-password' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            Change Password
          </nuxt-link>
        </template>
      </div>

      <div class="w-full mt-5 max-w-3xl">
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
