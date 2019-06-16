<template>
  <section>
    <!-- input select -->
    <div class="flex flex-col py-2 mb-6">
      <div class="relative flex flex-row flex-nowrap justify-between">
        <label :for="name" class="text-xs sm:text-base py-1">{{label}}</label>
        <div class="bg-grey-light rounded-lg p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
        <div
          class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
          v-if="error"
        >{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1" v-if="items.length > 0">
        <select
          :value="value"
          class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
          :class="error? 'border-red':''"
          @input="$emit('input', $event.target.value)"
          :style="inStyle"
        >
          <option value disabled selected v-if="placeholder">{{placeholder}}</option>
          <option v-for="(item, index) in items" :key="index" :value="item.value">{{item.label}}</option>
        </select>
      </div>
      <div class="flex flex-row justify-start mt-1" v-else>(None specified)</div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    value: [String, Boolean, Array],
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    items: Array,
    info: String,
    inStyle: String
  },
}
</script>
<style scoped>
</style>

