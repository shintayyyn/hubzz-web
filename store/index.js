export const state = () => ({
  socket_id: '',
  notification: {
    enabled: false,
    status: '',
    text: [],
    closable: false,
  },
  toggled_sidebar: false,
  mobile: false,
  locum_private_practices: []
})

export const mutations = {
  SET_SOCKET(state, payload) {
    state.socket_id = payload
  },
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
  },
  IS_MOBILE(state, payload) {
    state.mobile = payload
  }
}

export const actions = {
  async joinRoom({
    dispatch
  }, payload) {
    try {
      // await this.$axios.$post('api/v1/socket/join-room', {
      //   socket_id: payload.socket_id,
      //   room_name: payload.room_name
      // })
    } catch (err) {
      console.log(err.response)
    }
  },
  async leaveRoom({ }, payload) {
    // await this.$axios.$post('api/v1/socket/leave-room', {
    //   socket_id: payload.socket_id,
    //   room_name: payload.room_name
    // })
  },
}

export const getters = {
  getLocumPrivatePractices(state) {
    return state.locum_private_practices.map((item) => {
      return {
        value: item.id,
        label: item.surgery.name
      }
    })
  }
}
