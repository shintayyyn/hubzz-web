export const state = () => ({
    activeTab: 'live',
    job_id: null,
    user_id: null,
    reasons: [
      { label: 'In-house Locum can now cover the session', value: 'In-house Locum can now cover the session' },
      { label: 'Annual leave that session was required for has been cancelled', value: 'Annual leave that session was required for has been cancelled' },
      { label: 'Session had been double booked', value: 'Session had been double booked' },
      { label: 'Session booked in error, practice is closed for staff training', value: 'Session booked in error, practice is closed for staff training' },
      { label: 'Session booked in error, Bank Holiday', value: 'Session booked in error, Bank Holiday' },
      { label: 'Session cancelled due to budgetary constraints', value: 'Session cancelled due to budgetary constraints' },
    ]
  })
  
  export const mutations = {
    SET_ACTIVE_TAB(state, payload) {
      state.activeTab = payload
    },
    SET_JOB_DETAIL_ID(state, payload) {
      state.job_id = payload
    },
    SET_USER_ID(state, payload) {
      state.user_id = payload
    },
  }
  