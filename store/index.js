export const state = () => ({
  notification: {
    enabled: false,
    status: '',
    text: ''
  },
  activeTab: 'sign_in',
  sidebar_shield: false,
  signout_shield: false,
  months: [],
  mobile: false,
  // practice
  create_job_shield: false,
  job_detail_shield: false, 
  //
  availability_modal: false,
  availability_range_modal: false,
  invoice_modal: false,
  sign_out_modal: false,
  appointment_modal: false,
  surgery_modal: false,
  add_surgery_modal: false,
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
  CHECK_WINDOW_WIDTH(state) {
    if (process.browser) {
      state.mobile = window.innerWidth <= 900
      if (state.mobile) {
        state.drawer = false
      } else {
        state.drawer = true
      }
    }
  },
  SET_SIDEBAR_SHIELD(state, payload) {
    state.sidebar_shield = payload
  },
  SET_SIGNOUT_SHIELD(state, payload) {
    state.signout_shield = payload
  },
  // practice
  SET_CREATEJOB_SHIELD(state, payload) {
    state.create_job_shield = payload
  },
  SET_JOBDETAIL_SHIELD(state, payload) {
    state.job_detail_shield = payload
  },
  //
  TOGGLE_AVAILABILITY_MODAL(state, payload) {
    state.availability_modal = payload
  },
  TOGGLE_AVAILABILITY_RANGE_MODAL(state, payload) {
    state.availability_range_modal = payload
  },
  TOGGLE_INVOICE_MODAL(state, payload) {
    payload ? (state.blur_bg = true) : (state.blur_bg = false)
    state.invoice_modal = payload
  },
  TOGGLE_SIGN_OUT_MODAL(state, payload) {
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
