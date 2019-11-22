<template>
  <div class="flex flex-col py-2 mb-3 md:mb-6 leading-normal" v-on-clickaway="toggledOff">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1">{{ label }}</label>
    </div>
    <div class="flex flex-col justify-start mt-1">
      <input
        :value="value"
        type="input"
        placeholder="hh:mm"
        class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full text-center"
        :class="[error ? 'border-red-500' : '', modal === true && 'border-yellow-400']"
        @click="modal = true"
        @input="$emit('input', $event.target.value)"
        :style="inStyle"
      />
      <div
        class="p-1 text-xs text-red-500"
        v-if="error"
      >{{ error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ") }}</div>
    </div>
    <transition name="fade">
      <div class="relative z-10 flex justify-center" v-if="modal">
        <div class="w-full absolute border bg-white rounded-b-lg shadow-md">
          <div class="flex flex-row justify-center">
            <div class="input-container flex flex-col overflow-y-auto w-full">
              <div
                class="flex flex-row justify-center cursor-pointer"
                :class="{ 'bg-gray-600 text-white': selectedHour === hour }"
                v-for="(hour, index) in hours"
                :key="index"
                @click="selectTime(hour, 'hour')"
              >{{ hour }}</div>
            </div>
            <div class="input-container flex flex-col overflow-y-auto w-full">
              <div
                class="flex flex-row justify-center cursor-pointer"
                :class="{ 'bg-gray-600 text-white': selectedMinute === minute }"
                v-for="(minute, index) in computedMinutes"
                :key="index"
                @click="selectTime(minute, 'minute')"
              >{{ minute }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway";
const hours = [
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
  "24"
];
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
  "44",
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
  "55",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59"
];
export default {
  mixins: [clickaway],
  props: {
    value: String,
    name: String,
    label: String,
    error: Object,
    inStyle: String
  },
  data() {
    return {
      hours,
      minutes,
      selectedHour: "00",
      selectedMinute: "00",
      modal: false
    };
  },
  watch: {
    selectedHour(newValue, oldValue) {
      if (newValue === "24") {
        this.selectTime("00", "minute");
      }
    }
  },
  computed: {
    computedMinutes() {
      if (this.selectedHour === "24") {
        return ["00"];
      } else {
        return this.minutes;
      }
    }
  },
  created() {
    if (this.value) {
      this.selectedHour = this.value.split(":")[0];
      this.selectedMinute = this.value.split(":")[1];
    }
  },
  methods: {
    selectTime(value, type) {
      if (type === "hour") {
        this.selectedHour = value;
      }
      if (type === "minute") {
        this.selectedMinute = value;
      }
      this.$emit("input", `${this.selectedHour}:${this.selectedMinute}`);
    },
    toggledOff() {
      this.modal = false;
    }
  }
};
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
