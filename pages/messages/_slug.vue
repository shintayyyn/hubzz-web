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
  },
  created() {
    console.log('created children')
  },
  mounted() {
    console.log('mounted children')
    if (window.innerWidth < 768) {
      this.$store.commit("IS_MOBILE", false);
    }
  }
};
</script>