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
        :to="{ path: '/practice-billing/invoices-from-hubzz/hubzz-billing-reports'}"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('practice-billing-invoices-from-hubzz-hubzz-billing-reports') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        HUBZZ Billing Reports
      </nuxt-link>
      <transition name="fade" mode="out-in">
        <div
          v-if="['practice-billing-invoices-from-hubzz-index-id'].includes($route.name)"
          class="shield"
        />
      </transition>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>