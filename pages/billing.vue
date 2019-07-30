<template>
  <section class="billing-section">
    <BillingTabs @add="modal = true" />
    <div class="mt-5">
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" />
      </transition>
    </div>
    <div class="invoice-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="invoice-modal shadow-lg" v-if="modal">
        <AddInvoiceModal @close="modal = false" @add="add" />
      </div>
    </transition>
  </section>
</template>
<script>
import BillingTabs from '@/components/Billing/BillingTabs'
import Invoices from '@/components/Billing/Invoices'
import InvoicingDetails from '@/components/Billing/InvoicingDetails'
import FinanceReports from '@/components/Billing/FinanceReports'
import TaxReports from '@/components/Billing/TaxReports'
import AddInvoiceModal from '@/components/Billing/AddInvoiceModal'
export default {
  components: {
    BillingTabs,
    Invoices,
    InvoicingDetails,
    FinanceReports,
    TaxReports,
    AddInvoiceModal,
  },
  middleware:'isVerified',
  data() {
    return {
      modal: false
    }
  },
  watch: {
    modal(value) {
      value ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto'
    }
  },
  created() {
    const query = {
      ...this.$route.query,
      billing_tab: this.$route.query.billing_tab || 'invoices'
    }
    this.$router.push({ query })
  },
  computed: {
    activeComponent() {
      if (this.$route.query.billing_tab === 'invoices') {
        return 'Invoices'
      }
      if (this.$route.query.billing_tab === 'invoicing-details') {
        return 'InvoicingDetails'
      }
      if (this.$route.query.billing_tab === 'finance-reports') {
        return 'FinanceReports'
      }
      if (this.$route.query.billing_tab === 'tax-reports') {
        return 'TaxReports'
      }
    }
  },
  methods: {
    add(data) {
      console.log(data)
    }
  }
}
</script>
<style scoped>
.invoice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.invoice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  /* border-left: solid 2px #edf2f7; */
  transition: all 0.3s ease-in-out;
  /* background-color: rgb(80, 80, 80); */
  background: #fff;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .invoice-modal {
    width: 70%;
  }
}
</style>
