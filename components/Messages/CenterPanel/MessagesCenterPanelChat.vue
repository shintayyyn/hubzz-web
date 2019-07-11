<template>
  <div class="panel-chat overflow-y-auto">
    <div class="flex flex-col" ref="messagesContainer">
      <div v-for="item in messages" :key="item.id">
        <div
          class="my-1 rounded-lg text-xs px-2 py-1"
          :class="isReceiver(item) ? 'float-left bg-grey-light' : 'float-right bg-blue-light text-white'"
        >{{item.message}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    messages() {
      return this.$store.state.chat.messages
    },
  },
  beforeMount() {
    this.getNewChatRealTime()
    this.getSeenChatRealTime()
  },
  watch: {
    messages(value) {
      if (this.$refs.messagesContainer) {
        if (
          this.$refs.messagesContainer.scrollHeight -
          (500 + this.$refs.messagesContainer.offsetHeight) <=
          this.$refs.messagesContainer.scrollTop
        ) {
          this.scrollToBottom();
        } else {
          // this.backToBottomButtonActive = true;
        }
      }
      this.scrollToBottom()
    }
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      });
    },
    getNewChatRealTime() {
      this.$socket.on("new chat", newChat => {
        this.$store.commit('chat/PUSH_MESSAGE', newChat)
        this.$store.dispatch('chat/seenNewMessage', newChat.conversation_id)
      });
    },
    getSeenChatRealTime() {
      this.$socket.on("seen chat", chat => {
        this.$store.commit('chat/UPDATE_MESSAGE', chat)
      });
    },
    isReceiver(item) {
      return this.$auth.user.id === item.receiver_id
    }
  }
}
</script>
<style scoped>
.panel-chat {
  min-height: 500px;
  max-height: 500px;
}
</style>
