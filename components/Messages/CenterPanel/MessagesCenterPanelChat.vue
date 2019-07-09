<template>
  <div class="panel-chat overflow-y-auto">
    <div class="flex flex-col">
      <div v-for="item in messages_2" :key="item.id">
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
    messages_2() {
      return this.$store.state.chat.messages_2
    },
  },
  watch: {
    messages_2(value) {
      console.log('watch', value)
    }
  },
  beforeMount() {
    this.getNewChatRealTime()
  },
  methods: {
    getNewChatRealTime() {
      this.$socket.on("new chat", newChat => {
        this.$store.commit('chat/NEW_CHAT', newChat)
        // console.log('event', newChat)
      });
    },
    isReceiver(item) {
      return this.$auth.user.id === item.receiver_user_id
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
