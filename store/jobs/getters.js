export default {
    // practice
    // NOTIF
    getPracticeJobNotifications(state) {
        let notifications = []
        state.practice_job_notifications.forEach(notif => {
            let message = ''
            let notifObj = null
            switch (notif.notificationType) {
                case 'Practice Notification Job Reminder':
                    if (notif.job_reminded_in_1_hours === true) {
                        message = 'This Job will start in 1 hour.'
                    }
                    else if (notif.job_reminded_in_3_hours === true) {
                        message = 'This Job will start in 3 hours.'
                    }
                    else if (notif.job_reminded_in_1_days === true) {
                        message = 'This Job will start tomorrow.'
                    }
                    else if (notif.job_reminded_in_3_days === true) {
                        message = 'This Job will start in 3 days.'
                    }
                    break;
                case 'Practice Notification Job Available':
                    message = 'This job is now live.'
                    break;
                case 'Practice Notification Job Application':
                    message = 'Someone applied to this job.'
                    break;
                case 'Practice Notification Job Application Cancelled':
                    message = 'Someone cancelled his/her application to this job.'
                    break;
                case 'Practice Notification Job Current':
                    message = 'A locum has been appointed to this job.'
                    break;
                case 'Practice Notification Job Ongoing':
                    message = 'This Job has started.'
                    break;
                case 'Practice Notification Job Part Completed':
                    message = 'This part of your job has been completed'
                    break;
                case 'Practice Notification Job Approved':
                    message = 'This part of your job has been approved'
                    break;
                case 'Practice Notification Job Disputed':
                    message = 'This part of your job has been disputed'
                    break;
                case 'Practice Notification Job Cancelled':
                    message = 'This job has been cancelled.'
                    break;
                case 'Practice Notification Job Amended':
                    message = 'This job has been updated'
                    break;
                case 'Practice Notification Job Declined':
                    message = 'The locum leave this job.'
                    break;
                case 'Practice Notification Job Update Accept':
                    message = 'The locum accepted your changes on this job.'
                    break;
                case 'Practice Notification Job Unfilled Warning':
                    if (notif.job_unfilled_warned_in_1_hours === true) {
                        message = 'This Job will be unfilled soon.'
                    }
                    else if (notif.job_unfilled_warned_in_3_hours === true) {
                        message = 'This Job will be unfilled in 3 hours.'
                    }
                    else if (notif.job_unfilled_warned_in_1_days === true) {
                        message = 'This Job will be unfilled tomorrow.'
                    }
                    else if (notif.job_unfilled_warned_in_3_days === true) {
                        message = 'This Job will be unfilled in 3 days.'
                    }
                    break;
                case 'Practice Notification Job Unfilled':
                    message = 'This job is unfilled.'
                    break;
            }
            let id = notif.notificationType === 'Practice Notification Job Ongoing' ? notif.job_parts[0].id : notif.id
            notifObj = {
                id,
                title: notif.title ? notif.title : notif.job.title,
                status: notif.status,
                billingStatus: ['Practice Notification Job Approved', 'Practice Notification Job Disputed'].includes(notif.notificationType) ? notif.notificationType === 'Practice Notification Job Approved' ? 'Approved' : 'Disputed' : null,
                date_start: notif.date_start,
                date_end: notif.date_end,
                shift: notif.shift ? notif.shift.name : notif.job.shift.name,
                rate: notif.rate ? notif.rate : notif.job.rate,
                locum_detail_rate_type: notif.locum_detail_rate_type ? notif.locum_detail_rate_type.name : notif.job.locum_detail_rate_type.name,
                notification_type: notif.notificationType,
                type: 'Jobs',
                message
            }
            notifications.push(notifObj)
        })
        return notifications
    },
    // PARTS
    getPracticeOngoingJobs(state) {
        let jobs = []
        if (state.practice_ongoing_job_parts) {
            state.practice_ongoing_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeCompletedJobs(state) {
        let jobs = []
        if (state.practice_completed_job_parts) {
            state.practice_completed_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeApprovedJobs(state) {
        let jobs = []
        if (state.practice_approved_job_parts) {
            state.practice_approved_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeAllocatedPartJobs(state) {
        let jobs = []
        if (state.practice_allocated_job_parts) {
            state.practice_allocated_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeCancelledJobs(state) {
        let jobs = []
        if (state.practice_cancelled_job_parts) {
            state.practice_cancelled_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getPracticeWithdrawnJobs(state) {
        let jobs = []
        if (state.practice_withdrawn_job_parts) {
            state.practice_withdrawn_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    // WHOLE
    getPracticePendingJobs(state) {
        let jobs = []
        if (state.practice_pending_jobs) {
            state.practice_pending_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeAllocatedJobs(state) {
        let jobs = []
        if (state.practice_allocated_jobs) {
            state.practice_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let assigned_to = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                assigned_to = job.platform_job.appointed_to_locum.user.personal_detail.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                    assigned_to
                })
            })
            return jobs
        }
        return []
    },
    getPracticeAvailableJobs(state) {
        let jobs = []
        if (state.practice_available_jobs) {
            state.practice_available_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeAppliedJobs(state) {
        let jobs = []
        if (state.practice_applied_jobs) {
            state.practice_applied_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeUnfilledJobs(state) {
        let jobs = []
        if (state.practice_unfilled_jobs) {
            state.practice_unfilled_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                })
            })
            return jobs
        }
        return []
    },
    getPracticeDeclinedJobs(state) {
        let jobs = []
        if (state.practice_declined_jobs) {
            state.practice_declined_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    rate_name,
                    rate_type_name,
                    shift_name,
                })
            })
            return jobs
        }
        return []
    },
    // getPracticeCancelledJobs(state) {
    //     let jobs = []
    //     if (state.practice_cancelled_jobs) {
    //         state.practice_cancelled_jobs.forEach(job => {
    //             let surgery_name = ''
    //             let date_time_start = ''
    //             let date_time_end = ''
    //             let rate_name = ''
    //             let rate_type_name = ''
    //             let shift_name = ''
    //             surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
    //             date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
    //             date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
    //             rate_name = job.rate
    //             rate_type_name = job.locum_detail_rate_type.name
    //             shift_name = job.shift.name
    //             jobs.push({
    //                 ...job,
    //                 surgery_name,
    //                 date_time_start,
    //                 date_time_end,
    //                 rate_name,
    //                 rate_type_name,
    //                 shift_name,
    //             })
    //         })
    //         return jobs
    //     }
    //     return []
    // },
    // getPracticeWithdrawnJobs(state) {
    //     let jobs = []
    //     if (state.practice_withdrawn_jobs) {
    //         state.practice_withdrawn_jobs.forEach(job => {
    //             let surgery_name = ''
    //             let date_time_start = ''
    //             let date_time_end = ''
    //             let rate_name = ''
    //             let rate_type_name = ''
    //             let shift_name = ''
    //             surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
    //             date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
    //             date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
    //             rate_name = job.rate
    //             rate_type_name = job.locum_detail_rate_type.name
    //             shift_name = job.shift.name
    //             jobs.push({
    //                 ...job,
    //                 surgery_name,
    //                 date_time_start,
    //                 date_time_end,
    //                 rate_name,
    //                 rate_type_name,
    //             })
    //         })
    //         return jobs
    //     }
    //     return []
    // },
    // REMINDERS
    getPracticeAvailableJobsReminder(state) {
        return state.practice_available_jobs_reminder
    },
    getPracticeAppliedJobsReminder(state) {
        return state.practice_applied_jobs_reminder
    },

    // locum
    // NOTIF
    getLocumJobNotifications(state) {
        let notifications = []
        state.locum_job_notifications.forEach(notif => {
            let message = ''
            let notifObj = null
            switch (notif.notificationType) {
                case 'Locum Notification Job Reminder':
                    if (notif.job_reminded_in_1_hours === true) {
                        message = 'This Job will start in 1 hour.'
                    } else if (notif.job_reminded_in_3_hours === true) {
                        message = 'This Job will start in 3 hours.'
                    } else if (notif.job_reminded_in_1_days === true) {
                        message = 'This Job will start tomorrow.'
                    } else if (notif.job_reminded_in_3_days === true) {
                        message = 'This Job will start in 3 days.'
                    }
                    break;
                case 'Locum Notification Job Available':
                    message = 'There is a new available job for you.'
                    break;
                case 'Locum Notification Job Matched':
                    message = 'There is a new job that matched your qualifications.'
                    break;
                case 'Locum Notification Job Unsuccessful':
                    message = 'Your application for this job is unsuccessful'
                    break;
                case 'Locum Notification Job Current':
                    message = 'You have been appointed to this job.'
                    break;
                case 'Locum Notification Job Ongoing':
                    message = 'Your Job has started.'
                    break;
                case 'Locum Notification Job Part Completed':
                    message = 'This part of your job has been completed'
                    break;
                case 'Locum Notification Job Approved':
                    message = 'This part of your job has been approved'
                    break;
                case 'Locum Notification Job Disputed':
                    message = 'This part of your job has been disputed'
                    break;
                case 'Locum Notification Job Cancelled':
                    message = 'Your job has been cancelled by your practice'
                    break;
                case 'Locum Notification Job Amended':
                    message = 'This job has been updated by your practice'
                    break;
                case 'Locum Notification Job Declined':
                    message = 'You successfully leave this job.'
                    break;
                case 'Locum Notification Job Terminated':
                    message = 'This Job has been terminated.'
                    break;
                case 'Locum Notification Job Unqualified':
                    message = 'You are not qualified anymore on this job.'
                    break;
            }
            notifObj = {
                id: notif.notificationType === 'Locum Notification Job Ongoing' && notif.job_parts.length > 0 ? notif.job_parts[0].id : notif.id,
                title: notif.title ? notif.title : notif.job.title,
                locum_status: notif.locum_status === 'Declined' ? 'Withdrawn' : notif.locum_status,
                billingStatus: ['Locum Notification Job Approved', 'Locum Notification Job Disputed'].includes(notif.notificationType) ? notif.notificationType === 'Locum Notification Job Approved' ? 'Approved' : 'Disputed' : null,
                date_start: notif.date_start,
                date_end: notif.date_end,
                shift: notif.shift ? notif.shift.name : notif.job.shift.name,
                rate: notif.rate ? notif.rate : notif.job.rate,
                locum_detail_rate_type: notif.locum_detail_rate_type ? notif.locum_detail_rate_type.name : notif.job.locum_detail_rate_type.name,
                notification_type: notif.notificationType,
                type: 'Jobs',
                message
            }
            notifications.push(notifObj)
        })
        return notifications
    },
    // PARTS
    getLocumAllocatedPartJobs(state) {
        let jobs = []
        if (state.locum_allocated_job_parts) {
            state.locum_allocated_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumOngoingJobs(state) {
        let jobs = []
        if (state.locum_ongoing_job_parts) {
            state.locum_ongoing_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumCompletedJobs(state) {
        let jobs = []
        if (state.locum_completed_job_parts) {
            state.locum_completed_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    getLocumApprovedJobs(state) {
        let jobs = []
        if (state.locum_approved_job_parts) {
            state.locum_approved_job_parts.forEach(jobPart => {
                let job_surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let job_rate = ''
                let job_rate_type = ''
                let job_title = ''
                let job_shift = ''
                let completed_at = ''
                job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.name : jobPart.job.private_job.private_practice.name
                date_time_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
                date_time_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
                job_rate = jobPart.job.rate
                job_rate_type = jobPart.job.locum_detail_rate_type.name
                job_title = jobPart.job.title
                job_shift = jobPart.job.shift.name
                completed_at = jobPart.job.type === 'Platform' ? jobPart.completed_at : jobPart.date_end
                jobs.push({
                    ...jobPart,
                    job_surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    job_rate,
                    job_rate_type,
                    job_title,
                    job_shift
                })
            })
            return jobs
        }
        return []
    },
    // WHOLE
    getLocumAllocatedJobs(state) {
        let jobs = []
        if (state.locum_allocated_jobs) {
            state.locum_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
        }
        return jobs
    },
    getLocumAllocatedPrivateJobs(state) {
        let jobs = []
        if (state.locum_allocated_jobs) {
            state.locum_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs.filter(job => job.type === 'Private')
        }
        return jobs
    },
    getLocumAllocatedPlatformJobs(state) {
        let jobs = []
        if (state.locum_allocated_jobs) {
            state.locum_allocated_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs.filter(job => job.type === 'Platform')
        }
        return jobs
    },
    getLocumAvailableJobs(state) {
        let jobs = []
        if (state.locum_available_jobs) {
            state.locum_available_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumMatchedJobs(state) {
        let jobs = []
        if (state.locum_matched_jobs) {
            state.locum_matched_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumAppliedJobs(state) {
        let jobs = []
        if (state.locum_applied_jobs) {
            state.locum_applied_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumUnsuccessfulJobs(state) {
        let jobs = []
        if (state.locum_unsuccessful_jobs) {
            state.locum_unsuccessful_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumDeclinedJobs(state) {
        let jobs = []
        if (state.locum_declined_jobs) {
            state.locum_declined_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumCancelledJobs(state) {
        let jobs = []
        if (state.locum_cancelled_jobs) {
            state.locum_cancelled_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    getLocumWithdrawnJobs(state) {
        let jobs = []
        if (state.locum_withdrawn_jobs) {
            state.locum_withdrawn_jobs.forEach(job => {
                let surgery_name = ''
                let date_time_start = ''
                let date_time_end = ''
                let rate_name = ''
                let rate_type_name = ''
                let shift_name = ''
                let completed_at = ''
                surgery_name = job.type === 'Platform' ? job.platform_job.practice.name : job.private_job.private_practice.name
                date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
                date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
                rate_name = job.rate
                rate_type_name = job.locum_detail_rate_type.name
                shift_name = job.shift.name
                completed_at = job.type === 'Platform' ? job.completed_at : job.date_end
                jobs.push({
                    ...job,
                    surgery_name,
                    date_time_start,
                    date_time_end,
                    completed_at,
                    rate_name,
                    rate_type_name,
                    shift_name
                })
            })
            return jobs
        }
        return []
    },
    // UNAVAILABILITIES
    getLocumUnavailabilities(state) {
        return state.locum_unavailabilities
    },
    // PARTS
    getLocumPrivateJobs(state) {
        let jobs = []
        state.locum_private_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.surgery.name
            date_time_start = job.time_start ? `${job.date_start} | ${job.time_start}` : job.date_start
            date_time_end = job.time_end ? `${job.date_end} | ${job.time_end}` : job.date_end
            rate_name = job.rate
            rate_type_name = job.locum_detail_rate_type.name
            shift_name = job.shift.name
            completed_at = job.date_end
            jobs.push({
                ...job,
                surgery_name,
                date_time_start,
                date_time_end,
                completed_at,
                rate_name,
                rate_type_name,
                shift_name
            })
        })
        return jobs
    },
}   