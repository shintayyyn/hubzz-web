<template>
    <div class="absolute pin-r pin-t z-10 p-10 bg-grey-lighter" style="height:130%" :style="$store.state.mobile ? 'width:100%' : 'width:70%'">
      <div @click="$store.commit('availability/toggle_modal', false)" class="cursor-pointer" v-text="'<'"></div>
      <div class="font-bold text-lg my-5" style="font-family: Nunito">Availability</div>
      <div class="border-solid rounded-lg shadow-md mb-8 px-5 py-8" style="width:70%">
        <div class="text-sm font-bold">I won't be available for...</div>
        <div class="mt-3 text-sm">On this date</div>
        <div class="font-bold text-xl mt-4">{{$moment($store.state.availability.selectedDate).format('ddd DD MMMM YYYY')}}</div>
        <div class="mt-8">
          <label for="shifts" class="block text-sm mb-2" >On these shifts <span class="ml-8 px-1 border-solid rounded-lg bg-grey-light">Select all that apply. Shifts that are already booked are greyed-out.</span></label>
          <div class="flex flex-row flex-wrap justify-start mt-5">
            <div v-for="(item, index) in shifts" :key="index" :class="selectedShifts.includes(item.value) ? 'bg-yellow': ''"
              class="border border-solid rounded-lg px-8 py-5 mr-4 cursor-pointer"
              @click="select(item.value)">{{item.label}}</div>
          </div>
        </div>
        <div class="mt-4">
          <button class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg" @click.prevent="save">Save</button>
        </div>
      </div>
    </div>
</template>
<script>
const shifts = [
  {value: 'am', label: 'AM'},
  {value: 'pm', label: 'PM'},
  {value: 'whole_day', label: 'Whole day'},
  {value: 'ooh', label: 'OOH'},
]
export default {
  data () {
    return {
      shifts,
      selectedShifts: []
    }
  },
  created () {
    this.getSelectedShifts()
  },
  methods: {
    getSelectedShifts () {
      let item = this.$store.state.availability.notAvailableDates.find(item => item.date === this.$store.state.availability.selectedDate)
      this.selectedShifts = []
      if (item) {
        item.shifts.forEach(shift => {
          this.selectedShifts.push(shift)
        })
      }
    },
    select(value) {
      const index = this.selectedShifts.findIndex(item => item === value)
      if (index < 0) {
        this.selectedShifts.push(value)
      } else {
        this.selectedShifts.splice(index, 1)
      }
    },
    save () {
      this.$store.commit('availability/setNotAvailableDate', this.selectedShifts)
      this.$store.commit('availability/toggle_modal', false)
    }
  }
}
</script>
