export const state = () => ({
  drawer: false,
  availability_modal: false,
  availability_range_modal: false,
  invoice_modal: false,
  blur_bg: false,
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
    payload ? state.blur_bg = true : state.blur_bg = false
    state.drawer = payload
  },
  TOGGLE_AVAILABILITY_MODAL (state, payload) {
    payload ? state.blur_bg = true : state.blur_bg = false
    state.availability_modal = payload
  },
  TOGGLE_AVAILABILITY_RANGE_MODAL (state, payload) {
    payload ? state.blur_bg = true : state.blur_bg = false
    state.availability_range_modal = payload
  },
  TOGGLE_INVOICE_MODAL (state, payload) {
    payload ? state.blur_bg = true : state.blur_bg = false
    state.invoice_modal = payload
  }
}
