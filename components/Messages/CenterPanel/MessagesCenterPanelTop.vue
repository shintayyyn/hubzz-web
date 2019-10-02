<template>
  <div
    class="panel-top px-4 md:p-4 w-full flex items-center border-b leading-none"
    :class="$auth.user.domain === 'Locum' ? 'py-3' : 'pb-4 pt-6'"
  >
    <div class="pr-4 md:hidden">
      <button class="focus:outline-none" @click="goBack()">
        <svgicon name="left-arrow" height="20" width="20" />
      </button>
    </div>
    <div class="flex flex-col justify-center" v-if="userDetail">
      <div class="font-bold md:text-lg">
        <span>{{ userDetail.name }}</span>
      </div>
      <div class="flex flex-col md:flex-row md:items-center text-xs md:text-sm text-gray-600">
        <span class>{{ userDetail.profession }}</span>
        <span v-if="$route.name === 'messages-slug'" class="hidden md:block mx-1 text-lg">|</span>
        <div class="flex items-center">
          <span
            v-if="$route.name === 'messages-slug'"
            :class="userDetail.status ? 'bg-green-400' : 'bg-gray-300'"
            class="rounded-full mr-1"
            style="padding: 5px"
          ></span>
          <p
            v-if="$route.name === 'messages-slug'"
            class="inline-block"
          >{{ userDetail.status ? 'Online' : 'Offline' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { parse } from "cookie";
export default {
  data() {
    return {
      messages: []
    };
  },
  computed: {
    activeConversationId() {
      return this.$store.state.chat.activeConversationId;
    },
    conversations() {
      return this.$store.getters["chat/getConversations"];
    },
    newUserMessage() {
      return this.$store.state.chat.newMessageUser;
    },
    userDetail() {
      let detail = null;
      if (this.activeConversationId) {
        let active_conversation = this.conversations.find(
          conversation => conversation.id == parseInt(this.activeConversationId)
        );
        if (active_conversation) {
          let user = active_conversation.conversation_member_users.find(
            member => member.user.id !== this.$auth.user.id
          );
          let detail = {
            name: `${user.user.personal_detail.first_name} ${user.user.personal_detail.last_name}`,
            profession: user.user.practice_detail
              ? user.user.practice_detail.practice_role
              : user.user.locum_detail.profession.name,
            status: user.user.is_online
          };
          return detail;
        }
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
@media screen and (min-width: 768px) {
  .panel-top {
    min-height: 82px;
  }
}
</style>
