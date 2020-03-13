export default {
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
        form = {
            ...state.practice_surgery_details,
            ...state.practice_account_details,
        }

        this.$axios
            .$post(`/api/v1/register/practice?referral_code=${this.$router.app._route.query.referral_code}`, form)
            .then(() => {
                commit('CLEAR_REGISTER_PRACTICE_FORM')
                commit('CLEAR_PRACTICE_FORM_ERROR')
                this.$router.push('/sign-up/success')
            })
            .catch((err) => {
                console.log('err', err.response || err)
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.error_messages &&
                    err.response.data.error_messages.length > 0
                ) {
                    const practiceSurgeryDetailError = err.response.data.error_messages.filter((errorMessage) => {
                        return (
                            errorMessage.field === 'name' ||
                            errorMessage.field === 'phone_number' ||
                            errorMessage.field === 'clinical_commissioning_group_name' ||
                            errorMessage.field === 'code' ||
                            errorMessage.field === 'address_line_1' ||
                            errorMessage.field === 'address_line_2' ||
                            errorMessage.field === 'address_line_3' ||
                            errorMessage.field === 'address_line_4' ||
                            errorMessage.field === 'address_line_5' ||
                            errorMessage.field === 'postcode' ||
                            errorMessage.field === 'coordinates_x' ||
                            errorMessage.field === 'coordinates_y'
                        )
                    })
                    commit('SET_PRACTICE_SURGERY_DETAIL_FORM_ERROR', practiceSurgeryDetailError)

                    const practiceAccountDetailError = err.response.data.error_messages.filter((errorMessage) => {
                        return (
                            errorMessage.field === 'type' ||
                            errorMessage.field === 'hub_type' ||
                            errorMessage.field === 'title' ||
                            errorMessage.field === 'first_name' ||
                            errorMessage.field === 'last_name' ||
                            errorMessage.field === 'suffix' ||
                            errorMessage.field === 'practice_role' ||
                            errorMessage.field === 'practice_type_id' ||
                            errorMessage.field === 'email' ||
                            errorMessage.field === 'password' ||
                            errorMessage.field === 'password_confirmation' ||
                            errorMessage.field === 'account_name' ||
                            errorMessage.field === 'bank_name' ||
                            errorMessage.field === 'sort_code' ||
                            errorMessage.field === 'account_number' ||
                            errorMessage.field === 'vat_registered' ||
                            errorMessage.field === 'vat_number' ||
                            errorMessage.field === 'tax_year_end_date'
                        )
                    })
                    commit('SET_PRACTICE_ACCOUNT_DETAIL_FORM_ERROR', practiceAccountDetailError)
                    if (practiceSurgeryDetailError.length > 0) {
                        // commit('SET_ACTIVE_COMPONENT', 'LocumAccountDetails')
                    } else if (practiceAccountDetailError.length > 0) {
                        // commit('SET_ACTIVE_COMPONENT', 'LocumAddressDetails')
                    }
                }
            })
    },
    registeredLocum({ state, commit }) {
        let form = {}
        form = {
            ...state.account_details,
            ...state.address_details,
            ...state.credential_details,
            ...state.payroll_details,
            ...state.professional_details,
            qualification_id: state.professional_details.qualification_id.map(item => item.value),
            clinical_system_id: state.professional_details.clinical_system_id.map(item => item.value),
            spoken_language_id: state.professional_details.spoken_language_id.map(item => item.value)
        }
        this.$axios
            .$post(`/api/v1/register/locum?referral_code=${this.$router.app._route.query.referral_code}`, form)
            .then(() => {
                commit('CLEAR_FORM_ERROR_DETAILS')
                this.$router.push('/sign-up/success')
            })
            .catch((err) => {
                console.log('err', err.response || err)
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
                            errorMessage.field === 'date_of_birth' ||
                            errorMessage.field === 'mobile_number' ||
                            errorMessage.field === 'home_number' ||
                            errorMessage.field === 'work_number'
                        )
                    })
                    commit('SET_ACCOUNT_DETAIL_FORM_ERROR', accountDetailError)
                    const addressDetailError = err.response.data.error_messages.filter((errorMessage) => {
                        return (
                            errorMessage.field === 'post_code' ||
                            errorMessage.field === 'address_line_1' ||
                            errorMessage.field === 'address_line_2' ||
                            errorMessage.field === 'address_line_3' ||
                            errorMessage.field === 'address_line_4' ||
                            errorMessage.field === 'address_line_5'
                        )
                    })
                    commit('SET_ADDRESS_DETAIL_FORM_ERROR', addressDetailError)
                    const professionalDetailError = err.response.data.error_messages.filter((errorMessage) => {
                        return (
                            errorMessage.field === 'view_locum_jobs' ||
                            errorMessage.field === 'view_permanent_jobs' ||
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
                            errorMessage.field === 'mandatory_training_id'
                        )
                    })
                    commit('SET_PROFESSIONAL_DETAIL_FORM_ERROR', professionalDetailError)
                    const payrollDetailError = err.response.data.error_messages.filter((errorMessage) => {
                        return (
                            errorMessage.field === 'employment_type' ||
                            errorMessage.field === 'company_registration_number' ||
                            errorMessage.field === 'utr_number' ||
                            errorMessage.field === 'paid_under_payroll' ||
                            errorMessage.field === 'payroll_account_name' ||
                            errorMessage.field === 'payroll_bank_name' ||
                            errorMessage.field === 'payroll_sort_code' ||
                            errorMessage.field === 'payroll_account_number' ||
                            errorMessage.field === 'account_name' ||
                            errorMessage.field === 'bank_name' ||
                            errorMessage.field === 'sort_code' ||
                            errorMessage.field === 'account_number' ||
                            errorMessage.field === 'ir35' ||
                            errorMessage.field === 'claim_nhs' ||
                            errorMessage.field === 'nhs_number'
                        )
                    })
                    commit('SET_PAYROLL_DETAIL_FORM_ERROR', payrollDetailError)
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
                        commit('SET_ACTIVE_COMPONENT', 'LocumAddressDetails')
                    } else if (professionalDetailError.length > 0) {
                        commit('SET_ACTIVE_COMPONENT', 'LocumProfessionalDetails')
                    } else if (credentialDetailError.length > 0) {
                        commit('SET_ACTIVE_COMPONENT', 'LocumCredentialDetails')
                    } else if (payrollDetailError.length > 0) {
                        commit('SET_ACTIVE_COMPONENT', 'LocumPayrollDetails')
                    }
                }
            })
    }
}