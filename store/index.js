export const state = () => ({
  notification: {
    enabled: false,
    status: '',
    text: ''
  },
  activeTab: 'sign_in',
  months: [],
  drawer: false,
  availability_modal: false,
  availability_range_modal: false,
  invoice_modal: false,
  sign_out_modal: false,
  appointment_modal: false,
  surgery_modal: false,
  add_surgery_modal: false,
  blur_bg: false,
  blur_bg_2: false,
  mobile: false,
  windowWidth: null,
})

export const mutations = {
  SET_NOTIFICATION(state, payload) {
    state.notification.enabled = payload.enabled
    state.notification.status = payload.status
    state.notification.text = payload.text
  },
  SET_ACTIVE_TAB(state, payload) {
    state.activeTab = payload
  },
  CHECK_WINDOW_WIDTH(state) {
    if (process.browser) {
      state.windowWidth = window.innerWidth
      state.mobile = window.innerWidth <= 700
    }
  },
  SET_MONTHS(state) {
    state.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
  },
  TOGGLE_DRAWER(state, payload) {
    payload ? (state.blur_bg = true) : (state.blur_bg = false)
    state.drawer = payload
  },
  TOGGLE_AVAILABILITY_MODAL(state, payload) {
    payload ? (state.blur_bg = true) : (state.blur_bg = false)
    state.availability_modal = payload
  },
  TOGGLE_AVAILABILITY_RANGE_MODAL(state, payload) {
    payload ? (state.blur_bg = true) : (state.blur_bg = false)
    state.availability_range_modal = payload
  },
  TOGGLE_INVOICE_MODAL(state, payload) {
    payload ? (state.blur_bg = true) : (state.blur_bg = false)
    state.invoice_modal = payload
  },
  TOGGLE_SIGN_OUT_MODAL(state, payload) {
    payload ? (state.blur_bg = true) : (state.blur_bg = false)
    state.sign_out_modal = payload
  },
  TOGGLE_APPOINTMENT_MODAL(state, payload) {
    // payload ? (state.blur_bg = true) : (state.blur_bg = false)
    state.appointment_modal = payload
  },
  TOGGLE_SURGERY_MODAL(state, payload) {
    payload ? (state.blur_bg_2 = true) : (state.blur_bg_2 = false)
    state.surgery_modal = payload
  },
  TOGGLE_ADD_SURGERY_MODAL(state, payload) {
    state.add_surgery_modal = payload
  }
}
