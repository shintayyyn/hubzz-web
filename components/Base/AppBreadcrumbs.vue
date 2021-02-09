<template>
    <div class="flex items-center py-2 text-sm" :class="fixed && 'fixed top-0 mt-3 z-40'">
      <div 
        v-for="(link, index) in links" 
        :key="index" 
        class="flex items-center"
        :class="[index !== links.length-1 ? 'text-gray-600' :'font-bold', link.class]"
      >
        <p @click="onClickHandler(link.url, index)" :class="index !== links.length-1 ? `cursor-pointer hover:text-blue-500 ${index===0?'pr-1' : 'px-1'}` : 'text-gray-700 pl-1'">
          {{ link.title }}</p>
        <span v-if="index !== links.length-1">
          <svgicon name="arrow-right" width="10" class="fill-current"/>
        </span>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    links: {
			type: Array,
      default: () => [],
    },
    fixed: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClickHandler (url, index) {
      if (index !== this.links.length-1) {
        this.$router.push(url)
      }
    }
  }
}
</script>