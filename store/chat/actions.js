import * as chatApi from "@/api/chat"
export default {
  async initializeChatListener ({ state, commit, dispatch, }) {
    this.$socket.on("newMessage", conversation => {
      let findMessage = state.messages.find(item => item.id == conversation.latest_conversation_message_id)

      let findConversation = state.conversations.find(item => item.id == conversation.id)

      let authUserIsTheSender = this.$auth.user.id === conversation.latest_conversation_message.user.id

      if (!findConversation) {
        commit("ADD_CONVERSATION", conversation)

        if (
          authUserIsTheSender
          && (
            this.$router.app._route.name === "messages-create"
            || this.$router.app._route.name === "messages-create-userId"
          )
        ) {
          this.$router.push(`/messages/${conversation.id}`)
          commit("SET_ACTIVE_CONVERSATION", conversation.id)
        }
      } else {
        if (!authUserIsTheSender) {
          if (!findMessage) {
            commit("ADD_MESSAGE", conversation)
          }
        } else if (authUserIsTheSender) {
          if (!findMessage) {
            commit("ADD_MESSAGE", conversation)
          }
        }
      }
    })

    this.$socket.on("deleteMessage", message => {
      commit("DELETE_MESSAGE", message)
    })
  },
  async initializeUsersOnline ({ commit, }) {
    this.$socket.on("presence-in", (payload) => {
      const {
        user_id: userId,
      } = payload

      commit("ADD_USER_ONLINE", userId)
    })

    this.$socket.on("presence-out", (payload) => {
      const {
        user_id: userId,
      } = payload

      commit("DELETE_USER_ONLINE", userId)
    })
  },

  async setConversation ({ commit, }) {
    const response = await chatApi.fetchConversations(this.$axios, 0, 0)
    commit("SET_CONVERSATIONS", response.data.conversations)
  },

  async fetchMoreConversation ({ commit, }, payload) {
    const response = await chatApi.fetchConversations(
      this.$axios,
      payload.offset,
      5
    )
    commit("GET_CONVERSATIONS", response.data.conversations)
  },

  async fetchMoreMessage ({ state, commit, }, payload) {
    const response = await chatApi.fetchActiveConversationMessages(
      this.$axios,
      payload.offset,
      20,
      "desc",
      payload.conversation_id
    )

    let conversation = response.data.conversation

    if (conversation.conversation_messages.length > 0) {
      commit("GET_MESSAGES", conversation.conversation_messages)
    }
  },

  async setActiveConversation ({ commit, }, payload) {
    const response = await chatApi.fetchActiveConversationMessages(
      this.$axios,
      0,
      20,
      "desc",
      payload
    )
    if (response.data.conversation) {
      commit(
        "SET_MESSAGES",
        response.data.conversation.conversation_messages
      )
    }
    commit("SET_ACTIVE_CONVERSATION", payload)
  },

  async sendMessage ({ state, commit, }, payload) {
    console.log('payload', payload)

    if (!payload.user_id) {
      if (payload.type === "messages-create") {
        payload.user_id = state.newMessageUser.id
      } else if (payload.type.includes("messages")) {
        let foundConversation = state.conversations.find(
          conversation => conversation.id == state.activeConversationId
        )

        if (foundConversation.conversation_member_users[0].id == this.$auth.user.id
        ) {
          payload.user_id = foundConversation.conversation_member_users[1].id
        } else {
          payload.user_id = foundConversation.conversation_member_users[0].id
        }
      } 
    }

    try {
      const response = await this.$axios.post(`/api/v1/conversations`, {
        user_id: payload.user_id,
        message: payload.message,
      })
  
      if (payload.user_id) {
        commit("MESSAGE_SENT_TIMEOUT", true)
        setTimeout(() => {
          commit("MESSAGE_SENT_TIMEOUT", false)
        }, 1000)
      }
  
      const conversation = response.data.data.conversation
  
      let authUserIsTheSender = this.$auth.user.id === conversation.latest_conversation_message.user.id
  
      if (
        authUserIsTheSender
        && (
          this.$router.app._route.name === "messages-create"
          || this.$router.app._route.name === "messages-create-userId"
        )
      ) {
        commit('CLEAR_MESSAGES')
        this.$router.push(`/messages/${conversation.id}`)
        commit("SET_ACTIVE_CONVERSATION", conversation.id)
      }
      
      commit("ADD_MESSAGE", conversation)
    } catch (err) {
      console.log("err", err.response || err)

      let message = null

      if (err.response) {
        if (err.response.status === 400 && err.response.data.error_messages) {
          this.formError = err.response.data.error_messages
        } else {
          message = err.response.data.message
        }
      } else if (err.request) {
        message = "Something went wrong!"
      } else {
        message = err.message
      }

      if (message) {
        commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${message}`,],
        }, { root: true, })
      }
    }
  },
  async deleteMessage ({ commit, }, payload) {
    // let receiver_user_id = null;
    // let foundConversation = state.conversations.find(conversation => conversation.conversation_id == state.activeConversationId);
    // if (foundConversation.receiver_id == this.$auth.user.id) {
    //   receiver_user_id = foundConversation.sender_id;
    // } else {
    //   receiver_user_id = foundConversation.receiver_id;
    // }
    const response = await chatApi.deleteMessage(this.$axios, payload)
    commit("DELETE_MESSAGE", response.data.message)
  },
}
