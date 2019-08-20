<template>
  <div class="rounded-lg bg-red-400 p-2 text-white text-sm md:text-base">
    <ul v-for="(item, index) in formError" :key="index" class="list-disc list-inside">
      <li>{{item.message}} on {{item.field}} field</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: ['formError'],
}
</script>

