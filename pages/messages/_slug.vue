<template>
  <section class="w-full">
    <MessagesCenterPanel
      :messages="messages"
      @send-message="send"
      @delete-confirmation="deleteConfirmation"
      @fetch-more-messages="fetchMoreMessages"
    />
  </section>
</template>
<script>
import MessagesCenterPanel from '@/components/Messages/CenterPanel/MessagesCenterPanel'
import * as chatApi from '@/api/chat'
export default {
  components: {
    MessagesCenterPanel,
  },
  async asyncData({ app, params }) {
    const response = await chatApi.fetchActiveConversationMessages(app.$axios, 0, 0, params.slug)
    const messages = response.data.messages.sort((a, b) => a.id - b.id)
    return {
      messages
    }
  },
  beforeMount() {
    this.getNewChatRealTime()
    this.getDeleteChatRealTime()
  },
  methods: {
    async fetchMoreMessages() {
      const response = await chatApi.fetchActiveConversationMessages(this.$axios, this.messages.length, 20, this.$route.params.slug)
      const messages = response.data.messages.sort((a, b) => b.id - a.id)
      messages.forEach(message => {
        this.messages.unshift(message)
      })
    },
    async send(message) {
      let receiver_user_id = null
      this.messages[0].receiver_id === this.$auth.user.id ? receiver_user_id = this.messages[0].sender_id : receiver_user_id = this.messages[0].receiver_id
      const response = await chatApi.sendMessage(this.$axios, receiver_user_id.toString(), message)
      this.messages.push(response.data.message)
    },
    async deleteConfirmation(id) {
      if (confirm("Do you want to delete this message?")) {
        let receiver_user_id = null
        this.messages[0].receiver_id === this.$auth.user.id ? receiver_user_id = this.messages[0].sender_id : receiver_user_id = this.messages[0].receiver_id
        const response = await chatApi.deleteMessage(this.$axios, receiver_user_id, id)
        const deletedMessage = response.data.message
        let index = this.messages.findIndex(message => message.id === deletedMessage.id)
        this.messages.splice(index, 1)
        this.messages[index] = deletedMessage
      }
    },
    getNewChatRealTime() {
      this.$socket.on("new chat", newChat => {
        this.messages.push(newChat)
        console.log(newChat)

      });
    },
    getDeleteChatRealTime() {
      this.$socket.on("delete chat", deletedChat => {
        let index = this.messages.findIndex(message => message.id === deletedChat.id)
        this.messages.splice(index, 1)
        this.messages[index] = deletedChat
      })
    }
  },
  mounted() {
    // console.log(this.messages)
  },
}
</script>
<style scoped>
/* .info-panel {
  display: flex;
  width: 75%;
} */
</style>

