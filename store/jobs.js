export const state = () => ({
    job_id: null,
    shield: false,
  })
  
  export const mutations = {
    TOGGLE_SHIELD(state, payload) {
      state.shield = payload
    },
    SET_JOB_ID(state, payload) {
      state.job_id = payload
    },
    
  }
  