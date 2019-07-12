export const state = () => ({
    conversations: [],
    activeConversationId: null,
    loadingMessages: false,
    messages: [],
})

export const mutations = {
    SET_CONVERSATIONS(state, payload) {
        state.conversations = payload
    },
    SET_ACTIVE_CONVERSATION_ID(state, payload) {
        state.messages = []

        state.activeConversationId = payload
    },
    REMOVE_MESSAGES(state, payload) {
        state.messages = []
    },
    LOADING_MESSSAGES(state, payload) {
        state.loadingMessages = true
    },
    END_LOADING_MESSSAGES(state, payload) {
        state.loadingMessages = false
    },
    UNSHIFT_MESSAGE(state, payload) {
        const messageExists = state.messages.find(item => {
            return item.id == payload.id
        })
        if (!messageExists) {
            state.messages.unshift(payload)
        }
    },
    PUSH_MESSAGE(state, payload) {
        const messageExists = state.messages.find(item => {
            return item.id == payload.id
        })
        if (!messageExists) {
            state.messages.push(payload)
        }
    },
    UPDATE_MESSAGE(state, payload) {
        const index = state.messages.findIndex(item => item.id === payload.id)
        state.messages.splice(index, 1)
        state.messages[index] = payload
        console.log(state.messages)
    }
}

export const actions = {
    fetchConversations({ state, commit }) {
        this.$axios.$get(`/api/v1/conversations`).then(res => {
            commit('SET_CONVERSATIONS', res.data.conversations)
        })
    },
    getActiveConversationMessages({ state, commit }, conversationId) {
        commit('REMOVE_MESSAGES')
        commit('LOADING_MESSSAGES')
        commit('SET_ACTIVE_CONVERSATION_ID', conversationId)
        this.$axios.$get(`/api/v1/conversations/${conversationId}`).then(res => {
            if (res.data.messages.length > 0) {
                res.data.messages.forEach(message => {
                    commit('UNSHIFT_MESSAGE', message)
                })
            }
            commit('END_LOADING_MESSSAGES')
        })
    },
    seenNewMessage({ state, commit }, conversationId) {
        this.$axios.$put(`/api/v1/seen-message`, { conversation_id: conversationId }).then(res => {
            console.log(res)
        })
    }
}

export const getters = {
    getConversations (state) {
        return state.conversations
    },
}