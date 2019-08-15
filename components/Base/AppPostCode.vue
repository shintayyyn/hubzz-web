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
        class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
        :class="error? 'border-red-500':''"
        :style="inStyle"
        @focus="toggledOn"
        @keydown="handleKeyDownEvent"
      />
    </div>
    <transition name="fade">
      <div class="relative z-10" v-if="showLists">
        <div class="w-full absolute bg-white shadow-md">
          <div
            v-for="(item, index) in predictions"
            :key="index"
            class="flex flex-row flex-no-wrap justify-start p-2 text-xs border-b-2 cursor-pointer"
            :class="{'bg-gray-300': activeIndex === index}"
            @mouseover="activeIndex = index"
            @click="add()"
          >
            <div class="icon">
              <img :src="item.details.result.icon" />
            </div>
            <div class="leading-normal mx-2">
              <span
                v-html="mainTextFormat(item.structured_formatting.main_text, item.structured_formatting.main_text_matched_substrings[0].length)"
              ></span>
              <span
                class="text-gray-500"
                v-html="subTextFormat(item.structured_formatting.secondary_text, item.structured_formatting.secondary_text_matched_substrings ? item.structured_formatting.secondary_text_matched_substrings[0].length : 0)"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  props: {
    value: [String, Object],
    name: String,
    label: String,
    error: Object,
    inStyle: String
  },
  data() {
    return {
      search: "",
      showLists: false,
      predictions: [],
      activeIndex: 0
    };
  },
  watch: {
    value(post_code) {
      console.log('post_code', post_code)
      this.search = post_code;
    },
    search(value) {
      if (value) {
        this.getPredictions(value);
      } else {
        this.showLists = false;
      }
    }
  },
  methods: {
    add() {
      let selectedPostCode = this.predictions[this.activeIndex];
      this.predictions = [];
      this.showLists = false;
      this.$emit("onSelect", selectedPostCode);
    },
    getPredictions: debounce(function (input) {
      const params = {
        input: input
      };
      this.$axios.$get(`/api/v1/predictions`, { params }).then(res => {
        if (res.predictions.length > 0) {
          this.predictions = res.predictions;
          this.showLists = true;
        } else {
          this.predictions = [];
          this.showLists = false;
        }
      });
    }, 250),
    toggledOn() {
      if (this.search.length) {
        this.showLists = true;
      }
    },
    toggledOff() {
      this.showLists = false;
    },
    mainTextFormat(str, matchLength) {
      return `<strong>${str.slice(0, matchLength)}</strong>${str.slice(
        matchLength,
        str.length
      )}`;
    },
    subTextFormat(str, matchLength) {
      return `<strong>${str.slice(0, matchLength)}</strong>${str.slice(
        matchLength,
        str.length
      )}`;
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
