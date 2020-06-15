<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/practice-billing/finance-reports/hq-invoice' }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-hq-invoice') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        HQ Invoice
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/finance-reports/practice-invoice' }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-practice-invoice') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >
        Practice Invoice
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/practice-billing/finance-reports/tax-year-total' }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-tax-year-total') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
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
