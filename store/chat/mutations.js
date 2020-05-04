export default {
	TOGGLE_LOADING(state, payload) {
		state.loading_messages = payload
	},
	SET_CONVERSATIONS(state, payload) {
		state.conversations = payload
	},
	SET_TOTAL_CONVERSATIONS_COUNT(state, payload) {
		state.conversations_count = payload
	},
	SET_MESSAGES(state, payload) {
		state.messages = payload.sort((a, b) => a.id - b.id)
	},
	SET_ACTIVE_CONVERSATION(state, payload) {
		state.activeConversationId = payload
	},
	SET_USERS_ONLINE(state, payload) {
		state.usersOnline = payload
	},
	SET_MESSAGE_SEEN(state, payload) {
		let findMessage = state.conversations.find(item => item.id == payload.id)
		findMessage.latest_conversation_message.seen_by_receiver = this.$moment().format()
	},
	GET_TOTAL_UNREAD_MESSAGES(state, payload) {
		state.unreadTotal = payload
	},
	REMOVE_TOTAL_UNREAD_MESSAGES(state, payload) {
		if (state.unreadTotal > 0) {
			state.unreadTotal -= 1
		}
	},
	ADD_TOTAL_UNREAD_MESSAGES(state, payload) {
		state.unreadTotal += 1
	},
	GET_CONVERSATIONS(state, payload) {
		payload.forEach(item => {
			state.conversations.push(item)
		})
	},
	GET_MESSAGES(state, payload) {
		payload.forEach(item => {
			state.messages.unshift(item)
		})
	},
	ADD_CONVERSATION(state, payload) {
		state.conversations.unshift(payload)
	},
	ADD_NEW_MESSAGE_USER(state, payload) {
		state.newMessageUser = payload
	},
	ADD_MESSAGE(state, payload) {
		console.log(payload)
		if (state.activeConversationId === payload.id.toString()) {
			state.messages.push(payload.latest_conversation_message)
		}
		let conversation = state.conversations.find(
			message => message.id == payload.id
		)
		conversation.latest_conversation_message =
			payload.latest_conversation_message
		state.conversations = state.conversations.sort(
			(a, b) =>
				new Date(b.latest_conversation_message.created_at) -
				new Date(a.latest_conversation_message.created_at)
		)
	},
	ADD_USER_ONLINE(state, payload) {
		let conversation = state.conversations.find(
			conversation => conversation.id == state.activeConversationId
		)
		if (conversation) {
			let user = conversation.conversation_member_users.find(
				member => member.id == payload
			)
			if (user) {
				user.is_online = true
				conversation.conversation_member_users.splice(
					conversation.conversation_member_users.findIndex(
						item => item.user.id == payload
					),
					1,
					user
				)
				state.conversations.splice(
					state.conversations.findIndex(
						item => item.id == state.activeConversationId
					),
					1,
					conversation
				)
			}
		}
	},
	ADD_UNREAD_MESSAGE(state, payload) {
		state.unreadMessages.push({
			user_id: this.$auth.user.id,
			conversation_id: payload.id
		})
	},
	MESSAGE_SENT_TIMEOUT(state, payload) {
		state.messageSent = payload
	},
	DELETE_UNREAD_MESSAGE(state, payload) {
		state.unreadMessages.map((item, index) => {
			if (item.conversation_id == payload) {
				state.unreadMessages.splice(index, 1)
			}
		})
	},
	DELETE_USER_ONLINE(state, payload) {
		// let index = state.usersOnline.findIndex(users => users == payload);
		// if (index >= 0) {
		//   state.usersOnline.splice(index, 1);
		// }
		let conversation = state.conversations.find(
			conversation => conversation.id == state.activeConversationId
		)
		if (conversation) {
			let user = conversation.conversation_member_users.find(
				member => member.user.id == payload
			)
			if (user) {
				user.user.is_online = false
				conversation.conversation_member_users.splice(
					conversation.conversation_member_users.findIndex(
						item => item.user.id == payload
					),
					1,
					user
				)
				state.conversations.splice(
					state.conversations.findIndex(
						item => item.id == state.activeConversationId
					),
					1,
					conversation
				)
			}
		}
	},
	DELETE_ACTIVE_CONVERSATION(state) {
		state.activeConversationId = null
	},
	DELETE_MESSAGE(state, payload) {
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
					new Date(b.latest_conversation_message.created_at) -
					new Date(a.latest_conversation_message.created_at)
			)
		}
	}
}
