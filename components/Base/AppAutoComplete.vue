<template>
  <div class="relative flex flex-col py-2 mb-3 md:mb-6" v-on-clickaway="toggledOff">
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
        @input="$emit('input', $event.target.value)"
      />
    </div>
    <transition name="fade">
      <div class="relative z-10" v-if="showLists">
        <div class="w-full absolute bg-white shadow-md" v-if="results.length > 0">
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
        <div
          class="absolute w-full text-sm p-2 bg-white shadow-md"
          style="bottom: -26px;"
          v-if="results.length === 0"
        >No results found</div>
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
    data: String,
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
      showLists: false,
      results: [],
      activeIndex: 0
    };
  },
  watch: {
    value(value) {
      // this.search = value;
    },
    search(value) {
      if (value) {
        this.getSurgeries(value);
      } else {
        this.showLists = false;
        this.$emit("input", "");
      }
    }
  },
  mounted() {
    this.search = this.value;
  },
  methods: {
    add() {
      let selectedSurgery = this.results[this.activeIndex];
      if (!selectedSurgery) {
        return;
      }
      console.log(selectedSurgery);
      this.showLists = false;
      if (this.keyword === "practices") {
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
          })
          .catch(err => {
            console.log("err", err.response || err);
            if (err.response.data.message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
          });
      } else {
        this.$emit("input", selectedSurgery.id.toString());
        this.search = selectedSurgery.name;
      }
    },
    getSurgeries: debounce(function(input) {
      const params = {
        search: input,
        limit: 5
      };
      this.$axios
        .$get(this.url, { params })
        .then(res => {
          if (this.keyword && this.keyword === "practices") {
            this.results = res.data.users;
          } else {
            this.results = res.data.surgeries;
          }
          this.showLists = true;
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        });
    }, 500),
    toggledOn() {
      if (this.search && this.search.length) {
        this.showLists = true;
      }
    },
    toggledOff() {
      this.showLists = false;
    },
    handleKeyDownEvent(e) {
      if (!this.showLists) {
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

