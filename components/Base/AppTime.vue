<template>
  <div
    v-on-clickaway="toggledOff"
    class="flex flex-col leading-normal"
    :class="wrapperClass ? wrapperClass : 'mb-3 md:mb-4'"
  >
    <div v-if="!nolabel && label" class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
    </div>

    <div class="flex flex-col justify-start">
      <input
        :value="value"
        type="input"
        :placeholder="label && nolabel ? label : 'hh:mm'"
        class="focus:border-yellow-400 focus:outline-none py-1 font-bold text-xs w-full shadow-none text-center"
        :class="[error ? 'border-red-500' : '', modal === true && 'border-yellow-400', inClass, disabled ? 'cursor-not-allowed text-gray-500' : '', border ? 'border-2 rounded px-2' : 'border-b-2']"
        :style="inStyle"
        :readonly="readonly"
        :disabled="disabled"
        @click="modal = true"
        @input="$emit('input', $event.target.value)"
        @change="$emit('change', $event.target.value)"
        @keydown="(e) => keydownHandler(e, value)"
      >
      <transition name="drop-down">
        <div
          v-if="error"
          class="p-1 text-xs text-red-500"
        >
          {{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}
        </div>
      </transition>
    </div>

    <transition name="fade">
      <div v-if="modal" class="relative z-10 flex justify-center">
        <div class="w-full absolute border bg-white rounded-b-lg shadow-md" style="min-width: 80px">
          <div class="flex flex-row justify-center">
            <div class="input-container flex flex-col overflow-y-auto w-full">
              <div
                v-for="(hour, index) in hours"
                :ref="`hour-${hour}`"
                :key="index"
                class="flex flex-row justify-center cursor-pointer text-sm"
                :class="{ 'bg-gray-600 text-white': selectedHour === hour }"
                @click="selectTime(hour, 'hour')"
              >
                {{ hour }}
              </div>
            </div>

            <div class="input-container flex flex-col overflow-y-auto w-full">
              <div
                v-for="(minute, index) in minutes"
                :ref="`minute-${minute}`"
                :key="index"
                class="flex flex-row justify-center cursor-pointer text-sm"
                :class="{ 'bg-gray-600 text-white': selectedMinute === minute }"
                @click="selectTime(minute, 'minute')"
              >
                {{ minute }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mixin as clickaway, } from "vue-clickaway"

const minutes = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
]

export default {
  mixins: [clickaway,],

  props: {
    value: {
      type: String,
      default: '',
    },
    
    name: {
      type: String,
      default: '',
    },
    
    label: {
      type: String,
      default: '',
    },
    
    error: {
      type: Object,
      default: () => null,
    },
    
    inStyle: {
      type: String,
      default: '',
    },
    
    required: {
      type: Boolean,
      default: false,
    },
    
    inClass: {
      type: String,
      default: '',
    },
    
    wrapperClass: {
      type: String,
      default: '',
    },
    
    disabled: {
      type: Boolean,
      default: false,
    },
    
    hourType: {
      type: String,
      default: '',
    },

    nolabel: {
      type: Boolean,
      default: false,
    },

    border: {
      type: Boolean,
      default: false,
    },

    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      minutes,
      selectedHour: "00",
      selectedMinute: "00",
      modal: false,
    }
  },

  computed: {
    hours () {
      if (this.hourType && ["am", "AM",].includes(this.hourType)) {
        return [
          "00",
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
        ]
      } else if (this.hourType && ["pm", "PM",].includes(this.hourType)) {
        return [
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
        ]
      } else {
        return [
          "00",
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
        ]
      }
    },
  },

  watch: {
    // selectedHour (hour) {
    //   console.log('selectedHour', hour)
    //   // if (hour === "24") {
    //   //   this.selectTime("00", "minute")
    //   // }

    //   // this.$emit("change", hour)

    //   console.log('this.$refs', this.$refs[`hour-${hour}`] && this.$refs[`hour-${hour}`][0])

    //   if (this.$refs[`hour-${hour}`] && this.$refs[`hour-${hour}`][0]) {
    //     console.log('scrollIntoView hour')
    //     this.$refs[`hour-${hour}`][0].scrollIntoView({
    //       behavior: "smooth",
    //       block: "nearest",
    //       inline: "start",
    //     })
    //   }
    // },

    // selectedMinute (minute) {
    //   console.log('selectedMinute', minute)

    //   // this.$emit("change", minute)

    //   console.log('this.$refs', this.$refs[`minute-${minute}`] && this.$refs[`minute-${minute}`][0])

    //   if (this.$refs[`minute-${minute}`] && this.$refs[`minute-${minute}`][0]) {
    //     console.log('scrollIntoView minute')
    //     this.$refs[`minute-${minute}`][0].scrollIntoView({
    //       behavior: "smooth",
    //       block: "nearest",
    //       inline: "start",
    //     })
    //   }
    // },

    value () {
      this.setHourMinuteFromValue()
    },
  },

  created () {
    this.setHourMinuteFromValue()
  },

  methods: {
    keydownHandler ($event, value) {
      const allowedKeys = [
        'Shift',
        'Alt',
        'Control',
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
      ]

      if (value?.length === 0) {
        allowedKeys.push(...[
          '0',
          '1',
          '2',
        ])
      }

      if (value?.length === 1) {
        if (value === '0' || value === '1') {
          allowedKeys.push(...[
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
          ])
        }

        if (value === '2') {
          allowedKeys.push(...[
            '0',
            '1',
            '2',
            '3',
          ])
        }
      }

      if (value?.length === 2) {
        allowedKeys.push(...[
          ':',
        ])
      }

      if (value?.length === 3) {
        allowedKeys.push(...[
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
        ])
      }

      if (value?.length === 4) {
        allowedKeys.push(...[
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
        ])
      }

      if (!allowedKeys.includes($event.key)) {
        console.log('preventDefault')
        $event.preventDefault()
      }
    },

    setHourMinuteFromValue () {
      const hour = this.value && this.value.split(":")[0] ? this.value.split(":")[0] : ''

      const minute = this.value && this.value.split(":")[1] ? this.value.split(":")[1] : ''

      if (hour !== this.selectedHour && this.hours.includes(hour)) {
        this.selectedHour = hour
      }

      if (minute !== this.selectedMinute && this.minutes.includes(minute)) {
        this.selectedMinute = minute
      }
    },

    selectTime (value, type) {
      if (type === "hour") {
        this.selectedHour = value
      }

      if (type === "minute") {
        this.selectedMinute = value
      }

      this.$emit("input", `${this.selectedHour}:${this.selectedMinute}`)
    },
    
    toggledOff () {
      this.modal = false
    },
  },
}
</script>

<style scoped>
.input-container {
	min-height: 100px;
	max-height: 100px;
}
::-webkit-scrollbar {
	width: 8px;
}
::-webkit-scrollbar-track {
	background: #ececec;
	border-radius: 3px;
}

::-webkit-scrollbar-track:hover {
	background: #eee;
	border-radius: 3px;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: #ddd;
	border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #ccc;
}
</style>
