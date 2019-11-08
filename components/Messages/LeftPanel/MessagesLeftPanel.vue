<template>
  <div class="messages-left-panel md:border-r" :class="$store.state.mobile ? '' : 'hidden md:flex'">
    <div class="flex flex-col h-full w-full">
      <AppInput
        v-model="search_text"
        :type="'search'"
        :name="'search_text'"
        :placeholder="'Search Messages'"
        class="mx-4 my-1 md:mt-0 pt-4"
        :class="$auth.user.domain === 'Locum' ? 'mt-10' : 'mt-12'"
        @keydown.enter="search"
      />
      <div class="relative flex flex-col justify-between h-full border-t">
        <div
          class="chat-list w-full h-full overflow-y-auto overflow-x-hidden"
          @scroll="scrollHandler"
        >
          <template v-if="showResult === false || $route.params.slug == '/messages'">
          <transition-group name="slide" tag="p">
            <div
              class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
              :class="[parseInt($route.params.slug) === item.id ? 'bg-gray-300' : 'hover:bg-gray-200', unreadMessages.find(conversation => conversation.conversation_id == item.id && $auth.user.id == conversation.user_id) ? 'font-bold bg-gray-100' : '']"
              v-for="item in conversations"
              :key="item.id"
              @click.stop="goTo(item.id ? item.id : item.id)"
            >
              <div>
                <AppAvatar
                  v-if="$auth.user.domain === 'Practice'"
                  :height="'50px'"
                  :width="'50px'"
                  :src="userAvatar(item)"
                />
              </div>
              <div class="w-5/6 flex items-center justify-between">
                <div class="w-4/6 sm:w-5/6 md:w-4/6 lg:w-5/6 px-2 leading-tight">
                  <p
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</p>
                  <p
                    class="text-sm truncate text-gray-700"
                    :class="item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? 'italic':''"
                  >{{ item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? `${senderFullname(item)} deleted a message.` : `${senderFullname(item)}: ${item.latest_conversation_message.message}` }}</p>
                </div>
                <span
                  class="absolute w-10 h-full flex items-center right-0 text-right text-xs text-gray-600 leading-none mx-2"
                  :class="[parseInt($route.params.slug) === item.id ? 'bg-gray-300 hover:bg-gray-300' : 'hover:bg-gray-200', unreadMessages.find(conversation => conversation.conversation_id == item.id && $auth.user.id == conversation.user_id) && 'mr-5']"
                >{{ $moment(item.latest_conversation_message.created_at).fromNow() }}</span>
              </div>
            </div>
          </transition-group>
          </template>

          <template v-if="showResult && messages.length > 0">
          <transition-group name="slide" tag="p">
            <div
              class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : 'hover:bg-gray-200'"
              v-for="item in messages"
              :key="item.id"
              @click.stop="goTo(item.id ? item.id : item.id)"
            >
              <div>
                <AppAvatar
                  v-if="$auth.user.domain === 'Practice'"
                  :height="'50px'"
                  :width="'50px'"
                  :src="userAvatar(item)"
                />
              </div>

              <div class="w-5/6 flex items-center justify-between">
                <div class="w-4/6 sm:w-5/6 md:w-4/6 lg:w-5/6 px-2 leading-tight">
                  <p
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</p>
                  <p
                    class="text-sm truncate text-gray-700"
                    :class="item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? 'italic':''"
                  >{{ item.latest_conversation_message.deleted_by_receiver || item.latest_conversation_message.deleted_by_sender ? `${senderFullname(item)} deleted a message.` : `${senderFullname(item)}: ${item.latest_conversation_message.message}` }}</p>
                </div>
                <span
                  class="absolute w-10 h-full flex items-center right-0 text-right text-xs text-gray-600 leading-none mx-2"
                  :class="[parseInt($route.params.slug) === item.id ? 'bg-gray-300 hover:bg-gray-300' : 'hover:bg-gray-200', unreadMessages.find(conversation => conversation.conversation_id == item.id && $auth.user.id == conversation.user_id) && 'mr-5']"
                >{{ $moment(item.latest_conversation_message.created_at).fromNow() }}</span>
              </div>
            </div>
          </transition-group>
          </template>
          <div
            v-if="(messages.length === 0 && showResult === true) || conversations.length === 0"
            class="flex flex-col h-full items-center pt-20 font-bold text-gray-500"
          >
            <span v-if="showResult === true" class="text-center break-words break-all px-4">
              No messages found for
              <br />
              "{{ search_text }}"
            </span>
            <span v-else>No messages</span>
          </div>
        </div>
      </div>
      <button
        class="bg-yellow-500 border-yellow-500 text-sm p-4 md:text-lg focus:outline-none"
        @click="createMessage"
      >Create Message</button>
    </div>
  </div>
