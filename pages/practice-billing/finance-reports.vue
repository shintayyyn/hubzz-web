<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto pb-3">
      <nuxt-link
        :to="{ path: '/finance-reports/hq-invoice', query: { ...$route.query, status: 'hq-invoice' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-hq-invoice') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'hq-invoice')) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >HQ Invoice</nuxt-link>
      <nuxt-link
        :to="{ path: '/finance-reports/practice-invoice', query: { ...$route.query, status: 'practice-invoice' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-practice-invoice') && ($route.query.status && $route.query.status.toLowerCase() === 'practice-invoice') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Practice Invoice</nuxt-link>
      <nuxt-link
        :to="{ path: '/finance-reports/tax-year-total', query: { ...$route.query, status: 'tax-year-totals' } }"
        class="md:mr-5 p-3 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('finance-reports-tax-year-total') && ($route.query.status && $route.query.status.toLowerCase() === 'tax-year-totals') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
      >Tax Year Totals</nuxt-link>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>
    </transition>
  </section>
</template>
<script>
export default {
  data() {
    return {
      initialLoading: false
    };
  }
};
</script>