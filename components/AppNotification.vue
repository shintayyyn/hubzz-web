<template>
  <div class="app-notification">
    <transition name="drop">
      <div
        v-if="$store.state.notification.enabled && $store.state.notification.status !== 'message'"
        class="relative rounded-lg py-2 px-4 my-2 flex justify-center text-center"
        style="min-width: 200px"
        :class="notificationStatus"
      >
        <span class="mr-2 inline-block align-middle">
          <svgicon :name="notificationIcon" height="20" width="20" :color="iconSvgColor" />
        </span>
        <div
          v-for="(message, index) in $store.state.notification.text"
          :key="index"
          class="font-bold text-sm leading-normal inline-block"
        >
          {{ message }}
        </div>
      </div>
    </transition>

    <transition name="slide" mode="out-in">
      <div
        v-if="$store.state.notification.status === 'message' && !$route.path.includes('messages')"
        class="fixed bottom-0 right-0 m-4 px-6 py-4 flex items-center justify-between max-w-full w-64 cursor-pointer opacity-75 hover:opacity-100"
        :class="notificationStatus"
        @click="view"
      >
        <div
          v-for="(message, index) in $store.state.notification.text"
          :key="index"
          class="flex flex-col leading-none"
        >
          <span class="font-bold">New Message from {{ message.title }}</span>
          <span class="text-sm py-1">{{ message.message }}</span>
          <span class="text-sm text-blue-300">{{ $moment(message.time).fromNow() }}</span>
        </div>
        <div class="inline-block">
          <div
            v-if="closable"
            class="inline-block pl-4 text-lg font-bold text-blue-300 hover:text-white cursor-pointer"
            @click="close"
          >
            x
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      timeout: null,
    }
  },

  computed: {
    notificationStatus () {
      switch (this.$store.state.notification.status) {
      case "success":
        return "border border-green-500 bg-green-200 text-green-600"
      case "danger":
        return "border border-red-500 bg-red-200 text-red-600"
      case "uploading":
        return "border border-yellow-500 bg-yellow-200 text-yellow-600"
      case "alert":
        return "border border-orange-500 bg-orange-200 text-orange-600"
      case "info":
        return "border border-blue-500 bg-blue-100"
      case "message":
        return "border border-blue-500 bg-blue-100"
      default:
        return "border border-orange-500 bg-orange-200 text-orange-600"
      }
    },

    notificationIcon () {
      switch (this.$store.state.notification.status) {
      case "success":
        return "success-checkmark"
      case "danger":
        return "exclamation-mark"
      case "uploading":
        return "cloud-upload"
      case "alert":
        return "alert"
      case "info":
        return "info"
      case "message":
        return "chat"
      default:
        return "alert"
      }
    },

    iconSvgColor () {
      switch (this.$store.state.notification.status) {
      case "success":
        return "#38a169"
      case "danger":
        return "#e53e3e"
      case "uploading":
        return "#d69e2e"
      case "info":
        return "#3182ce"
      case "message":
        return "#3182ce"
      default:
        return "#fff, #000"
      }
    },

    notify () {
      return this.$store.state.notification.enabled
    },

    closable () {
      return this.$store.state.notification.closable
    },

    conversations () {
      return this.$store.getters["chat/getConversations"]
    },
  },

  watch: {
    notify () {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      if (!this.$store.state.notification.closable && this.notify) {
        this.timeout = setTimeout(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: false,
            status: "",
            text: "",
            closable: false,
            duration: "",
          })
        }, this.$store.state.notification.duration ? this.$store.state.notification.duration : 2000)
      }
    },
  },

  methods: {
    close () {
      this.$store.commit("SET_NOTIFICATION", {
        enabled: false,
        status: "",
        text: "",
        // closable: false
      })
    },

    view () {
      if (this.$store.state.notification.status === "message") {
        let conversation = this.conversations.find(
          (conversation, index) => index === 0
        )
        this.close()
        this.$router.push(`/messages/${conversation.id}`)
        this.$store.commit("chat/DELETE_UNREAD_MESSAGE", conversation.id)
      }
    },
  },

}
</script>

<style>
  .app-notification {
    position: fixed;
    top: 0;
    left: 40%;
    z-index: 700;
    display: flex;
    justify-content: center;
    margin-left: -40px;
  }

  @media screen and (max-width: 600px) {
    .app-notification {
      width: 100%;
      left: 0;
      margin-left: 0;
    }
  }
</style>
