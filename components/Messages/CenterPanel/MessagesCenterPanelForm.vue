<template>
  <div class="message-form-container">
    <input
      v-model="message"
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
      message: ''

    }
  },
  methods: {
    send() {
      if (!this.message) {
        return
      }
      this.$emit('send-message', this.message)
      this.message = ''
    }
  }
}
</script>
<style scoped>
.message-form-container {
  position: relative;
}
</style>

