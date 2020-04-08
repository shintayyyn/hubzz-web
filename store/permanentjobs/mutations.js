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
    let index = state.locum_permanent_job_notifications.findIndex(permJobNotif => permJobNotif.id === payload.permanent_job.id)
    if (index < 0) {
        state.locum_permanent_job_notifications.unshift(payload)
    } else if (index >= 0) {
        state.locum_permanent_job_notifications.splice(index, 1, payload)
    }
  },

  ADD_PRACTICE_PERMANENT_JOB_NOTIFICATION (state, payload) {
    let index = state.practice_permanent_job_notifications.findIndex(permJobNotif => permJobNotif.id === payload.permanent_job.id)
    if (index < 0) {
      state.practice_permanent_job_notifications.unshift(payload)
    } else if (index >= 0) {
      state.practice_permanent_job_notifications.splice(index, 1, payload)
    }
  },

  REMOVE_LOCUM_PERMANENT_JOB_NOTIFICATION (state, payload) {
    // console.log('payload locum', payload)
    // console.log('state', state.locum_permanent_job_notifications)
    state.locum_permanent_job_notifications = state.locum_permanent_job_notifications.filter(permJobNotif => permJobNotif.id !== payload)
  },

  REMOVE_PRACTICE_PERMANENT_JOB_NOTIFICATION (state, payload) {
    // console.log('payload practice', payload)
    // console.log('state', state.practice_permanent_job_notifications)
    state.practice_permanent_job_notifications = state.practice_permanent_job_notifications.filter(permJobNotif => permJobNotif.id !== payload)
  },

  CLEAR_LOCUM_PERMANENT_JOB_NOTIFICATION (state) {
    state.locum_permanent_job_notifications = []
  },

  CLEAR_PRACTICE_PERMANENT_JOB_NOTIFICATION (state) {
    state.practice_permanent_job_notifications = []
  }

}