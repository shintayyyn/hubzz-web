<template>
  <section>
    <!-- input select -->
    <div class="relative flex flex-col py-2 mb-6" v-on-clickaway="toggledOff">
      <div class="relative flex flex-row flex-no-wrap justify-between">
        <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        <div class="rounded-lg bg-gray-200 p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
        <div
          class="absolute right-0 bg-red-300 p-1 text-xs sm:text-sm text-white"
          v-if="error"
        >{{error.message}}</div>
      </div>
      <!-- selected -->
      <div class="relative flex flex-row flex-wrap justify-start">
        <div
          class="rounded-lg bg-yellow-400 py-2 px-3 m-1 text-xs sm:text-sm"
          v-if="defaultItem"
        >English</div>
        <div
          class="rounded-lg bg-yellow-400 py-2 px-3 m-1 text-xs sm:text-sm"
          v-for="(item, index) in value"
          :key="item.value"
        >
          {{item.label}}
          <span class="font-bold cursor-pointer text-base" @click="remove(index)">X</span>
        </div>
        <div>
          <input
            v-model="filterSearch"
            type="text"
            placeholder="Select.."
            ref="input"
            class="border-b-2 focus:border-yellow-300 focus:outline-none py-3 font-bold text-xs sm:text-sm"
            @focus="toggled = true"
            @keydown="handleKeyDownEvent"
          />
        </div>
      </div>
      <!-- option -->
      <div class="relative flex flex-col w-full z-10">
        <div
          class="absolute w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
          :class="{'slide-down': toggled}"
        >
          <div
            class="py-2 px-3 cursor-pointer text-xs sm:text-sm"
            :class="{'bg-gray-200': activeIndex === index}"
            v-for="(item, index) in filteredItems"
            :key="item.value"
            @mouseover="activeIndex = index"
            @click="add(item)"
          >{{item.label}}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  props: {
    value: [Array, String],
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    items: Array,
    info: String,
    defaultItem: String
  },
  data() {
    return {
      filterSearch: "",
      toggled: false,
      activeIndex: 0
    };
  },
  methods: {
    add(item) {
      this.value.push(item);
      this.$refs.input.focus();
    },
    remove(index) {
      this.value.splice(index, 1);
      this.$refs.input.focus();
    },
    toggledOff() {
      this.toggled = false;
    },
    handleKeyDownEvent(e) {
      if (!this.toggled) {
        return;
      }
      if (event.key === "ArrowUp") {
        this.activeIndex--;
      }
      if (event.key === "ArrowDown") {
        this.activeIndex++;
      }
      if (event.key === "Enter") {
        this.add(this.filteredItems[this.activeIndex]);
      }
      if (event.key === "Backspace") {
        if (!this.filterSearch) {
          this.remove(this.value.length - 1);
        }
      }
      if (event.key === "Escape") {
        this.toggledOff();
      }
    }
  },
  computed: {
    filteredItems() {
      return this.items.filter(filterItem => {
        const index = this.value.findIndex(item => {
          return item.value === filterItem.value;
        });
        return (
          index === -1 &&
          filterItem.value &&
          filterItem.label.includes(this.filterSearch)
        );
      });
    }
  }
};
</script>
<style scoped>
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: 200px;
}
</style>
