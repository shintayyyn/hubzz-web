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
      this.form.receiver_user_id = parseInt(this.$route.params.slug)
      this.$axios.$post(`/api/v1/messages`, this.form).then(res => {
        console.log('response form', res)
        if (res.data.message.sender_user_id === this.$auth.user.id) {
          this.$store.commit('chat/NEW_CHAT', res.data.message)
          this.form.message = ''
        }
      })
    }
  }
}
</script>

