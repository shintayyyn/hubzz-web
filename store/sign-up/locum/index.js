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
  mplNumber: '',
  smartCardIdNumber: '',
  profession: '',
  qualifications: [],
  clinicalSystems: [],
  languages: [],
  ratePerHour: '',
  ratePerSession: '',

  email: '',
  password: '',
  passwordConfirmation: ''

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

  getMplNumber (state) {
    return state.mplNumber
  },

  getSmartCardIdNumber (state) {
    return state.smartCardIdNumber
  },

  getProfession (state) {
    return state.profession
  },

  getQualifications (state) {
    return state.qualifications
  },

  getClinicalSystems (state) {
    return state.clinicalSystems
  },

  getLanguages (state) {
    return state.languages
  },

  getRatePerHour (state) {
    return state.ratePerHour
  },

  getRatePerSession (state) {
    return state.ratePerSession
  },

  isProffesionalDetailsValid (state) {
    return state.gmcNumber.trim() !== ''
      && state.mplNumber.trim() !== ''
      && state.smartCardIdNumber.trim() !== ''
  },


  getEmail (state) {
    return state.email
  },

  getPassword (state) {
    return state.password
  },

  getPasswordConfirmation (state) {
    return state.passwordConfirmation
  }
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


  setEmail (state, email) {
    state.email = email
  },

  setPassword (state, password) {
    state.password = password
  },

  setPasswordConfirmation (state, passwordConfirmation) {
    state.passwordConfirmation = passwordConfirmation
  }
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
  }
}
