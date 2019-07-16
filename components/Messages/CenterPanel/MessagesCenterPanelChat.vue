<template>
  <div class="panel-chat overflow-y-auto" ref="messagesContainer" @scroll="scrollHandler">
    <div class="flex flex-col">
      <div v-for="(item, index) in messages" :key="item.id">
        <div class="flex flex-col" :id="`message-${index}`">
          <div
            v-if="isDeleted(item.sender_id, item.deleted_by_sender, item.receiver_id, item.deleted_by_receiver)"
            class="flex"
            :class="isReceiver(item) ? 'justify-start': 'justify-end'"
          >
            <div
              class="my-1 rounded-lg text-xs px-2 py-1 bg-red-light text-white"
              :class="{'mx-4' : !isReceiver(item)}"
            >Deleted</div>
          </div>
          <div v-else class="flex" :class="isReceiver(item) ? 'justify-start': 'justify-end'">
            <div
              class="my-1 rounded-lg text-xs px-2 py-1"
              :class="isReceiver(item) ? 'bg-grey-light' : 'bg-blue-light text-white'"
            >{{item.message}}</div>
            <div
              class="text-xs font-bold text-grey-dark m-1 cursor-pointer"
              @click="$emit('delete-confirmation', item.id)"
            >X</div>
          </div>
          {{index}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['messages'],
  data() {
    return {
      oldMessageCount: null
    }
  },
  mounted() {
    this.scrollToBottom()
  },
  watch: {
    $route(to, from) {
      if (this.$refs.messagesContainer) {
        this.scrollToBottom()
      }
    },
    messages(value) {
      console.log(value)
      let index = value.length - this.oldMessageCount
      console.log(index)
      let messageSample = document.getElementById(`message-${index}`)
      console.log(messageSample)
      // console.log(document.getElementById(`message-${value.length - this.oldMessageCount}`))
    },
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
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
        this.$emit('fetch-more-messages')
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
    }
  }
}
</script>
<style scoped>
.panel-chat {
  min-height: 500px;
  max-height: 500px;
}
.message-chat:hover {
  background-color: #dee1e5;
  transition: background-color 0.5s ease-in-out;
}
.message-chat {
  background-color: white;
  transition: background-color 0.5s ease-in-out;
}
</style>
