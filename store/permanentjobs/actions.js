export default {
  async initializePermanentJobListener ({ commit }) {
    // Locum
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

    //Practice
    this.$socket.on('Practice Notification Permanent Job Applied', async (permanentJob) => {
      console.log('practice permanent job', permanentJob.id)
      console.log('practice permanent job app', permanentJob.permanent_job_application_id)
    })
  }
}