export const state = () => ({
  months: [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ],
  date_today: null,
  view_type: 'per_month',
  selected_date: null,
  selected_date_shift: null,
  create_job_modal: false,
  repost_job: null,
  loading: false
})

export const mutations = {
  TOGGLE_LOADING(state, payload) {
    state.loading = payload
  },
  SET_DATE_TODAY(state) {
    state.date_today = this.$moment(new Date()).format('YYYY-MM-DD')
    state.selected_date = this.$moment(new Date()).format('YYYY-MM-DD')
    state.selected_date_shift = {
      date: this.$moment(new Date()).format('YYYY-MM-DD'),
      shift: 'AM'
    }
  },
  TOGGLE_CALENDAR_VIEW_TYPE(state, payload) {
    state.view_type = payload
    if (payload === 'per_month') {
      state.selected_date = state.selected_date_shift.date
    } else {
      state.selected_date_shift.date = state.selected_date
    }
  },
  SELECT_DATE(state, payload) {
    state.selected_date = payload
  },
  SELECT_DATE_SHIFT(state, payload) {
    state.selected_date_shift = payload
  },
  CREATE_JOB_MODAL(state, payload) {
    state.create_job_modal = payload
  },
  REPOST_JOB(state, payload) {
    state.repost_job = payload
  },
  CLEAR_REPOST_JOB(state, payload) {
    state.repost_job = null
  }
}
