<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link
          :to="{ name: 'locum-billing-private-invoices', query: {...$route.query}}"
          class="cursor-pointer"
        >
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <LocumPrivateBillingInvoiceForm
        :propInvoiceDetail="invoice_detail"
        :propInvoice="invoice"
        :propJobPart="null"
        @updateInvoice="$emit('updateInvoice', $event), $router.push({ name: 'locum-billing-private-invoices', query: {...$route.query} })"
      />
    </div>
  </div>
</template>
<script>
import LocumPrivateBillingInvoiceForm from "@/components/Billing/LocumPrivateBillingInvoiceForm";
export default {
  components: {
    LocumPrivateBillingInvoiceForm
  },
  async asyncData({ app, params, error }) {
    try {
      const responseMe = await app.$axios.$get(`/api/v1/me`);

      const invoice_detail =
        responseMe.data &&
        responseMe.data.user &&
        responseMe.data.user.locum_detail &&
        responseMe.data.user.locum_detail.invoice_detail
          ? responseMe.data.user.locum_detail.invoice_detail
          : null;

      const response = await app.$axios.$get(
        `/api/v1/locum/locum-invoices/${params.id}`
      );

      const invoice =
        response.data && response.data.locum_invoice
          ? response.data.locum_invoice
          : null;

      return {
        invoice_detail,
        invoice
      };
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