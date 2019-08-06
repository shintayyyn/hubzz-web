<template>
  <div
    class="panel-chat overflow-y-auto py-2 px-4 h-full border-t border-b"
    ref="messagesContainer"
    @scroll="scrollHandler"
  >
    <div class="flex flex-col h-full">
      <div v-if="messages.length > 0 && route !=='new'">
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
               width="25" />
              <div
                class="my-1 mx-2 rounded-lg text-xs px-4 py-2 bg-red-light text-white"
                :class="{'mx-4' : !isReceiver(item)}"
              >Deleted</div>
            </div>
            </div>
            <div v-else class="flex my-1" :class="isReceiver(item) ? 'justify-start': 'justify-end'">
              <div class="flex items-center" :class="isReceiver(item) ? '': 'flex-row-reverse'">
                <img 
                class="w-10 h-10 mt-3 rounded-full border"
                :src="isReceiver(item) ? 'https://www.svgrepo.com/show/106812/doctor.svg' : 'https://image.flaticon.com/icons/svg/236/236832.svg'"
                width="25" />
                <div class="flex text-xs my-1 mx-2 flex-col">
                  <span class="py-1">{{ item.sender.email }}</span>
                  <span class="chat-message rounded-lg px-2 py-2" :class="isReceiver(item) ? 'bg-grey-light' : 'bg-blue-light text-white'">{{item.message}}</span>
                  <span class="text-grey-dark py-1" :class="isReceiver(item) ? 'text-right ': ''">2hrs ago</span>
                </div>
                <div
                  class="text-xs font-bold text-grey-dark mx-1 cursor-pointer"
                  :class="isReceiver(item) ? 'hidden' : ''"
                  @click="deleteMessage(item.id)"
                >X</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="messages.length === 0 && route ==='new'">
        <div class="flex flex-col justify-center items-center py-4">
          <img src="https://image.flaticon.com/icons/svg/236/236832.svg" width="150" />
          <MessagesCenterPanelTop class="text-center" />
        </div>
      </div> -->

     <div v-if="route === 'new'" class="flex flex-col h-full px-20 pt-20">
        <span class="font-bold text-lg">Create Message</span>
        <!-- <AppInput
          v-model="search_text"
          :type="'search'"
          :name="'search_text'"
          :placeholder="'Search Messages'"
          @keydown.enter="search"
        /> -->
        <AppAutoComplete
          v-model="search_practice"
          :name="'search_practice'"
          :label="'Search Practice'"
          :keyword="'practices'"
          :url="'/api/v1/search-practices'"
        />
        <AppButton :label="'Create'" @click="createMessage"/>
      </div>
      </div>
    </div>
</template>
<script>
import AppAutoComplete from '~/components/Base/AppAutoComplete';
import AppButton from '~/components/Base/AppButton';
import MessagesCenterPanelTop from '@/components/Messages/CenterPanel/MessagesCenterPanelTop'
export default {
  components: {
    AppAutoComplete,
    AppButton,
    MessagesCenterPanelTop
  },
  data() {
    return {
      oldMessageCount: null,
      route: '',
      search_practice: '',
      showResult: false,
    }
  },
  computed: {
    messages() {
      return this.$store.getters['chat/getMessages']
    }
  },
  created() {
    this.route = this.$router.app._route.params.slug
  },
  mounted() {
    this.scrollToBottom()
  },
  watch: {
    $route(to, from) {
      if (this.$refs.messagesContainer && this.$refs.messagesContainer.scrollTop !== 0) {
        this.scrollToBottom()
      }
    },
    messages(value) {
      let index = value.length - this.oldMessageCount
      let messageSample = document.getElementById(`message-${index}`)
      this.scrollToBottom()
      // console.log(document.getElementById(`message-${value.length - this.oldMessageCount}`))
    },
  },
  methods: {
    deleteMessage(id) {
      if (confirm("Do you want to delete this message?")) {
        this.$store.dispatch('chat/deleteMessage', id)
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
        // console.log(this.$refs.messagesContainer.scrollTop, this.$refs.messagesContainer.scrollHeight)
        // console.log(this.$auth.user)

      })
    },
    scrollHandler(e) {
      if (e.target.scrollTop === 0) {
        this.oldMessageCount = this.messages.length
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
      return this.$auth.user.id === item.receiver_id
    },
    isDeleted(sender_id, sender_deleted, receiver_id, receiver_deleted) {
      if (sender_deleted) {
        return true
      }
      if (receiver_deleted) {
        if (receiver_id === this.$auth.user.id) {
          return true
        } else {
          return false
        }
      }
    },
    createMessage(){
      
    }
  }
}
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

.chat-message{
  min-width: 100%;
  word-wrap: wrap;
  word-break: break-all;
}

.panel-chat::-webkit-scrollbar{
  width: 8px;
}

.panel-chat::-webkit-scrollbar-track {
  background: transparent;
}

.panel-chat::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 50px;
}

@media screen and (min-width: 1200px){
  .chat-message{
    max-width: 20vw;
  }
}

@media screen and (min-width: 768px){
  .chat-message{
    max-width: 35vw;
  }
}

@media screen and (min-width: 480px){
  .chat-message{
    max-width: 35vw;
  }
}

</style>
