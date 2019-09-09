export const state = () => ({
  activeComponent: 'LocumAccountDetails',
  // register practice
  search_results: [],
  practice_details: {
    surgery_id: ''
  },
  practice_account_details: {
    title: '',
    first_name: '',
    last_name: '',
    suffix: '',
    practice_role: '',
    practice_type_id: [],
    email: '',
    password: '',
    password_confirmation: ''
  },
  practice_account_detail_form_error: [],
  //  register locum
  professions: [],
  gp_qualifications: [],
  others_qualifications: [],
  clinical_systems: [],
  spoken_languages: [],
  practice_types: [],
  mandatory_trainings: [],
  account_details: {
    title: '',
    first_name: '',
    last_name: '',
    suffix: '',
    gender: '',
    mobile_number: ''
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
    min_rate_per_hour: 0,
    max_rate_per_hour: 0,
    min_rate_per_half_day_session: 0,
    max_rate_per_half_day_session: 0,
    min_rate_per_whole_day_session: 0,
    max_rate_per_whole_day_session: 0,
    ir35: null,
    practice_type_id: [],
    mandatory_training_id: [],
  },
  credential_details: {
    email: '',
    password: '',
    password_confirmation: ''
  },
  account_detail_form_error: [],
  address_detail_form_error: [],
  professional_detail_form_error: [],
  credential_detail_form_error: []
})

export const mutations = {
  SET_ACTIVE_COMPONENT(state, payload) {
    state.activeComponent = payload
  },
  // REGISTER PRACTICE
  SET_PRACTICE_DETAILS(state, payload) {
    state.practice_details.surgery_id = payload.surgery_id
    state.search_results = payload.search_results
  },
  SET_PRACTICE_ACCOUNT_DETAILS(state, payload) {
    (state.practice_account_details.title = payload.title),
      (state.practice_account_details.first_name = payload.first_name),
      (state.practice_account_details.last_name = payload.last_name),
      (state.practice_account_details.suffix = payload.suffix),
      (state.practice_account_details.practice_role = payload.practice_role),
      (state.practice_account_details.practice_type_id = payload.practice_type_id),
      (state.practice_account_details.email = payload.email),
      (state.practice_account_details.password = payload.password),
      (state.practice_account_details.password_confirmation = payload.password_confirmation)
  },
  CLEAR_FORM_PRACTICE_DETAILS(state) {
    state.practice_details.surgery_id = ''
    state.search_results = []
    state.practice_account_details.title = ''
    state.practice_account_details.first_name = ''
    state.practice_account_details.last_name = ''
    state.practice_account_details.suffix = ''
    state.practice_account_details.practice_role = ''
    state.practice_account_details.practice_type_id = []
    state.practice_account_details.email = ''
    state.practice_account_details.password = ''
    state.practice_account_details.password_confirmation = ''
  },
  SET_PRACTICE_ACCOUNT_DETAIL_FORM_ERROR(state, payload) {
    state.practice_account_detail_form_error = payload
  },
  // REGISTER LOCUM
  SET_PROFESSIONS(state, payload) {
    state.professions = []
    payload.forEach((item) => {
      state.professions.push(item)
    })
  },
  SET_GP_QUALIFICATIONS(state, payload) {
    state.gp_qualifications = payload
  },
  SET_OTHERS_QUALIFICATIONS(state, payload) {
    state.others_qualifications = payload
  },
  SET_CLINICAL_SYSTEMS(state, payload) {
    state.clinical_systems = []
    payload.forEach((item) => {
      state.clinical_systems.push(item)
    })
  },
  SET_SPOKEN_LANGUAGES(state, payload) {
    state.spoken_languages = []
    payload.forEach((item) => {
      state.spoken_languages.push(item)
    })
  },
  SET_PRACTICE_TYPES(state, payload) {
    state.practice_types = []
    payload.forEach((item) => {
      state.practice_types.push(item)
    })
  },
  SET_MANDATORY_TRAININGS(state, payload) {
    state.mandatory_trainings = payload
  },
  SET_ACCOUNT_DETAILS(state, payload) {
    state.account_details.title = payload.title
    state.account_details.first_name = payload.first_name
    state.account_details.last_name = payload.last_name
    state.account_details.suffix = payload.suffix
    state.account_details.gender = payload.gender
    state.account_details.mobile_number = payload.mobile_number
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
    state.professional_details.profession_id = payload.profession_id
    state.professional_details.qualification_id = payload.qualification_id
    state.professional_details.clinical_system_id = payload.clinical_system_id
    state.professional_details.spoken_language_id = payload.spoken_language_id
    state.professional_details.practice_type_id = payload.practice_type_id
    state.professional_details.mandatory_training_id = payload.mandatory_training_id
    state.professional_details.min_rate_per_hour = payload.min_rate_per_hour
    state.professional_details.max_rate_per_hour = payload.max_rate_per_hour
    state.professional_details.min_rate_per_half_day_session = payload.min_rate_per_half_day_session
    state.professional_details.max_rate_per_half_day_session = payload.max_rate_per_half_day_session
    state.professional_details.min_rate_per_whole_day_session = payload.min_rate_per_whole_day_session
    state.professional_details.max_rate_per_whole_day_session = payload.max_rate_per_whole_day_session
    state.professional_details.ir35 = payload.ir35
  },
  SET_CREDENTIAL_DETAILS(state, payload) {
    state.credential_details.email = payload.email
    state.credential_details.password = payload.password
    state.credential_details.password_confirmation = payload.password_confirmation
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
    state.professional_details.min_rate_per_hour = ''
    state.professional_details.max_rate_per_hour = ''
    state.professional_details.min_rate_per_half_day_session = ''
    state.professional_details.max_rate_per_half_day_session = ''
    state.professional_details.min_rate_per_whole_day_session = ''
    state.professional_details.max_rate_per_whole_day_session = ''
    state.professional_details.ir35 = false
    state.professional_details.practice_type_id = []
    state.credential_details.email = ''
    state.credential_details.password = ''
    state.credential_details.password_confirmation = ''
    state.credential_details.privacy_policy = false
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
  }
}

