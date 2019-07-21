export function fetchLocumJobs(axios, payload) {
    let params = {}
    payload.offset ? params.offset = payload.offset : null
    payload.limit ? params.limit = payload.limit : null
    payload.status ? params.locum_status = payload.status : null

    return axios.$get(`/api/v1/locum/jobs${payload.countOnly ? '/count' : ''}`, { params: params })
}