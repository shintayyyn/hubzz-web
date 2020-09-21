<template>
  <section>
    <div class="flex overflow-x-auto">
      <nuxt-link
        :to="`/hub-surgery-management`"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'hub-surgery-management-index' || $route.name.includes('hub-surgery-management-id')
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
      >
        My Spokes
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'hub-surgery-management-invitations-spoke'}"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('hub-surgery-management-invitations')
            ? 'border rounded-lg border-yellow-500 bg-yellow-500'
            : 'text-gray-600'
        "
      >
        Invitations
      </nuxt-link>
    </div>

    <transition name="fade" mode="out-in">
      <div
        v-if="['hub-surgery-management-index-invitationId', 'hub-surgery-management-id', 'hub-surgery-management-index-create'].includes($route.name)
          || $route.name.includes('hub-surgery-management-id')"
        class="shield"
        @click="$router.push('/hub-surgery-management')"
      />
    </transition>

    <nuxt-child />
  </section>
</template>
<script>
export default {
  async asyncData ({ app, error, store, }) {
    try{
      let response = await app.$axios.$get(`/api/v1/practice/me/practice`)
      const practice = response.data.practice
      console.log('banana practice', practice)
      if (practice.status !== 'Active' && practice.status !== 'Dormant') {
        error({
          statusCode: 403,
          message: 'This function is unavailable on inactive practice.',
        })

        return
      }
      if (practice.type !== 'Hub') {
        error({
          statusCode: 403,
          message: 'This function is unavailable on this practice.',
        })

        return
      }
    } catch (err){
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
      console.log("get parent practice error!!", err)
    }
    // return
  }
}
</script>



