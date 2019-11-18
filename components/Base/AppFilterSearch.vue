<template>
  <section>
    <!-- input select -->
    <div class="relative flex flex-col py-2 mb-3 md:mb-6" v-on-clickaway="toggledOff">
      <div class="relative flex flex-row flex-wrap justify-between">
        <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        <div class="rounded-lg bg-gray-300 p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
        <div
          class="absolute rounded right-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
          v-if="error"
        >{{error.message}}</div>
      </div>
      <!-- selected -->
      <div class="relative flex flex-row flex-wrap justify-start">
        <div
          class="rounded-lg bg-yellow-500 py-2 px-3 m-1 text-xs sm:text-sm"
          v-if="defaultItem"
        >{{defaultItem}}</div>
        <div
          class="rounded-lg bg-yellow-500 py-2 px-3 m-1 text-xs sm:text-sm flex items-center justify-between"
          v-for="(item, index) in value"
          :key="`${item.value}-${index}`"
        >
          {{item.label}} {{item.value}}
          <span
            class="font-bold cursor-pointer text-base pl-3"
            @click="remove(index)"
          >x</span>
        </div>
        <div>
          <input
            v-show="show"
            v-model="search"
            type="text"
            placeholder="Select.."
            ref="input"
            class="border-b-2 focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm"
            :class="error ? 'border-red-500' : ''"
            @focus="toggled = true"
            @keydown="handleKeyDownEvent"
          />
        </div>
      </div>
      <!-- option -->
      <div class="relative flex flex-col w-full z-10" v-show="show">
        <div
          ref="filterSearchOptions"
          class="absolute w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
          :class="{'slide-down': toggled}"
          @scroll="scrollHandler"
        >
          <div class="relative">
            <div
              :id="`${item.label}`"
              class="py-2 px-3 cursor-pointer text-xs sm:text-sm"
              :class="{'bg-gray-300': activeIndex === index}"
              v-for="(item, index) in filteredItems"
              :key="`${item.value}-${index}`"
              @mouseover="activeIndex = index"
              @click="add(item)"
            >{{item.label}}</div>
            <AppLoading :loading="loading" :message="'Loading'" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway";
