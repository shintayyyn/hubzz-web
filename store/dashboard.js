import moment from 'moment'
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
    week_date_type: '',
    statistics: [
        { jobs: 'Available jobs', total: 0 },
        { jobs: 'Current jobs', total: 0 },
        { jobs: 'Applied jobs', total: 0 },
        { jobs: 'Completed jobs', total: 0 }
    ],
    surgeries: [],
    appointmentDates: [],
    editAppointmentDate: null
})

export const mutations = {
    SET_DATE_TODAY (state) {
        state.dateToday = this.$moment(new Date())
        state.select_date = this.$moment(new Date()).format('YYYY-MM-DD')
    },
    TOGGLE_APPOINTMENTS_TAB (state, payload) {
        state.appointments_tab = payload
    },
    SELECT_DATE (state, payload) {
        state.select_date = this.$moment(payload).format('YYYY-MM-DD')
    },
    SELECT_WEEK_DATE (state, payload) {
        state.select_date = payload.date
        state.week_date_type = payload.type
    },
    SET_SURGERIES (state, payload) {
        state.surgeries = []
        if (payload.length > 0) {
            payload.forEach(item => {
                state.surgeries.push(item)
            })
        }
    },
    ADD_SURGERY (state, payload) {
        state.surgeries.push(payload)
    },
    // SET_APPOINTMENT_DATES (state, payload) {
    //     //! should be labeled with id for grouping
    //     payload.appointmentDates.forEach(item => {
    //         state.appointmentDates.push({
    //             date: item, shifts: payload.shifts
    //         })
    //     })
    // },
    ADD_APPOINTMENT_DATE (state, payload) {
        state.appointmentDates.push(payload)
    },
    SET_EDIT_APPOINTMENT_DATE (state, payload) {
        state.editAppointmentDate = payload
    },
    UPDATE_APPOINTMENT_DATE (state, payload) {
        let index = state.appointmentDates.findIndex(item => item.job_number === payload.job_number)
        state.appointmentDates[index].from = payload.from
        state.appointmentDates[index].job_number = payload.job_number
        state.appointmentDates[index].per = payload.per
        state.appointmentDates[index].practice = payload.practice
        state.appointmentDates[index].private_notes = payload.private_notes
        state.appointmentDates[index].rate = payload.rate
        state.appointmentDates[index].shifts = payload.shifts
        state.appointmentDates[index].to = payload.to
        state.appointmentDates[index].total_hours = payload.total_hours
    }
}

export const getters = {
    getAppointments (state) {
        let ids = []
        state.appointmentDates.forEach(item => {
            let arr = new Array();
            let dt = new Date(item.from);
            while (dt <= new Date(item.to)) {
              arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
              dt.setDate(dt.getDate() + 1);
            }
            if (arr.includes(state.select_date)) {
                ids.push(item.job_number)
            }
        })
        return state.appointmentDates.filter(item => ids.includes(item.job_number))
    }
}
  