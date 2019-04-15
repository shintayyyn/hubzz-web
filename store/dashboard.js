export const state = () => ({
    dateToday: null,
    reminders: [
        { type: 'billing', done: false },
        { type: 'compliance', done: false },
        { type: 'pensions', done: false },
        { type: 'availability', done: false },
    ],
    appointments_tab: 'per_month',
    months: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ],
    select_date: null,
    notAvailableDates: [],
    statistics: [
        { jobs: 'Available jobs', total: 0 },
        { jobs: 'Current jobs', total: 0 },
        { jobs: 'Applied jobs', total: 0 },
        { jobs: 'Completed jobs', total: 0 }
    ],
})
  
export const mutations = {
    SET_DATE_TODAY (state) {
        state.dateToday = this.$moment(new Date())
        state.select_date = this.$moment(new Date())
    },
    TOGGLE_APPOINTMENTS_TAB (state, payload) {
        state.appointments_tab = payload
    },
    SELECT_DATE (state, payload) {
        state.select_date = payload
    }
}
  