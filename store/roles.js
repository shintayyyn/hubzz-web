export const state = () => ({
    practice_roles: [],
})

export const mutations = {
    SET_PRACTICE_ROLES(state, payload) {
        state.practice_roles = payload
    },
    ADD_PRACTICE_ROLE(state, payload) {
        if (!state.practice_roles.find(role => role.id === payload.id)) {
            state.practice_roles.push(payload)
        }
    },
    REMOVE_PRACTICE_ROLE(state, payload) {
        state.practice_roles = state.practice_roles.filter(role => role.id !== parseInt(payload))
    }
}
