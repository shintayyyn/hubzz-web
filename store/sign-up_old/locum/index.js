export const state = () => ({
  title: '',
  firstName: '',
  lastName: '',
  suffix: '',
  gender: '',
  mobileNumber: '',
  homeNumber: '',

  showFirstNameRequired: false,
  showLastNameRequired: false,
  showGenderRequired: false,
  showMobileNumberRequired: false,

  postCode: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',

  showPostCodeRequired: false,
  showAddressLine1Required: false,
  showAddressLine3Required: false,

  gmcNumber: '',
  gmcNumberErrorMessage: '',

  mplNumber: '',
  mplNumberErrorMessage: '',

  smartCardIdNumber: '',

  profession: '',
  professionErrorMessage: '',

  selectedQualifications: [],
  selectedSystems: [],
  selectedLanguages: [],

  ratePerHour: '',
  ratePerSession: '',

  scopeIR35: true,

  email: '',
  emailErrorMessage: '',
  password: '',
  passwordErrorMessage: '',
  passwordConfirmation: '',
  passwordConfirmationErrorMessage: '',

})

export const getters = {
  getTitle (state) {
    return state.title
  },

  getFirstName (state) {
    return state.firstName
  },

  getLastName (state) {
    return state.lastName
  },

  getSuffix (state) {
    return state.suffix
  },

  getGender (state) {
    return state.gender
  },

  getMobileNumber (state) {
    return state.mobileNumber
  },

  getHomeNumber (state) {
    return state.homeNumber
  },


  isShowFirstNameRequired (state) {
    return state.showFirstNameRequired
  },

  isShowLastNameRequired (state) {
    return state.showLastNameRequired
  },

  isShowGenderRequired (state) {
    return state.showGenderRequired
  },

  isShowMobileNumberRequired (state) {
    return state.showMobileNumberRequired
  },


  isAccountDetailsValid (state) {
    return state.firstName.trim() !== ''
      && state.lastName.trim() !== ''
      && state.gender.trim() !== ''
      && state.mobileNumber.trim() !== ''
  },


  getPostCode (state) {
    return state.postCode
  },

  getAddressLine1 (state) {
    return state.addressLine1
  },

  getAddressLine2 (state) {
    return state.addressLine2
  },

  getAddressLine3 (state) {
    return state.addressLine3
  },


  isShowPostCodeRequired (state) {
    return state.showPostCodeRequired
  },

  isShowAddressLine1Required (state) {
    return state.showAddressLine1Required
  },

  isShowAddressLine3Required (state) {
    return state.showAddressLine3Required
  },


  isAddressDetailsValid (state) {
    return state.postCode.trim() !== ''
      && state.addressLine1.trim() !== ''
      && state.addressLine3.trim() !== ''
  },



  getGmcNumber (state) {
    return state.gmcNumber
  },

  getGmcNumberErrorMessage (state) {
    return state.gmcNumberErrorMessage
  },

  getMplNumber (state) {
    return state.mplNumber
  },

  getMplNumberErrorMessage (state) {
    return state.mplNumberErrorMessage
  },

  getSmartCardIdNumber (state) {
    return state.smartCardIdNumber
  },

  getProfession (state) {
    return state.profession
  },

  getProfessionErrorMessage (state) {
    return state.professionErrorMessage
  },

  getSelectedQualifications (state) {
    return state.selectedQualifications
  },

  getSelectedSystems (state) {
    return state.selectedSystems
  },

  getSelectedLanguages (state) {
    return state.selectedLanguages
  },

  getRatePerHour (state) {
    return state.ratePerHour
  },

  getRatePerSession (state) {
    return state.ratePerSession
  },

  getScopeIR35 (state) {
    return state.scopeIR35
  },

  isProfessionalDetailsValid (state) {
    return state.gmcNumber !== ''
      && state.mplNumber !== ''
      && state.profession !== ''
      && state.gmcNumberErrorMessage === ''
      && state.mplNumberErrorMessage === ''
      && state.professionErrorMessage === ''
  },

  getEmail (state) {
    return state.email
  },
  getEmailErrorMessage (state) {
    return state.emailErrorMessage
  },

  getPassword (state) {
    return state.password
  },
  getPasswordErrorMessage (state) {
    return state.passwordErrorMessage
  },

  getPasswordConfirmation (state) {
    return state.passwordConfirmation
  },
  getPasswordConfirmationErrorMessage (state) {
    return state.passwordConfirmationErrorMessage
  },

  isCredentialDetailsValid (state) {
    return state.email !== ''
      && state.password !== ''
      && state.passwordConfirmation !== ''
      && state.emailErrorMessage === ''
      && state.passwordErrorMessage === ''
      && state.passwordConfirmationErrorMessage === ''
  },
}

