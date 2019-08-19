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

    // if (route.name === 'messages-slug') {
    //   redirect(`/messages/${params.slug}`)
    // }
  },
  computed: {
    socketId() {
      return this.$store.state.socket_id;
    },
    conversations() {
      return this.$store.getters["chat/getConversations"];
    }
  },
  watch: {
    $route(to, from) {
      if (to.params.slug) {
        this.$store.dispatch("chat/setActiveConversation", to.params.slug);
      }
      if (to.path === "/messages") {
        if (window.innerWidth < 768) {
          this.$store.commit("IS_MOBILE", true);
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
    console.log("created parent");
    this.$store.dispatch("chat/setActiveConversation", this.$route.params.slug);
    this.$axios.$get(`/api/v1/messages/user-presence`).then(res => {
      this.$store.commit("chat/SET_USERS_ONLINE", res.data.users);
    });
  },
  mounted() {
    // console.log("mounted parent");
    if (!this.$route.params.slug) {
      this.$store.commit("IS_MOBILE", true);
    }
    if (this.socketId) {
      this.$store.dispatch("joinRoom", {
        socket_id: this.socketId,
        room_name: "messageroom"
      });
    }
    if (!this.$auth.loggedIn) {
      return this.$router.push("/");
    }
    if (this.conversations.length > 0 && !this.$route.params.slug) {
      // ! conditional responsive if web view
      if (window.innerWidth > 768) {
        this.goToFirstConversation();
      }
    }
  },
  methods: {
    goToFirstConversation() {
      let conversation = this.conversations.find(
        (conversation, index) => index === 0
      );
      this.$router.push(`/messages/${conversation.id}`);
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
    width: 53vw;
  }
}
</style>

