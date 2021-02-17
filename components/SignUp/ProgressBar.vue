<template>
  <div class="w-full">
    <div class="__progress_bar" :style="`width: ${percentage}%;`"></div>
  </div>
</template>

<script>
  export default {
    props: {
      percentage: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style>
  .__progress_bar {
    transition: .75s;
    height: 10px;
    background-color: #ffc72c;
  }
</style>
