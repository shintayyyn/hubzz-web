export default {
  TOGGLE_LOADING (state, payload) {
    state.loading_messages = payload
  },
  SET_CONVERSATIONS (state, payload) {
    state.conversations = payload
  },
  SET_TOTAL_CONVERSATIONS_COUNT (state, payload) {
    state.conversations_count = payload
  },

  CLEAR_MESSAGES (state) {
    state.messages = []
  },

  SET_MESSAGES (state, messages) {
    state.messages = messages
      .filter((v, i, a) => a.findIndex(({ id, }) => id === v.id) === i)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  },
  SET_ACTIVE_CONVERSATION (state, payload) {
    state.activeConversationId = payload
  },
  SET_USERS_ONLINE (state, payload) {
    state.usersOnline = payload
  },
  SET_MESSAGE_SEEN (state, payload) {
    const conversationIndex = state.conversations.findIndex(item => item.id == payload.id)
    if (conversationIndex > -1) {
      const conversation = state.conversations[conversationIndex]
      conversation.latest_conversation_message.seen_by_users.push({ id: this.$auth.user.id })
      state.conversations.splice(conversationIndex, 1, conversation)
    }
  },

  GET_CONVERSATIONS (state, payload) {
    payload.forEach(item => {
      state.conversations.push(item)
    })
  },
  GET_MESSAGES (state, messages) {
    state.messages = [
      ...state.messages,
      ...messages,
    ]
      .filter((v, i, a) => a.findIndex(({ id, }) => id === v.id) === i)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  },
  ADD_CONVERSATION (state, payload) {
    state.conversations.push(payload)

    state.conversations = state.conversations
      .filter((v, i, a) => a.findIndex(({ id, }) => id === v.id) === i)
      .sort((a, b) => {
        return new Date(b.latest_conversation_message.created_at) - new Date(a.latest_conversation_message.created_at)
      })
  },
  ADD_NEW_MESSAGE_USER (state, payload) {
    state.newMessageUser = payload
  },
  
  ADD_MESSAGE (state, conversation) {
    console.log('ADD_MESSAGE', conversation)
    
    if (state.activeConversationId && state.activeConversationId.toString() === conversation.id.toString()) {
      state.messages.push(conversation.latest_conversation_message)

      state.messages = state.messages
        .filter((v, i, a) => a.findIndex(({ id, }) => id === v.id) === i)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }
    
    let alreadyConversation = state.conversations.find(({ id, }) => id === conversation.id)

    if (alreadyConversation) {
      alreadyConversation.latest_conversation_message = conversation.latest_conversation_message
    } {
      state.conversations.push(conversation)
    }

    state.conversations = state.conversations
      .filter((v, i, a) => a.findIndex(({ id, }) => id === v.id) === i)
      .sort((a, b) => {
        return new Date(b.latest_conversation_message.created_at) - new Date(a.latest_conversation_message.created_at)
      })
  },
  
  USER_PRESENCE_HANDLER (state, payload) {
    console.log('USER_PRESENCE_HANDLER', payload)

    const newConversations = [...state.conversations]

    if (['Super Admin', 'Admin'].includes(payload.domain)) {
      newConversations.forEach((conversation) => {
        if (conversation.type === 'Admin') {
          conversation.admin_users.forEach((user) => {
            if (user.id === payload.user_id) {
              user.is_online = payload.online
            }
          })
        }
      })
    }

    if (payload.domain === 'Practice') {
      newConversations.forEach((conversation) => {
        if (conversation.type === 'Private' && conversation.practice) {
          conversation.practice.users.forEach((user) => {
            if (user.id === payload.user_id) {
              user.is_online = payload.online
            }
          })
        }
      })
    }

    if (payload.domain === 'Locum') {
      newConversations.forEach((conversation) => {
        if (conversation.type === 'Private' && conversation.locum_user && conversation.locum_user.id === payload.user_id) {
          conversation.locum_user.is_online = payload.online
        }
      })
    }

    state.conversations = newConversations

    // const conversationIdex = state.conversations.findIndex(({ id, }) => id == state.activeConversationId)

    // if (conversationIdex > -1) {
    //   const conversation = state.conversations[conversationIdex]

    //   const conversationMemberUserIndex = conversation.conversation_member_users.findIndex(({ id, }) => id == payload.user_id)

    //   if (conversationMemberUserIndex > -1) {
    //     const user = conversation.conversation_member_users[conversationMemberUserIndex]

    //     user.is_online = payload.online

    //     conversation.conversation_member_users.splice(conversationMemberUserIndex, 1, user)

    //     state.conversations.splice(conversationIdex, 1, conversation)
    //   }
    // }
  },

  MESSAGE_SENT_TIMEOUT (state, payload) {
    state.messageSent = payload
  },
  
  DELETE_ACTIVE_CONVERSATION (state) {
    state.activeConversationId = null
  },

  DELETE_MESSAGE (state, payload) {
    let index = state.messages.findIndex(message => message.id == payload.id)

    let lastIndex = state.messages.length - 1

    if (index >= 0) {
      state.messages.splice(index, 1, payload)
    }

    if (index == lastIndex) {
      let conversation = state.conversations.find(
        item => item.latest_conversation_message.id == payload.id
      )

      conversation.latest_conversation_message = state.messages[index]

      state.conversations = state.conversations.sort(
        (a, b) =>
          new Date(b.latest_conversation_message.created_at)
					- new Date(a.latest_conversation_message.created_at)
      )
    }
  },
}
