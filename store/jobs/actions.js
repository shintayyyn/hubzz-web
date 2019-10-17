import * as jobsApi from '@/api/jobs'
export default {
    async initializeJobListener({ state, commit, dispatch }) {
        this.$socket.on('Locum Notification Job Matched', (job) => {
            if (!state.locum_matched_jobs.find(matchedJobs => matchedJobs.id == job.id)) {
                commit('ADD_LOCUM_MATCHED_JOB', job)
                commit('ADD_LOCUM_MATCHED_BADGE')
            }
        })
        this.$socket.on('Locum Notification Job Available', (job) => {
            if (!state.locum_available_jobs.find(availableJobs => availableJobs.id == job.id)) {
                commit('ADD_LOCUM_AVAILABLE_JOB', job)
                commit('ADD_LOCUM_AVAILABLE_BADGE')
            }
        })
        this.$socket.on('Locum Notification Job Updated', (job) => {
            if (state.locum_allocated_jobs.find(allocatedJobs => allocatedJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_ALLOCATED_JOB', job.job.id)
            }
            if (state.locum_available_jobs.find(availableJobs => availableJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_AVAILABLE_JOB', job.job.id)
            }
            if (state.locum_matched_jobs.find(matchedJobs => matchedJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_MATCHED_JOB', job.job.id)
            }
            if (state.locum_applied_jobs.find(appliedJobs => appliedJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_APPLIED_JOB', job.job.id)
            }
            if (state.locum_unsuccessful_jobs.find(unsuccessfulJobs => unsuccessfulJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_UNSUCCESSFUL_JOB', job.job.id)
            }
            if (state.locum_declined_jobs.find(declinedJobs => declinedJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_DECLINED_JOB', job.job.id)
            }
            if (state.locum_cancelled_jobs.find(cancelledJobs => cancelledJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_CANCELLED_JOB', job.job.id)
            }
            if (state.locum_completed_jobs.find(completedJobs => completedJobs.id == job.job.id)) {
                return commit('REMOVE_LOCUM_COMPLETED_JOB', job.job.id)
            }
        })
        this.$socket.on('Locum Notification Job Current', (job) => {
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
            }
            dispatch('fetchLocumJobs', { id: job.id, first: true })
        })
        this.$socket.on('Locum Notification Job Unsuccessful', (job) => {
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
            }
            dispatch('fetchLocumJobs', { id: job.id, first: true })
        })
        this.$socket.on('Locum Notification Job Unavailable', (job) => {
            if (state.locum_available_jobs.find(availableJob => availableJob.id === job.id)) {
                return commit('REMOVE_LOCUM_AVAILABLE_JOB', job.id)
            }
            if (state.locum_matched_jobs.find(matchedJob => matchedJob.id === job.id)) {
                return commit('REMOVE_LOCUM_MATCHED_JOB', job.id)
            }
        })
        this.$socket.on('Locum Notification Job Cancelled', (job) => {
            if (state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                return commit('REMOVE_LOCUM_ALLOCATED_JOB', job.id)
            }
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                return commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
            }
            if (!state.locum_cancelled_jobs.find(cancelledJob => cancelledJob.id === job.id)) {
                commit('ADD_LOCUM_CANCELLED_BADGE')
                return commit('ADD_LOCUM_CANCELLED_JOB', job)
            }
        })
        this.$socket.on('Locum Notification Job Part Completed', (job) => {

        })
        this.$socket.on('Locum Notification Job Completed', (job) => {
            if (state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                commit('REMOVE_LOCUM_ALLOCATED_JOB', job.id)
            }
            if (!state.locum_completed_jobs.find(completedJob => completedJob.id === job.id)) {
                commit('ADD_LOCUM_COMPLETED_JOB', job)
                commit('ADD_LOCUM_COMPLETED_BADGE')
            }
        })
        this.$socket.on('Practice Notification Job Available', (job) => {
            if (!state.practice_available_jobs.find(availableJob => availableJob.id == job.id)) {
                commit('ADD_PRACTICE_AVAILABLE_JOB', job)
                commit('ADD_PRACTICE_AVAILABLE_BADGE')
            }
        })
        this.$socket.on('Practice Notification Job Updated', (job) => {
            if (state.practice_available_jobs.find(availableJobs => availableJobs.id == job.job.id)) {
                commit('REMOVE_PRACTICE_AVAILABLE_JOB', job.job.id)
            }
            if (state.practice_available_jobs_reminder.find(availableJobsReminder => availableJobsReminder.id == job.job.id)) {
                commit('REMOVE_PRACTICE_AVAILABLE_JOBS_REMINDER', job.job.id)
            }
            if (!state.practice_available_jobs_reminder.find(availableJobsReminder => availableJobsReminder == job.new_job.id) && job.new_job.status === "Available") {
                commit('ADD_PRACTICE_AVAILABLE_JOBS_REMINDER', job.new_job)
            }
            if (state.practice_applied_jobs.find(appliedJobs => appliedJobs.id == job.job.id)) {
                commit('REMOVE_PRACTICE_APPLIED_JOB', job.job.id)
            }
            if (state.practice_applied_jobs_reminder.find(appliedJobsReminder => appliedJobsReminder.id == job.job.id)) {
                commit('REMOVE_PRACTICE_APPLIED_JOBS_REMINDER', job.job.id)
            }
            if (!state.practice_applied_jobs_reminder.find(appliedJobsReminder => appliedJobsReminder == job.new_job.id) && job.new_job.status === "Applied") {
                commit('ADD_PRACTICE_APPLIED_JOBS_REMINDER', job.new_job)
            }
            if (state.practice_allocated_jobs.find(allocatedJobs => allocatedJobs.id == job.job.id)) {
                commit('REMOVE_PRACTICE_ALLOCATED_JOB', job.job.id)
            }
            if (state.practice_completed_jobs.find(completedJobs => completedJobs.id == job.job.id)) {
                commit('REMOVE_PRACTICE_COMPLETED_JOB', job.job.id)
            }
            if (state.practice_unfilled_jobs.find(unfilledJobs => unfilledJobs.id == job.job.id)) {
                commit('REMOVE_PRACTICE_UNFILLED_JOB', job.job.id)
            }
            if (state.practice_cancelled_jobs.find(cancelledJobs => cancelledJobs.id == job.job.id)) {
                commit('REMOVE_PRACTICE_CANCELLED_JOB', job.job.id)
            }
            if (state.practice_declined_jobs.find(declinedJobs => declinedJobs.id == job.job.id)) {
                commit('REMOVE_PRACTICE_DECLINED_JOB', job.job.id)
            }
        })
        this.$socket.on('Practice Notification Job Applied', (job) => {
            if (state.practice_available_jobs.find(availableJob => availableJob.id == job.id)) {
                commit('REMOVE_PRACTICE_AVAILABLE_JOB', job.id)
            }
            dispatch('fetchPracticeJob', job.id)
        })
        this.$socket.on('Practice Notification Job Current', (job) => {
            if (!state.practice_allocated_jobs.find(allocatedJobs => allocatedJobs.id == job.id)) {
                commit('ADD_PRACTICE_ALLOCATED_JOB', job)
                commit('ADD_PRACTICE_ALLOCATED_BADGE')
            }
            if (state.practice_applied_jobs.find(appliedJobs => appliedJobs.id == job.id)) {
                commit('REMOVE_PRACTICE_APPLIED_JOB', job.id)
            }
        })
        this.$socket.on('Practice Notification Job Declined', (job) => {
            if (state.practice_allocated_jobs.find(allocatedJob => allocatedJob.id == job.id)) {
                commit('REMOVE_PRACTICE_ALLOCATED_JOB', job.id)
            }
            commit('ADD_PRACTICE_DECLINED_BADGE', job)
            commit('ADD_PRACTICE_DECLINED_JOB', job)
        })
        this.$socket.on('Practice Notification Job Cancelled', (job) => {
            if (state.practice_available_jobs.find(availableJobs => availableJobs.id == job.id)) {
                commit('REMOVE_PRACTICE_AVAILABLE_JOB', job.id)
            }
            if (state.practice_applied_jobs.find(appliedJobs => appliedJobs.id == job.id)) {
                commit('REMOVE_PRACTICE_APPLIED_JOB', job.id)
            }
            if (state.practice_allocated_jobs.find(allocatedJobs => allocatedJobs.id == job.id)) {
                commit('REMOVE_PRACTICE_ALLOCATED_JOB', job.id)
            }
            commit('ADD_PRACTICE_CANCELLED_BADGE', job)
            commit('ADD_PRACTICE_CANCELLED_JOB', job)
        })
        this.$socket.on('Practice Notification Job Part Completed', (jobPart) => {

        })
        this.$socket.on('Practice Notification Job Completed', (job) => {
            if (state.practice_allocated_jobs.find(allocatedJob => allocatedJob.id == job.id)) {
                commit('REMOVE_PRACTICE_ALLOCATED_JOB', job.id)
            }
            if (!state.practice_completed_jobs.find(completedJob => completedJob.id == job.id)) {
                commit('ADD_PRACTICE_COMPLETED_JOB', job)
                commit('ADD_PRACTICE_COMPLETED_BADGE', job)
            }
        })
    },
    async fetchLocumAllocatedJobParts({ commit }, payload) {
        const response = await jobsApi.fetchLocumAllocatedJobParts(this.$axios, payload)
        return commit('SET_LOCUM_ALLOCATED_PART_JOBS', response.data.job_parts)
    },
    async fetchLocumJobs({ state, commit }, payload) {
        const response = await jobsApi.fetchLocumJobs(this.$axios, payload)
        if (payload.id && payload.first) {
            if (response.data.job.locum_status === 'Current' && !state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === payload)) {
                commit('ADD_LOCUM_ALLOCATED_BADGE')
                return commit('ADD_LOCUM_ALLOCATED_JOB', response.data.job)
            }
            if (response.data.job.locum_status === 'Current' && !state.locum_unsuccessful_jobs.find(unsuccessfulJob => unsuccessfulJob.id === payload)) {
                commit('ADD_LOCUM_UNSUCCESSFUL_BADGE')
                return commit('ADD_LOCUM_UNSUCCESSFUL_JOB', response.data.job)
            }
        }
        // unavailable
        if (payload.status === "Unavailable") {
            return commit('SET_LOCUM_UNAVAILABILITIES', response.data.unavailabilities)
        }
        // job parts
        if (payload.status.includes("Ongoing")) {
            if (payload.countOnly) {
                return commit('SET_LOCUM_ONGOING_JOBS_COUNT', response.data.count)
            }
            // clear job parts when updating
            if (payload.job_id) {
                let removeOngoingJobId = state.locum_ongoing_jobs.map(ongoingJob => {
                    return ongoingJob.job.id === payload.job_id ? ongoingJob.id : ''
                })
                removeOngoingJobId.forEach(id => {
                    commit('REMOVE_LOCUM_ONGOING_JOB', id)
                })
            }
            response.data.job_parts.forEach(jobPart => {
                if (!state.locum_ongoing_jobs.map(ongoingJob => ongoingJob.id).includes(jobPart.id)) {
                    commit('ADD_LOCUM_ONGOING_JOB', jobPart)
                }
            })
        }
        if (payload.status === "Completed") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_COMPLETED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_COMPLETED_JOBS', response.data.job_parts)
        }
        if (payload.status === "Approved") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_APPROVED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_APPROVED_JOBS', response.data.job_parts)
        }
        // whole jobs
        if (payload.status.includes("Allocated")) {
            if (payload.countOnly) {
                return commit('SET_LOCUM_ALLOCATED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_ALLOCATED_JOBS', response.data.jobs)
        }
        if (payload.status[0] === "Available" && payload.status[1] === "Matched") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_AVAILABLE_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_AVAILABLE_JOBS', response.data.jobs)
        }
        if (payload.status === "Matched") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_MATCHED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_MATCHED_JOBS', response.data.jobs)
        }
        if (payload.status === "Applied") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_APPLIED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_APPLIED_JOBS', response.data.jobs)
        }
        if (payload.status === "Unsuccessful") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_UNSUCCESSFUL_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_UNSUCCESSFUL_JOBS', response.data.jobs)
        }
        if (payload.status === "Declined") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_DECLINED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_DECLINED_JOBS', response.data.jobs)
        }
        if (payload.status === "Cancelled") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_CANCELLED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_CANCELLED_JOBS', response.data.jobs)
        }
        if (payload.status === "Withdrawn") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_WITHDRAWN_JOBS_COUNT', response.data.count)
            }
            return commit('SET_LOCUM_WITHDRAWN_JOBS', response.data.jobs)
        }
    },
    async fetchPracticeJobs({ commit }, payload) {
        commit('TOGGLE_LOADING', true)
        const response = await jobsApi.fetchPracticeJobs(this.$axios, payload)
        commit('TOGGLE_LOADING', false)
        if (payload.status === 'Reminder') {
            commit('SET_PRACTICE_APPLIED_REMINDERS', response)
        }
        if (payload.status === "Available") {
            if (payload.countOnly) {
                return commit('SET_PRACTICE_AVAILABLE_JOBS_COUNT', response.data.count)
            }
            return commit('SET_PRACTICE_AVAILABLE_JOBS', response.data.jobs)
        }
        if (payload.status === "Applied") {
            if (payload.countOnly) {
                return commit('SET_PRACTICE_APPLIED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_PRACTICE_APPLIED_JOBS', response.data.jobs)
        }
        if (payload.status === "Allocated") {
            if (payload.countOnly) {
                return commit('SET_PRACTICE_ALLOCATED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_PRACTICE_ALLOCATED_JOBS', response.data.jobs)
        }
        if (payload.status === "Completed") {
            if (payload.countOnly) {
                return commit('SET_PRACTICE_COMPLETED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_PRACTICE_COMPLETED_JOBS', response.data.jobs)
        }
        if (payload.status === "Unfilled") {
            if (payload.countOnly) {
                return commit('SET_PRACTICE_UNFILLED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_PRACTICE_UNFILLED_JOBS', response.data.jobs)
        }
        if (payload.status === "Cancelled") {
            if (payload.countOnly) {
                return commit('SET_PRACTICE_CANCELLED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_PRACTICE_CANCELLED_JOBS', response.data.jobs)
        }
        if (payload.status === "Declined") {
            if (payload.countOnly) {
                return commit('SET_PRACTICE_DECLINED_JOBS_COUNT', response.data.count)
            }
            return commit('SET_PRACTICE_DECLINED_JOBS', response.data.jobs)
        }
    },
    async fetchPracticeJobsReminder({ commit }, payload) {
        commit('TOGGLE_LOADING', true)
        const response = await jobsApi.fetchPracticeJobsReminder(this.$axios, payload)
        if (payload.status === "Available") {
            return commit('SET_PRACTICE_AVAILABLE_JOBS_REMINDER', response.data.jobs)
        }
        if (payload.status === "Applied") {
            return commit('SET_PRACTICE_APPLIED_JOBS_REMINDER', response.data.jobs)
        }
    },
    async fetchPracticeJob({ state, commit }, payload) {
        commit('TOGGLE_LOADING', true)
        const response = await jobsApi.fetchPracticeJob(this.$axios, payload)
        commit('TOGGLE_LOADING', false)
        if (response.data.job.status === 'Applied' && !state.locum_applied_jobs.find(appliedJob => appliedJob.id === payload)) {
            commit('ADD_PRACTICE_APPLIED_BADGE')
            return commit('ADD_PRACTICE_APPLIED_JOB', response.data.job)
        }
    }
}