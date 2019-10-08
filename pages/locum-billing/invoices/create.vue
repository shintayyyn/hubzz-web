<template>
  <BillingInvoiceForm :selectedInvoice="null" @addInvoice="$emit('addInvoice', $event)" />
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