<template>
  <div class="modal-container shadow-lg">
    <div class="flex flex-col items-start p-4 md:p-8">
      <div class="flex">
        <nuxt-link :to="{ path: `/my-banks`, query: { ...$route.query }}" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" width="32" />
        </nuxt-link>
        <button
          class="ml-4 focus:outline-none"
          @click.prevent.stop="message($route.params.locumId)"
        >
          <svgicon name="chat" height="32" width="32" color="#6b778b #4a5568 #fff" />
        </button>
      </div>
      <div class="w-full flex flex-row justify-start overflow-x-auto mt-4">
        <nuxt-link
          :to="{ path: `/my-banks/${$route.params.locumId}`, query: { ...$route.query }}"
          :event="$route.name === 'my-banks-index-locumId-index' ? '':'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name === 'my-banks-index-locumId-index' || $route.name === `my-banks-index-locumId-index-profile` ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Profile
        </nuxt-link>
        <nuxt-link
          :to="{ path: `/my-banks/${$route.params.locumId}/related-jobs`, query: { ...$route.query }}"
          :event="$route.name.includes(`my-banks-index-locumId-index-related-jobs`) ? '':'click'"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes(`my-banks-index-locumId-index-related-jobs`) ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Related Jobs
        </nuxt-link>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="sendMessageModal" class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3">
          <SendMessageModal :user="user" @close="sendMessageModal=false" />
        </div>
      </transition>
      <div v-if="sendMessageModal" class="shield" @click="sendMessageModal=false" />
      <div class="w-full mt-5">
        <nuxt-child />
      </div>
    </div>
  </div>
</template>
<script>
import SendMessageModal from "@/components/Messages/SendMessageModal"
export default {
  components: {
    SendMessageModal
  },
  props: ["locumType"],
  data () {
    return {
      user: [],
      sendMessageModal: false
    }
  },
  methods: {
    message (id) {
      this.$axios.$get(`/api/v1/practice/locums/${id}`).then(res => {
        this.user = res.data.user
        this.sendMessageModal = true
      })
    }
  }
}
</script>

<style>
.modal-container {
  z-index: 60;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>