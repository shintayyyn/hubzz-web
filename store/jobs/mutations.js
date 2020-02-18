export default {
    TOGGLE_LOADING(state, payload) {
        state.loading_jobs = payload
    },
    CLEAR_JOBS(state) {
        // PRACTICE
        // parts
        state.practice_allocated_job_parts = [],
            state.practice_ongoing_job_parts = [],
            state.practice_completed_job_parts = [],
            state.practice_approved_job_parts = [],
            state.practice_cancelled_job_parts = [],
            state.practice_withdrawn_job_parts = [],
            // whole
            state.practice_pending_jobs = [],
            state.practice_allocated_jobs = [],
            state.practice_available_jobs = [],
            state.practice_applied_jobs = [],
            state.practice_unfilled_jobs = [],
            state.practice_declined_jobs = [],
            state.practice_cancelled_jobs = [],
            state.practice_withdrawn_jobs = [],
            // LOCUM
            // parts
            state.locum_allocated_job_parts = [],
            state.locum_ongoing_job_parts = [],
            state.locum_completed_job_parts = [],
            state.locum_approved_job_parts = [],
            // whole
            state.locum_allocated_jobs = [],
            state.locum_available_jobs = [],
            state.locum_matched_jobs = [],
            state.locum_applied_jobs = [],
            state.locum_unsuccessful_jobs = [],
            state.locum_declined_jobs = [],
            state.locum_cancelled_jobs = [],
            state.locum_withdrawn_jobs = [],
            state.locum_unavailabilities = []
    },
    // PRACTICE
    // NOTIF
    ADD_PRACTICE_JOB_NOTIFICATION(state, payload) {
        let index = state.practice_job_notifications.findIndex(jobNotif => jobNotif.id === payload.id)
        if (index < 0) {
            state.practice_job_notifications.unshift(payload)
        } else if (index >= 0) {
            state.practice_job_notifications.splice(index, 1, payload)
        }
    },
    REMOVE_PRACTICE_JOB_NOTIFICATION(state, payload) {
        state.practice_job_notifications = state.practice_job_notifications.filter(job => job.id !== payload)
    },
    CLEAR_PRACTICE_JOB_NOTIFICATION(state) {
        state.practice_job_notifications = []
    },
    // PARTS
    SET_PRACTICE_ONGOING_JOB_PARTS_COUNT(state, payload) {
        state.practice_ongoing_job_parts_count = payload
    },
    SET_PRACTICE_ONGOING_JOB_PARTS(state, payload) {
        state.practice_ongoing_job_parts = payload
    },
    ADD_PRACTICE_ONGOING_JOB(state, payload) {
        state.practice_ongoing_job_parts.push(payload)
    },
    REMOVE_PRACTICE_ONGOING_JOB_PART(state, payload) {
        state.practice_ongoing_job_parts = state.practice_ongoing_job_parts.filter(job => job.id !== payload)
        state.practice_ongoing_job_parts_count = state.practice_ongoing_job_parts_count - 1
    },
    UPDATE_PRACTICE_ONGOING_JOB_PART(state, { payload, payloadIndex }) {
        let index = state.practice_ongoing_job_parts.findIndex(jobPart => jobPart.id == payload.id)
        if (index < 0) {
            state.practice_ongoing_job_parts.splice(payloadIndex, 0, payload)
        }
    },

    SET_PRACTICE_COMPLETED_JOB_PARTS(state, payload) {
        state.practice_completed_job_parts = payload
    },
    SET_PRACTICE_COMPLETED_JOB_PARTS_COUNT(state, payload) {
        state.practice_completed_job_parts_count = payload
    },
    ADD_PRACTICE_COMPLETED_JOB_PART(state, payload) {
        state.practice_completed_job_parts.push(payload)
        state.practice_completed_job_parts_count = state.practice_completed_job_parts_count + 1
    },
    REMOVE_PRACTICE_COMPLETED_JOB_PART(state, payload) {
        state.practice_completed_job_parts = state.practice_completed_job_parts.filter(job => job.id !== payload)
        state.practice_completed_job_parts_count = state.practice_completed_job_parts_count - 1
    },
    UPDATE_PRACTICE_COMPLETED_JOB_PART(state, { payload, payloadIndex }) {
        let index = state.practice_completed_job_parts.findIndex(jobPart => jobPart.id == payload.id)
        if (index < 0) {
            state.practice_completed_job_parts.splice(payloadIndex, 0, payload)
        }
    },

    SET_PRACTICE_APPROVED_JOB_PARTS_COUNT(state, payload) {
        state.practice_approved_job_parts_count = payload
    },
    SET_PRACTICE_APPROVED_JOB_PARTS(state, payload) {
        state.practice_approved_job_parts = payload
    },
    ADD_PRACTICE_APPROVED_JOB(state, payload) {
        state.practice_approved_job_parts.push(payload)
    },
    REMOVE_PRACTICE_APPROVED_JOB_PART(state, payload) {
        state.practice_approved_job_parts = state.practice_approved_job_parts.filter(job => job.id !== payload)
        state.practice_approved_job_parts_count = state.practice_approved_job_parts_count - 1
    },
    UPDATE_PRACTICE_APPROVED_JOB_PART(state, { payload, payloadIndex }) {
        let index = state.practice_approved_job_parts.findIndex(jobPart => jobPart.id == payload.id)
        if (index < 0) {
            state.practice_approved_job_parts.splice(payloadIndex, 0, payload)
        }
    },

    SET_PRACTICE_ALLOCATED_JOB_PARTS_COUNT(state, payload) {
        state.practice_allocated_job_parts_count = payload
    },
    SET_PRACTICE_ALLOCATED_JOB_PARTS(state, payload) {
        state.practice_allocated_job_parts = payload
    },
    REMOVE_PRACTICE_ALLOCATED_JOB_PART(state, payload) {
        state.practice_allocated_job_parts = state.practice_allocated_job_parts.filter(job => job.id !== payload)
        state.practice_allocated_job_parts_count = state.practice_allocated_job_parts_count - 1
    },
    UPDATE_PRACTICE_ALLOCATED_JOB_PART(state, { payload, payloadIndex }) {
        let index = state.practice_allocated_job_parts.findIndex(jobPart => jobPart.id == payload.id)
        if (index < 0) {
            state.practice_allocated_job_parts.splice(payloadIndex, 0, payload)
        }
    },

    SET_PRACTICE_CANCELLED_JOB_PARTS_COUNT(state, payload) {
        state.practice_cancelled_job_parts_count = payload
    },
    SET_PRACTICE_CANCELLED_JOB_PARTS(state, payload) {
        state.practice_cancelled_job_parts = payload
    },

    SET_PRACTICE_WITHDRAWN_JOB_PARTS_COUNT(state, payload) {
        state.practice_withdrawn_job_parts_count = payload
    },
    SET_PRACTICE_WITHDRAWN_JOB_PARTS(state, payload) {
        state.practice_withdrawn_job_parts = payload
    },

    // WHOLE
    SET_PRACTICE_PENDING_JOBS(state, payload) {
        state.practice_pending_jobs = payload
    },
    SET_PRACTICE_PENDING_JOBS_COUNT(state, payload) {
        state.practice_pending_jobs_count = payload
    },
    SET_PRACTICE_PENDING_JOBS_REMINDER(state, payload) {
        state.practice_pending_jobs_reminder = payload
    },
    ADD_PRACTICE_PENDING_JOB(state, payload) {
        state.practice_pending_jobs.push(payload)
        state.practice_pending_jobs_count = state.practice_pending_jobs_count + 1
    },
    REMOVE_PRACTICE_PENDING_JOB(state, payload) {
        state.practice_pending_jobs = state.practice_pending_jobs.filter(job => job.id !== payload)
        state.practice_pending_jobs_count = state.practice_pending_jobs_count - 1
    },
    UPDATE_PRACTICE_PENDING_JOB(state, { newJob, oldJob }) {
        let index = state.practice_pending_jobs.findIndex(pendingJob => pendingJob.id === oldJob.id)
        if (index >= 0) {
            state.practice_pending_jobs.splice(index, 1, newJob)
        }
    },

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
    UPDATE_PRACTICE_AVAILABLE_JOB(state, { newJob, oldJob }) {
        let index = state.practice_available_jobs.findIndex(availableJob => availableJob.id === oldJob.id)
        if (index >= 0) {
            state.practice_available_jobs.splice(index, 1, newJob)
        }
    },

    SET_PRACTICE_APPLIED_JOBS(state, payload) {
        state.practice_applied_jobs = payload
    },
    SET_PRACTICE_APPLIED_JOBS_COUNT(state, payload) {
        state.practice_applied_jobs_count = payload
    },
    REMOVE_PRACTICE_APPLIED_JOB(state, payload) {
        state.practice_applied_jobs = state.practice_applied_jobs.filter(job => job.id !== payload)
        state.practice_applied_jobs_count = state.practice_applied_jobs_count - 1
    },
    ADD_PRACTICE_APPLIED_JOB(state, payload) {
        state.practice_applied_jobs.push(payload)
        state.practice_applied_jobs_count = state.practice_applied_jobs_count + 1
    },
    UPDATE_PRACTICE_APPLIED_JOB(state, { newJob, oldJob }) {
        let index = state.practice_applied_jobs.findIndex(appliedJob => appliedJob.id === oldJob.id)
        if (index >= 0) {
            state.practice_applied_jobs.splice(index, 1, newJob)
        }
    },

    SET_PRACTICE_ALLOCATED_JOBS(state, payload) {
        state.practice_allocated_jobs = payload
    },
    SET_PRACTICE_ALLOCATED_JOBS_COUNT(state, payload) {
        state.practice_allocated_jobs_count = payload
    },
    ADD_PRACTICE_ALLOCATED_JOB(state, payload) {
        state.practice_allocated_jobs.push(payload)
        state.practice_allocated_jobs_count = state.practice_allocated_jobs_count + 1
    },
    UPDATE_PRACTICE_ALLOCATED_JOB(state, { newJob, oldJob }) {
        let index = state.practice_allocated_jobs.findIndex(allocatedJob => allocatedJob.id === oldJob.id)
        if (index >= 0) {
            state.practice_allocated_jobs.splice(index, 1, newJob)
        }
    },
    REMOVE_PRACTICE_ALLOCATED_JOB(state, payload) {
        state.practice_allocated_jobs = state.practice_allocated_jobs.filter(job => job.id !== payload)
        state.practice_allocated_jobs_count = state.practice_allocated_jobs_count - 1
    },

    SET_PRACTICE_COMPLETED_JOBS(state, payload) {
        state.practice_completed_jobs = payload
    },
    SET_PRACTICE_COMPLETED_JOBS_COUNT(state, payload) {
        state.practice_completed_job_parts_count = payload
    },
    ADD_PRACTICE_COMPLETED_JOB(state, payload) {
        state.practice_completed_jobs.push(payload)
        state.state.practice_completed_job_parts_count = state.state.practice_completed_job_parts_count + 1
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

    // SET_PRACTICE_CANCELLED_JOBS(state, payload) {
    //     state.practice_cancelled_jobs = payload
    // },
    // SET_PRACTICE_CANCELLED_JOBS_COUNT(state, payload) {
    //     state.practice_cancelled_jobs_count = payload
    // },
    ADD_PRACTICE_CANCELLED_JOB(state, payload) {
        state.practice_cancelled_jobs.push(payload)
        state.practice_cancelled_jobs_count = state.practice_cancelled_jobs_count + 1
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
        state.practice_declined_jobs_count = state.practice_declined_jobs_count + 1
    },
    REMOVE_PRACTICE_DECLINED_JOB(state, payload) {
        if (state.practice_declined_jobs.find(declinedJob => declinedJob.id === payload)) {
            state.practice_declined_jobs = state.practice_declined_jobs.filter(job => job.id !== payload)
            state.practice_declined_jobs_count = state.practice_declined_jobs_count - 1
        }
    },

    SET_PRACTICE_WITHDRAWN_JOBS(state, payload) {
        state.practice_withdrawn_jobs = payload
    },
    SET_PRACTICE_WITHDRAWN_JOBS_COUNT(state, payload) {
        state.practice_withdrawn_jobs_count = payload
    },
    // ADD_PRACTICE_WITHDRAWN_JOB(state, payload) {
    //     state.practice_withdrawn_jobs.push(payload)
    // },
    // REMOVE_PRACTICE_WITHDRAWN_JOB(state, payload) {
    //     if (state.practice_withdrawn_jobs.find(declinedJob => declinedJob.id === payload)) {
    //         state.practice_withdrawn_jobs = state.practice_withdrawn_jobs.filter(job => job.id !== payload)
    //         state.practice_withdrawn_jobs_count = state.practice_withdrawn_jobs_count - 1
    //     }
    // },

    // REMINDERS
    ADD_PRACTICE_AVAILABLE_JOBS_REMINDER(state, payload) {
        state.practice_available_jobs_reminder.push(payload)
    },
    REMOVE_PRACTICE_AVAILABLE_JOBS_REMINDER(state, payload) {
        state.practice_available_jobs_reminder = state.practice_available_jobs_reminder.filter(job => job.id !== payload)
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


    // LOCUM
    // NOTIF
    ADD_LOCUM_JOB_NOTIFICATION(state, payload) {
        let index = state.locum_job_notifications.findIndex(jobNotif => jobNotif.id === payload.id)
        if (index < 0) {
            state.locum_job_notifications.unshift(payload)
        } else if (index >= 0) {
            state.locum_job_notifications.splice(index, 1, payload)
        }
    },
    REMOVE_LOCUM_JOB_NOTIFICATION(state, payload) {
        state.locum_job_notifications = state.locum_job_notifications.filter(job => job.id !== payload)
    },
    CLEAR_LOCUM_JOB_NOTIFICATION(state) {
        state.locum_job_notifications = []
    },
    // PARTS
    SET_LOCUM_ALLOCATED_JOB_PARTS_COUNT(state, payload) {
        state.locum_allocated_job_parts_count = payload
    },
    SET_LOCUM_ALLOCATED_JOB_PARTS(state, payload) {
        state.locum_allocated_job_parts = payload
    },
    ADD_LOCUM_ALLOCATED_JOB_PART(state, payload) {
        state.locum_allocated_job_parts.push(payload)
    },
    REMOVE_LOCUM_ALLOCATED_JOB_PART(state, payload) {
        state.locum_allocated_job_parts = state.locum_allocated_job_parts.filter(job => job.id !== payload)
        state.locum_allocated_job_parts_count = state.locum_allocated_job_parts_count - 1
    },
    // UPDATE_LOCUM_ALLOCATED_JOB_PART(state, { payload, payloadIndex }) {
    //     let index = state.locum_allocated_job_parts.findIndex(jobPart => jobPart.id == payload.id)
    //     if (index < 0) {
    //         state.locum_allocated_job_parts.splice(payloadIndex, 0, payload)
    //     }
    // },

    SET_LOCUM_ONGOING_JOB_PARTS_COUNT(state, payload) {
        state.locum_ongoing_job_parts_count = payload
    },
    SET_LOCUM_ONGOING_JOB_PARTS(state, payload) {
        state.locum_ongoing_job_parts = payload
    },
    ADD_LOCUM_ONGOING_JOB_PART(state, payload) {
        state.locum_ongoing_job_parts.push(payload)
    },
    REMOVE_LOCUM_ONGOING_JOB_PART(state, payload) {
        state.locum_ongoing_job_parts = state.locum_ongoing_job_parts.filter(job => job.id !== payload)
    },
    // UPDATE_LOCUM_ONGOING_JOB_PART(state, payload) {
    //     let index = state.locum_ongoing_job_parts.findIndex(jobPart => jobPart.id === payload.id)
    //     if (index >= 0) {
    //         state.locum_ongoing_job_parts.splice(index, 1, payload)
    //     }
    // },

    SET_LOCUM_COMPLETED_JOB_PARTS_COUNT(state, payload) {
        state.locum_completed_job_parts_count = payload
    },
    SET_LOCUM_COMPLETED_JOB_PARTS(state, payload) {
        state.locum_completed_job_parts = payload
    },
    ADD_LOCUM_COMPLETED_JOB_PART(state, payload) {
        state.locum_completed_job_parts.push(payload)
    },
    REMOVE_LOCUM_COMPLETED_JOB_PART(state, payload) {
        state.locum_completed_job_parts = state.locum_completed_job_parts.filter(job => job.id !== payload)
    },
    // UPDATE_LOCUM_COMPLETED_JOB_PART(state, payload) {
    //     let index = state.locum_completed_job_parts.findIndex(jobPart => jobPart.id === payload.id)
    //     if (index >= 0) {
    //         state.locum_completed_job_parts = state.locum_completed_job_parts.splice(index, 1, payload)
    //     }
    // },

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
    // UPDATE_LOCUM_APPROVED_JOB_PART(state, { payload, payloadIndex }) {
    //     let index = state.locum_approved_job_parts.findIndex(jobPart => jobPart.id == payload.id)
    //     if (index < 0) {
    //         state.locum_approved_job_parts.splice(payloadIndex, 0, payload)
    //     }
    // },

    SET_PRACTICE_CANCELLED_JOB_PARTS_COUNT(state, payload) {
        state.practice_cancelled_job_parts_count = payload
    },
    SET_PRACTICE_CANCELLED_JOB_PARTS(state, payload) {
        state.practice_cancelled_job_parts = payload
    },

    SET_PRACTICE_WITHDRAWN_JOB_PARTS_COUNT(state, payload) {
        state.practice_withdrawn_job_parts_count = payload
    },
    SET_PRACTICE_WITHDRAWN_JOB_PARTS(state, payload) {
        state.practice_withdrawn_job_parts = payload
    },

    // WHOLE
    SET_LOCUM_ALLOCATED_JOBS(state, payload) {
        state.locum_allocated_jobs = payload
    },
    SET_LOCUM_ALLOCATED_JOBS_COUNT(state, payload) {
        state.locum_allocated_jobs_count = payload
    },
    ADD_LOCUM_ALLOCATED_JOB(state, payload) {
        state.locum_allocated_jobs.push(payload)
    },
    UPDATE_LOCUM_ALLOCATED_JOB(state, payload) {
        let index = state.locum_allocated_jobs.findIndex(allocatedJob => allocatedJob.id === payload.id)
        if (index >= 0) {
            state.locum_allocated_jobs.splice(index, 1, payload)
        }
    },
    REMOVE_LOCUM_ALLOCATED_JOB(state, payload) {
        state.locum_allocated_jobs = state.locum_allocated_jobs.filter(job => job.id !== payload)
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

    SET_LOCUM_WITHDRAWN_JOBS(state, payload) {
        state.locum_withdrawn_jobs = payload
    },
    SET_LOCUM_WITHDRAWN_JOBS_COUNT(state, payload) {
        state.locum_withdrawn_jobs_count = payload
    },

    // UNAVAILABILITIES
    SET_LOCUM_UNAVAILABILITIES(state, payload) {
        state.locum_unavailabilities = payload
    },
    // SET_LOCUM_UNAVAILABILITIES_COUNT(state, payload) {
    //     state.locum_unavailabilities_count = payload
    // },
    ADD_LOCUM_UNAVAILABILITIES(state, payload) {
        payload.forEach(unavailability => {
            let hasUnavailable = state.locum_unavailabilities.find(item => item.id === unavailability.id)
            if (hasUnavailable) {
                hasUnavailable.shifts = unavailability.shifts
            } else {
                state.locum_unavailabilities.push(unavailability)
            }
        })
    },
    UPDATE_LOCUM_UNAVAILABILITIES(state, payload) {
        let hasUnavailable = state.locum_unavailabilities.find(item => item.id === payload.id)
        hasUnavailable.shifts = payload.shifts
    },
    REMOVE_LOCUM_UNAVAILABILITIES(state, payload) {
        // if (state.locum_unavailabilities.find(declinedJob => declinedJob.id === payload)) {
        state.locum_unavailabilities = state.locum_unavailabilities.filter(item => item.id !== payload)
        // state.locum_unavailabilities_count = state.locum_unavailabilities_count - 1
        // }
    },

    // PRIVATE
    SET_LOCUM_PRIVATE_JOBS(state, payload) {
        state.locum_private_jobs = payload
    },
    SET_LOCUM_PRIVATE_JOBS_COUNT(state, payload) {
        state.locum_private_jobs_count = payload
    },
}