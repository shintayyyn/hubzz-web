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
      <div class="flex flex-col justify-between h-full border-t">
      <!-- <nuxt-child v-if="this.$router !== `/messages/`" class="sm:hidden"/> -->
        <div class="chat-list h-full overflow-y-auto overflow-x-hidden">
          <!-- default -->
          <div v-if="showResult === false">
            <div 
              class="flex flex-row items-center px-2 md:pl-4 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.id ? 'bg-grey-lighter' : 'hover:bg-grey-lightest'"
              v-for="item in conversations"
              :key="item.id"
              @click="goTo(item.id)"
            >
              <div class="w-1/6">
                <img src="https://image.flaticon.com/icons/svg/236/236832.svg" width="50" />
              </div>
              <div class="w-5/6 px-2">
              <div class="flex justify-between items-center">
                <!-- <span :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''">{{ item.receiver_first_name }} {{ item.receiver_last_name }}</span> -->
                <span v-if="!isReceiver(item)" :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''">{{ item.receiver_first_name }} {{ item.receiver_last_name }}</span>
                <span v-if="isReceiver(item)" :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''">{{ item.sender_first_name }} {{ item.sender_last_name }}</span>
                <span class="h-2 w-2 py-1 px-1 bg-green-light rounded-full"></span>
              </div>
              <div class="flex">
                <p class="text-sm truncate w-full">{{ item.message }}</p>
                <span class="text-sm text-grey-darker">2hrs</span>
              </div>
              </div>
            </div>
          </div>
          <!-- show result -->
          <div v-if="showResult && messages.length > 0">
             <div 
              class="flex flex-col md:flex-row items-center px-2 md:pl-4 py-4 cursor-pointer border-b"
              :class="parseInt($route.params.slug) === item.id ? 'bg-grey-lighter' : 'hover:bg-grey-lightest'"
              v-for="item in messages"
              :key="item.id"
              @click="goTo(item.id)"
            >
              <div class="w-1/6">
                <img src="https://image.flaticon.com/icons/svg/236/236832.svg" width="50" />
              </div>
              <div class="hidden md:block w-5/6 px-2">
              <div class="flex justify-between items-center">
                <span v-if="!isReceiver(item)" :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''">{{ item.receiver_first_name }} {{ item.receiver_last_name }}</span>
                <span v-if="isReceiver(item)" :class="parseInt($route.params.slug) === item.id ? 'font-bold' : ''">{{ item.sender_first_name }} {{ item.sender_last_name }}</span>
                <span class="h-2 w-2 py-1 px-1 bg-green-light rounded-full"></span>
              </div>
              <div class="flex">
                <p class="text-sm truncate w-full">{{ item.message }}</p>
                <span class="text-sm text-grey-darker">2hrs</span>
              </div>
              </div>
            </div>
          </div>
          <!-- No results -->
          <span v-if="messages.length === 0 && showResult === true" class="flex h-full items-center justify-center font-bold text-grey">Nothing to show</span>
          </div>
        </div> 
        <button class="bg-yellow-dark border-yellow-dark text-sm md:mx-2 md:my-4 p-4 md:text-lg focus:outline-none" @click="createMessage">Create Message</button>
      </div>
    </div>
</template>
<script>
import AppInput from '~/components/Base/AppInput';
export default {
  components: {
    AppInput
  },
  data() {
    return {
      search_text: "",
      messages: [],
      showResult: false
    };
  },
  props: {
    conversations: {
      type: Array,
      required: true
    }
  },
  watch: {
     $route(to, from) {
      //  what happen
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
    goTo(id) {
      this.$router.push(`/messages/${id}`)
      // console.log(this.conversations)
    },
    getResults(value){
      let search = this.search_text
      this.$axios.$get(`/api/v1/conversations/?search=${search}`).then(res => {
          this.messages = res.data.conversations
          this.showResult = true
      })
    },
    createMessage(){
      this.$router.push(`/messages/new`)
    },
    isReceiver(item) {
      return this.$auth.user.id === item.receiver_id
    }
  }
}
</script>
<style scoped>
.messages-left-panel {
  width: 100%;
  float: left;
  min-height: 80vh;
  max-height: 80vh;
}

.chat-list::-webkit-scrollbar{
  width: 8px;
}

.chat-list::-webkit-scrollbar-track{
  background: transparent;
}

.chat-list::-webkit-scrollbar-thumb{
  background: #ccc;
  border-radius: 50px;
}
@media screen and (min-width: 576px){
  .messages-left-panel{
    min-width: 30vw;
    max-width: 30vw;
  }
}

@media screen and (min-width: 768px){
  .messages-left-panel{
    min-width: 25vw;
    max-width: 25vw;
  }
}

@media screen and (min-width: 1200px){
  .messages-left-panel{
    min-width: 18vw;
    max-width: 18vw;
  }
}
</style>
