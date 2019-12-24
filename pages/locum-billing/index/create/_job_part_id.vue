<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8 max-w-5xl h-screen">
      <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link to="/locum-billing" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div>
      <LocumPlatformBillingInvoiceForm
        :propInvoice="null"
        :propJobPart="job_part"
        :propType="type"
        :propPractice="practice"
        :propItems="items"
        @createInvoice="$emit('createInvoice', $event), $router.push({ path: '/locum-billing' })"
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

      let type = "Platform";
      let practice = null;
      if (job_part.job.type === "Platform") {
        practice = job_part.job.platform_job.practice;
      } else if (job_part.job.type === "Private") {
        practice = job_part.job.private_job.private_practice;
      }
      let items = [];
      let divider = 1;
      switch (job_part.job.locum_detail_rate_type.name) {
        case "Per Whole Day Session":
          divider = 8;
          break;
        case "Per Half Day Session":
          divider = 4;
          break;
        case "Per Hour":
          divider = 1;
          break;
        default:
          divider = 1;
      }
      items.push({
        type: "Job Part",
        job_part_id: job_part.id,
        description: `Job number ${job_part.job_part_number} ${job_part.job.type} Job at £${job_part.job.rate} ${job_part.job.locum_detail_rate_type.name} from ${job_part.date_start} to ${job_part.date_end} / ${job_part.job.shift.name} / Total hours of ${job_part.job.total_hours}`,
        total: (job_part.job.total_hours / divider) * job_part.job.rate,
        dispute: false,
        absent_days: 0,
        final_hours: job_part.job.total_hours,
        late_hours: 0,
        remarks: ""
      });

      return {
        job_part,
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