export const actions = {
  getProfessions({ commit }) {
    this.$axios.$get(`/api/v1/professions`).then((res) => {
      commit('SET_PROFESSIONS', res.data.professions)
    })
  },
  getQualifications({ commit }) {
    this.$axios.$get(`/api/v1/profession-categories`).then((res) => {
      let gp = res.data.profession_categories.find((category) => category.id === 1)
      let others = res.data.profession_categories.find((category) => category.id === 2)
      commit('SET_GP_QUALIFICATIONS', gp.qualifications)
      commit('SET_OTHERS_QUALIFICATIONS', others.qualifications)
    })
  },
  getClinicalSystems({ commit }) {
    this.$axios.$get(`/api/v1/clinical-systems`).then((res) => {
      commit('SET_CLINICAL_SYSTEMS', res.data.clinical_systems)
    })
  },
  getSpokenLanguages({ commit }) {
    this.$axios.$get(`/api/v1/spoken-languages`).then((res) => {
      commit('SET_SPOKEN_LANGUAGES', res.data.spoken_languages)
    })
  },
  getPracticeTypes({ commit }) {
    this.$axios.$get(`/api/v1/practice-types`).then((res) => {
      commit('SET_PRACTICE_TYPES', res.data.practice_types)
    })
  },
  getMandatoryTrainings({ commit }) {
    this.$axios.$get('/api/v1/mandatory-trainings').then((res) => {
      commit('SET_MANDATORY_TRAININGS', res.data.mandatory_trainings)
    })
  },
  registeredPractice({ state, commit }) {
    let form = {}
    form = { ...state.practice_details, ...state.practice_account_details }
    this.$axios
      .$post(`/api/v1/register/practice`, form)
      .then((res) => {
        commit('CLEAR_FORM_PRACTICE_DETAILS')
        this.$router.push('/sign-up/success')
      })
      .catch((err) => {
        if (
          err.response &&
          err.response.data &&
          err.response.data.error_messages &&
          err.response.data.error_messages.length > 0
        ) {
          const practiceAccountDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'title' ||
              errorMessage.field === 'first_name' ||
              errorMessage.field === 'last_name' ||
              errorMessage.field === 'suffix' ||
              errorMessage.field === 'practice_role' ||
              errorMessage.field === 'practice_type_id' ||
              errorMessage.field === 'email' ||
              errorMessage.field === 'password' ||
              errorMessage.field === 'password_confirmation' ||
              errorMessage.field === 'surgery_id'
            )
          })
          commit('SET_PRACTICE_ACCOUNT_DETAIL_FORM_ERROR', practiceAccountDetailError)
        }
      })
  },
  registeredLocum({ state, commit }) {
    commit('SET_CREDENTIAL_DETAIL_FORM_ERROR', [])
    let form = {}
    form = { ...state.account_details, ...state.address_details, ...state.credential_details, ...state.professional_details }
    this.$axios
      .$post(`/api/v1/register/locum`, form)
      .then((res) => {
        commit('CLEAR_FORM_DETAILS')
        this.$router.push('/sign-up/success')
      })
      .catch((err) => {
        // set formError to store
        if (
          err.response &&
          err.response.data &&
          err.response.data.error_messages &&
          err.response.data.error_messages.length > 0
        ) {
          const accountDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'title' ||
              errorMessage.field === 'first_name' ||
              errorMessage.field === 'last_name' ||
              errorMessage.field === 'suffix' ||
              errorMessage.field === 'gender' ||
              errorMessage.field === 'mobile_number' ||
              errorMessage.field === 'home_number'
            )
          })
          commit('SET_ACCOUNT_DETAIL_FORM_ERROR', accountDetailError)
          const addressDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'post_code' ||
              errorMessage.field === 'address_line_1' ||
              errorMessage.field === 'address_line_2' ||
              errorMessage.field === 'address_line_3'
            )
          })
          commit('SET_ADDRESS_DETAIL_FORM_ERROR', addressDetailError)
          const professionalDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'gmc_or_nmc_number' ||
              errorMessage.field === 'mpl_or_npl_number' ||
              errorMessage.field === 'nhs_smart_card_id_number' ||
              errorMessage.field === 'profession_id' ||
              errorMessage.field === 'qualification_id' ||
              errorMessage.field === 'clinical_system_id' ||
              errorMessage.field === 'spoken_language_id' ||
              errorMessage.field === 'min_rate_per_hour' ||
              errorMessage.field === 'max_rate_per_hour' ||
              errorMessage.field === 'min_rate_per_half_day_session' ||
              errorMessage.field === 'max_rate_per_half_day_session' ||
              errorMessage.field === 'min_rate_per_whole_day_session' ||
              errorMessage.field === 'max_rate_per_whole_day_session' ||
              errorMessage.field === 'practice_type_id' ||
              errorMessage.field === 'mandatory_training_id' ||
              errorMessage.field === 'ir35'
            )
          })
          commit('SET_PROFESSIONAL_DETAIL_FORM_ERROR', professionalDetailError)
          const credentialDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'email' ||
              errorMessage.field === 'password' ||
              errorMessage.field === 'password_confirmation' ||
              errorMessage.field === 'privacy_policy'
            )
          })
          commit('SET_CREDENTIAL_DETAIL_FORM_ERROR', credentialDetailError)
          if (accountDetailError.length > 0) {
            commit('SET_ACTIVE_COMPONENT', 'LocumAccountDetails')
          } else if (addressDetailError.length > 0) {
            //   commit('SET_ACTIVE_TAB', 'address_details')
            commit('SET_ACTIVE_COMPONENT', 'LocumAddressDetails')
          } else if (professionalDetailError.length > 0) {
            //   commit('SET_ACTIVE_TAB', 'professional_details')
            commit('SET_ACTIVE_COMPONENT', 'LocumProfessionalDetails')
          } else if (credentialDetailError.length > 0) {
            this.$router.push('/sign-up/locum')
            //   commit('SET_ACTIVE_TAB', 'credential_details')
            commit('SET_ACTIVE_COMPONENT', 'LocumCredentialDetails')
          }
        }
      })
    //response
  }
}

export const getters = {
  getProfessions(state) {
    return state.professions.map((item) => {
      return { value: item.id, label: item.name }
    })
  },
  getGpQualifications(state) {
    return state.gp_qualifications.map((item) => {
      return { value: item.id, label: item.name }
    })
  },
  getOthersQualifications(state) {
    return state.others_qualifications.map((item) => {
      return { value: item.id, label: item.name }
    })
  },
  getClinicalSystems(state) {
    return state.clinical_systems.map((item) => {
      return { value: item.id, label: item.name }
    })
  },
  getSpokenLanguages(state) {
    return state.spoken_languages.map((item) => {
      return { value: item.id, label: item.name }
    })
  },
  getPracticeTypes(state) {
    return state.practice_types.map((item) => {
      return { value: item.id, label: item.name }
    })
  },
  getMandatoryTrainings(state) {
    return state.mandatory_trainings.map((item) => {
      return { value: item.id, label: item.name }
    })
  }
}
