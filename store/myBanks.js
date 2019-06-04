export const state = () => ({
    myLocumsTabs: 'favourites',
  })
  
  export const mutations = {
    SET_MY_LOCUMS_TAB(state, payload) {
      state.myLocumsTabs = payload
    },
  }
  