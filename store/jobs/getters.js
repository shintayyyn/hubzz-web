export default {
    // practice
    getPracticeAvailableJobs(state) {
        return state.practice_available_jobs
    },
    getPracticeAvailableJobsReminder(state) {
        return state.practice_available_jobs_reminder
    },
    getPracticeAppliedJobs(state) {
        return state.practice_applied_jobs
    },
    getPracticeAppliedJobsReminder(state) {
        return state.practice_applied_jobs_reminder
    },
    getPracticeAllocatedJobs(state) {
        return state.practice_allocated_jobs
    },
    getPracticeCompletedJobs(state) {
        return state.practice_completed_jobs
    },
    getPracticeUnfilledJobs(state) {
        return state.practice_unfilled_jobs
    },
    getPracticeCancelledJobs(state) {
        return state.practice_cancelled_jobs
    },
    getPracticeDeclinedJobs(state) {
        return state.practice_declined_jobs
    },
    getPracticeJobsBadge(state) {
        return [
            state.practice_new_allocated_jobs_count, state.practice_new_available_jobs_count, state.practice_new_applied_jobs_count,
            state.practice_new_unfilled_jobs_count, state.practice_new_declined_jobs_count,
            state.practice_new_cancelled_jobs_count, state.practice_new_completed_jobs_count
        ].reduce((accumulator, currentValue) => accumulator + currentValue)
    },
    // locum
    getLocumOngoingJobs(state) {
        return state.locum_ongoing_jobs
    },
    getLocumAllocatedPartJobs(state) {
        return state.locum_allocated_part_jobs
    },
    getLocumAllocatedPrivateJobs(state) {
        return state.locum_allocated_jobs.filter(job => job.type === 'Private')
    },
    getLocumAllocatedPlatformJobs(state) {
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
    getLocumWithdrawnJobs(state) {
        return state.locum_withdrawn_jobs
    },
    getLocumCompletedJobs(state) {
        return state.locum_completed_jobs
    },
    getLocumApprovedJobs(state) {
        return state.locum_approved_jobs
    },
    getLocumUnavailabilities(state) {
        return state.locum_unavailabilities
    },
    getLocumJobsBadge(state) {
        return [
            state.locum_new_allocated_jobs_count, state.locum_new_available_jobs_count,
            state.locum_new_matched_jobs_count, state.locum_new_applied_jobs_count,
            state.locum_new_unsuccessful_jobs_count, state.locum_new_declined_jobs_count,
            state.locum_new_cancelled_jobs_count, state.locum_new_completed_jobs_count,
            state.locum_new_ongoing_jobs_count, state.locum_new_approved_jobs_count,
        ].reduce((accumulator, currentValue) => accumulator + currentValue)
    }
}   