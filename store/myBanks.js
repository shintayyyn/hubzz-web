export const state = () => ({
    activeTab: 'favourites',
    my_bank_id: '',
  })
  
  export const mutations = {
    setActiveTab(state, payload) {
      state.activeTab = payload
    },
    SET_MY_BANK_ID(state, payload) {
      state.my_bank_id = payload
    },
    SET_MY_LOCUM_ID(state, payload){

    }
    
  }