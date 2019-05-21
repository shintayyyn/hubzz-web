<template>
  <section>
    <!-- input select -->
    <div class="flex flex-col py-2 mb-6">
      <div class="flex flex-row flex-nowrap justify-between">
        <label :for="name" class="text-xs sm:text-base py-1">{{label}}</label>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1">
        <select
          class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
          :class="error? 'border-red':''"
          @input="$emit('input', $event.target.value)"
        >
          <option
            v-for="(item, index) in items"
            :key="index"
            :value="item"
            :selected="item === value"
          >{{item}}</option>
        </select>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    value: String,
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    items: Array
  },
  created() {
    console.log(this.value)
  }
}
</script>
<style scoped>
</style>

