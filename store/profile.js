export const state = () => ({
    profileTab: 'practice',
    mandatory_training: [],
    selected_surgery_id: null,
    added_surgery: null
  })
  
  export const mutations = {
    SET_PROFILE_TAB(state, payload) {
      state.profileTab = payload
    },
    SET_MANDATORY_TRAINING(state, payload) {
      state.mandatory_training = payload
    },
    SET_SELECTEDSURGERY_ID(state, payload) {
      state.selected_surgery_id = payload
    },
    ADD_SURGERY(state, payload) {
      state.added_surgery = payload
    }
  }
  