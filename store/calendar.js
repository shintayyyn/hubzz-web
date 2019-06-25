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
    locum_jobs: [],
    appointment_jobs: [],
    unavailabilities: [],
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
    SET_LOCUM_JOBS(state, payload) {
        state.locum_jobs = payload
    },
    SET_UNAVAILABILITIES(state, payload) {
        state.unavailabilities = payload
    },
    SET_APPOINTMENT_JOBS(state, payload) {
        state.appointment_jobs = payload
    },
    ADD_APPOINTMENT(state, payload) {
        state.appointment_jobs.push(payload)
    },
    UPDATE_APPOINTMENT(state, payload) {
        // ! response on get and update should be the same
        let updateJob = state.appointment_jobs.find(job => job.id === payload.id)
        updateJob.private_job.private_practice = payload.private_job.private_practice
        updateJob.private_job.date_start = payload.private_job.date_start
        updateJob.private_job.date_end = payload.private_job.date_end
        updateJob.private_job.shift = payload.private_job.shift
    },
    
    
}

  