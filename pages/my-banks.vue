<template>
  <section class="my-banks-section">
    <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center">
      <div class="flex w-full md:w-4/5 overflow-x-auto">
        <nuxt-link
          to="/my-banks"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="
            !$route.name.includes('reports') && (!$route.query.practice_locum_type || $route.query.practice_locum_type.toLowerCase() === 'favorite')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500' 
              : 'text-gray-600'
          "
        >
          Favorites
        </nuxt-link>

        <nuxt-link
          to="/my-banks?practice_locum_type=Completed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'completed'
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Completed
        </nuxt-link>

        <nuxt-link
          to="/my-banks?practice_locum_type=Applied"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'applied'
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Applied
        </nuxt-link>

        <nuxt-link
          to="/my-banks?practice_locum_type=Appointed"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'appointed'
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Appointed
        </nuxt-link>

        <nuxt-link
          to="/my-banks?practice_locum_type=Rejected"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'rejected'
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Rejected
        </nuxt-link>

        <nuxt-link
          to="/my-banks?practice_locum_type=Withdrawn"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'withdrawn'
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Withdrawn
        </nuxt-link>

        <nuxt-link
          to="/my-banks?practice_locum_type=Lates"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'lates'
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
              : 'text-gray-600'
          "
        >
          Lates
        </nuxt-link>
        
        <nuxt-link
          :to="{ name: 'my-banks-reports'}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-reports' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Reports
        </nuxt-link>
      </div>
      
      <div class="flex mt-2 md:mt-0">
        <nuxt-link
          to="/invite"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="'border rounded-lg border-yellow-500 bg-yellow-500'"
        >
          Invite Locum
        </nuxt-link>
      </div>
    </div>

    <div class="mt-2">
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'isVerified',
  async asyncData ({ app, error, }) {
    try {
      if (app.$auth.user.domain === 'Practice' 
        && app.$auth.user.practice_detail 
        && app.$auth.user.practice_detail.practice
        && app.$auth.user.practice_detail.practice.type === 'Spoke'
        && app.$auth.user.practice_detail.practice.parent_practice_id === null) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })

        return
      }
    } catch (err) {
      console.log('err', err.response || err)
      error(err)
    }
  },
}
</script>
