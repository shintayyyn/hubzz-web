<template>
  <BillingInvoiceForm :selectedInvoice="null" />
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
  }
};
</script>