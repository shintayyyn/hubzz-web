import moment from 'moment';
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
    // PARTS
    getLocumOngoingJobs(state) {
        let jobs = []
        state.locum_ongoing_job_parts.forEach(jobPart => {
            let job_surgery_name = ''
            let date_start = ''
            let date_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
            date_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
            date_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
            job_rate = jobPart.job.rate
            job_rate_type = jobPart.job.locum_detail_rate_type.name
            job_title = jobPart.job.title
            job_shift = jobPart.job.shift.name
            jobs.push({
                ...jobPart,
                job_surgery_name,
                date_start,
                date_end,
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
            let date_start = ''
            let date_end = ''
            let job_rate = ''
            let job_rate_type = ''
            let job_title = ''
            let job_shift = ''
            job_surgery_name = jobPart.job.type === 'Platform' ? jobPart.job.platform_job.practice.surgery.name : jobPart.job.private_job.private_practice.surgery.name
            date_start = jobPart.time_start ? `${jobPart.date_start} | ${jobPart.time_start}` : jobPart.date_start
            date_end = jobPart.time_end ? `${jobPart.date_end} | ${jobPart.time_end}` : jobPart.date_end
            job_rate = jobPart.job.rate
            job_rate_type = jobPart.job.locum_detail_rate_type.name
            job_title = jobPart.job.title
            job_shift = jobPart.job.shift.name
            jobs.push({
                ...jobPart,
                job_surgery_name,
                date_start,
                date_end,
                job_rate,
                job_rate_type,
                job_title,
                job_shift
            })
        })
        return jobs
    },
    getLocumApprovedJobs(state) {
        return state.locum_approved_job_parts
    },
    // WHOLE
    getLocumAllocatedPartJobs(state) {
        return state.locum_allocated_part_jobs
    },
    getLocumAllocatedJobs(state) {
        return state.locum_allocated_jobs
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