export default {
    SET_ACTIVE_COMPONENT(state, payload) {
        state.activeComponent = payload
    },
    // REGISTER PRACTICE
    SET_PRACTICE_DETAILS(state, payload) {
        state.practice_details.surgery_id = payload.surgery_id
        state.search_results = payload.search_results
    },
    SET_PRACTICE_ACCOUNT_DETAILS(state, payload) {
        state.practice_account_details.type = payload.type
        state.practice_account_details.surgery_id = payload.surgery_id
        state.practice_account_details.parent_surgery_id = payload.parent_surgery_id
        state.practice_account_details.children_surgery_id = payload.children_surgery_id
        state.practice_account_details.email = payload.email
        state.practice_account_details.password = payload.password
        state.practice_account_details.password_confirmation = payload.password_confirmation
        state.practice_account_details.title = payload.title
        state.practice_account_details.first_name = payload.first_name
        state.practice_account_details.last_name = payload.last_name
        state.practice_account_details.suffix = payload.suffix
        state.practice_account_details.practice_role = payload.practice_role
        state.practice_account_details.practice_type_id = payload.practice_type_id
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