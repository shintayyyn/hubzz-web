<template>
  <section class="flex w-full">
    <MessagesCenterPanel />
  </section>
</template>
<script>
import MessagesCenterPanel from "@/components/Messages/CenterPanel/MessagesCenterPanel";
import * as chatApi from "@/api/chat";
export default {
  components: {
    MessagesCenterPanel
  },

  computed: {
    messages() {
      console.log(window.innerWidth);
      return this.$store.state.chat.messages;
    }
  }
};
</script>