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
    <transition name="fade">
      <div class="relative z-10" v-if="showResults">
        <div class="w-full absolute bg-white shadow-md">
          <div
            v-for="(item, index) in results"
            :key="index"
            class="flex flex-row flex-no-wrap justify-start p-2 text-xs border-b-2 cursor-pointer"
            :class="{'bg-gray-300': activeIndex === index}"
            @mouseover="activeIndex = index"
            @click="add()"
          >
            <template v-if="keyword === 'practices'">
              <span class="w-1/6 flex justify-center">
                <img
                  class="w-10 h-10 rounded-full"
                  src="https://www.svgrepo.com/show/106812/doctor.svg"
                  width="25"
                  alt="avatar"
                />
              </span>
              <div class="w-full flex flex-col justify-center mx-2">
                <span class="font-bold text-base">{{ item.first_name }} {{ item.last_name }}</span>
                <span>{{ item.surgery }}</span>
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
import { mixin as clickaway } from "vue-clickaway";
export default {
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
  data() {
    return {
      search: "",
      showResults: false,
      results: [],
      activeIndex: 0
    };
  },
  watch: {
    value(search) {
      this.search = search;
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
      if (this.keyword === "practices") {
        let fullName =
          selectedSurgery.first_name + " " + selectedSurgery.last_name;
        this.$emit("input", fullName);
        this.$emit("selectUserId", selectedSurgery.id);
        this.$axios
          .$get(`/api/v1/conversations?search=${fullName}`)
          .then(res => {
            if (res.data.conversations.length > 0) {
              let id = res.data.conversations[0].id;
              this.$router.push(`/messages/${id}`);
            }
          });
        this.search = fullName;
      } else {
        this.$emit("input", selectedSurgery.name);
      }
    },
    // getSurgeries: debounce(function (input) {
    //   const params = {
    //     search: input,
    //     limit: 5
    //   };
    //   this.$axios.$get(this.url, { params }).then(res => {
    //     console.log(res)
    //     this.results = res.data.practices
    //     this.showResults = true
    //   });
    // }, 250),
    getSurgeries: debounce(function(input) {
      const params = {
        search: input,
        limit: 5
      };
      this.$axios.$get(this.url, { params }).then(res => {
        if (this.keyword && this.keyword === "practices") {
          // res.data.practices.forEach(data => {
          //   this.results.push({
          //     value: '',

          //   })
          // })
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

