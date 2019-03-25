<template>
  <div class="h-full w-full flex flex-col overflow-auto">


    <div class="flex flex-col items-center justify-center w-full">

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex mx-4" style="flex: 0 1 600px;">
          <h3>What's your account details?</h3>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex m-4" style="flex: 0 1 600px;">
          <span>Basic details about yourself</span>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">

          <label class="text-xs">Title</label>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showTitleFocus ? 'border-yellow-dark' : false ? 'border-red' : 'border-grey-dark'" v-model="title" @focus="showTitleFocus = true" @blur="showTitleFocus = false" placeholder="(ex. Mr., Ms., Mrs.)">

          <div class="relative">
            <label class="text-xs">First name *</label>
            <span class="text-xs absolute pin-r pin-b bg-red p-1 text-white" v-if="showFirstNameRequired && !showFirstNameFocus">Required</span>
          </div>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showFirstNameFocus ? 'border-yellow-dark' : showFirstNameRequired ? 'border-red' : 'border-grey-dark'" v-model="firstName" @focus="showFirstNameFocus = true" @blur="showFirstNameFocus = false, checkFirstName()" placeholder="Your first name">

          <div class="relative">
            <label class="text-xs">Last name *</label>
            <span class="text-xs absolute pin-r pin-b bg-red p-1 text-white" v-if="showLastNameRequired && !showLastNameFocus">Required</span>
          </div>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showLastNameFocus ? 'border-yellow-dark' : showLastNameRequired ? 'border-red' : 'border-grey-dark'" v-model="lastName" @focus="showLastNameFocus = true" @blur="showLastNameFocus = false, checkLastName()" placeholder="Your last name">

          <label class="text-xs">Suffix</label>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showSuffixFocus ? 'border-yellow-dark' : false ? 'border-red' : 'border-grey-dark'" v-model="suffix" @focus="showSuffixFocus = true" @blur="showSuffixFocus = false" placeholder="(ex. Ph. D., M. D., etc.)">

          <div class="relative">
            <label class="text-xs">Gender *</label>
            <span class="text-xs absolute pin-r pin-t bg-red p-1 text-white" v-if="showGenderRequired && !showGenderFocus">Required</span>
          </div>
          <select class="outline-none py-2 mt-1 mb-8 border-b" :class="showGenderFocus ? 'border-yellow-dark' : showGenderRequired ? 'border-red' : 'border-grey-dark'" v-model="gender" @focus="showGenderFocus = true" @blur="showGenderFocus = false, checkGender()">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <div class="relative">
            <label class="text-xs">Mobile number *</label>
            <span class="text-xs absolute pin-r pin-b p-1" style="background-color: #EFEFEF;" v-if="!showMobileNumberRequired || showMobileNumberFocus">In case of emergency</span>
            <span class="text-xs absolute pin-r pin-b bg-red p-1 text-white" v-if="showMobileNumberRequired && !showMobileNumberFocus">Required</span>
          </div>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showMobileNumberFocus ? 'border-yellow-dark' : showMobileNumberRequired ? 'border-red' : 'border-grey-dark'" v-model="mobileNumber" @focus="showMobileNumberFocus = true" @blur="showMobileNumberFocus = false, checkMobileNumber()">

          <label class="text-xs">Home/Land line number</label>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showHomeNumberFocus ? 'border-yellow-dark' : false ? 'border-red' : 'border-grey-dark'" v-model="homeNumber" @focus="showHomeNumberFocus = true" @blur="showHomeNumberFocus = false">
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex justify-center" style="flex: 0 1 600px;">
          <nuxt-link class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" to="/sign-up">< <</nuxt-link>
          <nuxt-link class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" to="/sign-up/locum/address-details" @click.native="$store.dispatch('sign-up/locum/accountDetailsNext')">Next</nuxt-link>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    layout: 'index',

    async asyncData ({ redirect }) {
      console.log('asyncData pages sign-up locum account-details')
    },

    data() {
      return {
        showTitleFocus: false,
        showFirstNameFocus: false,
        showLastNameFocus: false,
        showSuffixFocus: false,
        showGenderFocus: false,
        showMobileNumberFocus: false,
        showHomeNumberFocus: false
      }
    },

    computed: {
      title: {
        get() {
          return this.$store.getters['sign-up/locum/getTitle']
        },
        set(title) {
          this.$store.commit('sign-up/locum/setTitle', title)
        }
      },
      firstName: {
        get() {
          return this.$store.getters['sign-up/locum/getFirstName']
        },
        set(firstName) {
          this.$store.commit('sign-up/locum/setFirstName', firstName)
        }
      },
      lastName: {
        get() {
          return this.$store.getters['sign-up/locum/getLastName']
        },
        set(lastName) {
          this.$store.commit('sign-up/locum/setLastName', lastName)
        }
      },
      suffix: {
        get() {
          return this.$store.getters['sign-up/locum/getSuffix']
        },
        set(suffix) {
          this.$store.commit('sign-up/locum/setSuffix', suffix)
        }
      },
      gender: {
        get() {
          return this.$store.getters['sign-up/locum/getGender']
        },
        set(gender) {
          this.$store.commit('sign-up/locum/setGender', gender)
        }
      },
      mobileNumber: {
        get() {
          return this.$store.getters['sign-up/locum/getMobileNumber']
        },
        set(mobileNumber) {
          this.$store.commit('sign-up/locum/setMobileNumber', mobileNumber)
        }
      },
      homeNumber: {
        get() {
          return this.$store.getters['sign-up/locum/getHomeNumber']
        },
        set(homeNumber) {
          this.$store.commit('sign-up/locum/setHomeNumber', homeNumber)
        }
      },


      showFirstNameRequired: {
        get() {
          return this.$store.getters['sign-up/locum/isShowFirstNameRequired']
        },
        set(showFirstNameRequired) {
          this.$store.commit('sign-up/locum/setShowFirstNameRequired', showFirstNameRequired)
        }
      },
      showLastNameRequired: {
        get() {
          return this.$store.getters['sign-up/locum/isShowLastNameRequired']
        },
        set(showLastNameRequired) {
          this.$store.commit('sign-up/locum/setShowLastNameRequired', showLastNameRequired)
        }
      },
      showGenderRequired: {
        get() {
          return this.$store.getters['sign-up/locum/isShowGenderRequired']
        },
        set(showGenderRequired) {
          this.$store.commit('sign-up/locum/setShowGenderRequired', showGenderRequired)
        }
      },
      showMobileNumberRequired: {
        get() {
          return this.$store.getters['sign-up/locum/isShowMobileNumberRequired']
        },
        set(showMobileNumberRequired) {
          this.$store.commit('sign-up/locum/setShowMobileNumberRequired', showMobileNumberRequired)
        }
      },

    },

    watch: {
      firstName() {
        this.checkFirstName()
      },
      lastName() {
        this.checkLastName()
      },
      gender() {
        this.checkGender()
      },
      mobileNumber() {
        this.checkMobileNumber()
      }
    },

    methods: {
      checkFirstName() {
        if (this.firstName.trim() !== '') {
          this.showFirstNameRequired = false
        } else {
          this.showFirstNameRequired = true
        }
      },

      checkLastName() {
        if (this.lastName.trim() !== '') {
          this.showLastNameRequired = false
        } else {
          this.showLastNameRequired = true
        }
      },

      checkGender() {
        if (this.gender.trim() !== '') {
          this.showGenderRequired = false
        } else {
          this.showGenderRequired = true
        }
      },

      checkMobileNumber() {
        if (this.mobileNumber.trim() !== '') {
          this.showMobileNumberRequired = false
        } else {
          this.showMobileNumberRequired = true
        }
      }
    },

    mounted() {
      this.showFirstNameRequired = false
      this.showLastNameRequired = false
      this.showGenderRequired = false
      this.showMobileNumberRequired = false
    }
  }
</script>
