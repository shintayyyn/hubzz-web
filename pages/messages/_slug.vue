<template>
  <section class="info-panel">
    <MessagesCenterPanel v-if="hasActiveConversation" />
    <!-- <MessagesRightPanel /> -->
  </section>
</template>
<script>
import MessagesCenterPanel from '@/components/Messages/CenterPanel/MessagesCenterPanel'
import MessagesRightPanel from '@/components/Messages/RightPanel/MessagesRightPanel'
export default {
  components: {
    MessagesCenterPanel,
    MessagesRightPanel,
  },
  computed: {
    hasActiveConversation() {
      if (this.$route.params.slug !== undefined) {
        return true
      }
    }
  },
  async asyncData({ app, params }) {
    const response = await app.$axios.$get(`/api/v1/messages?user_id=${params.id}`)
    const messages = response.data.messages
    return {
      messages
    }
  },
}
</script>
<style scoped>
.info-panel {
  display: flex;
  width: 75%;
}
</style>

