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
    address_1: '',
    address_2: '',
    city: ''
  },
  profileDetails: {
    gmc_nmc_number: '',
    mpl_npl_number: '',
    nhs_number: '',
    headline: '',
    biography: '',
    requirements: '',
    profession: '',
    specialty: [],
    clinical_systems: [],
    spoken_languages: [],
    rates_per_hour: '',
    rates_per_session: '',
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
    state.generalDetails.address_1 = payload.address_1
    state.generalDetails.address_2 = payload.address_2
    state.generalDetails.city = payload.city
  },
  SET_PROFILE_DETAILS(state, payload) {
    state.profileDetails.specialty = []
    state.profileDetails.clinical_systems = []
    state.profileDetails.spoken_languages = []
    state.profileDetails.gmc_nmc_number = payload.gmc_nmc_number
    state.profileDetails.mpl_npl_number = payload.mpl_npl_number
    state.profileDetails.nhs_number = payload.nhs_number
    state.profileDetails.headline = payload.headline
    state.profileDetails.biography = payload.biography
    state.profileDetails.requirements = payload.requirements
    state.profileDetails.profession = payload.profession
    payload.specialty.forEach(item => {
        state.profileDetails.specialty.push(item)
    })
    payload.clinical_systems.forEach(item => {
        state.profileDetails.clinical_systems.push(item)
    })
    payload.spoken_languages.forEach(item => {
        state.profileDetails.spoken_languages.push(item)
    })
    state.profileDetails.rates_per_hour = payload.rates_per_hour
    state.profileDetails.rates_per_session = payload.rates_per_session
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
