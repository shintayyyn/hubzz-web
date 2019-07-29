export const state = () => ({
  notification: {
    enabled: false,
    status: '',
    text: [],
    closable: false,
  },
  toggled_sidebar: false,
  locum_private_practices: [],
})

export const mutations = {
  SET_NOTIFICATION(state, payload) {
    state.notification.enabled = payload.enabled
    state.notification.status = payload.status
    state.notification.text = payload.text
    state.notification.closable = payload.closable
  },
  TOGGLE_SIDEBAR(state, payload) {
    state.toggled_sidebar = payload
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