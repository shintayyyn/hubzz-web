export default {
  SET_LOCUM_PERMANENT_JOB_COUNT (state, payload) {
    state.locum_permanent_job_count = payload
  },
  SET_LOCUM_PERMANENT_JOBS (state, payload) {
    state.locum_permanent_jobs = payload
  },
  SET_PRACTICE_PERMANENT_JOB_COUNT (state, payload) {
    state.practice_permanent_job_count = payload
  },
  SET_PRACTICE_PERMANENT_JOBS (state, payload) {
    state.practice_permanent_jobs = payload
  },
  SET_PERMANENT_JOB_APPLICATIONS_COUNT (state, payload) {
    state.permanent_job_applications_count = payload
  },
  SET_PERMANENT_JOB_APPLICATIONS (state, payload) {
    state.permanent_job_applications = payload
  },

  ADD_LOCUM_PERMANENT_JOB_NOTIFICATION (state, payload) {
    console.log('payload', payload)
    // let index = state.locum_permanent_job_notifications.findIndex(permJobNotif => permJobNotif.id === payload.id)
    // if (index < 0) {
    //     state.locum_permanent_job_notifications.unshift(payload)
    // } else if (index >= 0) {
    //     state.locum_permanent_job_notifications.splice(index, 1, payload)
    // }
},
}