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
        :propInvoice="null"
        :propJobPart="job_part"
        :taxRates="tax_rates"
        :vatRegistered="vat_registered"
        @createInvoice="$emit('createInvoice', $event), $router.push({ name: 'locum-billing-private-invoices', query: {...$route.query} })"
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

      const vat_registered = responseMe.data.user.vat_registered
      
      let response = await app.$axios.$get(
        `/api/v1/locum/job-parts/${params.id}`
      );

      const job_part =
        response.data && response.data.job_part ? response.data.job_part : null

      response = await app.$axios.$get(`/api/v1/tax-rates`)

      const tax_rates = 
        response.data && response.data.tax_rates ? response.data.tax_rates : null

      return {
        invoice_detail,
        vat_registered,
        job_part,
        tax_rates,
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