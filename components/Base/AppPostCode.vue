<template>
  <div class="flex flex-col py-2 mb-3 md:mb-6" v-on-clickaway="toggledOff">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
    </div>
    <div class="flex flex-col justify-start">
      <input
        v-model="search"
        ref="search"
        type="text"
        class="border-b-2 focus:border-yellow-400 focus:outline-none p-2 font-bold text-xs sm:text-sm w-full"
        :class="error? 'border-red-500':''"
        :style="inStyle"
        @focus="toggledOn"
        @keydown="handleKeyDownEvent"
        @input="$emit('input', $event.target.value)"
        @blur="$emit('blur')"
      />
      <transition name="drop-down">
        <div
          v-if="error"
          class="text-red-500 py-1 text-xs text-white"
        >{{error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ")}}</div>
      </transition>
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
            <div>{{item.label}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import { mixin as clickaway } from "vue-clickaway";
import AppLoading from "@/components/Base/AppLoading";
export default {
  mixins: [clickaway],
  components: {
    AppLoading
  },
  props: {
    value: [String, Object],
    name: String,
    label: String,
    urlIndex: String,
    dataIndex: String,
    error: Object,
    inStyle: String
  },
  data() {
    return {
      loading: false,
      search: "",
      showLists: false,
      predictions: [],
      activeIndex: 0
    };
  },
  watch: {
    value(post_code) {
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
  computed: {
    url() {
      return this.urlIndex ? this.urlIndex : "/api/v1/postcodes";
    },
    filteredItems() {
      return this.predictions;
    }
  },
  created() {
    this.search = this.value;
  },
  methods: {
    add() {
      let selectedPostCode = this.predictions[this.activeIndex];
      this.predictions = [];
      this.showLists = false;
      this.$emit("input", selectedPostCode.label);
    },
    getPredictions: debounce(function(input) {
      const params = {
        search: input,
        offset: 0,
        limit: 5
      };
      this.predictions = [];
      this.$axios.$get(this.url, { params }).then(res => {
        if (this.dataIndex) {
          if (res.data[this.dataIndex].length > 0) {
            res.data[this.dataIndex].forEach(item => {
              this.predictions.push({
                label: item.name,
                value: item.id
              });
            });
            this.showLists = true;
          } else {
            this.predictions = [];
            this.showLists = false;
          }
        } else if (!this.dataIndex) {
          if (res.data.postcodes.length > 0) {
            res.data.postcodes.forEach(postCode => {
              this.predictions.push({
                label: postCode.postcode,
                value: postCode.id
              });
            });
            this.showLists = true;
          } else {
            this.predictions = [];
            this.showLists = false;
          }
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
/* .icon {
  max-width: 1rem;
  max-height: 1rem;
  min-width: 1rem;
  min-height: 1rem;
} */
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: 200px;
}
</style>
