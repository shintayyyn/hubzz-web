<template>
  <div
    v-on-clickaway="toggledOff"
    class="flex flex-col leading-normal"
    :class="wrapperClass ? wrapperClass : 'mb-3 md:mb-4'"
  >
    <div v-if="label" class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
    </div>
    <div class="flex flex-col justify-start">
      <input
        :value="value"
        type="input"
        placeholder="hh:mm"
        class="border-b-2 focus:border-yellow-400 focus:outline-none py-1 font-bold text-xs sm:text-sm w-full shadow-none text-center"
        :class="[error ? 'border-red-500' : '', modal === true && 'border-yellow-400', inClass, disabled ? 'cursor-not-allowed text-gray-500' : '']"
        :style="inStyle"
        readonly
        :disabled="disabled"
        @click="modal = true"
        @input="$emit('input', $event.target.value)"
        @change="$emit('change', $event.target.value)"
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
        <div class="w-full absolute border bg-white rounded-b-lg shadow-md">
          <div class="flex flex-row justify-center">
            <div class="input-container flex flex-col overflow-y-auto w-full">
              <div
                v-for="(hour, index) in hours"
                :key="index"
                class="flex flex-row justify-center cursor-pointer"
                :class="{ 'bg-gray-600 text-white': selectedHour === hour }"
                @click="selectTime(hour, 'hour')"
              >
                {{ hour }}
              </div>
            </div>
            <div class="input-container flex flex-col overflow-y-auto w-full">
              <div
                v-for="(minute, index) in computedMinutes"
                :key="index"
                class="flex flex-row justify-center cursor-pointer"
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
// const hours = [
// 	"00",
// 	"01",
// 	"02",
// 	"03",
// 	"04",
// 	"05",
// 	"06",
// 	"07",
// 	"08",
// 	"09",
// 	"10",
// 	"11",
// 	"12",
// 	"13",
// 	"14",
// 	"15",
// 	"16",
// 	"17",
// 	"18",
// 	"19",
// 	"20",
// 	"21",
// 	"22",
// 	"23"
// ];
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
    value: String,
    name: String,
    label: String,
    error: Object,
    inStyle: String,
    required: Boolean,
    inClass: String,
    wrapperClass: String,
    disabled: Boolean,
    hourType: String,
  },
  data () {
    return {
      // hours: [],
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
    computedMinutes () {
      if (this.selectedHour === "24") {
        return ["00",]
      } else {
        return this.minutes
      }
    },
  },
  watch: {
    selectedHour (newValue, oldValue) {
      if (newValue === "24") {
        this.selectTime("00", "minute")
      }
      this.$emit("change", newValue)
    },
    selectedMinute (newValue, oldValue) {
      this.$emit("change", newValue)
    },
  },
  created () {
    if (this.value) {
      this.selectedHour = this.value.split(":")[0]
      this.selectedMinute = this.value.split(":")[1]
    }
  },
  methods: {
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
