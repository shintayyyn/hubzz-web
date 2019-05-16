export const state = () => ({
  unavailableDates: [],
  select_date: null,
})

export const mutations = {
  SELECT_DATE (state, payload) {
    state.select_date = payload
  },
  SET_UNAVAILABLE_DATES (state, payload) {
    state.unavailableDates = []
    payload.forEach(item => {
      state.unavailableDates.push({ date: payload.date, shifts: payload.shift})
    })
  },
  SET_UNAVAILABLE_DATE (state, payload) {
    let date = payload.selectedDate
    let shifts = payload.selectedShifts
    // check if theres already the same date
    let item = state.unavailableDates.find(item => item.date === date)

    if (item && item.date) {
      // update
      item.date = date,
      item.shifts = []
      shifts.forEach(shift => {
        item.shifts.push(shift)
      })
    } else {
      // else add
      state.unavailableDates.push({date: this.$moment(date).format('LL'), shifts: shifts})
    }
  },
  REMOVE_NOT_AVAILABLE_DATE (state, payload) {
    let filteredDates = []
    filteredDates = state.unavailableDates.filter(item => item.date !== payload)
    state.unavailableDates = filteredDates
  }
}

export const actions = {}
