export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async setOneSignalUser ({ state, commit }) {
    console.log('setOneSignalUser')

    const OneSignal = window.OneSignal || []

    const isPushEnabled = await OneSignal.isPushNotificationsEnabled()

    console.log('isPushEnabled', isPushEnabled)

    if (isPushEnabled) {
      const oneSignalId = await OneSignal.getUserId()

      console.log('oneSignalId', oneSignalId)

      console.log('loggedIn', this.$auth.loggedIn)

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

    } else {
      const isOptedOut = await OneSignal.isOptedOut()

      console.log('isOptedOut', isOptedOut)

      if (isOptedOut) {
        OneSignal.setSubscription(true)
      } else {
        OneSignal.registerForPushNotifications()
      }
    }
  },
}
