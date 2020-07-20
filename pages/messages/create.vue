<template>
  <section class="flex w-full">
    <MessagesCenterPanelNewChat />
  </section>
</template>

<script>
import MessagesCenterPanelNewChat from "@/components/Messages/CenterPanel/MessagesCenterPanelNewChat"

export default {
  components: {
    MessagesCenterPanelNewChat,
  },

  mounted () {
    if (window.innerWidth < 768) {
      this.$store.commit("IS_MOBILE", false)
    }
  },

  created () {
    this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION")
  },
}
</script>
