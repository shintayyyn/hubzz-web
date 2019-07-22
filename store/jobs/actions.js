import * as jobsApi from '@/api/jobs'
export default {
    async initializeJobListener({ state, commit, dispatch }) {
        this.$socket.on('Locum Notification Job Matched', (job) => {
            if (!state.locum_matched_jobs.find(matchedJobs => matchedJobs.id == job.id)) {
                commit('ADD_LOCUM_MATCHED_JOB', job)
            }
        })
        this.$socket.on('Locum Notification Job Available', (job) => {
            if (!state.locum_available_jobs.find(availableJobs => availableJobs.id == job.id)) {
                commit('ADD_LOCUM_AVAILABLE_JOB', job)
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
            dispatch('fetchLocumJob', job.id)
        })
        this.$socket.on('Locum Notification Job Unsuccessful', (job) => {
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
            }
            dispatch('fetchLocumJob', job.id)
        })
        this.$socket.on('Locum Notification Job Unavailable', (job) => {
            // cancelled an available / matched job // just remove
            if (state.locum_available_jobs.find(availableJob => availableJob.id === job.id)) {
                return commit('REMOVE_LOCUM_AVAILABLE_JOB', job.id)
            }
            if (state.locum_matched_jobs.find(matchedJob => matchedJob.id === job.id)) {
                return commit('REMOVE_LOCUM_MATCHED_JOB', job.id)
            }
        })
        this.$socket.on('Locum Notification Job Cancelled', (job) => {
            // cancelled an allocated / applied job // push to cancelled
            if (state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                return commit('REMOVE_LOCUM_ALLOCATED_JOB', job.id)
            }
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                return commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
            }
            if (!state.locum_cancelled_jobs.find(cancelledJob => cancelledJob.id === job.id)) {
                return commit('ADD_LOCUM_CANCELLED_JOB', job)
            }
        })
        this.$socket.on('Locum Notification Job Completed', (job) => {
            if (state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                commit('REMOVE_LOCUM_ALLOCATED_JOB', job.id)
            }
            if (!state.locum_completed_jobs.find(completedJob => completedJob.id === job.id)) {
                commit('ADD_LOCUM_COMPLETED_JOB', job)
            }
        })
    },
    async fetchLocumJobs({ commit }, payload) {
        commit('TOGGLE_LOADING', true)
        const response = await jobsApi.fetchLocumJobs(this.$axios, payload)
        commit('TOGGLE_LOADING', false)
        if (payload.status === "Current") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_ALLOCATED_JOBS_COUNT', response.data.count)
            }  
            return commit('SET_LOCUM_ALLOCATED_JOBS', response.data.jobs)
        }
        if (payload.status === "Available") {
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
        if (payload.status === "Completed") {
            if (payload.countOnly) {
                return commit('SET_LOCUM_COMPLETED_JOBS_COUNT', response.data.count)
            }  
            return commit('SET_LOCUM_COMPLETED_JOBS', response.data.jobs)
        }
        
    },
    async fetchLocumJob({ state, commit }, payload) {
        commit('TOGGLE_LOADING', true)
        const response = await jobsApi.fetchLocumJob(this.$axios, payload)
        commit('TOGGLE_LOADING', false)
        if (response.data.job.status === 'Current' && !state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === payload)) {
            commit('ADD_LOCUM_ALLOCATED_JOB', response.data.job)
        }
        if (response.data.job.status === 'Current' && !state.locum_unsuccessful_jobs.find(unsuccessfulJob => unsuccessfulJob.id === payload)) {
            commit('ADD_LOCUM_UNSUCCESSFUL_JOB', response.data.job)
        }
    }
}