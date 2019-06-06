<template>
  <div class="w-full sm:w-1/2 lg:w-1/4 p-4">
    <div class="border border-solid rounded-lg shadow-md p-8 cursor-pointer hover:bg-grey-lighter">
      <div>{{label}}</div>
      <div class="font-sans text-5xl text-grey-darkest">{{count}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    count: [String, Number],
    route: String
  }
}
</script>

