<template>
  <div class="flex justify-end items-center">
    <button :class="activePage === 1 ? 'text-white' : ''" class="border rounded-lg p-2 m-1 h-full" @click="$emit('setPage', Math.max(activePage - 1, 1))">
      <svgicon name="arrow-left" width="16" height="16" />
    </button>

    <button v-for="page in pages" v-if="showPage(page)" :key="`page_${page}`" :class="activePage === page ? 'text-white' : ''" class="border rounded-lg p-2 m-1 h-full" @click="$emit('setPage', page)">
      <span>{{ page }}</span>
    </button>

    <button :class="activePage === pages ? 'text-white' : ''" class="border rounded-lg p-2 m-1 h-full" @click="$emit('setPage', Math.min(activePage + 1, pages))">
      <svgicon name="arrow-right" width="16" height="16" />
    </button>
  </div>
</template>

<script>
  export default {
    props: {
      pages: {
        type: Number,
        required: true,
      },

      activePage: {
        type: Number,
        required: true,
      },
    },

    computed: {
      showPage () {
        return page => {
          return page === 1
            || page === this.pages
            || page === this.activePage
            || page === this.activePage + 1
            || page === this.activePage - 1
            || this.activePage === 1 && page < 5
            || this.activePage === this.pages && page > this.pages - 4
            || this.activePage === 2 && page === 4
            || (this.activePage === this.pages - 1 && page === this.pages - 3)
        }
      },
    },
  }
</script>
