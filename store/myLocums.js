export const state = () => ({
    myLocumsTabs: 'favourites',
    my_locum_id: ''
  })
  
  export const mutations = {
    SET_MY_LOCUMS_TAB(state, payload) {
      state.myLocumsTabs = payload
    },
    SET_MY_LOCUM_ID(state, payload) {
      state.my_locum_id = payload
    },
  }
  