<template>
  <div>
    <input
      v-model="form.message"
      class="border-2 focus:border-yellow focus:outline-none p-4 font-bold text-xs w-full text-right"
      type="text"
      @keydown.enter="send"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        receiver_user_id: '',
        message: ''
      },

    }
  },
  methods: {
    send() {
      if (!this.form.message) {
        return
      }
      let activeConversation = this.$store.state.chat.conversations.find(item => item.id === parseInt(this.$store.state.chat.activeConversationId))

      if (activeConversation.receiver_id === this.$auth.user.id) {
        this.form.receiver_user_id = activeConversation.sender_id
      } else {
        this.form.receiver_user_id = activeConversation.receiver_id
      }
      this.$axios.$post(`/api/v1/messages`, this.form).then(res => {
        if (res.data.message.sender_id === this.$auth.user.id) {
          this.$store.commit('chat/PUSH_MESSAGE', res.data.message)
          this.form.message = ''
          this.form.receiver_user_id = ''
        }
      })
    }
  }
}
</script>

