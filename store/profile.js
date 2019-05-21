export const state = () => ({
    profileTab: 'practice'
  })
  
  export const mutations = {
    SET_PROFILE_TAB(state, payload) {
      state.profileTab = payload
    }
  }
  