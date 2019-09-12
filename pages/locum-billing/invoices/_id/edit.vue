<template>
  <BillingInvoiceForm :selectedInvoice="invoice" />
</template>

<script>
import BillingInvoiceForm from "@/components/Billing/BillingInvoiceForm";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    BillingInvoiceForm
  },
  data() {
    return {
      invoice: null
    };
  },
  async asyncData({ app, error, params }) {
    try {
      const response = await app.$axios.get(
        `/api/v1/locum/invoices/${params.id}`
      );

      const invoice =
        response.data && response.data.data && response.data.data.invoice
          ? response.data.data.invoice
          : null;

      return {
        invoice
      };
    } catch (err) {
      console.log("locum-invoice create err", err.response || err);
      console.log("locum-invoice create error", {
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      });
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      });
    }
  }
};
</script>
