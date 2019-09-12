<template>
  <div class="relative w-full flex flex-col" v-if="$route.name === 'messages-slug'">
    <MessagesCenterPanelTop v-if="$store.state.chat.activeConversationId" />
    <div class="flex flex-col h-full justify-between">
      <MessagesCenterPanelChat />
      <MessagesCenterPanelForm />
    </div>
  </div>
</template>
<script>
import MessagesCenterPanelChat from "@/components/Messages/CenterPanel/MessagesCenterPanelChat";
import MessagesCenterPanelForm from "@/components/Messages/CenterPanel/MessagesCenterPanelForm";
import MessagesCenterPanelTop from "@/components/Messages/CenterPanel/MessagesCenterPanelTop";
export default {
  components: {
    MessagesCenterPanelChat,
    MessagesCenterPanelForm,
    MessagesCenterPanelTop
  }
};
</script>