export const mutations = {
  setTitle (state, title) {
   state.title = title
  },

  setFirstName (state, firstName) {
   state.firstName = firstName
  },

  setLastName (state, lastName) {
   state.lastName = lastName
  },

  setSuffix (state, suffix) {
   state.suffix = suffix
  },

  setGender (state, gender) {
   state.gender = gender
  },

  setMobileNumber (state, mobileNumber) {
   state.mobileNumber = mobileNumber
  },

  setHomeNumber (state, homeNumber) {
   state.homeNumber = homeNumber
  },



  setShowFirstNameRequired (state, showFirstNameRequired) {
    state.showFirstNameRequired = showFirstNameRequired
  },

  setShowLastNameRequired (state, showLastNameRequired) {
    state.showLastNameRequired = showLastNameRequired
  },

  setShowGenderRequired (state, showGenderRequired) {
    state.showGenderRequired = showGenderRequired
  },

  setShowMobileNumberRequired (state, showMobileNumberRequired) {
    state.showMobileNumberRequired = showMobileNumberRequired
  },


  setPostCode (state, postCode) {
    state.postCode = postCode
  },

  setAddressLine1 (state, addressLine1) {
    state.addressLine1 = addressLine1
  },

  setAddressLine2 (state, addressLine2) {
    state.addressLine2 = addressLine2
  },

  setAddressLine3 (state, addressLine3) {
    state.addressLine3 = addressLine3
  },

  setShowPostCodeRequired (state, showPostCodeRequired) {
    state.showPostCodeRequired = showPostCodeRequired
  },

  setShowAddressLine1Required (state, showAddressLine1Required) {
    state.showAddressLine1Required = showAddressLine1Required
  },

  setShowAddressLine3Required (state, showAddressLine3Required) {
    state.showAddressLine3Required = showAddressLine3Required
  },


  setGmcNumber (state, gmcNumber) {
    state.gmcNumber = gmcNumber
  },

  setGmcNumberErrorMessage (state, gmcNumberErrorMessage) {
    state.gmcNumberErrorMessage = gmcNumberErrorMessage
  },

  setMplNumber (state, mplNumber) {
    state.mplNumber = mplNumber
  },

  setMplNumberErrorMessage (state, mplNumberErrorMessage) {
    state.mplNumberErrorMessage = mplNumberErrorMessage
  },

  setSmartCardIdNumber (state, smartCardIdNumber) {
    state.smartCardIdNumber = smartCardIdNumber
  },

  setProfession (state, profession) {
    state.profession = profession
  },

  setProfessionErrorMessage (state, professionErrorMessage) {
    state.professionErrorMessage = professionErrorMessage
  },


  addSelectedQualification (state, qualification) {
    state.selectedQualifications.push(qualification)
  },

  removeSelectedQualification (state, qualification) {
    const index = state.selectedQualifications.findIndex((selectedQualification) => {
      return selectedQualification._id === qualification._id
    })

    if (index > -1) {
      state.selectedQualifications.splice(index, 1)
    }
  },


  addSelectedSystem (state, system) {
    state.selectedSystems.push(system)
  },

  removeSelectedSystem (state, system) {
    const index = state.selectedSystems.findIndex((selectedSystem) => {
      return selectedSystem._id === system._id
    })

    if (index > -1) {
      state.selectedSystems.splice(index, 1)
    }
  },


  addSelectedLanguage (state, system) {
    state.selectedLanguages.push(system)
  },

  removeSelectedLanguage (state, system) {
    const index = state.selectedLanguages.findIndex((selectedLanguage) => {
      return selectedLanguage._id === system._id
    })

    if (index > -1) {
      state.selectedLanguages.splice(index, 1)
    }
  },

  setRatePerHour (state, ratePerHour) {
    state.ratePerHour = ratePerHour
  },

  setRatePerSession (state, ratePerSession) {
    state.ratePerSession = ratePerSession
  },

  setScopeIR35 (state, scopeIR35) {
    state.scopeIR35 = scopeIR35
  },


  setEmail (state, email) {
    state.email = email
  },
  setEmailErrorMessage (state, emailErrorMessage) {
    state.emailErrorMessage = emailErrorMessage
  },

  setPassword (state, password) {
    state.password = password
  },
  setPasswordErrorMessage (state, passwordErrorMessage) {
    state.passwordErrorMessage = passwordErrorMessage
  },

  setPasswordConfirmation (state, passwordConfirmation) {
    state.passwordConfirmation = passwordConfirmation
  },
  setPasswordConfirmationErrorMessage (state, passwordConfirmationErrorMessage) {
    state.passwordConfirmationErrorMessage = passwordConfirmationErrorMessage
  },
}

