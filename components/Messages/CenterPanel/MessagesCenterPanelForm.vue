<template>
  <div class="flex">
    <textarea
      v-model="message"
      class="message-box resize-none w-full p-2 text-sm focus:outline-none border-t"
      placeholder="Type your message here"
      @keydown.enter.exact.prevent
      @keyup.enter.exact="send"
      @keydown.enter.shift.exact="newline"
    ></textarea>
    <button :disabled="trimmedMessage(message) == ''" :class="trimmedMessage(message) == '' ? 'cursor-not-allowed bg-gray-500' : 'bg-blue-500 hover:bg-blue-600 '" class="px-8 text-white focus:outline-none" @click="send">Send</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: ""
    };
  },
  watch:{
    message(value){
      value = this.trimmedMessage(value)
    }
  },
  methods: {
    newline() {
      this.message = `${this.message}`;
    },
    trimmedMessage(message){
      return message.replace(/^\s*/, '').replace(/\s*$/, '')
    },
    send(e) {
      if (this.trimmedMessage(this.message)) {
        this.$store.dispatch("chat/sendMessage", {
          user_id: null,
          message: this.message,
          type: this.$route.name
        });
        this.message = "";
        e.preventDefault();
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
