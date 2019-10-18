export default {
    TOGGLE_LOADING(state, payload) {
        state.loading_jobs = payload
    },
    CLEAR_JOBS(state) {
        state.practice_available_jobs = []
        state.practice_applied_jobs = []
        state.practice_allocated_jobs = []
        state.practice_completed_jobs = []
        state.practice_unfilled_jobs = []
        state.practice_cancelled_jobs = []
        state.practice_declined_jobs = []
        state.locum_allocated_jobs = []
        state.locum_available_jobs = []
        state.locum_matched_jobs = []
        state.locum_applied_jobs = []
        state.locum_unsuccessful_jobs = []
        state.locum_declined_jobs = []
        state.locum_cancelled_jobs = []
        state.locum_completed_jobs = []
        state.locum_private_jobs = []
        state.locum_unavailabilities = []
        state.locum_ongoing_jobs = []
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
    ADD_PRACTICE_AVAILABLE_JOBS_REMINDER(state, payload) {
        state.practice_available_jobs_reminder.push(payload)
    },
    REMOVE_PRACTICE_AVAILABLE_JOBS_REMINDER(state, payload) {
        state.practice_available_jobs_reminder = state.practice_available_jobs_reminder.filter(job => job.id !== payload)
    },
    ADD_PRACTICE_AVAILABLE_JOB(state, payload) {
        state.practice_available_jobs.push(payload)
        state.practice_available_jobs_count = state.practice_available_jobs_count + 1
    },
    REMOVE_PRACTICE_AVAILABLE_JOB(state, payload) {
        state.practice_available_jobs = state.practice_available_jobs.filter(job => job.id !== payload)
        state.practice_available_jobs_count = state.practice_available_jobs_count - 1
    },
    ADD_PRACTICE_AVAILABLE_BADGE(state) {
        state.practice_new_available_jobs_count = state.practice_new_available_jobs_count + 1
    },
    CLEAR_PRACTICE_AVAILABLE_BADGE(state) {
        state.practice_new_available_jobs_count = 0
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
    ADD_PRACTICE_APPLIED_JOBS_REMINDER(state, payload) {
        state.practice_applied_jobs_reminder.push(payload)
    },
    REMOVE_PRACTICE_APPLIED_JOBS_REMINDER(state, payload) {
        state.practice_applied_jobs_reminder = state.practice_applied_jobs_reminder.filter(job => job.id !== payload)
    },
    REMOVE_PRACTICE_APPLIED_JOB(state, payload) {
        state.practice_applied_jobs = state.practice_applied_jobs.filter(job => job.id !== payload)
        state.practice_applied_jobs_count = state.practice_applied_jobs_count - 1
    },
    ADD_PRACTICE_APPLIED_JOB(state, payload) {
        state.practice_applied_jobs.push(payload)
        state.practice_applied_jobs_count = state.practice_applied_jobs_count + 1
    },
    ADD_PRACTICE_APPLIED_BADGE(state) {
        state.practice_new_applied_jobs_count = state.practice_new_applied_jobs_count + 1
    },
    CLEAR_PRACTICE_APPLIED_BADGE(state) {
        state.practice_new_applied_jobs_count = 0
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
    ADD_PRACTICE_ALLOCATED_BADGE(state) {
        state.practice_new_allocated_jobs_count = state.practice_new_allocated_jobs_count + 1
    },
    CLEAR_PRACTICE_ALLOCATED_BADGE(state) {
        state.practice_new_allocated_jobs_count = 0
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
    ADD_PRACTICE_COMPLETED_BADGE(state) {
        state.practice_new_completed_jobs_count = state.practice_new_completed_jobs_count + 1
    },
    CLEAR_PRACTICE_COMPLETED_BADGE(state) {
        state.practice_new_completed_jobs_count = 0
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
    ADD_PRACTICE_UNFILLED_BADGE(state) {
        state.practice_new_unfilled_jobs_count = state.practice_new_unfilled_jobs_count + 1
    },
    CLEAR_PRACTICE_UNFILLED_BADGE(state) {
        state.practice_new_unfilled_jobs_count = 0
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
    ADD_PRACTICE_CANCELLED_BADGE(state) {
        state.practice_new_cancelled_jobs_count = state.practice_new_cancelled_jobs_count + 1
    },
    CLEAR_PRACTICE_CANCELLED_BADGE(state) {
        state.practice_new_cancelled_jobs_count = 0
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
        if (state.practice_declined_jobs.find(declinedJob => declinedJob.id === payload)) {
            state.practice_declined_jobs = state.practice_declined_jobs.filter(job => job.id !== payload)
            state.practice_declined_jobs_count = state.practice_declined_jobs_count - 1
        }
    },
    ADD_PRACTICE_DECLINED_BADGE(state) {
        state.practice_new_declined_jobs_count = state.practice_new_declined_jobs_count + 1
    },
    CLEAR_PRACTICE_DECLINED_BADGE(state) {
        state.practice_new_declined_jobs_count = 0
    },
    // LOCUM
    // JOB PARTS
    SET_LOCUM_ONGOING_JOB_PARTS_COUNT(state, payload) {
        state.locum_ongoing_job_parts_count = payload
    },
    SET_LOCUM_ONGOING_JOB_PARTS(state, payload) {
        state.locum_ongoing_job_parts = payload
    },
    REMOVE_LOCUM_ONGOING_JOB_PART(state, payload) {
        state.locum_ongoing_job_parts = state.locum_ongoing_job_parts.filter(job => job.id !== payload)
        state.locum_ongoing_job_parts_count = state.locum_ongoing_job_parts_count - 1
    },
    UPDATE_LOCUM_ONGOING_JOB_PART(state, { payload, payloadIndex }) {
        let index = state.locum_ongoing_job_parts.findIndex(jobPart => jobPart.id == payload.id)
        if (index < 0) {
            state.locum_ongoing_job_parts.splice(payloadIndex, 0, payload)
        }
    },
    ADD_LOCUM_ONGOING_BADGE(state) {
        state.locum_new_ongoing_job_parts_count = state.locum_new_ongoing_job_parts_count + 1
    },
    CLEAR_LOCUM_ONGOING_BADGE(state) {
        state.locum_new_ongoing_job_parts_count = 0
    },

    SET_LOCUM_COMPLETED_JOB_PARTS_COUNT(state, payload) {
        state.locum_completed_job_parts_count = payload
    },
    SET_LOCUM_COMPLETED_JOB_PARTS(state, payload) {
        state.locum_completed_job_parts = payload
    },
    REMOVE_LOCUM_COMPLETED_JOB_PART(state, payload) {
        state.locum_completed_job_parts = state.locum_completed_job_parts.filter(job => job.id !== payload)
        state.locum_completed_job_parts_count = state.locum_completed_job_parts_count - 1
    },
    UPDATE_LOCUM_COMPLETED_JOB_PART(state, { payload, payloadIndex }) {
        let index = state.locum_completed_job_parts.findIndex(jobPart => jobPart.id == payload.id)
        if (index < 0) {
            state.locum_completed_job_parts.splice(payloadIndex, 0, payload)
        }
    },
    ADD_LOCUM_COMPLETED_BADGE(state) {
        state.locum_new_completed_job_parts_count = state.locum_new_completed_job_parts_count + 1
    },
    CLEAR_LOCUM_COMPLETED_BADGE(state) {
        state.locum_new_completed_job_parts_count = 0
    },

    SET_LOCUM_APPROVED_JOB_PARTS_COUNT(state, payload) {
        state.locum_approved_job_parts_count = payload
    },
    SET_LOCUM_APPROVED_JOB_PARTS(state, payload) {
        state.locum_approved_job_parts = payload
    },
    REMOVE_LOCUM_APPROVED_JOB_PART(state, payload) {
        state.locum_approved_job_parts = state.locum_approved_job_parts.filter(job => job.id !== payload)
        state.locum_approved_job_parts_count = state.locum_approved_job_parts_count - 1
    },
    UPDATE_LOCUM_APPROVED_JOB_PART(state, { payload, payloadIndex }) {
        let index = state.locum_approved_job_parts.findIndex(jobPart => jobPart.id == payload.id)
        if (index < 0) {
            state.locum_approved_job_parts.splice(payloadIndex, 0, payload)
        }
    },
    ADD_LOCUM_APPROVED_BADGE(state) {
        state.locum_new_approved_job_parts_count = state.locum_new_approved_job_parts_count + 1
    },
    CLEAR_LOCUM_APPROVED_BADGE(state) {
        state.locum_new_approved_job_parts_count = 0
    },


    // WHOLE JOBS
    SET_LOCUM_ALLOCATED_PART_JOBS(state, payload) {
        state.locum_allocated_part_jobs = payload
    },
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
    UPDATE_LOCUM_ALLOCATED_JOB(state, payload) {
        state.locum_allocated_jobs = state.locum_allocated_jobs.filter(job => job.id !== payload.id)
        state.locum_allocated_jobs.push(payload)
    },
    REMOVE_LOCUM_ALLOCATED_JOB(state, payload) {
        if (state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === payload)) {
            state.locum_allocated_jobs = state.locum_allocated_jobs.filter(job => job.id !== payload)
            state.locum_allocated_jobs_count = state.locum_allocated_jobs_count - 1
        }
    },
    ADD_LOCUM_ALLOCATED_BADGE(state) {
        state.locum_new_allocated_jobs_count = state.locum_new_allocated_jobs_count + 1
    },
    CLEAR_LOCUM_ALLOCATED_BADGE(state) {
        state.locum_new_allocated_jobs_count = 0
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
        if (state.locum_available_jobs.find(availableJob => availableJob.id === payload)) {
            state.locum_available_jobs = state.locum_available_jobs.filter(job => job.id !== payload)
            state.locum_available_jobs_count = state.locum_available_jobs_count - 1
        }
    },
    ADD_LOCUM_AVAILABLE_BADGE(state) {
        state.locum_new_available_jobs_count = state.locum_new_available_jobs_count + 1
    },
    CLEAR_LOCUM_AVAILABLE_BADGE(state) {
        state.locum_new_available_jobs_count = 0
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
        if (state.locum_matched_jobs.find(matchedJob => matchedJob.id === payload)) {
            state.locum_matched_jobs = state.locum_matched_jobs.filter(job => job.id !== payload)
            state.locum_matched_jobs_count = state.locum_matched_jobs_count - 1
        }
    },
    ADD_LOCUM_MATCHED_BADGE(state) {
        state.locum_new_matched_jobs_count = state.locum_new_matched_jobs_count + 1
    },
    CLEAR_LOCUM_MATCHED_BADGE(state) {
        state.locum_new_matched_jobs_count = 0
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
        if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === payload)) {
            state.locum_applied_jobs = state.locum_applied_jobs.filter(job => job.id !== payload)
            state.locum_applied_jobs_count = state.locum_applied_jobs_count - 1
        }
    },
    ADD_LOCUM_APPLIED_BADGE(state) {
        state.locum_new_applied_jobs_count = state.locum_new_applied_jobs_count + 1
    },
    CLEAR_LOCUM_APPLIED_BADGE(state) {
        state.locum_new_applied_jobs_count = 0
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
        if (state.locum_unsuccessful_jobs.find(unsuccessfulJob => unsuccessfulJob.id === payload)) {
            state.locum_unsuccessful_jobs = state.locum_unsuccessful_jobs.filter(job => job.id !== payload)
            state.locum_unsuccessful_jobs_count = state.locum_unsuccessful_jobs_count - 1
        }
    },
    ADD_LOCUM_UNSUCCESSFUL_BADGE(state) {
        state.locum_new_unsuccessful_jobs_count = state.locum_new_unsuccessful_jobs_count + 1
    },
    CLEAR_LOCUM_UNSUCCESSFUL_BADGE(state) {
        state.locum_new_unsuccessful_jobs_count = 0
    },
    SET_LOCUM_DECLINED_JOBS(state, payload) {
        state.locum_declined_jobs = payload
    },
    SET_LOCUM_DECLINED_JOBS_COUNT(state, payload) {
        state.locum_declined_jobs_count = payload
    },
    ADD_LOCUM_DECLINED_JOB(state, payload) {
        if (!state.locum_declined_jobs.find(declinedJob => declinedJob.id === payload.id)) {
            state.locum_declined_jobs.push(payload)
            state.locum_declined_jobs_count = state.locum_declined_jobs_count + 1
        }
    },
    REMOVE_LOCUM_DECLINED_JOB(state, payload) {
        if (state.locum_declined_jobs.find(declinedJob => declinedJob.id === payload)) {
            state.locum_declined_jobs = state.locum_declined_jobs.filter(job => job.id !== payload)
            state.locum_declined_jobs_count = state.locum_declined_jobs_count - 1
        }
    },
    ADD_LOCUM_DECLINED_BADGE(state) {
        state.locum_new_declined_jobs_count = state.locum_new_declined_jobs_count + 1
    },
    CLEAR_LOCUM_DECLINED_BADGE(state) {
        state.locum_new_declined_jobs_count = 0
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
        if (state.locum_cancelled_jobs.find(declinedJob => declinedJob.id === payload)) {
            state.locum_cancelled_jobs = state.locum_cancelled_jobs.filter(job => job.id !== payload)
            state.locum_cancelled_jobs_count = state.locum_cancelled_jobs_count - 1
        }
    },
    ADD_LOCUM_CANCELLED_BADGE(state) {
        state.locum_new_cancelled_jobs_count = state.locum_new_cancelled_jobs_count + 1
    },
    CLEAR_LOCUM_CANCELLED_BADGE(state) {
        state.locum_new_cancelled_jobs_count = 0
    },
    SET_LOCUM_WITHDRAWN_JOBS(state, payload) {
        state.locum_withdrawn_jobs = payload
    },
    SET_LOCUM_WITHDRAWN_JOBS_COUNT(state, payload) {
        state.locum_withdrawn_jobs_count = payload
    },
    ADD_LOCUM_WITHDRAWN_BADGE(state) {
        state.locum_new_withdrawn_jobs_count = state.locum_new_withdrawn_jobs_count + 1
    },
    CLEAR_LOCUM_WITHDRAWN_BADGE(state) {
        state.locum_new_withdrawn_jobs_count = 0
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
        if (state.locum_completed_jobs.find(declinedJob => declinedJob.id === payload)) {
            state.locum_completed_jobs = state.locum_completed_jobs.filter(job => job.id !== payload)
            state.locum_completed_jobs_count = state.locum_completed_jobs_count - 1
        }
    },
    ADD_LOCUM_COMPLETED_BADGE(state) {
        state.locum_new_completed_jobs_count = state.locum_new_completed_jobs_count + 1
    },
    CLEAR_LOCUM_COMPLETED_BADGE(state) {
        state.locum_new_completed_jobs_count = 0
    },
    SET_LOCUM_APPROVED_JOBS(state, payload) {
        state.locum_approved_jobs = payload
    },
    SET_LOCUM_APPROVED_JOBS_COUNT(state, payload) {
        state.locum_approved_jobs_count = payload
    },
    ADD_LOCUM_APPROVED_BADGE(state) {
        state.locum_new_approved_jobs_count = state.locum_new_approved_jobs_count + 1
    },
    CLEAR_LOCUM_APPROVED_BADGE(state) {
        state.locum_new_approved_jobs_count = 0
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
        if (state.locum_unavailabilities.find(declinedJob => declinedJob.id === payload)) {
            state.locum_unavailabilities = state.locum_unavailabilities.filter(item => item.id !== payload)
            state.locum_unavailabilities_count = state.locum_unavailabilities_count - 1
        }
    },
}