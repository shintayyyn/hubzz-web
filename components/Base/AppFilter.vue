<template>
  <div>
    <div class="flex items-center">
      <!-- Extra button slot -->
      <div class="mr-2">
        <slot name="extraButtonFirst" />
      </div>
      <button v-if="enableFilter" @click="filterTab && filterTab==='default' ? filterTab=null : filterTab = 'default'" class="flex items-center justify-between text-sm p-1 border rounded mr-2 transition-hover" :class="filterTab==='default' ? 'bg-sunglow border-sunglow' : ''">
        <p class="mx-2">{{ filterLabel }}</p>
        <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterTab==='default' ? 'transform: rotate(180deg)' : ''" /></span>
      </button>
      <button v-if="enableSearch" @click="filterTab && filterTab==='search' ? filterTab=null : filterTab = 'search'" class="flex items-center justify-between text-sm p-1 border rounded mr-2 transition-hover" :class="filterTab==='search' ? 'bg-sunglow border-sunglow' : ''">
        <p class="mx-2">{{searchLabel}}</p>
        <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterTab==='search' ? 'transform: rotate(180deg)' : ''" /></span>
      </button>
      <div>
        <!-- Extra button slot -->
        <slot name="extraButton" />
      </div>
      <div class="flex-start mr-auto">
        <slot name="extraFarRight"/>
      </div>
    </div>

    <div class="flex flex-wrap items-center text-sm mt-2" v-if="filterTab==='search'">
    <!-- SEARCH SLOT -->
      <slot name="search"/>
    </div>
    <div class="flex flex-wrap items-center text-sm mt-2" v-if="filterTab==='default'">
     <!-- DEFAULT FILTER SLOT -->
      <slot name="filter"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterTab: null
    }
  },
  props: {
    searchLabel: {
      type: String,
      default: 'Search'
    },

    filterLabel: {
      type: String,
      default: 'Filter'
    },

    enableSearch: {
      type: Boolean,
      default: true
    },

    enableFilter: {
      type: Boolean,
      default: true
    }

  },
  watch: {
    filterTab(value) {
      this.$emit('onTabChange', value)
    }
  }
}
</script>