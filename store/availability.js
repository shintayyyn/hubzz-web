export const state = () => ({
  availability: {
    post_code: '',
    miles: 0,
    shifts: []
  },
  notAvailableDates: [],
  select_date: null,
})

export const mutations = {
  setAvailability (state, payload) {
    state.availability = payload
  },
  SELECT_DATE (state, payload) {
    state.select_date = payload
  },
  SET_NOT_AVAILABLE_DATE (state, payload) {
    let date = payload.selectedDate
    let shifts = payload.selectedShifts
    // check if theres already the same date
    let item = state.notAvailableDates.find(item => item.date === date)

    if (item && item.date) {
      // update
      item.date = date,
      item.shifts = []
      shifts.forEach(shift => {
        item.shifts.push(shift)
      })
    } else {
      // else add
      state.notAvailableDates.push({date: this.$moment(date).format('LL'), shifts: shifts})
    }
  },
  REMOVE_NOT_AVAILABLE_DATE (state, payload) {
    let filteredDates = []
    filteredDates = state.notAvailableDates.filter(item => item.date !== payload)
    state.notAvailableDates = filteredDates
  }
}

export const actions = {}
