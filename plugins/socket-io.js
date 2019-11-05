import io from 'socket.io-client'

export default (ctx, inject) => {
  const API_URL = process.env.API_URL

  console.log('API_URL', API_URL)

  const socket = io(API_URL, {
    transports: ['websocket']
  })

  socket.on('connect', () => {
    console.log('Socket ID:', socket.id)
    ctx.store.commit('SET_SOCKET', socket.id)

    // api restore
    ctx.store.commit("SET_NOTIFICATION", {
      enabled: false,
      status: '',
      text: [],
      closable: false,
    });
  })

  socket.on('connect_error', reason => {
    ctx.store.commit("SET_NOTIFICATION", {
      enabled: true,
      status: "danger",
      text: ['Server offline'],
      closable: true
    });
  })

  socket.on('disconnect', reason => {
    console.log('Socket Disconnected')
    console.log('Reason:', reason)

    if (reason === 'io server disconnect') {
      socket.connect()
    }
    // api shut down
    if (reason === 'transport close') {
      ctx.store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: ['Server shut down'],
        closable: true
      });
    }
  })

  ctx.$socket = socket
  inject('socket', socket)
  ctx.store.dispatch('socket/init')
  ctx.store.dispatch('jobs/initializeJobListener', ctx)
  ctx.store.dispatch('chat/initializeChatListener')
  ctx.store.dispatch('chat/initializeUsersOnline')
}
