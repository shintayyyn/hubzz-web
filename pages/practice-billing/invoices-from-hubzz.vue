<template>
  <div>
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/practice-billing/invoices-from-hubzz'}"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'practice-billing-invoices-from-hubzz' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        HUBZZ Invoices
      </nuxt-link>

      <nuxt-link
        v-if="practice
          && (practice.type !== 'Spoke' 
            || (practice.type === 'Spoke' 
              && practice.parent_practice_id 
              && practice.allow_surgery_bill_hubzz === true))"
        :to="{ path: '/practice-billing/invoices-from-hubzz/hubzz-billing-reports'}"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-hubzz-hubzz-billing-reports') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        HUBZZ Billing Reports
      </nuxt-link>
      <transition name="fade" mode="out-in">
        <div
          v-if="['practice-billing-invoices-from-hubzz-id'].includes($route.name)"
          class="shield"
        />
      </transition>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  data () {
    return {
      practice: null,
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