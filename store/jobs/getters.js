export default {
    // practice
    // NOTIF
    getPracticeJobNotifications(state) {
        let notifications = []
        state.practice_job_notifications.forEach(notif => {
            if (['completed', 'ongoing', 'approved'].includes(notif.status.toLowerCase())) {
                notifications.push({
                    id: notif.id,
                    title: notif.job.title,
                    status: notif.status,
                    date_start: notif.job.date_start,
                    date_end: notif.job.date_end,
                    shift: notif.job.shift.name,
                    rate: notif.job.rate,
                    locum_detail_rate_type: notif.job.locum_detail_rate_type.name
                })
            } else if (!['completed', 'ongoing', 'approved'].includes(notif.status.toLowerCase())) {
                notifications.push({
                    id: notif.id,
                    title: notif.title,
                    status: notif.status,
                    date_start: notif.date_start,
                    date_end: notif.date_end,
                    shift: notif.shift.name,
                    rate: notif.rate,
                    locum_detail_rate_type: notif.locum_detail_rate_type.name
                })
            }
        })
        console.log('practice job notifications', notifications)
        return notifications
    },
    // PARTS
    getPracticeOngoingJobs(state) {
        let jobs = []
        state.practice_ongoing_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    getPracticeCompletedJobs(state) {
        let jobs = []
        state.practice_completed_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            let completed_at = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    getPracticeApprovedJobs(state) {
        let jobs = []
        state.locum_approved_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            let completed_at = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    getPracticeAllocatedPartJobs(state) {
        let jobs = []
        state.practice_allocated_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    // WHOLE
    getPracticeAllocatedJobs(state) {
        let jobs = []
        state.practice_allocated_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let assigned_to = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getPracticeAvailableJobs(state) {
        let jobs = []
        state.practice_available_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getPracticeAppliedJobs(state) {
        let jobs = []
        state.practice_applied_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getPracticeUnfilledJobs(state) {
        let jobs = []
        state.practice_unfilled_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getPracticeDeclinedJobs(state) {
        let jobs = []
        state.practice_declined_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getPracticeCancelledJobs(state) {
        let jobs = []
        state.practice_cancelled_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getPracticeWithdrawnJobs(state) {
        let jobs = []
        state.practice_withdrawn_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    // REMINDERS
    getPracticeAvailableJobsReminder(state) {
        return state.practice_available_jobs_reminder
    },
    getPracticeAppliedJobsReminder(state) {
        return state.practice_applied_jobs_reminder
    },
    getPracticeJobsBadge(state) {
        return [
            state.practice_new_allocated_jobs_count, state.practice_new_available_jobs_count, state.practice_new_applied_jobs_count,
            state.practice_new_unfilled_jobs_count, state.practice_new_declined_jobs_count,
            state.practice_new_cancelled_jobs_count, state.practice_new_completed_jobs_count
        ].reduce((accumulator, currentValue) => accumulator + currentValue)
    },

    // locum
    // NOTIF
    getLocumJobNotifications(state) {
        let notifications = []
        state.locum_job_notifications.forEach(notif => {
            if (['completed', 'ongoing', 'approved'].includes(notif.locum_status.toLowerCase())) {
                notifications.push({
                    id: notif.id,
                    title: notif.job.title,
                    locum_status: notif.locum_status,
                    date_start: notif.job.date_start,
                    date_end: notif.job.date_end,
                    shift: notif.job.shift.name,
                    rate: notif.job.rate,
                    locum_detail_rate_type: notif.job.locum_detail_rate_type.name,
                    reminder: notif.reminder ? notif.reminder : false
                })
            } else if (!['completed', 'ongoing', 'approved'].includes(notif.locum_status.toLowerCase())) {
                notifications.push({
                    id: notif.id,
                    title: notif.title,
                    locum_status: notif.locum_status,
                    date_start: notif.date_start,
                    date_end: notif.date_end,
                    shift: notif.shift.name,
                    rate: notif.rate,
                    locum_detail_rate_type: notif.locum_detail_rate_type.name,
                    reminder: notif.reminder ? notif.reminder : false
                })
            }
            if (notif.reminder) {
                let reminder_message = ''
                if (job_reminded_in_1_hours === 1) {
                    reminder_message = 'This Job will start in 1 hour'
                } else if (job_reminded_in_3_hours) {
                    reminder_message = 'This Job will start in 3 hours'
                } else if (job_reminded_in_1_days === 1) {
                    reminder_message = 'This Job will start tomorrow'
                } else if (job_reminded_in_3_days === 1) {
                    reminder_message = 'This Job will start in 3 days'
                }
                notifications.push({ reminder_message })
            }
        })
        console.log('locum job notifications', notifications)
        return notifications
    },
    // PARTS
    getLocumAllocatedPartJobs(state) {
        let jobs = []
        state.locum_allocated_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    getLocumAllocatedPrivatePartJobs(state) {
        let jobs = []
        state.locum_allocated_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
        return jobs.filter(jobPart => jobPart.job.type === 'Private')
    },
    getLocumAllocatedPlatformPartJobs(state) {
        let jobs = []
        state.locum_allocated_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
        return jobs.filter(jobPart => jobPart.job.type === 'Platform')
    },
    getLocumOngoingJobs(state) {
        let jobs = []
        state.locum_ongoing_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    getLocumCompletedJobs(state) {
        let jobs = []
        state.locum_completed_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            let completed_at = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    getLocumApprovedJobs(state) {
        let jobs = []
        state.locum_approved_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            let completed_at = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
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
    },
    // WHOLE
    getLocumAllocatedJobs(state) {
        let jobs = []
        state.locum_allocated_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getLocumAllocatedPrivateJobs(state) {
        return state.locum_allocated_jobs.filter(job => job.type === 'Private')
    },
    getLocumAllocatedPlatformJobs(state) {
        return state.locum_allocated_jobs.filter(job => job.type === 'Platform')
    },
    getLocumAvailableJobs(state) {
        let jobs = []
        state.locum_available_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getLocumMatchedJobs(state) {
        let jobs = []
        state.locum_matched_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getLocumAppliedJobs(state) {
        let jobs = []
        state.locum_applied_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getLocumUnsuccessfulJobs(state) {
        let jobs = []
        state.locum_unsuccessful_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getLocumDeclinedJobs(state) {
        let jobs = []
        state.locum_declined_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getLocumCancelledJobs(state) {
        let jobs = []
        state.locum_cancelled_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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
    },
    getLocumWithdrawnJobs(state) {
        let jobs = []
        state.locum_withdrawn_jobs.forEach(job => {
            let surgery_name = ''
            let date_time_start = ''
            let date_time_end = ''
            let rate_name = ''
            let rate_type_name = ''
            let shift_name = ''
            let completed_at = ''
            surgery_name = job.type === 'Platform' ? job.platform_job.practice.surgery.name : job.private_job.private_practice.surgery.name
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