<template>
  <div class="flex flex-col py-2 mb-6 leading-normal" v-on-clickaway="toggledOff">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1">{{label}}</label>
      <div
        class="absolute right-0 bg-red-500 p-1 text-xs sm:text-base text-white"
        v-if="error"
      >{{error.message}}</div>
    </div>
    <div class="flex flex-row justify-start mt-1">
      <input
        :value="value"
        type="input"
        placeholder="hh:mm"
        class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full text-center"
        :class="error? 'border-red-500':''"
        @click="modal = true"
        @input="$emit('input', $event.target.value)"
        :style="inStyle"
      />
    </div>
    <transition name="fade">
      <div class="relative z-10" v-if="modal">
        <div
          class="w-full absolute border rounded-tr-lg rounded-bl-lg rounded-br-lg calendar bg-white shadow-md"
        >
          <div class="flex flex-row justify-center">
            <div
              class="input-container flex flex-col overflow-y-auto w-full"
              v-if="activeView === 'hours'"
            >
              <div
                class="flex flex-row justify-center cursor-pointer"
                :class="{'bg-gray-900 text-white': selectedHour === hour}"
                v-for="(hour, index) in hours"
                :key="index"
                @click="selectTime(hour, 'hour')"
              >{{hour}}</div>
            </div>
            <div
              class="input-container flex flex-col overflow-y-auto w-full"
              v-if="activeView === 'minutes'"
            >
              <div
                class="flex flex-row justify-center cursor-pointer"
                :class="{'bg-gray-900 text-white': selectedMinute === minute}"
                v-for="(minute, index) in minutes"
                :key="index"
                @click="selectTime(minute, 'minute')"
              >{{minute}}</div>
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
  '01', '02', '03', '04', '05',
  '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20',
  '21', '22', '23', '00'
]
const minutes = [
  '01', '02', '03', '04', '05',
  '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25',
  '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35',
  '36', '37', '38', '39', '40',
  '41', '44', '43', '44', '45',
  '46', '47', '48', '49', '50',
  '51', '52', '55', '54', '55',
  '56', '57', '58', '59', '00',
]
export default {
  mixins: [clickaway],
  props: {
    value: String,
    name: String,
    label: String,
    error: Object,
    inStyle: String,
  },
  data() {
    return {
      hours,
      minutes,
      selectedHour: '00',
      selectedMinute: '00',
      activeView: 'hours',
      modal: false
    }
  },
  watch: {
    selectedSecond(newValue, oldValue) {
      if (!oldValue) {
        return
      }
      this.toggledOff()
    },
  },
  created() {
    if (this.value) {
      this.selectedHour = this.value.split(':')[0]
      this.selectedMinute = this.value.split(':')[1]
    }
    this.activeView = 'hours'
  },
  methods: {
    selectTime(value, type) {
      if (type === 'hour') {
        this.selectedHour = value
        this.activeView = 'minutes'

      }
      if (type === 'minute') {
        this.selectedMinute = value
        this.modal = false
      }
      this.$emit("input", `${this.selectedHour}:${this.selectedMinute}`);
    },
    toggledOff() {
      this.activeView = 'hours'
      this.modal = false;
    },
  }
}
</script>
<style scoped>
.input-container {
  min-height: 100px;
  max-height: 100px;
}
.calendar {
  min-width: 100px;
  min-height: 100px;
  max-height: 100px;
}
@media screen and (min-width: 468px) {
  .calendar {
    width: 100px;
  }
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: lightgrey;
  border-radius: 0px 0.5rem 0.5rem 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

