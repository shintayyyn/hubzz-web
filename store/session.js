export const state = () => ({
    activeTab: 'live',
    job_id: null
  })
  
  export const mutations = {
    SET_ACTIVE_TAB(state, payload) {
      state.activeTab = payload
    },
    SET_JOB_DETAIL_ID(state, payload) {
      state.job_id = payload
    }
  }
  