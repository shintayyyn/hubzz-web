import * as chatApi from "@/api/chat"
export default {
	async initializeChatListener ({ state, commit, dispatch }) {
		this.$socket.on("newMessage", message => {
			// dispatch("setConversation")
			dispatch("fetchTotalUnreadMessages")
			let findMessage = state.messages.find(
				item => item.id == message.latest_conversation_message.id
			)
			let findConversation = state.conversations.find(
				item => item.id == message.id
			)
			let user =
				this.$auth.user.id === message.latest_conversation_message.user.id
			if (!findConversation) {
				commit("ADD_CONVERSATION", message)
				if (user && this.$router.app._route.name === "messages-new") {
					this.$router.push(`/messages/${message.id}`)
					commit("SET_ACTIVE_CONVERSATION", message.id)
				}
				// if (!user) {
				// 	commit("ADD_TOTAL_UNREAD_MESSAGES")
				// }
				// commit("ADD_UNREAD_MESSAGE", message);
			} else {
				if (!user) {
					if (!findMessage) {
						// if (findConversation.latest_conversation_message.seen_by_receiver) {
						// 	commit("ADD_TOTAL_UNREAD_MESSAGES")
						// }
						commit("ADD_MESSAGE", message)
					}
				}
			}
		})
		this.$socket.on("deleteMessage", message => {
			commit("DELETE_MESSAGE", message)
		})
	},
	async initializeUsersOnline ({ commit }) {
		this.$socket.on("presence-in", users => {
			commit("ADD_USER_ONLINE", users.user.id)
		})
		this.$socket.on("presence-out", users => {
			commit("DELETE_USER_ONLINE", users.user.id)
		})
	},

	async fetchTotalUnreadMessages ({ state, commit }, payload) {
		const response = await chatApi.getUnreadMessages(this.$axios)
		commit("GET_TOTAL_UNREAD_MESSAGES", response.data.total)
	},
	async setConversation ({ commit }) {
		const response = await chatApi.fetchConversations(this.$axios, 0, 0)
		commit("SET_CONVERSATIONS", response.data.conversations)
	},

	async fetchMoreConversation ({ state, commit }, payload) {
		const response = await chatApi.fetchConversations(
			this.$axios,
			payload.offset,
			5
		)
		commit("GET_CONVERSATIONS", response.data.conversations)
	},

	async fetchMoreMessage ({ state, commit }, payload) {
		const response = await chatApi.fetchActiveConversationMessages(
			this.$axios,
			payload.offset,
			20,
			"desc",
			payload.conversation_id
		)
		let conversation = response.data.conversations.find(
			item => item.id.toString() === state.activeConversationId
		)
		if (conversation.conversation_messages.length > 0) {
			commit("GET_MESSAGES", conversation.conversation_messages)
		}
	},

	async setActiveConversation ({ state, commit }, payload) {
		const response = await chatApi.fetchActiveConversationMessages(
			this.$axios,
			0,
			20,
			"desc",
			payload
		)
		if (response.data.conversations.length) {
			commit(
				"SET_MESSAGES",
				response.data.conversations[0].conversation_messages
			)
		}
		commit("SET_ACTIVE_CONVERSATION", payload)
	},

	async sendMessage ({ state, commit }, payload) {
		if (payload.type === "messages-new") {
			payload.user_id = state.newMessageUser.id
		} else if (payload.type.includes("messages")) {
			let foundConversation = state.conversations.find(
				conversation => conversation.id == state.activeConversationId
			)
			if (
				foundConversation.conversation_member_users[0].user.id ==
				this.$auth.user.id
			) {
				payload.user_id =
					foundConversation.conversation_member_users[1].user.id
			} else {
				payload.user_id =
					foundConversation.conversation_member_users[0].user.id
			}
		} else {
			commit("MESSAGE_SENT_TIMEOUT", true)
			setTimeout(() => {
				commit("MESSAGE_SENT_TIMEOUT", false)
			}, 1000)
		}
		const response = await chatApi.sendMessage(this.$axios, payload)
		commit("ADD_MESSAGE", response.data.conversation)
	},
	async deleteMessage ({ state, commit }, payload) {
		// let receiver_user_id = null;
		// let foundConversation = state.conversations.find(conversation => conversation.conversation_id == state.activeConversationId);
		// if (foundConversation.receiver_id == this.$auth.user.id) {
		//   receiver_user_id = foundConversation.sender_id;
		// } else {
		//   receiver_user_id = foundConversation.receiver_id;
		// }
		const response = await chatApi.deleteMessage(this.$axios, payload)
		commit("DELETE_MESSAGE", response.data.message)
	}
}
