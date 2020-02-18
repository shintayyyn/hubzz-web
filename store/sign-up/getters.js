export default {
    // LOCUMS
    accountDetails(state) {
        return state.account_details;
    },
    accountFormError(state) {
        return state.account_detail_form_error;
    },
    addressDetails(state) {
        return state.address_details;
    },
    addressFormError(state) {
        return state.address_detail_form_error;
    },
    credentialDetails(state) {
        return state.credential_details;
    },
    credentialFormError(state) {
        return state.credential_detail_form_error;
    },
    professionalDetails(state) {
        return state.professional_details;
    },
    professionalFormError(state) {
        return state.professional_detail_form_error;
    },
    payrollDetails(state) {
        return state.payroll_details;
    },
    payrollFormError(state) {
        return state.payroll_detail_form_error;
    },
    professionCategoryId(state) {
        return state.professional_details.profession_category_id
    },
    // PRACTICE
    practiceDetails(state) {
        return state.practice_details
    },
    practiceFormError(state) {
        return state.practice_detail_form_error
    },
    practiceSurgeryDetails(state) {
        return state.practice_surgery_details
    },
    practiceSurgeryFormError(state) {
        return state.practice_surgery_detail_form_error
    },
    practiceAccountDetails(state) {
        return state.practice_account_details;
    },
    practiceAccountFormError(state) {
        return state.practice_account_detail_form_error;
    },
    surgeryId(state) {
        return state.practice_details.surgery_id;
    },
    search_results(state) {
        return state.search_results
    },
    activeTab(state) {
        return state.activeComponent
    },
    // 
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