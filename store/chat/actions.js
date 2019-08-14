import * as chatApi from '@/api/chat'
export default {
    async initializeChatListener({ state, commit, dispatch }) {
        this.$socket.on('newConversation', (conversation) => {
            if (!state.conversations.find(item => item.id == conversation.id)) {
                commit('ADD_CONVERSATION', conversation)
            }
        })
        this.$socket.on('deleteConversation', (conversation) => {
            if (state.conversations.find(item => item.id == conversation.id)) {
                commit('DELETE_CONVERSATION', conversation.id)
            }
        })
        this.$socket.on('newMessage', (message) => {
            if (!state.messages.find(data => data.id == message.id)) {
                commit('ADD_MESSAGE', message)
            }
        })
        this.$socket.on('deleteMessage', (message) => {
            commit('DELETE_MESSAGE', message)
        })
        // this.$socket.on(`presence-in`, ({ user, online }) => {
        //     console.log(user)
        //     console.log('isOnline:', online)
        //     // const username = user.username
        //     // if (online) {
        //     //   commit('addOnlineUsername', { username })
        //     // } else {
        //     //   commit('removeOnlineUsername', { username })
        //     // }
        // })
    },
    async setActiveConversation({ state, commit }, payload) {
        const response = await chatApi.fetchActiveConversationMessages(this.$axios, 0, 20, 'desc', payload)
        commit('SET_ACTIVE_CONVERSATION', payload)
        commit('SET_MESSAGES', response.data.messages)
    },
    async sendMessage({ state, commit }, payload) {
        let receiver_user_id = null
        let foundConversation = state.conversations.find(conversation => conversation.id == state.activeConversationId)
        if (foundConversation.receiver_id == this.$auth.user.id) {
            receiver_user_id = foundConversation.sender_id
        } else {
            receiver_user_id = foundConversation.receiver_id
        }
        payload.receiver_user_id = receiver_user_id.toString()
        const response = await chatApi.sendMessage(this.$axios, payload)
        if (!state.messages.find(message => message.id === response.data.message.id)) {
            commit('ADD_MESSAGE', response.data.message)
        }
    },
    async deleteMessage({ state, commit }, payload) {
        let receiver_user_id = null
        let foundConversation = state.conversations.find(conversation => conversation.id == state.activeConversationId)
        if (foundConversation.receiver_id == this.$auth.user.id) {
            receiver_user_id = foundConversation.sender_id
        } else {
            receiver_user_id = foundConversation.receiver_id
        }
        const response = await chatApi.deleteMessage(this.$axios, receiver_user_id.toString(), payload)
        commit('DELETE_MESSAGE', response.data.message)
    }
}