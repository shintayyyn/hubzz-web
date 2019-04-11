<template>
  <section>
    <div class="px-10">
      <BillingTabs />
    </div>
    <div class="px-10 mt-5" >
      <Invoices v-if="$store.state.billing.activeTab === 'invoices'"/>
      <InvoicingDetails v-if="$store.state.billing.activeTab === 'invoicingDetails'"/>
      <FinanceReportsTab v-if="$store.state.billing.activeTab === 'financeReportsTab'"/>
      <TaxReports v-if="$store.state.billing.activeTab === 'taxReports'"/>
    </div>
  </section>
</template>
<script>
import BillingTabs from '@/components/Billing/BillingTabs'
import Invoices from '@/components/Billing/Invoices'
import InvoicingDetails from '@/components/Billing/InvoicingDetails'
import FinanceReportsTab from '@/components/Billing/FinanceReportsTab'
import TaxReports from '@/components/Billing/TaxReports'
export default {
  components: {
    BillingTabs,
    Invoices,
    InvoicingDetails,
    FinanceReportsTab,
    TaxReports
  }
}
</script>
