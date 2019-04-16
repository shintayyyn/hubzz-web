<template>
  <section>
    <div class="absolute pin-r pin-t z-10 p-10 bg-grey-lighter" style="height:130%" :style="$store.state.mobile ? 'width:100%' : 'width:70%'"
      :class="[$store.state.blur_bg_2 ? 'blurClass2' : '', 'bgClass2']">
      <div @click="$store.commit('TOGGLE_APPOINTMENT_MODAL', false)" class="cursor-pointer" v-text="'<'"></div>
      <div class="font-bold text-lg my-5" style="font-family: Nunito">Appointment</div>
      <div class="border-solid rounded-lg shadow-md mb-8 px-5 py-8" style="width:90%">

        <div class="mt-2 flex flex-wrap">
          <div class="w-full px-3">
            <div class="border-b border-b-2 pt-2" :class="{'border-yellow-dark':setFocus === 'practice'}">
              <label for="date_to" class="block text-sm mb-2">Practice</label>
              <select @focus="setFocus = 'practice'" @blur="setFocus = ''" v-model="form.practice" name="practice" id="practice"
                class="w-full font-bold px-2 leading-tight focus:outline-none"
                style="height:40px;">
                <option value="" selected>Add a surgery first..</option>
                <option v-for="(item, index) in surgeries" :key="`${item}-${index}`" :value="item">{{item}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-2 ml-5">
          <button class="rounded-lg bg-yellow-dark shadow-md p-2 text-sm font-bold hover:text-white focus:outline-none"
            @click.prevent="$store.commit('TOGGLE_SURGERY_MODAL', true)">Add</button>
        </div>

        <div class="mt-10 flex flex-wrap">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'date_from'}">
              <label for="date_from" class="block text-sm mb-2">From</label>
              <input @focus="setFocus = 'date_from'" @blur="setFocus = ''" v-model="form.date_from" type="date" name="date_from" id="date_from"
                class="appearance-none bg-transparent border-none w-full text-center font-bold text-sm leading-tight focus:outline-none">
            </div>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'date_to'}">
              <label for="date_to" class="block text-sm mb-2">To</label>
              <input @focus="setFocus = 'date_to'" @blur="setFocus = ''" v-model="form.date_to" type="date" name="date_to" id="date_to"
                class="appearance-none bg-transparent border-none w-full text-center font-bold text-sm leading-tight focus:outline-none">
            </div>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <div class="mb-4 border-b border-b-2 pt-2" :class="{'border-yellow-dark':setFocus === 'shift'}">
              <label for="date_to" class="block text-sm mb-2">Shift</label>
              <select @focus="setFocus = 'shift'" @blur="setFocus = ''" v-model="form.shift" name="shift" id="shift"
                class="w-full font-bold px-2 leading-tight focus:outline-none"
                style="height:30px;">
                <option value="" selected>Select..</option>
                <option v-for="(item, index) in shifts" :key="`${item}-${index}`" :value="item">{{item}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'rate_total'}">
              <label for="rate_total" class="block text-sm mb-2">Rate £</label>
              <input @focus="setFocus = 'rate_total'" @blur="setFocus = ''" v-model="form.rate_total" type="text" name="rate_total" id="rate_total"
                class="appearance-none bg-transparent border-none w-full text-center font-bold text-sm leading-tight focus:outline-none">
            </div>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <div class="mb-4 border-b border-b-2 pt-2" :class="{'border-yellow-dark':setFocus === 'rate_type'}">
              <label for="rate_type" class="block text-sm mb-2">per</label>
              <select @focus="setFocus = 'rate_type'" @blur="setFocus = ''" v-model="form.rate_type" name="rate_type" id="rate_type"
                class="w-full font-bold px-2 leading-tight focus:outline-none"
                style="height:30px;">
                <option v-for="(item, index) in type" :key="`${item}-${index}`" :value="item" >{{item}}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap">
          <div class="w-full px-3 mb-6 md:mb-0">
            <div class="mb-4 border-b border-b-2 border-grey py-2" :class="{'border-yellow-dark':setFocus === 'private_notes'}">
              <label for="private_notes" class="block text-sm mb-2">Private notes</label>
              <textarea rows="10" @focus="setFocus = 'private_notes'" @blur="setFocus = ''" v-model="form.private_notes" name="private_notes" id="private_notes"
                class="appearance-none bg-transparent border-none w-full text-sm font-bold leading-tight focus:outline-none"></textarea>
            </div>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap">
          <div class="px-3"></div>
          <button class="rounded-lg bg-yellow-dark shadow-md px-5 py-6 font-bold text-lg hover:text-white focus:outline-none"
            @click.prevent="save">Save</button>
        </div>

      </div>

    </div>
    <transition name="slide">
      <SurgeryModal v-if="$store.state.surgery_modal" @addSurgery="surgeries.push($event)"/>      
    </transition>
  </section>
</template>
<script>
import SurgeryModal from '@/components/Dashboard/SurgeryModal'
const shifts = [
  'AM', 'PM',
  'WHOLE DAY', 'OOH'
]
const type = [
  'hour', 'session'
]
export default {
  components: {
    SurgeryModal
  },
  data () {
    return {
      shifts,
      type,
      form: {
        date_from: '',
        date_to: '',
        shift: '',
        rate_total: 0,
        rate_type: '',
        practice: '',
        private_notes: ''
      },
      surgeries: [],
      setFocus: ''
    }
  },
  methods: {
    save () {
      // validate dates 
      //! fix validation
      this.validateDates(this.form.date_from, this.form.date_to, this.form.shift)
      // this.validateDates(this.$moment(this.form.date_from).format('LL'), this.$moment(this.form.date_to).format('LL'), this.form.shift)
    },
    getDateArray (start, end) {
      let arr = new Array();
      let dt = new Date(start);
      while (dt <= new Date(end)) {
          arr.push(this.$moment(new Date(dt)).format('LL'));
          dt.setDate(dt.getDate() + 1);
      }
      return arr;
    },
    validateDates (startDate, endDate, shift) {
      let appointmentDates = []
      let notAvailableDates = this.$store.state.availability.notAvailableDates
      let conflictDates = []
      let message = ''

      if (endDate < startDate) {
        return 
      }

      // get all the dates between startDate and endDate
      appointmentDates = this.getDateArray(startDate, endDate)

      // check all not available dates and their shifts
      for (let i=0;i<notAvailableDates.length;i++) {
        for (let j=0;j<appointmentDates.length;j++) {
          if (notAvailableDates[i].date === appointmentDates[j] && notAvailableDates[i].shifts.includes(shift)) {
            conflictDates.push(
              { date: appointmentDates[j], shift: shift}
            )
          } 
        }
      }

      if (conflictDates.length > 0) {
        // message = "Dates on your appointment clash with dates that you're unavailable"
        message = `"Dates on your appointment clash with dates: ${conflictDates.map(item => item.date)} with ${shift} shift.`
        console.log(message)
      } else {
        this.$store.commit('dashboard/SET_APPOINTMENT_DATES', {appointmentDates: appointmentDates, shifts: [shift]})
        this.$store.commit('TOGGLE_APPOINTMENT_MODAL', false)
      }
    }
  }
}
</script>
<style>
.bgClass2 {
  transition: all 0.3s ease-in-out;
}
.blurClass2 {
  /* filter: grayscale(100%); */
  filter: blur(2px);
  opacity: 0.8;
}
</style>

