export const state = () => ({
  // calendar
  months: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ],
  shifts: [],
  date_today: null,
  selected_date: null,
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
}

export const actions = {
  getShifts ({ commit, }) {
    this.$axios.$get(`/api/v1/shifts`).then(res => {
      commit('SET_SHIFTS', res.data.shifts)
    })
  }, 
}
