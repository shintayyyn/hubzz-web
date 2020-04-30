export default function ({ $axios, app }) {
  $axios.onResponseError(err => {
    if(err.response && err.response.status === 401) {
      app.$auth.logout().finally(() => {
        app.$auth.$storage.setUniversal("_token.local", "")
        if (app.$loggedOutBroadcastChannel) {
          app.$loggedOutBroadcastChannel.postMessage()
        }
      })
    }
  })
}
