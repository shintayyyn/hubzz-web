<template>
  <div class="app-notification">
    <div
      class="relative rounded-b-lg py-2 px-4 md:px-8 flex text-center"
      :class="notificationStatus"
      v-if="$store.state.notification.enabled && $store.state.notification.status != 'message'"
    >
      <span class="mr-2 inline-block align-middle">
        <svgicon :name="notificationIcon" height="20" width="20" :color="iconSvgColor" />
      </span>
      <div
        class="font-bold text-sm leading-normal inline-block"
        v-for="(message, index) in $store.state.notification.text"
        :key="index"
      >{{message}}</div>
    </div>
    <transition name="slide" mode="out-in">
      <div
        v-if="$store.state.notification.status === 'message' && !$route.path.includes('messages')"
        class="fixed bottom-0 right-0 m-4 px-6 py-4 flex items-center justify-between max-w-full w-64 cursor-pointer opacity-75 hover:opacity-100"
        :class="notificationStatus"
        @click="view"
      >
        <div
          class="flex flex-col leading-none"
          v-for="(message, index) in $store.state.notification.text"
          :key="index"
        >
          <span class="font-bold">New Message from {{ message.title }}</span>
          <span class="text-sm py-1">{{ message.message }}</span>
          <span class="text-sm text-blue-300">{{ $moment(message.time).fromNow() }}</span>
        </div>
        <div class="inline-block">
          <div
            class="inline-block pl-4 text-lg font-bold text-blue-300 hover:text-white cursor-pointer"
            @click="close"
            v-if="closable"
          >x</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  computed: {
    notificationStatus() {
      switch (this.$store.state.notification.status) {
        case "success":
          return "bg-green-400 text-white";
          break;
        case "danger":
          return "bg-red-500 text-white";
          break;
        case "uploading":
          return "bg-yellow-500 text-white";
          break;
        case "alert":
          return "bg-yellow-400";
          break;
        case "info":
          return "bg-blue-500 text-white";
          break;
        case "message":
          return "bg-blue-500 text-white";
          break;
        default:
          return "bg-white";
      }
    },
    notificationIcon() {
      switch (this.$store.state.notification.status) {
        case "success":
          return "success-checkmark";
          break;
        case "danger":
          return "exclamation-mark";
          break;
        case "uploading":
          return "cloud-upload";
          break;
        case "alert":
          return "alert";
          break;
        case "info":
          return "info";
          break;
        case "message":
          return "chat";
          break;
        default:
          return "alert";
      }
    },
    iconSvgColor() {
      switch (this.$store.state.notification.status) {
        case "success":
          return "#fff";
          break;
        case "danger":
          return "#fff";
          break;
        case "uploading":
          return "#fff";
          break;
        case "info":
          return "#dae1e7";
          break;
        case "message":
          return "#dae1e7";
          break;
        default:
          return "#fff, #000";
      }
    },
    notify() {
      return this.$store.state.notification.enabled;
    },
    closable() {
      return this.$store.state.notification.closable;
    },
    conversations() {
      return this.$store.getters["chat/getConversations"];
    }
  },
  watch: {
    notify(value) {
      if (!this.$store.state.notification.closable) {
        setTimeout(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: false,
            status: "",
            text: "",
            closable: false
          });
        }, 2000);
      }
    }
  },
  methods: {
    close() {
      this.$store.commit("SET_NOTIFICATION", {
        enabled: false,
        status: "",
        text: ""
        // closable: false
      });
    },
    view() {
      if (this.$store.state.notification.status === "message") {
        let conversation = this.conversations.find(
          (conversation, index) => index === 0
        );
        this.close();
        this.$router.push(`/messages/${conversation.id}`);
        this.$store.commit("chat/DELETE_UNREAD_MESSAGE", conversation.id);
      }
    }
  }
};
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
