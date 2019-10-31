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
                // commit('ADD_LOCUM_CANCELLED_BADGE')
                // get job from socket id
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

    async fetchLocumJobs({ commit }, payload) {
        let url = '/api/v1/locum/jobs'
        let first = payload.id && payload.first ? `/${payload.id}` : ''
        let count = payload.countOnly ? `/count` : ''

        const response = await this.$axios.$get(`${url}${first}${count}`, { params: payload })

        if (payload.id && payload.first && response.data && response.data.job) {
            if (response.data.job.locum_status.toLowerCase() === 'allocated') {
                commit('ADD_LOCUM_ALLOCATED_JOB', response.data.job)
            }
            if (response.data.job.locum_status.toLowerCase() === 'unsuccessful') {
                commit('ADD_LOCUM_UNSUCCESSFUL_JOB', response.data.job)
            }
        }

        if (payload.countOnly) {
            payload.locum_status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'allocated') {
                    commit('SET_LOCUM_ALLOCATED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'applied') {
                    commit('SET_LOCUM_APPLIED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'available') {
                    commit('SET_LOCUM_AVAILABLE_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'matched' && !payload.locum_status.map(locumStatus => locumStatus.toLowerCase()).includes('available')) {
                    commit('SET_LOCUM_MATCHED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'unsuccessful') {
                    commit('SET_LOCUM_UNSUCCESSFUL_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'declined') {
                    commit('SET_LOCUM_DECLINED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'cancelled') {
                    commit('SET_LOCUM_CANCELLED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'withdrawn') {
                    commit('SET_LOCUM_WITHDRAWN_JOBS_COUNT', response.data.count)
                }
            })
        }

        if (!payload.countOnly && !payload.first) {
            payload.locum_status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'allocated') {
                    commit('SET_LOCUM_ALLOCATED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.locum_status.toLowerCase() === 'allocated') : [])
                }
                if (jobStatus.toLowerCase() === 'applied') {
                    commit('SET_LOCUM_APPLIED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.locum_status.toLowerCase() === 'applied') : [])
                }
                if (jobStatus.toLowerCase() === 'available') {
                    commit('SET_LOCUM_AVAILABLE_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => ['available', 'matched'].includes(jobPart.locum_status.toLowerCase())) : [])
                }
                if (jobStatus.toLowerCase() === 'matched') {
                    commit('SET_LOCUM_MATCHED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.locum_status.toLowerCase() === 'matched') : [])
                }
                if (jobStatus.toLowerCase() === 'unsuccessful') {
                    commit('SET_LOCUM_UNSUCCESSFUL_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.locum_status.toLowerCase() === 'unsuccessful') : [])
                }
                if (jobStatus.toLowerCase() === 'declined') {
                    commit('SET_LOCUM_DECLINED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.locum_status.toLowerCase() === 'declined') : [])
                }
                if (jobStatus.toLowerCase() === 'cancelled') {
                    commit('SET_LOCUM_CANCELLED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.locum_status.toLowerCase() === 'cancelled') : [])
                }
                if (jobStatus.toLowerCase() === 'withdrawn') {
                    commit('SET_LOCUM_WITHDRAWN_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.locum_status.toLowerCase() === 'withdrawn') : [])
                }
            })
        }
    },

    async fetchLocumJobParts({ commit }, payload) {
        let url = `/api/v1/locum/job-parts`
        let first = payload.id && payload.first ? `/${payload.id}` : ''
        let count = payload.countOnly ? `/count` : ''
        let updatedJobPartIndex = payload.updatedJobPartIndex ? payload.updatedJobPartIndex : []
        let type = payload.type ? payload.type : 'SET'

        const response = await this.$axios.$get(`${url}${first}${count}`, { params: payload })

        if (payload.countOnly) {
            payload.locum_status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'ongoing') {
                    commit('SET_LOCUM_ONGOING_JOB_PARTS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'completed') {
                    commit('SET_LOCUM_COMPLETED_JOB_PARTS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'approved') {
                    commit('SET_LOCUM_APPROVED_JOB_PARTS_COUNT', response.data.count)
                }
            })
        }

        if (!payload.countOnly && !payload.first) {
            payload.locum_status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'allocated') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                            commit('SET_LOCUM_ALLOCATED_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'allocated'))
                        }
                        // if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                        //     response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'allocated').forEach((jobPart, index) => {
                        //         commit('UPDATE_LOCUM_ALLOCATED_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                        //     })
                        // }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_LOCUM_ALLOCATED_JOB_PARTS', [])
                    }
                }
                if (jobStatus.toLowerCase() === 'ongoing') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (type === 'ADD') {
                            response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'ongoing').forEach(part => {
                                commit('ADD_LOCUM_ONGOING_JOB', part)
                            })
                        }
                        if (type === 'SET') {
                            if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                                commit('SET_LOCUM_ONGOING_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'ongoing'))
                            }
                            if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                                response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'ongoing').forEach((jobPart, index) => {
                                    commit('UPDATE_LOCUM_ONGOING_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                                })
                            }
                        }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_LOCUM_ONGOING_JOB_PARTS', [])
                    }
                }
                if (jobStatus.toLowerCase() === 'completed') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                            commit('SET_LOCUM_COMPLETED_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'completed'))
                        }
                        if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                            response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'completed').forEach((jobPart, index) => {
                                commit('UPDATE_LOCUM_COMPLETED_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                            })
                        }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_LOCUM_COMPLETED_JOB_PARTS', [])
                    }
                }
                if (jobStatus.toLowerCase() === 'approved') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                            commit('SET_LOCUM_APPROVED_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'approved'))
                        }
                        if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                            response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'approved').forEach((jobPart, index) => {
                                commit('UPDATE_LOCUM_APPROVED_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                            })
                        }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_LOCUM_APPROVED_JOB_PARTS', [])
                    }
                }
            })
        }
    },

    async fetchLocumUnavailabilities({ commit }, payload) {
        const response = await this.$axios.$get(`/api/v1/locum/unavailabilities`, { params: payload })
        commit('SET_LOCUM_UNAVAILABILITIES', response.data.unavailabilities)
    },

    async fetchPracticeJobs({ commit }, payload) {
        let url = '/api/v1/practice/jobs'
        let first = payload.id && payload.first ? `/${payload.id}` : ''
        let count = payload.countOnly ? `/count` : ''

        const response = await this.$axios.$get(`${url}${first}${count}`, { params: payload })

        if (payload.countOnly) {
            payload.status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'allocated') {
                    commit('SET_PRACTICE_ALLOCATED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'applied') {
                    commit('SET_PRACTICE_APPLIED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'live') {
                    commit('SET_PRACTICE_AVAILABLE_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'unsuccessful') {
                    commit('SET_PRACTICE_UNSUCCESSFUL_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'declined') {
                    commit('SET_PRACTICE_DECLINED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'cancelled') {
                    commit('SET_PRACTICE_CANCELLED_JOBS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'withdrawn') {
                    commit('SET_PRACTICE_WITHDRAWN_JOBS_COUNT', response.data.count)
                }
            })
        }
        if (!payload.countOnly) {
            payload.status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'allocated') {
                    commit('SET_PRACTICE_ALLOCATED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'allocated') : [])
                }
                if (jobStatus.toLowerCase() === 'applied') {
                    commit('SET_PRACTICE_APPLIED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'applied') : [])
                }
                if (jobStatus.toLowerCase() === 'live') {
                    commit('SET_PRACTICE_AVAILABLE_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'live') : [])
                }
                if (jobStatus.toLowerCase() === 'unsuccessful') {
                    commit('SET_PRACTICE_UNSUCCESSFUL_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'unsuccessful') : [])
                }
                if (jobStatus.toLowerCase() === 'declined') {
                    commit('SET_PRACTICE_DECLINED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'declined') : [])
                }
                if (jobStatus.toLowerCase() === 'cancelled') {
                    commit('SET_PRACTICE_CANCELLED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'cancelled') : [])
                }
                if (jobStatus.toLowerCase() === 'withdrawn') {
                    commit('SET_PRACTICE_WITHDRAWN_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'withdrawn') : [])
                }
            })
        }
        // if (payload.status === 'Reminder') {
        //     commit('SET_PRACTICE_APPLIED_REMINDERS', response)
        // }
        // if (payload.status === "Available") {
        //     if (payload.countOnly) {
        //         return commit('SET_PRACTICE_AVAILABLE_JOBS_COUNT', response.data.count)
        //     }
        //     return commit('SET_PRACTICE_AVAILABLE_JOBS', response.data.jobs)
        // }
        // if (payload.status === "Applied") {
        //     if (payload.countOnly) {
        //         return commit('SET_PRACTICE_APPLIED_JOBS_COUNT', response.data.count)
        //     }
        //     return commit('SET_PRACTICE_APPLIED_JOBS', response.data.jobs)
        // }
        // if (payload.status === "Allocated") {
        //     if (payload.countOnly) {
        //         return commit('SET_PRACTICE_ALLOCATED_JOBS_COUNT', response.data.count)
        //     }
        //     return commit('SET_PRACTICE_ALLOCATED_JOBS', response.data.jobs)
        // }
        // if (payload.status === "Completed") {
        //     if (payload.countOnly) {
        //         return commit('SET_PRACTICE_COMPLETED_JOBS_COUNT', response.data.count)
        //     }
        //     return commit('SET_PRACTICE_COMPLETED_JOBS', response.data.jobs)
        // }
        // if (payload.status === "Unfilled") {
        //     if (payload.countOnly) {
        //         return commit('SET_PRACTICE_UNFILLED_JOBS_COUNT', response.data.count)
        //     }
        //     return commit('SET_PRACTICE_UNFILLED_JOBS', response.data.jobs)
        // }
        // if (payload.status === "Cancelled") {
        //     if (payload.countOnly) {
        //         return commit('SET_PRACTICE_CANCELLED_JOBS_COUNT', response.data.count)
        //     }
        //     return commit('SET_PRACTICE_CANCELLED_JOBS', response.data.jobs)
        // }
        // if (payload.status === "Declined") {
        //     if (payload.countOnly) {
        //         return commit('SET_PRACTICE_DECLINED_JOBS_COUNT', response.data.count)
        //     }
        //     return commit('SET_PRACTICE_DECLINED_JOBS', response.data.jobs)
        // }
    },

    async fetchPracticeJobParts({ commit }, payload) {
        let url = `/api/v1/practice/job-parts`
        let first = payload.id && payload.first ? `/${payload.id}` : ''
        let count = payload.countOnly ? `/count` : ''
        let updatedJobPartIndex = payload.updatedJobPartIndex ? payload.updatedJobPartIndex : []
        let type = payload.type ? payload.type : 'SET'

        console.log('payload job parts', payload)
        const response = await this.$axios.$get(`${url}${first}${count}`, { params: payload })
        console.log('response job parts', response)

        if (payload.countOnly) {
            payload.status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'ongoing') {
                    commit('SET_PRACTICE_ONGOING_JOB_PARTS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'completed') {
                    commit('SET_PRACTICE_COMPLETED_JOB_PARTS_COUNT', response.data.count)
                }
                if (jobStatus.toLowerCase() === 'approved') {
                    commit('SET_PRACTICE_APPROVED_JOB_PARTS_COUNT', response.data.count)
                }
            })
        }

        if (!payload.countOnly) {
            payload.status.forEach(jobStatus => {
                if (jobStatus.toLowerCase() === 'allocated') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                            commit('SET_PRACTICE_ALLOCATED_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'allocated'))
                        }
                        // if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                        //     response.data.job_parts.filter(jobPart => jobPart.locum_status.toLowerCase() === 'allocated').forEach((jobPart, index) => {
                        //         commit('UPDATE_LOCUM_ALLOCATED_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                        //     })
                        // }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_PRACTICE_ALLOCATED_JOB_PARTS', [])
                    }
                }
                if (jobStatus.toLowerCase() === 'ongoing') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (type === 'ADD') {
                            response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'ongoing').forEach(part => {
                                commit('ADD_PRACTICE_ONGOING_JOB', part)
                            })
                        }
                        if (type === 'SET') {
                            if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                                commit('SET_PRACTICE_ONGOING_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'ongoing'))
                            }
                            if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                                response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'ongoing').forEach((jobPart, index) => {
                                    commit('UPDATE_PRACTICE_ONGOING_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                                })
                            }
                        }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_PRACTICE_ONGOING_JOB_PARTS', [])
                    }
                }
                if (jobStatus.toLowerCase() === 'completed') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                            commit('SET_PRACTICE_COMPLETED_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'completed'))
                        }
                        if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                            response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'completed').forEach((jobPart, index) => {
                                commit('UPDATE_PRACTICE_COMPLETED_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                            })
                        }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_PRACTICE_COMPLETED_JOB_PARTS', [])
                    }
                }
                if (jobStatus.toLowerCase() === 'approved') {
                    if (response.data && response.data.job_parts && response.data.job_parts.length > 0) {
                        if (updatedJobPartIndex && updatedJobPartIndex.length === 0) {
                            commit('SET_PRACTICE_APPROVED_JOB_PARTS', response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'approved'))
                        }
                        if (updatedJobPartIndex && updatedJobPartIndex.length > 0) {
                            response.data.job_parts.filter(jobPart => jobPart.status.toLowerCase() === 'approved').forEach((jobPart, index) => {
                                commit('UPDATE_PRACTICE_APPROVED_JOB_PART', { payload: jobPart, payloadIndex: updatedJobPartIndex[index] })
                            })
                        }
                    }
                    if (response.data && response.data.job_parts.length === 0) {
                        commit('SET_PRACTICE_APPROVED_JOB_PARTS', [])
                    }
                }
            })
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