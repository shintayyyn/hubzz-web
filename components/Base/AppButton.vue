<template>
  <section>
    <button
      @click.prevent="$emit('click')"
      :disabled="disabled"
      class="button rounded-lg px-6 py-2 md:p-6 font-bold text-lg focus:outline-none hover:text-white cursor-pointer"
      :style="inStyle ? inStyle : ''"
    >{{label}}</button>
  </section>
</template>
<script>
export default {
  props: {
    label: String,
    inStyle: String,
    disabled: Boolean
  }
};
</script>
<style>
.button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
.button:active {
  transform: translate(2px, 2px);
}
</style>

