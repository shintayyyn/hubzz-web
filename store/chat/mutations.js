export default {
  TOGGLE_LOADING(state, payload) {
    state.loading_messages = payload;
  },
  SET_CONVERSATIONS(state, payload) {
    state.conversations = payload;
  },
  SET_MESSAGES(state, payload) {
    state.messages = payload.sort((a, b) => a.id - b.id);
  },
  SET_ACTIVE_CONVERSATION(state, payload) {
    state.activeConversationId = payload;
  },
  SET_USERS_ONLINE(state, payload) {
    state.usersOnline = payload;
  },
  GET_CONVERSATIONS(state, payload) {
    payload.forEach(item => {
      state.conversations.push(item);
    });
  },
  GET_MESSAGES(state, payload) {
    payload.forEach(item => {
      state.messages.unshift(item);
    });
  },
  ADD_CONVERSATION(state, payload) {
    state.conversations.unshift(payload);
  },
  ADD_NEW_MESSAGE_USER(state, payload) {
    state.newMessageUser = payload
  },
  ADD_MESSAGE(state, payload) {
    if (state.activeConversationId === payload.id.toString()) {
      state.messages.push(payload.latest_conversation_message);
    }
    let conversation = state.conversations.find(message => message.id == payload.id)
    conversation.latest_conversation_message = payload.latest_conversation_message
    state.conversations = state.conversations.sort((a, b) =>
      new Date(b.latest_conversation_message.created_at) - new Date(a.latest_conversation_message.created_at)
    );
  },
  ADD_USER_ONLINE(state, payload) {
    state.usersOnline.push(payload);
  },
  ADD_UNREAD_MESSAGE(state, payload) {
    !state.unreadMessages.includes(payload) ? state.unreadMessages.push(payload) : '';
  },
  DELETE_UNREAD_MESSAGE(state, payload) {
    let index = state.unreadMessages.findIndex(
      message_id => message_id === payload
    );
    state.unreadMessages.splice(index, 1);
  },
  DELETE_USER_ONLINE(state, payload) {
    let index = state.usersOnline.findIndex(users => users == payload);
    if (index >= 0) {
      state.usersOnline.splice(index, 1);
    }
  },
  DELETE_ACTIVE_CONVERSATION(state) {
    state.activeConversationId = null
  },
  DELETE_MESSAGE(state, payload) {
    let index = state.messages.findIndex(message => message.id == payload.id);
    if (index >= 0) {
      state.messages.splice(index, 1, payload);
    }
  }
};
