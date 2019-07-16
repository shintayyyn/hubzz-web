export function fetchConversations (axios, offset, limit = 20 ) {
    let params = {}

    limit ? params.limit = limit : null
    offset ? params.offset = offset : null

    return axios.$get(`/api/v1/conversations`, { params: params })
}

export function fetchActiveConversationMessages (axios, offset, limit = 20, conversation_id ) {
    let params = {}

    limit ? params.limit = limit : null
    offset ? params.offset = offset : null

    return axios.$get(`/api/v1/conversations/${conversation_id}`, { params: params })
}

export function sendMessage (axios, receiver_user_id, message ) {
    return axios.$post(`/api/v1/messages`, {receiver_user_id: receiver_user_id, message: message})
}

export function deleteMessage (axios, receiver_user_id, message_id ) {
    return axios.$put(`/api/v1/delete-message`, {receiver_user_id: receiver_user_id, message_id: message_id})
}