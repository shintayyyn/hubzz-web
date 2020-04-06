export default {
    SET_ACTIVE_COMPONENT (state, payload) {
        state.activeComponent = payload
    },
    // REGISTER PRACTICE
    SET_PRACTICE_DETAILS (state, payload) {
        state.search_results = payload.search_results
        state.practice_details.surgery_id = payload.surgery_id
        state.practice_details.name = payload.name
        state.practice_details.phone_number = payload.phone_number
        state.practice_details.code = payload.code
        state.practice_details.clinical_commissioning_group_name = payload.clinical_commissioning_group_name
        state.practice_details.address_line_1 = payload.address_line_1
        state.practice_details.address_line_2 = payload.address_line_2
        state.practice_details.address_line_3 = payload.address_line_3
        state.practice_details.address_line_4 = payload.address_line_4
        state.practice_details.address_line_5 = payload.address_line_5
        state.practice_details.postcode = payload.postcode
        state.practice_details.coordinate_x = payload.coordinate_x
        state.practice_details.coordinate_y = payload.coordinate_y
    },
    SET_PRACTICE_SURGERY_DETAILS (state, payload) {
        state.practice_surgery_details.name = payload.name
        state.practice_surgery_details.phone_number = payload.phone_number
        state.practice_surgery_details.code = payload.code
        state.practice_surgery_details.clinical_commissioning_group_name = payload.clinical_commissioning_group_name
        state.practice_surgery_details.address_line_1 = payload.address_line_1
        state.practice_surgery_details.address_line_2 = payload.address_line_2
        state.practice_surgery_details.address_line_3 = payload.address_line_3
        state.practice_surgery_details.address_line_4 = payload.address_line_4
        state.practice_surgery_details.address_line_5 = payload.address_line_5
        state.practice_surgery_details.postcode = payload.postcode
        state.practice_surgery_details.coordinate_x = payload.coordinate_x
        state.practice_surgery_details.coordinate_y = payload.coordinate_y
    },
    SET_PRACTICE_ACCOUNT_DETAILS (state, payload) {
        state.practice_account_details.type = payload.type
        state.practice_account_details.hub_type = payload.hub_type
        state.practice_account_details.surgery_id = payload.surgery_id
        // state.practice_account_details.parent_surgery_id = payload.parent_surgery_id
        // state.practice_account_details.children_surgery_id = payload.children_surgery_id
        state.practice_account_details.username = payload.username
        state.practice_account_details.email = payload.email
        state.practice_account_details.password = payload.password
        state.practice_account_details.password_confirmation = payload.password_confirmation
        state.practice_account_details.title = payload.title
        state.practice_account_details.first_name = payload.first_name
        state.practice_account_details.last_name = payload.last_name
        state.practice_account_details.suffix = payload.suffix
        state.practice_account_details.practice_role = payload.practice_role
        state.practice_account_details.practice_type_id = payload.practice_type_id
        state.practice_account_details.account_name = payload.account_name
        state.practice_account_details.bank_name = payload.bank_name
        state.practice_account_details.sort_code = payload.sort_code
        state.practice_account_details.account_number = payload.account_number
        state.practice_account_details.vat_registered = payload.vat_registered
        state.practice_account_details.vat_number = payload.vat_number
        state.practice_account_details.tax_year_end_date = payload.tax_year_end_date
        state.practice_account_details.referral_code = payload.referral_code
    },
    CLEAR_REGISTER_PRACTICE_FORM (state) {
        state.search_results = []
        state.practice_details.surgery_id = ''
        state.practice_details.name = ''
        state.practice_details.phone_number = ''
        state.practice_details.code = ''
        state.practice_details.clinical_commissioning_group_name = ''
        state.practice_details.address_line_1 = ''
        state.practice_details.address_line_2 = ''
        state.practice_details.address_line_3 = ''
        state.practice_details.postcode = ''
        state.practice_details.coordinate_x = ''
        state.practice_details.coordinate_y = ''
        state.practice_surgery_details.name = ''
        state.practice_surgery_details.phone_number = ''
        state.practice_surgery_details.code = ''
        state.practice_surgery_details.clinical_commissioning_group_name = ''
        state.practice_surgery_details.address_line_1 = ''
        state.practice_surgery_details.address_line_2 = ''
        state.practice_surgery_details.address_line_3 = ''
        state.practice_surgery_details.postcode = ''
        state.practice_surgery_details.coordinate_x = ''
        state.practice_surgery_details.coordinate_y = ''
        state.practice_account_details.type = ''
        state.practice_account_details.hub_type = ''
        state.practice_account_details.title = ''
        state.practice_account_details.first_name = ''
        state.practice_account_details.last_name = ''
        state.practice_account_details.suffix = ''
        state.practice_account_details.practice_role = ''
        state.practice_account_details.practice_type_id = []
        state.practice_account_details.username = ''
        state.practice_account_details.email = ''
        state.practice_account_details.password = ''
        state.practice_account_details.password_confirmation = ''
        state.practice_account_details.account_name = ''
        state.practice_account_details.bank_name = ''
        state.practice_account_details.sort_code = ''
        state.practice_account_details.account_number = ''
        state.practice_account_details.vat_registered = ''
        state.practice_account_details.vat_number = ''
        state.practice_account_details.tax_year_end_date = ''
    },
    SET_PRACTICE_DETAIL_FORM_ERROR (state, payload) {
        state.practice_detail_form_error = payload
    },
    SET_PRACTICE_SURGERY_DETAIL_FORM_ERROR (state, payload) {
        state.practice_surgery_detail_form_error = payload
    },
    SET_PRACTICE_ACCOUNT_DETAIL_FORM_ERROR (state, payload) {
        state.practice_account_detail_form_error = payload
    },
    CLEAR_PRACTICE_FORM_ERROR (state) {
        state.practice_detail_form_error = []
        state.practice_surgery_detail_form_error = []
        state.practice_account_detail_form_error = []
    },
    // REGISTER LOCUM
    SET_PROFESSIONS (state, payload) {
        state.professions = []
        payload.forEach((item) => {
            state.professions.push(item)
        })
    },
    SET_GP_QUALIFICATIONS (state, payload) {
        state.gp_qualifications = payload
    },
    SET_OTHERS_QUALIFICATIONS (state, payload) {
        state.others_qualifications = payload
    },
    SET_CLINICAL_SYSTEMS (state, payload) {
        state.clinical_systems = []
        payload.forEach((item) => {
            state.clinical_systems.push(item)
        })
    },
    SET_SPOKEN_LANGUAGES (state, payload) {
        state.spoken_languages = []
        payload.forEach((item) => {
            state.spoken_languages.push(item)
        })
    },
    SET_PRACTICE_TYPES (state, payload) {
        state.practice_types = []
        payload.forEach((item) => {
            state.practice_types.push(item)
        })
    },
    SET_MANDATORY_TRAININGS (state, payload) {
        state.mandatory_trainings = payload
    },
    SET_ACCOUNT_DETAILS (state, payload) {
        state.account_details.title = payload.title
        state.account_details.first_name = payload.first_name
        state.account_details.last_name = payload.last_name
        state.account_details.suffix = payload.suffix
        state.account_details.gender = payload.gender
        state.account_details.date_of_birth = payload.date_of_birth
        state.account_details.mobile_number = payload.mobile_number
        state.account_details.home_number = payload.home_number
        state.account_details.work_number = payload.work_number
    },
    SET_ADDRESS_DETAILS (state, payload) {
        state.address_details.post_code = payload.post_code
        state.address_details.address_line_1 = payload.address_line_1
        state.address_details.address_line_2 = payload.address_line_2
        state.address_details.address_line_3 = payload.address_line_3
    },
    SET_PROFESSIONAL_DETAILS (state, payload) {
        state.professional_details.view_locum_jobs = payload.view_locum_jobs
        state.professional_details.view_permanent_jobs = payload.view_permanent_jobs
        state.professional_details.reference_locum_compliance_documents = payload.reference_locum_compliance_documents
        // state.professional_details.gmc_or_nmc_number = payload.gmc_or_nmc_number
        // state.professional_details.mpl_or_npl_number = payload.mpl_or_npl_number
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
        state.professional_details.profession_category_id = payload.profession_category_id
    },
    SET_PAYROLL_DETAILS (state, payload) {
        state.payroll_details.employment_type = payload.employment_type
        state.payroll_details.utr_number = payload.utr_number
        state.payroll_details.company_registration_number = payload.company_registration_number
        state.payroll_details.paid_under_payroll = payload.paid_under_payroll
        state.payroll_details.payroll_account_name = payload.payroll_account_name
        state.payroll_details.payroll_bank_name = payload.payroll_bank_name
        state.payroll_details.payroll_sort_code = payload.payroll_sort_code
        state.payroll_details.payroll_account_number = payload.payroll_account_number
        state.payroll_details.account_name = payload.account_name
        state.payroll_details.bank_name = payload.bank_name
        state.payroll_details.sort_code = payload.sort_code
        state.payroll_details.account_number = payload.account_number
        state.payroll_details.ir35 = payload.ir35
        state.payroll_details.claim_nhs = payload.claim_nhs
        state.payroll_details.nhs_number = payload.nhs_number
    },
    SET_CREDENTIAL_DETAILS (state, payload) {
        state.credential_details.email = payload.email
        state.credential_details.password = payload.password
        state.credential_details.password_confirmation = payload.password_confirmation
        state.credential_details.referral_code = payload.referral_code
    },
    CLEAR_FORM_ERROR_DETAILS (state) {
        state.account_detail_form_error = []
        state.address_detail_form_error = []
        state.professional_detail_form_error = []
        state.payroll_detail_form_error = []
        state.credential_detail_form_error = []
        state.stage_1_details_form_error = []
        state.stage_2_pt_1_details_form_error = []
        state.stage_2_pt_2_details_form_error = []
    },
    SET_ACCOUNT_DETAIL_FORM_ERROR (state, payload) {
        state.account_detail_form_error = payload
    },
    SET_ADDRESS_DETAIL_FORM_ERROR (state, payload) {
        state.address_detail_form_error = payload
    },
    SET_PROFESSIONAL_DETAIL_FORM_ERROR (state, payload) {
        state.professional_detail_form_error = payload
    },
    SET_PAYROLL_DETAIL_FORM_ERROR (state, payload) {
        state.payroll_detail_form_error = payload
    },
    SET_CREDENTIAL_DETAIL_FORM_ERROR (state, payload) {
        state.credential_detail_form_error = payload
    },
    SET_STAGE_1_DETAILS (state, payload) {
        state.stage_1_details = payload
    },
    SET_STAGE_1_FORM_ERROR (state, payload) {
        state.stage_1_details_form_error = payload
    },
    SET_STAGE_2_PT_1_DETAILS (state, payload) {
        payload.reference_locum_compliance_documents.forEach(item => {
            state.stage_2_pt_1_details.reference_locum_compliance_documents.push({
                compliance_document_id: item.compliance_document_id,
                reference: item.reference
            })
        })
        state.stage_2_pt_1_details.nhs_smart_card_id_number = payload.nhs_smart_card_id_number
        state.stage_2_pt_1_details.post_code = payload.post_code
        state.stage_2_pt_1_details.address_line_1 = payload.address_line_1
        state.stage_2_pt_1_details.address_line_2 = payload.address_line_2
        state.stage_2_pt_1_details.address_line_3 = payload.address_line_3
    },
    SET_STAGE_2_PT_1_FORM_ERROR (state, payload) {
        state.stage_2_pt_1_details_form_error = payload
    },
    SET_STAGE_2_PT_2_DETAILS (state, payload) {
        state.stage_2_pt_2_details.privacy_policy = payload.privacy_policy
        state.stage_2_pt_2_details.referral_code = payload.referral_code
        payload.mandatory_locum_compliance_documents.forEach(item => {
            if (item.file) {
                state.stage_2_pt_2_details.mandatory_locum_compliance_documents.push({
                    country_id: item.country_id ? item.country_id : '',
                    compliance_document_id: item.compliance_document_id,
                    has_reference: item.has_reference ? item.has_reference : false,
                    reference: item.reference ? item.reference : "",
                    file: item.file
                })
                state.stage_2_pt_2_details.files.push(item.file)
            }
        })
    },
    SET_STAGE_2_PT_2_FORM_ERROR (state, payload) {
        state.stage_2_pt_2_details_form_error = payload
    },
    CLEAR_LOCUM_REGISTER_FORM (state) {
        state.stage_1_details.view_locum_jobs = false
        state.stage_1_details.view_permanent_jobs = false
        state.stage_1_details.profession_id = ""
        state.stage_1_details.title = ""
        state.stage_1_details.first_name = ""
        state.stage_1_details.last_name = ''
        state.stage_1_details.suffix = ''
        state.stage_1_details.mobile_number = ''
        state.stage_1_details.email = ''
        state.stage_1_details.password = ''
        state.stage_1_details.password_confirmation = ''

        state.stage_2_pt_1_details.reference_locum_compliance_documents = []
        state.stage_2_pt_1_details.nhs_smart_card_id_number = ""
        state.stage_2_pt_1_details.post_code = null
        state.stage_2_pt_1_details.address_line_1 = ""
        state.stage_2_pt_1_details.address_line_2 = ""
        state.stage_2_pt_1_details.address_line_3 = ""

        state.stage_2_pt_2_details.privacy_policy = false
        state.stage_2_pt_2_details.referral_code = null
        state.stage_2_pt_2_details.mandatory_locum_compliance_documents = []
        state.stage_2_pt_2_details.files = []
    },
    SET_COMPLIANCE_DOCUMENTS (state, payload) {
        state.reference_compliance_documents = payload.reference_compliance_documents
        state.mandatory_compliance_documents = payload.mandatory_compliance_documents
    },
    SET_SIGNUP_LOADING (state, payload) {
        console.log(payload)
        state.signup_loading = payload
    }
}