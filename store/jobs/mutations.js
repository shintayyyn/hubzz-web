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
        console.log('test', index, state.practice_job_notifications, payload)
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

    // SET_PRACTICE_CANCELLED_JOBS (state, payload) {
    //     state.practice_cancelled_jobs = payload
    // },
    // SET_PRACTICE_CANCELLED_JOBS_COUNT (state, payload) {
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
    // ADD_PRACTICE_WITHDRAWN_JOB (state, payload) {
    //     state.practice_withdrawn_jobs.push(payload)
    // },
    // REMOVE_PRACTICE_WITHDRAWN_JOB (state, payload) {
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
    SET_AUTH_DOMAIN(state, payload) {
        state.domain = payload
    },
    SET_UNSEEN_NOTIFICATIONS(state, payload) {
        state.unseen_notification = payload
    },
    ADD_UNSEEN_NOTIFICATIONS(state, payload) {
        state.unseen_notification += 1
    },
    REMOVE_UNSEEN_NOTIFICATIONS(state, payload) {
        state.unseen_notification -= payload ? payload : 1
    },
    SEEN_NOTIFICATION(state, payload) {
        let notification = state.locum_notifications.find(item => item.id === payload)
        notification.seen = true
        state.unseen_notification -= 1
    },
    READ_ALL_NOTIFICATION(state, payload) {
        let unread_notifications = state.locum_notifications.filter(item => !item.seen)
        unread_notifications.forEach(notif => notif.seen = true)
        state.unseen_notification = 0
    },
    SET_NOTIFICATIONS(state, payload) {
        state.locum_notifications = payload
    },
    ADD_NOTIFICATION(state, payload) {
        let hasAdded = state.locum_notifications.find(item => item.id === payload.id)
        console.log("hasAdded", hasAdded)
        if (hasAdded) return
        let billing_types = [
            `${state.domain} Notification Locum Invoice Created`,
            `${state.domain} Notification Locum Invoice Updated`,
            `${state.domain} ${state.domain === 'Locum' ? 'Notification' : ''} Locum Invoice Paid`
        ];
        payload.forEach(notif => {
            let message = ""
            if (state.domain === "Locum") {
                switch (notif.notification_type.name) {
                    case 'Locum Notification Job Reminder':
                        if (days > 0) {
                            message = `This Job will start in ${days} ${days === 1 ? 'day' : 'days'}.`
                        } else if (days <= 0 && hours > 0) {
                            message = `This Job will start in ${hours} ${hours === 1 ? 'hour' : 'hours'}.`
                        } else if (hours <= 0 && minutes > 0) {
                            message = `This Job will start in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`
                        } else {
                            message = `This Job will start later.`
                        }
                        break
                    case 'Locum Notification Job Available':
                        message = 'There is a new available job for you.'
                        break
                    case 'Locum Notification Job Applied':
                        message = 'Successfully applied for this Job.'
                        break
                    case 'Locum Notification Job Matched':
                        message = 'There is a new job that matched your qualifications.'
                        break
                    case 'Locum Notification Job Unsuccessful':
                        message = 'Your application for this job is unsuccessful'
                        break
                    case 'Locum Notification Job Current':
                        message = 'You have been appointed to this job.'
                        break
                    case 'Locum Notification Job Ongoing':
                        message = 'Your Job has started.'
                        break
                    case 'Locum Notification Job Part Completed':
                        message = 'This part of your job has been completed'
                        break
                    case 'Locum Notification Job Completed':
                        message = 'This job has been completed'
                        break
                    case 'Locum Notification Job Approved':
                        message = 'This part of your job has been approved'
                        break
                    case 'Locum Notification Job Disputed':
                        message = 'This part of your job has been disputed'
                        break
                    case 'Locum Notification Job Cancelled':
                        message = 'Your job has been cancelled by your practice'
                        break
                    case 'Locum Notification Job Amended':
                        message = 'This job has been updated by your practice'
                        break
                    case 'Locum Notification Job Declined':
                        message = 'You successfully leave this job.'
                        break
                    case 'Locum Notification Job Terminated':
                        message = 'This Job has been terminated.'
                        break
                    case 'Locum Notification Job Unqualified':
                        message = 'You are not qualified anymore on this job.'
                        break
                    default:
                        message = ''
                }
            } else if (state.domain === 'Practice') {
                switch (notif.notification_type.name) {
                    case 'Practice Notification Job Reminder':
                        if (days > 0) {
                            message = `This Job will start in ${days} ${days === 1 ? 'day' : 'days'}.`
                        } else if (days <= 0 && hours > 0) {
                            message = `This Job will start in ${hours} ${hours === 1 ? 'hour' : 'hours'}.`
                        } else if (hours <= 0 && minutes > 0) {
                            message = `This Job will start in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`
                        } else {
                            message = `This Job will start later.`
                        }
                        break
                    case 'Practice Notification Job Live':
                        message = 'This job is now live.'
                        break
                    case 'Practice Notification Job Application':
                        message = 'Someone applied to this job.'
                        break
                    case 'Practice Notification Job Application Cancelled':
                        message = 'Someone cancelled his/her application to this job.'
                        break
                    case 'Practice Notification Job Current':
                        message = 'A locum has been appointed to this job.'
                        break
                    case 'Practice Notification Job Ongoing':
                        message = 'This Job has started.'
                        break
                    case 'Practice Notification Job Part Completed':
                        message = 'This part of your job has been completed'
                        break
                    case 'Practice Notification Job Completed':
                        message = 'This job has been completed'
                        break
                    case 'Practice Notification Job Approved':
                        message = 'This part of your job has been approved'
                        break
                    case 'Practice Notification Job Disputed':
                        message = 'This part of your job has been disputed'
                        break
                    case 'Practice Notification Job Cancelled':
                        message = 'This job has been cancelled.'
                        break
                    case 'Practice Notification Job Amended':
                        message = 'This job has been updated'
                        break
                    case 'Practice Notification Job Declined':
                        message = 'The locum leave this job.'
                        break
                    case 'Practice Notification Job Update Accept':
                        message = 'The locum accepted your changes on this job.'
                        break
                    case 'Practice Notification Job Unfilled Warning':
                        if (days > 0) {
                            message = `This Job will start in ${days} ${days === 1 ? 'day' : 'days'}.`
                        } else if (days <= 0 && hours > 0) {
                            message = `This Job will start in ${hours} ${hours === 1 ? 'hour' : 'hours'}.`
                        } else if (hours <= 0 && minutes > 0) {
                            message = `This Job will start in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`
                        } else {
                            message = `This Job will start later.`
                        }
                        break
                    case 'Practice Notification Job Unfilled':
                        message = 'This job is unfilled.'
                        break
                }
            }
            state.locum_notifications.push(
                {
                    ...notif,
                    message: message,
                    type: billing_types.includes(notif.notification_type.name)
                        ? "Billing"
                        : "Job"
                }
            )

        })
        state.locum_notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    REMOVE_LOCUM_NOTIFICATION(state, payload) {
        state.locum_notifications = state.locum_notifications.filter(job => job.id !== payload)
    },
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
    // UPDATE_LOCUM_ONGOING_JOB_PART (state, payload) {
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
    // UPDATE_LOCUM_COMPLETED_JOB_PART (state, payload) {
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
    // UPDATE_LOCUM_APPROVED_JOB_PART (state, { payload, payloadIndex }) {
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

    SET_PRACTICE_HUB_SPOKE_JOB_COUNT(state, payload) {
        state.practice_hub_spoke_jobs_count = payload
    },
    SET_PRACTICE_HUB_SPOKE_JOB(state, payload) {
        state.practice_hub_spoke_jobs = payload
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

    SET_LOCUM_APPLIED_JOB_PARTS(state, payload) {
        state.locum_applied_job_parts = payload
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

    SET_LOCUM_BANK_JOBS(state, payload) {
        state.locum_bank_jobs = payload
    },
    SET_LOCUM_BANK_JOBS_COUNT(state, payload) {
        state.locum_bank_jobs_count = payload
    },
    ADD_LOCUM_BANK_JOB(state, payload) {
        state.locum_bank_jobs.push(payload)
        state.locum_bank_jobs_count = state.locum_bank_jobs_count + 1
    },
    REMOVE_LOCUM_BANK_JOB(state, payload) {
        state.locum_bank_jobs = state.locum_bank_jobs.filter(job => job.id !== payload)
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

    // 
    SET_LOCUM_PERMANENT_JOBS(state, payload) {
        state.locum_permanent_jobs = payload
    },
    SET_LOCUM_PERMANENT_JOBS_COUNT(state, payload) {
        state.locum_permanent_jobs_count = payload
    },

    // UNAVAILABILITIES
    SET_LOCUM_UNAVAILABILITIES(state, payload) {
        state.locum_unavailabilities = payload
    },
    // SET_LOCUM_UNAVAILABILITIES_COUNT (state, payload) {
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
        // if  (state.locum_unavailabilities.find(declinedJob => declinedJob.id === payload)) {
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
    SET_LOCUM_PRIVATE_JOB_PARTS(state, payload) {
        state.locum_private_job_parts = payload
    },
    ADD_LOCUM_PRIVATE_JOB_PARTS(state, payload) {
        console.log("qewqe", payload)
        payload.forEach(jobParts => {
            state.locum_private_job_parts.push(jobParts)
            state.locum_private_jobs_count = state.locum_private_jobs_count + 1
        })
    },
    REMOVE_LOCUM_PRIVATE_JOB_PARTS(state, payload) {
        let jobIndex = state.locum_private_job_parts.findIndex(job => job.job_id === payload)
        state.locum_private_job_parts.splice(jobIndex, 1)
    },
}