export const mutations = {
    SET_PERMISSIONS(state, payload) {
        state.user.practice_detail.role.permissions = payload
    }
}

export const getters = {
    permissions(state) {
        return state.user && state.user.practice_detail && state.user.practice_detail.role ? state.user.practice_detail.role.permissions.map(item => item.name) : []
    },
}