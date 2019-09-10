<template>
  <div
    class="panel-chat overflow-y-auto overflow-x-hidden h-full"
    ref="messagesContainer"
    @scroll="scrollHandler"
  >
    <div class="relative flex flex-col h-full">
      <!-- CHAT -->
      <AppLoading :loading="loading" :message="'Loading'" />
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
              v-if="isDeleted(item.user.id, item.deleted_by_sender, item.deleted_by_receiver)"
              class="flex my-1"
            >
              <div
                v-if="$auth.user.domain === 'Practice'"
                :class="isReceiver(item) ? '' : 'hidden'"
                class="w-10 h-10"
              >
                <AppAvatar
                  class="m-auto"
                  :width="'40px'"
                  :height="'40px'"
                  :src="item.user.avatar ? item.user.avatar.file.url : ''"
                />
              </div>
              <div class="flex flex-col text-sm px-2">
                <span
                  class="text-xs px-2 text-gray-600"
                  :class="isReceiver(item) ? '': 'text-right'"
                >{{ isReceiver(item) ? userFullname(item) : 'Me' }}</span>
                <div class="flex" :class="isReceiver(item) ? '': 'flex-row-reverse'">
                  <div
                    @mouseover="onHover(item.id)"
                    @mouseleave="selectedMessageId = ''"
                    class="rounded-lg text-xs px-2 py-2 border text-gray-500 italic"
                    :class="{'ml-2' : isReceiver(item)}"
                  >This message has been removed.</div>
                </div>
                <transition name="drop-down" mode="out-in">
                  <div
                    v-if="item.id == selectedMessageId"
                    class="mx-2"
                    :class="isReceiver(item) ? 'text-right ': ''"
                  >
                    <span class="text-xs text-gray-500">{{ $moment(item.created_at).fromNow() }}</span>
                  </div>
                </transition>
              </div>
            </div>

            <div
              v-else
              class="flex my-1 md:max-w-sm lg:max-w-lg"
              :class="isReceiver(item) ? '': 'flex-row-reverse'"
            >
              <div
                v-if="$auth.user.domain === 'Practice'"
                :class="isReceiver(item) ? '' : 'hidden'"
                class="w-10 h-10"
              >
                <AppAvatar
                  class="m-auto"
                  :height="'40px'"
                  :width="'40px'"
                  :src="item.user.avatar ? item.user.avatar.file.url : ''"
                />
              </div>
              <div class="flex flex-col text-sm px-2">
                <span
                  class="text-xs px-2 text-gray-600"
                  :class="isReceiver(item) ? '': 'text-right'"
                >{{ isReceiver(item) ? userFullname(item) : 'Me' }}</span>
                <div
                  @mouseover="onHover(item.id)"
                  @mouseleave="selectedMessageId = ''"
                  class="flex items-center"
                  :class="isReceiver(item) ? '': 'flex-row-reverse'"
                >
                  <span
                    class="chat-message rounded-lg px-2 py-2 mx-2 whitespace-pre"
                    :class="isReceiver(item) ? 'bg-gray-300' : 'bg-blue-500 text-white text-right'"
                  >{{item.message}}</span>
                  <transition name="fade" mode="out-in">
                    <div
                      v-if="!isReceiver(item) && item.id == selectedMessageId"
                      class="text-xs text-gray-500 hover:text-gray-700 font-bold cursor-pointer px-1"
                      @click="deleteMessageModal(item.id)"
                      title="Delete Message"
                    >X</div>
                  </transition>
                </div>
                <transition name="drop-down" mode="out-in">
                  <div
                    v-if="item.id == selectedMessageId"
                    class="mx-2"
                    :class="isReceiver(item) ? 'text-right ': 'ml-6'"
                  >
                    <span class="text-xs text-gray-500">{{ $moment(item.created_at).fromNow() }}</span>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import AppConfirmationModal from "~/components/Base/AppConfirmationModal";
import AppButton from "~/components/Base/AppButton";
import AppAvatar from "~/components/Base/AppAvatar";
import AppLoading from "~/components/Base/AppLoading";
export default {
  components: {
    AppConfirmationModal,
    AppButton,
    AppAvatar,
    AppLoading
  },
  data() {
    return {
      oldMessageCount: 0,
      route: "",
      showResult: false,
      formError: [],
      selectedUserId: "",
      loadMore: false,
      newMessage: false,
      modal: false,
      selectedMessageId: "",
      loading: true,
      showHidden: false
    };
  },
  computed: {
    messages() {
      return this.$store.getters["chat/getMessages"];
    },
    conversations() {
      return this.$store.getters["chat/getConversations"];
    },
    activeConversationId() {
      return this.$store.state.chat.activeConversationId;
    }
  },
  created() {
    this.route = this.$route.params.slug;
    this.oldMessageCount = this.messages.length;
  },

  mounted() {
    this.scrollToBottom();
    this.loading = false;
  },
  watch: {
    $route(to, from) {
      if (
        this.$refs.messagesContainer &&
        this.$refs.messagesContainer.scrollTop !== 0
      ) {
        this.scrollToBottom();
      }
    },
    messages(value) {
      let atBottom =
        Math.round(
          this.$refs.messagesContainer.offsetHeight +
            this.$refs.messagesContainer.scrollTop
        ) === this.$refs.messagesContainer.scrollHeight;
      let newMessageIndex = value.length - 1;
      if (value.length > 0) {
        this.loading = false;
      }
      if (value.length <= 20) {
        this.scrollToBottom();
      }
      if (value.length === this.oldMessageCount + 1) {
        let newChatSender = value[newMessageIndex].user.id;
        if (
          (this.$refs.messagesContainer.scrollHeight >
            this.$refs.messagesContainer.clientHeight ||
            this.$refs.messagesContainer.scrollTop === 0) &&
          newChatSender != this.$auth.user.id
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
    onHover(id) {
      this.selectedMessageId = id;
      this.showHidden = true;
    },
    userFullname(item) {
      return `${item.user.personal_detail.first_name} ${item.user.personal_detail.last_name}`;
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
      if (
        e.target.scrollHeight > e.target.clientHeight &&
        e.target.scrollTop === 0
      ) {
        this.$axios
          .$get(
            `/api/v1/conversations/count?conversation_id=${this.activeConversationId}`
          )
          .then(res => {
            if (this.messages.length === res.data.count) {
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
        conversation_id: this.activeConversationId
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
      return this.$auth.user.id != item.user.id;
    },
    isDeleted(sender_id, sender_deleted, receiver_deleted) {
      if (sender_deleted) {
        return true;
      }
      if (receiver_deleted) {
        if (sender_id === this.$auth.user.id) {
          return false;
        } else {
          return true;
        }
      }
    },
    setAvatar(item) {
      if (item.avatar === null) {
        return "https://via.placeholder.com/300/";
      } else {
        return item.avatar.file.url;
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
