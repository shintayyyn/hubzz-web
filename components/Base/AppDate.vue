<template>
  <div
    v-on-clickaway="toggledOff"
    class="flex flex-col leading-normal"
    :class="wrapperClass ? wrapperClass : 'mb-3 md:mb-4 '"
  >
    <div
      v-if="!nolabel && label"
      class="relative flex flex-row flex-no-wrap justify-between"
    >
      <label :for="name" class="text-xs">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <!-- <div
        class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white rounded"
        v-if="error"
      >{{error.message}}</div> -->
    </div>

    <div class="flex flex-row justify-start">
      <div class="flex flex-col w-full">
        <input
          :name="name"
          :value="placeholder"
          type="input"
          :placeholder="
            label && nolabel
              ? `${label ? label : placeholder} DD/MM/YYYY`
              : placeholder
                ? placeholder
                : 'DD/MM/YYYY'
          "
          class="focus:border-yellow-400 focus:outline-none py-1 font-bold text-xs w-full shadow-none"
          :class="[
            border ? 'border-2 rounded px-2' : 'border-b-2',
            inClass,
            error && 'border-red-500'
          ]"
          :style="inStyle"
          :format="format"
          :disabled="disabled"
          @click="modal = true"
          @keypress="validateInput($event)"
        >

        <transition name="drop-down">
          <div v-if="error" class="text-red-500 py-1 text-xs text-white">
            {{
              error.message.charAt(0).toUpperCase() +
                error.message.slice(1).replace(/_/g, " ")
            }}
          </div>
        </transition>
      </div>
    </div>

    <transition name="fade">
      <div v-if="modal" class="relative md:static z-10 flex">
        <div
          class="absolute border rounded-b-lg calendar bg-white shadow-md"
          :class="floatRight ? 'right-0' : ''"
        >
          <div
            class="p-2 flex flex-row flex-no-wrap justify-start items-center border-b-2 border-yellow-500"
          >
            <div class="m-1 w-1/2 flex flex-no-wrap">
              <select
                v-model="selectedMonth"
                class="mr-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                <option
                  v-for="(month, index) in filteredMonths"
                  :key="index"
                  :value="month.value"
                >
                  {{ month.label }}
                </option>
              </select>

              <select
                v-model="selectedYear"
                class="ml-1 text-xs sm:text-sm py-1 px-1 cursor-pointer bg-gray-200 hover:bg-gray-300 focus:outline-none"
              >
                <option
                  v-for="(year, index) in yearLists"
                  :key="index"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </div>

            <div class="m-1 w-1/2 flex flex-no-wrap justify-end">
              <span
                class="cursor-pointer mr-1"
                @click="adjustMonth('previous')"
              >
                <svgicon
                  name="arrow-left"
                  height="12"
                  width="12"
                  :color="
                    selectedYear.toString() === $moment().format('YYYY') &&
                      selectedMonth.toString() === $moment().format('M') &&
                      isAfter
                      ? 'gray'
                      : ''
                  "
                />
              </span>

              <span class="cursor-pointer ml-1" @click="adjustMonth('next')">
                <svgicon name="arrow-right" height="12" width="12" />
              </span>
            </div>
          </div>

          <div
            class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-4"
          >
            <span class="w-full text-center font-bold">Mo</span>
            <span class="w-full text-center font-bold">Tu</span>
            <span class="w-full text-center font-bold">We</span>
            <span class="w-full text-center font-bold">Th</span>
            <span class="w-full text-center font-bold">Fr</span>
            <span class="w-full text-center font-bold">Sa</span>
            <span class="w-full text-center font-bold">Su</span>
          </div>

          <div class="flex flex-no-wrap justify-between m-1">
            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>

              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 1"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-300': !isDisabled(
                      item.fullDate
                    ),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date,
                      item
                    )
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>

              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 2"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-300': !isDisabled(
                      item.fullDate
                    ),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date,
                      item
                    )
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>

              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 3"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-300': !isDisabled(
                      item.fullDate
                    ),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    )
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>

              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 4"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-300': !isDisabled(
                      item.fullDate
                    ),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    )
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>

              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 5"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-300': !isDisabled(
                      item.fullDate
                    ),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    )
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>

              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 6"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-300': !isDisabled(
                      item.fullDate
                    ),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    )
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full">
              <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 0">
                <div class="date-cell">
                  &nbsp;
                </div>
              </div>

              <div v-for="(item, index) in daysInMonth" :key="index">
                <div
                  v-if="item.day === 0"
                  class="rounded-full relative p-1 flex justify-center items-center date-cell"
                  :class="{
                    'border-yellow-500 border-2': isSame(item.fullDate),
                    'text-gray-500': isDisabled(item.fullDate),
                    'cursor-pointer hover:bg-gray-300': !isDisabled(
                      item.fullDate
                    ),
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    )
                  }"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
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

