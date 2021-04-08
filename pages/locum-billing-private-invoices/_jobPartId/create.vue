<template>
  <div class="">
    <div class="px-2">
      <AppBreadcrumbs :links="links" />

      <AppLoading :loading="loading" spinner />

      <LocumPrivateBillingInvoiceForm
        v-if="!loading"
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
import LocumPrivateBillingInvoiceForm from "@/components/Billing/LocumPrivateBillingInvoiceForm"
import AppLoading from "@/components/Base/AppLoading"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

export default {
  components: {
    LocumPrivateBillingInvoiceForm,
    AppLoading,
    AppBreadcrumbs,
  },

  data () {
    return {
      loading: true,
      invoice_detail: null,
      vat_registered: null,
      job_part: null,
      tax_rates: [],
    }
  },

  computed: {
    links () {
      const links = [
        {
          title: 'Billing',
          url: '/locum-billing-private-to-be-invoiced',
        },
        {
          title: 'Private Invoices',
          url: '/locum-billing-private-to-be-invoiced',
        },
      ]

      if (this.job_part) {
        links.push({
          title: `Generate Invoince for ${this.job_part.job_part_number}`,
        })
      }

      return links
    },
  },

  mounted () {
    this.loading = true
    Promise.all([
      this.$axios.get(`/api/v1/locum/job-parts/${this.$route.params.jobPartId}`)
        .then(response => response.data.data.job_part),
      this.$axios.get('/api/v1/tax-rates')
        .then(response => response.data.data.tax_rates),
      this.$auth.fetchUser(),
    ]).then(([jobPart, taxRates,]) => {
      const user = this.$auth.user

      this.invoice_detail = user && user.locum_detail && user.locum_detail.invoice_detail
      this.vat_registered = user.vat_registered

      this.job_part = jobPart
      this.tax_rates = taxRates
    }).catch((err) => {
      console.log('err', err.response || err)

      this.$nuxt.error(err)
    }).finally(() => {
      this.loading = false
    })
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
