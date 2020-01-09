<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link :to="{ path: '/locum-billing', query: {...$route.query}}" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <LocumPlatformBillingInvoiceForm
        :propInvoice="null"
        :propJobPart="job_part"
        @createInvoice="$emit('createInvoice', $event), $router.push({ path: '/locum-billing', query: {...$route.query} })"
      />
    </div>
  </div>
</template>
<script>
import LocumPlatformBillingInvoiceForm from "@/components/Billing/LocumPlatformBillingInvoiceForm";
export default {
  components: {
    LocumPlatformBillingInvoiceForm
  },
  async asyncData({ app, params, error }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/job-parts/${params.job_part_id}`
      );

      const job_part =
        response.data && response.data.job_part ? response.data.job_part : null;

      return {
        job_part
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