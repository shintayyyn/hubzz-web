export default {
  TOGGLE_LOADING(state, payload) {
    state.loading_messages = payload
  },
  SET_CONVERSATIONS(state, payload) {
    state.conversations = payload
  },
  FETCH_CONVERSATIONS(state, payload) {
    payload.forEach(item => {
      state.conversations.push(item)
    })
  },
  SET_USERS_ONLINE(state, payload) {
    state.users_online = payload
  },
  ADD_USER_ONLINE(state, payload) {
    state.users_online.push(payload)
  },
  DELETE_USER_ONLINE(state, payload) {
    let index = state.users_online.findIndex(users => users == payload)
    if (index >= 0) {
      state.users_online.splice(index, 1)
    }
  },
  FETCH_MESSAGES(state, payload) {
    payload.forEach(item => {
      state.messages.unshift(item)
    })
  },
  SET_ACTIVE_CONVERSATION(state, payload) {
    state.activeConversationId = payload
  },
  ADD_CONVERSATION(state, payload) {
    state.conversations.unshift(payload)
  },
  SET_MESSAGES(state, payload) {
    state.messages = payload.sort((a, b) => a.id - b.id);
  },
  ADD_MESSAGE(state, payload) {
    state.messages.push(payload)
  },

  DELETE_MESSAGE(state, payload) {
    let index = state.messages.findIndex(message => message.id == payload.id)
    if (index >= 0) {
      state.messages.splice(index, 1, payload)
    }
  }
}
