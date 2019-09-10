<template>
  <section>
    <button
      @click.prevent="$emit('click')"
      :disabled="disabled"
      class="rounded-lg px-6 py-2 md:p-6 font-bold text-lg focus:outline-none button"
      :class="disabled ? 'hover:text-gray-700 disabled-button' : 'hover:text-white'"
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
.disabled-button {
  cursor: not-allowed;
}
</style>

