<template>
  <div>
    <div v-if="!['hub-surgery-management-invitations-hub-create'].includes($route.name)" class="flex flex-row justify-start items-center overflow-x-auto mb-3 border-b border-gray-500">
      <nuxt-link
        :to="'/hub-surgery-management/invitations/spoke'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('hub-surgery-management-invitations-spoke') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Spoke Invitations
      </nuxt-link>
      <nuxt-link
        :to="'/hub-surgery-management/invitations/hub'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('hub-surgery-management-invitations-hub') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        My Invitations
      </nuxt-link>
      <transition name="fade" mode="out-in">
        <nuxt-link
          v-if="$route.name.includes('hub-surgery-management-invitations-hub')"
          :to="'/hub-surgery-management/invitations/hub/create'"
          class="md:mr-5 px-4 py-1 text-sm font-bold cursor-pointer rounded-lg bg-yellow-500 hover:bg-yellow-600"
        >
          Invite
        </nuxt-link>
      </transition>
    </div>
    <nuxt-child />
  </div>
</template>
<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },
  async asyncData ({ error, store, }) {
    try{

      const authPermissions = store.getters["permissions"]
      console.log('dsadsa',authPermissions.includes('Invitation Processes Surgery Management'))

      if (authPermissions.includes('Invitation Processes Surgery Management') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch (err){
      error({ statusCode: 404, })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!",
      })
      console.log("get parent practice error!!", err)
    }
    // return
  },
}
</script>
