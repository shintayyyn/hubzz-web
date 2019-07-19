export const state = () => ({
    reasons: [
      { label: 'In-house Locum can now cover the session', value: 'In-house Locum can now cover the session' },
      { label: 'Annual leave that session was required for has been cancelled', value: 'Annual leave that session was required for has been cancelled' },
      { label: 'Session had been double booked', value: 'Session had been double booked' },
      { label: 'Session booked in error, practice is closed for staff training', value: 'Session booked in error, practice is closed for staff training' },
      { label: 'Session booked in error, Bank Holiday', value: 'Session booked in error, Bank Holiday' },
      { label: 'Session cancelled due to budgetary constraints', value: 'Session cancelled due to budgetary constraints' },
    ],
    liveJobs: [],
    appliedJobs: [],
    allocatedJobs: [],
    completedJobs: [],
    unfilledJobs: [],
    cancelledJobs: [],
    declinedJobs: [],
  })
  
export const mutations = {
  SET_LIVE_JOBS(state, payload) {
    state.liveJobs = payload
  },
  SET_APPLIED_JOBS(state, payload) {
    state.appliedJobs = payload
  },
  SET_ALLOCATED_JOBS(state, payload) {
    state.allocatedJobs = payload
  },
  SET_COMPLETED_JOBS(state, payload) {
    state.completedJobs = payload
  },
  SET_UNFILLED_JOBS(state, payload) {
    state.unfilledJobs = payload
  },
  SET_CANCELLED_JOBS(state, payload) {
    state.cancelledJobs = payload
  },
  SET_DECLINED_JOBS(state, payload) {
    state.declinedJobs = payload
  },
  UPDATE_LIVE_JOBS(state, payload) {
    state.liveJobs = state.liveJobs.filter(job => job.id !== parseInt(payload))
  },
  UPDATE_APPLIED_JOBS(state, payload) {
    state.appliedJobs = state.appliedJobs.filter(job => job.id !== parseInt(payload))
  },
  ADD_APPLIED_JOBS(state, payload) {
    state.appliedJobs.push(payload)
  },
  UPDATE_ALLOCATED_JOBS(state, payload) {
    state.allocatedJobs = state.allocatedJobs.filter(job => job.id !== parseInt(payload))
  },
  UPDATE_COMPLETED_JOBS(state, payload) {
    state.completedJobs = state.completedJobs.filter(job => job.id !== parseInt(payload))
  },
  UPDATE_UNFILLED_JOBS(state, payload) {
    state.unfilledJobs = state.unfilledJobs.filter(job => job.id !== parseInt(payload))
  },
  UPDATE_CANCELLED_JOBS(state, payload) {
    state.cancelledJobs = state.cancelledJobs.filter(job => job.id !== parseInt(payload))
  },
  UPDATE_DECLINED_JOBS(state, payload) {
    state.declinedJobs = state.declinedJobs.filter(job => job.id !== parseInt(payload))
  },
}