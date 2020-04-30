export default {
  async initializePermanentJobListener ({ commit }) {
    // =====================================LOCUM=========================================
    this.$socket.on('Locum Notification Permanent Job Applied', async (permanentJob) => {
      console.log('locum permanent job', permanentJob.id)
      console.log('locum permanent job app', permanentJob.permanent_job_application_id)
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
        commit('ADD_LOCUM_PERMANENT_JOB_NOTIFICATION', {permanent_job, permanent_job_application, notificationType: 'Locum Notification Permanent Job Applied'})
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
    this.$socket.on('Practice Notification Permanent Job Applied', async (permanentJob) => {
      console.log('practice permanent job', permanentJob.id)
      console.log('practice permanent job app', permanentJob.permanent_job_application_id)
      
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
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {permanent_job, permanent_job_application, notificationType: 'Practice Notification Permanent Job Applied'})
      }
    })

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

    this.$socket.on('Practice Notification Approve Permanent Job Spoke', async (permanentJob) => {
      console.log('permanentJob', permanentJob.id)
      
      let permanent_job = null

      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = response.data.permanent_job
      }

      if(permanent_job.approved_by_hub_at) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {
          permanent_job,
          notificationType: 'Practice Notification Permanent Job Approved'
        })
      } else if (permanent_job.rejected_by_hub_at) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {
          permanent_job,
          notificationType: 'Practice Notification Permanent Job Rejected'
        })
      }
      
    })

    this.$socket.on('Practice Notification Hub Created Permanent Job for Spoke', async (permanentJob) => {
      console.log('permanentJob', permanentJob.id)
      
      let permanent_job = null

      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.id}`)

      if(response.data && response.data.permanent_job) {
        permanent_job = await response.data.permanent_job
      }

      if(permanent_job) {
        commit('ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION', {
          permanent_job,
          notificationType: 'Practice Notification Hub Posted Permanent Job Posting'
        })
      }
      
    })

    this.$socket.on('Practice Notification Spoke Created Pending Permanent Job', async (permanentJob) => {
      console.log('permanentJob', permanentJob.id)
      
      let permanent_job = null

      let response = await this.$axios.$get(`/api/v1/practice/permanent-jobs/${permanentJob.id}`)

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