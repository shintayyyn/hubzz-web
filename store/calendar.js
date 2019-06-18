import moment from 'moment'
export const state = () => ({
    // calendar
    months: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ],
    date_today: null,
    view_type: 'per_month',
    // info
    selected_date: null,
    selected_date_shift: null,
    // practice
    jobs: [],
    applied_jobs_with_selection_date: [],
    unfilled_jobs: [],
    declined_jobs: [],
    // locums
    appointment_jobs: []
})

export const mutations = {
    SET_DATE_TODAY (state) {
        state.date_today = this.$moment(new Date()).format('YYYY-MM-DD')
        state.selected_date = this.$moment(new Date()).format('YYYY-MM-DD')
    },
    TOGGLE_CALENDAR_VIEW_TYPE (state, payload) {
        state.view_type = payload
    },
    // per month
    SELECT_DATE (state, payload) {
        state.selected_date = payload
    },
    // per week
    SELECT_DATE_SHIFT(state, payload) {
        state.selected_date_shift = payload
    },
    // practice
    SET_JOBS (state, payload) {
        state.jobs = payload
    },
    SET_APPLIED_JOBS (state, payload) {
        state.applied_jobs_with_selection_date = payload
    },
    SET_UNFILLED_JOBS (state, payload) {
        state.unfilled_jobs = payload
    },
    SET_DECLINED_JOBS (state, payload) {
        state.declined_jobs = payload
    },
    // locums
    SET_APPOINTMENT_JOBS(state, payload) {
        state.appointment_jobs = payload
    }
}

export const getters = {
    // getLiveJobs (state) {
    //     let ids = []
    //     state.jobs.forEach(job => {
    //         let arr = new Array();
    //         let dt = new Date(job.platform_job.date_start);
    //         while (dt <= new Date(job.platform_job.date_end)) {
    //           arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
    //           dt.setDate(dt.getDate() + 1);
    //         }
    //         if (arr.includes(state.selected_date)) {
    //             ids.push(job.id)
    //         }
    //     })
    //     return state.jobs.filter(job => ids.includes(job.id))
    // }
    // getAppointmentsPerMonth (state) {
    //     let ids = []
    //     state.appointmentDates.forEach(item => {
    //         let arr = new Array();
    //         let dt = new Date(item.from);
    //         while (dt <= new Date(item.to)) {
    //           arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
    //           dt.setDate(dt.getDate() + 1);
    //         }
    //         if (arr.includes(state.select_date)) {
    //             ids.push(item.job_number)
    //         }
    //     })
    //     return state.appointmentDates.filter(item => ids.includes(item.job_number))
    // },
    // getAppointmentsPerWeek (state) {
    //     let id = ''
    //     state.appointmentDates.find((item) => {
    //         let arr = new Array();
    //         let dt = new Date(item.from);
    //         while (dt <= new Date(item.to)) {
    //           arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
    //           dt.setDate(dt.getDate() + 1);
    //         }
    //         if (arr.includes(state.select_date) && item.shifts === state.select_shift) {
    //             id = item.job_number
}
  