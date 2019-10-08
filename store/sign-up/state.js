export default () => ({
    activeComponent: 'LocumAccountDetails',
    // register practice
    search_results: [],
    practice_details: {
        surgery_id: ''
    },
    practice_account_details: {
        type: '',
        parent_surgery_id: [],
        children_surgery_id: [],
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