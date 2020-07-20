<template>
  <section class="flex w-full">
    <MessagesCenterPanel />
  </section>
</template>

<script>
import MessagesCenterPanel from "@/components/Messages/CenterPanel/MessagesCenterPanel"
export default {
  components: {
    MessagesCenterPanel,
  },

  computed: {
    conversations () {
      return this.$store.state.chat.conversations
    },
  },
  mounted () {
    if (window.innerWidth > 768) {
      this.$store.commit("IS_MOBILE", true)
    } else {
      this.$store.dispatch(
        "chat/setActiveConversation",
        this.$route.params.slug
      )
    }
  },
}
</script>
