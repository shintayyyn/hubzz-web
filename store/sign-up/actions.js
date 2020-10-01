export default {
  getProfessions ({ commit, }) {
    this.$axios.$get(`/api/v1/professions`).then((res) => {
      commit('SET_PROFESSIONS', res.data.professions)
    })
  },
  getQualifications ({ commit, }) {
    this.$axios.$get(`/api/v1/profession-categories`).then((res) => {
      let gp = res.data.profession_categories.find((category) => category.name === 'GP')
      let others = res.data.profession_categories.find((category) => category.name !== 'GP')
      commit('SET_GP_QUALIFICATIONS', gp.qualifications)
      commit('SET_OTHERS_QUALIFICATIONS', others.qualifications)
    })
  },
  getClinicalSystems ({ commit, }) {
    this.$axios.$get(`/api/v1/clinical-systems`).then((res) => {
      commit('SET_CLINICAL_SYSTEMS', res.data.clinical_systems)
    })
  },
  getSpokenLanguages ({ commit, }) {
    this.$axios.$get(`/api/v1/spoken-languages`).then((res) => {
      commit('SET_SPOKEN_LANGUAGES', res.data.spoken_languages)
    })
  },
  getPracticeTypes ({ commit, }) {
    this.$axios.$get(`/api/v1/practice-types`).then((res) => {
      commit('SET_PRACTICE_TYPES', res.data.practice_types)
    })
  },
  getMandatoryTrainings ({ commit, }) {
    this.$axios.$get('/api/v1/mandatory-trainings').then((res) => {
      commit('SET_MANDATORY_TRAININGS', res.data.mandatory_trainings)
    })
  },
  registeredPractice ({ state, commit, }) {
    let form = {}
    form = {
      ...state.practice_surgery_details,
      ...state.practice_account_details,
    }

    this.$axios
      .$post(`/api/v1/register/practice?referral_code=${state.practice_account_details.referral_code ? state.practice_account_details.referral_code.toUpperCase() : this.$router.app._route.query.referral_code}`, form)
      .then(() => {
        commit('CLEAR_REGISTER_PRACTICE_FORM')
        commit('CLEAR_PRACTICE_FORM_ERROR')
        this.$router.push('/sign-up/success')
      })
      .catch((err) => {
        console.log('err', err.response || err)
        if (
          err.response
                    && err.response.data
                    && err.response.data.error_messages
                    && err.response.data.error_messages.length > 0
        ) {
          const practiceSurgeryDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'name'
                            || errorMessage.field === 'phone_number'
                            || errorMessage.field === 'clinical_commissioning_group_name'
                            || errorMessage.field === 'code'
                            || errorMessage.field === 'address_line_1'
                            || errorMessage.field === 'address_line_2'
                            || errorMessage.field === 'address_line_3'
                            || errorMessage.field === 'address_line_4'
                            || errorMessage.field === 'address_line_5'
                            || errorMessage.field === 'postcode'
                            || errorMessage.field === 'coordinates_x'
                            || errorMessage.field === 'coordinates_y'
            )
          })
          commit('SET_PRACTICE_SURGERY_DETAIL_FORM_ERROR', practiceSurgeryDetailError)

          const practiceAccountDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'type'
                            || errorMessage.field === 'hub_type'
                            || errorMessage.field === 'title'
                            || errorMessage.field === 'first_name'
                            || errorMessage.field === 'last_name'
                            || errorMessage.field === 'suffix'
                            || errorMessage.field === 'practice_role'
                            || errorMessage.field === 'practice_type_id'
                            || errorMessage.field === 'email'
                            || errorMessage.field === 'password'
                            || errorMessage.field === 'password_confirmation'
                            || errorMessage.field === 'account_name'
                            || errorMessage.field === 'bank_name'
                            || errorMessage.field === 'sort_code'
                            || errorMessage.field === 'account_number'
                            || errorMessage.field === 'vat_registered'
                            || errorMessage.field === 'vat_number'
                            || errorMessage.field === 'tax_year_end_date'

                            || errorMessage.field === 'national_insurance_number'
                            || errorMessage.field === 'sd_number'
                            || errorMessage.field === 'paying_reference'
                            || errorMessage.field === 'ea_code'
                            || errorMessage.field === 'professional_nhs_expenses'
                            || errorMessage.field === 'section_scheme_year'
                            || errorMessage.field === 'added_year_contributions'
                            || errorMessage.field === 'added_early_retirement_contributions'
                            || errorMessage.field === 'nhsps_employer_contributions'
                            || errorMessage.field === 'nhs_pension_scheme_employing_authority_name'
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
  registeredLocum ({ state, commit, }) {
    let form = {}
    form = {
      ...state.account_details,
      ...state.address_details,
      ...state.credential_details,
      ...state.payroll_details,
      ...state.professional_details,
      qualification_id: state.professional_details.qualification_id.map(item => item.value),
      clinical_system_id: state.professional_details.clinical_system_id.map(item => item.value),
      spoken_language_id: state.professional_details.spoken_language_id.map(item => item.value),
    }
    this.$axios
      .$post(`/api/v1/register/locum?referral_code=${state.credential_details.referral_code ? state.credential_details.referral_code.toUpperCase() : this.$router.app._route.query.referral_code}`, form)
      .then(() => {
        commit('CLEAR_FORM_ERROR_DETAILS')
        this.$router.push('/sign-up/success')
      })
      .catch((err) => {
        console.log('err', err.response || err)
        if (
          err.response
                    && err.response.data
                    && err.response.data.error_messages
                    && err.response.data.error_messages.length > 0
        ) {
          const accountDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'title'
                            || errorMessage.field === 'first_name'
                            || errorMessage.field === 'last_name'
                            || errorMessage.field === 'suffix'
                            || errorMessage.field === 'gender'
                            || errorMessage.field === 'date_of_birth'
                            || errorMessage.field === 'mobile_number'
                            || errorMessage.field === 'home_number'
                            || errorMessage.field === 'work_number'
            )
          })
          commit('SET_ACCOUNT_DETAIL_FORM_ERROR', accountDetailError)
          const addressDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'post_code'
                            || errorMessage.field === 'address_line_1'
                            || errorMessage.field === 'address_line_2'
                            || errorMessage.field === 'address_line_3'
                            || errorMessage.field === 'address_line_4'
                            || errorMessage.field === 'address_line_5'
            )
          })
          commit('SET_ADDRESS_DETAIL_FORM_ERROR', addressDetailError)
          const professionalDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'view_locum_jobs'
                            || errorMessage.field === 'view_permanent_jobs'
                            || errorMessage.field === 'reference_locum_compliance_documents'
                            // errorMessage.field === 'mpl_or_npl_number' ||
                            || errorMessage.field === 'nhs_smart_card_id_number'
                            || errorMessage.field === 'profession_id'
                            || errorMessage.field === 'qualification_id'
                            || errorMessage.field === 'clinical_system_id'
                            || errorMessage.field === 'spoken_language_id'
                            || errorMessage.field === 'min_rate_per_hour'
                            || errorMessage.field === 'max_rate_per_hour'
                            || errorMessage.field === 'min_rate_per_half_day_session'
                            || errorMessage.field === 'max_rate_per_half_day_session'
                            || errorMessage.field === 'min_rate_per_whole_day_session'
                            || errorMessage.field === 'max_rate_per_whole_day_session'
                            || errorMessage.field === 'practice_type_id'
                            || errorMessage.field === 'mandatory_training_id'
            )
          })
          commit('SET_PROFESSIONAL_DETAIL_FORM_ERROR', professionalDetailError)
          const payrollDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'employment_type'
                            || errorMessage.field === 'company_registration_number'
                            || errorMessage.field === 'utr_number'
                            || errorMessage.field === 'paid_under_payroll'
                            || errorMessage.field === 'payroll_account_name'
                            || errorMessage.field === 'payroll_bank_name'
                            || errorMessage.field === 'payroll_sort_code'
                            || errorMessage.field === 'payroll_account_number'
                            || errorMessage.field === 'payroll_reference_number'
                            || errorMessage.field === 'account_name'
                            || errorMessage.field === 'bank_name'
                            || errorMessage.field === 'sort_code'
                            || errorMessage.field === 'account_number'
                            || errorMessage.field === 'ir35'
                            || errorMessage.field === 'claim_nhs'
                            || errorMessage.field === 'nhs_number'
            )
          })
          commit('SET_PAYROLL_DETAIL_FORM_ERROR', payrollDetailError)
          const credentialDetailError = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'email'
                            || errorMessage.field === 'password'
                            || errorMessage.field === 'password_confirmation'
                            || errorMessage.field === 'privacy_policy'
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
  },
  registerCheckFirstPart ({ commit, }, payload) {
    commit("SET_SIGNUP_LOADING", true)
    this.$axios.$post(`/api/v1/locum/register/check-first-part`, payload)
      .then(res => {
        commit("SET_COMPLIANCE_DOCUMENTS", {
          mandatory_compliance_documents: res.data.mandatory_compliance_documents,
          reference_compliance_documents: res.data.reference_compliance_documents,
        })
        commit("SET_STAGE_1_FORM_ERROR", [])
        commit("SET_SIGNUP_LOADING", false)
      })
      .catch(err => {
        commit("SET_SIGNUP_LOADING", false)
        if (err && err.response && err.response.data && err.response.data.error_messages) {
          commit("SET_STAGE_1_FORM_ERROR", err.response.data.error_messages)
        }
      })
  },
  registerLocum ({ state, commit, }) {
    let form = {}

    form = {
      ...state.stage_1_details,
      ...state.stage_2_pt_1_details,
      ...state.stage_2_pt_2_details,
    }

    let mandatory_compliance = []

    form.mandatory_locum_compliance_documents.forEach(item => {
      mandatory_compliance.push({
        country_id: item.country_id ? item.country_id : '',
        compliance_document_id: item.compliance_document_id,
        has_reference: item.has_reference ? item.has_reference : false,
        reference: item.reference ? item.reference : "",
      })
    })

    form.mandatory_locum_compliance_documents = mandatory_compliance

    form.reference_locum_compliance_documents = form.reference_locum_compliance_documents.map(item => JSON.stringify(item)).join(',')
    form.mandatory_locum_compliance_documents = form.mandatory_locum_compliance_documents.map(item => JSON.stringify(item)).join(',')

    form.mobile_number = form.mobile_number ? `+44${form.mobile_number}` : ''

    const formData = new FormData()

    formData.append("view_locum_jobs", form.view_locum_jobs)
    formData.append("view_permanent_jobs", form.view_permanent_jobs)
    formData.append("profession_id", form.profession_id)
    formData.append("title", form.title)
    formData.append("first_name", form.first_name)
    formData.append("last_name", form.last_name)
    formData.append("suffix", form.suffix)
    formData.append("mobile_number", form.mobile_number)
    formData.append("email", form.email)
    formData.append("password", form.password)
    formData.append("password_confirmation", form.password_confirmation)
    formData.append("nhs_smart_card_id_number", form.nhs_smart_card_id_number)
    formData.append("post_code", form.post_code)
    formData.append("address_line_1", form.address_line_1)
    formData.append("address_line_2", form.address_line_2)
    formData.append("address_line_3", form.address_line_3)
    formData.append("privacy_policy", form.privacy_policy)
    formData.append("referral_code", form.referral_code)
    formData.append("reference_locum_compliance_documents", form.reference_locum_compliance_documents)
    formData.set("mandatory_locum_compliance_documents", form.mandatory_locum_compliance_documents)
    form.files.forEach((file) => {
      formData.append('files', file)
    })

    this.$axios.$post(`/api/v1/locum/register?referral_code=${state.stage_2_pt_2_details.referral_code ? state.stage_2_pt_2_details.referral_code.toUpperCase() : this.$router.app._route.query.referral_code}`, formData)
      .then(() => {
        commit('CLEAR_LOCUM_REGISTER_FORM')
        commit('CLEAR_FORM_ERROR_DETAILS')
        this.$router.push('/sign-up/success')
        commit("SET_SIGNUP_LOADING", false)
      }).catch((err) => {
        commit("SET_SIGNUP_LOADING", false)
        if (
          err.response
                    && err.response.data
                    && err.response.data.error_messages
                    && err.response.data.error_messages.length > 0
        ) {
          const first = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'title'
                            || errorMessage.field === 'first_name'
                            || errorMessage.field === 'last_name'
                            || errorMessage.field === 'suffix'
                            || errorMessage.field === 'profession_id'
                            || errorMessage.field === 'mobile_number'
                            || errorMessage.field === 'view_permanent_jobs'
                            || errorMessage.field === 'profession_id'
                            || errorMessage.field === 'email'
                            || errorMessage.field === 'password'
                            || errorMessage.field === 'password_confirmation'
            )
          })
          commit('SET_STAGE_1_FORM_ERROR', first)

          const second = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'reference_locum_compliance_documents'
                            || errorMessage.field === 'nhs_smart_card_id_number'
                            || errorMessage.field === 'post_code'
                            || errorMessage.field === 'address_line_1'
                            || errorMessage.field === 'address_line_2'
                            || errorMessage.field === 'address_line_3'
            )
          })
          commit('SET_STAGE_2_PT_1_FORM_ERROR', second)

          const third = err.response.data.error_messages.filter((errorMessage) => {
            return (
              errorMessage.field === 'privacy_policy'
                            || errorMessage.field === 'referral_code'
                            || errorMessage.field === 'mandatory_locum_compliance_documents'
                            || errorMessage.field === 'files'
            )
          })
          commit('SET_STAGE_2_PT_2_FORM_ERROR', third)

          if (first.length > 0) {
            commit('SET_ACTIVE_COMPONENT', 'LocumStage1')
          } else if (second.length > 0) {
            commit('SET_ACTIVE_COMPONENT', 'LocumStage2pt1')
          } else if (third.length > 0) {
            commit('SET_ACTIVE_COMPONENT', 'LocumStage2pt2')
          }
        }
      })
  },
}
