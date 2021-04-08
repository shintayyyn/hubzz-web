<template>
  <div class="">
    <div class="px-2">
      <AppBreadcrumbs :links="links" />

      <LocumPlatformBillingInvoiceFormB
        :type="'Private'"
        @createFormB="$emit('createFormB', $event), $router.push({ name: 'locum-billing-private-invoices', query: {...$route.query} })"
      />
    </div>
  </div>
</template>

<script>
import LocumPlatformBillingInvoiceFormB from "@/components/Billing/LocumPlatformBillingInvoiceFormB"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

export default {
  components: {
    LocumPlatformBillingInvoiceFormB,
    AppBreadcrumbs,
  },

  computed: {
    links () {
      return [
        {
          title: 'Billing',
          url: '/locum-billing-private-to-be-invoiced',
        },
        {
          title: 'NHS Pensions Form B',
          url: '/locum-billing-private-form-bs',
        },
        {
          title: 'Generate NHS Form B',
        },
      ]
    },
  },
}
</script>

<style scoped>
  .modal-container {
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .modal-container {
      width: 80%;
    }
  }
</style>
