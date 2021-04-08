<template>
  <div class="">
    <div class="px-2">
      <AppBreadcrumbs :links="links" />

      <LocumPrivateBillingInvoiceForm
        :propInvoiceDetail="invoice_detail"
        :propInvoice="invoice"
        :propJobPart="null"
        :taxRates="tax_rates"
        :vatRegistered="vat_registered"
        @updateInvoice="$emit('updateInvoice', $event), $router.push({ name: 'locum-billing-private-invoices', query: {...$route.query} })"
      />
    </div>
  </div>
</template>

<script>
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"
import LocumPrivateBillingInvoiceForm from "@/components/Billing/LocumPrivateBillingInvoiceForm"

export default {
  components: {
    AppBreadcrumbs,
    LocumPrivateBillingInvoiceForm,
  },

  data () {
    return {
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
          url: '/locum-billing/private-invoices',
        },
      ]

      if (this.invoice) {
        links.push({
          title: `${this.invoice.status} Invoices`,
          url: `/locum-billing/private-invoices?status=${this.$route.query.status}`,
        })
        
        links.push({
          title: this.invoice.invoice_number,
        })
      }

      return links
    },
  },

  async asyncData ({ app, params, }) {
    try {
      const responseMe = await app.$axios.$get(`/api/v1/me`)

      const invoice_detail
        = responseMe.data
        && responseMe.data.user
        && responseMe.data.user.locum_detail
        && responseMe.data.user.locum_detail.invoice_detail
          ? responseMe.data.user.locum_detail.invoice_detail
          : null

      const vat_registered = responseMe.data.user.vat_registered

      let response = await app.$axios.$get(
        `/api/v1/locum/locum-invoices/${params.id}`
      )

      const invoice
        = response.data && response.data.locum_invoice
          ? response.data.locum_invoice
          : null
      
      response = await app.$axios.$get(`/api/v1/tax-rates`)

      const tax_rates 
        = response.data && response.data.tax_rates ? response.data.tax_rates : null

      return {
        invoice_detail,
        vat_registered,
        invoice,
        tax_rates,
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
