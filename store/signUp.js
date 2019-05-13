export const state = () => ({
    activeTab: 'account_details',
    // rate_range_modal: false,
    professions: [],
    qualifications: [],
    clinicalSystems: [],
    spokenLanguages: [],
    ccg: [],
    account_details: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        mobile_number: '',
        home_number: '',
        work_number: ''
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
        profession_id: '',
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        rate_per_hour: '',
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
        practice_id: '',
        name: '',
        address: '',
        ccg: '',
        practice_code: ''
    },
    practice_account_details: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        practice_role: '',
        email: '',
        password: '',
        password_confirmation: '',
        privacy_policy: false
    },
    account_detail_form_error: [],
    address_detail_form_error: [],
    professional_detail_form_error: [],
    credential_detail_form_error: [],
})

export const mutations = {
    // TOGGLE_RATE_RANGE_MODAL(state, payload) {
    //     state.rate_range_modal = payload
    // },
    SET_PROFESSIONS(state, payload) {
        state.professions = []
        payload.forEach(item => {
            state.professions.push(item)
        })
    },
    SET_QUALIFICATIONS(state, payload) {
        state.qualifications = []
        payload.forEach(item => {
            state.qualifications.push(item)
        })
    },
    SET_CLINICAL_SYSTEMS(state, payload) {
        state.clinicalSystems = []
        payload.forEach(item => {
            state.clinicalSystems.push(item)
        })
    },
    SET_SPOKEN_LANGUAGES(state, payload) {
        state.spokenLanguages = []
        payload.forEach(item => {
            state.spokenLanguages.push(item)
        })
    },
    SET_CCG(state, payload) {
        state.ccg = []
        payload.forEach(item => {
            state.ccg.push(item)
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
        state.account_details.work_number = payload.work_number
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
        state.professional_details.qualification_id = []
        payload.qualification_id.forEach(item => {
            state.professional_details.qualification_id.push(item)
        })
        state.professional_details.clinical_system_id = []
        payload.clinical_system_id.forEach(item => {
            state.professional_details.clinical_system_id.push(item)
        })
        state.professional_details.spoken_language_id = []
        payload.spoken_language_id.forEach(item => {
            state.professional_details.spoken_language_id.push(item)
        })
        state.professional_details.rate_per_hour = payload.rate_per_hour
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
        state.account_details.work_number = ''
        state.address_details.post_code = ''
        state.address_details.address_line_1 = ''
        state.address_details.address_line_2 = ''
        state.address_details.address_line_3 = ''
        state.professional_details.gmc_or_nmc_number = ''
        state.professional_details.mpl_or_npl_number = ''
        state.professional_details.nhs_smart_card_id_number = ''
        state.professional_details.profession_id = ''
        state.professional_details.qualification_id = []
        state.professional_details.clinical_system_id = []
        state.professional_details.spoken_language_id = []
        state.professional_details.rate_per_hour = ''
        state.professional_details.rate_per_half_day_session = ''
        state.professional_details.rate_per_whole_day_session = ''
        state.professional_details.ir35_scoped = false
        state.credential_details.email = ''
        state.credential_details.password = ''
        state.credential_details.password_confirmation = ''
        state.credential_details.privacy_policy = false
    },
    SET_PRACTICE_DETAILS(state, payload) {
        state.practice_details.practice_id = (payload.practice_id).toString()
        state.practice_details.name = payload.name
        state.practice_details.address = payload.address
        state.practice_details.ccg = payload.ccg
        state.practice_details.practice_code = payload.practice_code
    },
    SET_PRACTICE_ACCOUNT_DETAILS(state, payload) {
        state.practice_account_details.title = payload.title,
        state.practice_account_details.first_name = payload.first_name,
        state.practice_account_details.last_name = payload.last_name,
        state.practice_account_details.suffix = payload.suffix,
        state.practice_account_details.practice_role = payload.practice_role,
        state.practice_account_details.email = payload.email,
        state.practice_account_details.password = payload.password,
        state.practice_account_details.password_confirmation = payload.password_confirmation,
        state.practice_account_details.privacy_policy = payload.privacy_policy
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
    },
    SET_ACCOUNT_DETAIL_FORM_ERROR(state, payload) {
        state.account_detail_form_error = payload
    },
    SET_ADDRESS_DETAIL_FORM_ERROR(state, payload) {
        state.address_detail_form_error = payload
    },
    SET_PROFESSIONAL_DETAIL_FORM_ERROR(state, payload) {
        state.professional_detail_form_error = payload
    },
    SET_CREDENTIAL_DETAIL_FORM_ERROR(state, payload) {
        state.credential_detail_form_error = payload
    },
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
    getCCG({state, commit}) {
        this.$axios.$get(`/api/v1/clinical-commissioning-groups`).then(res => {
            commit('SET_CCG', res.data.clinical_commissioning_groups)
        })
    },
    registeredLocum({state, commit}) {
        commit('SET_CREDENTIAL_DETAIL_FORM_ERROR', [])
        let form = {}
        let professionForm = {
            gmc_or_nmc_number: state.professional_details.gmc_or_nmc_number,
            mpl_or_npl_number: state.professional_details.mpl_or_npl_number,
            nhs_smart_card_id_number: state.professional_details.nhs_smart_card_id_number,
            profession_id: (state.professional_details.profession).toString(),
            qualification_id: state.professional_details.specialty.map(item => item.id),
            clinical_system_id: state.professional_details.clinical_systems.map(item => item.id),
            spoken_language_id: state.professional_details.spoken_languages.map(item => item.id),
            rate_per_hour: state.professional_details.rate_per_hour,
            rate_per_half_day_session: state.professional_details.rate_per_half_day_session,
            rate_per_whole_day_session: state.professional_details.rate_per_whole_day_session,
            ir35: state.professional_details.ir35_scoped
        }
        form = {...state.account_details, ...state.address_details, ...state.credential_details, ...professionForm}
        this.$axios
            .$post(`/api/v1/register/locum`, form)
            .then(res => {
                console.log(res)
                commit('CLEAR_FORM_DETAILS')
                this.$router.push('/sign-up/success')
            }).catch(err => {
                // set formError to store
                if (err.response && err.response.data && err.response.data.error_messages && err.response.data.error_messages.length > 0) {
                    const accountDetailError = err.response.data.error_messages.filter(errorMessage => {
                        return errorMessage.field === 'title' || errorMessage.field === 'first_name' || errorMessage.field === 'last_name'
                        || errorMessage.field === 'suffix' || errorMessage.field === 'gender' || errorMessage.field === 'mobile_number'
                        || errorMessage.field === 'home_number'
                    })
                    commit('SET_ACCOUNT_DETAIL_FORM_ERROR', accountDetailError)
                    const addressDetailError = err.response.data.error_messages.filter(errorMessage => {
                        return errorMessage.field === 'post_code' || errorMessage.field === 'address_line_1' || errorMessage.field === 'address_line_2'
                        || errorMessage.field === 'address_line_3'
                    })
                    commit('SET_ADDRESS_DETAIL_FORM_ERROR', addressDetailError)
                    const professionalDetailError = err.response.data.error_messages.filter(errorMessage => {
                        return errorMessage.field === 'gmc_or_nmc_number' || errorMessage.field === 'mpl_or_npl_number'
                        || errorMessage.field === 'nhs_smart_card_id_number' || errorMessage.field === 'profession_id'
                        || errorMessage.field === 'qualification_id' || errorMessage.field === 'clinical_system_id'
                        || errorMessage.field === 'spoken_language_id' || errorMessage.field === 'rate_per_hour'
                        || errorMessage.field === 'rate_per_hald_day_session' || errorMessage.field === 'rate_per_whole_day_session'
                        || errorMessage.field === 'ir35'
                    })
                    commit('SET_PROFESSIONAL_DETAIL_FORM_ERROR', professionalDetailError)
                    const credentialDetailError = err.response.data.error_messages.filter(errorMessage => {
                        return errorMessage.field === 'email' || errorMessage.field === 'password' || errorMessage.field === 'password_confirmation'
                        || errorMessage.field === 'privacy_policy'
                    })
                    commit('SET_CREDENTIAL_DETAIL_FORM_ERROR', credentialDetailError)
                    console.log(state.account_detail_form_error)
                    console.log(state.address_detail_form_error)
                    console.log(state.professional_detail_form_error)
                    console.log(state.credential_detail_form_error)
                    if (accountDetailError.length > 0) {
                        commit('SET_ACTIVE_TAB', 'account_details')
                    } else if (addressDetailError.length > 0) {
                        commit('SET_ACTIVE_TAB', 'address_details')
                    } else if (professionalDetailError.length > 0) {
                        commit('SET_ACTIVE_TAB', 'professional_details')
                    } else if (credentialDetailError.length > 0) {
                        this.$router.push('/sign-up/locum')
                        commit('SET_ACTIVE_TAB', 'credential_details')
                    } 
                }
            })
        //response
    },
    registeredPractice({state, commit}) {
        let form = {}
        form = {...state.practice_details, ...state.practice_account_details}
        this.$axios
            .$post(`/api/v1/register/practice`, form)
            .then(res => {
                commit('CLEAR_FORM_PRACTICE_DETAILS')
                this.$router.push('/sign-up/success')
            }).catch(err => {
                console.log(err)
            })
    },
}

export const getters = {
    getProfessions (state) {
        return state.professions.map((item) => {
            return { id: item.id, name: item.name }
        })
    }
}