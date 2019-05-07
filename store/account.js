export const state = () => ({
  accountTab: 'general',
  generalDetails: {
    email: '',
    title: '',
    first_name: '',
    last_name: '',
    suffix: '',
    gender: '',
    mobile: '',
    home_number: '',
    post_code: '',
    line_1: '',
    line_2: '',
    line_3: ''
  },
  profileDetails: {
    gmc_or_nmc_number: '',
    mpl_or_npl_number: '',
    nhs_smart_card_id_number: '',
    headline: '',
    short_biography: '',
    special_requirements: '',
    profession: {},
    qualifications: [],
    clinical_systems: [],
    spoken_languages: [],
    rate_per_hour: '',
    rate_per_half_day_session: '',
    rate_per_whole_day_session: '',
    contact_name_1: '',
    contact_telephone_number_1: '',
    contact_email_address_1: '',
    contact_name_2: '',
    contact_telephone_number_2: '',
    contact_email_address_2: ''
  },
  avatarFile: null
})

export const mutations = {
  SET_ACCOUNT_TAB(state, payload) {
    state.accountTab = payload
  },
  SET_GENERAL_DETAILS(state, payload) {
    state.generalDetails.email = payload.email
    state.generalDetails.title = payload.title
    state.generalDetails.first_name = payload.first_name
    state.generalDetails.last_name = payload.last_name
    state.generalDetails.suffix = payload.suffix
    state.generalDetails.gender = payload.gender
    state.generalDetails.mobile = payload.mobile
    state.generalDetails.home_number = payload.home_number
    state.generalDetails.post_code = payload.post_code
    state.generalDetails.line_1 = payload.line_1
    state.generalDetails.line_2 = payload.line_2
    state.generalDetails.line_3 = payload.line_3
  },
  SET_PROFILE_DETAILS(state, payload) {
    state.profileDetails.qualifications = []
    state.profileDetails.clinical_systems = []
    state.profileDetails.spoken_languages = []
    state.profileDetails.gmc_or_nmc_number = payload.gmc_or_nmc_number
    state.profileDetails.mpl_or_npl_number = payload.mpl_or_npl_number
    state.profileDetails.nhs_smart_card_id_number = payload.nhs_smart_card_id_number
    state.profileDetails.headline = payload.headline
    state.profileDetails.short_biography = payload.short_biography
    state.profileDetails.special_requirements = payload.special_requirements
    state.profileDetails.profession = payload.profession

    payload.qualifications.forEach(item => {
        state.profileDetails.qualifications.push(item)
    })
    payload.clinical_systems.forEach(item => {
        state.profileDetails.clinical_systems.push(item)
    })
    payload.spoken_languages.forEach(item => {
        state.profileDetails.spoken_languages.push(item)
    })
    state.profileDetails.rate_per_hour = payload.rate_per_hour
    state.profileDetails.rate_per_half_day_session = payload.rate_per_half_day_session
    state.profileDetails.rate_per_whole_day_session = payload.rate_per_whole_day_session

    state.profileDetails.contact_name_1 = payload.contact_name_1
    state.profileDetails.contact_telephone_number_1 = payload.contact_telephone_number_1
    state.profileDetails.contact_email_address_1 = payload.contact_email_address_1
    state.profileDetails.contact_name_2 = payload.contact_name_2
    state.profileDetails.contact_telephone_number_2 = payload.contact_telephone_number_2
    state.profileDetails.contact_email_address_2 = payload.contact_email_address_2
  },
  SET_AVATAR_FILE(state, payload){
    state.avatarFile = payload
  }
}
