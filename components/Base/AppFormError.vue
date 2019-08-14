<template>
  <div class="rounded-lg bg-red-400 p-2 text-white text-xs sm:text-sm">
    <div v-for="(item, index) in formError" :key="index">
      <div>{{item.message}} on {{item.field}} field</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['formError'],
}
</script>
