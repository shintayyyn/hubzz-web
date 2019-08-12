export const state = () => ({
    locum_invoices: [],
    locum_invoice_count: 0
  })
  
  export const mutations = {
    SET_INVOICES(state, payload) {
      state.locum_invoices = []
      state.locum_invoices = payload
    },
    SET_INVOICE_COUNT(state, payload) {
      state.locum_invoice_count = payload
    },
    ADD_INVOICE(state, payload) {
      if (!state.locum_invoices.find(invoice => invoice.id === payload.id)) {
        state.locum_invoices.unshift(payload)
      }
    },
    REMOVE_INVOICE(state, payload) {
      if (state.locum_invoices.find(invoice => invoice.id === payload)) {
        state.locum_invoices = state.locum_invoices.filter(invoice => invoice.id !== payload)
      }
    },
    UPDATE_INVOICE(state, payload) {
      let index = state.locum_invoices.findIndex(invoice => invoice.id === payload.id)
      if (index >= 0) {
        state.locum_invoices.splice(index, 1, payload)
      }
    }
  }
  export const actions = {}
  export const getters = {
    getLocumInvoices(state) {
      return state.locum_invoices
    }
  }
  