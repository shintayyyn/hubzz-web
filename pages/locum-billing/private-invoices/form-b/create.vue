<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 h-screen">
      <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link
          :to="{ name: 'locum-billing-private-invoices', query: {...$route.query}}"
          class="cursor-pointer"
        >
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <LocumPlatformBillingInvoiceFormB
        :type="'Private'"
        @createFormB="$emit('createFormB', $event), $router.push({ name: 'locum-billing-private-invoices', query: {...$route.query} })"
      />
      <!-- <LocumPrivateBillingInvoiceFormB
        :type="'Private'"
        @createFormB="$emit('createFormB', $event), $router.push({ name: 'locum-billing-private-invoices', query: {...$route.query} })"
      />-->
    </div>
  </div>
</template>
<script>
import LocumPrivateBillingInvoiceFormB from "@/components/Billing/LocumPrivateBillingInvoiceFormB";
import LocumPlatformBillingInvoiceFormB from "@/components/Billing/LocumPlatformBillingInvoiceFormB";
export default {
  components: {
    LocumPrivateBillingInvoiceFormB,
    LocumPlatformBillingInvoiceFormB
  },
  async asyncData({ app, params, error }) {
    try {
      //   const response = await app.$axios.$get(`/api/v1/me`);
      //   console.log(response);
      //   const locum_user =
      //     response.data && response.data.user ? response.data.user : null;
      //   // locum user
      //   // type
      //   // practice id
      //   return {
      //     locum_user
      //   };
    } catch (err) {
      console.log("err", err.response || err);
      throw err;
    }
  }
};
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