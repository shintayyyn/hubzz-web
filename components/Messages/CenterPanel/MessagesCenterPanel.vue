<template>
  <div class="messages-center-panel w-full flex flex-col border-l">
    <MessagesCenterPanelTop />
    <div class="flex flex-col h-full justify-between">
      <MessagesCenterPanelChat @fetch-more-messages="$emit('fetch-more-messages')" />
      <MessagesCenterPanelForm />
    </div>
  </div>
</template>
<script>
import MessagesCenterPanelChat from '@/components/Messages/CenterPanel/MessagesCenterPanelChat'
import MessagesCenterPanelForm from '@/components/Messages/CenterPanel/MessagesCenterPanelForm'
import MessagesCenterPanelTop from '@/components/Messages/CenterPanel/MessagesCenterPanelTop'
export default {
  components: {
    MessagesCenterPanelChat,
    MessagesCenterPanelForm,
    MessagesCenterPanelTop
  },
}
</script>
<style scoped>
.messages-center-panel {
  /* float: left; */
  min-height: 80vh;
  max-height: 90vh;
  /* border: 1px solid black; */
}
</style>
