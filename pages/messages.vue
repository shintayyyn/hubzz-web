<template>
  <section class="messages-section border">
    <MessagesLeftPanel />
    <nuxt-child />
  </section>
</template>
<script>
import MessagesLeftPanel from "@/components/Messages/LeftPanel/MessagesLeftPanel";
import * as chatApi from "@/api/chat";
export default {
  components: {
    MessagesLeftPanel
  },
  async asyncData({ app, store, route, params, redirect }) {
    const response = await chatApi.fetchConversations(app.$axios, 0, 10);
    const conversations = response.data.conversations;
    store.commit("chat/SET_CONVERSATIONS", conversations);
  },
  computed: {
    socketId() {
      return this.$store.state.socket_id;
    },
    conversations() {
      return this.$store.getters["chat/getConversations"];
    },
    activeConversationId() {
      return this.$store.state.chat.activeConversationId;
    }
  },
  watch: {
    $route(to, from) {
      if (to.name === "messages-slug") {
        if (to.path === "/messages") {
          this.$store.commit("IS_MOBILE", true);
          this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION");
        } else {
          this.$store.dispatch("chat/setActiveConversation", to.params.slug);
        }
      }
    },
    socketId(value) {
      this.$store.dispatch("joinRoom", {
        socket_id: value,
        room_name: "messageroom"
      });
    }
  },
  beforeDestroy() {
    this.$store.dispatch("leaveRoom", {
      socket_id: this.$socket.id,
      room_name: "messageroom"
    });
  },
  created() {
    this.$store.dispatch("chat/setActiveConversation", this.$route.params.slug);
    // this.$axios.$get(`/api/v1/messages/user-presence`).then(res => {
    //   this.$store.commit("chat/SET_USERS_ONLINE", res.data.users);
    // });
  },
  mounted() {
    if (this.socketId) {
      this.$store.dispatch("joinRoom", {
        socket_id: this.socketId,
        room_name: "messageroom"
      });
    }
    if (!this.$auth.loggedIn) {
      return this.$router.push("/");
    }
    if (window.innerWidth > 768) {
      if (this.conversations.length === 0) {
        this.$router.push(`/messages/new`);
      } else {
        this.goToFirstConversation();
      }
    } else {
      if (this.$route.path === "/messages") {
        this.$store.commit("IS_MOBILE", true);
      }
      this.$store.commit("chat/DELETE_ACTIVE_CONVERSATION");
    }
  },
  methods: {
    goToFirstConversation() {
      let conversation = this.conversations.find(
        (conversation, index) => index === 0
      );
      if (this.$route.params.slug != conversation.id.toString()) {
        this.$router.push(`/messages/${conversation.id}`);
      }
    }
  }
};
</script>
<style scoped>
.messages-section {
  overflow: hidden;
  display: flex;
  min-height: 80vh;
  max-height: 80vh;
  width: 100%;
}

@media screen and (min-width: 1200px) {
  .messages-section {
    width: 80%;
  }
}
</style>

