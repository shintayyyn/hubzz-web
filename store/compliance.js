export const state = () => ({
    mandatory: [],
    optional: []
})

export const mutations = {
    SET_MANDATORY(state, payload) {
        state.mandatory = payload
    },
    SET_OPTIONAL(state, payload) {
        state.optional = payload
    },
    UPDATE_MANDATORY(state, payload) {
        let updateFile = state.mandatory.find(item => item.info.id === payload.id)
        updateFile.info = payload
    }
}

export const actions = {
   
}

export const getters = {
    
}