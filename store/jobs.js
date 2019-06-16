export const state = () => ({
    activeTab: 'allocated',
    job: null,
    shield: false
  })
  
  export const mutations = {
    setActiveTab(state, payload) {
      state.activeTab = payload
    },
    TOGGLE_SHIELD(state, payload) {
      state.shield = payload
    },
    SET_JOB(state, payload) {
      state.job = payload
    }
  }
  