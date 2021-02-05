<template>
<div class="flex items-center py-2 text-sm">
  <div 
    v-for="(link, index) in links" 
    :key="index" 
    class="flex"
    :class="index !== links.length-1 ? 'text-gray-600' :'font-bold'"
  >
    <p class="" @click="onClickHandler(link.url, index)" :class="index !== links.length-1 ? `cursor-pointer hover:text-blue-500 ${index===0?'pr-1' : 'px-1'}` : 'text-gray-700 pl-1'">
      {{ link.title }}</p>
    <span>{{ index !== links.length-1 ? '/' : ''}}</span>
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