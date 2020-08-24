<template>
  <section class="flex flex-col items-start w-full">
    <div class="flex flex-wrap items-center justify-between w-full">
      <div class="my-1 flex overflow-x-auto items-center">
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs?status=Pending`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'pending')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Pending
        </nuxt-link>
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            !$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'available')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Available
        </nuxt-link>
        <nuxt-link
          :to="`/hub-surgery-management/${$route.params.id}/surgery-permanent-jobs?status=Closed`"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            ($route.query.status && $route.query.status.toLowerCase() === 'closed')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Closed
        </nuxt-link>
      </div>
    </div>
    <div
      v-if="$route.name === 'hub-surgery-management-id-surgery-permanent-jobs-index-permJobId'"
      class="shield"
      @click="$router.go(-1)"
    />
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
  created () {
    console.log('route name', this.$route.name)
  },
}
</script>
