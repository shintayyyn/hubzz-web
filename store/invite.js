export const state = () => ({
    activeTab: 'invite_locums',
  })
  
  export const mutations = {
    SET_ACTIVE_TAB(state, payload) {
      state.activeTab = payload
    },
  }
  