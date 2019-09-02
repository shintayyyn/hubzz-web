export default {
  TOGGLE_LOADING(state, payload) {
    state.loading_messages = payload;
  },
  SET_CONVERSATIONS(state, payload) {
    state.conversations = payload;
  },
  FETCH_CONVERSATIONS(state, payload) {
    payload.forEach(item => {
      state.conversations.push(item);
    });
  },
  SET_USERS_ONLINE(state, payload) {
    state.users_online = payload;
  },
  ADD_USER_ONLINE(state, payload) {
    state.users_online.push(payload);
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
    let index = state.users_online.findIndex(users => users == payload);
    if (index >= 0) {
      state.users_online.splice(index, 1);
    }
  },
  FETCH_MESSAGES(state, payload) {
    payload.forEach(item => {
      state.messages.unshift(item);
    });
  },
  SET_ACTIVE_CONVERSATION(state, payload) {
    state.activeConversationId = payload;
  },
  ADD_CONVERSATION(state, payload) {
    state.conversations.unshift(payload);
  },
  SET_MESSAGES(state, payload) {
    state.messages = payload.sort((a, b) => a.id - b.id);
  },
  ADD_MESSAGE(state, payload) {
    if (state.activeConversationId == payload.conversation_id) {
      state.messages.push(payload);
    }
    let index = state.conversations.findIndex(conversations => conversations.conversation_id == payload.conversation_id);
    state.conversations[index].created_at = payload.created_at;
    state.conversations[index].message = payload.message;
    state.conversations[index].sender_id = payload.sender_id;
    state.conversations[index].receiver_id = payload.receiver_id;
    state.conversations[index].sender_first_name = payload.sender_first_name;
    state.conversations[index].receiver_first_name = payload.receiver_first_name;
    state.conversations[index].receiver_last_name = payload.receiver_last_name;
    state.conversations[index].sender_last_name = payload.sender_last_name;
    state.conversations = state.conversations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  DELETE_MESSAGE(state, payload) {
    let index = state.messages.findIndex(message => message.id == payload.id);
    if (index >= 0) {
      state.messages.splice(index, 1, payload);
    }
  }
};
