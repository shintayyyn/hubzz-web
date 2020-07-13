export default {
  async initializePermanentJobListener ({ commit }) {
    // =====================================LOCUM=========================================
    this.$socket.on('Locum Notification Permanent Job Matched', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Matched',})
      }
    })

    this.$socket.on('Locum Notification Permanent Job Invited', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Locum Notification Permanent Job Invited',})
      }
    })

    this.$socket.on('Locum Notification Permanent Job Invited', async (permanentJob) => {
      let permanent_job = null
      let permanent_job_application = null

      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = response.data.permanent_job
      }

      response = await this.$axios.$get(`/api/v1/locum/permanent-job-applications/${permanentJob.permanent_job_application_id}`)
      
      if(response.data && response.data.permanent_job_application) {
        permanent_job_application = response.data.permanent_job_application
      }

      if(permanent_job && permanent_job_application) {
        commit('ADD_LOCUM_PERMANENT_JOB_NOTIFICATION', {permanent_job, permanent_job_application, notificationType: 'Locum Notification Permanent Job Invited'})
      }
    })

    this.$socket.on('Locum Notification Permanent Job Applied', async (permanentJob) => {
      console.log('locum permanent job', permanentJob)
      console.log('locum permanent job app', permanentJob.permanent_job_application_id)
      // const response = await this.$axios
      // if (response.data && response.data.job) {
      //   commit('ADD_LOCUM_JOB_NOTIFICATION', { ...response.data.job, notificationType: 'Locum Notification Job Reminder' })
      // }
      // let permanent_job = null
      // let permanent_job_application = null

      // let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.id}`)

      // if(response.data && response.data.permanent_job) {
      //   permanent_job = response.data.permanent_job
      // }

      // response = await this.$axios.$get(`/api/v1/locum/permanent-job-applications/${permanentJob.permanent_job_application_id}`)
      
      // if(response.data && response.data.permanent_job_application) {
      //   permanent_job_application = response.data.permanent_job_application
      // }

      // if(permanent_job && permanent_job_application) {
      //   commit('ADD_LOCUM_PERMANENT_JOB_NOTIFICATION', {permanent_job, permanent_job_application, notificationType: 'Locum Notification Permanent Job Applied'})
      // }
    })

    this.$socket.on('Locum Notification Permanent Job Rejected', async (permanentJob) => {
      let permanent_job = null
      let permanent_job_application = null

      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = response.data.permanent_job
      }

      response = await this.$axios.$get(`/api/v1/locum/permanent-job-applications/${permanentJob.permanent_job_application_id}`)
      
      if(response.data && response.data.permanent_job_application) {
        permanent_job_application = response.data.permanent_job_application
      }

      if(permanent_job && permanent_job_application) {
        commit('ADD_LOCUM_PERMANENT_JOB_NOTIFICATION', {permanent_job, permanent_job_application, notificationType: 'Locum Notification Permanent Job Rejected'})
      }
    })

    this.$socket.on('Locum Notification Permanent Job Application Unsuccessful', async (permanentJob) => {
      let permanent_job = null
      let permanent_job_application = null
      
      let response = await this.$axios.$get(`/api/v1/locum/permanent-jobs/${permanentJob.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = response.data.permanent_job
      }

      if(permanent_job) {
        commit('ADD_LOCUM_PERMANENT_JOB_NOTIFICATION', {permanent_job, permanent_job_application, notificationType: 'Locum Notification Permanent Job Unsuccessful'})
      }
    })

    //====================================PRACTICE===========================================
    // MAKE WORKING
    this.$socket.on('Practice Notification Permanent Job Applied', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Applied',})
      }
    })
    // DONT MAKE WORKING ; IGNORE THIS
    this.$socket.on('Practice Notification Permanent Job Invited', async (permanentJob) => {
      let permanent_job = null
      let permanent_job_application = null

      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = response.data.permanent_job
      }

      response = await this.$axios.$get(`/api/v1/practice/permanent-job-applications/${permanentJob.permanent_job_application_id}`)
      
      if(response.data && response.data.permanent_job_application) {
        permanent_job_application = response.data.permanent_job_application
      }

      if(permanent_job && permanent_job_application) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {permanent_job, permanent_job_application, notificationType: 'Practice Notification Permanent Job Invited'})
      }
    })
    // MAKE WORKING ; FOR SPOKES ONLY
    this.$socket.on('Practice Notification Approve Permanent Job Spoke', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Approved'})
      }
    })
    // MAKE WORKING ; FOR SPOKES ONLY
    this.$socket.on('Practice Notification Reject Permanent Job Spoke', async (permanentJob) => {
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Rejected'})
      }
    })
    // MAKE WORKING ; FOR SPOKES ONLY
    this.$socket.on('Practice Notification Hub Created Permanent Job for Spoke', async (permanentJob) => {
      console.log('permanentJob for spoke onli', permanentJob)
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.notification.payload.id}`)
      
      if(response.data && response.data.permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {...response.data.permanent_job, notificationType: 'Practice Notification Permanent Job Rejected'})
      }
      
    })
    // MAKE WORKING ; FOR HUBS ONLY
    this.$socket.on('Practice Notification Spoke Created Pending Permanent Job', async (permanent_job) => {
      console.log('permanentJob for hub onli', permanent_job)
      
      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanent_job.notification.payload.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = await response.data.permanent_job
      }

      if(permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {
          permanent_job,
          notificationType: 'Practice Notification Spoke Posted Pending Permanent Job'
        })
      }
      
    })

  }
}