export const state = () => ({
  oneSignalId: null,
})

export const getters = {
}

export const mutations = {
  setOneSignalId(state, oneSignalId) {
    console.log('setOneSignalId')  
    state.oneSignalId = oneSignalId
  }
}

export const actions = {
  async setOneSignalUser ({ state, commit }) {
    let oneSignalId = state.oneSignalId

    console.log("setOneSignalUser", oneSignalId)

    if (!state.oneSignalId) {
      oneSignalId = await new Promise((resolve, reject) => {
        this.$OneSignal.push(() => {
          this.$OneSignal.getUserId().then(resolve).catch(reject)
        })
      })

      console.log('One Signal ID:', oneSignalId)

      commit('setOneSignalId', oneSignalId)
    }

    if (oneSignalId) {
      if (this.$auth.loggedIn) {
        await this.$axios.post('/api/v1/one-signal/login', {
          one_signal_id: oneSignalId
        })
        console.log('One Signal Logged In')
      } else {
        await this.$axios.post('/api/v1/one-signal/logout', {
          one_signal_id: oneSignalId
        })
        console.log('One Signal Logged Out')
      }
    }
  },

  async init ({ getters, commit, dispatch }) {
    console.log('One Signal Initialize')
    console.log('ONE_SIGNAL_APP_ID', process.env.ONE_SIGNAL_APP_ID)

    dispatch('setOneSignalUser')

    this.$OneSignal.push(() => {
      this.$OneSignal.on('subscriptionChange', (isSubscribed) => {
        dispatch('setOneSignalUser')
      })
    })
    
    this.$OneSignal.push(() => {
      this.$OneSignal.registerForPushNotifications()
    })
  },
}