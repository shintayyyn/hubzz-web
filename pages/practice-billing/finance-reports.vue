<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto lg:overflow-y-hidden border-b border-gray-500 mb-4 pt-1">
      <nuxt-link
        :to="{ path: '/practice-billing/finance-reports/hq-invoice' }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-hq-invoice') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        HQ Invoice
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/finance-reports/practice-invoice' }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-practice-invoice') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Practice Invoice
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/finance-reports/tax-year-total' }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-tax-year-total') ? 'border-b-4 border-gray-500' : 'text-gray-600'"
      >
        Tax Year Totals
      </nuxt-link>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
    </transition>

    <nuxt-child />
  </section>
</template>

<script>
  export default {
    data () {
      return {
        initialLoading: false,
      }
    }
  }
</script>
