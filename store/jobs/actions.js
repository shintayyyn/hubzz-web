export default {
    async initializeJobListener({ state, commit, dispatch }) {
        // LOCUM
        this.$socket.on('Locum Notification Job Reminder', async (job) => {
            // dispatch('fetchLocumJob', { jobId: job.id, notifyOnly: true, notificationType: 'Locum Notification Job Reminder' })
        })
        this.$socket.on('Locum Notification Job Available', async (job) => {
            // await dispatch('fetchLocumJob', { jobId: job.id, notificationType: 'Locum Notification Job Available' })
            if (!state.locum_available_jobs.find(availableJobs => availableJobs.id === job.id)) {
                commit('ADD_LOCUM_AVAILABLE_BADGE')
            }
        })
        this.$socket.on('Locum Notification Job Matched', (job) => {
            if (!state.locum_matched_jobs.find(matchedJobs => matchedJobs.id === job.id)) {
                commit('ADD_LOCUM_MATCHED_BADGE')
                commit('ADD_LOCUM_AVAILABLE_BADGE')
                // dispatch('fetchLocumJob', { jobId: job.id })
            }
        })
        this.$socket.on('Locum Notification Job Unavailable', (job) => {
            if (state.locum_available_jobs.find(availableJob => availableJob.id === job.id)) {
                commit('REMOVE_LOCUM_AVAILABLE_JOB', job.id)
                commit('REMOVE_LOCUM_AVAILABLE_BADGE')
            }
            if (state.locum_matched_jobs.find(matchedJob => matchedJob.id === job.id)) {
                commit('REMOVE_LOCUM_MATCHED_JOB', job.id)
                commit('REMOVE_LOCUM_MATCHED_BADGE')
            }
        })
        this.$socket.on('Locum Notification Job Cancelled', (job) => {
            if (state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                commit('REMOVE_LOCUM_ALLOCATED_JOB', job.id)
                commit('REMOVE_LOCUM_ALLOCATED_BADGE')
            }
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
                commit('REMOVE_LOCUM_APPLIED_BADGE')
            }
            if (!state.locum_cancelled_jobs.find(cancelledJob => cancelledJob.id === job.id)) {
                commit('ADD_LOCUM_CANCELLED_BADGE')
                // dispatch('fetchLocumJob', { jobId: job.id })
            }
        })
        this.$socket.on('Locum Notification Job Current', (job) => {
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
                commit('REMOVE_LOCUM_APPLIED_BADGE')
            }
            if (!state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                commit('ADD_LOCUM_ALLOCATED_BADGE')
                // dispatch('fetchLocumJob', { jobId: job.id })
            }
        })
        this.$socket.on('Locum Notification Job Part Completed', (job_part) => {
            if (state.locum_ongoing_job_parts.find(ongoingJob => ongoingJob.id === job_part.id)) {
                commit('REMOVE_LOCUM_ONGOING_JOB_PART', job_part.id)
                commit('REMOVE_LOCUM_ONGOING_BADGE')
            }
            if (!state.locum_completed_job_parts.find(completedJob => completedJob.id === job_part.id)) {
                commit('ADD_LOCUM_COMPLETED_BADGE')
                // dispatch('fetchLocumJob', { jobId: job_part.id, jobPart: true })
            }
        })
        this.$socket.on('Locum Notification Job Unsuccessful', (job) => {
            if (state.locum_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                commit('REMOVE_LOCUM_APPLIED_JOB', job.id)
                commit('REMOVE_LOCUM_APPLIED_BADGE')
            }
            if (!state.locum_unsuccessful_jobs.find(unsuccessfulJob => unsuccessfulJob.id === job.id)) {
                commit('ADD_LOCUM_UNSUCCESSFUL_BADGE')
                // dispatch('fetchLocumJob', { jobId: job.id })
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
        this.$socket.on('Locum Notification Job Ongoing', (job) => {
            if (state.locum_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                commit('REMOVE_LOCUM_ALLOCATED_JOB', job.id)
                commit('REMOVE_LOCUM_ALLOCATED_BADGE')
            }
            if (!state.locum_ongoing_job_parts.find(ongoingJob => ongoingJob.id === job.id)) {
                commit('ADD_LOCUM_ONGOING_BADGE')
                dispatch('fetchLocumJob', { jobId: job.id, jobPart: true })
            }
        })
        // PRACTICE
        this.$socket.on('Practice Notification Job Available', (job) => {
            console.log('practice socket available', job)
            if (!state.practice_available_jobs.find(availableJob => availableJob.id === job.id)) {
                commit('ADD_PRACTICE_AVAILABLE_BADGE')
                dispatch('fetchPracticeJob', { jobId: job.id })
            }
        })
        this.$socket.on('Practice Notification Job Applied', (job) => {
            console.log('practice socket applied', job)
            if (state.practice_available_jobs.find(availableJob => availableJob.id === job.id)) {
                commit('REMOVE_PRACTICE_AVAILABLE_JOB', job.id)
                commit('REMOVE_PRACTICE_AVAILABLE_BADGE')
            }
            if (!state.practice_applied_jobs.find(appliedJob => appliedJob.id === job.id)) {
                commit('ADD_PRACTICE_APPLIED_BADGE')
                dispatch('fetchPracticeJob', { jobId: job.id })
            }
        })
        this.$socket.on('Practice Notification Job Cancelled', (job) => {
            console.log('practice socket available', job)
            if (state.practice_available_jobs.find(availableJobs => availableJobs.id === job.id)) {
                commit('REMOVE_PRACTICE_AVAILABLE_JOB', job.id)
                commit('REMOVE_PRACTICE_AVAILABLE_BADGE')
            }
            if (state.practice_applied_jobs.find(appliedJobs => appliedJobs.id === job.id)) {
                commit('REMOVE_PRACTICE_APPLIED_JOB', job.id)
                commit('REMOVE_PRACTICE_APPLIED_BADGE')
            }
            if (state.practice_allocated_jobs.find(allocatedJobs => allocatedJobs.id === job.id)) {
                commit('REMOVE_PRACTICE_ALLOCATED_JOB', job.id)
                commit('REMOVE_PRACTICE_ALLOCATED_BADGE')
            }
            if (!state.practice_cancelled_jobs.find(cancelledJob => cancelledJob.id === job.id)) {
                commit('ADD_PRACTICE_CANCELLED_BADGE', job)
                dispatch('fetchPracticeJob', { jobId: job.id })
            }
        })
        this.$socket.on('Practice Notification Job Current', (job) => {
            console.log('practice socket allocated/current', job)
            if (state.practice_applied_jobs.find(appliedJobs => appliedJobs.id === job.id)) {
                commit('REMOVE_PRACTICE_APPLIED_JOB', job.id)
                commit('REMOVE_PRACTICE_APPLIED_BADGE')
            }
            if (!state.practice_allocated_jobs.find(allocatedJobs => allocatedJobs.id === job.id)) {
                commit('ADD_PRACTICE_ALLOCATED_BADGE')
                dispatch('fetchPracticeJob', { jobId: job.id })
            }
        })
        this.$socket.on('Practice Notification Job Declined', (job) => {
            console.log('practice socket declined', job)
            if (state.practice_allocated_jobs.find(allocatedJob => allocatedJob.id === job.id)) {
                commit('REMOVE_PRACTICE_ALLOCATED_JOB', job.id)
                commit('REMOVE_PRACTICE_ALLOCATED_BADGE')
            }
            if (!state.practice_declined_jobs.find(declinedJob => declinedJob.id === job.id)) {
                commit('ADD_PRACTICE_DECLINED_BADGE')
                dispatch('fetchPracticeJob', { jobId: job.id })
            }
        })
        this.$socket.on('Practice Notification Job Part Completed', (job_part) => {
            console.log('practice socket part completed', job_part)
            if (state.practice_ongoing_job_parts.find(ongoingJob => ongoingJob.id === job_part.id)) {
                commit('REMOVE_PRACTICE_ONGOING_JOB_PART', job_part.id)
                commit('REMOVE_PRACTICE_ONGOING_BADGE')
            }
            if (!state.practice_completed_job_parts.find(completedJob => completedJob.id === job_part.id)) {
                commit('ADD_PRACTICE_COMPLETED_BADGE')
                dispatch('fetchPracticeJob', { jobId: job_part.id, jobPart: true })
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
    },

    // LOCUM
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

    // async fetchLocumJob({ state, commit }, payload) {
    //     let url = `/api/v1/locum/jobs`
    //     if (payload.jobPart) {
    //         url = `/api/v1/locum/job-parts`
    //     }
    //     const response = await this.$axios.$get(`${url}/${payload.jobId}`)
    //     let job = response.data && response.data.job ? response.data.job : null
    //     let job_part = response.data && response.data.job_part ? response.data.job_part : null
    //     console.log('locum response job', response)
    //     if (job || job_part) {
    //         // remove existing notification or until 5
    //         commit('REMOVE_LOCUM_JOB_NOTIFICATION', job ? job.id : job_part.id)
    //         if (state.locum_job_notifications.length >= 5) {
    //             commit('REMOVE_LOCUM_JOB_NOTIFICATION', state.locum_job_notifications[4].id)
    //         }

    //         if (payload.notifyOnly) {
    //             if (job) {
    //                 job = {
    //                     ...job,
    //                     reminder: true
    //                 }
    //             }
    //             if (job_part) {
    //                 job_part = {
    //                     ...job_part,
    //                     reminder: true
    //                 }
    //             }
    //             console.log(job, job_part)
    //         }
    //         // commit('ADD_LOCUM_JOB_NOTIFICATION', job ? job : job_part)
    //         return job ? job : job_part

    //         // if (!payload.notifyOnly) {
    //         //     if (job) {
    //         //         switch (job.locum_status.toLowerCase()) {
    //         //             case 'available':
    //         //                 commit('ADD_LOCUM_AVAILABLE_JOB', job)
    //         //                 break
    //         //             case 'matched':
    //         //                 commit('ADD_LOCUM_MATCHED_JOB', job)
    //         //                 commit('ADD_LOCUM_AVAILABLE_JOB', job)
    //         //                 break
    //         //             case 'applied':
    //         //                 commit('ADD_LOCUM_APPLIED_JOB', job)
    //         //                 break
    //         //             case 'cancelled':
    //         //                 commit('ADD_LOCUM_CANCELLED_JOB', job)
    //         //                 break
    //         //             case 'allocated':
    //         //                 commit('ADD_LOCUM_ALLOCATED_JOB', job)
    //         //                 break
    //         //             case 'unsuccessful':
    //         //                 commit('ADD_LOCUM_UNSUCCESSFUL_JOB', job)
    //         //                 break
    //         //         }
    //         //     }
    //         //     if (job_part) {
    //         //         switch (job_part.status.toLowerCase()) {
    //         //             case 'ongoing':
    //         //                 commit('ADD_LOCUM_ONGOING_JOB', job_part)
    //         //             case 'completed':
    //         //                 commit('ADD_LOCUM_COMPLETED_JOB_PART', job_part)
    //         //                 break
    //         //         }
    //         //     }
    //         // }
    //     }
    // },

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

    // PRACTICE
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
                if (jobStatus.toLowerCase() === 'unfilled') {
                    commit('SET_PRACTICE_UNFILLED_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'unfilled') : [])
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
    },

    async fetchPracticeJobParts({ commit }, payload) {
        let url = `/api/v1/practice/job-parts`
        let first = payload.id && payload.first ? `/${payload.id}` : ''
        let count = payload.countOnly ? `/count` : ''
        let updatedJobPartIndex = payload.updatedJobPartIndex ? payload.updatedJobPartIndex : []
        let type = payload.type ? payload.type : 'SET'

        const response = await this.$axios.$get(`${url}${first}${count}`, { params: payload })

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
        let url = `/api/v1/practice/jobs`

        const response = await this.$axios.$get(`${url}`, { params: payload })

        payload.status.forEach(jobStatus => {
            if (jobStatus.toLowerCase() === 'live') {
                return commit('SET_PRACTICE_AVAILABLE_JOBS_REMINDER', response.data.jobs.filter(job => job.status.toLowerCase() === 'live'))
            }
            if (jobStatus.toLowerCase() === 'applied') {
                return commit('SET_PRACTICE_APPLIED_JOBS_REMINDER', response.data.jobs.filter(job => job.status.toLowerCase() === 'applied'))
            }
        })
    },

    async fetchPracticeJob({ state, commit }, payload) {
        let url = `/api/v1/practice/jobs`
        if (payload.jobPart) {
            url = `/api/v1/practice/job-parts`
        }
        const response = await this.$axios.$get(`${url}/${payload.jobId}`)
        let job = response.data && response.data.job ? response.data.job : null
        let job_part = response.data && response.data.job_part ? response.data.job_part : null
        console.log('practice response job', response)
        if (job || job_part) {
            // remove existing notification or until 5
            commit('REMOVE_PRACTICE_JOB_NOTIFICATION', job ? job.id : job_part.id)
            if (state.practice_job_notifications.length >= 5) {
                commit('REMOVE_PRACTICE_JOB_NOTIFICATION', state.practice_job_notifications[4].id)
            }
            if (payload.notifyOnly) {
                if (job) {
                    job = {
                        ...job,
                        reminder: true
                    }
                }
                if (job_part) {
                    job_part = {
                        ...job_part,
                        reminder: true
                    }
                }
            }
            commit('ADD_PRACTICE_JOB_NOTIFICATION', job ? job : job_part)

            if (!payload.notifyOnly) {
                if (job) {
                    switch (job.status.toLowerCase()) {
                        case 'live':
                            commit('ADD_PRACTICE_AVAILABLE_JOB', job)
                            break
                        case 'applied':
                            commit('ADD_PRACTICE_APPLIED_JOB', job)
                            break
                        case 'cancelled':
                            commit('ADD_PRACTICE_CANCELLED_JOB', job)
                            break
                        case 'allocated':
                            commit('ADD_PRACTICE_ALLOCATED_JOB', job)
                            break
                        case 'declined':
                            commit('ADD_PRACTICE_DECLINED_JOB', job)
                            break
                    }
                }
                if (job_part) {
                    switch (job_part.status.toLowerCase()) {
                        case 'completed':
                            commit('ADD_PRACTICE_COMPLETED_JOB_PART', job_part)
                            break
                    }
                }
            }
        }
    }
}