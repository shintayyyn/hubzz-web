export const state = () => ({
  availability: {
    post_code: '',
    miles: 0,
    shifts: []
  },
  notAvailableDates: [],
  selectedDate: null,
  modal: false,
  rangeModal: false
})

export const getters = {
  getAvailability (state) {
    return state.availability
  },
}

export const mutations = {
  setAvailability (state, payload) {
    state.availability = payload
  },
  setSelectedDate (state, payload) {
    state.selectedDate = payload
  },
  toggle_modal (state, payload) {
    state.modal = payload
  },
  toggle_range_modal (state, payload) {
    state.rangeModal = payload
  },
  setNotAvailableDate (state, payload) {
    // find the date
    let item = state.notAvailableDates.find(item => item.date === state.selectedDate)
    if (item) {
      // update
      item.date = state.selectedDate,
      item.shifts = []
      payload.forEach(shift => {
        item.shifts.push(shift)
      })
    } else {
      // else add
      state.notAvailableDates.push({date: state.selectedDate, shifts: payload})
    }
    console.log(state.notAvailableDates)
  },
  // setNotAvailableDateRange (state, payload) {
  //   let dates = payload.dateRange
  //   // console.log(state.notAvailableDates)
  //   // dates.forEach(date => {
  //   //   let item = state.notAvailableDates.find(item => this.$moment(item.date) === this.$moment(date))
  //   //   console.log(item)
  //   // })
  //   state.notAvailableDates.push({date: dates[0], shifts: payload.shifts})
  //   // dates.forEach(date => {
  //   //   state.notAvailableDates.push({date: date, shifts: payload.shifts})
  //   // })
  //   console.log(state.notAvailableDates)
  //   state.rangeModal = false
  // }
}

export const actions = {}
