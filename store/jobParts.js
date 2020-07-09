export const state = () => ({
  jobPart: null,
})

export const getters = {
  getJobPart (state) {
    return state.jobPart
  },
}

export const mutations = {
  setJobPart (state, jobPart) {
    state.jobPart = jobPart
  },
}
