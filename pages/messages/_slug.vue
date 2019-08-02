<template>
  <section class="flex w-full">
    <MessagesCenterPanel @fetch-more-messages="fetchMoreMessages" />
  </section>
</template>
<script>
import MessagesCenterPanel from '@/components/Messages/CenterPanel/MessagesCenterPanel'
import * as chatApi from '@/api/chat'
export default {
  components: {
    MessagesCenterPanel,
  },
  computed: {
    messages() {
      return this.$store.state.chat.messages
    }
  },
  methods: {
    async fetchMoreMessages() {
      const response = await chatApi.fetchActiveConversationMessages(this.$axios, this.messages.length, 20, this.$route.params.slug)
      const messages = response.data.messages.sort((a, b) => b.id - a.id)
      messages.forEach(message => {
        this.messages.unshift(message)
      })
    },
  },
}
</script>
<style scoped>
/* .info-panel {
  display: flex;
  width: 75%;
} */
</style>

