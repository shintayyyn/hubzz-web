<template>
  <div class="">
    <div class="px-2">
      <AppBreadcrumbs :links="links" />

      <AppLoading :loading="loading" spinner />

      <LocumPrivateBillingInvoiceForm
        v-if="invoice"
        :propInvoiceDetail="invoice_detail"
        :propInvoice="invoice"
        :propJobPart="null"
        :taxRates="tax_rates"
        :vatRegistered="vat_registered"
        @updateInvoice="$emit('updateInvoice', $event), $router.push({ name: 'locum-billing-private-invoiced' })"
      />
    </div>
  </div>
</template>

<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
import AppLoading from "@/components/Base/AppLoading"
import LocumPrivateBillingInvoiceForm from "@/components/Billing/LocumPrivateBillingInvoiceForm"

export default {
  components: {
    AppBreadcrumbs,
    AppLoading,
    LocumPrivateBillingInvoiceForm,
  },

  data () {
    return {
      loading: true,
      invoice_detail: null,
      vat_registered: null,
      invoice: null,
      tax_rates: [],
    }
  },

  computed: {
    links () {
      const links = [
        {
          title: 'Billing',
          url: `/locum-billing-private-to-be-invoiced`,
        },
      ]

      if (this.invoice) {
        links.push({
          title: `${this.invoice.status} Invoices`,
          url: `/locum-billing-private-invoiced`,
        })
        
        links.push({
          title: this.invoice.invoice_number,
        })
      }

      return links
    },
  },

  mounted () {
    this.loading = true
    Promise.all([
      this.$axios.get(`/api/v1/locum/locum-invoices/${this.$route.params.locumInvoiceId}`)
        .then(response => response.data.data.locum_invoice),
      this.$axios.get('/api/v1/tax-rates')
        .then(response => response.data.data.tax_rates),
      this.$auth.fetchUser(),
    ]).then(([locumInvoice, taxRates,]) => {
      const user = this.$auth.user

      this.invoice_detail = user && user.locum_detail && user.locum_detail.invoice_detail
      this.vat_registered = user.vat_registered

      this.invoice = locumInvoice
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
