export default (ctx) => {
  const appId = process.env.ONE_SIGNAL_APP_ID

  console.log('ONE_SIGNAL_APP_ID', appId)

  if (!appId) {
    console.log('[OneSignal] Missing ONE_SIGNAL_APP_ID')
    return
  }

  // OneSignal Web SDK v16 uses `OneSignalDeferred`
  window.OneSignalDeferred = window.OneSignalDeferred || []

  window.OneSignalDeferred.push(async function OneSignalInit (OneSignal) {
    try {
      console.log('[OneSignal] Initialize')

      // Make SDK available for other code paths (store actions, devtools)
      window.OneSignal = OneSignal

      await OneSignal.init({
        appId,
        // Helpful for local dev (push requires a secure context)
        allowLocalhostAsSecureOrigin: true,
        // Makes it easy to opt-in during testing
        notifyButton: {
          enable: true,
        },
        welcomeNotification: {
          disable: true,
        },
        // Nuxt `static/` files are served from the root
        serviceWorkerPath: '/OneSignalSDKWorker.js',
        serviceWorkerParam: { scope: '/' },
      })

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

      // Subscribe change listener (v16 User Model)
      if (OneSignal.User?.PushSubscription?.addEventListener) {
        OneSignal.User.PushSubscription.addEventListener('change', (event) => {
          console.log('[OneSignal] PushSubscription change', event)
          ctx.store.dispatch('one-signal/setOneSignalUser')
        })
      }

      // Initial sync
      ctx.store.dispatch('one-signal/setOneSignalUser')

      // Important: when the user logs in/out, the push subscription doesn't necessarily change.
      // Without watching auth state, the backend might never get the correct one_signal_id mapping.
      if (ctx.store && typeof ctx.store.watch === 'function') {
        ctx.store.watch(
          (state) => state?.auth?.loggedIn,
          (loggedIn) => {
            console.log('[OneSignal] auth.loggedIn changed', loggedIn)
            ctx.store.dispatch('one-signal/setOneSignalUser')
          }
        )
      }
    } catch (e) {
      console.log('[OneSignal] init error', e)
    }
  })
}
