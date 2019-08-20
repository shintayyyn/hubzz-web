<template>
  <div class="rounded-lg bg-red-400 text-white px-4 py-2 text-xs sm:text-sm">
    <div v-for="(item, index) in formError" :key="index">
      <p>{{item.message}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["formError"]
};
</script>