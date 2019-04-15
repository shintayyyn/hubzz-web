export const state = () => ({
  availability: {
    post_code: '',
    miles: 0,
    shifts: []
  },
  notAvailableDates: [],
  selectedDate: null,
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
      state.notAvailableDates.push({date: this.$moment(state.selectedDate).format('LL'), shifts: payload})
    }
    console.log(state.notAvailableDates)
  },
}

export const actions = {}
