<template>
  <div class="flex flex-col py-2 mb-6">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label v-if="label" :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
      <div class="bg-red-300 p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      <div class="bg-gray-200 rounded-lg p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <textarea
        id
        :cols="cols"
        :rows="rows"
        :value="value"
        :placeholder="placeholder"
        class="border-b-2 focus:border-yellow-300 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
        :class="[error ? 'border-red-300':'', resize ? '' : 'resize-none']"
        @input="$emit('input', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: [String, Boolean],
    type: String,
    name: String,
    label: String,
    placeholder: String,
    cols: {
      default: 30,
      type: Number
    },
    rows: {
      default: 10,
      type: Number
    },
    resize: {
      default: true,
      type: Boolean
    },
    error: Object,
    info: String,
    inStyle: String,
    // for multiselect checkbox
    lists: Array
  }
};
</script>
