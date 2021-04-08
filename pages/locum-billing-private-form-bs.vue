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
      (from && from.name === 'locum-billing-private-form-bs-create')
      || (to && to.name === 'locum-billing-private-form-bs-create')
    ) {
      return {
        name: 'page',
        mode: 'out-in',
      }
    }

    if (
      (from && from.name.includes('locum-billing'))
      || (to && to.name.includes('locum-billing'))
      || (from && from.name.includes('locum-billing-reports'))
      || (to && to.name.includes('locum-billing-reports'))
      || (from && from.name === 'locum-billing-form-as')
      || (to && to.name === 'locum-billing-form-as')
      || (from && from.name === 'locum-billing-solo-forms')
      || (to && to.name === 'locum-billing-solo-forms')

      || (from && from.name === 'locum-billing-private-invoiced')
      || (to && to.name === 'locum-billing-private-invoiced')
      || (from && from.name === 'locum-billing-private-form-as')
      || (to && to.name === 'locum-billing-private-form-as')
      || (from && from.name === 'locum-billing-private-form-bs')
      || (to && to.name === 'locum-billing-private-form-bs')
      || (from && from.name === 'locum-billing-private-solo-forms')
      || (to && to.name === 'locum-billing-private-solo-forms')
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
