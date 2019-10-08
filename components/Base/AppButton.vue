<template>
  <section>
    <button
      @click.prevent="$emit('click')"
      :disabled="disabled"
      class="button rounded-lg py-2 px-4 font-bold text-lg focus:outline-none"
      :class="[disabled ? 'hover:text-gray-700 disabled-button' : 'hover:text-white', inClass]"
      :style="inStyle"
    >{{label}}</button>
  </section>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "Save"
    },
    inClass: {
      type: String
    },
    inStyle: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style >
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

