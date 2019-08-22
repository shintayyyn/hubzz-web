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
      return this.$store.state.chat.messages;
    }
  },
  mounted() {
    console.log("mounted children");
    if (window.innerWidth < 768) {
      this.$store.commit("IS_MOBILE", false);
    }
  }
};
</script>