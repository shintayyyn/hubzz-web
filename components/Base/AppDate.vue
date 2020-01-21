<template>
  <div class="flex flex-col py-2 mb-4 md:mb-6 leading-normal" v-on-clickaway="toggledOff">
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs sm:text-sm py-1">
        {{label}}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <!-- <div
        class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white rounded"
        v-if="error"
      >{{error.message}}</div>-->
    </div>
    <div class="flex flex-row justify-start mt-1">
      <div class="flex flex-col w-full">
        <input
          :value="value"
          type="input"
          :placeholder="format"
          class="border-b-2 focus:border-yellow-400 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full text-center"
          :class="{ inClass, 'border-red-500': error}"
          @click="modal = true"
          @keypress="validateInput($event)"
          @input="$emit('input', $event.target.value)"
          :style="inStyle"
          :format="format"
          :disabled="disabled"
        />
        <transition name="drop-down">
          <div
            v-if="error"
            class="text-red-500 py-1 text-xs text-white"
          >{{error.message.charAt(0).toUpperCase() + error.message.slice(1).replace(/_/g, " ")}}</div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="relative md:static z-10 flex justify-center" v-if="modal">
        <div class="absolute border rounded-b-lg calendar bg-white shadow-md">
          <div
            class="p-2 flex flex-row flex-no-wrap justify-start items-center border-b-2 border-yellow-500"
          >
            <div class="m-1 w-1/2 flex flex-no-wrap">
              <select
                v-model="selectedMonth"
                class="mr-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                <option
                  :value="month.value"
                  v-for="(month, index) in filteredMonths"
                  :key="index"
                >{{month.label}}</option>
              </select>
              <select
                v-model="selectedYear"
                class="ml-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                <option :value="year" v-for="(year, index) in yearLists" :key="index">{{year}}</option>
              </select>
            </div>
            <div class="m-1 w-1/2 flex flex-no-wrap justify-end">
              <span class="cursor-pointer mr-1" @click="adjustMonth('previous')">
                <svgicon
                  name="arrow-left"
                  height="12"
                  width="12"
                  :color="(selectedYear.toString() === $moment().format('YYYY') && selectedMonth.toString() === $moment().format('M')) && isAfter ? 'gray' : ''"
                />
              </span>
              <span class="cursor-pointer ml-1" @click="adjustMonth('next')">
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
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date, item)
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
                  'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(item.date, item)
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
  { label: "Jan", value: "1" },
  { label: "Feb", value: "2" },
  { label: "Mar", value: "3" },
  { label: "Apr", value: "4" },
  { label: "May", value: "5" },
  { label: "Jun", value: "6" },
  { label: "Jul", value: "7" },
  { label: "Aug", value: "8" },
  { label: "Sep", value: "9" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" }
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
    format: String,
    limitYear: Number,
    maxYearBefore: Number,
    required: {
      type: Boolean,
      default: false
    },
    // disabled all dates past the current date
    isAfter: Boolean,
    format: {
      type: String,
      default: "YYYY-MM-DD"
    },
    disabled: Boolean
  },
  data() {
    return {
      modal: false,
      months,
      monthLists: [],
      yearLists: [],
      selectedMonth: this.$moment.utc().format("M"),
      selectedYear: this.$moment.utc().format("YYYY"),
      daysInMonth: []
    };
  },
  created() {
    // get current month and year
    if (this.value) {
      this.selectedMonth = this.$moment(this.value, this.format).format("M");
      this.selectedYear = this.$moment(this.value, this.format).format("YYYY");
    }
    // get month list
    this.getMonthLists();
    // get year list
    this.getYearLists();
    this.getDaysInMonth(this.selectedMonth, this.selectedYear);
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value.toString(), this.selectedYear);
    },
    selectedYear(value) {
      // set selected month to this current month if selected year === current year
      if (value === this.$moment().format("YYYY")) {
        this.selectedMonth = this.filteredMonths[0].value;
      }
      this.getDaysInMonth(this.selectedMonth.toString(), value);
    }
  },
  computed: {
    filteredMonths() {
      // if selected year === current year, get only the current month up to last month,
      // if not, get all the months
      if (this.selectedYear === this.$moment().format("YYYY")) {
        return this.months.filter(
          month => parseInt(month.value) >= parseInt(this.$moment().format("M"))
        );
      }
      return this.months;
    }
  },
  methods: {
    getMonthLists() {
      for (let i = this.selectedMonth; i <= this.months.length; i++) {
        this.monthLists.push(`${i}`);
      }
    },
    getYearLists() {
      let yearsBefore = [];
      if (!this.isAfter) {
        if (this.limitYear) {
          for (let i = 0; i <= this.limitYear; i++) {
            this.yearLists.push(
              this.$moment(this.selectedYear, "YYYY")
                .subtract(i, "years")
                .format("YYYY")
            );
          }
        } else {
          for (let i = 0; i <= 2; i++) {
            this.yearLists.push(
              this.$moment(this.selectedYear, "YYYY")
                .subtract(i, "years")
                .format("YYYY")
            );
          }
        }
      } else if (this.isAfter) {
        for (let i = 0; i <= 10; i++) {
          this.yearLists.push(
            this.$moment(this.selectedYear, "YYYY")
              .add(i, "years")
              .format("YYYY")
          );
        }
      }

      this.yearLists.sort(function(a, b) {
        return a - b;
      });
    },
    isSelectedDate(date) {
      let selectedDate = `${this.selectedYear}-${this.selectedMonth}-${date}`;
      return this.$moment(selectedDate, "YYYY-MM-D").isSame(this.value);
    },
    isSame(date) {
      let newDate = this.$moment().format("MM-DD-YYYY");
      return this.$moment(date, "MM-DD-YYYY").isSame(newDate);
    },
    isDisabled(date) {
      return false;
      // let newDate = this.$moment.utc().format("MM-DD-YYYY");
      // if (this.isBefore) {
      //   return this.$moment(date, "MM-DD-YYYY").isAfter(
      //     this.$moment(newDate, "MM-DD-YYYY")
      //   );
      // }
      // return this.$moment(date, "MM-DD-YYYY").isBefore(
      //   this.$moment(newDate, "MM-DD-YYYY")
      // );
    },
    toggledOff() {
      // get to the selected date
      if (this.value) {
        let month = this.$moment(this.value, "YYYY-MM-DD").format("M");
        let year = this.$moment(this.value, "YYYY-MM-DD").format("YYYY");
        this.selectedMonth = month;
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
        if (
          this.selectedMonth.toString() === this.$moment().format("M") &&
          this.selectedYear.toString() === this.$moment().format("YYYY") &&
          this.isAfter
        ) {
          return;
        }
        this.selectedYear = parseInt(this.selectedYear);
        if (index === 0 || this.selectedMonth != 1) {
          this.selectedMonth--;
        } else {
          this.selectedMonth = 12;
          this.selectedYear--;
        }
      }
      if (type === "next") {
        if (this.selectedMonth === 12 || this.selectedMonth === "12") {
          this.selectedYear++;
          this.selectedMonth = 1;
        } else {
          this.selectedMonth = parseInt(this.selectedMonth);
          this.selectedMonth++;
        }
      }
    },
    getDaysInMonth(month, selectedYear) {
      let date = this.$moment(`${selectedYear}-${month}-01`, "YYYY-MM-DD");
      let days = [];
      while (date.format("M") === month) {
        days.push({
          day: parseInt(date.format("d")),
          date: parseInt(date.format("D")),
          fullDate: date.format("MM-DD-YYYY")
        });
        date = date.add(1, "days");
      }
      this.daysInMonth = days;
      // days.forEach(day => {
      //   this.daysInMonth.push({
      //     day: day.getDay(),
      //     date: day.getDate(),
      //     fullDate: this.$moment(day).format("MM-DD-YYYY")
      //   });
      // });
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
        this.$emit(
          "input",
          this.$moment(date, "MM-DD-YYYY").format(this.format)
        );
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


