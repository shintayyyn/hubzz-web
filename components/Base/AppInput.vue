<template>
  <section>
    <!-- input text / email / password / checkbox -->
    <div v-if="type === 'checkbox'" class="flex flex-col py-2 mb-6">
      <div class="flex flex-row flex-nowrap justify-between">
        <div class="text-xs sm:text-sm py-1">
          <input
            :value="value"
            :type="type"
            :placeholder="placeholder"
            @input="$emit('input', $event.target.checked)"
            @keyup.enter="$emit('submit')"
          >
        </div>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1">
        <label :for="name" class="text-xs sm:text-sm">{{label}}</label>
      </div>
    </div>
    <div v-else class="flex flex-col py-2 mb-6">
      <div class="flex flex-row flex-nowrap justify-between">
        <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1">
        <input
          :value="value"
          :type="type"
          :placeholder="placeholder"
          class="border-b-2 focus:border-yellow focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
          :class="error? 'border-red':''"
          @input="$emit('input', $event.target.value)"
          @keyup.enter="$emit('submit')"
        >
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    value: [String, Boolean],
    type: String,
    name: String,
    label: String,
    placeholder: String,
    error: Object
  }
}
</script>
<style scoped>
</style>

