<template>
  <section class="my-banks-section">
    <template v-if="!$route.params.locumId">
      <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center border-b border-sunglow">
        <div class="flex w-full md:w-4/5 overflow-x-auto">
          <nuxt-link
            to="/my-banks"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              !$route.name.includes('reports') && (!$route.query.practice_locum_type || $route.query.practice_locum_type.toLowerCase() === 'favorite')
                ? 'border-b-4 border-sunglow' 
                : 'text-gray-600'
            "
          >
            Favourites
          </nuxt-link>

          <nuxt-link
            to="/my-banks?practice_locum_type=Completed"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'completed'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            Completed
          </nuxt-link>

          <nuxt-link
            to="/my-banks?practice_locum_type=Applied"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'applied'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            Applied
          </nuxt-link>

          <nuxt-link
            to="/my-banks?practice_locum_type=Appointed"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'appointed'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            Appointed
          </nuxt-link>

          <nuxt-link
            to="/my-banks?practice_locum_type=Rejected"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'rejected'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            Rejected
          </nuxt-link>

          <nuxt-link
            to="/my-banks?practice_locum_type=Withdrawn"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'withdrawn'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            Withdrawn
          </nuxt-link>

          <nuxt-link
            to="/my-banks?practice_locum_type=Lates"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'lates'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            Lates
          </nuxt-link>

          <nuxt-link
            to="/my-banks?practice_locum_type=All"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'all'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            All
          </nuxt-link>
          
          <nuxt-link
            to="/my-banks-reports"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="$route.name === 'my-banks-reports' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            Reports
          </nuxt-link>
        </div>
        
        <div class="hidden md:flex my-2 md:mt-0">
          <nuxt-link
            to="/invite"
            class="md:mr-5 px-3 py-1 text-sm font-bold cursor-pointer"
            :class="'rounded-lg bg-sunglow hover:bg-sunglow-dark'"
          >
            Invite Locum
          </nuxt-link>
        </div>
      </div>
      <div class="flex md:hidden mt-3">
        <nuxt-link
          to="/invite"
          class="md:mr-5 px-3 py-1 text-sm font-bold cursor-pointer"
          :class="'rounded-lg bg-sunglow hover:bg-sunglow-dark'"
        >
          Invite Locum
        </nuxt-link>
      </div>
    </template>

    <div class="md:mt-2">
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'isVerified',

  async asyncData ({ app, error, store, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (authPermissions.includes('View My Banks') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

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
