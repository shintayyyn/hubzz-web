<template>
    <section>
        <div class="flex justify-start">
            <div style="width:40%">
                <div class="float-left">
                    {{$store.state.dashboard.months[selectedMonth]}} {{selectedYear}}
                </div>
            </div>
            <div style="width:20%">
                <span class="cursor-pointer" @click="adjustMonth('previous')" v-text="'<'"></span>
                <span class="mx-4"></span>
                <span class="cursor-pointer" @click="adjustMonth('next')" v-text="'>'"></span>
            </div>
            <div style="width:30%">
                <div class="float-right">
                    <span class="cursor-pointer px-3 text-sm hover:underline" 
                        :class="$store.state.dashboard.appointments_tab === 'per_month' ? 'py-1 px-3 bg-yellow-dark':''"
                        @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_month')">Month</span>
                    <span class="cursor-pointer px-3 text-sm hover:underline" 
                        :class="$store.state.dashboard.appointments_tab === 'per_week' ? 'py-1 px-3 bg-yellow-dark':''"
                        @click="$store.commit('dashboard/TOGGLE_APPOINTMENTS_TAB', 'per_week')">Week</span>
                </div>
            </div>
        </div> 

        <div class="flex flex-no-wrap m-5">
            <div class="text-grey font-bold ml-1" style="width:100%">SUN</div>
            <div class="text-grey font-bold ml-1" style="width:100%">MON</div>
            <div class="text-grey font-bold ml-1" style="width:100%">TUE</div>
            <div class="text-grey font-bold ml-1" style="width:100%">WED</div>
            <div class="text-grey font-bold ml-1" style="width:100%">THU</div>
            <div class="text-grey font-bold ml-1" style="width:100%">FRI</div>
            <div class="text-grey font-bold ml-1" style="width:100%">SAT</div>
        </div>

        <div class="flex flex-no-wrap m-5">
            <div class="flex flex-col" style="width:100%">
                <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 7">
                <div class="m-1" style="width:60%;height:50px;box-sizing:border-box">&nbsp;</div>
                </div>
                <div v-for="(item, index) in daysInMonth" :key="index">
                <div @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)" 
                    class="relative border border-solid rounded-lg m-1 cursor-pointer text-center" 
                    :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                    style="width:60%;height:50px;box-sizing:border-box;" v-if="item.day === 0">
                    <div class="absolute pin-x" style="top:15px">
                        {{(item.date)}}
                    </div>
                    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start" style="width:100%">
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
                        class="bg-pink-light p-2 rounded-tl-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
                        class="bg-pink-light p-2 rounded-tr-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                    </div>
                </div>
                </div>
            </div>
            <div class="flex flex-col" style="width:100%">
                <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
                <div class="m-1" style="width:60%;height:50px;box-sizing:border-box">&nbsp;</div>
                </div>
                <div v-for="(item, index) in daysInMonth" :key="index">
                <div @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)" 
                    class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                    :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                    style="width:60%;height:50px;box-sizing:border-box;" v-if="item.day === 1">
                    <div class="absolute pin-x" style="top:15px">
                        {{item.date}}
                    </div>
                    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start" style="width:100%">
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
                        class="bg-pink-light p-2 rounded-tl-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
                        class="bg-pink-light p-2 rounded-tr-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                    </div>
                </div>
                </div>
            </div>
            <div class="flex flex-col" style="width:100%">
                <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 5">
                <div class="m-1" style="width:60%;height:50px;box-sizing:border-box">&nbsp;</div>
                </div>
                <div v-for="(item, index) in daysInMonth" :key="index">
                <div @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)" 
                    class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                    :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                    style="width:60%;height:50px;box-sizing:border-box;" v-if="item.day === 2">
                    <div class="absolute pin-x" style="top:15px">
                        {{item.date}}
                    </div>
                    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start" style="width:100%">
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
                        class="bg-pink-light p-2 rounded-tl-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
                        class="bg-pink-light p-2 rounded-tr-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                    </div>
                </div>
                </div>
            </div>
            <div class="flex flex-col" style="width:100%">
                <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 4">
                <div class="m-1" style="width:60%;height:50px;box-sizing:border-box">&nbsp;</div>
                </div>
                <div v-for="(item, index) in daysInMonth" :key="index">
                <div @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)" 
                    class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                    :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                    style="width:60%;height:50px;box-sizing:border-box;" v-if="item.day === 3">
                    <div class="absolute pin-x" style="top:15px">
                        {{item.date}}
                    </div>
                    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start" style="width:100%">
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
                        class="bg-pink-light p-2 rounded-tl-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
                        class="bg-pink-light p-2 rounded-tr-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                    </div>
                </div>
                </div>
            </div>
            <div class="flex flex-col" style="width:100%">
                <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 3">
                <div class="m-1" style="width:60%;height:50px;box-sizing:border-box">&nbsp;</div>
                </div>
                <div v-for="(item, index) in daysInMonth" :key="index">
                <div @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)" 
                    class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                    :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                    style="width:60%;height:50px;box-sizing:border-box;" v-if="item.day === 4">
                    <div class="absolute pin-x" style="top:15px">
                        {{item.date}}
                    </div>
                    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start" style="width:100%">
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
                        class="bg-pink-light p-2 rounded-tl-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
                        class="bg-pink-light p-2 rounded-tr-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                    </div>
                </div>
                </div>
            </div>
            <div class="flex flex-col" style="width:100%">
                <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 2">
                <div class="m-1" style="width:60%;height:50px;box-sizing:border-box">&nbsp;</div>
                </div>
                <div v-for="(item, index) in daysInMonth" :key="index">
                <div @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)" 
                    class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                    :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                    style="width:60%;height:50px;box-sizing:border-box;" v-if="item.day === 5">
                    <div class="absolute pin-x" style="top:15px">
                        {{item.date}}
                    </div>
                    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start" style="width:100%">
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
                        class="bg-pink-light p-2 rounded-tl-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
                        class="bg-pink-light p-2 rounded-tr-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                    </div>
                </div>
                </div>
            </div>
            <div class="flex flex-col" style="width:100%">
                <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 1">
                <div class="m-1" style="width:60%;height:50px;box-sizing:border-box">&nbsp;</div>
                </div>
                <div v-for="(item, index) in daysInMonth" :key="index">
                <div @click="$store.commit('dashboard/SELECT_DATE', item.fullDate)" 
                    class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                    :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                    style="width:60%;height:50px;box-sizing:border-box;" v-if="item.day === 6">
                    <div class="absolute pin-x" style="top:15px">
                        {{item.date}}
                    </div>
                    <div class="flex flex-row flex-no-wrap absolute pin-t pin-r justify-start" style="width:100%">
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('AM'))"
                        class="bg-pink-light p-2 rounded-tl-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('PM'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('WHOLE DAY'))"
                        class="bg-pink-light p-2" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                        <span v-if="notAvailableDates.find(date => date.date === $moment(item.fullDate).format('LL') && date.shifts.includes('OOH'))"
                        class="bg-pink-light p-2 rounded-tr-lg" style="width:25%"></span>
                        <span v-else style="width:25%;"></span>
                    </div>
                </div>
                </div>
            </div>
        </div> 

        <!-- <div class="flex flex-no-wrap m-5 justify-end">
            <div class="rounded-full h-16 w-16 flex items-center justify-center bg-yellow-dark font-semibold text-xl cursor-pointer shadow-md hover:text-white"
            @click="$store.commit('TOGGLE_AVAILABILITY_RANGE_MODAL', true)">
                +
            </div>
        </div> -->
    </section>
