<template>
  <section>
    <!-- multicheckbox -->
    <div v-if="type === 'multi-checkbox'" class="flex flex-col py-2 mb-6">
      <div class="relative flex flex-row flex-nowrap justify-between">
        <label :for="name" class="text-xs sm:text-base py-1">{{label}}</label>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1" v-for="(item, index) in lists" :key="index">
        <input :value="item.id" type="checkbox" @input="inputCheck" class="mt-1 mr-1">
        <label :for="item.name" class="text-xs sm:text-sm py-1">{{item.name}}</label>
      </div>
    </div>

    <!-- multiemail -->
    <div v-if="type === 'multiemail'" class="flex flex-col py-2 mb-6">
      <div class="relative flex flex-row flex-nowrap justify-between">
        <div class="flex flex-wrap justify-start">
          <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
          <span class="ml-2 bg-grey-light rounded-lg px-4 py-1 text-xs">Seperate with commas</span>
        </div>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      </div>
      <!-- <div class="flex flex-row flex-wrap justify-start">
        <div
          class="rounded-lg bg-yellow-dark py-1 px-3 m-1"
          v-for="(item, index) in selectedEmails"
          :key="index"
        >{{item}}</div>
      </div>-->
      <div class="flex flex-row justify-start mt-1">
        <input
          :value="value"
          type="email"
          :placeholder="placeholder"
          class="border-b-2 focus:border-yellow focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
          :class="error ? 'border-red':''"
          @input="$emit('input', $event.target.value)"
        >
      </div>
    </div>

    <!-- text / email / password  -->
    <div v-else class="flex flex-col py-2 mb-6">
      <div class="relative flex flex-row flex-nowrap justify-between">
        <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
        <div class="bg-grey-light rounded-lg p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1">
        <input
          :value="value"
          :type="type"
          :placeholder="placeholder"
          class="border-b-2 focus:border-yellow focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
          :class="error? 'border-red':''"
          @input="$emit('input', $event.target.value)"
          v-on="name === 'mobile_number' || name === 'phone_number' ? { keypress: ValidateInput } : null"
          :style="inStyle"
          @keypress.enter="$emit('submit')"
        >
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    value: [String, Boolean, Array],
    type: String,
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    info: String,
    inStyle: String,
    // for multiselect checkbox
    lists: Array,
    // for multiemail
    // selectedEmails: Array
  },
  methods: {
    // for multiselect checkbox
    inputCheck(e) {
      if (e.target.checked) {
        this.$emit('checked', e.target.value)
      } else {
        this.$emit('unchecked', e.target.value)
      }
    }
  }
}
</script>
<style scoped>
</style>

