<template>
  <section class="billing-section">
    <div class="flex flex-col md:flex-row lg:items-center justify-between">
      <div class="flex flex-row justify-start overflow-x-auto pb-3">
        <nuxt-link
          to="/locum-billing"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('locum-billing-index') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoices</nuxt-link>
        <nuxt-link
          :to="{ name: 'locum-billing-private-invoices' }"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes('locum-billing-private-invoices') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Private Invoices</nuxt-link>
        <nuxt-link
          :to="{ name: 'locum-billing-invoicing-details'}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path === '/locum-billing/invoicing-details' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoicing details</nuxt-link>
        <nuxt-link
          :to="{ name: 'locum-billing-finance-reports'}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="['/locum-billing/finance-reports','/locum-billing/finance-reports/invoices-by-month','/locum-billing/finance-reports/tax-year-totals'].includes($route.path) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Finance reports</nuxt-link>
        <nuxt-link
          :to="{ name: 'locum-billing-tax-reports'}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path === '/locum-billing/tax-reports' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Tax reports</nuxt-link>
      </div>
    </div>
    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: "isVerified"
};
</script>

<style scoped>
.transition {
  transition: all 0.2s ease-in-out;
}
</style>