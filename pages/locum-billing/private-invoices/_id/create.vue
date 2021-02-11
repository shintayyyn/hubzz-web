<template>
  <div class="">
    <div class="px-2">
      <!-- <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link
          :to="{ name: 'locum-billing-private-invoices', query: {...$route.query}}"
          class="cursor-pointer"
        >
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div> -->
			<AppBreadcrumbs :links="links" />
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
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
export default {
  components: {
    LocumPrivateBillingInvoiceForm,
    AppBreadcrumbs
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

      const links = [
        {
          title: 'Billing',
          url: '/locum-billing/private-invoices'
        },
        {
          title: 'Private Invoices',
          url: '/locum-billing/private-invoices'
        },
        {
          title: `Generate Invoince for ${job_part.job_part_number}`
        }
      ]

      return {
        invoice_detail,
        vat_registered,
        job_part,
        tax_rates,
        links
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