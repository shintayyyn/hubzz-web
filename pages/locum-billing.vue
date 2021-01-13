<template>
  <section class="billing-section">
    <div class="flex flex-wrap items-center justify-between w-full border-b-2 border-yellow-300">
      <div class="flex overflow-x-auto items-center">
        <nuxt-link
          to="/locum-billing/invoices"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name.includes('locum-billing-invoices')
              ? 'border-b-2 border-yellow-500'
              : 'text-gray-600'
          "
        >
          Invoices
        </nuxt-link>

        <nuxt-link
          :to="{ name: 'locum-billing-private-invoices'}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name.includes('locum-billing-private-invoices')
              ? 'border-b-2 border-yellow-500'
              : 'text-gray-600'
          "
        >
          Private Invoices
        </nuxt-link>

        <nuxt-link
          :to="{ name: 'locum-billing-reports'}"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name.includes('locum-billing-reports')
              ? 'border-b-2 border-yellow-500'
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

  mounted () {
    if (this.$route.name === "locum-billing") {
      this.$router.push("/locum-billing/invoices?status=to-be-invoiced")
    }
  },
}
</script>
