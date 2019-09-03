export default {
  getConversations(state) {
    return state.conversations
  },
  getActiveConversationId(state) {
    return state.activeConversationId
  },
  getMessages(state) {
    return state.messages
  },
  getUnreadMessages(state) {
    return state.unreadMessages
  },
}
