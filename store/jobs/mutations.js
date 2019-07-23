export default {
    TOGGLE_LOADING(state, payload) {
        state.loading_jobs = payload
    },
    TOGGLE_SHIELD(state, payload) {
        state.modal_shield = payload
    },
    // LOCUM
    SET_LOCUM_ALLOCATED_JOBS(state, payload) {
        state.locum_allocated_jobs = payload
    },
    SET_LOCUM_ALLOCATED_JOBS_COUNT(state, payload) {
        state.locum_allocated_jobs_count = payload
    },
    ADD_LOCUM_ALLOCATED_JOB(state, payload) {
        state.locum_allocated_jobs.push(payload)
        state.locum_allocated_jobs_count = state.locum_allocated_jobs_count + 1
    },
    REMOVE_LOCUM_ALLOCATED_JOB(state, payload) {
        state.locum_allocated_jobs = state.locum_allocated_jobs.filter(job => job.id !== payload)
        state.locum_allocated_jobs_count = state.locum_allocated_jobs_count - 1
    },
    SET_LOCUM_AVAILABLE_JOBS(state, payload) {
        state.locum_available_jobs = payload
    },
    SET_LOCUM_AVAILABLE_JOBS_COUNT(state, payload) {
        state.locum_available_jobs_count = payload
    },
    ADD_LOCUM_AVAILABLE_JOB(state, payload) {
        state.locum_available_jobs.push(payload)
        state.locum_available_jobs_count = state.locum_available_jobs_count + 1
    },
    REMOVE_LOCUM_AVAILABLE_JOB(state, payload) {
        state.locum_available_jobs = state.locum_available_jobs.filter(job => job.id !== payload)
        state.locum_available_jobs_count = state.locum_available_jobs_count - 1
    },
    SET_LOCUM_MATCHED_JOBS(state, payload) {
        state.locum_matched_jobs = payload
    },
    SET_LOCUM_MATCHED_JOBS_COUNT(state, payload) {
        state.locum_matched_jobs_count = payload
    },
    ADD_LOCUM_MATCHED_JOB(state, payload) {
        state.locum_matched_jobs.push(payload)
        state.locum_matched_jobs_count = state.locum_matched_jobs_count + 1
    },
    REMOVE_LOCUM_MATCHED_JOB(state, payload) {
        state.locum_matched_jobs = state.locum_matched_jobs.filter(job => job.id !== payload)
        state.locum_matched_jobs_count = state.locum_matched_jobs_count - 1
    },
    SET_LOCUM_APPLIED_JOBS(state, payload) {
        state.locum_applied_jobs = payload
    },
    SET_LOCUM_APPLIED_JOBS_COUNT(state, payload) {
        state.locum_applied_jobs_count = payload
    },
    ADD_LOCUM_APPLIED_JOB(state, payload) {
        state.locum_applied_jobs.push(payload)
        state.locum_applied_jobs_count = state.locum_applied_jobs_count + 1
    },
    REMOVE_LOCUM_APPLIED_JOB(state, payload) {
        state.locum_applied_jobs = state.locum_applied_jobs.filter(job => job.id !== payload)
        state.locum_applied_jobs_count = state.locum_applied_jobs_count - 1
    },
    SET_LOCUM_UNSUCCESSFUL_JOBS(state, payload) {
        state.locum_unsuccessful_jobs = payload
    },
    SET_LOCUM_UNSUCCESSFUL_JOBS_COUNT(state, payload) {
        state.locum_unsuccessful_jobs_count = payload
    },
    ADD_LOCUM_UNSUCCESSFUL_JOB(state, payload) {
        state.locum_unsuccessful_jobs.push(payload)
        state.locum_unsuccessful_jobs_count = state.locum_unsuccessful_jobs_count + 1
    },
    REMOVE_LOCUM_UNSUCCESSFUL_JOB(state, payload) {
        state.locum_unsuccessful_jobs = state.locum_unsuccessful_jobs.filter(job => job.id !== payload)
        state.locum_unsuccessful_jobs_count = state.locum_unsuccessful_jobs_count - 1
    },
    SET_LOCUM_DECLINED_JOBS(state, payload) {
        state.locum_declined_jobs = payload
    },
    SET_LOCUM_DECLINED_JOBS_COUNT(state, payload) {
        state.locum_declined_jobs_count = payload
    },
    ADD_LOCUM_DECLINED_JOB(state, payload) {
        state.locum_declined_jobs.push(payload)
        state.locum_declined_jobs_count = state.locum_declined_jobs_count + 1
    },
    REMOVE_LOCUM_DECLINED_JOB(state, payload) {
        state.locum_declined_jobs = state.locum_declined_jobs.filter(job => job.id !== payload)
        state.locum_declined_jobs_count = state.locum_declined_jobs_count - 1
    },
    SET_LOCUM_CANCELLED_JOBS(state, payload) {
        state.locum_cancelled_jobs = payload
    },
    SET_LOCUM_CANCELLED_JOBS_COUNT(state, payload) {
        state.locum_cancelled_jobs_count = payload
    },
    ADD_LOCUM_CANCELLED_JOB(state, payload) {
        state.locum_cancelled_jobs.push(payload)
        state.locum_cancelled_jobs_count = state.locum_cancelled_jobs_count + 1
    },
    REMOVE_LOCUM_CANCELLED_JOB(state, payload) {
        state.locum_cancelled_jobs = state.locum_cancelled_jobs.filter(job => job.id !== payload)
        state.locum_cancelled_jobs_count = state.locum_cancelled_jobs_count - 1
    },
    SET_LOCUM_COMPLETED_JOBS(state, payload) {
        state.locum_completed_jobs = payload
    },
    SET_LOCUM_COMPLETED_JOBS_COUNT(state, payload) {
        state.locum_completed_jobs_count = payload
    },
    ADD_LOCUM_COMPLETED_JOB(state, payload) {
        state.locum_completed_jobs.push(payload)
        state.locum_completed_jobs_count = state.locum_completed_jobs_count + 1
    },
    REMOVE_LOCUM_COMPLETED_JOB(state, payload) {
        state.locum_completed_jobs = state.locum_completed_jobs.filter(job => job.id !== payload)
        state.locum_completed_jobs_count = state.locum_completed_jobs_count - 1
    },
    SET_LOCUM_UNAVAILABILITIES(state, payload) {
        state.locum_unavailabilities = payload
    },
    SET_LOCUM_UNAVAILABILITIES_COUNT(state, payload) {
        state.locum_unavailabilities_count = payload
    },
}