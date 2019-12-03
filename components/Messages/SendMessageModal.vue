<template>
  <transition name="fade" mode="in-out">
    <section class="px-2 md:px-0 w-full">
      <div class="w-full flex flex-col bg-white p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center pb-2">
          <div class="flex items-center">
            <svgicon name="chat" height="20" width="20" color="#888 #555 #fff" class="mr-2" />
            <span class="font-bold">{{ this.user.personal_detail.name }}</span>
          </div>
          <div class="flex items-center">
            <!-- <div class="px-2 font-bold text-lg hover:text-gray-500 cursor-pointer" @click="$emit('close')">x</div> -->
            <svgicon
              @click="showDropDown = !showDropDown"
              name="menu"
              height="24"
              width="24"
              class="cursor-pointer fill-current p-1"
            />
          </div>
        </div>
        <div class="relative">
          <MessageForm :wrapperClass="'flex-col custom'" :inClass="'min-height'" :user="user" />
          <transition name="drop-down">
            <ul
              v-if="showDropDown"
              class="absolute right-0 top-0 bg-white border-b border-l border-r text-sm"
            >
              <li
                class="hover:bg-yellow-500 cursor-pointer px-3 py-1"
                @click="openConversation"
                v-if="conversation_id"
              >Conversation</li>
              <li
                v-if="!['Completed','Allocated','Ongoing','Approved'].includes($route.query.status)"
                class="hover:bg-yellow-500 cursor-pointer px-3 py-1"
                @click="$emit('showProfile'), showDropDown = false"
              >Profile</li>
              <li
                class="hover:bg-gray-300 cursor-pointer px-3 py-1 border-t"
                @click="$emit('close'), showDropDown = false"
              >Close</li>
            </ul>
          </transition>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
import MessageForm from "~/components/Messages/CenterPanel/MessagesCenterPanelForm";
import AppInput from "~/components/Base/AppInput";
import AppButton from "~/components/Base/AppButton";
export default {
  components: {
    AppInput,
    AppButton,
    MessageForm
  },
  props: {
    show: {
      default: false,
      type: Boolean
    },
    user: {
      type: Object
    },
    
  },
  data() {
    return {
      conversation_id: "",
      showDropDown: false
    };
  },
  computed: {
    messageSent() {
      return this.$store.state.chat.messageSent;
    }
  },
  created() {
    this.showDropDown = false;
    this.$axios
      .$get(`/api/v1/conversations?user_id=${this.user.id}`)
      .then(res => {
        if (res.data.conversation) {
          this.conversation_id = res.data.conversation.conversation_id;
        } else if (!res.data.conversation) {
          this.conversation_id = null;
        }
      });
  },
  watch: {
    messageSent(value) {
      if (value === false) {
        setTimeout(() => {
          this.$emit("close");
        }, 500);
      }
    }
  },
  methods: {
    openConversation() {
      if (this.conversation_id) {
        this.$router.push(`/messages/${this.conversation_id}`);
      }
    }
  }
};
</script>

<style>
.min-height {
  min-height: 200px;
}
.custom button {
  padding: 10px;
}
</style>