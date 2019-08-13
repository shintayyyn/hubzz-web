<template>
  <div class="messages-search-section">
    <div class="relative">
      <input v-model="search" type="text" placeholder="Search" />
    </div>
    <div class="relative flex flex-col w-full z-10">
      <div class="absolute w-full option-list flex flex-col bg-white shadow-md overflow-y-auto">
        <div class="py-2 px-3 cursor-pointer text-xs sm:text-sm">
          <div v-for="item in results" :key="item.id">
            <div>{{item.group_name}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
export default {
  data() {
    return {
      search: "",
      results: [],
      showResults: false
    };
  },
  watch: {
    search(value) {
      if (value) {
        this.searchConversation(value);
      } else {
        this.showLists = false;
      }
    }
  },
  methods: {
    searchConversation: debounce(function(input) {
      const params = {
        search: input
      };
      this.$axios.$get(`/api/v1/conversations`, { params }).then(res => {
        if (res.data.conversations.length > 0) {
          this.results = res.data.conversations;
          this.showResults = true;
        } else {
          this.results = [];
          this.showResults = false;
        }
      });
    }, 250)
  }
};
</script>
<style scoped>
.messages-search-section {
  position: relative;
  /* border: 1px solid black; */
}
</style>
