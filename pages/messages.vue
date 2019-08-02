<template>
  <section class="messages-section border">
    <MessagesLeftPanel />
    <nuxt-child />
  </section>
</template>
<script>
import MessagesLeftPanel from '@/components/Messages/LeftPanel/MessagesLeftPanel'
import * as chatApi from '@/api/chat'
export default {
  components: {
    MessagesLeftPanel
  },
  async asyncData({ app, store, params }) {
    const response = await chatApi.fetchConversations(app.$axios, 0, 1)
    const conversations = response.data.conversations
    store.commit('chat/SET_CONVERSATIONS', response.data.conversations)
  },
  computed: {
    socketId() {
      return this.$store.state.socket_id
    },
    conversations() {
      return this.$store.state.chat.conversations
    },
  },
  watch: {
    $route(to, from) {
      if (to.params.slug) {
        this.$store.dispatch('chat/setActiveConversation', to.params.slug)
      }
    },
    socketId(value) {
      this.$store.dispatch('joinRoom', { socket_id: value, room_name: 'messageroom', })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('leaveRoom', { socket_id: this.$socket.id, room_name: 'messageroom' })
  },
  created() {
    this.$store.dispatch('chat/setActiveConversation', this.$route.params.slug)
  },
  mounted() {
    if (this.socketId) {
      this.$store.dispatch('joinRoom', { socket_id: this.socketId, room_name: 'messageroom' })
    }
    if (!this.$auth.loggedIn) {
      return this.$router.push('/')
    }
    if (this.conversations.length > 0 && !this.$route.params.slug) {
      this.goToFirstConversation()
    }
  },
  methods: {
    goToFirstConversation() {
      let conversation = this.conversations.find((conversation, index) => index === 0)
      this.$router.push(`/messages/${conversation.id}`)
    },
  }
}
</script>
<style scoped>
.messages-section {
  overflow-y: hidden;
  display: flex;
  min-height: 80vh;
  max-height: 80vh;
  /* border: 2px solid black; */
}
</style>

