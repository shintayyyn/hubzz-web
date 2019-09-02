<template>
  <div
    class="panel-chat overflow-y-auto overflow-x-hidden h-full"
    ref="messagesContainer"
    @scroll="scrollHandler"
  >
    <div class="relative flex flex-col h-full">
      <!-- CHAT -->
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
        <transition name="drop" mode="in-out">
          <span class="relative w-full flex justify-center">
            <button
              v-if="newMessage"
              :class="loadMore ? 'my-20' : 'my-4'"
              class="flex fixed text-center py-4 px-6 shadow-md text-xs text-grey-darkest font-bold rounded-full bg-white focus:outline-none hover:bg-gray-200"
              @click="scrollToBottom"
            >
              <span class="pr-2">
                <svgicon name="left-arrow" class="h-4 w-4" style="transform: rotate(-90deg)" />
              </span>
              <span>New Message</span>
            </button>
          </span>
        </transition>
        <div class="py-2 px-4">
          <div v-for="(item, index) in messages" :key="item.id">
            <div
              class="flex flex-col"
              :id="`message-${index}`"
              :class="isReceiver(item) ? 'items-start': 'items-end'"
            >
              <div
                v-if="isDeleted(item.sender_id, item.deleted_by_sender, item.receiver_id, item.deleted_by_receiver)"
                class="flex my-1"
              >
                <div
                  v-if="item.sender.domain === 'Locum'"
                  :class="item.sender.domain === 'Locum' ? '' : 'hidden'"
                  class="w-10 h-10"
                >
                  <AppAvatar
                    class="m-auto"
                    :width="'40px'"
                    :height="'40px'"
                    :src="item.sender && item.sender.avatar && item.sender.avatar.file && item.sender.avatar.file.url ? item.sender.avatar.file.url : ''"
                  />
                </div>
                <div class="flex flex-col text-sm">
                  <!-- <span
                    class="text-xs px-2"
                    :class="isReceiver(item) ? '': 'text-right'"
                  >{{ isReceiver(item) ? userFullname(item) : 'Me' }}</span>-->
                  <div class="flex" :class="isReceiver(item) ? '': 'flex-row-reverse'">
                    <div
                      class="my-1 rounded-lg text-xs px-4 py-2 border text-gray-500 italic"
                      :class="{'ml-4' : isReceiver(item)}"
                    >This message has been removed.</div>
                  </div>
                  <div class="mx-2" :class="isReceiver(item) ? 'text-right ': ''">
                    <span
                      class="text-xs text-gray-500 py-1"
                    >{{ $moment(item.created_at).fromNow() }}</span>
                  </div>
                </div>
              </div>

              <div
                v-else
                class="flex my-1 md:max-w-sm lg:max-w-lg"
                :class="isReceiver(item) ? '': 'flex-row-reverse'"
              >
                <div :class="item.sender.domain === 'Locum' ? '' : 'hidden'" class="w-10 h-10">
                  <AppAvatar
                    class="m-auto"
                    :height="'40px'"
                    :width="'40px'"
                    :src="item.sender && item.sender.avatar && item.sender.avatar.file && item.sender.avatar.file.url ? item.sender.avatar.file.url : ''"
                  />
                </div>
                <div class="flex flex-col text-sm">
                  <span
                    class="text-xs px-2"
                    :class="isReceiver(item) ? '': 'text-right'"
                  >{{ isReceiver(item) ? userFullname(item) : 'Me' }}</span>
                  <div class="flex items-start" :class="isReceiver(item) ? '': 'flex-row-reverse'">
                    <span
                      @mouseover="time=true"
                      @mouseleave="time=false"
                      class="chat-message rounded-lg px-2 py-2 mx-2"
                      :class="isReceiver(item) ? 'bg-gray-300' : 'bg-blue-500 text-white'"
                    >{{item.message}}</span>
                    <div
                      v-if="!isReceiver(item)"
                      class="text-xs text-gray-500 font-bold mt-3 cursor-pointer px-1"
                      @click="deleteMessageModal(item.id)"
                    >X</div>
                  </div>
                  <div class="mx-2" :class="isReceiver(item) ? 'text-right ': ''">
                    <span
                      class="text-xs text-gray-500 py-1"
                    >{{ $moment(item.created_at).fromNow() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- CREATE NEW CONVERSATION -->
      <template v-if="$route.params.slug && $route.params.slug === 'new' || messages.length === 0">
        <div class="relative h-full flex flex-col justify-between pt-20 overflow-y-hidden">
          <div class="h-full px-8 md:px-20 md:pt-20">
            <button
              class="absolute top-0 left-0 m-6 flex items-center font-bold focus:outline-none"
              @click="$router.go(-1)"
              v-if="$route.params.slug === 'new'"
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

    <AppConfirmationModal
      :label="'Do you want to delete this message?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="deleteMessage"
      @cancel="modal = false"
    />
  </div>
</template>
<script>
import AppAutoComplete from "~/components/Base/AppAutoComplete";
import AppConfirmationModal from "~/components/Base/AppConfirmationModal";
import AppButton from "~/components/Base/AppButton";
import AppAvatar from "~/components/Base/AppAvatar";
export default {
  components: {
    AppAutoComplete,
    AppConfirmationModal,
    AppButton,
    AppAvatar
  },
  data() {
    return {
      oldMessageCount: 0,
      route: "",
      search_user: "",
      showResult: false,
      formError: [],
      selectedUserId: "",
      message: "",
      loadMore: false,
      newMessage: false,
      modal: false,
      selectedMessageId: ""
    };
  },
  computed: {
    messages() {
      return this.$store.getters["chat/getMessages"];
    }
  },
  created() {
    this.route = this.$route.params.slug;
    this.oldMessageCount = this.messages.length;
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
      let atBottom =
        Math.round(
          this.$refs.messagesContainer.offsetHeight +
            this.$refs.messagesContainer.scrollTop
        ) === this.$refs.messagesContainer.scrollHeight;
      let newMessageIndex = value.length - 1;
      if (value.length <= 20) {
        this.scrollToBottom();
      }
      if (value.length === this.oldMessageCount + 1) {
        let newChatSender = value[newMessageIndex].sender_id;
        if (
          (this.$refs.messagesContainer.scrollHeight >
            this.$refs.messagesContainer.clientHeight ||
            this.$refs.messagesContainer.scrollTop === 0) &&
          newChatSender !== this.$auth.user.id
        ) {
          if (atBottom) {
            this.scrollToBottom();
          } else {
            this.newMessage = true;
          }
        } else {
          this.scrollToBottom();
        }
        this.oldMessageCount += +1;
      }

      this.oldMessageCount = value.length;
    }
  },
  methods: {
    userFullname(item) {
      return item.receiver_id === this.$auth.user.id
        ? `${item.sender_first_name} ${item.sender_last_name}`
        : `${item.receiver_first_name} ${item.receiver_last_name}`;
    },
    deleteMessageModal(id) {
      this.modal = true;
      this.selectedMessageId = id;
      // if (confirm("Do you want to delete this message?")) {
      //   this.$store.dispatch("chat/deleteMessage", id);
      // }
    },
    deleteMessage() {
      this.$store.dispatch("chat/deleteMessage", this.selectedMessageId);
      this.modal = false;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      });
      this.newMessage = false;
    },
    scrollHandler(e) {
      let atBottom =
        Math.round(e.target.offsetHeight + e.target.scrollTop) ===
        e.target.scrollHeight;
      if (
        e.target.scrollHeight > e.target.clientHeight &&
        e.target.scrollTop === 0
      ) {
        this.$axios.$get(`/api/v1/conversations/${this.route}`).then(res => {
          if (this.messages.length === res.data.messages.length) {
            this.loadMore = false;
          } else {
            this.loadMore = true;
          }
        });
      } else {
        this.loadMore = false;
      }
    },
    loadMoreMessages() {
      this.$store.dispatch("chat/fetchMoreMessage", {
        offset: this.messages.length,
        conversation_id: this.$route.params.slug
      });
      this.loadMore = false;
      let scrollPosition =
        this.$refs.messagesContainer.scrollHeight -
        this.$refs.messagesContainer.offsetHeight;
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.offsetHeight;
      });
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
            }
            this.search_user = "";
            this.message = "";
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

/* @media screen and (min-width: 1200px) {
  .chat-message {
    max-width: 70%;
    max-width: 20vw;
  }
} */
/* 
@media screen and (min-width: 768px) {
  .chat-message {
    max-width: 35vw;
  }
}

@media screen and (min-width: 480px) {
  .chat-message {
    max-width: 35vw;
  }
} */
</style>
