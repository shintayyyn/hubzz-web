<template>
  <div class="panel-chat overflow-y-auto h-full" ref="messagesContainer" @scroll="scrollHandler">
    <div class="relative flex flex-col h-full">
      <template v-if="messages.length > 0">
        <transition name="drop" mode="in-out">
          <span class="relative w-full flex justify-center">
            <button
              v-if="loadMore"
              class="absolute text-center py-4 px-8 shadow-md text-xs text-grey-darkest font-bold my-4 rounded-full bg-white focus:outline-none hover:bg-gray-200"
              @click="loadMoreMessages"
            >Load More Messages</button>
          </span>
        </transition>
        <div class="py-2 px-4">
          <div v-for="(item, index) in messages" :key="item.id">
            <div class="flex flex-col" :id="`message-${index}`">
              <div
                v-if="isDeleted(item.sender_id, item.deleted_by_sender, item.receiver_id, item.deleted_by_receiver)"
                class="flex my-1"
                :class="isReceiver(item) ? 'justify-start': 'justify-end'"
              >
                <div class="flex" :class="isReceiver(item) ? '': 'flex-row-reverse'">
                  <img
                    v-if="item.sender.domain === 'Locum'"
                    class="w-10 h-10 rounded-full border"
                    :src="setAvatar(item.sender)"
                    width="25"
                  />
                  <div
                    class="my-1 mx-2 rounded-lg text-xs px-4 py-2 bg-red-400 text-white"
                    :class="{'mx-4' : !isReceiver(item)}"
                  >Deleted</div>
                </div>
              </div>

              <div
                v-else
                class="flex my-1"
                :class="isReceiver(item) ? 'justify-start': 'justify-end'"
              >
                <div class="flex flex-col text-sm">
                  <div class="flex items-start" :class="isReceiver(item) ? '': 'flex-row-reverse'">
                    <img
                      class="w-10 h-10 rounded-full"
                      :class="item.sender.domain === 'Locum' ? '' : 'hidden'"
                      :src="setAvatar(item.sender)"
                      width="25"
                    />
                    <span
                      @mouseover="time=true"
                      @mouseleave="time=false"
                      class="chat-message rounded-lg px-2 py-2 mx-2"
                      :class="isReceiver(item) ? 'bg-gray-300' : 'bg-blue-500 text-white'"
                    >{{item.message}}</span>
                    <!-- <div
                      class="text-xs text-gray-500 font-bold mx-1 mt-3 cursor-pointer px-2"
                      @click="deleteMessage(item.id)"
                    >X</div>-->
                  </div>
                  <div class="mx-2" :class="isReceiver(item) ? 'text-right ': ''">
                    <span
                      class="text-xs text-gray-500 py-1"
                    >{{ $moment(item.created_at).startOf("day").fromNow() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="$route.params.slug === 'new'">
        <div class="relative h-full flex flex-col justify-between pt-20 overflow-y-hidden">
          <div class="h-full px-8 md:px-20 md:pt-20">
            <button
              class="absolute top-0 left-0 m-6 flex items-center font-bold focus:outline-none"
              @click="$router.go(-1)"
            >
              <svgicon name="left-arrow" height="32" width="32" />
            </button>
            <span class="font-bold text-lg">Create Message</span>
            <AppAutoComplete
              v-model="search_user"
              :name="'search_user'"
              :label="'To:'"
              :placeholder="$auth.user.domain === 'Practice' ? 'Type the name of the Locum' : 'Type the name of the Practice'"
              :keyword="'practices'"
              :url="'/api/v1/search-users'"
              :error="formError.find(item => item.field === 'search_user')"
              @selectUserId="selectedUserId = $event"
            />
          </div>

          <div v-if="search_user" class="flex">
            <textarea
              v-model="message"
              class="message-box resize-none w-full p-3 text-sm align-middle focus:outline-none border-t"
              placeholder="Type your message here"
              @keydown.enter="createMessage"
            ></textarea>
            <button class="px-8 bg-yellow-500 h-full" @click="createMessage">Send</button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import AppAutoComplete from "~/components/Base/AppAutoComplete";
import AppButton from "~/components/Base/AppButton";
import AppTextarea from "~/components/Base/AppTextarea";
import MessagesCenterPanelTop from "@/components/Messages/CenterPanel/MessagesCenterPanelTop";
export default {
  components: {
    AppAutoComplete,
    AppButton,
    AppTextarea,
    MessagesCenterPanelTop
  },
  data() {
    return {
      oldMessageCount: null,
      route: "",
      search_user: "",
      showResult: false,
      formError: [],
      selectedUserId: "",
      message: "",
      loadMore: false,
      backToBottom: false,
      time: false
    };
  },
  computed: {
    messages() {
      return this.$store.getters["chat/getMessages"];
    }
  },
  created() {
    this.route = this.$route.params.slug;
  },
  mounted() {
    this.scrollToBottom();
  },
  watch: {
    $route(to, from) {
      if (
        this.$refs.messagesContainer &&
        this.$refs.messagesContainer.scrollTop !== 0
      ) {
        this.scrollToBottom();
      }
      this.loadMore = false;
    },
    messages(value) {
      let index = value.length - this.oldMessageCount;
      let messageSample = document.getElementById(`message-${index}`);
      if (value.length === 20) {
        this.scrollToBottom();
      }
    }
  },
  methods: {
    deleteMessage(id) {
      if (confirm("Do you want to delete this message?")) {
        this.$store.dispatch("chat/deleteMessage", id);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      });
    },
    scrollHandler(e) {
      if (
        e.target.scrollHeight > e.target.clientHeight &&
        e.target.scrollTop === 0
      ) {
        this.$axios.$get(`/api/v1/conversations/${this.route}`).then(res => {
          if (this.messages.length == res.data.messages.length) {
            this.loadMore = false;
          } else if (this.messages.length >= res.data.messages.length / 2) {
            this.backToBottom = true;
            this.loadMore = true;
          } else {
            this.loadMore = true;
          }
        });
      }
    },
    loadMoreMessages() {
      this.$store.dispatch("chat/fetchMoreMessage", {
        offset: this.messages.length,
        conversation_id: this.$route.params.slug
      });
      this.loadMore = false;
      // let scrollPosition =
      //   this.$refs.messagesContainer.scrollHeight -
      //   this.$refs.messagesContainer.offsetHeight;
      // this.$nextTick(() => {
      //   this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.offsetHeight;
      // });
    },
    isReceiver(item) {
      return this.$auth.user.id === item.receiver_id;
    },
    isDeleted(sender_id, sender_deleted, receiver_id, receiver_deleted) {
      if (sender_deleted) {
        return true;
      }
      if (receiver_deleted) {
        if (receiver_id === this.$auth.user.id) {
          return true;
        } else {
          return false;
        }
      }
    },
    setAvatar(item) {
      if (item.avatar === null) {
        return "https://via.placeholder.com/300/";
      } else {
        return item.avatar.file.url;
      }
    },
    createMessage() {
      if (!this.search_user) {
        this.formError.push({
          field: "search_user",
          message: "Search for practice first"
        });
      } else {
        this.$axios
          .$get(`/api/v1/conversations/?search=${this.search_user}`)
          .then(res => {
            if (res.data.conversations.length === 0) {
              this.$store.dispatch("chat/sendMessage", {
                receiver_user_id: this.selectedUserId.toString(),
                message: this.message
              });
              let conversation = this.$store.state.chat.conversations[0];
              if (window.innerWidth < 768) {
                this.$store.commit("IS_MOBILE", false);
              }
              this.$router.push(
                `/messages/${parseInt(conversation.conversation_id) + 1}`
              );
            }
            this.search_user = "";
          });
      }
    }
  }
};
</script>
<style scoped>
.message-chat:hover {
  background-color: #dee1e5;
  transition: background-color 0.5s ease-in-out;
}
.message-chat {
  background-color: white;
  transition: background-color 0.5s ease-in-out;
}

.chat-message {
  word-wrap: wrap;
  word-break: break-all;
}

.panel-chat {
  scroll-behavior: smooth;
}

.panel-chat::-webkit-scrollbar {
  width: 8px;
}

.panel-chat::-webkit-scrollbar-track {
  background: transparent;
}

.panel-chat::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 50px;
}

@media screen and (min-width: 1200px) {
  .chat-message {
    max-width: 20vw;
  }
}

@media screen and (min-width: 768px) {
  .chat-message {
    max-width: 35vw;
  }
}

@media screen and (min-width: 480px) {
  .chat-message {
    max-width: 35vw;
  }
}
</style>
