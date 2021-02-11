<template>
  <div class="flex flex-col justify-center items-center py-2 w-full">
    <!-- <div :class="pages > 2 ? 'flex md:hidden' : 'hidden'">
      <div
        v-for="pageItem in pages"
        v-if="showPage(pageItem)"
        :key="pageItem"
        class="md:hidden m-1"
      >
        <button
          type="button"
          class="__pagination_button rounded-lg py-2 px-3 md:px-4 font-bold text-xs md:text-sm focus:outline-none"
          :disabled="loading || activePage === pageItem"
          :class="{
            'active cursor-not-allowed': activePage === pageItem,
          }"
          @click="activePage = pageItem"
        >
          {{ pageItem }}
        </button>
      </div>
    </div> -->

    <div class="flex items-center">
      <!-- <div v-if="pages > 2" class="m-1">
        <button
          type="button"
          class="relative __pagination_button rounded-lg h-full p-3 flex justify-center items-center font-bold text-sm focus:outline-none"
          :class="{
            'text-gray-500 cursor-not-allowed': activePage === 1,
          }"
          :disabled="loading || activePage === 1"
          @click="activePage = 1"
        >
          <svgicon name="left-chevron" width="13" height="13" />
        </button>
      </div> -->

      <div class="m-1">
        <button
          type="button"
          :class="{
            'text-gray-500 cursor-not-allowed': activePage === 1,
          }"
          :disabled="loading || activePage === 1"
          @click="activePage = activePage > 1 ? activePage - 1 : 1"
        >
          <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(90deg)" />
          <!-- <svgicon name="arrow-left" width="13" height="13" /> -->
        </button>
      </div>

      <div class="flex items-center">
        <div
          v-for="pageItem in pages"
          v-if="showPage(pageItem)"
          :key="pageItem"
          class="m-1"
        >
          <button
            type="button"
            class="text-gray-700 font-bold text-xs md:text-sm py-2 px-1 md:mx-1 focus:outline-none"
            :disabled="loading || activePage === pageItem"
            :class="{
              'active cursor-not-allowed': activePage === pageItem,
            }"
            @click="activePage = pageItem"
          >
            {{ pageItem }}
          </button>
        </div>
      </div>

      <div class="m-1">
        <button
          type="button"
          :class="{
            'text-gray-500 cursor-not-allowed': activePage === pages,
          }"
          :disabled="loading || activePage === pages"
          @click="activePage = activePage < pages ? activePage + 1 : pages"
        >
            <svgicon name="caret-down" width="12" height="12" class="fill-current" style="transform: rotate(-90deg)" />
          <!-- <svgicon name="arrow-right" width="13" height="13" /> -->
        </button>
      </div>

      <!-- <div v-if="pages > 2" class="m-1">
        <button
          type="button"
          class="relative __pagination_button rounded-lg h-full p-3 font-bold text-sm focus:outline-none"
          :class="{
            'text-gray-500 cursor-not-allowed': activePage === pages,
          }"
          :disabled="loading || activePage === pages"
          @click="activePage = pages"
        >
          <svgicon name="right-chevron" width="13" height="13" />
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      count: {
        type: Number,
        default: 0,
      },
      pages: {
        type: Number,
        default: 1,
      },
      page: {
        type: Number,
        default: 1,
      },
      maxPage: {
        type: Number,
        default: 5,
      },
    },

    computed: {
      activePage: {
        get () {
          return this.page
        },
        set (page) {
          this.$emit('page', page)
        },
      },

      showPage () {
        return (page) => {
          const left = Math.floor((this.maxPage - 1) / 2)
          const right = Math.ceil((this.maxPage - 1) / 2)

          if (this.activePage < left + 2) {
            return page < this.maxPage + 1
          }
          
          if (this.activePage > this.pages - right - 1) {
            return page > this.pages - this.maxPage
          }

          return page >= this.activePage - left && page <= this.activePage + right
        }
      },
    },
  }
</script>

<style>
  .__pagination_button {
      background: linear-gradient(to top, #f2d024, #efde86);
      color: #000;
  }

  .__pagination_button.active {
      background: linear-gradient(to top, #dbb013, #ecc94b);
      color: #000;
      box-shadow: 0 3px 5px #333;
  }

  .__pagination_button.active:disabled {
      color: #999999;
      /* box-shadow: inset 0px 0px 0px 2px #dbb013; */
      cursor: default;
  }

  .__pagination_button:active {
      transform: translate(2px, 2px);
  }

  .__pagination_button:active :not(.__pagination_button:disabled) {
      transform: translate(2px, 2px);
      box-shadow: 0 0 0 transparent;
  }

  .__pagination_button:disabled,
  .__pagination_button:disabled svg {
      background: #bdbdbd;
      color: #0000;
      fill: #999999;
      box-shadow: 0 0 0 transparent;
  }

  .active {
    border-bottom: 2px solid #999999;
  }
</style>
