export const state = () => ({
  socket_id: "",
  notification: {
    enabled: false,
    status: "",
    text: [],
    closable: false,
    duration: "",
  },
  toggled_sidebar: false,
  mobile: false,
  locum_private_practices: [],
  user_verification: {
    modal: false,
    status: '',
  },
  user_deactivated_modal: false,
  view_locum_jobs: false,
  view_permanent_jobs: false,
  session_expiring: false,
  breadcrumbs: [],
})

export const mutations = {
  SET_SOCKET (state, payload) {
    state.socket_id = payload
  },
  SET_PERMISSIONS (state, payload) {
    state.auth.user.practice_detail.role.permissions = payload
  },

  SET_NOTIFICATION (state, payload) {
    state.notification.enabled = false
    state.notification.status = ""
    state.notification.text = []
    state.notification.closable = false
    state.notification.duration = ""

    state.notification.enabled = payload.enabled
    state.notification.status = payload.status
    state.notification.text = payload.text
    state.notification.closable = payload.closable
    state.notification.duration = payload.duration
  },

  TOGGLE_SIDEBAR (state, payload) {
    state.toggled_sidebar = payload
  },

  SET_BREADCRUMBS (state, payload) {
    state.breadcrumbs = payload
    if (typeof localStorage === 'object') {
      localStorage.setItem('breadcrumbs', JSON.stringify(payload))
      // window.localStorage.setItem('breadcrumbs', JSON.stringify(payload))
    }
  },
  ADD_BREADCRUMB (state, payload) {
    state.breadcrumbs.push(payload)
  },
  SET_LOCUM_PRIVATE_PRACTICES (state, payload) {
    state.locum_private_practices = payload
  },
  ADD_LOCUM_PRIVATE_PRACTICE (state, payload) {
    state.locum_private_practices.push(payload)
  },
  IS_MOBILE (state, payload) {
    state.mobile = payload
  },
  SET_USER_VERIFICATION_MODAL (state, payload) {
    state.user_verification = payload
  },
  SET_USER_DEACTIVATED (state, payload) {
    state.user_deactivated_modal = payload
  },
  SET_VIEW_LOCUM_JOBS (state, payload) {
    state.view_locum_jobs = payload
  },
  SET_VIEW_PERMANENT_JOBS (state, payload) {
    state.view_permanent_jobs = payload
  },
  SESSION_EXPIRING (state, payload) {
    state.session_expiring = payload
  },
}

export const actions = {
  async initializeSessionListener ({ commit, }) {
    this.$socket.on('Session Refresh', async () => {
      console.log('session refresh')
      commit('SESSION_EXPIRING', false)
    })
		
    this.$socket.on('Session Expiring', async () => {
      console.log('session expiring')
      commit('SESSION_EXPIRING', true)
    })
    this.$socket.on('Session Expired', async () => {
      console.log('session expired')
      this.$auth.logout().finally(() => {
        this.$auth.$storage.setUniversal('_token.local', '')
        this.$router.push('/')
      })
      commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: ["Session Expired",],
        duration: 5000,
      })
    })
  },
	
  async joinRoom () {
    try {
      // await this.$axios.$post('api/v1/socket/join-room', {
      //   socket_id: payload.socket_id,
      //   room_name: payload.room_name
      // })
    } catch (err) {
      console.log(err.response)
    }
  },
  async leaveRoom () {
    // await this.$axios.$post('api/v1/socket/leave-room', {
    //   socket_id: payload.socket_id,
    //   room_name: payload.room_name
    // })
  },
  async getViewJobsPermissions ({ commit, }) {
    await this.$axios.$get(`/api/v1/me`).then(
      res => {
        commit("SET_VIEW_LOCUM_JOBS", res.data.user.view_locum_jobs)
        commit("SET_VIEW_PERMANENT_JOBS", res.data.user.view_permanent_jobs)
      }
    )

  },
}

export const getters = {
  sessionExpiring (state) {
    return state.session_expiring
  },
	
  getLocumPrivatePractices (state) {
    return state.locum_private_practices.map(item => {
      return {
        value: item.id,
        label: item.surgery.name,
      }
    })
  },
  getViewLocumJobs (state) {
    return state.view_locum_jobs
  },
  getViewPermanentJobs (state) {
    return state.view_permanent_jobs
  },
  permissions (state) {
    return state.auth.user && state.auth.user.practice_detail && state.auth.user.practice_detail.role ? state.auth.user.practice_detail.role.permissions.map(item => item.name) : []
  },
  getBreadcrumbs (state) {
    if (typeof localStorage === 'object') {
      return [
        ...JSON.parse(localStorage.getItem('breadcrumbs')),
      ]
    }
    return state.breadcrumbs
  },
}
