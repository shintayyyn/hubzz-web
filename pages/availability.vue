<template>
  <section class="relative">
    <AppNotification/>
    <div class="px-10">
      <div class="text-sm font-bold">I'm available for...</div>
    </div>
    <div class="px-10 mt-5">
      <div class="rounded-lg shadow-lg">
        <form class="w-full p-5">
          <div class="relative flex flex-col">
            <div class="flex flex-row flex-wrap justify-start">
              <div class="text-sm leading-loose mr-2">The shifts I am available for</div>
              <div
                class="py-2 px-1 rounded-lg text-sm bg-grey-lighter leading-tight"
              >Select all that apply</div>
            </div>
            <div class="flex flex-row flex-wrap justify-start mt-5">
              <div
                class="relative border border-solid rounded-lg px-10 py-5 mr-5 mb-1 cursor-pointer"
                :class="selectedShifts.includes(item.id) ? 'bg-yellow': 'hover:bg-yellow'"
                v-for="item in shifts"
                :key="item.id"
                @click="select(item.id)"
              >{{item.name}}</div>
            </div>
          </div>

          <button
            class="bg-yellow-dark hover:text-white focus:outline-none text-black font-bold text-xl p-6 rounded-lg mt-10 mb-5"
            @click.prevent="update"
          >Update</button>
        </form>
      </div>
    </div>

    <div class="px-10 mt-5">
      <div class="text-sm font-bold">When I won't be available</div>
      <div
        class="text-sm"
      >Add a date range from the + button below or click on a date to add or remove</div>
    </div>
    <div class="px-10 my-5">
      <div class="relative border-solid rounded-lg shadow-md p-5" style="height:500px">
        <AvailabilityCalendar/>
        <div class="absolute pin-b pin-r m-5">
          <div
            class="rounded-full h-10 w-10 lg:h-16 lg:w-16 flex items-center focus:outline-none justify-center bg-yellow-dark font-semibold text-xl cursor-pointer shadow-md hover:text-white"
            @click="$store.commit('TOGGLE_AVAILABILITY_RANGE_MODAL', true)"
          >+</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

import debounce from 'lodash.debounce'
import AvailabilityCalendar from '@/components/Availability/AvailabilityCalendar'
import AppNotification from '@/components/AppNotification'
export default {
  components: {
    AvailabilityCalendar,
    AppNotification
  },
  data() {
    return {
      shifts: [],
      selectedShifts: [],
      setFocus: '',
      //
      modal: false,

      // Optional, just need to pass into modal
      formError: []
    }
  },

  computed: {
    unavailableDates() {
      return this.$store.state.availability.unavailableDates
    }
  },

  created() {
    // get all shifts
    this.$axios
      .$get(`/api/v1/shifts`)
      .then(res => {
        this.shifts = []
        res.data.shifts.forEach(item => {
          this.shifts.push({ id: item.id, name: item.name })
        })

      })
    // get authenticated user's selected shift/s
    this.$axios
      .$get(`/api/v1/me`)
      .then(res => {
        this.selectedShifts = []
        res.data.user.locum_detail.shifts.forEach(shift => {
          this.selectedShifts.push(shift.id)
        })
      })

    // get authenticated user's unavailable dates
    this.$axios
      .$get(`/api/v1/locum-unavailabilities`)
      .then(res => {
        console.log(res.data.unavailabilities)
        this.$store.commit('availability/SET_UNAVAILABLE_DATES', res.data.unavailabilities)
      })
  },

  methods: {
    //! refactor this get predictions
    getPredictions: debounce(function (input) {

      let results = []
      const params = {
        input: input
      }
      this.$axios
        .$get(`/api/v1/predictions`, { params })
        .then(res => {
          console.log(res)
          res.predictions.forEach(item => {
            let postal_code = item.details.result.address_components.find(item => item.types.includes('postal_code'))
              ? item.details.result.address_components.find(item => item.types.includes('postal_code')).long_name : ''
            let route = item.details.result.address_components.find(item => item.types.includes('route'))
              ? item.details.result.address_components.find(item => item.types.includes('route')).long_name : ''
            let postal_town = item.details.result.address_components.find(item => item.types.includes('postal_town'))
              ? item.details.result.address_components.find(item => item.types.includes('postal_town')).long_name : ''
            results.push({
              main_text: item.structured_formatting.main_text, secondary_text: item.structured_formatting.secondary_text,
              post_code: postal_code, line_1: route, line_2: '', line_3: postal_town
            })
            this.predictions = results
          })
          results.length > 0 ? this.showPredictions = true : this.showPredictions = false
        })
    }, 250),
    select(id) {
      let shift = this.selectedShifts.find(item => item === id)
      if (shift) {
        this.selectedShifts = this.selectedShifts.filter(item => item !== shift)
      } else {
        this.selectedShifts.push(id)
      }
    },
    update() {
      // post request to api
      console.log(this.selectedShifts)
      this.$axios
        .$put(`/api/v1/locum/me/shifts`, { shift_id: this.selectedShifts })
        .then(res => {
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Availability updated!' })
          this.selectedShifts = []
          res.data.user.locum_detail.shifts.forEach(shift => this.selectedShifts.push(shift.id))
        })
    },
    openModal(date) {
      this.$store.commit('availability/setSelectedDate', this.$moment(date.fullDate).format('LL'))
      this.$store.commit('TOGGLE_AVAILABILITY_MODAL', true)
    }
  }
}
</script>

