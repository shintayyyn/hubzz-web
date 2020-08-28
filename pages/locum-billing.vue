<template>
  <section class="billing-section">
    <div class="flex flex-col md:flex-row lg:items-center justify-between">
      <div class="flex flex-row justify-start overflow-x-auto pb-3">
        <nuxt-link
          to="/locum-billing/invoices"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="
            $route.name.includes('locum-billing-invoices')
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
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
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
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
              ? 'border rounded-lg border-yellow-500 bg-yellow-500'
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
      (from && from.name.includes('locum-billing-reports'))
      || (to && to.name.includes('locum-billing-reports'))
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
