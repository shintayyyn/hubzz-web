<template>
  <section>
    <!-- multicheckbox -->
    <div v-if="type === 'multi-checkbox'" class="flex flex-col py-2 mb-6">
      <div class="relative flex flex-row flex-no-wrap justify-between">
        <label :for="name" class="text-xs sm:text-base py-1">{{label}}</label>
        <div class="bg-gray-300 rounded-lg p-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
        <div
          class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
          v-if="error"
        >{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1" v-for="(item, index) in lists" :key="index">
        <input
          :value="item.value"
          type="checkbox"
          @input="inputCheck"
          class="mt-1 mr-1"
          :checked="isChecked.includes(item.value)"
        />
        <label :for="item.name" class="text-xs sm:text-sm py-1">{{item.label}}</label>
      </div>
    </div>

    <!-- single checkbox -->
    <div v-if="type === 'single-checkbox'" class="flex flex-col py-2 mb-6">
      <div class="flex flex-row flex-no-wrap justify-between">
        <div>
          <input
            :value="value"
            type="checkbox"
            @input="$emit('input', $event.target.checked)"
            class="mt-1 mr-1"
          />
          <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
          <div
            class="absolute bg-red-500 p-1 text-xs sm:text-sm text-white"
            v-if="error"
          >{{error.message}}</div>
        </div>
      </div>
    </div>

    <!-- multiemail -->
    <div v-if="type === 'multiemail'" class="flex flex-col py-2 mb-6">
      <div class="relative flex flex-row flex-no-wrap justify-between">
        <div class="flex flex-wrap justify-start">
          <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
          <span class="ml-2 bg-gray-300 rounded-lg px-4 py-1 text-xs">Seperate with commas</span>
        </div>
        <div
          class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
          v-if="error"
        >{{error.message}}</div>
      </div>
      <div class="flex flex-row justify-start mt-1">
        <input
          :value="value"
          type="email"
          :placeholder="placeholder"
          class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
          :class="error ? 'border-red-500':''"
          @input="$emit('input', $event.target.value)"
        />
      </div>
    </div>

    <!-- text / email / password / date / time -->
    <div
      v-if="type === 'text' || type === 'time' || type === 'email' || type === 'password' || type === 'date'"
      class="flex flex-col py-2 mb-6"
    >
      <div class="relative flex flex-row flex-no-wrap justify-between">
        <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        <div class="flex">
          <div class="bg-gray-300 rounded-lg px-4 py-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
          <div
            class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
            v-if="error"
          >{{error.message}}</div>
        </div>
      </div>
      <div class="flex flex-row justify-start mt-1">
        <input
          :value="value"
          :type="type"
          :placeholder="placeholder"
          class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
          :class="error? 'border-red-500':''"
          @input="$emit('input', $event.target.value)"
          :style="inStyle"
          @keypress.enter="$emit('submit')"
          @blur="$emit('blur')"
          :checked="value"
        />
      </div>
    </div>
    <!-- search -->
    <div v-if="type === 'search'" class="flex flex-col">
      <div class="relative flex flex-row flex-no-wrap justify-between">
        <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        <div class="flex">
          <div class="bg-gray-300 rounded-lg px-4 py-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
          <div
            class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
            v-if="error"
          >{{error.message}}</div>
        </div>
      </div>
      <div
        class="relative flex flex-row justify-start items-center border-2 mb-2 focus:border-yellow-400 rounded-lg"
      >
        <input
          :value="value"
          :type="type"
          :placeholder="placeholder"
          class="focus:outline-none pl-4 pr-6 py-4 font-bold text-xs sm:text-sm w-full rounded-lg"
          :class="error? 'border-red-500':''"
          @input="$emit('input', $event.target.value)"
          :style="inStyle"
          @keypress.enter="$emit('submit')"
          @blur="$emit('blur')"
          :checked="value"
        />
        <span class="absolute right-0 px-2 py-2 bg-white">
          <svgicon name="search" height="21" width="21" class="text-gray-500 fill-current" />
        </span>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      isChecked: []
    };
  },
  props: {
    value: [String, Boolean, Array, Number, Object],
    type: String,
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    info: String,
    inStyle: String,
    // for multiselect checkbox
    lists: Array,
    selected: Array
    // for multiemail
    // selectedEmails: Array
  },
  watch: {
    value(data) {
      if (data instanceof Array) {
        this.isChecked = data;
      }
    }
  },
  created() {
    if (this.value instanceof Array) {
      this.isChecked = this.value;
    }
  },
  methods: {
    // for multiselect checkbox
    inputCheck(e) {
      if (e.target.checked) {
        this.$emit("checked", e.target.value);
      } else {
        this.$emit("unchecked", e.target.value);
      }
    }
  }
};
</script>