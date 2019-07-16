<template>
  <div class="messages-center-panel">
    <MessagesCenterPanelChat
      :messages="messages"
      @delete-confirmation="$emit('delete-confirmation', $event)"
      @fetch-more-messages="$emit('fetch-more-messages')"
    />
    <MessagesCenterPanelForm @send-message="$emit('send-message', $event)" />
  </div>
</template>
<script>
import MessagesCenterPanelChat from '@/components/Messages/CenterPanel/MessagesCenterPanelChat'
import MessagesCenterPanelForm from '@/components/Messages/CenterPanel/MessagesCenterPanelForm'
export default {
  components: {
    MessagesCenterPanelChat,
    MessagesCenterPanelForm,
  },
  props: ['messages']
}
</script>
<style scoped>
.messages-center-panel {
  padding-left: 50px;
  width: 70%;
  float: left;
  height: 100vh;
  /* border: 1px solid black; */
}
</style>
