<template>
  <section class="billing-section">
    <div class="flex flex-wrap items-center justify-between w-full border-b border-sunglow">
      <div class="flex overflow-x-auto items-center">
        <nuxt-link
          to="/locum-billing/invoices"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name.includes('locum-billing-invoices') || $route.name === 'locum-billing-form-as'
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Invoices
        </nuxt-link>

        <nuxt-link
          :to="{ name: 'locum-billing-private-invoices'}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name.includes('locum-billing-private-invoices')
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Private Invoices
        </nuxt-link>

        <nuxt-link
          :to="{ name: 'locum-billing-reports'}"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
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

    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
export default {
  middleware: "isVerified",

  transition: (to, from) => {
    if (
      (from && from.name.includes('locum-billing'))
      || (to && to.name.includes('locum-billing'))
      || (from && from.name.includes('locum-billing-reports'))
      || (to && to.name.includes('locum-billing-reports'))
      || (from && from.name === 'locum-billing-form-as')
      || (to && to.name === 'locum-billing-form-as')
      || (from && from.name === 'locum-billing-solo-forms')
      || (to && to.name === 'locum-billing-solo-forms')
    ) {
      return {
        name: '',
        mode: 'out-in',
      }
    }
    
    return {
      name: 'page',
      mode: 'out-in',
    }
  },
}
</script>
