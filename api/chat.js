export function fetchConversations (axios, offset, limit = 20, count) {
  let params = {}

  limit ? params.limit = limit : null
  offset ? params.offset = offset : null
  return axios.$get(`/api/v1/conversations${count ? '/count' : ''}`, {
    params: params,
  })
}

export function fetchActiveConversationMessages (axios, offset, limit = 20, order_by, conversation_id) {
  let params = {}

  limit ? params.limit = limit : null
  offset ? params.offset = offset : null
  order_by ? params.order_by = `created_at:${order_by}` : `created_at:asc`
  return axios.$get(`/api/v1/conversations/${conversation_id}`, {
    params: params,
  })
}

export function getUnreadMessages (axios) {
  return axios.$get(`/api/v1/conversations/unread`)
}

export function deleteMessage (axios, message_id) {
  return axios.$put(`/api/v1/conversations/delete-message`, {
    message_id: message_id,
  })
}