export default {
  mixins: [clickaway],

  props: {
    value: {
      type: String,
      default: () => null
    },

    name: {
      type: String,
      default: () => null
    },

    label: {
      type: String,
      default: () => null
    },

    error: {
      type: Object,
      default: () => null
    },

    inStyle: {
      type: String,
      default: () => null
    },

    inClass: {
      type: String,
      default: () => null
    },

    wrapperClass: {
      type: String,
      default: null
    },

    nolabel: {
      type: Boolean,
      default: false
    },

    border: {
      type: Boolean,
      default: false
    },

    format: {
      type: String,
      default: "YYYY-MM-DD"
    },

    limitYear: {
      type: Number,
      default: () => null
    },

    maxYearBefore: {
      type: Number,
      default: () => null
    },

    required: {
      type: Boolean,
      default: false
    },

    floatRight: {
      type: Boolean,
      default: false
    },

    // disabled all dates past the current date
    isAfter: Boolean,

    isBefore: Boolean,

    disabled: Boolean,

    startYear: {
      type: String,
      default: () => null
    },

    startDate: {
      type: String,
      default: () => null
    }
  },

  data() {
    return {
      modal: false,
      months: [
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
      ],
      monthLists: [],
      yearLists: [],
      selectedMonth: this.$moment.utc().format("M"),
      selectedYear: this.$moment.utc().format("YYYY"),
      daysInMonth: []
    };
  },

  computed: {
    filteredMonths() {
      // if selected year === current year, get only the current month up to last month,
      // if not, get all the months
      if (this.selectedYear === this.$moment().format("YYYY")) {
        if (this.isAfter) {
          return this.months.filter(
            month =>
              parseInt(month.value) >= parseInt(this.$moment().format("M"))
          );
        }

        if (this.isBefore) {
          return this.months.filter(
            month =>
              parseInt(month.value) <= parseInt(this.$moment().format("M"))
          );
        }
      }

      return this.months;
    },

    placeholder() {
      return this.value
        ? this.$moment(this.value, "YYYY-MM-DD").format("DD/MM/YYYY")
        : null;
    }
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
    },

    startDate(value) {
      if (value) {
        this.selectedMonth = this.$moment(value).format("M");
        this.selectedYear = this.$moment(value).format("YYYY");
      }
    }
  },

  created() {
    // get current month and year
    if (this.value) {
      this.selectedMonth = this.$moment(this.value, this.format).format("M");
      this.selectedYear = this.$moment(this.value, this.format).format("YYYY");
    }

    // Defined selected year
    if (this.maxYearBefore) {
      this.selectedYear = this.selectedYear - this.maxYearBefore;
    }

    // get month list
    this.getMonthLists();

    // get year list
    this.getYearLists();

    this.getDaysInMonth(this.selectedMonth, this.selectedYear);
  },
  methods: {
    getMonthLists() {
      for (let i = this.selectedMonth; i <= this.months.length; i++) {
        this.monthLists.push(`${i}`);
      }
    },
    getYearLists() {
      this.yearLists = [];
      const currentYear = parseInt(this.$moment.utc().format("YYYY"), 10);

      if (!this.isAfter) {
        if (this.limitYear) {
          for (let i = 1; i <= this.limitYear; i++) {
            this.yearLists.push(
              this.$moment()
                .subtract(
                  this.maxYearBefore ? this.maxYearBefore - 1 : 0,
                  "years"
                )
                .subtract(i, "years")
                .format("YYYY")
            );
          }
        } else {
          //new logic
          const minYear = currentYear;
          const maxYear = currentYear + 10;
          let tempYear = minYear;

          while (tempYear <= maxYear) {
            this.yearLists.push(tempYear.toString());
            tempYear++;
          }
        }
      } else {
        const startYear = this.selectedYear
          ? parseInt(this.selectedYear, 10)
          : currentYear;

        for (let i = 0; i <= 10; i++) {
          this.yearLists.push((startYear + i).toString());
        }
      }

      this.yearLists.sort((a, b) => Number(a) - Number(b));
    },
    //end of new logic

    isSelectedDate(date) {
      let selectedDate = `${this.selectedYear}-${this.selectedMonth}-${date}`;
      return this.$moment(selectedDate, "YYYY-MM-D").isSame(this.value);
    },

    isSame(date) {
      let newDate = this.$moment().format("MM-DD-YYYY");

      if (this.startDate) {
        this.isDisabled(this.startDate);
        return this.$moment(date, "MM-DD-YYYY").isSame(this.startDate);
      }

      return this.$moment(date, "MM-DD-YYYY").isSame(newDate);
    },

    isDisabled(date) {
      let newDate = this.$moment.utc().format("MM-DD-YYYY");

      if (this.isBefore) {
        if (this.startDate) {
          return this.$moment(date).isAfter(this.startDate);
        }

        return this.$moment(date, "MM-DD-YYYY").isAfter(
          this.$moment(newDate, "MM-DD-YYYY")
        );
      }

      if (this.isAfter) {
        if (this.startDate) {
          return this.$moment(date).isBefore(this.startDate);
        }

        return this.$moment(date, "MM-DD-YYYY").isBefore(
          this.$moment(newDate, "MM-DD-YYYY")
        );
      }

      return false;
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
      // e.preventDefault()
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
