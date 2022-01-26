<template>
  <div>
    <div class="flex items-center">
      <!-- Extra button slot -->
      <div>
        <slot name="extraButtonFirst" />
      </div>
      <button v-if="enableFilter" class="flex items-center justify-between text-sm p-1 border rounded mx-2 transition-hover" :class="filterTab==='default' ? 'bg-sunglow border-sunglow' : ''" @click="filterTab && filterTab==='default' ? filterTab=null : filterTab = 'default'">
        <p class="mx-2">
          {{ filterLabel }}
        </p>
        <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterTab==='default' ? 'transform: rotate(180deg)' : ''" /></span>
      </button>
      <button v-if="enableSearch" class="flex items-center justify-between text-sm p-1 border rounded mx-2 transition-hover" :class="filterTab==='search' ? 'bg-sunglow border-sunglow' : ''" @click="filterTab && filterTab==='search' ? filterTab=null : filterTab = 'search'">
        <p class="mx-2">
          {{ searchLabel }}
        </p>
        <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterTab==='search' ? 'transform: rotate(180deg)' : ''" /></span>
      </button>
      <div>
        <!-- Extra button slot -->
        <slot name="extraButton" />
      </div>
      <div class="flex-start mr-auto">
        <slot name="extraFarRight" />
      </div>
    </div>

    <div v-if="filterTab==='search'" class="flex flex-wrap items-center text-sm mt-2">
      <!-- SEARCH SLOT -->
      <slot name="search" />
    </div>
    <div v-if="filterTab==='default'" class="flex flex-wrap items-center text-sm mt-2">
      <!-- DEFAULT FILTER SLOT -->
      <slot name="filter" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    searchLabel: {
      type: String,
      default: 'Search',
    },

    filterLabel: {
      type: String,
      default: 'Filter',
    },

    enableSearch: {
      type: Boolean,
      default: true,
    },

    enableFilter: {
      type: Boolean,
      default: true,
    },

  },
  data () {
    return {
      filterTab: null,
    }
  },
  watch: {
    filterTab (value) {
      this.$emit('onTabChange', value)
    },
  },
}
</script>
