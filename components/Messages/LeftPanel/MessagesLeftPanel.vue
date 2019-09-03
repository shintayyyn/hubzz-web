<template>
  <div class="messages-left-panel" :class="$store.state.mobile ? '' : 'hidden md:flex'">
    <div class="flex flex-col h-full w-full">
      <AppInput
        v-model="search_text"
        :type="'search'"
        :name="'search_text'"
        :placeholder="'Search Messages'"
        class="mx-4 my-1"
        @keydown.enter="search"
      />
      <div class="relative flex flex-col justify-between h-full border-t">
        <div
          class="chat-list w-full h-full overflow-y-auto overflow-x-hidden"
          @scroll="scrollHandler"
        >
          <template v-if="showResult === false || $route.params.slug == '/messages'">
            <div
              class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
              :class="[parseInt($route.params.slug) === item.conversation_id ? 'bg-gray-300' : 'hover:bg-gray-200', unreadMessages.includes(item.conversation_id) ? 'font-bold' : '']"
              v-for="item in conversations"
              :key="item.conversation_id"
              @click="goTo(item.conversation_id ? item.conversation_id : item.conversation_id)"
            >
              <AppAvatar
                v-if="$auth.user.domain === 'Practice'"
                :height="'50px'"
                :width="'50px'"
                :src="item.sender_avatar ? item.sender_avatar : ''"
              />
              <div class="w-5/6 flex items-center justify-between">
                <div class="w-5/6 px-2">
                  <p
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.conversation_id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</p>
                  <p class="text-sm truncate">{{ senderFullname(item) }}: {{ item.message }}</p>
                </div>
                <span
                  class="w-10 text-right text-xs text-gray-600 leading-none absolute right-0 mx-2 h-full flex items-center"
                >{{ $moment(item.created_at).fromNow() }}</span>
              </div>
            </div>
          </template>
          <template v-if="showResult && messages.length > 0">
            <div
              class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.conversation_id ? 'bg-gray-300' : 'hover:bg-gray-200'"
              v-for="item in messages"
              :key="item.conversation_id"
              @click="goTo(item.conversation_id ? item.conversation_id : item.conversation_id)"
            >
              <!-- <AppAvatar
                :height="'50px'"
                :width="'50px'"
                :src="item.receiver_avatar ? item.receiver_avatar : ''"
              />-->
              <div class="w-5/6 flex items-center justify-between">
                <div class="w-5/6 px-2">
                  <p
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.conversation_id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</p>
                  <p class="text-sm truncate">{{ senderFullname(item) }}: {{ item.message }}</p>
                </div>
                <span
                  class="w-12 text-right text-xs text-gray-600 leading-none absolute right-0 mx-2"
                >{{ $moment(item.created_at).fromNow() }}</span>
              </div>
            </div>
          </template>
          <div
            v-if="(messages.length === 0 && showResult === true) || conversations.length === 0"
            class="flex flex-col h-full items-center pt-20 font-bold text-gray-500"
          >
            <span v-if="showResult === true" class="text-center break-all px-4">
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
    unreadMessages() {
      return this.$store.state.chat.unreadMessages;
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
    conversations(newValue, oldValue) {
      if (
        this.$store.state.chat.activeConversationId !=
        newValue[0].conversation_id.toString()
      ) {
        this.$store.commit(
          "chat/ADD_UNREAD_MESSAGE",
          newValue[0].conversation_id
        );
      }
      // let receiver_id = newValue[0].receiver_id;
      // let sender_id = newValue[0].sender_id;
      // if (this.$auth.user.id === receiver_id) {
      //   return;
      // }
    }
  },
  methods: {
    goTo(id) {
      this.showResult = false;
      this.messages = [];
      if (window.innerWidth < 768) {
        this.$store.commit("IS_MOBILE", false);
      }
      if (this.unreadMessages.includes(id)) {
        this.$store.commit("chat/DELETE_UNREAD_MESSAGE", id);
      }
      this.$router.push(`/messages/${id}`);
    },
    getResults(value) {
      let search = this.search_text;
      this.$axios.$get(`/api/v1/conversations/?search=${search}`).then(res => {
        this.messages = res.data.conversations;
        this.showResult = true;
      });
    },
    senderFullname(item) {
      return `${item.sender_first_name} ${item.sender_last_name}`;
    },
    userFullname(item) {
      return this.$auth.user.id === item.receiver_id
        ? `${item.sender_first_name} ${item.sender_last_name}`
        : `${item.receiver_first_name} ${item.receiver_last_name}`;
    },
    createMessage() {
      if (window.innerWidth < 768) {
        this.$store.commit("IS_MOBILE", false);
      }
      this.$router.push(`/messages/new`);
    },
    scrollHandler({ target: { scrollTop, offsetHeight, scrollHeight } }) {
      let scroll = Math.round(offsetHeight + scrollTop);
      if (scroll === scrollHeight) {
        this.$axios.$get(`/api/v1/conversations/`).then(res => {
          if (res.data.conversations.length != this.conversations.length) {
            this.$store.dispatch("chat/fetchMoreConversation", {
              offset: this.conversations.length
            });
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.messages-left-panel {
  min-width: 100%;
  max-width: 100%;
  float: left;
  min-height: 80vh;
  max-height: 80vh;
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
  }
}
</style>
