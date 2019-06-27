<template>
  <div class="p-8 max-w-2xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
  </div>
</template>
<script>
export default {
  props: ['practice'],
  methods: {

  }
}
</script>
