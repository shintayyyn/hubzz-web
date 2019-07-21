export default {
    TOGGLE_LOADING(state, payload) {
        state.loading_jobs = payload
    },
    // LOCUM
    SET_LOCUM_ALLOCATED_JOBS(state, payload) {
        state.locum_allocated_jobs = payload
    },
    SET_LOCUM_ALLOCATED_JOBS_COUNT(state, payload) {
        state.locum_allocated_jobs_count = payload
    },
    SET_LOCUM_AVAILABLE_JOBS(state, payload) {
        state.locum_available_jobs = payload
    },
    SET_LOCUM_MATCHED_JOBS(state, payload) {
        state.locum_matched_jobs = payload
    },
    SET_LOCUM_APPLIED_JOBS(state, payload) {
        state.locum_applied_jobs = payload
    },
    SET_LOCUM_UNSUCCESSFULL_JOBS(state, payload) {
        state.locum_unsuccessfull_jobs = payload
    },
    SET_LOCUM_DECLINED_JOBS(state, payload) {
        state.locum_declined_jobs = payload
    },
    SET_LOCUM_CANCELLED_JOBS(state, payload) {
        state.locum_cancelled_jobs = payload
    },
    SET_LOCUM_COMPLETED_JOBS(state, payload) {
        state.locum_completed_jobs = payload
    },
    SET_LOCUM_PRIVATE_JOBS(state, payload) {
        state.locum_private_jobs = payload
    },
    SET_LOCUM_UNAVAILABILITIES(state, payload) {
        state.locum_unavailabilities = payload
    },
}