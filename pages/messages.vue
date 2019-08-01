<template>
  <section class="messages-section border">
    <MessagesLeftPanel :conversations="conversations" />
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
  async asyncData({ app }) {
    const response = await chatApi.fetchConversations(app.$axios, 0, 1)
    const conversations = response.data.conversations
    return {
      conversations
    }
  },
  data() {
    return {
    }
  },
  watch: {
    $route(to, from) {
      // this.fetchActiveConversationMessages(to.params.slug)
    },
  },
  mounted() {
    if (!this.$auth.loggedIn) {
      return this.$router.push('/')
    }
    if (this.conversations.length > 0 && !this.$route.params.slug) {
      this.goToFirstConversation()
    }
    // if (this.$route.params.slug) {
    //   this.fetchActiveConversationMessages(this.$route.params.slug)
    // }
  },
  methods: {
    goToFirstConversation() {
      let conversation = this.conversations.find((conversation, index) => index === 0)
      this.$router.push(`/messages/${conversation.id}`)
    },
    // async fetchActiveConversationMessages() {
    //   const response = await chatApi.fetchActiveConversationMessages(this.$axios, 0, 1, this.$route.params.slug)
    //   const messages = response.data.messages
    //   return {
    //     messages
    //   }
    // }
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

