<template>
  <div class="panel-chat overflow-y-auto py-2 px-4 h-full border-t border-b" ref="messagesContainer" @scroll="scrollHandler">
    <div class="flex flex-col h-full">
      <div v-if="messages.length > 0 && $route.params.slug !=='new'">
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
                  @click="$emit('delete-confirmation', item.id)"
                >X</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="messages.length === 0 && $route.params.slug !=='new'">
        <div class="flex flex-col justify-center items-center py-4">
          <img src="https://image.flaticon.com/icons/svg/236/236832.svg" width="150" />
          <MessagesCenterPanelTop  class="text-center"/>
        </div>
      </div>

     <!-- <div v-if="route === 'new'" class="flex flex-col h-full py-4"> -->
        <!-- <span class="font-bold text-lg">Create Message</span> -->
        <!-- <AppInput
        v-model="search_text"
        :type="'search'"
        :name="'search_text'"
        :placeholder="'Search Messages'"
        @keydown.enter="search"
        /> -->
        <!-- <div v-if="showResult && messages.length > 0">
            <div 
            class="flex flex-col md:flex-row items-center px-2 md:pl-4 py-4 cursor-pointer border-b"
            v-for="item in messages"
            :key="item.id"
            @click="goTo(item.id)">
            <div class="">
              <img src="https://image.flaticon.com/icons/svg/236/236832.svg" width="50" />
            </div>
            <div class="hidden md:block w-5/6 px-2">
              <div class="flex justify-between items-center">
                <span :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''">{{ item.receiver_first_name }} {{ item.receiver_last_name }}</span>
                <span class="h-2 w-2 py-1 px-1 bg-green-light rounded-full"></span>
              </div>
              <div class="flex">
                <p class="text-sm truncate w-full">{{ item.message }}</p>
                <span class="text-sm text-grey-darker">2hrs</span>
              </div>
            </div>
          </div>
        </div>
        <span v-if="messages.length === 0 && showResult === true" class="flex h-full items-center justify-center font-bold text-grey">Nothing to show</span> -->
      <!-- </div> -->
      </div>
    </div>
</template>
<script>
import AppInput from '~/components/Base/AppInput';
import MessagesCenterPanelTop from '@/components/Messages/CenterPanel/MessagesCenterPanelTop'
export default {
  components: {
    AppInput,
    MessagesCenterPanelTop
  },
  props: ['messages'],
  data() {
    return {
      oldMessageCount: null,
      route: '',
      search_text: "",
      showResult: false,
    }
  },
  created(){
    this.route = this.$router.app._route.params.slug
    // this.$axios.$get(`/api/v1/admin/`).then(res => {
    //   this.
    // })
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
    "search_text"(value){
      if (!value){
        this.showResult = false
        console.log('empty search')
      }else{
        this.getResults(value)
      }
    }
  },
  methods: {
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
    getResults(value){
      let search = this.search_text
      this.$axios.$get(`/api/v1/conversations/?search=${search}`).then(res => {
          this.messages = res.data.conversations
          this.showResult = true
      })
    },
    // goTo(id) {
    //   // this.route = id
    //   this.$router.push(`/messages/${id}`)
    // },
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

.panel-chat::-webkit-scrollbar-track{
  background: transparent;
}

.panel-chat::-webkit-scrollbar-thumb{
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
