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
    createJob: false,
    practice_current_jobs: [],
    practice_applied_jobs: [],
    practice_unfilled_jobs: [],
    practice_declined_jobs: [],
    practice_applied_jobs_reminder: [],
    practice_available_jobs_reminder: [],
    // locums
    locum_private_jobs: [],
    locum_current_jobs: [],
    locum_applied_jobs: [],
    locum_unavailabilities: [],
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
    CREATE_JOB(state, payload) {
        state.createJob = payload
    },
    SET_PRACTICE_CURRENT_JOBS (state, payload) {
        state.practice_current_jobs = payload
    },
    SET_PRACTICE_APPLIED_JOBS (state, payload) {
        state.practice_applied_jobs = payload
    },
    SET_PRACTICE_UNFILLED_JOBS (state, payload) {
        state.practice_unfilled_jobs = payload
    },
    SET_PRACTICE_DECLINED_JOBS (state, payload) {
        state.practice_declined_jobs = payload
    },
    SET_PRACTICE_APPLIED_JOBS_REMINDER (state, payload) {
        state.practice_applied_jobs_reminder = payload
    },
    SET_PRACTICE_AVAILABLE_JOBS_REMINDER (state, payload) {
        state.practice_available_jobs_reminder = payload
    },
    // locums
    SET_LOCUM_PRIVATE_JOBS(state, payload) {
        state.locum_private_jobs = payload
    },
    SET_LOCUM_CURRENT_JOBS(state, payload) {
        state.locum_current_jobs = payload
    },
    SET_LOCUM_APPLIED_JOBS(state, payload) {
        state.locum_applied_jobs = payload
    },
    SET_LOCUM_UNAVAILABILITIES(state, payload) {
        state.locum_unavailabilities = payload
    },
    ADD_APPOINTMENT(state, payload) {
        state.locum_private_jobs.push(payload)
    },
    UPDATE_APPOINTMENT(state, payload) {
        // ! response on get and update should be the same
        let updateJob = state.locum_private_jobs.find(job => job.id === payload.id)
        updateJob.private_job.private_practice = payload.private_job.private_practice
        updateJob.private_job.date_start = payload.private_job.date_start
        updateJob.private_job.date_end = payload.private_job.date_end
        updateJob.private_job.shift = payload.private_job.shift
    },
    REMOVE_APPOINTMENT(state, payload) {
        state.locum_private_jobs = state.locum_private_jobs.filter(job => job.id !== payload)
    }
    
    
}

  