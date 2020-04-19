export default {
  async initializeJobListener ({ commit }) {
      // LOCUM
      this.$socket.on('Locum Notification Job Reminder', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Reminder' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Available', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          console.log(response)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Available' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Matched', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Matched' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Unsuccessful', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Unsuccessful' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Applied', async (job) => {
          console.log('locum applied', job)
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Applied' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Allocated', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Current' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Ongoing', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Ongoing' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Part Completed', async (job_part) => {
          const response = await this.$axios.$get(`/api/v1/locum/job-parts/${job_part.id}`)
          if (response.data && response.data.job_part) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job_part, notificationType: 'Locum Notification Job Part Completed' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Completed', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/job-parts/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Completed' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Locum Invoice Updated', async (invoice) => {
          const invoiceResponse = await this.$axios.$get(`/api/v1/locum/locum-invoices/${invoice.id}`)
          if (invoiceResponse.data && invoiceResponse.data.locum_invoice) {
              let approvedInvoices = invoiceResponse.data.locum_invoice.items.filter(item => item.status === 'Approved')
              if (approvedInvoices && approvedInvoices.length > 0) {
                  const approvedJobPartsResponse = await this.$axios.$get(`/api/v1/locum/job-parts`, {
                      params: {
                          id: approvedInvoices.map(invoices => invoices.job_part.id),
                          detailed: true
                      }
                  })
                  if (approvedJobPartsResponse.data && approvedJobPartsResponse.data.job_parts) {
                      approvedJobPartsResponse.data.job_parts.forEach(job_part => {
                          commit('ADD_LOCUM_JOB_NOTIFICATION', { ...job_part, notificationType: 'Locum Notification Job Approved' })
                      })
                  }
              }
              let disputedInvoices = invoiceResponse.data.locum_invoice.items.filter(item => item.status === 'Disputed')
              if (disputedInvoices && disputedInvoices.length > 0) {
                  const disputedJobPartsResponse = await this.$axios.$get(`/api/v1/locum/job-parts`, {
                      params: {
                          id: disputedInvoices.map(invoices => invoices.job_part.id),
                          detailed: true
                      }
                  })
                  if (disputedJobPartsResponse.data && disputedJobPartsResponse.data.job_parts) {
                      disputedJobPartsResponse.data.job_parts.forEach(job_part => {
                          commit('ADD_LOCUM_JOB_NOTIFICATION', { ...job_part, notificationType: 'Locum Notification Job Disputed' })
                      })
                  }
              }
              if ((approvedInvoices && approvedInvoices.length > 0) || (disputedInvoices && disputedInvoices.length > 0)) {
                  const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
                  if (res.data && res.data.notifications) {
                      commit('ADD_NOTIFICATION', res.data.notifications)
                      commit('ADD_UNSEEN_NOTIFICATIONS')
                  }
              }
          }
      })
      this.$socket.on('Locum Notification Job Cancelled', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Cancelled' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Amended', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Amended' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      // nsa live/match, inupdate ung job
      this.$socket.on('Locum Notification Job Updated', async () => {
          // doesn't need to notify the locum
      })
      this.$socket.on('Locum Notification Job Withdrawn', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Declined' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Locum Notification Job Terminated', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Terminated' })
          }
          const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      // nsa live/match, may na appoint or kinancel ng practice ung job
      this.$socket.on('Locum Notification Job Unavailable', async () => {
          // doesn't need to notify the locum
      })
      // nsa live/match/applied/allocated, inaupdate ni practice ung job at hindi ka na qualified
      this.$socket.on('Locum Notification Job Unqualified', async (job) => {
          const response = await this.$axios.$get(`/api/v1/locum/jobs/${job.id}`)
          if (response.data && response.data.job) {
              if (response.data.job.viewing_locum_user_appointed === true || response.data.job.viewing_locum_user_applied === true) {
                  commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Unqualified' })
              }
              const res = await this.$axios.$get(`/api/v1/locum/notifications?order_by=created_at:desc&limit=1`)
              if (res.data && res.data.notifications) {
                  commit('ADD_NOTIFICATION', res.data.notifications)
                  commit('ADD_UNSEEN_NOTIFICATIONS')
              }
          }
      })

      // PRACTICE
      this.$socket.on('Practice Notification Job Reminder', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Reminder' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Available', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Available' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Application', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.job_id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Application' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Application Cancelled', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.job_id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Application Cancelled' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Current', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Current' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Ongoing', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Ongoing' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Part Completed', async (job_part) => {
          const response = await this.$axios.$get(`/api/v1/practice/job-parts/${job_part.id}`)
          if (response.data && response.data.job_part) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job_part, notificationType: 'Practice Notification Job Part Completed' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Completed', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/job-parts/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Completed' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Locum Invoice Updated', async (invoice) => {
          const invoiceResponse = await this.$axios.$get(`/api/v1/practice/locum-invoices/${invoice.id}`)
          if (invoiceResponse.data && invoiceResponse.data.locum_invoice) {
              let approvedInvoices = invoiceResponse.data.locum_invoice.items.filter(item => item.status === 'Approved')
              if (approvedInvoices && approvedInvoices.length > 0) {
                  const approvedJobPartsResponse = await this.$axios.$get(`/api/v1/practice/job-parts`, {
                      params: {
                          id: approvedInvoices.map(invoices => invoices.job_part.id),
                          detailed: true
                      }
                  })
                  if (approvedJobPartsResponse.data && approvedJobPartsResponse.data.job_parts) {
                      approvedJobPartsResponse.data.job_parts.forEach(job_part => {
                          commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...job_part, notificationType: 'Practice Notification Job Approved' })
                      })
                  }
              }
              let disputedInvoices = invoiceResponse.data.locum_invoice.items.filter(item => item.status === 'Disputed')
              if (disputedInvoices && disputedInvoices.length > 0) {
                  const disputedJobPartsResponse = await this.$axios.$get(`/api/v1/practice/job-parts`, {
                      params: {
                          id: disputedInvoices.map(invoices => invoices.job_part.id),
                          detailed: true
                      }
                  })
                  if (disputedJobPartsResponse.data && disputedJobPartsResponse.data.job_parts) {
                      disputedJobPartsResponse.data.job_parts.forEach(job_part => {
                          commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...job_part, notificationType: 'Practice Notification Job Disputed' })
                      })
                  }
              }
              if ((approvedInvoices && approvedInvoices.length > 0) || (disputedInvoices && disputedInvoices.length > 0)) {
                  const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
                  if (res.data && res.data.notifications) {
                      commit('ADD_NOTIFICATION', res.data.notifications)
                      commit('ADD_UNSEEN_NOTIFICATIONS')
                  }
              }
          }
      })
      this.$socket.on('Practice Notification Job Cancelled', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Cancelled' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Amended', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Amended' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Withdrawn', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Declined' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Update Accept', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Update Accept' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Unfilled Warning', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Unfilled Warning' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
      this.$socket.on('Practice Notification Job Unfilled', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Unfilled' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })

      this.$socket.on('Practice Notification Job Pending', async (job) => {
          const response = await this.$axios.$get(`/api/v1/practice/jobs/${job.id}`)
          if (response.data && response.data.job) {
              commit('ADD_PRACTICE_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Practice Notification Job Pending' })
          }
          const res = await this.$axios.$get(`/api/v1/practice/notifications?order_by=created_at:desc&limit=1`)
          if (res.data && res.data.notifications) {
              commit('ADD_NOTIFICATION', res.data.notifications)
              commit('ADD_UNSEEN_NOTIFICATIONS')
          }
      })
  },

    // PRACTICE
    async fetchPracticeJobs ({ commit }, payload) {
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
                if (jobStatus.toLowerCase() === 'pending') {
                    commit('SET_PRACTICE_PENDING_JOBS_COUNT', response.data.count)
                }
                // FETCH PENDING PRACTICE
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
                if (jobStatus.toLowerCase() === 'pending') {
                    commit('SET_PRACTICE_PENDING_JOBS', response.data.jobs && response.data.jobs.length > 0 ?
                        response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'pending') : [])
                }
                // FETCH PENDING PRACTICE
            })
        }
    },

    async fetchPracticeJobParts ({ commit }, payload) {
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

    async fetchPracticeJobsReminder ({ commit }, payload) {
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

    async fetchPracticeJob ({ state, commit }, payload) {
        let url = `/api/v1/practice/jobs`
        if (payload.jobPart) {
            url = `/api/v1/practice/job-parts`
        }
        const response = await this.$axios.$get(`${url}/${payload.jobId}`)
        let job = response.data && response.data.job ? response.data.job : null
        let job_part = response.data && response.data.job_part ? response.data.job_part : null
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
    },

    async fetchNotifications ({ commit }, payload) {
        commit("SET_NOTIFICATIONS_LOADING", true)
        commit("SET_AUTH_DOMAIN", this.$auth.user.domain)
        let domain = this.$auth.user.domain.toLowerCase()
        const res = await this.$axios.$get(`/api/v1/${domain}/notifications?limit=${payload.limit}&order_by=created_at:desc`)
        const countResponse = await this.$axios.$get(`/api/v1/${domain}/notifications/count`)
        const seenCountResponse = await this.$axios.$get(`/api/v1/${domain}/notifications/count?seen=false`)
        commit("SET_UNSEEN_NOTIFICATIONS", seenCountResponse.data.count)
        commit("SET_NOTIFICATIONS", res.data.notifications)
        commit("SET_NOTIFICATIONS_COUNT", countResponse.data.count)
        commit("SET_NOTIFICATIONS_LOADING", false)
    },

    async fetchMoreNotifications ({ state, commit }, payload) {
        commit('SET_LOAD_MORE_LOADING', true)
        let domain = this.$auth.user.domain.toLowerCase()
        const responseCount = await this.$axios.$get(`/api/v1/${domain}/notifications/count`)
        if (responseCount.data.count !== state.locum_notifications.length) {
            const res = await this.$axios.$get(`/api/v1/${domain}/notifications?limit=${payload.limit}&offset=${payload.offset}&order_by=created_at:desc`)
            commit("ADD_NOTIFICATION", res.data.notifications)
            commit('SET_LOAD_MORE_LOADING', false)
        }
    },

    async seenNotification ({ state, commit }, payload) {
        const response = await this.$axios.$put(`/api/v1/${state.domain.toLowerCase()}/notifications/${payload.id}/seen`)
        if (response.message === "Success") commit("SEEN_NOTIFICATION", payload.id)
    },

    async seenAllNotifications ({ state, commit }) {
        const response = await this.$axios.$put(`/api/v1/${state.domain.toLowerCase()}/notifications/seen-all`)
        if (response.message === "Success") commit("READ_ALL_NOTIFICATION")
    }
}