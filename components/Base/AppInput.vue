<template>
  <section>
    <!-- text / email / password / time / select / textarea / multicheckbox / number -->
    <template
      v-if="['text','time','email', 'password', 'select', 'textarea', 'multi-checkbox', 'number'].includes(type)"
    >
      <div class="flex flex-col py-2 mb-3 md:mb-6">
        <div
          class="relative flex flex-wrap leading-none"
          :class="info ? 'flex-wrap justify-between' : 'items-center'"
        >
          <label :for="name" class="text-xs sm:text-sm py-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
          </label>
          <div v-if="info || error" class="flex">
            <div
              v-if="info"
              class="bg-gray-300 rounded px-1 md:px-4 py-1 text-xs sm:text-sm"
            >
              {{ info }}
            </div>
            <div
              v-if="error && type.includes('checkbox')"
              class="text-red-500 text-xs px-2"
            >
              {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
            </div>
          </div>
        </div>
        <template v-if="type === 'multi-checkbox'">
          <div v-if="!required" class="flex flex-row justify-start items-center mt-1">
            <input :id="name" v-model="na" type="checkbox" :disabled="value.length === 0">
            <label :for="name" class="text-xs sm:text-sm flex items-center">N/A</label>
          </div>
          <div
            v-for="(item, index) in lists"
            :key="index"
            class="flex flex-row justify-start items-center mt-1"
          >
            <input
              :id="`${name}-${index}`"
              :value="item.value"
              type="checkbox"
              :checked="Array.isArray(value) ? value.includes(item.value) : value"
              :disabled="disabled"
              @input="inputMultiCheck"
            >
            <label
              :for="`${name}-${index}`"
              class="text-xs sm:text-sm flex items-center"
            >{{ item.label }}</label>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-row justify-start mt-1">
            <template v-if="['text','time','email', 'number'].includes(type)">
              <div class="flex flex-col w-full mt-1">
                <input
                  :value="value"
                  :type="type"
                  :placeholder="placeholder"
                  class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                  :class="error ? 'border-red-500' : ''"
                  :style="inStyle"
                  :checked="value"
                  :readonly="disabled"
                  :min="type === 'number' && 1"
                  :maxlength="limit"
                  :max="maxInput"
                  step="any"
                  @focus="$emit('focus', $event.target.value)"
                  @input="$emit('input', $event.target.value)"
                  @keypress.enter="$emit('submit')"
                  @blur="$emit('blur')"
                  @keypress="type === 'number' ? isNumber($event) : $emit('keypress')"
                  @keydown="limit ? ($emit('keydown'), limitInput($event, value)) : $emit('keydown')"
                >
                <!-- @keypress="type === 'number' ? isNumber($event) : $emit('keypress')" -->
                <transition name="drop-down">
                  <div
                    v-if="error"
                    class="text-red-500 py-1 text-xs text-white"
                  >
                    {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
                  </div>
                </transition>
              </div>
            </template>

            <template v-if=" type === 'password' ">
              <div class="relative w-full mb-4">
                <div class="relative">
                  <input
                    class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                    :value="value"
                    :type="togglePassword()"
                    :placeholder="placeholder"
                    :class="error ? 'border-red-500' : ''"
                    :style="inStyle"
                    @input="$emit('input', $event.target.value)"
                    @keypress.enter="$emit('submit')"
                    @blur="$emit('blur')"
                    @focus="showPasswordFocus = true"
                  >
                  <span
                    class="absolute top-0 right-0 h-full focus:outline-none cursor-pointer flex items-center"
                    tabindex="-1"
                    @click="passwordToggle = !passwordToggle"
                  >
                    <svgicon
                      :name="togglePassword() === 'password' ? 'eye' : 'hide-eye'"
                      width="20"
                      height="20"
                      class="text-gray-500 hover:text-gray-600 fill-current"
                    />
                  </span>
                </div>

                <transition name="drop-down">
                  <div
                    v-if="error"
                    class="text-red-500 py-1 text-xs text-white"
                  >
                    {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
                  </div>
                </transition>
              </div>
            </template>
            <template v-if="type === 'select'">
              <div class="w-full relative">
                <div class="w-full customized-select flex items-center">
                  <select
                    ref="inputSelect"
                    :value="value"
                    class="absolute bottom-0 border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                    :class="[(error && !disabled) && 'border-red-500', disabled ? 'border-gray-400 text-gray-500 cursor-not-allowed' : 'cursor-pointer']"
                    :style="inStyle"
                    :disabled="disabled"
                    @input="$emit('input', $event.target.value)"
                    @change="$emit('change', $event.target.value)"
                    @blur="$emit('blur')"
                  >
                    <option v-if="placeholder" value disabled selected>
                      {{ placeholder }}
                    </option>
                    <option
                      v-for="(item, index) in items"
                      :key="index"
                      :value="item.value"
                      :selected="value === item.value"
                      :disabled="item.disabled"
                    >
                      {{ item.label }}
                    </option>
                  </select>
                  <span class="absolute right-0 h-full" :class="disabled ? 'text-gray-500' : ''">
                    <svgicon
                      name="arrow-up"
                      class="h-full w-10 p-2 mt-2 fill-current"
                      style="transform: rotate(180deg)"
                    />
                  </span>
                </div>
                <transition name="drop-down">
                  <div
                    v-if="error"
                    class="text-red-500 py-1 text-xs text-white"
                  >
                    {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
                  </div>
                </transition>
              </div>
            </template>
            <template v-if="type === 'textarea'">
              <div class="flex flex-col w-full">
                <textarea
                  id
                  :ref="'textarea'"
                  :cols="cols"
                  :rows="rows"
                  :value="value"
                  :placeholder="placeholder"
                  class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 px-2 font-bold text-xs sm:text-sm w-full"
                  :class="[error ? 'border-red-500':'', resize ? '' : 'resize-none']"
                  :limit="limit"
                  @input="$emit('input', $event.target.value)"
                  @blur="$emit('blur', $event)"
                  @keydown="limit ? ($emit('keydown'), limitInput($event, trimmedMessage(value))) : $emit('keydown')"
                />
                <div class="flex items-center justify-between">
                  <transition name="drop-down">
                    <div
                      v-if="error"
                      class="text-red-500 py-1 text-xs text-white"
                    >
                      {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
                    </div>
                  </transition>
                  <p
                    v-if="limit"
                    class="flex items-center text-xs ml-auto py-1 text-gray-500 transition-hover"
                    :class="trimmedMessage(value).length > limit ? 'text-red-600' : ''"
                  >
                    <transition name="fade">
                      <svgicon
                        v-if="trimmedMessage(value).length > limit"
                        name="exclamation-mark"
                        width="12"
                        height="12"
                        class="mr-1"
                        color="red"
                      />
                    </transition>
                    {{ trimmedMessage(value).length }}/{{ limit }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>

    <!-- single checkbox -->
    <template v-if="type === 'single-checkbox'">
      <div class="flex flex-col py-2 mb-2">
        <div class="flex justify-end">
          <!-- <div
            class="rounded-lg bg-red-500 px-2 py-1 text-xs sm:text-sm text-white"
            v-if="error"
          >{{error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ")}}</div>-->
        </div>
        <div class="flex flex-row flex-no-wrap justify-start items-center">
          <input
            :id="name"
            type="checkbox"
            :checked="value"
            :disabled="disabled"
            @change="$emit('input', $event.target.checked)"
          >
          <label :for="name" class="text-xs sm:text-sm py-1 flex items-center">{{ label }}</label>
        </div>
        <transition name="drop-down">
          <div
            v-if="error"
            class="py-1 text-xs text-red-500"
          >
            {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
          </div>
        </transition>
      </div>
    </template>

    <!-- multiemail -->
    <template v-if="type === 'multiemail'">
      <div class="flex flex-col py-2 mb-3 md:mb-6">
        <div class="relative flex flex-row flex-wrap justify-between">
          <div class="flex flex-wrap justify-start">
            <label :for="name" class="text-xs sm:text-sm py-1">{{ label }}</label>
            <span class="ml-2 bg-gray-300 rounded px-4 py-1 text-xs">Seperate with commas</span>
          </div>
          <transition name="fade">
            <div
              v-if="error"
              class="absolute right-0 bg-red-500 py-1 px-2 text-xs sm:text-sm text-white"
            >
              {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
            </div>
          </transition>
        </div>
        <div class="flex flex-row justify-start mt-1">
          <input
            :value="value"
            type="email"
            :placeholder="placeholder"
            class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full"
            :class="error ? 'border-red-500':''"
            @input="$emit('input', $event.target.value)"
          >
        </div>
      </div>
    </template>

    <!-- search -->
    <template v-if="type === 'search'">
      <div v-if="type === 'search'" class="flex flex-col">
        <div v-if="label" class="relative flex flex-row flex-wrap justify-between">
          <label :for="name" class="text-xs sm:text-sm py-1">{{ label }}</label>
          <div class="flex">
            <div v-if="info" class="bg-gray-300 rounded px-4 py-1 text-xs sm:text-sm">
              {{ info }}
            </div>
            <transition name="fade">
              <div
                v-if="error"
                class="absolute right-0 bg-red-500 py-1 px-2 text-xs sm:text-sm text-white"
              >
                {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
              </div>
            </transition>
          </div>
        </div>
        <div
          class="relative flex flex-row justify-start items-center border-2 mb-2 focus:border-yellow-400 rounded-lg"
        >
          <input
            :value="value"
            :type="type"
            :placeholder="placeholder"
            class="focus:outline-none pl-4 pr-6 py-3 font-bold text-xs sm:text-sm w-full rounded-lg"
            :class="error? 'border-red-500':''"
            :style="inStyle"
            :checked="value"
            @input="$emit('input', $event.target.value)"
            @keypress.enter="$emit('submit')"
            @blur="$emit('blur')"
          >
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
    inClass: String,
    limit: Number,
    required: {
      type: Boolean,
      default: false
    },
    maxInput: Number,
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
  data () {
    return {
      passwordValue: "",
      // show/hide password
      passwordToggle: false
    }
  },
  computed: {
    na: {
      get () {
        return this.value.length === 0 ? true : false
      },
      set (naValue) {
        if (naValue) {
          return this.$emit("uncheckAll")
        } else if (!naValue) {
          return this.value.length > 0 ? false : true
        }
      }
    }
  },
  methods: {
    // for multi checkbox
    inputMultiCheck (e) {
      if (e.target.checked) {
        this.$emit("checked", e.target.value)
      } else {
        this.$emit("unchecked", e.target.value)
      }
    },
    // for password
    togglePassword () {
      if (this.passwordToggle) {
        return "text"
      } else {
        return "password"
      }
    },
    trimmedMessage(value) {
			return value.replace(/^\s*/, "").replace(/\s*$/, "");
		},
    limitInput(e, value) {
       let acceptedKeys = [
        "Backspace",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
      ];
      if (
        value.length >= this.limit &&
        !acceptedKeys.includes(e.key)
      ) {
        e.preventDefault();
      }
    }
  }
}
</script>

<style>
input::placeholder,
textarea::placeholder {
  color: #8d9bad;
}
</style>  