import AppLoading from "@/components/Base/AppLoading";
export default {
  mixins: [clickaway],
  components: {
    AppLoading
  },
  props: {
    value: [Array, String, Number],
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    info: String,
    url: String,
    limitItem: Number,
    // for qualification
    professionCategoryId: String,
    // for spoken-langauge
    defaultItem: String
  },
  data() {
    return {
      loading: false,
      search: "",
      total: 0,
      hasMore: true,
      items: [],
      toggled: false,
      activeIndex: 0
    };
  },
  created() {
    this.getListsCount(this.search);
  },
  watch: {
    activeIndex(value) {
      const getRef = document.getElementById(
        `${this.filteredItems[value].label}`
      );
      getRef.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start"
      });
    },
    // for qualification
    professionCategoryId(newValue, oldValue) {
      if (newValue && oldValue) {
        this.items = [];
        console.log("clear items", this.items);
        this.getListsCount(this.search);
      }
    },
    search(value) {
      this.items = [];
      this.getListsCount(value);
    }
  },
  methods: {
    scrollHandler(e) {
      if (
        this.$refs.filterSearchOptions.offsetHeight +
          this.$refs.filterSearchOptions.scrollTop >=
        this.$refs.filterSearchOptions.scrollHeight - 1
      ) {
        if (this.hasMore === true && !this.loading) {
          this.getLists(this.items.length, this.search);
        }
      }
    },
    getListsCount(search) {
      this.items = [];
      let params = {};
      if (this.name === "qualification_id") {
        params = {
          ...params,
          profession_category_id: this.professionCategoryId
        };
      }
      params = { ...params, search };
      this.$axios.$get(`${this.url}/count`, { params }).then(res => {
        this.total = res.data.count;
        this.getLists(this.items.length, this.search);
      });
    },
    getLists(offset, search) {
      this.loading = true;
      this.hasMore = true;

      let params = {};
      if (this.name === "qualification_id") {
        params = {
          ...params,
          profession_category_id: this.professionCategoryId
        };
      }
      params = { ...params, offset, limit: 10, search };
      this.$axios.$get(`${this.url}`, { params }).then(res => {
        if (res.data.practice_types) {
          if (res.data.practice_types.length === 0) {
            this.loadMore = false;
          } else {
            res.data.practice_types.forEach(item => {
              this.items.push({
                label: item.name,
                value: item.id
              });
            });
            if (res.data.practice_types.length < 10) {
              this.loadMore = false;
            }
          }
        }

        if (res.data.qualifications) {
          if (res.data.qualifications.length === 0) {
            this.hasMore = false;
          } else {
            res.data.qualifications.forEach(item => {
              this.items.push({
                label: item.name,
                value: item.id
              });
            });
            if (res.data.qualifications.length < 10) {
              this.hasMore = false;
            }
          }
        }

        if (res.data.clinical_systems) {
          if (res.data.clinical_systems.length === 0) {
            this.hasMore = false;
          } else {
            res.data.clinical_systems.forEach(item => {
              this.items.push({
                label: item.name,
                value: item.id
              });
            });
            if (res.data.clinical_systems.length < 10) {
              this.hasMore = false;
            }
          }
        }

        if (res.data.spoken_languages) {
          if (res.data.spoken_languages.length === 0) {
            this.hasMore = false;
          } else {
            res.data.spoken_languages.forEach(item => {
              this.items.push({
                label: item.name,
                value: item.id
              });
            });
            if (res.data.spoken_languages.length < 10) {
              this.hasMore = false;
            }
          }
        }

        if (res.data.surgeries) {
          if (res.data.surgeries.length === 0) {
            this.hasMore = false;
          } else {
            res.data.surgeries.forEach(item => {
              this.items.push({
                label: item.name,
                value: item.id
              });
            });
            if (res.data.surgeries.length < 10) {
              this.hasMore = false;
            }
          }
        }
        this.loading = false;
      });
    },
    add(item) {
      if (this.limitItem && this.limitItem == this.value.length) {
        return;
      }
      this.value.push(item);
      this.$refs.input.focus();
      this.$emit("add");
      if (
        this.$refs.filterSearchOptions.offsetHeight +
          this.$refs.filterSearchOptions.scrollTop >=
        this.$refs.filterSearchOptions.scrollHeight - 1
      ) {
        if (this.hasMore === true && !this.loading) {
          this.getLists(this.items.length, this.search);
        }
      }
    },
    remove(index) {
      this.value.splice(index, 1);
      this.$refs.input.focus();
      this.$emit("remove");
    },
    toggledOff() {
      this.toggled = false;
    },
    handleKeyDownEvent(e) {
      if (!this.toggled) {
        return;
      }
      if (event.key === "ArrowUp") {
        if (this.activeIndex > 0) {
          this.activeIndex--;
        }
      }
      if (event.key === "ArrowDown") {
        if (this.activeIndex < this.items.length - 1) {
          this.activeIndex++;
        }
      }
      if (event.key === "Enter") {
        this.add(this.items[this.activeIndex]);
      }
      if (event.key === "Backspace") {
        if (!this.search) {
          this.remove(this.value.length - 1);
        }
        this.$refs.input.focus();
      }
      if (event.key === "Escape") {
        this.toggledOff();
      }
    }
  },
  computed: {
    show() {
      if (!this.limitItem || this.limitItem !== this.value.length) {
        return true;
      }
      return false;
    },
    filteredItems() {
      return this.items.filter(filterItem => {
        const index = this.value.findIndex(item => {
          return item.value === filterItem.value;
        });
        return index === -1 && filterItem.value;
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
