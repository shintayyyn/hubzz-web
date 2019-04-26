export const state = () => ({
    authTab: 'sign_in',
  })
  
  export const mutations = {
    SET_AUTH_TAB(state, payload) {
      state.authTab = payload
    }
  }
  