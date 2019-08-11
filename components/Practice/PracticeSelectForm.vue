<template>
  <div>
    <div class="border-solid rounded-lg shadow-md p-8 mb-5">
      <div class="text-sm mb-5">Search for a Practice</div>
      <input
        type="text"
        class="block mb-5 w-full search"
        placeholder="Practice code, name of practice"
        @keyup.enter="search"
      />
      <button
        class="bg-yellow-400 hover:text-white focus:outline-none text-black font-semibold text-xs py-2 px-4 rounded-lg"
        @click.prevent="search"
      >Search</button>
    </div>
    <PracticeSearchResult v-if="showResult" @nextStep="$emit('nextStep', $event)" />
  </div>
</template>
<script>
import PracticeSearchResult from '@/components/Practice/PracticeSearchResult'
export default {
  components: {
    PracticeSearchResult
  },
  data() {
    return {
      loading: false,
      showResult: false
    }
  },
  methods: {
    search() {
      this.loading = true
      setTimeout(() => {
        this.showResult = true
        this.loading = false
      }, 1000);
    }
  }
}
</script>
<style scoped>
.search {
  border: 0;
  border-bottom: 1px solid grey;
}
.search:focus {
  outline: none;
  border-color: yellow;
}
</style>


