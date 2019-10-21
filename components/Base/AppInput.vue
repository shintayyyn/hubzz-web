<template>
  <section>
    <!-- text / email / password / time / select / textarea / multicheckbox / number -->
    <template
      v-if="['text','time','email','password', 'select', 'textarea', 'multi-checkbox', 'number'].includes(type)"
    >
      <div class="flex flex-col py-2 mb-6">
        <div class="relative flex flex-row flex-no-wrap justify-between">
          <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
          <div class="flex">
            <div class="bg-gray-300 rounded-lg px-4 py-1 text-xs sm:text-sm" v-if="info">{{info}}</div>
            <div
              class="absolute rounded-lg right-0 bg-red-500 p-1 text-xs sm:text-sm text-white"
              v-if="error"
            >{{error.message}}</div>
          </div>
        </div>
        <template v-if="type === 'multi-checkbox'">
          <div
            class="flex flex-row justify-start items-center mt-1"
            v-for="(item, index) in lists"
            :key="index"
          >
            <input
              :value="item.value"
              :id="`${name}-${index}`"
              type="checkbox"
              @input="inputMultiCheck"
              :checked="Array.isArray(value) ? value.includes(item.value) : value"
            />
            <label :for="`${name}-${index}`" class="text-xs sm:text-sm">{{item.label}}</label>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-row justify-start mt-1">
            <template v-if="['text','time','email','password', 'number'].includes(type)">
              <input
                :value="value"
                :type="type"
                :placeholder="placeholder"
                class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                :class="error ? 'border-red-500' : ''"
                @input="$emit('input', $event.target.value)"
                @keypress.enter="$emit('submit')"
                @blur="$emit('blur')"
                :style="inStyle"
                :checked="value"
                :min="type === 'number' && 0"
              />
            </template>
            <template v-if="type === 'select'">
              <div class="w-full relative customized-select py-8 flex items-center">
                <select
                  ref="inputSelect"
                  :value="value"
                  class="absolute border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                  :class="[error ? 'border-red-500':'']"
                  @input="$emit('input', $event.target.value)"
                  :style="inStyle"
                  @change="$emit('change', $event.target.value)"
                  @blur="$emit('blur')"
                  :disabled="disabled"
                >
                  <option value disabled selected v-if="placeholder">{{placeholder}}</option>
                  <option
                    v-for="(item, index) in items"
                    :key="index"
                    :value="item.value"
                    :selected="value === item.value"
                  >{{item.label}}</option>
                </select>
                <span class="absolute right-0">
                  <svgicon
                    name="arrow-up"
                    class="h-full w-10 p-2"
                    style="transform: rotate(180deg)"
                  />
                </span>
              </div>
            </template>
            <template v-if="type === 'textarea'">
              <textarea
                id
                :cols="cols"
                :rows="rows"
                :value="value"
                :placeholder="placeholder"
                class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 px-2 font-bold text-xs sm:text-sm w-full"
                :class="[error ? 'border-red-500':'', resize ? '' : 'resize-none']"
                @input="$emit('input', $event.target.value)"
                @blur="$emit('blur', $event)"
              ></textarea>
            </template>
          </div>
        </template>
      </div>
    </template>

    <!-- single checkbox -->
    <template v-if="type === 'single-checkbox'">
      <div class="flex flex-col py-2 mb-2">
        <div class="flex justify-end">
          <div
            class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
            v-if="error"
          >{{error.message}}</div>
        </div>
        <div class="flex flex-row flex-no-wrap justify-start items-center">
          <input
            type="checkbox"
            :id="name"
            @change="$emit('input', $event.target.checked)"
            :checked="value"
            :disabled="disabled"
          />
          <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
        </div>
      </div>
    </template>

    <!-- multiemail -->
    <template v-if="type === 'multiemail'">
      <div class="flex flex-col py-2 mb-6">
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
    </template>

    <!-- search -->
    <template v-if="type === 'search'">
      <div v-if="type === 'search'" class="flex flex-col">
        <div v-if="label" class="relative flex flex-row flex-no-wrap justify-between">
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
    </template>
  </section>
</template>
<script>
export default {
  props: {
    value: [String, Boolean, Array, Number, Object],
    type: String,
    name: String,
    label: String,
    placeholder: String,
    error: Object,
    info: String,
    inStyle: String,
    // for select
    items: Array,
    // for textarea
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
    // for multicheckbox
    lists: Array,
    //
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // for multi checkbox
    inputMultiCheck(e) {
      if (e.target.checked) {
        this.$emit("checked", e.target.value);
      } else {
        this.$emit("unchecked", e.target.value);
      }
    }
  }
};
</script>