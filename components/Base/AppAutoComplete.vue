<template>
  <div class="flex flex-col py-2 mb-6" v-on-clickaway="toggledOff">
    <div class="relative flex flex-row flex-nowrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
      <div class="flex">
        <div class="bg-red ml-2 p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      </div>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <input
        v-model="search"
        ref="search"
        type="text"
        class="border-b-2 focus:border-yellow focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
        :class="error? 'border-red':''"
        :style="inStyle"
        @focus="toggledOn"
        @keydown="handleKeyDownEvent"
      />
    </div>
    <transition name="fade">
      <div class="relative z-10" v-if="showResults">
        <div class="w-full absolute bg-white shadow-md">
          <div
            v-for="(item, index) in results"
            :key="index"
            class="flex flex-row flex-nowrap justify-start p-2 text-xs border-b-2 cursor-pointer"
            :class="{'bg-grey-light': activeIndex === index}"
            @mouseover="activeIndex = index"
            @click="add()"
          >
            <div class="leading-normal mx-2">
              <span v-text="item.name"></span>
              <span
                class="text-grey-dark"
                v-text="`${item.clinical_commissioning_group.name} ${item.code}`"
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
    value: String,
    name: String,
    label: String,
    url: String,
    error: Object,
    inStyle: String
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
    value(surger_name) {
      this.search = surger_name;
    },
    search(value) {
      if (value) {
        this.getSurgeries(value);
      } else {
        this.showResults = false;
      }
    }
  },
  methods: {
    add() {
      let selectedSurgery = this.results[this.activeIndex];
      this.results = [];
      this.showResults = false;
      this.$emit("input", selectedSurgery.name);
    },
    getSurgeries: debounce(function (input) {
      const params = {
        search: input,
        limit: 5
      };
      this.$axios.$get(this.url, { params }).then(res => {
        this.results = res.data.surgeries
        this.showResults = true
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
}
</script>
<style scoped>
.icon {
  max-width: 1rem;
  max-height: 1rem;
  min-width: 1rem;
  min-height: 1rem;
}
</style>

