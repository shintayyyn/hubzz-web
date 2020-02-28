export default (ctx) => {
  console.log('ONE_SIGNAL_APP_ID', process.env.ONE_SIGNAL_APP_ID)

  const OneSignal = window.OneSignal || []

  OneSignal.push(() => {
    console.log('One Signal Initialize')
    OneSignal.init({
      appId: process.env.ONE_SIGNAL_APP_ID,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      }
    })

    // OneSignal.showNativePrompt()
  })

  OneSignal.push(() => {
    if (!OneSignal.isPushNotificationsSupported()) {
      console.log('Push Notifications Is Not Supported')

      return
    }

    console.log('Push Notifications Is Supported')

    OneSignal.on('subscriptionChange', (isSubscribed) => {
      console.log('subscriptionChange', isSubscribed)

      ctx.store.dispatch('one-signal/setOneSignalUser')
    })

    ctx.store.dispatch('one-signal/setOneSignalUser')
  })
}
