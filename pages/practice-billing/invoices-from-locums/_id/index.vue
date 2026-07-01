<template>
  <div class="">
    <div class="px-2">
      <AppBreadcrumbs :links="links" />
      <PracticeBillingInvoiceForm :propInvoice="invoice" @updateInvoice="
        $emit('updateInvoice', $event),
        $router.push({
          name: 'practice-billing-invoices-from-locums',
          query: { status: 'approved' }
        })
      "
      />
    </div>
  </div>
</template>
<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
import PracticeBillingInvoiceForm from "@/components/Billing/PracticeBillingInvoiceForm";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    AppBreadcrumbs,
    PracticeBillingInvoiceForm
  },
  async asyncData({ app, error, params, route }) {
    try {
      const response = await app.$axios.get(
        `/api/v1/practice/locum-invoices/${params.id}`,
        { cache: true }
      );
      const invoice =
        response.data && response.data.data && response.data.data.locum_invoice
          ? response.data.data.locum_invoice
          : null;

      const status = route.query.status;

      const links = [
        {
          title: "Invoices from Locums",
          url: "/practice-billing/invoices-from-locums"
        },
        {
          title: `${invoice.status}`,
          url: `/practice-billing/invoices-from-locums/?status=${status}`,
          class: "capitalize"
        },
        {
          title: invoice.invoice_number
        }
      ];

      return {
        invoice,
        links
      };
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: "This page could not be found" });
      } else if (err & (err.response.status === 500)) {
        return error({ status: 500, message: "Something went wrong!" });
      }
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
