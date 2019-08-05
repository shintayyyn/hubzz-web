export function fetchPracticeJobs(axios, payload) {
    let params = {}
    payload.offset ? params.offset = payload.offset : null
    payload.limit ? params.limit = payload.limit : null
    payload.status ? params.status = payload.status : null
    payload.date_start ? params.date_start = payload.date_start : null
    payload.date_end ? params.date_end = payload.date_end : null
    return axios.$get(`/api/v1/practice/jobs${payload.countOnly ? '/count' : ''}`, { params: params })
}

export function fetchPracticeJobsReminder(axios, payload) {
    let params = {}
    payload.status ? params.status = payload.status : null
    payload.platform_selection_date_start ? params.platform_selection_date_start = payload.platform_selection_date_start : null
    payload.platform_selection_date_end ? params.platform_selection_date_end = payload.platform_selection_date_end : null
    return axios.$get(`/api/v1/practice/jobs`, { params: params })
}

export function fetchLocumJobs(axios, payload) {
    let params = {}
    payload.offset ? params.offset = payload.offset : null
    payload.limit ? params.limit = payload.limit : null
    payload.status ? params.locum_status = payload.status : null
    payload.date_start ? params.date_start = payload.date_start : null
    payload.date_end ? params.date_end = payload.date_end : null
    payload.shift_id ? params.shift_id = payload.shift_id : null
    payload.rate ? params.rate = payload.rate : null
    payload.locum_detail_rate_type_id ? params.locum_detail_rate_type_id = payload.locum_detail_rate_type_id : null
    payload.near_post_code ? params.near_post_code = payload.near_post_code : null
    payload.miles ? params.miles = payload.miles : null
    payload.surgery_name ? params.surgery_name = payload.surgery_name : null
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

export function fetchPracticeJob(axios, payload) {
    return axios.$get(`/api/v1/practice/jobs/${payload}`)
}