export const state = () => ({
  // calendar
  months: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ],
  shifts: [],
  date_today: null,
  selected_date: null,
  //
  unavailabilities: [],
  appointment_jobs: []
})

export const mutations = {
  SET_SHIFTS (state, payload) {
    state.shifts = payload.sort((a,b) => a.id - b.id)
  },
  SET_DATE_TODAY (state) {
    state.date_today = this.$moment(new Date()).format('YYYY-MM-DD')
    state.selected_date = this.$moment(new Date()).format('YYYY-MM-DD')
  },
  SELECT_DATE (state, payload) {
    state.selected_date = payload
  },
  SET_UNAVAILABILITES (state, payload) {
    state.unavailabilities = payload
  },
  ADD_UNAVAILABILITIES (state, payload) {
    payload.forEach(data => {
      let foundTest = state.unavailabilities.find(item => item.id === data.id)
      if (foundTest) {
        foundTest.shifts = data.shifts
      } else {
        state.unavailabilities.push(data)
      }
    })
  },
  UPDATE_UNAVAILABILITIES (state, payload) {
    let unavailableDate = state.unavailabilities.find(item => item.id === payload.id)
    unavailableDate.shifts = payload.shifts
  },
  REMOVE_UNAVAILABILITIES (state, payload) {
    state.unavailabilities = state.unavailabilities.filter(item => item.id !== payload)
  },
  SET_APPOINTMENT_JOBS(state, payload) {
    state.appointment_jobs = payload
  }
}

export const actions = {
  getShifts({commit}) {
    this.$axios.$get(`/api/v1/shifts`).then(res => {
        commit('SET_SHIFTS', res.data.shifts)
    })
  }, 
}
