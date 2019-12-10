<template>
  <section class="billing-section">
    <div class="flex flex-col md:flex-row lg:items-center justify-between">
      <div class="flex flex-row justify-start overflow-x-auto pb-3">
        <nuxt-link
          to="/locum-billing"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="['locum-billing-index-create', 'locum-billing-index'].includes($route.name) || $route.name.includes('locum-billing-id') ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoices</nuxt-link>
        <nuxt-link
          to="/locum-billing/invoicing-details"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path === '/locum-billing/invoicing-details' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Invoicing details</nuxt-link>
        <nuxt-link
          to="/locum-billing/finance-reports"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="['/locum-billing/finance-reports','/locum-billing/finance-reports/invoices-by-month','/locum-billing/finance-reports/tax-year-totals'].includes($route.path) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Finance reports</nuxt-link>
        <nuxt-link
          to="/locum-billing/tax-reports"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.path === '/locum-billing/tax-reports' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >Tax reports</nuxt-link>
      </div>

      <nuxt-link
        v-if="$route.path.includes('/locum-billing')"
        to="/locum-billing/create"
        class="flex flex-row items-center justify-end leading-loose whitespace-no-wrap"
      >
        <span
          class="transition px-2 hover:bg-yellow-500 pl-3 pr-10 rounded-full hover:shadow-md"
        >Add invoice</span>
        <div
          class="absolute rounded-full h-8 w-8 text-2xl sm:text-3xl flex items-center focus:outline-none justify-center bg-yellow-500 font-semibold cursor-pointer hover:text-white hover:no-underline"
        >+</div>
      </nuxt-link>
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