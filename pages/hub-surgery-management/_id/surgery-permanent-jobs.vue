<template>
  <section class="flex flex-col items-start w-full">
    <div v-if="!$route.params.permJobId" class="flex flex-wrap items-center justify-between w-full border-b border-gray-500">
      <div class="flex overflow-x-auto items-center">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs?status=Pending`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'pending')
              ? 'border-b-4 border-gray-500'
              : 'text-gray-600'
          "
        >
          Pending
        </nuxt-link>
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            !$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'available')
              ? 'border-b-4 border-gray-500'
              : 'text-gray-600'
          "
        >
          Available
        </nuxt-link>
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs?status=Closed`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'closed')
              ? 'border-b-4 border-gray-500'
              : 'text-gray-600'
          "
        >
          Closed
        </nuxt-link>
      </div>
    </div>
    <!-- <div
      v-if="$route.name === 'hub-surgery-management-id-surgery-permanent-jobs-index-permJobId'"
      class="shield"
      @click="$router.go(-1)"
    /> -->
    <nuxt-child />
  </section>
</template>

<script>
export default {
  data () {
    return {
      spokeIsNotAllowed: false,
    }
  },
  async asyncData ({ app, error, store, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (app.$auth.user.domain === 'Practice'
          && authPermissions.includes('View Surgery Permanent Jobs') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch (err) {
      console.log('err', err.response || err)
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
    }
  },
}
</script>
