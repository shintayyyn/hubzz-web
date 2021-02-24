<template>
  <div>
    <AppBreadcrumbs :links="links"/>
    <div v-if="!$route.params.id" class="flex flex-row justify-start overflow-x-auto border-b border-gray-300 mb-4 pt-1">
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-hubzz'}"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'practice-billing-invoices-from-hubzz' ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        HUBZZ Invoices
      </nuxt-link>

      <!-- <nuxt-link
        v-if="practice
          && (practice.type !== 'Spoke' 
            || (practice.type === 'Spoke' 
              && practice.parent_practice_id 
              && practice.allow_surgery_bill_hubzz === true))"
        :to="{ path: '/practice-billing/invoices-from-hubzz/hubzz-billing-reports'}"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-hubzz-hubzz-billing-reports') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        HUBZZ Billing Reports
      </nuxt-link> -->
      <!-- <transition name="fade" mode="out-in">
        <div
          v-if="['practice-billing-invoices-from-hubzz-id'].includes($route.name)"
          class="shield"
        />
      </transition> -->
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
export default {
  components: {
		AppBreadcrumbs,
	},
  data () {
    return {
      practice: null,
    }
  },
  computed: {
    links() {
      let crumbs = []
      let route = this.$route

      if (route.params.id) {
        crumbs.push(
          {
            title: 'Practice Billing',
            url: '/practice-billing'
          },
          {
            title: 'Invoices from Hubzz',
            url: '/practice-billing/invoices-from-hubzz/'
          },
          {
            title: route.params.id,
            url: `/practice-billing/invoices-from-hubzz/${route.params.id}`
          }
        )
      }
      return crumbs
    }
  },
  async asyncData ({ app, error, }) {
    try {
      return {
        practice: app.$auth.user && app.$auth.user.domain === 'Practice' && app.$auth.user.practice_detail
          ? app.$auth.user.practice_detail.practice
          : null,
      }
    } catch (err) {
      console.log('err', err.response || err)
      error(err)
    }
  },
  created () {
    console.log('route name', this.$route.name)
  },
}
</script>

<style>

</style>