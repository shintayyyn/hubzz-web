<template>
  <div class="pagination flex flex-row flex-wrap justify-center">
    <div class="pagination-item m-1">
      <button
        type="button"
        class="rounded-lg py-2 px-4 font-bold text-sm focus:outline-none"
        @click="onClickFirstPage"
        :disabled="loading || isInFirstPage"
      >First</button>
    </div>

    <div class="pagination-item m-1">
      <button
        type="button"
        class="rounded-lg py-2 px-4 font-bold text-sm focus:outline-none"
        @click="onClickPreviousPage"
        :disabled="loading || isInFirstPage"
      >Previous</button>
    </div>

    <div class="pagination-item m-1" v-for="page in pages" :key="page.name">
      <button
        type="button"
        class="rounded-lg py-2 px-4 font-bold text-sm focus:outline-none"
        @click="onClickPage(page.name)"
        :disabled="loading || page.isDisabled"
        :class="{ active: isPageActive(page.name) }"
      >{{ page.name }}</button>
    </div>

    <div class="pagination-item m-1">
      <button
        type="button"
        class="rounded-lg py-2 px-4 font-bold text-sm focus:outline-none"
        @click="onClickNextPage"
        :disabled="loading || isInLastPage"
      >Next</button>
    </div>

    <div class="pagination-item m-1">
      <button
        type="button"
        class="rounded-lg py-2 px-4 font-bold text-sm focus:outline-none"
        @click="onClickLastPage"
        :disabled="isInLastPage || loading"
      >Last</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 5
    },
    totalPages: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    // perPage: {
    //   type: Number,
    //   required: true
    // },
    currentPage: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isInFirstPage() {
      return this.currentPage === 1
    },
    isInLastPage() {
      return this.currentPage === this.totalPages
    },
    startPage() {
      if (this.currentPage === 1 || (this.currentPage === 2 || this.totalPages <= this.maxVisibleButtons)) {
        return 1
      }

      if (this.currentPage === this.totalPages - 1) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      if (this.currentPage === this.totalPages && this.totalPages > this.maxVisibleButtons) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      return this.currentPage - 2
    },
    pages() {
      const range = [];
      for (let i = this.startPage;
        i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
        i += 1) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        });
      }
      return range;
    },
  },
  methods: {
    onClickFirstPage() {
      this.$emit('pagechanged', 1)
    },
    onClickPreviousPage() {
      this.$emit('pagechanged', this.currentPage - 1)
    },
    onClickPage(page) {
      this.$emit('pagechanged', page)
    },
    onClickNextPage() {
      this.$emit('pagechanged', this.currentPage + 1)
    },
    onClickLastPage() {
      this.$emit('pagechanged', this.totalPages)
    },
    isPageActive(page) {
      return this.currentPage === page
    }
  }
}
</script>
<style scoped>
.pagination {
  /* list-style-type: none; */
  /* padding: 0; */
}
.pagination-item {
  /* display: inline-block; */
  /* margin-right: 8px; */
}
.active {
  background-color: #4aae9b;
  color: #ffffff;
}
button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
button:active {
  transform: translate(2px, 2px);
}
</style>

