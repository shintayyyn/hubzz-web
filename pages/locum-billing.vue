<template>
  <section class="billing-section">
    <LocumBillingNavigationTabs />

    <div>
      <nuxt-child />
    </div>
  </section>
</template>

<script>
import LocumBillingNavigationTabs from "@/components/LocumBilling/LocumBillingNavigationTabs"

export default {
  components: {
    LocumBillingNavigationTabs,
  },

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
