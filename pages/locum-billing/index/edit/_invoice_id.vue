<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link :to="{ path: '/locum-billing', query: {...$route.query}}" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <LocumPlatformBillingInvoiceForm
        :propInvoice="invoice"
        :propJobPart="null"
        :propType="type"
        :propPractice="practice"
        :propItems="items"
        @updateInvoice="$emit('updateInvoice', $event), $router.push({ path: '/locum-billing' })"
      />
    </div>
  </div>
</template>

<script>
import LocumPlatformBillingInvoiceForm from "@/components/Billing/LocumPlatformBillingInvoiceForm";
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    LocumPlatformBillingInvoiceForm
  },
  data() {
    return {
      invoice: null
    };
  },
  async asyncData({ app, error, params }) {
    try {
      if (process.client) {
        document.body.style.cursor = "wait";
      }
      const response = await app.$axios.get(
        `/api/v1/locum/locum-invoices/${params.invoice_id}`
      );
      const invoice =
        response.data && response.data.data && response.data.data.locum_invoice
          ? response.data.data.locum_invoice
          : null;

      let type = invoice.type;
      let practice = invoice.practice;

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
      console.log(invoice);
      return {
        invoice,
        type,
        practice,
        items
      };
    } catch (err) {
      if (err && err.response.status === 404) {
        return error({ status: 404, message: "This page could not be found" });
      } else if (err & (err.response.status === 500)) {
        return error({ status: 500, message: "Something went wrong!" });
      }
      throw err;
    }
  },
  methods: {
    getInvoice(id) {
      this.$axios.$get(`/api/v1/locum/locum-invoices/${id}`).then(res => {
        this.invoice = res.data.locum_invoice;
      });
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
