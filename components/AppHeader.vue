<template>
  <section class="header-section fixed bg-white z-50">
    <div class="px-4 flex flex-row flex-wrap justify-between" style="z-index: 600">
      <div class="lg:w-1/3">
        <div class="burger cursor-pointer py-2" @click="toggle">
          <div class="my-2 bg-yellow-500"></div>
          <div class="my-2 bg-yellow-500"></div>
        </div>
      </div>
      <div class="flex w-1/3 sm:w-1/3 py-2">
        <button @click="$router.push('/')" class="mx-auto focus:outline-none">
          <img src="/images/hubzz-icon-transparent.png" class="logo" />
        </button>
      </div>
      <div class="w-1/3 text-right leading-loose py-2">
        <div
          class="flex flex-row-reverse flex-wrap justify-start items-center"
          v-if="$auth.loggedIn"
        >
          <div class="flex justify-end">
            <div v-if="$auth.user.domain === 'Practice' && $auth.user.status === 'Active'">
              <AppButton
                :label="'Create Job'"
                @click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
                :inStyle="'font-size: medium; padding:10px;'"
                class="hidden md:block mb-2 md:mx-2 leading-none"
              />
              <button
                @click="$store.commit('calendar/CREATE_JOB_MODAL', true)"
                class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer mx-2"
              >
                <svgicon name="create-job" color="#444 #555" width="21" height="21"></svgicon>
              </button>
            </div>
            <AppButton
              v-if="$route.name != 'messages-slug' && $route.name != 'messages-new'"
              :label="unreadMessages.length > 0 ? `Messages(${unreadMessages.length})` : 'Messages'"
              @click="$router.push('/messages')"
              :inStyle="'font-size: medium; padding:2px 14px;'"
              class="hidden md:block"
            />
            <button
              v-if="$route.name != 'messages-slug' && $route.name != 'messages-new'"
              @click="$router.push('/messages')"
              class="block md:hidden button rounded-lg p-2 focus:outline-none cursor-pointer"
            >
              <svgicon name="chat" color="#888 #555 #fff" width="21" height="21"></svgicon>
            </button>
          </div>
          <div
            class="text-xs xl:text-sm mr-2"
            v-if="$auth.user.domain === 'Locum'"
          >{{$auth.user.email}}</div>
        </div>
      </div>
    </div>
    <div class="shield" v-if="create_job_modal"></div>
    <transition name="slide" mode="out-in">
      <template v-if="create_job_modal">
        <CreateJobModal v-if="create_job_modal" />
      </template>
    </transition>
  </section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import CreateJobModal from "@/components/CreateJobModal";
export default {
  components: {
    AppButton,
    CreateJobModal
  },
  computed: {
    create_job_modal() {
      return this.$store.state.calendar.create_job_modal;
    },
    conversations() {
      return this.$store.getters["chat/getConversations"];
    },
    unreadMessages() {
      return this.$store.getters["chat/getUnreadMessages"];
    }
  },
  watch: {
    create_job_modal(value) {
      if (value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    conversations(newValue) {
      let conversation = newValue.find((conversation, index) => index === 0);
      if (
        (this.$route.name && this.$route.name != "messages-slug") ||
        (this.$route.name && this.$route.name != "messages-new")
      ) {
        // this.$store.commit("chat/ADD_UNREAD_MESSAGE", conversation);
        // still working on this
        // if (
        //   this.$route.name != "messages-slug" &&
        //   this.$route.name != "messages-new" &&
        //   this.unreadMessages.length > 0
        // ) {
        // let sender_name = `${conversation.latest_conversation_message.user.personal_detail.first_name} ${conversation.latest_conversation_message.user.personal_detail.last_name}`;
        //   console.log("wae?", this.$route.name, conversation);
        //   this.$store.commit("SET_NOTIFICATION", {
        //     enabled: true,
        //     closable: true,
        //     status: "message",
        //     text: [
        //       {
        //         title: `${sender_name}`,
        //         message: `${sender_name}: ${conversation.latest_conversation_message.message}`,
        //         time: `${conversation.latest_conversation_message.created_at}`
        //       }
        //     ]
        //   });
        // }
      }
    },
    unreadMessages(value) {}
  },
  methods: {
    toggle() {
      this.$store.commit("TOGGLE_SIDEBAR", true);
      document.body.style.overflow = "hidden";
    }
  }
};
</script>

<style scoped>
.burger {
  display: block;
}
.burger div:first-child {
  width: 30px;
  height: 2px;
}
.burger div:nth-child(2) {
  width: 20px;
  height: 2px;
}
.logo {
  width: 25px;
}

@media screen and (max-width: 1199px) {
  .header-section {
    width: 100%;
  }
}
@media screen and (min-width: 1200px) {
  .burger {
    display: none;
  }
  .header-section {
    max-width: 1466px;
    right: 0;
    left: 200px;
    padding: 5px 30px;
  }
}
a {
  text-decoration: none;
  color: black;
}
.shield {
  z-index: 509;
}
</style>
