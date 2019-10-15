<template>
  <div class="flex flex-col py-2 mb-6" v-on-clickaway="toggledOff">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
      <div class="flex">
        <div
          class="bg-red-500 ml-2 p-1 text-xs sm:text-base text-white"
          v-if="error"
        >{{error.message}}</div>
      </div>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <input
        v-model="search"
        ref="search"
        type="text"
        :placeholder="placeholder"
        class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
        :class="error? 'border-red-500':''"
        :style="inStyle"
        @focus="toggledOn"
        @keydown="handleKeyDownEvent"
      />
    </div>
    <div v-if="results.length === 0 && search" class="text-sm py-2 text-gray-500">No results found</div>
    <transition name="fade">
      <div class="relative z-10" v-if="showResults">
        <div class="w-full absolute bg-white shadow-md">
          <div
            v-for="(item, index) in results"
            :key="index"
            class="flex flex-row flex-no-wrap justify-start p-2 text-xs border-b-2 cursor-pointer"
            :class="{'bg-gray-300': activeIndex === index}"
            @mouseover="activeIndex = index"
            @click="add"
          >
            <template v-if="keyword === 'practices'">
              <span v-if="$auth.user.domain === 'Practice'" class="flex justify-center">
                <AppAvatar
                  class="w-10 h-10 rounded-full border"
                  :width="'40px'"
                  :height="'40px'"
                  :src="item.avatar ? item.avatar.file.url : ''"
                />
              </span>
              <div class="w-full flex flex-col justify-center mx-2 leading-none">
                <p
                  class="font-bold text-base"
                >{{ item.personal_detail.first_name }} {{ item.personal_detail.last_name }}</p>
                <p
                  v-if="item.practice_detail"
                  class="text-gray-600"
                >{{ item.practice_detail.practice_role }}</p>
              </div>
            </template>
            <template v-else>
              <div class="leading-normal mx-2">
                <span v-text="item.name"></span>
                <span
                  class="text-gray-500"
                  v-text="`${item.clinical_commissioning_group.name} ${item.code}`"
                ></span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import AppAvatar from "@/components/Base/AppAvatar";
import { mixin as clickaway } from "vue-clickaway";
export default {
  components: {
    AppAvatar
  },
  mixins: [clickaway],
  props: {
    value: String,
    name: String,
    label: String,
    placeholder: String,
    url: String,
    keyword: String,
    error: Object,
    inStyle: String
  },
  computed: {
    conversations() {
      return this.$store.getters["chat/getConversations"];
    }
  },
  data() {
    return {
      search: "",
      showResults: false,
      results: [],
      activeIndex: 0
    };
  },
  watch: {
    value(surgery) {
      this.search = surgery;
    },
    search(value) {
      if (value) {
        this.getSurgeries(value);
      } else {
        this.showResults = false;
        this.$emit("input", "");
      }
    }
  },
  methods: {
    add() {
      let selectedSurgery = this.results[this.activeIndex];
      // this.results = [];
      this.showResults = false;
      if (this.keyword === "practices") {
        if (!selectedSurgery){
          return
        }
        this.$axios
          .$get(`/api/v1/conversations?user_id=${selectedSurgery.id}`)
          .then(res => {
            if (res.data.user) {
              this.$emit("newConversation", res.data.user);
            } else if (res.data.conversation) {
              let id = res.data.conversation.conversation_id;
              if (!this.conversations.find(item => item.id == id)) {
                this.$store.dispatch("chat/fetchMoreConversation", {
                  offset: this.conversations.length
                });
              }
              this.$router.push(`/messages/${id}`);
            }
          });
      } else {
        this.$emit("input", selectedSurgery.name);
      }
      this.search = "";
    },
    getSurgeries: debounce(function(input) {
      const params = {
        search: input,
        limit: 5
      };
      this.$axios.$get(this.url, { params }).then(res => {
        if (this.keyword && this.keyword === "practices") {
          this.results = res.data.users;
        } else {
          this.results = res.data.surgeries;
        }
        this.showResults = true;
      });
    }, 250),
    toggledOn() {
      if (this.search.length) {
        this.showResults = true;
      }
    },
    toggledOff() {
      this.showResults = false;
    },
    handleKeyDownEvent(e) {
      if (!this.showResults) {
        return;
      }
      if (event.key === "ArrowUp") {
        if (this.activeIndex === 0) {
          this.activeIndex = 4;
        } else {
          this.activeIndex--;
        }
      }
      if (event.key === "ArrowDown") {
        if (this.activeIndex === 4) {
          this.activeIndex = 0;
        } else {
          this.activeIndex++;
        }
      }
      if (event.key === "Enter") {
        this.add();
      }
      if (event.key === "Escape" || event.key === "Tab") {
        this.toggledOff();
      }
    }
  }
};
</script>
<style scoped>
.icon {
  max-width: 1rem;
  max-height: 1rem;
  min-width: 1rem;
  min-height: 1rem;
}
</style>

