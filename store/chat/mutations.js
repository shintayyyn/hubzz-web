export default {
    TOGGLE_LOADING(state, payload) {
        state.loading_messages = payload
    },
    SET_CONVERSATIONS(state, payload) {
        state.conversations = payload
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