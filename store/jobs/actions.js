import * as jobsApi from '@/api/jobs'
export default {
    async fetchLocumJobs({ commit }, payload) {
        const response = await jobsApi.fetchLocumJobs(this.$axios, payload)
        if (payload.countOnly) {
            commit('SET_LOCUM_ALLOCATED_JOBS_COUNT', response.data.count)
            return
        }
        commit('TOGGLE_LOADING', false)
        commit('SET_LOCUM_ALLOCATED_JOBS', response.data.jobs)
    },
}