<template>
  <section class="messages-section">
    <MessagesLeftPanel :conversations="conversations" />
    <nuxt-child />
  </section>
</template>
<script>
import MessagesLeftPanel from '@/components/Messages/LeftPanel/MessagesLeftPanel'
export default {
  // layout: 'chat',
  components: {
    MessagesLeftPanel
  },
  computed: {
    conversations() {
      return this.$store.state.chat.conversations
    }
  },
  watch: {
    $route(to, from) {
      if (to.name !== 'messages-slug') {
        return
      }
      if (to.params.slug === undefined) {
        // this.goToFirstConversation()
      }
      this.$store.dispatch('chat/getActiveConversationMessages', to.params.slug)
    },
    conversations() {
      // this.goToFirstConversation()
    }
  },
  mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push('/')
    }
    if (!this.$store.state.chat.activeConversationId) {
      this.goToFirstConversation()
    }
    this.$store.dispatch('chat/getActiveConversationMessages', this.$route.params.slug)
  },
  methods: {
    goToFirstConversation() {
      if (this.conversations.length > 0) {
        let conversation = this.conversations.find((conversation, index) => index === 0)
        this.$router.push(`/messages/${conversation.id}`)
      }
    }
  }
}
</script>
<style scoped>
.messages-section {
  overflow-y: hidden;
  display: flex;
  /* height: 100vh; */
}
</style>

