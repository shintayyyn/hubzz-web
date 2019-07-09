export const state = () => ({
    messages: [],
    messages_2: []
})

export const mutations = {
    SET_CONVERSATIONS(state, payload) {
        state.messages = payload
    },
    SET_MESSAGES_2(state, payload) {
        state.messages_2 = payload
    },
    NEW_CHAT(state, payload) {
        state.messages_2.push(payload)
    }
}

export const actions = {
    getConversations({commit}) {
        this.$axios.$get(`/api/v1/messages`).then(res => {
            commit('SET_CONVERSATIONS', res.data.messages)
        })
    },
    setActiveConversation({ commit }, conversationId) {
        console.log('settings messages')
        this.$axios.$get(`/api/v1/messages?user_id=${conversationId}`).then(res => {
            commit('SET_MESSAGES_2', res.data.messages)
        })
    }
}

export const getters = {
    getConversations (state) {
        let conversations = []
        state.messages.forEach(message => {
            if (conversations.length === 0) {
                let conversation = {
                    id: message.receiver_user_id,
                    personal_detail: message.receiver.personal_detail,
                    messages: [message]
                }
                conversations.push(conversation)
            } 
            else if (conversations.length > 0) {
                if (conversations.map(conversation => conversation.id).includes(message.receiver_user_id)) {
                    conversations.find(conversation => conversation.id === message.receiver_user_id).messages.push(message)
                }
                else if (conversations.map(conversation => conversation.id).includes(message.sender_user_id)) {
                    conversations.find(conversation => conversation.id === message.sender_user_id).messages.push(message)
                }
                else {
                    let conversation = {
                        id: message.receiver_user_id,
                        personal_detail: message.receiver.personal_detail,
                        messages: [message]
                    }
                    conversations.push(conversation)
                }
            } 
        })
        console.log(conversations)
        return conversations
        
    },
}