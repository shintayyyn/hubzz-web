export const state = () => ({
    shield: false,
  })
  
  export const mutations = {
    TOGGLE_SHIELD(state, payload) {
      state.shield = payload
    },
    
  }
  