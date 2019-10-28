<template>
  <div>
    <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center">
      <div class="flex w-full md:w-4/5">
        <nuxt-link
          to="/locum-billing/finance-reports/invoices-by-month"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer text-gray-600"
          :class="$route.path === '/locum-billing/finance-reports/invoices-by-month' ? 'border-b-2 border-yellow-500' : ''"
        >Invoices by month</nuxt-link>
        <nuxt-link
          to="/locum-billing/finance-reports/tax-year-totals"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer text-gray-600"
          :class="$route.path === '/locum-billing/finance-reports/tax-year-totals' ? 'border-b-2 border-yellow-500' : ''"
        >Tax Year Totals</nuxt-link>
      </div>
    </div>

    <div class="mt-5">
      <nuxt-child />
    </div>
  </div>
</template>

<script>
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  }
};
</script>