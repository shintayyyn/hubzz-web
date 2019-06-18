<template>
  <section>
    <button
      @click.prevent="$emit('click')"
      class="button rounded-lg p-6 font-bold text-lg focus:outline-none hover:text-white cursor-pointer"
      :style="inStyle ? inStyle : ''"
    >{{label}}</button>
  </section>
</template>
<script>
export default {
  props: {
    label: String,
    inStyle: String
  }
}
</script>
<style>
.button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
.button:active {
  transform: translate(2px, 2px);
}
</style>

