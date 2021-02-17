<template>
  <div class="">
    <div class="px-2">
      <!-- <div class="flex flex-row flex-wrap justify-start pb-4">
        <nuxt-link
          :to="{ name: 'locum-billing-invoices', query: {...$route.query}}"
          class="cursor-pointer"
        >
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
      </div> -->
			<AppBreadcrumbs :links="links" />
      <LocumPlatformBillingInvoiceForm
        :propInvoiceDetail="invoice_detail"
        :propInvoice="null"
        :propJobPart="job_part"
        :claimNhs="claimNhs"
        @createInvoice="$emit('createInvoice', $event), $router.push({ name: 'locum-billing-invoices', query: {...$route.query} })"
      />
    </div>
  </div>
</template>
<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs";
import LocumPlatformBillingInvoiceForm from "@/components/Billing/LocumPlatformBillingInvoiceForm"
export default {
  components: {
    AppBreadcrumbs,
    LocumPlatformBillingInvoiceForm,
  },
  async asyncData ({ app, params, error, }) {
    try {
      const responseMe = await app.$axios.$get(`/api/v1/me`)

      const invoice_detail
        = responseMe.data
        && responseMe.data.user
        && responseMe.data.user.locum_detail
        && responseMe.data.user.locum_detail.invoice_detail
          ? responseMe.data.user.locum_detail.invoice_detail
          : null

      console.log('invoice_detail', invoice_detail)

      const claimNhs
        = responseMe.data
        && responseMe.data.user
        && responseMe.data.user.locum_detail
        && responseMe.data.user.locum_detail.claim_nhs
          ? responseMe.data.user.locum_detail.claim_nhs
          : false

      const response = await app.$axios.$get(
        `/api/v1/locum/job-parts/${params.id}`
      )

      const job_part
        = response.data && response.data.job_part ? response.data.job_part : null

        console.log("job_part", job_part)

      const links = [
        {
          title: 'Billing',
          url: '/locum-billing/invoices'
        },
        {
          title: 'Invoices',
          url: '/locum-billing/invoices'
        },
        {
          title: `Generate Invoince for ${job_part.job_part_number}`
        }
      ]

      return {
        invoice_detail,
        job_part,
        claimNhs,
        links
      }
    } catch (err) {
      console.log("err", err.response || err)
      throw err
    }
  },
}
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
