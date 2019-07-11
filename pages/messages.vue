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
      return this.$store.getters['chat/getConversations']
    }
  },
  watch: {
    $route(to, from) {
      if (to.name !== 'messages-slug') {
        return
      }

      if (to.params.slug === undefined) {
        this.goTo()
      }
      this.$store.dispatch('chat/setActiveConversation', to.params.slug)
    },
    conversations() {
      this.goTo()
    }
  },
  mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push('/')
    }
    if (this.$route.params.slug !== undefined) {
      this.$store.dispatch('chat/setActiveConversation', this.$route.params.slug)
    }
    this.goTo()
  },
  methods: {
    goTo() {
      if (
        this.$route.name === 'messages-slug' &&
        this.$route.params.slug === undefined
      ) {
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

