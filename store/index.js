export const state = () => ({
  drawer: false,
  mobile: false,
  windowWidth: null
})

export const mutations = {
  CHECK_WINDOW_WIDTH (state) {
    if (process.browser) {
      state.windowWidth = window.innerWidth
      state.mobile = window.innerWidth <= 700
    }
  },
  TOGGLE_DRAWER (state, payload) {
    state.drawer = payload
  }
}