export const actions = {
  async accountDetailsNext({ getters, commit, dispatch }) {
    console.log('accountDetailsNext')

    if (getters['getFirstName'].trim() === '') {
      commit('setShowFirstNameRequired', true)
    } else {
      commit('setShowFirstNameRequired', false)
    }

    if (getters['getLastName'].trim() === '') {
      commit('setShowLastNameRequired', true)
    } else {
      commit('setShowLastNameRequired', false)
    }

    if (getters['getGender'].trim() === '') {
      commit('setShowGenderRequired', true)
    } else {
      commit('setShowGenderRequired', false)
    }

    if (getters['getMobileNumber'].trim() === '') {
      commit('setShowMobileNumberRequired', true)
    } else {
      commit('setShowMobileNumberRequired', false)
    }
  },

  async addressDetailsNext({ getters, commit, dispatch }) {
    console.log('addressDetailsNext')

    if (getters['getPostCode'].trim() === '') {
      commit('setShowPostCodeRequired', true)
    } else {
      commit('setShowPostCodeRequired', false)
    }

    if (getters['getAddressLine1'].trim() === '') {
      commit('setShowAddressLine1Required', true)
    } else {
      commit('setShowAddressLine1Required', false)
    }

    if (getters['getAddressLine3'].trim() === '') {
      commit('setShowAddressLine3Required', true)
    } else {
      commit('setShowAddressLine3Required', false)
    }
  },

  async professionalDetailsNext({ getters, commit, dispatch }) {
    console.log('professionalDetailsNext')

    if (getters['getGmcNumber'].trim() === '') {
      commit('setGmcNumberErrorMessage', 'Required')
    } else {
      commit('setGmcNumberErrorMessage', '')
    }

    if (getters['getMplNumber'].trim() === '') {
      commit('setMplNumberErrorMessage', 'Required')
    } else {
      commit('setMplNumberErrorMessage', '')
    }

    if (getters['getProfession'].trim() === '') {
      commit('setProfessionErrorMessage', 'Required')
    } else {
      commit('setProfessionErrorMessage', '')
    }
  },

  async register({ getters, commit, dispatch }) {
    const data = {
      title: getters['getTitle'],
      firstName: getters['getFirstName'],
      lastName: getters['getLastName'],
      suffix: getters['getSuffix'],
      gender: getters['getGender'],
      mobileNumber: getters['getMobileNumber'],
      homeNumber: getters['getHomeNumber'],

      postCode: getters['getPostCode'],
      addressLine1: getters['getAddressLine1'],
      addressLine2: getters['getAddressLine2'],
      addressLine3: getters['getAddressLine3'],

      gmcNumber: getters['getGmcNumber'],
      mplNumber: getters['getMplNumber'],
      smartCardIdNumber: getters['getSmartCardIdNumber'],
      professionId: getters['getProfession'],
      qualificationId: getters['getSelectedQualifications'],
      systemId: getters['getSelectedSystems'],
      languageId: getters['getSelectedLanguages'],

      ratePerHour: getters['getRatePerHour'],
      ratePerSession: getters['getRatePerSession'],

      scopeIR35: getters['getScopeIR35'],

      email: getters['getEmail'],
      password: getters['getPassword'],
      passwordConfirmation: getters['getPasswordConfirmation']
    }

    const response = await this.$axios.post(`/api/v1/register/locum`, data)

    return response
  }
}
