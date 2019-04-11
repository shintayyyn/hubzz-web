export const state = () => ({
    activeTab: 'invoices',
    financeReportsActiveTab: 'invoices_by_month',
    invoiceModal: false
  })
  
  export const getters = {}
  
  export const mutations = {
    setActiveTab(state, payload) {
      state.activeTab = payload
    },
    setFinanceReportsActiveTab(state, payload) {
      state.financeReportsActiveTab = payload
    },
    toggleInvoiceModal(state, payload) {
      state.invoiceModal = payload
    }
  }
  export const actions = {}
  