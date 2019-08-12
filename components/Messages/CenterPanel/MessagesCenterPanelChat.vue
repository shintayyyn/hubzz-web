<template>
  <div class="panel-chat overflow-y-auto h-full" ref="messagesContainer" @scroll="scrollHandler">
    <div class="flex flex-col h-full">
      <template v-if="messages.length > 0">
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
                    class="w-10 h-10 rounded-full border"
                    :src="isReceiver(item) ? 'https://www.svgrepo.com/show/106812/doctor.svg' : 'https://image.flaticon.com/icons/svg/236/236832.svg'"
                    width="25"
                  />
                  <div
                    class="my-1 mx-2 rounded-lg text-xs px-4 py-2 bg-red-200 text-white"
                    :class="{'mx-4' : !isReceiver(item)}"
                  >Deleted</div>
                </div>
              </div>
              <div
                v-else
                class="flex my-1"
                :class="isReceiver(item) ? 'justify-start': 'justify-end'"
              >
                <div class="flex items-start" :class="isReceiver(item) ? '': 'flex-row-reverse'">
                  <img
                    class="w-10 h-10 rounded-full border"
                    :src="isReceiver(item) ? 'https://www.svgrepo.com/show/106812/doctor.svg' : 'https://image.flaticon.com/icons/svg/236/236832.svg'"
                    width="25"
                  />
                  <div class="flex text-xs my-1 mx-2 flex-col">
                    <!-- <span class="py-1">asd</span> -->
                    <span
                      class="chat-message rounded-lg px-2 py-2"
                      :class="isReceiver(item) ? 'bg-gray-200' : 'bg-blue-300light text-white'"
                    >{{item.message}}</span>
                    <span
                      class="text-gray-400 py-1"
                      :class="isReceiver(item) ? 'text-right ': ''"
                    >2hrs ago</span>
                  </div>
                  <div
                    class="text-xs font-bold mx-1 mt-3 cursor-pointer text-white hover:text-gray-400"
                    @click="deleteMessage(item.id)"
                  >X</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="$route.params.slug === 'new'">
        <div class="h-full flex flex-col justify-between pt-20 overflow-y-hidden">
          <div class="h-full px-20 pt-20">
            <span class="font-bold text-lg">Create Message</span>
            <!-- <AppInput
              v-model="search_text"
              :type="'search'"
              :name="'search_text'"
              :placeholder="'Search Messages'"
              @keydown.enter="search"
            />-->
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
              class="message-box resize-none w-full p-4 text-sm align-middle focus:outline-none border-t"
              placeholder="Type your message here"
              @keydown.enter="createMessage"
            ></textarea>
            <!-- <AppTextarea
              v-model="message"
              :name="'message'"
              :rows="0"
              :resize="false"
              :placeholder="'Type your message here'"
              :error="this.formError.find(item => item.field === 'message')"
              class="w-full -mb-2 px-2"
            />-->
            <button class="px-8 bg-yellow-400 h-full" @click="createMessage">Send</button>

            <!-- <AppButton :label="'Create'" @click="createMessage()" class="mx-2" /> -->
          </div>
        </div>
      </template>
      <!-- <template v-if="route !== 'new' && messages.length === 0">
        <div>
          <div class="flex flex-col justify-center items-center py-4">
            <img src="https://image.flaticon.com/icons/svg/236/236832.svg" width="150" />
            <MessagesCenterPanelTop class="text-center" />
          </div>
        </div>
      </template>-->
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
      message: ""
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
    },
    messages(value) {
      let index = value.length - this.oldMessageCount;
      let messageSample = document.getElementById(`message-${index}`);
      this.scrollToBottom();
      // console.log(document.getElementById(`message-${value.length - this.oldMessageCount}`))
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
        // console.log(this.$refs.messagesContainer.scrollTop, this.$refs.messagesContainer.scrollHeight)
        // console.log(this.$auth.user)
      });
    },
    scrollHandler(e) {
      if (e.target.scrollTop === 0) {
        this.oldMessageCount = this.messages.length;
        // console.log(this.oldMessageCount)
        // const firstMessageElementBeforeLoadMore =
        // document.getElementById(
        //   `message-${this.messages.length}`
        // );
        // console.log(firstMessageElementBeforeLoadMore)
        // this.$emit('fetch-more-messages')
      }
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
              //if conversation doesn't exist -- create message
              this.$store.dispatch("chat/sendMessage", {
                receiver_user_id: this.selectedUserId,
                message: this.message
              });
              let conversation = this.$store.state.chat.conversations[0];
              console.log(conversation);
              this.$router.push(`/messages/${conversation.id + 1}`);
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
  min-width: 100%;
  word-wrap: wrap;
  word-break: break-all;
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
