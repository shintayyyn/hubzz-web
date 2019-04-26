export const state = () => ({
    documents: [
        { title: 'Passport', dateUploaded: null, status: 'Empty', note: '', fileName: '', file: null, imageUrl: '',  },
        { title: 'Medical Indemnity Insurance Certificate', dateUploaded: null, status: 'Empty', note: '', fileName: '', file: null, imageUrl: '',  },
        { title: 'Basic Life Support Certificate', dateUploaded: null, status: 'Empty', note: '', fileName: '', file: null, imageUrl: '',  },
        { title: 'DBS Certificate', dateUploaded: null, status: 'Empty', note: '', fileName: '', file: null, imageUrl: '',  }
    ]
})

export const mutations = {
    SET_DOCUMENTS (state, payload) {
        let docs = state.documents.find(item => item.title === payload.title)
        docs.dateUploaded = payload.dateUploaded
        docs.status = payload.status
        docs.note = payload.note
        docs.fileName = payload.fileName
        docs.file = payload.file
        docs.imageUrl = payload.imageUrl
    },
    
}
  