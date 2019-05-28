export const state = () => ({
    activeTab: 'live',
    job: null
  })
  
  export const mutations = {
    SET_ACTIVE_TAB(state, payload) {
      state.activeTab = payload
    },
    SET_JOB_DETAIL(state, payload) {
      state.job = payload
    }
  }
  