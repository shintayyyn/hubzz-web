<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link to="/locum-billing/private-invoices" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <LocumPrivateBillingInvoiceForm
        :propInvoice="invoice"
        :propJobPart="null"
        :propType="type"
        :propPractice="practice"
        :propItems="items"
        @updateInvoice="$emit('updateInvoice', $event), $router.push({ path: '/locum-billing/private-invoices', query: {...$route.query} })"
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
      const response = await app.$axios.$get(
        `/api/v1/locum/locum-invoices/${params.invoice_id}`
      );

      console.log(response);

      const invoice =
        response.data && response.data.locum_invoice
          ? response.data.locum_invoice
          : null;

      let type = invoice.type;
      let practice = invoice.private_practice;

      let items = [];
      items.push({
        type: "Job Part",
        job_part_id: invoice.items[0].job_part.id,
        description: invoice.items[0].description,
        total: invoice.items[0].total,
        dispute: invoice.items[0].disputed,
        absent_days: invoice.items[0].job_part.absent_days,
        final_hours: invoice.items[0].job_part.final_hours,
        late_hours: invoice.items[0].job_part.late_hours,
        remarks: invoice.items[0].remarks
      });

      if (process.client) {
        document.body.style.cursor = "auto";
      }
      return {
        invoice,
        type,
        practice,
        items
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