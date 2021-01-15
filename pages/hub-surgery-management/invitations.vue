<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto pb-3 mt-2">
      <nuxt-link
        :to="'/hub-surgery-management/invitations/spoke'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('hub-surgery-management-invitations-spoke') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Spoke Invitations
      </nuxt-link>
      <nuxt-link
        :to="'/hub-surgery-management/invitations/hub'"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
        :class="$route.name.includes('hub-surgery-management-invitations-hub') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        My Invitations
      </nuxt-link>
      <transition name="fade" mode="out-in">
        <nuxt-link
          v-if="$route.name.includes('hub-surgery-management-invitations-hub')"
          :to="'/hub-surgery-management/invitations/hub/create'"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer border rounded-lg border-yellow-500 bg-yellow-500 hover:text-white"
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
