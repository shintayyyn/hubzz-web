export const state = () => ({
  locumJobPart: null,
})

export const getters = {
  getLocumJobPart (state) {
    return state.locumJobPart
  },
}

export const mutations = {
  setLocumJobPart (state, locumJobPart) {
    state.locumJobPart = locumJobPart
  },
}
