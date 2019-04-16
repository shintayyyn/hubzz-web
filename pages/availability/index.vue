<template>
  <section class="relative">
    <div class="px-10">
      <div class="text-sm font-bold">I'm available for...</div>
    </div>
    <div class="px-10 mt-5">
      <div class="border-solid rounded-lg shadow-md p-5">
        <form>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('post_code') }">
            <label for="post_code" class="block text-sm mb-2" >The post code where I will be available at</label>
            <em v-if="formError.includes('post_code')" class="text-xs text-red-darker float-right">Required</em>
            <input v-model="availability.post_code" type="text" name="post_code" id="post_code" placeholder="Enter a post code"
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{ 'border-red': formError.includes('miles') }">
            <label for="miles" class="block text-sm mb-2" >No further than (in miles)</label>
            <em v-if="formError.includes('miles')" class="text-xs text-red-darker float-right">Required</em>
            <input v-model="availability.miles" type="text" name="miles" id="miles"
              class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
          </div>
          <div class="py-2" >
            <label for="shifts" class="block text-sm mb-2" >The shifts I am available for <span class="px-3 py-1 rounded-lg bg-grey-lighter font-normal">Select all that apply</span></label>
            <div class="flex flex-row flex-wrap justify-start mt-5">
              <div :class="availability.shifts.includes(item.value) ? 'bg-yellow':''" 
                class="relative border border-solid rounded-lg px-10 py-5 mr-5 mb-1 hover:bg-yellow cursor-pointer" 
                v-for="(item, index) in shifts" :key="index" @click="select(item.value)">
                {{item.label}}
              </div>
            </div>
          </div>
        </form>
        <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg mt-10 mb-5" @click.prevent="update">Update</button>
      </div>
    </div>

    <div class="px-10 mt-5">
      <div class="text-sm font-bold">When I won't be available</div>
      <div class="text-sm">Add a date range from the + button below or click on a date to add or remove</div>
    </div>
    <div class="px-10 mt-5">
      <div class="border-solid rounded-lg shadow-md p-5">

        <div class="flex flex-no-wrap justify-start">
          <div class="mr-10" style="width:20%">
            {{months[selectedMonth]}} {{selectedYear}}
          </div>
          <div class="ml-10" style="width:50%;height:50px;box-sizing:border-box;">
            <span class="cursor-pointer" @click="adjustMonth('previous')" v-text="'<'"></span>
            <span class="mx-5"></span>
            <span class="cursor-pointer" @click="adjustMonth('next')" v-text="'>'"></span>
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
            <div class="m-1" style="width:50%;height:50px;box-sizing:border-box">&nbsp;</div>
            </div>
            <div v-for="(item, index) in daysInMonth" :key="index">
              <div @click="openModal(item)" 
                class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                style="width:50%;height:50px;box-sizing:border-box;" v-if="item.day === 0">
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
            <div v-if="daysInMonth.findIndex(({ day }) => day === 0) < 6">
            <div class="m-1" style="width:50%;height:50px;box-sizing:border-box">&nbsp;</div>
            </div>
            <div v-for="(item, index) in daysInMonth" :key="index">
              <div @click="openModal(item)" 
                class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                style="width:50%;height:50px;box-sizing:border-box;" v-if="item.day === 1">
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
            <div class="m-1" style="width:50%;height:50px;box-sizing:border-box">&nbsp;</div>
            </div>
            <div v-for="(item, index) in daysInMonth" :key="index">
              <div @click="openModal(item)" 
                class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                style="width:50%;height:50px;box-sizing:border-box;" v-if="item.day === 2">
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
            <div class="m-1" style="width:50%;height:50px;box-sizing:border-box">&nbsp;</div>
            </div>
            <div v-for="(item, index) in daysInMonth" :key="index">
              <div @click="openModal(item)" 
                class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                style="width:50%;height:50px;box-sizing:border-box;" v-if="item.day === 3">
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
            <div class="m-1" style="width:50%;height:50px;box-sizing:border-box">&nbsp;</div>
            </div>
            <div v-for="(item, index) in daysInMonth" :key="index">
              <div @click="openModal(item)" 
                class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                style="width:50%;height:50px;box-sizing:border-box;" v-if="item.day === 4">
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
            <div class="m-1" style="width:50%;height:50px;box-sizing:border-box">&nbsp;</div>
            </div>
            <div v-for="(item, index) in daysInMonth" :key="index">
              <div @click="openModal(item)" 
                class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                style="width:50%;height:50px;box-sizing:border-box;" v-if="item.day === 5">
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
            <div class="m-1" style="width:50%;height:50px;box-sizing:border-box">&nbsp;</div>
            </div>
            <div v-for="(item, index) in daysInMonth" :key="index">
              <div @click="openModal(item)" 
                class="relative border border-solid rounded-lg m-1 cursor-pointer text-center"
                :class="$moment($store.state.dashboard.dateToday).format('LL') === $moment(item.fullDate).format('LL') ? 'border-yellow-dark text-lg font-bold':'hover:bg-grey-light'"
                style="width:50%;height:50px;box-sizing:border-box;" v-if="item.day === 6">
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

        <div class="flex flex-no-wrap m-5 justify-end">
          <div class="rounded-full h-16 w-16 flex items-center justify-center bg-yellow-dark font-semibold text-xl cursor-pointer shadow-md hover:text-white"
            @click="$store.commit('TOGGLE_AVAILABILITY_RANGE_MODAL', true)">+</div>
        </div>

      </div>
    </div>

  </section>
</template>
<script>
const shifts = [
  {value: 'AM', label: 'AM'},
  {value: 'PM', label: 'PM'},
  {value: 'WHOLE DAY', label: 'Whole day'},
  {value: 'OOH', label: 'OOH'},
]
const availability = {
  post_code: '',
  miles: 0,
  shifts: []
}
const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]
import AvailabilityModal from '@/components/Availability/AvailabilityModal'
export default {
  components: {
    AvailabilityModal
  },
  data () {
    return {
      shifts,
      availability,
      months,
      modal: false,
      selectedMonth: 0,
      selectedYear: new Date().getFullYear(),
      daysInMonth: [],
      // Optional, just need to pass into modal
      formError: []
    }
  },
  created () {
    // get current month and year
    let d = new Date()
    this.selectedMonth = d.getMonth()

    // get days in current month
    this.getDaysInMonth(this.selectedMonth, this.selectedYear)
  },
  computed: {
    notAvailableDates () {
      return this.$store.state.availability.notAvailableDates
    }
  },
  watch: {
    selectedMonth(value) {
      this.getDaysInMonth(value, this.selectedYear)
    }
  },
  methods: {
    select(value) {
      const index = this.availability.shifts.findIndex(item => item === value)
      if (index < 0) {
        this.availability.shifts.push(value)
      } else {
        this.availability.shifts.splice(index, 1)
      }
    },
    update () {
      this.$store.commit('availability/setAvailability', this.availability)
    },
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
    },
    openModal (date) {
      this.$store.commit('availability/setSelectedDate', this.$moment(date.fullDate).format('LL'))
      this.$store.commit('TOGGLE_AVAILABILITY_MODAL', true)
    }
  }
}
</script>

