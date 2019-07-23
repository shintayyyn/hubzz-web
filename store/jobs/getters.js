export default {
    // practice
    getPracticeAvailableJobs(state) {
        return state.practice_available_jobs
    },
    // locum
    getLocumAllocatedJobs(state) {
        return state.locum_allocated_jobs
    },
    getLocumAllocatedPrivateJobs(state) {
        return state.locum_allocated_jobs.filter(job => job.type === 'Private')
    },
    getLocumAllocatedCurrentJobs(state) {
        return state.locum_allocated_jobs.filter(job => job.type === 'Platform')
    },
    getLocumAvailableJobs(state) {
        return state.locum_available_jobs
    },
    getLocumMatchedJobs(state) {
        return state.locum_matched_jobs
    },
    getLocumAppliedJobs(state) {
        return state.locum_applied_jobs
    },
    getLocumUnsuccessfulJobs(state) {
        return state.locum_unsuccessful_jobs
    },
    getLocumDeclinedJobs(state) {
        return state.locum_declined_jobs
    },
    getLocumCancelledJobs(state) {
        return state.locum_cancelled_jobs
    },
    getLocumCompletedJobs(state) {
        return state.locum_completed_jobs
    },
    getLocumUnavailabilities(state) {
        return state.locum_unavailabilities
    },
    
}