<template>
  <div class="pagination flex flex-col">
    <div class="flex justify-center">
      <!-- asd -->
      <div class="pagination-item m-1 hidden md:block">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          @click="onClickFirstPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >First</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-5 font-bold text-sm focus:outline-none"
          @click="onClickFirstPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >
          <span class="absolute mx-2 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
            </svg>
          </span>
        </button>
      </div>

      <div class="pagination-item m-1 hidden md:block">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          @click="onClickPreviousPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >Previous</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-4 font-bold text-sm focus:outline-none"
          @click="onClickPreviousPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >
          <span class="absolute mx-1 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
            </svg>
          </span>
        </button>
      </div>

      <div class="pagination-item m-1" v-for="page in pages" :key="page.name">
        <button
          type="button"
          class="rounded-lg py-2 px-3 md:px-4 font-bold text-sm focus:outline-none"
          @click="onClickPage(page.name)"
          :disabled="loading || page.isDisabled"
          :class="{ active: isPageActive(page.name) }"
        >{{ page.name }}</button>
      </div>

      <div class="pagination-item next m-1 hidden md:block">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          :class="{ 'text-gray-500': isInLastPage }"
          @click="onClickNextPage"
          :disabled="loading || isInLastPage"
        >Next</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-4 font-bold text-sm focus:outline-none"
          @click="onClickNextPage"
          :class="{ 'text-gray-500': isInLastPage }"
          :disabled="loading || isInLastPage"
        >
          <span class="absolute mx-1 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </span>
        </button>
      </div>

      <div class="pagination-item m-1 hidden md:block">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          @click="onClickLastPage"
          :class="{ 'text-gray-500': isInLastPage }"
          :disabled="loading || isInLastPage"
        >Last</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-5 font-bold text-sm focus:outline-none"
          @click="onClickLastPage"
          :class="{ 'text-gray-500': isInLastPage }"
          :disabled="loading || isInLastPage"
        >
          <span class="absolute mx-2 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <div class="flex justify-center md:hidden">
      <div class="pagination-item m-1">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          @click="onClickFirstPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >First</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-5 font-bold text-sm focus:outline-none"
          @click="onClickFirstPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >
          <span class="absolute mx-2 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
            </svg>
          </span>
        </button>
      </div>

      <div class="pagination-item m-1">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          @click="onClickPreviousPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >Previous</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-4 font-bold text-sm focus:outline-none"
          @click="onClickPreviousPage"
          :class="{ 'text-gray-500': isInFirstPage }"
          :disabled="loading || isInFirstPage"
        >
          <span class="absolute mx-1 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
            </svg>
          </span>
        </button>
      </div>

      <div class="pagination-item next m-1">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          @click="onClickNextPage"
          :class="{ 'text-gray-500': isInLastPage }"
          :disabled="loading || isInLastPage"
        >Next</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-4 font-bold text-sm focus:outline-none"
          @click="onClickNextPage"
          :class="{ 'text-gray-500': isInLastPage }"
          :disabled="loading || isInLastPage"
        >
          <span class="absolute mx-1 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </span>
        </button>
      </div>

      <div class="pagination-item m-1">
        <button
          type="button"
          class="rounded-lg hidden md:block py-2 px-4 font-bold text-sm focus:outline-none"
          @click="onClickLastPage"
          :class="{ 'text-gray-500': isInLastPage }"
          :disabled="loading || isInLastPage"
        >Last</button>
        <button
          type="button"
          class="relative rounded-lg md:hidden py-4 px-5 font-bold text-sm focus:outline-none"
          @click="onClickLastPage"
          :class="{ 'text-gray-500': isInLastPage }"
          :disabled="loading || isInLastPage"
        >
          <span class="absolute mx-2 my-1 left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
            </svg>
          </span>
        </button>
      </div>
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
    },

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

button:disabled svg {
  fill: #aaa;
}
</style>

