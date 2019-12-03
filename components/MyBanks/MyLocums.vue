<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div
      class="w-full md:w-1/3 lg:w-1/4 rounded-lg shadow-lg bg-gray-300 m-2 p-4 hover:bg-gray-400"
      v-for="user in users"
      :key="user.id"
    >
      <div class="flex justify-end z-50" v-if="authPermissions.includes('Favorite MyBanks Locum')">
        <template v-if="user.is_favorite">
          <svgicon
            name="on-star"
            height="32"
            width="32"
            class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
            @click="$emit('favorite', user.id)"
          />
        </template>
        <template v-else>
          <svgicon
            name="off-star"
            height="32"
            width="32"
            class="cursor-pointer fill-current text-gray-700 hover:text-gray-800"
            @click="$emit('favorite', user.id)"
          />
        </template>
         <transition name="fade" mode="out-in">
          <div class="message-modal md:w-2/3 lg:w-1/2 xl:w-1/3" v-if="sendMessageModal">
            <SendMessageModal
                :user="user"
                @close="sendMessageModal=false"
                @showProfile="show(user.id)"
              />
          </div>
          </transition>      
          <div class="shield" v-if="sendMessageModal" @click="sendMessageModal=false"></div>
      </div>

      <div class="flex flex-wrap text-center mt-4 cursor-pointer" @click="$emit('show', user.id)">
        <div class="w-full flex justify-center">
          <AppAvatar
            :src="user.avatar && user.avatar.file && user.avatar.file.url ? user.avatar.file.url : ''"
          />
        </div>

        <div
          class="w-full font-bold text-sm sm:text-lg my-4 leading-tight"
        >{{user.personal_detail.name}}</div>
        <div
          class="w-full mb-4 font-bold text-gray-700 text-sm leading-tight"
        >{{user.locum_detail.profession.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import AppAvatar from "@/components/Base/AppAvatar";
import SendMessageModal from "@/components/Messages/SendMessageModal";
export default {
  props: ["users"],
  components: {
    AppAvatar,
    SendMessageModal
  },
  data(){
    return{
      sendMessageModal: false
    }
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  }
};
</script>