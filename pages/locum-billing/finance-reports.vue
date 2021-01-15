<template>
  <div>
    <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center">
      <div class="flex w-full md:w-4/5">
        <nuxt-link
          to="/locum-billing/finance-reports/invoices-by-month"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer text-gray-600"
          :class="$route.path === '/locum-billing/finance-reports/invoices-by-month' ? 'border-b-4 border-sunglow' : ''"
        >Invoices by month</nuxt-link>
        <nuxt-link
          to="/locum-billing/finance-reports/tax-year-totals"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer text-gray-600"
          :class="$route.path === '/locum-billing/finance-reports/tax-year-totals' ? 'border-b-4 border-sunglow' : ''"
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
  },
  async asyncData({ app, error }) {
    try {
      console.log("finance reports");
    } catch (err) {
      console.log("err", err.response || err);
    }
  }
};
</script>