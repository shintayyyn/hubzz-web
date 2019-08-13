<template>
  <div class="messages-left-panel">
    <div class="flex flex-col h-full">
      <!-- <span class="font-bold text-sm px-2 md:px-4 pt-4 md:text-base md:px-4">Messages</span> -->
      <AppInput
        v-model="search_text"
        :type="'search'"
        :name="'search_text'"
        :placeholder="'Search Messages'"
        class="mx-4 my-1"
        @keydown.enter="search"
      />
      <div class="relative flex flex-col justify-between h-full border-t">
        <div class="chat-list h-full overflow-y-auto overflow-x-hidden" @scroll="scrollHandler">
          <!-- default -->
          <div v-if="showResult === false">
            <div
              class="flex flex-row items-center px-2 md:pl-4 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : 'hover:bg-gray-300est'"
              v-for="item in conversations"
              :key="item.id"
              @click="goTo(item.conversation_id ? item.conversation_id : item.id)"
            >
              <div class="w-1/6 flex rounded-full">
                <img class="rounded-full" :src="user.avatar" width="300" height="300" />
              </div>
              <div class="w-5/6 px-2">
                <div class="flex justify-between items-center">
                  <span
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</span>
                  <span class="inline-block rounded-full bg-green-400" style="padding: 4px"></span>
                </div>
                <div class="flex">
                  <p class="text-sm truncate w-full">{{ item.message }}</p>
                  <span class="text-sm text-gray-600">2hrs</span>
                </div>
              </div>
            </div>
          </div>
          <!-- show result -->
          <div v-if="showResult && messages.length > 0">
            <div
              class="flex flex-col md:flex-row items-center px-2 md:pl-4 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.id ? 'bg-gray-300' : 'hover:bg-gray-300est'"
              v-for="item in messages"
              :key="item.id"
              @click="goTo(item.conversation_id ? item.conversation_id : item.id)"
            >
              <div class="w-1/6 flex rounded-full">
                <!-- <img class="rounded-full" :src="setAvatar(item)" width="300" height="300" /> -->
              </div>
              <div class="w-5/6 px-2">
                <div class="flex justify-between items-center">
                  <span
                    class="truncate"
                    :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''"
                  >{{ userFullname(item) }}</span>
                  <span class="inline-block rounded-full bg-green-400" style="padding: 5px"></span>
                  <!-- <span class="h-2 w-2 py-1 px-1 bg-green-400 rounded-full" style="padding: 5px"></span> -->
                </div>
                <div class="flex">
                  <p class="text-sm truncate w-full">{{ item.message }}</p>
                  <span class="text-sm text-gray-600">2hrs</span>
                </div>
              </div>
            </div>
          </div>
          <!-- No results -->
          <span
            v-if="messages.length === 0 && showResult === true"
            class="flex h-full items-center justify-center font-bold text-gray-500"
          >Nothing to show</span>
        </div>
        <!-- <transition name="fade" mode="in-out">
          <span
            class="absolute pin-b w-full text-center"
            style="background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.3));"
          >
            <button
              v-if="loadMore"
              class="text-center mb-2 rounded-full text-xs focus:outline-none hover:font-bold"
              @click="loadMoreConversation"
            >
              <svgicon name="left-arrow" height="16" width="16" style="transform: rotate(90deg)" />
            </button>
          </span>
        </transition>-->
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
        avatar: "https://via.placeholder.com/300/",
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
    createMessage() {
      this.$router.push(`/messages/new`);
    },
    scrollHandler({ target: { scrollTop, offsetHeight, scrollHeight } }) {
      let scroll = Math.round(offsetHeight + scrollTop);
      if (scroll === scrollHeight) {
        // this.loadMore = true;
        this.$axios.$get(`/api/v1/conversations/`).then(res => {
          if (res.data.conversations.length != this.conversations.length) {
            // this.loadMoreConversation();
            this.$store.dispatch("chat/fetchMoreConversation", {
              offset: this.conversations.length
            });
          }
        });
      }
    }
    // loadMoreConversation() {
    //   this.$store.dispatch("chat/fetchMoreConversation", {
    //     offset: this.conversations.length
    //   });
    //   this.loadMore = false;
    // },
    // setAvatar(item) {
    //   this.$axios.$get(`/api/v1/conversations/${item.id}`).then(res => {
    //     if (res.data.messages[0].receiver_id !== this.$auth.user.id) {
    //       if (res.data.messages[0].receiver.avatar === null) {
    //         console.log("a", res.data.messages[0].receiver_id);
    //         // this.user.avatar = "https://via.placeholder.com/300/";
    //       } else {
    //         this.user.avatar = res.data.messages[0].receiver.avatar.file.url;
    //       }
    //     } else {
    //       if (res.data.messages[0].sender.avatar === null) {
    //         console.log("a", res.data.messages[0].sender_id);
    //         console.log("b");
    //         // this.user.avatar = "https://via.placeholder.com/300/";
    //       } else {
    //         console.log("url: ", res.data.messages[0].sender.avatar.file.url);
    //         this.user.avatar = res.data.messages[0].sender.avatar.file.url;
    //       }
    //     }
    //   });
    // }
  }
};
</script>
<style scoped>
.messages-left-panel {
  width: 100%;
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
@media screen and (min-width: 576px) {
  .messages-left-panel {
    min-width: 30vw;
    max-width: 30vw;
  }
}

@media screen and (min-width: 768px) {
  .messages-left-panel {
    min-width: 25vw;
    max-width: 25vw;
  }
}

@media screen and (min-width: 1200px) {
  .messages-left-panel {
    min-width: 18vw;
    max-width: 18vw;
  }
}
</style>
