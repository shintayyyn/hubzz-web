<template>
  <div class="w-full pagination flex flex-col">
    <div class="w-full flex flex-wrap justify-between py-2 text-sm">
      <div class="text-gray-500">
        <div>{{ pageInfo(perPage, currentPage, total) }}</div>
      </div>
      <div class="pl-2">
        <div>
          List
          <select
            v-model="selectedLimit"
            class="bg-white border-b-2 focus:border-yellow-400 focus:outline-none px-2"
          >
            <option v-if="total > 5" :value="5">
              5
            </option>
            <option v-if="total > 10" :value="10">
              10
            </option>
            <option v-if="total > 15" :value="15">
              15
            </option>
            <option v-if="total > 20" :value="20">
              20
            </option>
            <option v-if="total > 30" :value="30">
              30
            </option>
            <option v-if="total > 50" :value="50">
              50
            </option>
            <option :value="total" selected>
              All
            </option>
          </select>
          items
        </div>
      </div>
    </div>
    <div v-if="totalPages > 1" class="flex flex-col justify-center items-center py-2">
      <!-- <div class="flex items-center">
        <div v-for="page in pages" :key="page.name" class="md:hidden pagination-item m-1">
          <button
            type="button"
            class="page-button rounded-lg py-2 px-3 md:px-4 font-bold text-xs md:text-sm focus:outline-none"
            :disabled="loading || page.isDisabled"
            :class="{ active: isPageActive(page.name) }"
            @click="onClickPage(page.name)"
          >
            {{ page.name }}
          </button>
        </div>
      </div> -->

      <div class="flex items-center">
        <!-- <div class="pagination-item m-1">
          <button
            type="button"
            class="relative page-button rounded-lg py-4 md:py-2 px-4 font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInFirstPage }"
            :disabled="loading || isInFirstPage"
            @click="onClickFirstPage"
          >
            <span class="hidden md:block">First</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
              </svg>
            </span>
          </button>
        </div> -->

        <div class="pagination-item m-1">
          <button 
            type="button"
            :disabled="loading || isInFirstPage"
            :class="{ 'text-gray-500 cursor-not-allowed': isInFirstPage }"
            @click="onClickPreviousPage"
          >
            <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(90deg)" />
          </button>
          <!-- <button
            type="button"
            class="relative page-button rounded-lg py-4 md:py-2 px-4 font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInFirstPage }"
            :disabled="loading || isInFirstPage"
            @click="onClickPreviousPage"
          >
            <span class="hidden md:block">Previous</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
              </svg>
            </span>
          </button> -->
        </div>

        <div v-for="page in pages" :key="page.name" class="pagination-item m-1">
          <button
            type="button"
            class="text-gray-700 font-bold text-xs md:text-sm py-2 px-1 mx-1 focus:outline-none"
            :disabled="loading || page.isDisabled"
            :class="{ active: isPageActive(page.name) }"
            @click="onClickPage(page.name)"
          >
            {{ page.name }}
          </button>
          <!-- <button
            type="button"
            class="rounded-lg page-button py-2 px-3 md:px-4 font-bold text-xs md:text-sm focus:outline-none"
            :disabled="loading || page.isDisabled"
            :class="{ active: isPageActive(page.name) }"
            @click="onClickPage(page.name)"
          >
            {{ page.name }}
          </button> -->
        </div>

        <div class="pagination-item next m-1">
          <button 
            type="button"
            :disabled="loading || isInLastPage"
            :class="{ 'text-gray-500 cursor-not-allowed': isInLastPage }"
            @click="onClickNextPage"
          >
            <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(-90deg)" />
          </button>
          <!-- <button
            type="button"
            class="relative page-button rounded-lg py-4 md:py-2 px-4 font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInLastPage }"
            :disabled="loading || isInLastPage"
            @click="onClickNextPage"
          >
            <span class="hidden md:block">Next</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </span>
          </button> -->
        </div>
<!-- 
        <div class="pagination-item m-1">
          <button
            type="button"
            class="relative page-button rounded-lg py-4 md:py-2 px-4 font-bold text-sm focus:outline-none"
            :class="{ 'text-gray-500 cursor-not-allowed': isInLastPage }"
            :disabled="loading || isInLastPage"
            @click="onClickLastPage"
          >
            <span class="hidden md:block">Last</span>
            <span class="md:hidden absolute mx-1 my-1 left-0 top-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
                <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
              </svg>
            </span>
          </button>
        </div> -->
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
      default: 5,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    perPage: {
      type: Number,
      required: false,
      default: 15,
    },
  },
  data () {
    return {
      selectedLimit: null,
    }
  },
  computed: {
    isInFirstPage () {
      return this.currentPage === 1
    },
    isInLastPage () {
      return this.currentPage === this.totalPages
    },
    startPage () {
      if (
        this.currentPage === 1
				|| this.currentPage === 2
				|| this.totalPages <= this.maxVisibleButtons
      ) {
        return 1
      }

      if (this.currentPage === this.totalPages - 1) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      if (
        this.currentPage === this.totalPages
				&& this.totalPages > this.maxVisibleButtons
      ) {
        return this.totalPages - this.maxVisibleButtons + 1
      }

      return this.currentPage - 2
    },
    
    pages () {
      const range = []
      for (
        let i = this.startPage;
        i
				<= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
        i += 1
      ) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage,
        })
      }
      return range
    },
  },
  watch: {
    selectedLimit (newValue, oldValue) {
      if ((newValue, oldValue)) {
        this.$emit("limitchanged", newValue)
      }
    },
  },
  mounted () {
    this.selectedLimit = this.perPage
    if (this.total < this.selectedLimit) {
      this.selectedLimit = this.total
    }
  },
  methods: {
    pageInfo (perPage, currentPage, total) {
      return ` Showing ${perPage * currentPage + 1 - perPage} to
      ${
  Math.ceil(total / perPage) === currentPage
    ? total
    : currentPage * perPage
} of ${total} items`
    },
    onClickFirstPage () {
      this.$emit("pagechanged", 1)
    },
    onClickPreviousPage () {
      this.$emit("pagechanged", this.currentPage - 1)
    },
    onClickPage (page) {
      this.$emit("pagechanged", page)
    },
    onClickNextPage () {
      this.$emit("pagechanged", this.currentPage + 1)
    },
    onClickLastPage () {
      this.$emit("pagechanged", this.totalPages)
    },
    isPageActive (page) {
      return this.currentPage === page
    },
  },
}
</script>
<style scoped>
/* .active {
  background-color: #4aae9b;
  color: #ffffff;
}
button {
  background: linear-gradient(to top, #f2d024, #efde86);
}

button:disabled svg {
  fill: #aaa;
} */

.page-button {
	background: linear-gradient(to top, #f2d024, #efde86);
}
.active {
	/* background: linear-gradient(to top, #dbb013, #ecc94b); */
	/* color: #000; */
  border-bottom: 2px solid #999999;
	/* box-shadow: 0 3px 5px #333; */
}

/* button:active {
  transform: translate(2px, 2px);
} */

button:active :not(button:disabled) {
	transform: translate(2px, 2px);
	box-shadow: 0 0 0 transparent;
}
button:disabled,
button:disabled svg {
	/* background: #e2e2e2; */
	color: #999999;
	cursor: not-allowed;
	fill: #999999;
	box-shadow: 0 0 0 transparent;
}
</style>

