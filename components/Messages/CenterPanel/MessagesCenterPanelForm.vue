<template>
  <div class="relative flex">
    <!-- <input
      v-model="message"
      class="focus:outline-none p-4 font-bold text-xs w-full text-right"
      type="text"
      @keydown.enter="send"
    />-->
    <textarea
      v-model="message"
      class="message-box w-full p-4 text-sm align-middle focus:outline-none"
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
      message: ''
    }
  },
  methods: {
    send() {
      if (!this.message) {
        return
      }
      this.$store.dispatch('chat/sendMessage', this.message)
      this.message = ''
    }
  }
}
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
