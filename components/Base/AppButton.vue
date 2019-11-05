<template>
    <button
      @click.prevent="$emit('click')"
      :disabled="disabled"
      class="button rounded-lg p-2 md:px-4 font-bold md:text-lg focus:outline-none"
      :class="[disabled ? 'hover:text-gray-700 disabled-button' : '', (label.includes('Filter') || label.includes('Sort')) && 'flex items-center', inClass]"
      :style="inStyle"
    >{{label}}<svgicon v-if="label.includes('Filter') || label.includes('Sort')" name="sort" class="h-full w-3 ml-2 fill-current"/></button>
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
.button:hover {
  background: linear-gradient(to top, #e6c520, #f1d130);
}
.button:active {
  transform: translate(2px, 2px);
}
.disabled-button {
  cursor: not-allowed;
}
</style>

