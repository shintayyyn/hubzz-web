export const state = () => ({
})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async setOneSignalUser () {
    console.log('[OneSignal] setOneSignalUser')

    // Web SDK v16 provides the SDK instance via OneSignalDeferred callback.
    // Once initialized, it is available on `window.OneSignal`.
    const OneSignal = window.OneSignal

    if (!OneSignal) {
      console.log('[OneSignal] SDK not ready yet')
      return
    }

    const getIsPushSupported = async () => {
      // OneSignal Web SDK API differs across versions; support multiple.
      if (typeof OneSignal.isPushSupported === 'function') return await OneSignal.isPushSupported()
      if (OneSignal.Notifications && typeof OneSignal.Notifications.isPushSupported === 'function') {
        return await OneSignal.Notifications.isPushSupported()
      }
      if (typeof OneSignal.isPushNotificationsSupported === 'function') {
        return !!OneSignal.isPushNotificationsSupported()
      }
      return false
    }

    const isPushSupported = await getIsPushSupported()
    console.log('[OneSignal] isPushSupported', isPushSupported, {
      isPushSupportedType: typeof OneSignal.isPushSupported,
      notificationsIsPushSupportedType: typeof OneSignal.Notifications?.isPushSupported,
      isPushNotificationsSupportedType: typeof OneSignal.isPushNotificationsSupported,
    })

    if (!isPushSupported) return

    const subscriptionId = OneSignal.User?.PushSubscription?.id || null
    const optedIn = OneSignal.User?.PushSubscription?.optedIn || false
    const token = OneSignal.User?.PushSubscription?.token || null

    console.log('[OneSignal] optedIn', optedIn)
    console.log('[OneSignal] subscriptionId', subscriptionId)
    console.log('[OneSignal] tokenExists', !!token)
    console.log('[OneSignal] loggedIn', this.$auth.loggedIn)

    // Only call backend when we actually have a subscriptionId.
    // This is the value your backend stores in `one_signal_users.one_signal_id`.
    if (subscriptionId) {
      if (this.$auth.loggedIn && optedIn) {
        await this.$axios.post('/api/v1/one-signal/login', {
          one_signal_id: subscriptionId,
        })
        console.log('[OneSignal] backend login saved')
      }

      // If the user is logged in but NOT opted-in, remove the mapping so email can be used as fallback.
      if (this.$auth.loggedIn && !optedIn) {
        await this.$axios.post('/api/v1/one-signal/logout', {
          one_signal_id: subscriptionId,
        })
        console.log('[OneSignal] backend logout saved (not opted-in)')
      }

      if (!this.$auth.loggedIn) {
        await this.$axios.post('/api/v1/one-signal/logout', {
          one_signal_id: subscriptionId,
        })
        console.log('[OneSignal] backend logout saved')
      }
    }

    // If user hasn't opted in yet, do nothing besides ensuring mapping is removed above.
  },
}
