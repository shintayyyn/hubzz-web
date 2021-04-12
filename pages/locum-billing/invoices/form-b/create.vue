<template>
  <div class="px-2">
    <!-- <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link
          :to="{ name: 'locum-billing-invoices', query: {...$route.query}}"
          class="cursor-pointer"
        >
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div> -->
      
    <AppBreadcrumbs :links="links" />

    <LocumPlatformBillingInvoiceFormB
      :type="'Platform'"
      @createFormB="$emit('createFormB', $event), $router.push({ name: 'locum-billing-invoices', query: {...$route.query} })"
    />
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
  
  data () {
    return {
      links: [
        {
          title: 'Billing',
          url: '/locum-billing/invoices',
        },
        {
          title: 'NHS Pensions Form B',
          url: '/locum-billing/invoices/?status=pension-form-b',
        },
        {
          title: 'Generate NHS Form B',
        },
      ],
    }
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
