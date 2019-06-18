<template>
  <section>
    <!-- multicheckbox -->
    <div v-if="type === 'multi-checkbox'" class="flex flex-col py-2 mb-6">
      <div class="relative flex flex-row flex-nowrap justify-between">
        <label :for="name" class="text-xs sm:text-base py-1">{{label}}</label>
        <div class="bg-grey-light rounded-lg p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1" v-for="(item, index) in lists" :key="index">
        <input
          :value="item.value"
          type="checkbox"
          @input="inputCheck"
          class="mt-1 mr-1"
          :checked="isChecked.includes(item.value)"
        >
        <label :for="item.name" class="text-xs sm:text-sm py-1">{{item.label}}</label>
      </div>
    </div>

    <!-- single checkbox -->
    <div v-if="type === 'single-checkbox'" class="flex flex-col py-2 mb-6">
      <!-- <div class="relative flex flex-row flex-nowrap justify-end"> -->
      <!-- </div> -->
      <div class="flex flex-row flex-nowrap justify-between">
        <div>
          <input
            :value="value"
            type="checkbox"
            @input="$emit('input', $event.target.checked)"
            class="mt-1 mr-1"
          >
          <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        </div>
        <div class="bg-red p-1 text-xs sm:text-base text-white" v-if="error">{{error.message}}</div>
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

    <!-- text / email / password / date / time -->
    <div
      v-if="type === 'text' || type === 'time' || type === 'email' || type === 'password' || type === 'date'"
      class="flex flex-col py-2 mb-6"
    >
      <div class="relative flex flex-row flex-nowrap justify-between">
        <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        <div
          class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
          v-if="error"
        >{{error.message}}</div>
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
          :style="inStyle"
          @keypress.enter="$emit('submit')"
          @blur="$emit('blur')"
          :checked="value"
        >
        <!-- v-on="name === 'mobile_number' || name === 'unpaid_breaks_in_minutes' || name === 'phone_number' || name === 'number_of_patients' || name === 'duration_for_each_appointment' ? { keypress: ValidateInput } : null" -->
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      isChecked: []
    }
  },
  // watch: {
  //   value(value) {
  //     if (this.value instanceof Array) {
  //       console.log(value)
  //       this.isChecked = value
  //     }
  //   }
  // },
  props: {
    value: [String, Boolean, Array, Number],
    type: String,
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    info: String,
    inStyle: String,
    // for multiselect checkbox
    lists: Array,
    selected: Array,
    // for multiemail
    // selectedEmails: Array
  },
  watch: {
    value(data) {
      if (data instanceof Array) {
        this.isChecked = data
      }
    }
  },
  created() {
    if (this.value instanceof Array) {
      this.isChecked = this.value
    }
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

