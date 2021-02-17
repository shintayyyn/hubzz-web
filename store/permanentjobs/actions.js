export default {
  async initializePermanentJobListener ({ commit, }) {
    // =====================================LOCUM=========================================
    this.$socket.on('Locum Notification Permanent Job Matched', async (permanentJob) => {
      console.log('A Permanent Job Posting is Matched to you.', permanentJob)
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Matched',})
      }
    })

    this.$socket.on('Locum Notification Permanent Job Invited', async (permanentJob) => {
      console.log('You have been invited for interview for a permanent job position.', permanentJob)
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Invited',})
      }
    })

    

    this.$socket.on('Locum Notification Permanent Job Rejected', async (permanentJob) => {
      console.log('rejected')
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Rejected',})
      }
    })

    this.$socket.on('Locum Notification Permanent Job Hired', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        console.log('Application is accepted and offered.', response.data.permanent_job)
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Hired',})
      }
    })
    //====================================PRACTICE===========================================
    this.$socket.on('Practice Notification Permanent Job Applied', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Applied',})
      }
    })

    this.$socket.on('Practice Notification Locum Accept Permanent Job Invitation', async (permanentJob) => {
      console.log('A locum has accepted your invitation for permanent job position.', permanentJob)
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Locum Accept Permanent Job Invitation',})
      }
    })

    this.$socket.on('Practice Notification Locum Reject Permanent Job Invitation', async (permanentJob) => {
      console.log('A locum has rejected your invitation for permanent job position.', permanentJob)
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Locum Reject Permanent Job Invitation',})
      }
    })
    
    this.$socket.on('Practice Notification Approve Permanent Job Spoke', async (permanentJob) => {
      console.log('You have been invited for interview for a permanent job position.', permanentJob)
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Approved',})
      }
    })

    this.$socket.on('Practice Notification Reject Permanent Job Spoke', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Rejected',})
      }
    })

    this.$socket.on('Practice Notification Hub Created Permanent Job for Spoke', async (permanentJob) => {
      console.log('permanentJob for spoke onli', permanentJob)
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Rejected',})
      }
    })

    this.$socket.on('Practice Notification Spoke Created Pending Permanent Job', async (permanent_job) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanent_job.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = await response.data.permanent_job
      }

      if(permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {
          permanent_job,
          notificationType: 'Practice Notification Spoke Posted Pending Permanent Job',
        })
      }
    })
  },
}
