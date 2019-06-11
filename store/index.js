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
  //
  toggled_right: '',
  // practice
  create_job_modal: false,
  create_job_shield: false,
  remove_uploaded_document_modal: false,
  remove_uploaded_document_shield: false,
  add_surgery_modal: false, 
  add_surgery_shield: false, 
  add_selected_surgery_modal: false,
  add_selected_surgery_shield: false,
  job_detail_modal: false,
  job_detail_shield: false,
  applied_detail_modal: false,
  applied_detail_shield: false,
  applied_locum_detail_modal: false,
  applied_locum_detail_shield: false,
  allocated_detail_modal: false,
  allocated_detail_shield: false,
  completed_detail_modal: false,
  completed_detail_shield: false,
  unfilled_detail_modal: false,
  unfilled_detail_shield: false,
  cancelled_detail_modal: false,
  cancelled_detail_shield: false,
  declined_detail_modal: false,
  declined_detail_shield: false,
  my_locum_detail_modal: false,
  my_locum_detail_shield: false,
  // locums
  add_unavailable_date_modal: false,
  add_unavailable_date_shield: false,
  locum_allocated_detail_modal: false,
  locum_allocated_detail_shield: false,
  locum_available_detail_modal: false,
  locum_available_detail_shield: false,
  locum_applied_detail_modal: false,
  locum_applied_detail_shield: false,
  locum_rejected_detail_modal: false,
  locum_rejected_detail_shield: false,
  locum_declined_detail_modal: false,
  locum_declined_detail_shield: false,
  locum_completed_detail_modal: false,
  locum_completed_detail_shield: false,
  //
  availability_modal: false,
  availability_range_modal: false,
  invoice_modal: false,
  sign_out_modal: false,
  appointment_modal: false,
  surgery_modal: false,
  // add_surgery_modal: false,
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
  //
  TOGGLED_RIGHT(state, payload) {
    state.toggled_right = payload
  },
  // practice
  SET_CREATEJOB_MODAL(state, payload) {
    state.create_job_modal = payload
  },
  SET_CREATEJOB_SHIELD(state, payload) {
    state.create_job_shield = payload
  },
  SET_REMOVEUPLOADED_MODAL(state, payload) {
    state.remove_uploaded_document_modal = payload
  },
  SET_REMOVEUPLOADED_SHIELD(state, payload) {
    state.remove_uploaded_document_shield = payload
  },
  SET_ADDSURGERY_MODAL(state, payload) {
    state.add_surgery_modal = payload
  },
  SET_ADDSURGERY_SHIELD(state, payload) {
    state.add_surgery_shield = payload
  },
  SET_ADDSELECTEDSURGERY_MODAL(state, payload) {
    state.add_selected_surgery_modal = payload
  },
  SET_ADDSELECTEDSURGERY_SHIELD(state, payload) {
    state.add_selected_surgery_shield = payload
  },
  SET_JOBDETAIL_MODAL(state, payload) {
    state.job_detail_modal = payload
  },
  SET_JOBDETAIL_SHIELD(state, payload) {
    state.job_detail_shield = payload
  },
  SET_APPLIEDDETAIL_MODAL(state, payload) {
    state.applied_detail_modal = payload
  },
  SET_APPLIEDDETAIL_SHIELD(state, payload) {
    state.applied_detail_shield = payload
  },
  SET_APPLIEDLOCUMDETAIL_MODAL(state, payload) {
    state.applied_locum_detail_modal = payload
  },
  SET_APPLIEDLOCUMDETAIL_SHIELD(state, payload) {
    state.applied_locum_detail_shield = payload
  },
  SET_ALLOCATEDDETAIL_MODAL(state, payload) {
    state.allocated_detail_modal = payload
  },
  SET_ALLOCATEDDETAIL_SHIELD(state, payload) {
    state.allocated_detail_shield = payload
  },
  SET_COMPLETEDDETAIL_MODAL(state, payload) {
    state.completed_detail_modal = payload
  },
  SET_COMPLETEDDETAIL_SHIELD(state, payload) {
    state.completed_detail_shield = payload
  },
  SET_UNFILLEDDETAIL_MODAL(state, payload) {
    state.unfilled_detail_modal = payload
  },
  SET_UNFILLEDDETAIL_SHIELD(state, payload) {
    state.unfilled_detail_shield = payload
  },
  SET_CANCELLEDDETAIL_MODAL(state, payload) {
    state.cancelled_detail_modal = payload
  },
  SET_CANCELLEDDETAIL_SHIELD(state, payload) {
    state.cancelled_detail_shield = payload
  },
  SET_DECLINEDDETAIL_MODAL(state, payload) {
    state.declined_detail_modal = payload
  },
  SET_DECLINEDDETAIL_SHIELD(state, payload) {
    state.declined_detail_shield = payload
  },
  SET_MYLOCUMDETAIL_MODAL(state, payload) {
    state.my_locum_detail_modal = payload
  },
  SET_MYLOCUMDETAIL_SHIELD(state, payload) {
    state.my_locum_detail_shield = payload
  },
  // locums
  SET_ADDUNAVAILABLEDATE_MODAL(state, payload) {
    state.add_unavailable_date_modal = payload
  },
  SET_ADDUNAVAILABLEDATE_SHIELD(state, payload) {
    state.add_unavailable_date_shield = payload
  },
  SET_LOCUM_ALLOCATED_DETAIL_MODAL(state, payload) {
    state.locum_allocated_detail_modal = payload
  },
  SET_LOCUM_ALLOCATED_DETAIL_SHIELD(state, payload) {
    state.locum_allocated_detail_shield = payload
  },
  SET_LOCUM_AVAILABLE_DETAIL_MODAL(state, payload) {
    state.locum_available_detail_modal = payload
  },
  SET_LOCUM_AVAILABLE_DETAIL_SHIELD(state, payload) {
    state.locum_available_detail_shield = payload
  },
  SET_LOCUM_APPLIED_DETAIL_MODAL(state, payload) {
    state.locum_applied_detail_modal = payload
  },
  SET_LOCUM_APPLIED_DETAIL_SHIELD(state, payload) {
    state.locum_applied_detail_shield = payload
  },
  SET_LOCUM_REJECTED_DETAIL_MODAL(state, payload) {
    state.locum_rejected_detail_modal = payload
  },
  SET_LOCUM_REJECTED_DETAIL_SHIELD(state, payload) {
    state.locum_rejected_detail_shield = payload
  },
  SET_LOCUM_DECLINED_DETAIL_MODAL(state, payload) {
    state.locum_declined_detail_modal = payload
  },
  SET_LOCUM_DECLINED_DETAIL_SHIELD(state, payload) {
    state.locum_declined_detail_shield = payload
  },
  SET_LOCUM_COMPLETED_DETAIL_MODAL(state, payload) {
    state.locum_completed_detail_modal = payload
  },
  SET_LOCUM_COMPLETED_DETAIL_SHIELD(state, payload) {
    state.locum_completed_detail_shield = payload
  },
  //
  TOGGLE_AVAILABILITY_MODAL(state, payload) {
    state.availability_modal = payload
  },
  TOGGLE_AVAILABILITY_RANGE_MODAL(state, payload) {
    state.availability_range_modal = payload
  },
  //
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
    // state.add_surgery_modal = payload
  }
}
