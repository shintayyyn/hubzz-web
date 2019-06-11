export const state = () => ({
    activeTab: 'allocated',
    job_id: null
  })
  
  export const mutations = {
    setActiveTab(state, payload) {
      state.activeTab = payload
    },
    SET_JOB_ID(state, payload) {
      state.job_id = payload
    }
  }
  