<template>
  <div class="panel-top p-4 w-full flex items-center border-b leading-none">
    <div class="pr-4 md:hidden">
      <button class="focus:outline-none" @click="goBack()">
        <svgicon name="left-arrow" height="20" width="20" />
      </button>
    </div>
    <div class="flex flex-col justify-center">
      <div class="font-bold md:text-lg">
        <span>{{ details.name }}</span>
      </div>
      <div class="text-xs md:text-sm text-gray-600">
        <span class>{{ details.profession }}</span>
        <span v-if="$route.name === 'messages-slug'" class="inline-block px-2 text-lg">|</span>
        <span
          v-if="$route.name === 'messages-slug'"
          :class="details.status ? 'bg-green-400' : 'bg-gray-300'"
          class="inline-block rounded-full"
          style="padding: 5px"
        ></span>
        <p
          v-if="$route.name === 'messages-slug'"
          class="inline-block"
        >{{ details.status ? 'Online' : 'Offline' }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messages: [],
      details: {
        id: "",
        name: "",
        profession: "",
        status: false
      }
    };
  },
  computed: {
    usersOnline() {
      return this.$store.state.chat.usersOnline;
    },
    activeConversationId() {
      return this.$store.state.chat.activeConversationId;
    },
    conversations() {
      return this.$store.state.chat.conversations;
    },
    newUserMessage() {
      return this.$store.state.chat.newMessageUser;
    }
  },
  created() {
    this.getDetails();
    let isOnline = this.usersOnline.includes(this.details.id);
    this.details.status = isOnline;
  },
  watch: {
    usersOnline(value) {
      let isOnline = value.includes(this.details.id);
      this.details.status = isOnline;
    },
    $route(to, from) {
      this.getDetails();
    }
  },
  methods: {
    getDetails() {
      if (this.$route.name === "messages-new") {
        this.details.name = `${this.newUserMessage.personal_detail.first_name} ${this.newUserMessage.personal_detail.last_name}`;
        this.details.profession = this.newUserMessage.locum_detail
          ? this.newUserMessage.locum_detail.profession.name
          : this.newUserMessage.practice_detail.practice_role;
      } else if (
        this.$route.name === "messages-slug" &&
        this.$route.params.slug
      ) {
        let conversation_details = this.conversations.find(
          details => details.id.toString() === this.$route.params.slug
        );
        let user_details = conversation_details.conversation_member_users.find(
          detail => detail.user.id != this.$auth.user.id
        );
        this.details.id = user_details.user.id;
        let isOnline = this.usersOnline.includes(this.details.id);
        this.details.status = isOnline;
        this.details.name =
          conversation_details.type === "Private"
            ? `${user_details.user.personal_detail.first_name} ${user_details.user.personal_detail.last_name}`
            : conversation_details.title;
        this.details.profession = user_details.user.locum_detail
          ? user_details.user.locum_detail.profession.name
          : user_details.user.practice_detail.practice_role;
      }
    },
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
