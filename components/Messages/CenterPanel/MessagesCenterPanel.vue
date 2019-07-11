<template>
  <div class="messages-center-panel">
    <MessagesCenterPanelChat />
    <MessagesCenterPanelForm />
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
}
</script>
<style scoped>
.messages-center-panel {
  padding-left: 50px;
  width: 70%;
  float: left;
  /* border: 1px solid black; */
}
.chat-message-lists {
  overflow-y: auto;
  height: 500px;
}
</style>
