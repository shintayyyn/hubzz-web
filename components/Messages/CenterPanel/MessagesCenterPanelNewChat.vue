<template v-if="$route.name === 'messages-new'">
  <div class="relative h-full w-full flex flex-col justify-between overflow-y-hidden">
    <MessagesCenterPanelTop v-if="createMessage" class="mt-10 md:mt-0" />
    <div class="h-full px-4 md:px-20 md:pt-20">
      <div v-if="!createMessage">
        <div class="md:absolute top-0 left-0 md:relative w-full py-4 flex items-center mt-12">
          <button
            class="flex mr-4 items-center font-bold focus:outline-none md:hidden"
            @click="goBack()"
          >
            <svgicon name="left-arrow" height="20" width="20" />
          </button>
          <span class="font-bold text-lg">Create Message</span>
        </div>
        <AppAutoComplete
          v-model="search_user"
          :name="'search_user'"
          :label="'Send message to'"
          :placeholder="`Search for ${$auth.user.domain === 'Practice' ? 'Locum' : 'Practice'}`"
          :keyword="'practices'"
          :url="'api/v1/conversations/search-users'"
          @newConversation="newConversation"
        />
      </div>
    </div>
    <MessagesCenterPanelForm v-if="createMessage" />
  </div>
</template>

<script>
import MessagesCenterPanelTop from "@/components/Messages/CenterPanel/MessagesCenterPanelTop";
import MessagesCenterPanelForm from "@/components/Messages/CenterPanel/MessagesCenterPanelForm";
import AppAutoComplete from "~/components/Base/AppAutoComplete";
import AppAvatar from "~/components/Base/AppAvatar";
export default {
  components: {
    AppAutoComplete,
    MessagesCenterPanelTop,
    MessagesCenterPanelForm,
    AppAvatar
  },
  data() {
    return {
      search_user: "",
      createMessage: false
    };
  },
  computed: {
    newUserMessage() {
      return this.$store.state.chat.newMessageUser;
    }
  },
  methods: {
    newConversation(value) {
      this.$store.commit("chat/ADD_NEW_MESSAGE_USER", value);
      this.createMessage = true;
    },
    goBack() {
      this.$router.push(`/messages`);
    }
  }
};
</script>