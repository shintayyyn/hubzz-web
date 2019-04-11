<template>
  <div class="flex flex-no-wrap justify-start">
    <div style="font-family:Nunito" @click.prevent="$store.commit('billing/setActiveTab', 'invoices')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.billing.activeTab === 'invoices' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">
        Invoices
    </div>
    <div style="font-family:Nunito" @click.prevent="$store.commit('billing/setActiveTab', 'invoicingDetails')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.billing.activeTab === 'invoicingDetails' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">
        Invoicing details
    </div>
    <div style="font-family:Nunito" @click.prevent="$store.commit('billing/setActiveTab', 'financeReportsTab')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.billing.activeTab === 'financeReportsTab' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">
        Finance reports
    </div>
    <div style="font-family:Nunito" @click.prevent="$store.commit('billing/setActiveTab', 'taxReports')"
        class="mr-5 p-3 text-sm font-bold cursor-pointer"
        :class="$store.state.billing.activeTab === 'taxReports' ? 'border rounded-lg border-yellow-dark bg-yellow-dark' : 'text-grey-darker'">
        Tax reports
    </div>
    <div v-if="$store.state.billing.activeTab === 'invoices'" class="mr-5 p-3 text-sm cursor-pointer absolute pin-r"
        @click="$store.commit('billing/toggleInvoiceModal', true)">
        Add invoice
        <span class="rounded-full h-10 w-10 bg-yellow-dark font-semibold text-xl px-3 py-1">+</span>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
