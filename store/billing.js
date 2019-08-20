export const state = () => ({
    locum_invoices: [],
    locum_invoice_count: 0,
    practice_invoices: [],
    practice_invoice_count: 0
  })
  
  export const mutations = {
    SET_LOCUM_INVOICES(state, payload) {
      state.locum_invoices = []
      state.locum_invoices = payload
    },
    CLEAR_INVOICES(state) {
      state.locum_invoices = []
      state.locum_invoice_count = 0
      state.practice_invoices = []
      state.practice_invoice_count = 0
    },
    SET_LOCUM_INVOICE_COUNT(state, payload) {
      state.locum_invoice_count = payload
    },
    ADD_LOCUM_INVOICE(state, payload) {
      if (!state.locum_invoices.find(invoice => invoice.id === payload.id)) {
        state.locum_invoices.unshift(payload)
      }
    },
    REMOVE_LOCUM_INVOICE(state, payload) {
      if (state.locum_invoices.find(invoice => invoice.id === payload)) {
        state.locum_invoices = state.locum_invoices.filter(invoice => invoice.id !== payload)
      }
    },
    UPDATE_LOCUM_INVOICE(state, payload) {
      let index = state.locum_invoices.findIndex(invoice => invoice.id === payload.id)
      if (index >= 0) {
        state.locum_invoices.splice(index, 1, payload)
      }
    },
    SET_PRACTICE_INVOICES(state, payload) {
      state.practice_invoices = []
      state.practice_invoices = payload
    },
    SET_PRACTICE_INVOICE_COUNT(state, payload) {
      state.practice_invoice_count = payload
    },
    ADD_PRACTICE_INVOICE(state, payload) {
      if (!state.practice_invoices.find(invoice => invoice.id === payload.id)) {
        state.practice_invoices.unshift(payload)
      }
    },
    REMOVE_PRACTICE_INVOICE(state, payload) {
      if (state.practice_invoices.find(invoice => invoice.id === payload)) {
        state.practice_invoices = state.practice_invoices.filter(invoice => invoice.id !== payload)
      }
    },
    UPDATE_PRACTICE_INVOICE(state, payload) {
      let index = state.practice_invoices.findIndex(invoice => invoice.id === payload.id)
      if (index >= 0) {
        state.practice_invoices.splice(index, 1, payload)
      }
    }
  }
  export const actions = {}
  export const getters = {
    getLocumInvoices(state) {
      return state.locum_invoices
    },
    getPracticeInvoices(state) {
      return state.practice_invoices
    }
  }
  