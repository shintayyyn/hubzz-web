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
        address_line_1: '',
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
        rates: {
            per_hour: '',
            per_session: ''
        },
        ir35_scoped: false
    }
})

export const mutations = {
    SET_ACTIVE_TAB(state, payload) {
        state.activeTab = payload
    },
    SET_ACCOUNT_DETAILS(state, payload) {
        state.account_details = payload
    },
    SET_ADDRESS_DETAILS(state, payload) {
        state.address_details = payload
    },
    SET_PROFESSIONAL_DETAILS(state, payload) {
        state.professional_details = payload
    }
}
  