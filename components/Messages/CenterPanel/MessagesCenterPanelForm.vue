<template>
  <div v-if="$route.params.slug !== 'new'" class="flex">
    <textarea
      v-model="message"
      class="message-box resize-none w-full p-4 text-sm focus:outline-none border-t"
      placeholder="Type your message here"
      @keydown.enter="send"
    ></textarea>
    <button class="px-8 bg-blue-light text-white" @click="send">Send</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: ""
    };
  },
  methods: {
    send() {
      if (!this.message) {
      } else {
        this.$store.dispatch("chat/sendMessage", {
          receiver_user_id: null,
          message: this.message
        });
        this.message = "";
      }
    }
  }
};
</script>

<style>
.message-box::-webkit-scrollbar {
  width: 8px;
}
.message-box::-webkit-scrollbar-thumb {
  background: #ccc;
}
.message-box::-webkit-scrollbar-track {
  background: #eee;
}
</style>
