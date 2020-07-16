export default {
  async initializePermanentJobListener ({ commit, }) {
    // =====================================LOCUM=========================================
    this.$socket.on('Locum Notification Permanent Job Matched', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Matched',})
      }
    })

    this.$socket.on('Locum Notification Permanent Job Invited', async (permanentJob) => {
      console.log('is it working?')
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Invited',})
      }
    })
    //====================================PRACTICE===========================================
    this.$socket.on('Practice Notification Permanent Job Applied', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Applied',})
      }
    })
    this.$socket.on('Practice Notification Approve Permanent Job Spoke', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Approved'})
      }
    })
    this.$socket.on('Practice Notification Reject Permanent Job Spoke', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Rejected'})
      }
    })
    this.$socket.on('Practice Notification Hub Created Permanent Job for Spoke', async (permanentJob) => {
      console.log('permanentJob for spoke onli', permanentJob)
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Rejected'})
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
