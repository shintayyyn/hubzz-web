<template>
  <div class="relative" :style="[{ width: width }, {height: height}]">
    <img v-if="src" :src="src" class="object-cover rounded-full h-full" />
    <img v-else src="https://via.placeholder.com/300/" class="object-cover rounded-full h-full" />
    <div v-if="type === 'update'" class="icon absolute top-0 right-0">
      <input
        type="file"
        name="input_file"
        id="input_file"
        class="hidden"
        @input="onFileInput($event)"
      />
      <label for="input_file" class="flex items-center cursor-pointer">
        <svgicon class="opacity-50 hover:opacity-100" name="camera" height="36" width="36" />
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      default: "175px",
      type: String
    },
    height: {
      default: "175px",
      type: String
    },
    src: {
      type: String,
      required: true
    },
    type: String
  }
};
</script>