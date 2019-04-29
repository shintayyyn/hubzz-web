export const state = () => ({
    activeTab: 'account_details',
    professions: [],
    qualifications: [],
    clinicalSystems: [],
    spokenLanguages: [],
    account_details: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        mobile_number: '',
        home_number: ''
    },
    address_details: {
        post_code: '',
        address_line_1: '',
        address_line_2: '',
        address_line_3: ''
    },
    professional_details: {
        gmc_or_nmc_number: '',
        mpl_or_npl_number: '',
        nhs_smart_card_id_number: '',
        profession: null,
        specialty: [],
        clinical_systems: [],
        spoken_languages: [],
        rates_per_hour: '',
        rate_per_half_day_session: '',
        rate_per_whole_day_session: '',
        ir35_scoped: false
    },
    credential_details: {
        email: '',
        password: '',
        password_confirmation: '',
        privacy_policy: false
    },
    practice_details: {
        id: '',
        title: '',
        address: '',
        ccg: '',
        practice_code: ''
    },
    practice_account_details: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        role: '',
        email: '',
        password: '',
        repeat_password: '',
        privacy_policy: false
    }
})

export const mutations = {
    SET_PROFESSIONS(state, payload) {
        payload.forEach(item => {
            state.professions.push(item)
        })
    },
    SET_QUALIFICATIONS(state, payload) {
        payload.forEach(item => {
            state.qualifications.push(item)
        })
    },
    SET_CLINICAL_SYSTEMS(state, payload) {
        payload.forEach(item => {
            state.clinicalSystems.push(item)
        })
    },
    SET_SPOKEN_LANGUAGES(state, payload) {
        payload.forEach(item => {
            state.spokenLanguages.push(item)
        })
    },
    SET_ACTIVE_TAB(state, payload) {
        state.activeTab = payload
    },
    SET_ACCOUNT_DETAILS(state, payload) {
        state.account_details.title = payload.title
        state.account_details.first_name = payload.first_name
        state.account_details.last_name = payload.last_name
        state.account_details.suffix = payload.suffix
        state.account_details.gender = payload.gender
        state.account_details.mobile_number = payload.mobile_number
        state.account_details.home_number = payload.home_number
    },
    SET_ADDRESS_DETAILS(state, payload) {
        state.address_details.post_code = payload.post_code
        state.address_details.address_line_1 = payload.address_line_1
        state.address_details.address_line_2 = payload.address_line_2
        state.address_details.address_line_3 = payload.address_line_3
    },
    SET_PROFESSIONAL_DETAILS(state, payload) {
        state.professional_details.gmc_or_nmc_number = payload.gmc_or_nmc_number
        state.professional_details.mpl_or_npl_number = payload.mpl_or_npl_number
        state.professional_details.nhs_smart_card_id_number = payload.nhs_smart_card_id_number
        state.professional_details.profession = payload.profession
        state.professional_details.specialty = []
        payload.specialty.forEach(item => {
            state.professional_details.specialty.push(item)
        })
        state.professional_details.clinical_systems = []
        payload.clinical_systems.forEach(item => {
            state.professional_details.clinical_systems.push(item)
        })
        state.professional_details.spoken_languages = []
        payload.spoken_languages.forEach(item => {
            state.professional_details.spoken_languages.push(item)
        })
        state.professional_details.rates_per_hour = payload.rates_per_hour
        state.professional_details.rate_per_half_day_session = payload.rate_per_half_day_session
        state.professional_details.rate_per_whole_day_session = payload.rate_per_whole_day_session
        state.professional_details.ir35_scoped = payload.ir35_scoped
    },
    SET_CREDENTIAL_DETAILS(state, payload) {
        state.credential_details.email = payload.email
        state.credential_details.password = payload.password
        state.credential_details.password_confirmation = payload.password_confirmation
        state.credential_details.privacy_policy = payload.privacy_policy
    },
    CLEAR_FORM_DETAILS(state) {
        state.account_details.title = ''
        state.account_details.first_name = ''
        state.account_details.last_name = ''
        state.account_details.suffix = ''
        state.account_details.gender = ''
        state.account_details.mobile_number = ''
        state.account_details.home_number = ''
        state.address_details.post_code = ''
        state.address_details.address_line_1 = ''
        state.address_details.address_line_2 = ''
        state.address_details.city = ''
        state.professional_details.gmc_or_nmc_number = ''
        state.professional_details.mpl_or_npl_number = ''
        state.professional_details.nhs_smart_card_id_number = ''
        state.professional_details.profession = ''
        state.professional_details.specialty = []
        state.professional_details.clinical_systems = []
        state.professional_details.spoken_languages = []
        state.professional_details.rates_per_hour = ''
        state.professional_details.rate_per_half_day_session = ''
        state.professional_details.ir35_scoped = false
        state.credential_details.email = ''
        state.credential_details.password = ''
        state.credential_details.privacy_policy = false
    },
    SET_PRACTICE_DETAILS(state, payload) {
        state.id = payload.id
        state.title = payload.title
        state.address = payload.address
        state.ccg = payload.ccg
        state.practice_code = payload.practice_code
    },
    SET_PRACTICE_ACCOUNT_DETAILS(state, payload) {
        state.title = payload.title,
        state.first_name = payload.first_name,
        state.last_name = payload.last_name,
        state.suffix = payload.suffix,
        state.role = payload.role,
        state.email = payload.email,
        state.password = payload.password,
        state.repeat_password = payload.repeat_password,
        state.privacy_policy = payload.privacy_policy
    },
    CLEAR_FORM_PRACTICE_DETAILS(state) {
        state.id = '',
        state.title = '',
        state.address = '',
        state.ccg = '',
        state.practice_code = '',
        state.title = '',
        state.first_name = '',
        state.last_name = '',
        state.suffix = '',
        state.role = '',
        state.email = '',
        state.password = '',
        state.repeat_password = '',
        state.privacy_policy = ''
    }
}

