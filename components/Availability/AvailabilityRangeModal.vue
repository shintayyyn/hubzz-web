<template>
    <div class="absolute pin-r pin-t z-10 p-10 bg-grey-lighter" style="height:130%" :style="$store.state.mobile ? 'width:100%' : 'width:70%'">
      <div @click="$store.commit('TOGGLE_AVAILABILITY_RANGE_MODAL', false)" class="cursor-pointer" v-text="'<'"></div>
      <div class="font-bold text-lg my-5" style="font-family: Nunito">Availability</div>
      <div class="border-solid rounded-lg shadow-md mb-8 px-5 py-8" style="width:70%">
        <div class="text-sm font-bold">I won't be available... </div>
         <div class="flex flex-wrap -mx-3 mb-6">
              <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'date_from'}">
                  <label for="date_from" class="block text-sm mb-2">From</label>
                  <input @focus="setFocus = 'date_from'" @blur="setFocus = ''" v-model="form.from" type="date" name="date_from" id="date_from"
                    class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
                </div>
              </div>
              <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'date_to'}">
                  <label for="date_to" class="block text-sm mb-2">To</label>
                  <input @focus="setFocus = 'date_to'" @blur="setFocus = ''" v-model="form.to" type="date" name="date_to" id="date_to"
                    class="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none">
                </div>
              </div>
            </div>
        <div class="mt-8">
          <label for="shifts" class="block text-sm mb-2" >On these shifts <span class="px-1 border-solid rounded-lg bg-grey-light">Select all that apply</span></label>
          <div class="flex flex-row flex-wrap justify-start mt-5">
            <div v-for="(item, index) in shifts" :key="index" :class="selectedShifts.includes(item.value) ? 'bg-yellow': ''"
              class="border border-solid rounded-lg px-8 py-5 mr-4 cursor-pointer"
              @click="select(item.value)">{{item.label}}</div>
          </div>
        </div>
        <div class="mt-4">
          <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg" @click.prevent="add">Add</button>
        </div>
      </div>
    </div>
</template>
<script>
const shifts = [
  {value: 'AM', label: 'AM'},
  {value: 'PM', label: 'PM'},
  {value: 'WHOLE DAY', label: 'Whole day'},
  {value: 'OOH', label: 'OOH'},
]
export default {
  data () {
    return {
        setFocus: '',
        form: {
            from: null,
            to: null
        },
        shifts,
        selectedShifts: []
    }
  },
  methods: {
    select(value) {
      const index = this.selectedShifts.findIndex(item => item === value)
      if (index < 0) {
        this.selectedShifts.push(value)
      } else {
        this.selectedShifts.splice(index, 1)
      }
    },
    add () {
        let dateRange = [];
        let currentDate = this.$moment(this.form.from);
        let stopDate = this.$moment(this.form.to);
        while (currentDate <= stopDate) {
            dateRange.push( this.$moment(currentDate)._d )
            currentDate = this.$moment(currentDate).add(1, 'days');
        }
        dateRange.forEach(date => {
            this.$store.commit('availability/setSelectedDate', date)
            this.$store.commit('availability/setNotAvailableDate', this.selectedShifts)
        })
        this.$store.commit('availability/toggle_range_modal', false)
    //   this.$store.commit('availability/setNotAvailableDateRange', {dateRange: dateRange, shifts: this.selectedShifts})
    },
    // getDateArray (startDate, stopDate) {
    //     var dateArray = [];
    //     var currentDate = this.$moment(startDate);
    //     var stopDate = this.$moment(stopDate);
    //     while (currentDate <= stopDate) {
    //         dateArray.push( this.$moment(currentDate)._id )
    //         currentDate = this.$moment(currentDate).add(1, 'days');
    //     }
    //     return dateArray;
    // }
  }
}
</script>
