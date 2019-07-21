export const state = () => ({
    liveJobs: []
})

export const mutations = {
    // ADD_NEW_LIVE_JOBS(state, payload) {
    //     if (!state.liveJobs.find(job => job.id === payload.id)) {
    //         state.liveJobs.push(payload)
    //     }
    // },
    // REMOVE_LIVE_JOBS(state, payload) {
    //     state.liveJobs = state.liveJobs.filter(job => job.id !== payload.id)
    // },
    UPDATE_LIVE_JOBS(state, payload) {
        
    }

    
}

export const actions = {
    initializeNotificationListener({ state, commit }) {
        this.$socket.on('Practice Notification Job Applied', (job) => {
            // remove from live job
            this.$store.commit('UPDATE_LIVE_JOBS', job.id)
            // request then add to applied job
            this.$axios.$get(`/api/v1/practice/jobs/${job.id}`).then(res => {
              this.$store.commit('ADD_APPLIED_JOBS', res.data.job)
            })
          })
    },
   
}

export const getters = {
    getConversations (state) {
        return state.conversations
    },
}