<template>
  <div
    v-on-clickaway="toggledOff"
    class="flex flex-col py-2 mb-4 md:mb-6 leading-normal"
  >
    <div class="relative flex flex-row flex-no-wrap justify-between">
      <label :for="name" class="text-xs">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <!-- <div
        class="absolute right-0 bg-red-500 p-1 text-xs sm:text-sm text-white rounded"
        v-if="error"
      >{{error.message}}</div>-->
    </div>
    <div v-if="!isDisplay" class="flex flex-row justify-start mt-1">
      <div class="relative flex flex-col w-full">
        <input
          :value="placeholder"
          type="text"
          :placeholder="'DD/MM/YYYY'"
          class="border-b-2 focus:border-yellow-400 focus:outline-none p-1 font-bold text-xs w-full shadow-none text-center"
          :class="{ inClass, 'border-red-500': error }"
          :style="inStyle"
          :format="format"
          :disabled="disabled"
          :isOpen="isOpen"
          @click="notOnClick ? '' : (modal = true)"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
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
      <div
        v-if="!isDisplay ? (isOpen ? isOpen : modal) : true"
        class="relative md:static flex"
        :class="isDisplay ? 'z-0' : 'z-10'"
      >
        <div
          class="border bg-white"
          :class="
            isDisplay ? 'w-full' : 'rounded-b-lg calendar absolute shadow-md'
          "
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
              <!--disables button if reached max date-->
              <span class="cursor-pointer ml-1" @click="adjustMonth('next')">
                <svgicon
                  name="arrow-right"
                  height="12"
                  width="12"
                  :color="
                    parseInt(selectedYear) ===
                      Math.max(...yearLists.map(y => parseInt(y))) &&
                      parseInt(selectedMonth) === 12
                      ? 'gray'
                      : ''
                  "
                />
              </span>
              <!--end-->
            </div>
          </div>

          <div
            class="flex flex-no-wrap justify-between text-xs sm:text-sm mx-1 mt-4"
          >
            <div class="w-full text-center font-bold">
              Mo
            </div>
            <div class="w-full text-center font-bold">
              Tu
            </div>
            <div class="w-full text-center font-bold">
              We
            </div>
            <div class="w-full text-center font-bold">
              Th
            </div>
            <div class="w-full text-center font-bold">
              Fr
            </div>
            <div class="w-full text-center font-bold">
              Sa
            </div>
            <div class="w-full text-center font-bold">
              Su
            </div>
          </div>

          <div class="flex flex-no-wrap justify-between m-1">
            <div class="relative flex flex-col w-full">
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
                    'cursor-pointer hover:bg-gray-300':
                      !isDisabled(item.fullDate) && !disableSelection,
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date,
                      item
                    ),
                    'bg-yellow-500':
                      dates.length &&
                      dates.includes(
                        $moment(item.fullDate, 'MM-DD-YYYY').format(format)
                      )
                  }"
                  @mouseover="showHover(item.fullDate)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
                <transition name="fade">
                  <div
                    v-if="hoverDate === item.fullDate && item.day === 1"
                    class="hover-details absolute bg-white border border-gray-400 text-xs z-50 flex flex-col items-center"
                    @mouseleave="(showDetail = false), (hoverDate = '')"
                  >
                    <div class="w-full">
                      <div class="px-1">
                        Date: {{ scheduleDetails.date }}
                      </div>
                      <div
                        v-for="(scheduleDetail,
                                scheduleDetailIndex) in scheduleDetails.shifts"
                        :key="scheduleDetailIndex"
                        class="px-1 border-t bg-gray-100"
                      >
                        <p>
                          Shift: {{ getName("shift", scheduleDetail.shift_id) }}
                        </p>
                        <p>Start time: {{ scheduleDetail.time_start }}</p>
                        <p>End time: {{ scheduleDetail.time_end }}</p>
                        <p>Rate: {{ scheduleDetail.rate }}</p>
                        <p>
                          Rate Type:
                          {{ getName("rate_type", scheduleDetail.rate_type) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="relative flex flex-col w-full">
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
                    'cursor-pointer hover:bg-gray-300':
                      !isDisabled(item.fullDate) && !disableSelection,
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date,
                      item
                    ),
                    'bg-yellow-500':
                      dates.length &&
                      dates.includes(
                        $moment(item.fullDate, 'MM-DD-YYYY').format(format)
                      )
                  }"
                  @mouseover="showHover(item.fullDate)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
                <transition name="fade">
                  <div
                    v-if="hoverDate === item.fullDate && item.day === 2"
                    class="hover-details absolute bg-white border border-gray-400 text-xs z-50 flex flex-col items-center"
                    @mouseleave="(showDetail = false), (hoverDate = '')"
                  >
                    <div class="w-full">
                      <div class="px-1">
                        Date: {{ scheduleDetails.date }}
                      </div>
                      <div
                        v-for="(scheduleDetail,
                                scheduleDetailIndex) in scheduleDetails.shifts"
                        :key="scheduleDetailIndex"
                        class="px-1 border-t bg-gray-100"
                      >
                        <p>
                          Shift: {{ getName("shift", scheduleDetail.shift_id) }}
                        </p>
                        <p>Start time: {{ scheduleDetail.time_start }}</p>
                        <p>End time: {{ scheduleDetail.time_end }}</p>
                        <p>Rate: {{ scheduleDetail.rate }}</p>
                        <p>
                          Rate Type:
                          {{ getName("rate_type", scheduleDetail.rate_type) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="relative flex flex-col w-full">
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
                    'cursor-pointer hover:bg-gray-300':
                      !isDisabled(item.fullDate) && !disableSelection,
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    ),
                    'bg-yellow-500':
                      dates.length &&
                      dates.includes(
                        $moment(item.fullDate, 'MM-DD-YYYY').format(format)
                      )
                  }"
                  @mouseover="showHover(item.fullDate)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
                <transition name="fade">
                  <div
                    v-if="hoverDate === item.fullDate && item.day === 3"
                    class="hover-details absolute bg-white border border-gray-400 text-xs z-50 flex flex-col items-center"
                    @mouseleave="(showDetail = false), (hoverDate = '')"
                  >
                    <div class="w-full">
                      <div class="px-1">
                        Date: {{ scheduleDetails.date }}
                      </div>
                      <div
                        v-for="(scheduleDetail,
                                scheduleDetailIndex) in scheduleDetails.shifts"
                        :key="scheduleDetailIndex"
                        class="px-1 border-t bg-gray-100"
                      >
                        <p>
                          Shift: {{ getName("shift", scheduleDetail.shift_id) }}
                        </p>
                        <p>Start time: {{ scheduleDetail.time_start }}</p>
                        <p>End time: {{ scheduleDetail.time_end }}</p>
                        <p>Rate: {{ scheduleDetail.rate }}</p>
                        <p>
                          Rate Type:
                          {{ getName("rate_type", scheduleDetail.rate_type) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="relative flex flex-col w-full">
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
                    'cursor-pointer hover:bg-gray-300':
                      !isDisabled(item.fullDate) && !disableSelection,
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    ),
                    'bg-yellow-500':
                      dates.length &&
                      dates.includes(
                        $moment(item.fullDate, 'MM-DD-YYYY').format(format)
                      )
                  }"
                  @mouseover="showHover(item.fullDate)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
                <transition name="fade">
                  <div
                    v-if="hoverDate === item.fullDate && item.day === 4"
                    class="hover-details absolute bg-white border border-gray-400 text-xs z-50 flex flex-col items-center"
                    @mouseleave="(showDetail = false), (hoverDate = '')"
                  >
                    <div class="w-full">
                      <div class="px-1">
                        Date: {{ scheduleDetails.date }}
                      </div>
                      <div
                        v-for="(scheduleDetail,
                                scheduleDetailIndex) in scheduleDetails.shifts"
                        :key="scheduleDetailIndex"
                        class="px-1 border-t bg-gray-100"
                      >
                        <p>
                          Shift: {{ getName("shift", scheduleDetail.shift_id) }}
                        </p>
                        <p>Start time: {{ scheduleDetail.time_start }}</p>
                        <p>End time: {{ scheduleDetail.time_end }}</p>
                        <p>Rate: {{ scheduleDetail.rate }}</p>
                        <p>
                          Rate Type:
                          {{ getName("rate_type", scheduleDetail.rate_type) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="relative flex flex-col w-full">
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
                    'cursor-pointer hover:bg-gray-300':
                      !isDisabled(item.fullDate) && !disableSelection,
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    ),
                    'bg-yellow-500':
                      dates.length &&
                      dates.includes(
                        $moment(item.fullDate, 'MM-DD-YYYY').format(format)
                      )
                  }"
                  @mouseover="showHover(item.fullDate)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
                <transition name="fade">
                  <div
                    v-if="hoverDate === item.fullDate && item.day === 5"
                    class="hover-details absolute bg-white border border-gray-400 text-xs z-50 flex flex-col items-center"
                    @mouseleave="(showDetail = false), (hoverDate = '')"
                  >
                    <div class="w-full">
                      <div class="px-1">
                        Date: {{ scheduleDetails.date }}
                      </div>
                      <div
                        v-for="(scheduleDetail,
                                scheduleDetailIndex) in scheduleDetails.shifts"
                        :key="scheduleDetailIndex"
                        class="px-1 border-t bg-gray-100"
                      >
                        <p>
                          Shift: {{ getName("shift", scheduleDetail.shift_id) }}
                        </p>
                        <p>Start time: {{ scheduleDetail.time_start }}</p>
                        <p>End time: {{ scheduleDetail.time_end }}</p>
                        <p>Rate: {{ scheduleDetail.rate }}</p>
                        <p>
                          Rate Type:
                          {{ getName("rate_type", scheduleDetail.rate_type) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="relative flex flex-col w-full">
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
                    'cursor-pointer hover:bg-gray-300':
                      !isDisabled(item.fullDate) && !disableSelection,
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    ),
                    'bg-yellow-500':
                      dates.length &&
                      dates.includes(
                        $moment(item.fullDate, 'MM-DD-YYYY').format(format)
                      )
                  }"
                  @mouseover="showHover(item.fullDate)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
                <transition name="fade">
                  <div
                    v-if="hoverDate === item.fullDate && item.day === 6"
                    class="hover-details absolute bg-white border border-gray-400 text-xs z-50 flex flex-col items-center"
                    @mouseleave="(showDetail = false), (hoverDate = '')"
                  >
                    <div class="w-full">
                      <div class="px-1">
                        Date: {{ scheduleDetails.date }}
                      </div>
                      <div
                        v-for="(scheduleDetail,
                                scheduleDetailIndex) in scheduleDetails.shifts"
                        :key="scheduleDetailIndex"
                        class="px-1 border-t bg-gray-100"
                      >
                        <p>
                          Shift: {{ getName("shift", scheduleDetail.shift_id) }}
                        </p>
                        <p>Start time: {{ scheduleDetail.time_start }}</p>
                        <p>End time: {{ scheduleDetail.time_end }}</p>
                        <p>Rate: {{ scheduleDetail.rate }}</p>
                        <p>
                          Rate Type:
                          {{ getName("rate_type", scheduleDetail.rate_type) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
            <div class="relative flex flex-col w-full">
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
                    'cursor-pointer hover:bg-gray-300':
                      !isDisabled(item.fullDate) && !disableSelection,
                    'bg-yellow-500 border-yellow-500 border-2': isSelectedDate(
                      item.date
                    ),
                    'bg-yellow-500':
                      dates.length &&
                      dates.includes(
                        $moment(item.fullDate, 'MM-DD-YYYY').format(format)
                      )
                  }"
                  @mouseover="showHover(item.fullDate)"
                  @click="select(item.fullDate)"
                >
                  <div class="text-xs md:text-sm z-10">
                    {{ item.date }}
                  </div>
                </div>
                <transition name="fade">
                  <div
                    v-if="hoverDate === item.fullDate && item.day === 0"
                    class="hover-details absolute bg-white border border-gray-400 text-xs z-50 flex flex-col items-center"
                    @mouseleave="(showDetail = false), (hoverDate = '')"
                  >
                    <div class="w-full">
                      <div class="px-1">
                        Date: {{ scheduleDetails.date }}
                      </div>
                      <div
                        v-for="(scheduleDetail,
                                scheduleDetailIndex) in scheduleDetails.shifts"
                        :key="scheduleDetailIndex"
                        class="px-1 border-t bg-gray-100"
                      >
                        <p>
                          Shift: {{ getName("shift", scheduleDetail.shift_id) }}
                        </p>
                        <p>Start time: {{ scheduleDetail.time_start }}</p>
                        <p>End time: {{ scheduleDetail.time_end }}</p>
                        <p>Rate: {{ scheduleDetail.rate }}</p>
                        <p>
                          Rate Type:
                          {{ getName("rate_type", scheduleDetail.rate_type) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
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
    value: {
      type: Array,
      default: () => []
    },

    name: {
      type: String,
      default: null
    },

    label: {
      type: String,
      default: null
    },

    error: {
      type: Object,
      default: () => null
    },

    inStyle: {
      type: String,
      default: null
    },

    inClass: {
      type: String,
      default: null
    },

    limitYear: {
      type: Number,
      default: 0
    },

    maxYearBefore: {
      type: Number,
      default: 0
    },

    required: {
      type: Boolean,
      default: false
    },

    // disabled all dates past the current date
    isAfter: {
      type: Boolean,
      default: false
    },

    isBefore: {
      type: Boolean,
      default: false
    },

    format: {
      type: String,
      default: "YYYY-MM-DD"
    },

    disabled: {
      type: Boolean,
      default: false
    },

    startYear: {
      type: String,
      default: null
    },

    startDate: {
      type: String,
      default: null
    },

    isOpen: {
      type: Boolean,
      default: false
    },

    notOnClick: {
      type: Boolean,
      default: false
    },

    disableSelection: {
      type: Boolean,
      default: false
    },

    overlayData: {
      type: Array,
      default: () => []
    },

    isDisplay: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modal: false,
      months,
      monthLists: [],
      yearLists: [],
      selectedMonth: this.$moment.utc().format("M"),
      selectedYear: this.$moment.utc().format("YYYY"),
      daysInMonth: [],
      lastDate: "",
      dates: [],
      showDetail: false,
      hoverDate: "",
      scheduleDetails: {
        date: "",
        shifts: []
      }
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
      let display;
      let dates = this.dates;
      let moments = this.dates.map(d => this.$moment(d));
      let maxDate = this.$moment.max(moments);
      let minDate = this.$moment.min(moments);
      display =
        this.dates && this.dates.length
          ? dates.length > 1
            ? `${minDate.format("DD/MM/YYYY")} - ${maxDate.format(
              "DD/MM/YYYY"
            )} - (${dates.length} day${dates.length > 1 ? "s" : ""})`
            : `${this.$moment(dates[0]).format("DD/MM/YYYY")} - 1 day`
          : null;
      return display;
    }
  },
  watch: {
    selectedMonth(value) {
      if (value) {
        this.getDaysInMonth(value.toString(), this.selectedYear);
      }
    },
    selectedYear(value) {
      // set selected month to this current month if selected year === current year
      if (
        this.isAfter &&
        value === this.$moment().format("YYYY") &&
        !this.filteredMonths.find(m => m.value === this.selectedMonth)
      ) {
        this.selectedMonth = this.$moment().format("M");
      }
    },
    startDate(value) {
      console.log(value);
      if (value) {
        this.selectedMonth = this.$moment(value, this.format).format("M");
        this.selectedYear = this.$moment(value, this.format).format("YYYY");
      }
    },
    value(value) {
      this.dates = value;
    },
    isOpen(value) {
      if (value === false) {
        this.hoverDate = "";
        this.showDetail = false;
      }
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.dates = this.value;
      let last = this.value.find(
        (item, index) => index + 1 === this.value.length
      );
      this.lastDate = last;
    }

    // get current month and year
    if (this.lastDate) {
      this.selectedMonth = this.$moment(this.lastDate, this.format).format("M");
      this.selectedYear = this.$moment(this.lastDate, this.format).format(
        "YYYY"
      );
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
    getName(type, id) {
      if (type === "shift") {
        switch (id) {
        case "1":
          return "AM";
        case "2":
          return "PM";
        case "3":
          return "Whole Day";
        case "4":
          return "OOH";
        default:
          break;
        }
      } else if (type === "rate_type") {
        switch (id) {
        case "1":
          return "Per Hour";
        case "2":
          return "Per Half Day Session";
        case "3":
          return "Per Whole Day Session";
        default:
          break;
        }
      }
    },
    showHover(fullDate) {
      if (this.overlayData) {
        let details = this.overlayData.filter(
          item => item.date === this.$moment(fullDate).format("YYYY-MM-DD")
        );
        if (details && details.length) {
          this.scheduleDetails.date = this.$moment(fullDate).format(
            "YYYY-MM-DD"
          );
          this.scheduleDetails.shifts = [];
          details.forEach(item => {
            this.scheduleDetails.shifts.push({
              shift_id: item.shift_id.toString(),
              time_start: item.time_start,
              time_end: item.time_end,
              rate: item.rate,
              rate_type: item.locum_detail_rate_type_id.toString()
            });
          });
          this.hoverDate = fullDate;
        }
      }
    },
    getMonthLists() {
      for (let i = this.selectedMonth; i <= this.months.length; i++) {
        this.monthLists.push(`${i}`);
      }
    },
    getYearLists() {
      //new initializations
      this.yearLists = [];
      const currentYear = parseInt(this.$moment.utc().format("YYYY"), 10);
      //end
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
          //new logic for listed year
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
        this.yearLists.sort((a, b) => Number(a) - Number(b));
      }

      this.yearLists.sort((a, b) => Number(a) - Number(b));
    },
    //end of year list
    isSelectedDate(date) {
      let selectedDate = `${this.selectedYear}-${this.selectedMonth}-${date}`;
      return this.$moment(selectedDate, "YYYY-MM-D").isSame(this.lastDate);
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
    },
    toggledOff() {
      if (!this.isDisplay) {
        // get to the selected date
        if (this.lastDate) {
          let month = this.$moment(this.lastDate, "YYYY-MM-DD").format("M");
          let year = this.$moment(this.lastDate, "YYYY-MM-DD").format("YYYY");
          this.selectedMonth = month;
          this.selectedYear = year;
        }
        this.modal = false;
      }
    },

    adjustMonth(type) {
      if (type === "previous") {
        let index = this.filteredMonths.findIndex(
          month => month.value === this.selectedMonth.toString()
        );
        if (
          this.selectedMonth.toString() === this.$moment().format("M") &&
          this.selectedYear.toString() === this.$moment().format("YYYY") &&
          this.isAfter
        ) {
          return;
        }

        const currentMonth = parseInt(this.selectedMonth);
        const currentYear = parseInt(this.selectedYear);

        if (currentMonth === 1) {
          this.selectedMonth = "12";
          this.selectedYear = String(currentYear - 1);
        } else {
          this.selectedMonth = String(currentMonth - 1);
        }
      }

      if (type === "next") {
        const maxYear = Math.max(...this.yearLists.map(y => parseInt(y)));
        const currentMonth = parseInt(this.selectedMonth);
        const currentYear = parseInt(this.selectedYear);

        if (currentYear === maxYear && currentMonth === 12) {
          return;
        }

        if (currentMonth === 12) {
          this.selectedYear = String(currentYear + 1);
          this.selectedMonth = "1";
        } else {
          this.selectedMonth = String(currentMonth + 1);
        }
      }
    },
    //end
    getDaysInMonth(month, selectedYear) {
      const m = month.toString();
      let date = this.$moment(`${selectedYear}-${m}-01`, "YYYY-MM-DD");
      let days = [];
      while (date.format("M") === m) {
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
      // e.preventDefault();
      if ((e.key >= 0 && e.key <= 9) || e.key === "/") {
        return;
      } else {
        e.preventDefault();
      }
    },
    select(date) {
      if (!this.disableSelection) {
        if (!this.isDisabled(date)) {
          if (
            !this.dates.includes(
              this.$moment(date, "MM-DD-YYYY").format(this.format)
            )
          ) {
            this.dates.push(
              this.$moment(date, "MM-DD-YYYY").format(this.format)
            );
          } else {
            let dateIndex = this.dates.findIndex(
              item =>
                item === this.$moment(date, "MM-DD-YYYY").format(this.format)
            );
            if (dateIndex > -1) {
              this.dates.splice(dateIndex, 1);
            }
          }
        }
        this.$emit("input", this.dates);
        // this.dates.sort((a, b) => new Date(a) - new Date(b))
      }
    }
  }
};
</script>
<style scoped>
.calendar {
  /* min-width: 230px; */
  height: auto;
}
.hover-details {
  min-width: 200px;
  max-height: 300px;
}
.hover-details > div {
  max-height: 300px;
  overflow-y: auto;
}
.top.hover-details {
  margin-top: -32px;
  top: 0;
}
.hover-details {
  margin-top: 8px;
}
.hover-details::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 23px;
  width: 12px;
  height: 12px;
  /* border: 8px solid transparent;
  border-bottom-color: #ccc;
  border-top: 0; */
  border-top: 1px solid #cbd5e0;
  border-left: 1px solid #cbd5e0;
  margin-left: -8px;
  margin-top: -8px;
  z-index: -1;
  transform: rotate(45deg);
  background-color: #fff;
}
.top.hover-details::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-top-color: #ccc;
  border-bottom: 0;
  margin-left: -8px;
  margin-bottom: -8px;
}

@media screen and (min-width: 468px) {
  .date-cell {
    height: 2.5rem;
    max-width: 2.5rem;
  }
}
@media screen and (min-width: 640px) {
  .date-cell {
    height: 3rem;
    max-width: 3rem;
  }
}
</style>