export const actions = {
    getProfessions({state, commit}) {
        this.$axios.$get(`/api/v1/professions`).then(res => {
            commit('SET_PROFESSIONS', res.data.professions)
        })
    },
    getQualifications({state, commit}) {
        this.$axios.$get(`/api/v1/qualifications`).then(res => {
            commit('SET_QUALIFICATIONS', res.data.qualifications)
        })
    },
    getClinicalSystems({state, commit}) {
        this.$axios.$get(`/api/v1/clinical-systems`).then(res => {
            commit('SET_CLINICAL_SYSTEMS', res.data.clinical_systems)
        })
    },
    getSpokenLanguages({state, commit}) {
        this.$axios.$get(`/api/v1/spoken-languages`).then(res => {
            commit('SET_SPOKEN_LANGUAGES', res.data.spoken_languages)
        })
    },
    registeredLocum({state, commit}) {
        let form = {}
        let professionForm = {
            gmc_or_nmc_number: state.professional_details.gmc_or_nmc_number,
            mpl_or_npl_number: state.professional_details.mpl_or_npl_number,
            nhs_smart_card_id_number: state.professional_details.nhs_smart_card_id_number,
            profession_id: (state.professional_details.profession).toString(),
            // refactor arrays
            qualification_id: state.professional_details.specialty.map(item => item.id),
            clinical_system_id: state.professional_details.clinical_systems.map(item => item.id),
            spoken_language_id: state.professional_details.spoken_languages.map(item => item.id),
            rate_per_hour: state.professional_details.rates_per_hour,
            rate_per_half_day_session: state.professional_details.rate_per_half_day_session,
            rate_per_whole_day_session: state.professional_details.rate_per_whole_day_session,
            ir35: state.professional_details.ir35_scoped
        }
        form = {...state.account_details, ...state.address_details, ...state.credential_details, ...professionForm}
        // ! post code only returns partial post code from google api
        console.log(form)
        this.$axios
            .$post(`/api/v1/register/locum`, form)
            .then(res => {
                console.log(res)
                // commit('CLEAR_FORM_DETAILS')
            }).catch(err => {
                console.log(err.response.data)
            })
        //response
    },
    registeredPractice({state, commit}) {
        let form = {}
        form = {...state.practice_details, ...state.practice_account_details}
        // API
        console.log(form)
        commit('CLEAR_FORM_PRACTICE_DETAILS')
    },
}

export const getters = {
    getProfessions (state) {
        return state.professions.map((item) => {
            return { id: item.id, name: item.name }
        })
    }
}