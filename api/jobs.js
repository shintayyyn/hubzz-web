export function fetchLocumJobs(axios, payload) {
    let params = {}
    payload.offset ? params.offset = payload.offset : null
    payload.limit ? params.limit = payload.limit : null
    payload.status ? params.locum_status = payload.status : null
    payload.date_start ? params.date_start = payload.date_start : null
    payload.date_end ? params.date_end = payload.date_end : null

    return axios.$get(`/api/v1/locum/jobs${payload.countOnly ? '/count' : ''}`, { params: params })
}

export function fetchLocumUnavailabilities(axios, payload) {
    let params = {}
    payload.offset ? params.offset = payload.offset : null
    payload.limit ? params.limit = payload.limit : null
    payload.date_start ? params.date_start = payload.date_start : null
    payload.date_end ? params.date_end = payload.date_end : null

    return axios.$get(`/api/v1/locum/unavailabilities${payload.countOnly ? '/count' : ''}`, { params: params })
}

export function fetchLocumJob(axios, payload) {
    return axios.$get(`/api/v1/locum/jobs/${payload}`)
}