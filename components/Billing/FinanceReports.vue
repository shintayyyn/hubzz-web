<template>
  <section>
    <div class="flex flex-no-wrap justify-start">
      <div
        style="font-family:Nunito"
        @click.prevent="$store.commit('billing/setFinanceReportsActiveTab', 'invoices_by_month')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.billing.financeReportsActiveTab === 'invoices_by_month' ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >Invoices by month</div>
      <div
        style="font-family:Nunito"
        @click.prevent="$store.commit('billing/setFinanceReportsActiveTab', 'tax_year_totals')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.billing.financeReportsActiveTab === 'tax_year_totals' ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >Tax Year Totals</div>
    </div>

    <div class="my-4 md:mt-8">
      <InvoicesByMonth v-if="$store.state.billing.financeReportsActiveTab === 'invoices_by_month'" />
      <TaxYearTotals v-if="$store.state.billing.financeReportsActiveTab === 'tax_year_totals'" />
    </div>
  </section>
</template>
<script>
import InvoicesByMonth from '@/components/Billing/FinanceReports/InvoicesByMonth'
import TaxYearTotals from '@/components/Billing/FinanceReports/TaxYearTotals'
export default {
  components: {
    InvoicesByMonth,
    TaxYearTotals
  }
}
</script>
