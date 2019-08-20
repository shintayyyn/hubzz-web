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
        <div class="chat-list w-full h-full overflow-y-auto" @scroll="scrollHandler">
          <template v-if="showResult === false">
            <div
              class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : 'hover:bg-gray-200'"
              v-for="item in conversations"
              :key="item.id"
              @click="goTo(item.conversation_id ? item.conversation_id : item.id)"
            >
              <img
                v-if="$auth.user.domain === 'Practice'"
                class="w-1/6 md:ml-2 rounded-full"
                :src="userAvatar(item)"
                width="12%"
                height="12%"
              />
              <div class="w-5/6 flex items-center justify-between">
                <div class="w-5/6 px-2">
                  <p
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</p>
                  <p class="text-sm truncate">{{ item.message }}</p>
                </div>
                <span
                  class="w-10 pr-1 text-right text-xs text-gray-600 leading-none absolute right-0 mr-1 h-full flex items-center"
                >{{ $moment(item.created_at).startOf('hour').fromNow() }}</span>
              </div>
            </div>
          </template>
          <template v-if="showResult && messages.length > 0">
            <div
              class="relative flex w-full items-center px-2 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : 'hover:bg-gray-200'"
              v-for="item in messages"
              :key="item.id"
              @click="goTo(item.conversation_id ? item.conversation_id : item.id)"
            >
              <img
                v-if="$auth.user.domain === 'Practice'"
                class="w-1/6 md:ml-2 rounded-full"
                :src="userAvatar(item)"
                width="12%"
                height="12%"
              />
              <div class="w-5/6 flex items-center justify-between">
                <div class="w-5/6 px-2">
                  <p
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</p>
                  <p class="text-sm truncate">{{ item.message }}</p>
                </div>
                <span
                  class="w-12 pr-1 text-right text-xs text-gray-600 leading-none absolute right-0 mr-1"
                >{{ $moment(item.created_at).startOf('hour').fromNow() }}</span>
              </div>
            </div>
          </template>
          <div
            v-if="messages.length === 0 && showResult === true"
            class="flex flex-col h-full items-center pt-20 font-bold text-gray-500"
          >
            <img src="/images/hubzz-icon-transparent.png" class="logo m-4" />
            <span>Nothing to show</span>
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
export default {
  components: {
    AppInput
  },
  data() {
    return {
      user: {
        avatar: "",
        status: false
      },
      search_text: "",
      messages: [],
      showResult: false,
      loadMore: false
    };
  },
  computed: {
    conversations() {
      return this.$store.state.chat.conversations;
    }
  },
  watch: {
    search_text(value) {
      if (!value) {
        this.showResult = false;
      } else {
        this.getResults(value);
      }
    }
  },
  methods: {
    goTo(id) {
      this.showResult = false;
      this.messages = [];
      if (window.innerWidth < 768) {
        this.$store.commit("IS_MOBILE", false);
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
    userFullname(item) {
      return item.receiver_id === this.$auth.user.id
        ? `${item.sender_first_name} ${item.sender_last_name}`
        : `${item.receiver_first_name} ${item.receiver_last_name}`;
    },
    userAvatar(item) {
      if (item.sender_avatar === null && item.receiver_avatar === null) {
        return "https://via.placeholder.com/350";
      } else if (item.receiver_id === this.$auth.user.id) {
        return item.sender_avatar;
      } else {
        return item.receiver_avatar;
      }
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
    min-width: 30vw;
    max-width: 30vw;
  }
}

@media screen and (min-width: 1200px) {
  .messages-left-panel {
    min-width: 18vw;
    max-width: 18vw;
  }
}
</style>
