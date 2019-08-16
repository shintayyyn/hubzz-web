export const state = () => ({
    surgeries_count: 0,
    surgeries: []
  })
  
  export const mutations = {
    SET_SURGERIES_COUNT(state, payload) {
      state.surgeries_count = payload
    },
    SET_SURGERIES(state, payload) {
      state.surgeries = payload
    },
    ADD_SURGERY(state, payload) {
      if (!state.surgeries.find(surgery => surgery.id == payload.id)) {
        state.surgeries.push(payload)
      }
    }
  }
  