<template>
  <div class="flex" :class="wrapperClass">
    <transition name="fade">
        <div v-if="messageSent && !$route.name.includes('messages')" class="message-modal bg-blue-500 text-white p-4 rounded-lg font-bold text-center">Message Sent to {{ this.user.personal_detail.name }}</div>
    </transition>
    <div class="bg-white h-full w-full absolute opacity-50" v-if="messageSent"></div>
    <textarea
      v-model="message"
      class="message-box resize-none w-full p-2 text-sm focus:outline-none border-t"
      :class="inClass"
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
  props: {
    inClass: '',
    wrapperClass: '',
    user: '',
  },
  data() {
    return {
      message: ""
    };
  },
  computed:{
    messageSent(){
      return this.$store.state.chat.messageSent
    }
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
      let user_id = null;
      if(!this.$route.name.includes('messages') || !this.$route.name.includes('message')){
        user_id = this.user.id
      }
        if (this.trimmedMessage(this.message)) {
          this.$store.dispatch("chat/sendMessage", {
            user_id: user_id,
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
.message-modal{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 60;
}
@media screen and (max-width: 767px){
    .message-modal{
        min-width: 85%;
    }
}
</style>
