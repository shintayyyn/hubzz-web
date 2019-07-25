export default {
    TOGGLE_LOADING(state, payload) {
        state.loading_jobs = payload
    },
    TOGGLE_SHIELD(state, payload) {
        state.modal_shield = payload
    },
    // PRACTICE
    SET_PRACTICE_AVAILABLE_JOBS(state, payload) {
        state.practice_available_jobs = payload
    },
    SET_PRACTICE_AVAILABLE_JOBS_COUNT(state, payload) {
        state.practice_available_jobs_count = payload
    },
    SET_PRACTICE_AVAILABLE_JOBS_REMINDER(state, payload) {
        state.practice_available_jobs_reminder = payload
    },
    ADD_PRACTICE_AVAILABLE_JOB(state, payload) {
        state.practice_available_jobs.push(payload)
        state.practice_available_jobs_count = state.practice_available_jobs_count + 1
    },
    REMOVE_PRACTICE_AVAILABLE_JOB(state, payload) {
        state.practice_available_jobs = state.practice_available_jobs.filter(job => job.id !== payload)
        state.practice_available_jobs_count = state.practice_available_jobs_count - 1
    },
    SET_PRACTICE_APPLIED_JOBS(state, payload) {
        state.practice_applied_jobs = payload
    },
    SET_PRACTICE_APPLIED_JOBS_COUNT(state, payload) {
        state.practice_applied_jobs_count = payload
    },
    SET_PRACTICE_APPLIED_JOBS_REMINDER(state, payload) {
        state.practice_applied_jobs_reminder = payload
    },
    REMOVE_PRACTICE_APPLIED_JOB(state, payload) {
        state.practice_applied_jobs = state.practice_applied_jobs.filter(job => job.id !== payload)
        state.practice_applied_jobs_count = state.practice_applied_jobs_count - 1
    },
    ADD_PRACTICE_APPLIED_JOB(state, payload) {
        state.practice_applied_jobs.push(payload)
        state.practice_applied_jobs_count = state.practice_applied_jobs_count + 1
    },  
    SET_PRACTICE_ALLOCATED_JOBS(state, payload) {
        state.practice_allocated_jobs = payload
    },
    SET_PRACTICE_ALLOCATED_JOBS_COUNT(state, payload) {
        state.practice_allocated_jobs_count = payload
    },
    ADD_PRACTICE_ALLOCATED_JOB(state, payload) {
        state.practice_allocated_jobs.push(payload)
    },
    // UPDATE_PRACTICE_ALLOCATED_JOB_PART(state, payload) {
    //     let jobId = payload.job.id
    //     let jobPartId = payload.id
    //     state.practice_allocated_jobs.find(allocatedJob => allocatedJob.id == jobId).job_parts.find(jobPart => jobPart.id == jobPartId).completed_at === payload.completed_at
    // },
    REMOVE_PRACTICE_ALLOCATED_JOB(state, payload) {
        state.practice_allocated_jobs = state.practice_allocated_jobs.filter(job => job.id !== payload)
        state.practice_allocated_jobs_count = state.practice_allocated_jobs_count - 1
    },
    SET_PRACTICE_COMPLETED_JOBS(state, payload) {
        state.practice_completed_jobs = payload
    },
    SET_PRACTICE_COMPLETED_JOBS_COUNT(state, payload) {
        state.practice_completed_jobs_count = payload
    },
    ADD_PRACTICE_COMPLETED_JOB(state, payload) {
        state.practice_completed_jobs.push(payload)
    },
    REMOVE_PRACTICE_COMPLETED_JOB(state, payload) {
        state.practice_completed_jobs = state.practice_completed_jobs.filter(job => job.id !== payload)
        state.practice_completed_jobs_count = state.practice_completed_jobs_count - 1
    },
    SET_PRACTICE_UNFILLED_JOBS(state, payload) {
        state.practice_unfilled_jobs = payload
    },
    SET_PRACTICE_UNFILLED_JOBS_COUNT(state, payload) {
        state.practice_unfilled_jobs_count = payload
    },
    REMOVE_PRACTICE_UNFILLED_JOB(state, payload) {
        state.practice_unfilled_jobs = state.practice_unfilled_jobs.filter(job => job.id !== payload)
        state.practice_unfilled_jobs_count = state.practice_unfilled_jobs_count - 1
    },
    SET_PRACTICE_CANCELLED_JOBS(state, payload) {
        state.practice_cancelled_jobs = payload
    },
    SET_PRACTICE_CANCELLED_JOBS_COUNT(state, payload) {
        state.practice_cancelled_jobs_count = payload
    },
    ADD_PRACTICE_CANCELLED_JOB(state, payload) {
        state.practice_cancelled_jobs.push(payload)
    },
    REMOVE_PRACTICE_CANCELLED_JOB(state, payload) {
        state.practice_cancelled_jobs = state.practice_cancelled_jobs.filter(job => job.id !== payload)
        state.practice_cancelled_jobs_count = state.practice_cancelled_jobs_count - 1
    },
    SET_PRACTICE_DECLINED_JOBS(state, payload) {
        state.practice_declined_jobs = payload
    },
    SET_PRACTICE_DECLINED_JOBS_COUNT(state, payload) {
        state.practice_declined_jobs_count = payload
    },
    ADD_PRACTICE_DECLINED_JOB(state, payload) {
        state.practice_declined_jobs.push(payload)
    },
    REMOVE_PRACTICE_DECLINED_JOB(state, payload) {
        state.practice_declined_jobs = state.practice_declined_jobs.filter(job => job.id !== payload)
        state.practice_declined_jobs_count = state.practice_declined_jobs_count - 1
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
    ADD_LOCUM_UNAVAILABILITIES(state, payload) {
        payload.forEach(data => {
            let hasUnavailable = state.locum_unavailabilities.find(item => item.id === data.id)
            if (hasUnavailable) {
              hasUnavailable.shifts = data.shifts
            } else {
              state.locum_unavailabilities.push(data)
              state.locum_unavailabilities_count = state.locum_unavailabilities_count + 1
            }
          })
    },
    UPDATE_LOCUM_UNAVAILABILITIES(state, payload) {
        let hasUnavailable = state.locum_unavailabilities.find(item => item.id === payload.id)
        hasUnavailable.shifts = payload.shifts
    },
    REMOVE_LOCUM_UNAVAILABILITIES(state, payload) {
        state.locum_unavailabilities = state.locum_unavailabilities.filter(item => item.id !== payload)
        state.locum_unavailabilities_count = state.locum_unavailabilities_count - 1
    },
}