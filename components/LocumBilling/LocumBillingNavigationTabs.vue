<template>
  <div 
    v-if="
      !$route.params.id
        && !['locum-billing-private-invoices-form-b-create', 'locum-billing-invoices-form-b-create'].includes($route.name)
    "
    class="flex flex-wrap items-center justify-between w-full border-b border-sunglow"
  >
    <div class="flex overflow-x-auto items-center">
      <nuxt-link
        to="/locum-billing/invoices"
        class="md:mr-2 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('locum-billing-invoices')
            || $route.name === 'locum-billing-solo-forms'
            || $route.name === 'locum-billing-form-as'
            ? 'border-b-4 border-sunglow'
            : 'text-gray-600'
        "
      >
        Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'locum-billing-private-to-be-invoiced'}"
        class="md:mr-2 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('locum-billing-private-invoices')
            || $route.name.includes('locum-billing-private-to-be-invoiced')
            || $route.name.includes('locum-billing-private-invoiced')
            || $route.name.includes('locum-billing-private-invoices')
            || $route.name.includes('locum-billing-private-form-as')
            || $route.name.includes('locum-billing-private-form-bs')
            || $route.name.includes('locum-billing-private-solo-forms')
            ? 'border-b-4 border-sunglow'
            : 'text-gray-600'
        "
      >
        Private Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'locum-billing-reports'}"
        class="md:mr-2 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('locum-billing-reports')
            ? 'border-b-4 border-sunglow'
            : 'text-gray-600'
        "
      >
        Reports
      </nuxt-link>
    </div>
  </div>
</template>
