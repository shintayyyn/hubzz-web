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
        placeholder="mm/dd/yyyy"
        class="border-b-2 focus:border-yellow-400 focus:outline-none py-4 font-bold text-xs sm:text-sm w-full text-center"
        :class="{ inClass, 'border-red-500': error}"
        @click="modal = true"
        @keypress="validateInput($event)"
        @input="$emit('input', $event.target.value)"
        :style="inStyle"
      />
    </div>
    <transition name="fade">
      <div class="relative z-10" v-if="modal">
        <div
          class="absolute border rounded-tr-lg rounded-bl-lg rounded-br-lg calendar bg-white shadow-md"
        >
          <div class="p-2 flex flex-row flex-no-wrap justify-start border-b-2 border-yellow-500">
            <div class="m-1 w-1/2 text-left">
              <select v-model="selectedMonth" class="text-xs sm:text-sm">
                <option
                  :value="month.value"
                  v-for="(month, index) in filteredMonths"
                  :key="index"
                >{{month.label}}</option>
              </select>
              <select v-model="selectedYear" class="text-xs sm:text-sm">
                <option :value="year" v-for="(year, index) in yearLists" :key="index">{{year}}</option>
              </select>
            </div>
            <div class="m-1 w-1/2 flex flex-no-wrap justify-end">
              <span class="cursor-pointer" @click="adjustMonth('previous')">
                <svgicon
                  name="arrow-left"
                  height="12"
                  width="12"
                  :color="selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth() ? 'gray' : ''"
                />
              </span>
              <span class="mx-4"></span>
              <span class="cursor-pointer" @click="adjustMonth('next')">
                <svgicon name="arrow-right" height="12" width="12" />
              </span>
            </div>
          </div>

          <div class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-4">
            <div class="w-full text-center font-bold">Mo</div>
            <div class="w-full text-center font-bold">Tu</div>
            <div class="w-full text-center font-bold">We</div>
            <div class="w-full text-center font-bold">Th</div>
            <div class="w-full text-center font-bold">Fr</div>
            <div class="w-full text-center font-bold">Sa</div>
            <div class="w-full text-center font-bold">Su</div>
          </div>

          <div class="flex flex-no-wrap justify-between m-1">
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
                <div class="date-cell">&nbsp;</div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  @click="select(item.fullDate)"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                  'border-yellow-500 border-2': isSame(item.fullDate),
                  'text-gray-500': isDisabled(item.fullDate), 
                  'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                }"
                  v-if="item.day === 1"
                >
                  <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
                <div class="date-cell">&nbsp;</div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  @click="select(item.fullDate)"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                  'border-yellow-500 border-2': isSame(item.fullDate),
                  'text-gray-500': isDisabled(item.fullDate), 
                  'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                }"
                  v-if="item.day === 2"
                >
                  <div class="text-xs md:text-sm z-10">{{item.date}}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
                <div class="date-cell">&nbsp;</div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  @click="select(item.fullDate)"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                  'border-yellow-500 border-2': isSame(item.fullDate),
                  'text-gray-500': isDisabled(item.fullDate), 
                  'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                }"
                  v-if="item.day === 3"
                >
                  <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
                <div class="date-cell">&nbsp;</div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  @click="select(item.fullDate)"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                  'border-yellow-500 border-2': isSame(item.fullDate),
                  'text-gray-500': isDisabled(item.fullDate), 
                  'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                }"
                  v-if="item.day === 4"
                >
                  <div class="text-xs md:text-sm z-10">{{item.date}}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
                <div class="date-cell">&nbsp;</div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  @click="select(item.fullDate)"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                  'border-yellow-500 border-2': isSame(item.fullDate),
                  'text-gray-500': isDisabled(item.fullDate), 
                  'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                }"
                  v-if="item.day === 5"
                >
                  <div class="text-xs md:text-sm z-10">{{(item.date)}}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
                <div class="date-cell">&nbsp;</div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  @click="select(item.fullDate)"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                  'border-yellow-500 border-2': isSame(item.fullDate),
                  'text-gray-500': isDisabled(item.fullDate), 
                  'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                }"
                  v-if="item.day === 6"
                >
                  <div class="text-xs md:text-sm z-10">{{item.date}}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
                <div class="date-cell">&nbsp;</div>
              </div>
              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  @click="select(item.fullDate)"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                  'border-yellow-500 border-2': isSame(item.fullDate),
                  'text-gray-500': isDisabled(item.fullDate), 
                  'cursor-pointer hover:bg-gray-300': !isDisabled(item.fullDate),
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date)
                }"
                  v-if="item.day === 0"
                >
                  <div class="text-xs md:text-sm z-10">{{item.date}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway";
let months = [
  { label: "Jan", value: 0 },
  { label: "Feb", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Apr", value: 3 },
  { label: "May", value: 4 },
  { label: "Jun", value: 5 },
  { label: "Jul", value: 6 },
  { label: "Aug", value: 7 },
  { label: "Sep", value: 8 },
  { label: "Oct", value: 9 },
  { label: "Nov", value: 10 },
  { label: "Dec", value: 11 }
];
export default {
  mixins: [clickaway],
  props: {
    value: String,
    name: String,
    label: String,
    error: Object,
    inStyle: String,
    inClass: String,
    // disabled all dates past the current date
    isAfter: Boolean
  },
  data() {
    return {
      modal: false,
      months,
      monthLists: [],
      yearLists: [],
      selectedMonth: "",
      selectedYear: new Date().getFullYear(),
      daysInMonth: []
    };
  },
  created() {
    // get current month and year
    let d = new Date();
    this.selectedMonth = d.getMonth();
    // get month list
    this.getMonthLists();
    // get year list
    this.getYearLists();
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear);
    },
    selectedYear(value) {
      // set selected month to this current month if selected year === current year
      if (value === new Date().getFullYear()) {
        this.selectedMonth = this.filteredMonths[0].value;
      }
      this.getDaysInMonth(this.selectedMonth, value);
    }
  },
  computed: {
    filteredMonths() {
      // if selected year === current year, get only the current month up to last month,
      // if not, get all the months
      if (this.selectedYear === new Date().getFullYear()) {
        return this.months.filter(
          month => month.value >= new Date().getMonth()
        );
      }
      return this.months;
    }
  },
  methods: {
    getMonthLists() {
      for (let i = this.selectedMonth; i <= this.months.length; i++) {
        this.monthLists.push(i);
      }
    },
    getYearLists() {
      for (let i = 0; i <= 10; i++) {
        this.yearLists.push(this.selectedYear + i);
      }
    },
    isSelectedDate(date) {
      let selectedDate = this.$moment(
        `${this.selectedMonth + 1}-${date}-${this.selectedYear}`
      ).format("MM/DD/YYYY");
      return this.$moment(selectedDate).isSame(this.value);
    },
    isSame(date) {
      let newDate = this.$moment(new Date()).format("MM-DD-YYYY");
      return this.$moment(date).isSame(newDate);
    },
    isDisabled(date) {
      let newDate = this.$moment(new Date()).format("MM-DD-YYYY");
      if (this.isAfter) {
        return this.$moment(date).isAfter(newDate);
      }
      return this.$moment(date).isBefore(newDate);
    },
    toggledOff() {
      // get to the selected date
      if (this.value) {
        let month = this.$moment(this.value).format("MM");
        let year = this.$moment(this.value).format("YYYY");
        this.selectedMonth = month - 1;
        this.selectedYear = year;
      }
      this.modal = false;
    },
    adjustMonth(type) {
      if (type === "previous") {
        let index = this.filteredMonths.findIndex(
          month => month.value === this.selectedMonth
        );
        // return if selected month and year === current month and year
        if (index === 0 && this.selectedYear === new Date().getFullYear()) {
          return;
        }
        if (index === 0) {
          this.selectedMonth = 11;
          this.selectedYear--;
        } else {
          this.selectedMonth--;
        }
      }
      if (type === "next") {
        if (this.selectedMonth === 11) {
          this.selectedYear++;
          this.selectedMonth = 0;
        } else {
          this.selectedMonth++;
        }
      }
    },
    getDaysInMonth(month, selectedYear) {
      let date = new Date(selectedYear, month, 1);
      let days = [];
      while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      this.daysInMonth = [];
      days.forEach(day => {
        this.daysInMonth.push({
          day: day.getDay(),
          date: day.getDate(),
          fullDate: this.$moment(day).format("MM-DD-YYYY")
        });
      });
    },
    validateInput(e) {
      if ((e.key >= 0 && e.key <= 9) || e.key === "/") {
        return;
      } else {
        e.preventDefault();
      }
    },
    select(date) {
      if (!this.isDisabled(date)) {
        this.modal = false;
        this.$emit("input", this.$moment(date).format("MM/DD/YYYY"));
      }
    }
  }
};
</script>
<style scoped>
.calendar {
  min-width: 230px;
  height: auto;
}
@media screen and (min-width: 468px) {
  .calendar {
    width: 330px;
  }
}
@media screen and (min-width: 468px) {
  .date-cell {
    height: 2.5rem;
  }
}
@media screen and (min-width: 640px) {
  .date-cell {
    height: 3rem;
  }
}
</style>


