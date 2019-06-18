export const state = () => ({
    activeTab: 'allocated',
    job_id: null,
    shield: false,
    appointment_job: null
  })
  
  export const mutations = {
    setActiveTab(state, payload) {
      state.activeTab = payload
    },
    TOGGLE_SHIELD(state, payload) {
      state.shield = payload
    },
    SET_JOB_ID(state, payload) {
      state.job_id = payload
    },
    SET_APPOINTMENT_JOB(state, payload) {
      state.appointment_job = payload
    }
  }
  