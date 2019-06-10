export const state = () => ({
  accountTab: 'general',
  avatarFile: null
})

export const mutations = {
  setActiveTab(state, payload) {
    state.accountTab = payload
  },
  SET_AVATAR_FILE(state, payload){
    state.avatarFile = payload
  }
}
