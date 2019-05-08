export const state = () => ({
    compliance_documents: []
})

export const mutations = {
    SET_DOCUMENTS (state, payload) {
        state.compliance_documents = []
        payload.forEach(item => {
            state.compliance_documents.push(item)
        })
    },
    
}

export const actions = {
    getComplianceDocuments ({state, commit}) {
        this.$axios.$get(`/api/v1/compliance-documents`).then(res => {
            commit('SET_DOCUMENTS', res.data.compliance_documents)
        })
    }
}

export const getters = {
    mainDocuments (state) {
        return state.compliance_documents.filter(item => item.id >= 1 && item.id <= 4)
    },
    otherDocuments (state) {
        return state.compliance_documents.filter(item => item.id >= 5)
    }
}