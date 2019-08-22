export const state = () => ({
    practice_type: '',
    surgeries_count: 0,
    surgeries: [],
  })
  
  export const mutations = {
    SET_PRACTICE_TYPE(state, payload) {
      state.practice_type = payload
    },
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
    },
    UPDATE_SURGERY(state, payload) {
      let index = state.surgeries.findIndex(surgery => surgery.id === payload.id)
      if (index >= 0) {
        state.surgeries.splice(index, 1, payload)
      }
    },
    REMOVE_SURGERY(state, payload) {
      state.surgeries = state.surgeries.filter(surgery => surgery.id !== payload)
    }
  }
  