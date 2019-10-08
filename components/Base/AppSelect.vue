<template>
  <section>
    <!-- input select -->
    <div class="flex flex-col py-0 md:py-2 mb-2 md:mb-6">
      <div class="relative flex flex-row flex-no-wrap justify-between">
        <label :for="name" class="text-xs sm:text-base py-1">{{label}}</label>
        <div class="bg-gray-300 rounded-lg p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
        <div
          class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
          v-if="error"
        >{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1">
        <select
          :value="value"
          class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
          :class="error ? 'border-red-500':''"
          @input="$emit('input', $event.target.value)"
          :style="inStyle"
          @change="$emit('change', $event.target.value)"
        >
          <option value disabled selected v-if="placeholder">{{placeholder}}</option>
          <option
            v-for="(item, index) in items"
            :key="index"
            :value="item.value"
            :selected="value === item.value"
          >{{item.label}}</option>
        </select>
      </div>
      <!-- <div class="flex flex-row justify-start mt-1" v-else>(None specified)</div> -->
    </div>
  </section>
</template>
<script>
export default {
  props: {
    value: [String, Number, Boolean, Array, Object],
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    items: Array,
    info: String,
    inStyle: String
  }
};
</script>
<style scoped>
</style>