</template>
<script>
import AppInput from "~/components/Base/AppInput";
import AppAvatar from "~/components/Base/AppAvatar";
export default {
  components: {
    AppInput,
    AppAvatar
  },
  data() {
    return {
      search_text: "",
      messages: [],
      showResult: false,
      loadMore: false,
      unread: false
    };
  },
  computed: {
    conversations() {
      return this.$store.getters["chat/getConversations"];
    },
    activeConversationId() {
      return this.$store.state.chat.activeConversationId;
    },
    unreadMessages() {
      return this.$store.getters["chat/getUnreadMessages"];
    }
  },
  watch: {
    search_text(value) {
      if (!value) {
        this.showResult = false;
      } else {
        this.getResults(value);
      }
    },
    conversations(newValue) {
      // let conversation = newValue.find((conversation, index) => index === 0);
      // let conversations = newValue.find(item => item.id === conversation.id);
      // if (this.activeConversationId != conversation.id.toString()) {
      //   this.$store.commit("chat/ADD_UNREAD_MESSAGE", conversation);
      // }
    }
  },
  methods: {
    goTo(id) {
      this.showResult = false;
      this.search_text = "";
      this.messages = [];
      this.$store.dispatch("chat/setActiveConversation", id);
      if (!this.conversations.find(item => item.id == id)) {
        this.loadMoreConversation();
      }
      if (window.innerWidth < 768) {
        this.$store.commit("IS_MOBILE", false);
      }
      if (this.unreadMessages.find(item => item.conversation_id == id)) {
        this.$store.commit("chat/DELETE_UNREAD_MESSAGE", id);
      }
      if (this.$route.params.slug != id) {
        this.$router.push(`/messages/${id}`);
      }
    },
    getResults(value) {
      this.$axios.$get(`/api/v1/conversations?search=${value}`).then(res => {
        this.messages = res.data.conversations;
        this.showResult = true;
      });
    },
    senderFullname(item) {
      return item.latest_conversation_message.user.id === this.$auth.user.id
        ? "You"
        : `${item.latest_conversation_message.user.personal_detail.first_name} ${item.latest_conversation_message.user.personal_detail.last_name}`;
    },
    userFullname(item) {
      let user = item.conversation_member_users.find(
        item => item.user.id != this.$auth.user.id
      );
      return `${user.user.personal_detail.first_name} ${user.user.personal_detail.last_name}`;
    },
    userAvatar(item) {
      let user_detail = item.conversation_member_users.find(
        item => item.user.id != this.$auth.user.id
      );
      return user_detail.user.avatar ? user_detail.user.avatar.file.url : "";
    },
    createMessage() {
      if (window.innerWidth < 768) {
        this.$store.commit("IS_MOBILE", false);
      }
      if (this.$route.name === "messages-slug") {
        this.$router.push(`/messages/new`);
      }
    },
    scrollHandler({ target: { scrollTop, offsetHeight, scrollHeight } }) {
      let scroll = Math.round(offsetHeight + scrollTop);
      if (scroll === scrollHeight) {
        this.loadMoreConversation();
      }
    },
    loadMoreConversation() {
      this.$store.dispatch("chat/fetchMoreConversation", {
        offset: this.conversations.length
      });
    }
  }
};
</script>
<style scoped>
.messages-left-panel {
  min-width: 100%;
  max-width: 100%;
  float: left;
  min-height: 100%;
  max-height: 1000%;
}

.chat-list::-webkit-scrollbar {
  width: 8px;
}

.chat-list::-webkit-scrollbar-track {
  background: transparent;
}

.chat-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 50px;
}

@media screen and (min-width: 768px) {
  .messages-left-panel {
    min-width: 35%;
    max-width: 35%;
    min-height: 80vh;
    max-height: 80vh;
  }
}

@media screen and (min-width: 1200px) {
  .messages-left-panel {
    min-width: 25%;
    max-width: 25%;
    min-height: 80vh;
    max-height: 80vh;
  }
}
</style>