import { BroadcastChannel } from 'broadcast-channel'

export default (ctx, inject) => {
  const loggedInBroadcastChannel = new BroadcastChannel('loggedIn')

  ctx.$loggedInBroadcastChannel = loggedInBroadcastChannel

  inject('loggedInBroadcastChannel', loggedInBroadcastChannel)

  const loggedOutBroadcastChannel = new BroadcastChannel('loggedOut')

  ctx.$loggedOutBroadcastChannel = loggedOutBroadcastChannel

  inject('loggedOutBroadcastChannel', loggedOutBroadcastChannel)
}
