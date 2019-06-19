export const state = () => ({
  notification: {
    enabled: false,
    status: '',
    text: ''
  },
  toggled_sidebar: false,
  // locum
  // practice
  toggled_create_job_modal: false,
  toggled_add_surgery_modal: false,
  locum_private_practices: [],
})

export const mutations = {
  SET_NOTIFICATION(state, payload) {
    state.notification.enabled = payload.enabled
    state.notification.status = payload.status
    state.notification.text = payload.text
  },
  TOGGLE_SIDEBAR(state, payload) {
    state.toggled_sidebar = payload
  },
 
 
  // practice
  TOGGLE_CREATE_JOB_MODAL(state, payload) {
    state.toggled_create_job_modal = payload
  },
  TOGGLE_ADD_SURGERY_MODAL(state, payload) {
    state.toggled_add_surgery_modal = payload
  },
  SET_LOCUM_PRIVATE_PRACTICES(state, payload) {
    state.locum_private_practices = payload
  },
  ADD_LOCUM_PRIVATE_PRACTICE(state, payload) {
    state.locum_private_practices.push(payload)
  }
}

export const actions = {
}

export const getters = {
  getLocumPrivatePractices(state) {
    return state.locum_private_practices.map((item) => {
      return { value: item.id, label: item.surgery.name }
  })
  }
}