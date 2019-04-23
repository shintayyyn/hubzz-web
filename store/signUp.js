export const state = () => ({
    activeTab: 'account_details',
    account_details: {
        title: '',
        first_name: '',
        last_name: '',
        suffix: '',
        gender: '',
        mobile: '',
        landline: ''
    },
    address_details: {
        post_code: '',
        address_line_1: '',
        address_line_2: '',
        city: ''
    },
    professional_details: {
        gmc_nmc_number: '',
        mpl_npl_number: '',
        nhs_smart_card_number: '',
        profession: '',
        specialty: [],
        clinical_systems: [],
        spoken_languages: [],
        rates_per_hour: '',
        rates_per_session: '',
        ir35_scoped: false
    },
    credential_details: {
        email: '',
        password: '',
        privacy_policy: false
    }
})

export const mutations = {
    SET_ACTIVE_TAB(state, payload) {
        state.activeTab = payload
    },
    SET_ACCOUNT_DETAILS(state, payload) {
        state.address_details.title = payload.title
        state.address_details.first_name = payload.first_name
        state.address_details.last_name = payload.last_name
        state.address_details.suffix = payload.suffix
        state.address_details.gender = payload.gender
        state.address_details.mobile = payload.mobile
        state.address_details.landline = payload.landline
    },
    SET_ADDRESS_DETAILS(state, payload) {
        state.address_details.post_code = payload.post_code
        state.address_details.address_line_1 = payload.address_line_1
        state.address_details.address_line_2 = payload.address_line_2
        state.address_details.city = payload.city
    },
    SET_PROFESSIONAL_DETAILS(state, payload) {
        state.professional_details.gmc_nmc_number = payload.gmc_nmc_number
        state.professional_details.mpl_npl_number = payload.mpl_npl_number
        state.professional_details.nhs_smart_card_number = payload.nhs_smart_card_number
        state.professional_details.profession = payload.profession
        payload.specialty.forEach(item => {
            if (!state.professional_details.specialty.includes(item)) {
                state.professional_details.specialty.push(item)
            }
        })
        payload.clinical_systems.forEach(item => {
            if (!state.professional_details.clinical_systems.includes(item)) {
                state.professional_details.clinical_systems.push(item)
            }
        })
        payload.spoken_languages.forEach(item => {
            if (!state.professional_details.spoken_languages.includes(item)) {
                state.professional_details.spoken_languages.push(item)
            }
        })
        state.professional_details.rates_per_hour = payload.rates_per_hour
        state.professional_details.rates_per_session = payload.rates_per_session
        state.professional_details.ir35_scoped = payload.ir35_scoped
    },
    SET_CREDENTIAL_DETAILS(state, payload) {
        state.credential_details.email = payload.email
        state.credential_details.password = payload.password
        state.credential_details.privacy_policy = payload.privacy_policy
    },
    CLEAR_FORM_DETAILS(state) {
        state.account_details.title = ''
        state.account_details.first_name = ''
        state.account_details.last_name = ''
        state.account_details.suffix = ''
        state.account_details.gender = ''
        state.account_details.mobile = ''
        state.account_details.landline = ''
        state.address_details.post_code = ''
        state.address_details.address_line_1 = ''
        state.address_details.address_line_2 = ''
        state.address_details.city = ''
        state.professional_details.gmc_nmc_number = ''
        state.professional_details.mpl_npl_number = ''
        state.professional_details.nhs_smart_card_number = ''
        state.professional_details.profession = ''
        state.professional_details.specialty = []
        state.professional_details.clinical_systems = []
        state.professional_details.spoken_languages = []
        state.professional_details.rates_per_hour = ''
        state.professional_details.rates_per_session = ''
        state.professional_details.ir35_scoped = false
        state.credential_details.email = ''
        state.credential_details.password = ''
        state.credential_details.privacy_policy = false
    }
}

export const actions = {
    registeredLocum({state, commit}) {
        let form = {}
        form = {...state.account_details, ...state.address_details, ...state.professional_details, ...state.credential_details}
        // API
        console.log(form)
        commit('CLEAR_FORM_DETAILS')
    }
}