<template>
  <section>
    <template v-if="['text','time','email', 'password', 'select', 'textarea', 'multi-checkbox', 'number'].includes(type)">
      <div class="flex flex-col" :class="wrapperClass ? wrapperClass : 'mb-3 md:mb-6 py-2'">
        <div v-if="label || info" class="relative flex flex-wrap leading-none" :class="info ? 'flex-wrap justify-between' : 'items-center'">
          <label :for="name" class="text-xs sm:text-sm py-1">
            <span>{{ label }}</span>

            <span v-if="required" class="text-red-500">*</span>
          </label>

          <div v-if="info || error" class="flex">
            <div v-if="info" class="bg-gray-300 rounded px-1 md:px-4 py-1 text-xs sm:text-sm">
              <span>{{ info }}</span>
            </div>

            <div v-if="error && type.includes('checkbox')" class="text-red-500 text-xs px-2">
              <span>{{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}</span>
            </div>
          </div>
        </div>

        <template v-if="type === 'multi-checkbox'">
          <div v-if="updatable" class="flex flex-row justify-start items-center mt-1">
            <div class="mb-1 bg-yellow-500 text-sm p-1 shadow-lg rounded-lg cursor-pointer hover:text-white" @click="add">
              Add mandatory training
            </div>
          </div>

          <div v-if="!required" class="flex flex-row justify-start items-center mt-1">
            <input :id="name" v-model="na" type="checkbox" :disabled="value.length === 0">

            <label :for="name" class="text-xs sm:text-sm flex items-center">N/A</label>
          </div>

          <template v-if="toAdd">
            <div class="flex flex-row justify-start items-center mt-1">
              <div class="flex flex-col w-full">
                <input
                  v-model="listLabel"
                  class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm shadow-none"
                  placeholder="Type Training Title Here"
                  type="text"
                >

                <div v-if="errorMsg" class="text-sm text-red-500">
                  <span>{{ errorMsg }}</span>
                </div>
              </div>

              <div class="ml-2 bg-yellow-500 p-1 rounded-lg shadow-lg cursor-pointer hover:text-white hover:bg-yellow-600" @click="save(null, 'add')">
                <span>Add</span>
              </div>

              <div class="ml-2 bg-red-500 p-1 rounded-lg shadow-lg cursor-pointer text-white hover:text-black hover:bg-red-400" @click="cancel">
                <span>Cancel</span>
              </div>
            </div>
          </template>

          <div v-for="(item, index) in lists" :key="index" class="flex flex-row justify-start items-center mt-1">
            <template v-if="toEdit && editId === item.value && updatable">
              <div class="flex flex-col w-full">
                <input
                  :id="`${name}-${index}`"
                  v-model="listLabel"
                  class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm shadow-none"
                  type="text"
                >
                <div v-if="errorMsg" class="text-sm text-red-500">
                  {{ errorMsg }}
                </div>
              </div>
            </template>

            <template v-else>
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
            </template>

            <template v-if="updatable">
              <div
                v-if="editId !== item.value"
                class="ml-2 bg-yellow-500 p-1 rounded-lg shadow-lg cursor-pointer hover:text-white hover:bg-yellow-600"
                @click="edit(item)"
              >
                Edit
              </div>
              <div
                v-if="editId !== item.value"
                class="ml-2 bg-red-500 p-1 rounded-lg shadow-lg cursor-pointer text-white hover:text-black hover:bg-red-400"
                @click="$emit('remove', item)"
              >
                Remove
              </div>
              <div
                v-if="editId === item.value"
                class="ml-2 bg-yellow-500 p-1 rounded-lg shadow-lg cursor-pointer hover:text-white hover:bg-yellow-600"
                @click="save(item, 'update')"
              >
                Save
              </div>
              <div
                v-if="editId === item.value"
                class="ml-2 bg-red-500 p-1 rounded-lg shadow-lg cursor-pointer text-white hover:text-black hover:bg-red-400"
                @click="cancel"
              >
                Cancel
              </div>
            </template>
          </div>
        </template>

        <template v-else>
          <div class="flex flex-row justify-start mt-1">
            <template v-if="['text','time','email', 'number'].includes(type)">
              <div class="flex flex-col w-full">
                <div class="flex items-center justify-start">
                  <p v-if="format && format === 'mobile'" class="text-xs sm:text-sm font-bold py-2 pr-1 border-b-2 border-transparent">
                    <span>+44</span>
                  </p>

                  <input
                    :value="value"
                    :type="type"
                    :placeholder="placeholder"
                    class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full shadow-none"
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
                </div>

                <transition name="drop-down">
                  <div v-if="error" class="text-red-500 py-1 text-xs text-white">
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
              <div :class="['w-full relative', inClass]">
                <div class="w-full customized-select flex items-center">
                  <select
                    ref="inputSelect"
                    :value="value"
                    class="absolute bottom-0 border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                    :class="[
                      (error && !disabled) ? 'border-red-500' : inClass,
                      disabled ? 'border-gray-400 text-gray-500 cursor-not-allowed' : 'cursor-pointer',
                    ]"
                    :style="inStyle"
                    :disabled="disabled"
                    @input="$emit('input', $event.target.value)"
                    @change="$emit('change', $event.target.value)"
                    @blur="$emit('blur')"
                    @focus="$emit('focus')"
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
                  <span
                    class="absolute right-0 h-full flex items-center"
                    :class="[disabled ? 'text-gray-500' : '', wrapperClass ? '' : '-mt-1']"
                  >
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
                  :style="inStyle"
                  :readonly="disabled"
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
    updatable: {
      type: Boolean,
      default: false,
    },

    value: {
      type: [String, Boolean, Array, Number, Object,],
      default: null,
    },

    type: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    label: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: null,
    },

    error: {
      type: String,
      default: () => null,
    },

    info: {
      type: String,
      default: null,
    },

    inStyle: {
      type: String,
      default: null,
    },

    inClass: {
      type: String,
      default: null,
    },

    wrapperClass: {
      type: String,
      default: null,
    },

    limit: {
      type: Number,
      default: null,
    },

    format: {
      type: String,
      default: null,
    },

    required: {
      type: Boolean,
      default: false,
    },

    maxInput: {
      type: Number,
      default: null,
    },

    // for select
    items: {
      type: Array,
      default: () => null,
    },

    // for textarea
    cols: {
      default: 30,
      type: Number,
    },

    rows: {
      default: 10,
      type: Number,
    },

    resize: {
      default: true,
      type: Boolean,
    },

    // for multicheckbox
    lists: {
      type: Array,
      default: () => null,
    },

    //
    disabled: {
      type: Boolean,
      default: false,
    },

    isHorizontal: Boolean,
  },

  data () {
    return {
      passwordValue: "",
      // show/hide password
      passwordToggle: false,
      //
      toAdd: false,
      toEdit: false,
      editId: null,
      listLabel: "",
      errorMsg: null,
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
      },
    },
  },

  methods: {
    // for updatable multi checkbox
    add () {
      this.cancel()
      this.toAdd = true
    },
    edit (payload) {
      this.cancel()
      this.toEdit = true
      this.editId = payload.value
      this.listLabel = payload.label
    },
    cancel () {
      this.toEdit = false
      this.editId = null
      this.listLabel = ""
      this.toAdd = false
      this.errorMsg = null
    },
    save (payload, type) {
      this.errorMsg = null
      if (this.listLabel.trim().length === 0) {
        this.errorMsg = "Name is required."
      } else {
        if (type === "add") {
          let hasSameLabel = this.lists.find(
            list => list.label === this.listLabel
          )

          if (hasSameLabel) {
            this.errorMsg = "Name already exists."
          } else {
            this.$emit("addList", this.listLabel)
            this.cancel()
          }
        } else if (type === "update") {
          let hasSameLabel = this.lists.find(
            list =>
              list.label === this.listLabel && list.value !== payload.value
          )

          if (hasSameLabel) {
            this.errorMsg = "Name already exists."
          } else {
            this.$emit("updateList", {
              label: this.listLabel,
              value: payload.value,
            })
            this.cancel()
          }
        }
      }
    },
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
    trimmedMessage (value) {
      if (value) {
        return value.replace(/^\s*/, "").replace(/\s*$/, "")
      } else {
        return ""
      }
    },

    limitInput (e) {
      let acceptedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ]

      if (e.target.value.length >= this.limit && !acceptedKeys.includes(e.key)) {
        e.preventDefault()
      }
    },
  },

}
</script>

<style>
input::placeholder,
textarea::placeholder {
	color: #8d9bad;
}
</style>  
