<template>
  <div class="panel-top p-4 w-full flex items-center border-b leading-none">
    <div class="pr-4 md:hidden">
      <button class="focus:outline-none" @click="goBack()">
        <svgicon name="left-arrow" height="20" width="20" />
      </button>
    </div>
    <div class="flex flex-col justify-center" v-if="userDetail">
      <div class="font-bold md:text-lg">
        <span>{{ userDetail.name }}</span>
      </div>
      <div class="text-xs md:text-sm text-gray-600">
        <span class>{{ userDetail.profession }}</span>
        <span v-if="$route.name === 'messages-slug'" class="inline-block px-2 text-lg">|</span>
        <span
          v-if="$route.name === 'messages-slug'"
          :class="userDetail.status ? 'bg-green-400' : 'bg-gray-300'"
          class="inline-block rounded-full"
          style="padding: 5px"
        ></span>
        <p
          v-if="$route.name === 'messages-slug'"
          class="inline-block"
        >{{ userDetail.status ? 'Online' : 'Offline' }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messages: [],
      activeConversation: null
    };
  },
  computed: {
    activeConversationId() {
      return this.$store.state.chat.activeConversationId;
    },
    conversations() {
      return this.$store.state.chat.conversations;
    },
    newUserMessage() {
      return this.$store.state.chat.newMessageUser;
    },
    userDetail() {
      let detail = null;
      if (this.activeConversationId) {
        this.$axios
          .$get(`/api/v1/conversations/${this.activeConversationId}`)
          .then(res => {
            let active_conversation = res.data.conversations.find(
              item => item.id == parseInt(this.activeConversationId)
            );
            let user = active_conversation.conversation_member_users.find(
              member => member.user.id !== this.$auth.user.id
            );
            this.activeConversation = {
              name: `${user.user.personal_detail.first_name} ${user.user.personal_detail.last_name}`,
              profession: user.user.practice_detail
                ? user.user.practice_detail.practice_role
                : user.user.locum_detail.profession.name,
              status: user.user.is_online
            };
          })
          .catch(e => {
            console.log(e);
          });
        return this.activeConversation;
        // this.active_conversation = this.$store.state.chat.conversations.find(
        //   conversation =>
        //     conversation.id == this.$store.state.chat.activeConversationId
        // );
        // let user = active_conversation.conversation_member_users.find(
        //   member => member.user.id !== this.$auth.user.id
        // );
        // let detail = {
        //   name: `${user.user.personal_detail.first_name} ${user.user.personal_detail.last_name}`,
        //   profession: user.user.practice_detail
        //     ? user.user.practice_detail.practice_role
        //     : user.user.locum_detail.profession.name,
        //   status: user.user.is_online
        // };
        // console.log("detail", detail);
        // return detail;
      } else {
        let detail = {
          name: `${this.newUserMessage.personal_detail.first_name} ${this.newUserMessage.personal_detail.last_name}`,
          profession: this.newUserMessage.locum_detail
            ? this.newUserMessage.locum_detail.profession.name
            : this.newUserMessage.practice_detail.practice_role
        };
        return detail;
      }
    }
  },
  methods: {
    goBack() {
      if (this.$route.path != "/messages") {
        this.$router.push(`/messages`);
      }
    }
  }
};
</script>
<style>
.panel-top {
  min-height: 77px;
}
</style>