</template>
<script>
export default {
  data () {
    return {
        selectedMonth: null,
        selectedYear: new Date().getFullYear(),
        daysInMonth: []
    }
  },
  computed: {
        dateToday () {
            return this.$store.state.dateToday
        },
        notAvailableDates () {
            return this.$store.state.availability.notAvailableDates
        }
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear)
    }
  },
  created () {
    // get current month and year
    let d = new Date()
    this.selectedMonth = d.getMonth()

    // get days in current month
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
  },
  methods: {
    getDaysInMonth(month, selectedYear) {
      let date = new Date(selectedYear, month, 1);
      let days = [];
      while (date.getMonth() === month) {
          days.push(new Date(date));
          date.setDate(date.getDate() + 1);
      }
      let daysInMonth = []
      days.forEach(day => {
        daysInMonth.push({
          day: day.getDay(),
          date: day.getDate(),
          fullDate: this.$moment(new Date(day.getFullYear(), day.getMonth(), day.getDate()).toDateString())._d
        })
      })
      this.daysInMonth = daysInMonth
    },
    adjustMonth(type) {
      if (type === 'previous') {
        if (this.selectedMonth === 0) {
          this.selectedMonth = 11
          this.selectedYear--
        } else {
          this.selectedMonth--
        }
      }
      if (type === 'next') {
        if (this.selectedMonth === 11) {
          this.selectedMonth = 0
          this.selectedYear++
        } else {
          this.selectedMonth++
        }
      }
    }
  }
}
</script>

