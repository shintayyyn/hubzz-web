<template>
  <div class="flex flex-col py-2 mb-6">
    <div class="relative flex flex-row flex-nowrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
      <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      <div class="bg-grey-light rounded-lg p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <textarea
        id
        cols="30"
        rows="10"
        :value="value"
        :placeholder="placeholder"
        class="border-b-2 focus:border-yellow focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
        :class="error? 'border-red':''"
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
    error: Object,
    info: String,
    inStyle: String,
    // for multiselect checkbox
    lists: Array
  },
}
</script>
