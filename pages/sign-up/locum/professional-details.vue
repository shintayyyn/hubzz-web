<template>
  <div class="h-full w-full flex flex-col overflow-auto">


    <div class="flex flex-col items-center justify-center w-full">

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex mx-4" style="flex: 0 1 600px;">
          <h3>Your professional details</h3>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
          <div class="flex flex-wrap justify-between">
            <label class="text-xs mr-6">Your GMC / NMC Number *</label>
            <div class="m-1">
              <span class="text-xs p-1" style="background-color: #EFEFEF;" v-if="!gmcNumberErrorMessage || showGMCNumberFocus">For compliance; to be verified by the hubzz team</span>
              <span class="text-xs bg-red p-1 text-white" v-if="gmcNumberErrorMessage && !showGMCNumberFocus">{{ gmcNumberErrorMessage }}</span>
            </div>
          </div>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showGMCNumberFocus ? 'border-yellow-dark' : gmcNumberErrorMessage ? 'border-red' : 'border-grey-dark'" v-model="gmcNumber" @focus="showGMCNumberFocus = true" @blur="showGMCNumberFocus = false, checkGMCNumber()" placeholder="GMC / NMC Number">

          <div class="flex flex-wrap justify-between">
            <label class="text-xs">Your MPL / NPL Number *</label>
            <div class="m-1">
              <span class="text-xs p-1" style="background-color: #EFEFEF;" v-if="!mplNumberErrorMessage || showMPLNumberFocus">For compliance; to be verified by the hubzz team</span>
              <span class="text-xs bg-red p-1 text-white" v-if="mplNumberErrorMessage && !showMPLNumberFocus">{{ mplNumberErrorMessage }}</span>
            </div>
          </div>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showMPLNumberFocus ? 'border-yellow-dark' : mplNumberErrorMessage ? 'border-red' : 'border-grey-dark'" v-model="mplNumber" @focus="showMPLNumberFocus = true" @blur="showMPLNumberFocus = false, checkMPLNumber()" placeholder="Your last name">

          <div class="flex flex-wrap justify-between">
            <label class="text-xs">Your NHS Smart Card ID number *</label>
            <div class="m-1">
              <span class="text-xs bg-red p-1 text-white" v-if="smartCardIdNumberErrorMessage && !showSmartCardIdNumberFocus">{{ smartCardIdNumberErrorMessage }}</span>
            </div>
          </div>
          <input class="outline-none py-1 mt-1 mb-8 border-b" :class="showSmartCardIdNumberFocus ? 'border-yellow-dark' : smartCardIdNumberErrorMessage ? 'border-red' : 'border-grey-dark'" v-model="smartCardIdNumber" @focus="showSmartCardIdNumberFocus = true" @blur="showSmartCardIdNumberFocus = false, checkSmartCardIdNumber()">

          <div class="flex flex-wrap justify-between">
            <label class="text-xs">Profession *</label>
            <div class="m-1">
              <span class="text-xs bg-red p-1 text-white" v-if="professionErrorMessage && !showPrefossionFocus">{{ professionErrorMessage }}</span>
            </div>
          </div>
          <select class="outline-none py-2 mt-1 mb-8 border-b w-full" :class="showPrefossionFocus ? 'border-yellow-dark' : professionErrorMessage ? 'border-red' : 'border-grey-dark'" v-model="profession" @focus="showPrefossionFocus = true" @blur="showPrefossionFocus = false, checkProfession()">
            <option value="">Select</option>
            <option v-for="profession in professions" :value="profession.name">{{ profession.name }}</option>
          </select>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex justify-center" style="flex: 0 1 600px;">
          <nuxt-link class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" to="/sign-up/locum/address-details">< <</nuxt-link>
          <nuxt-link class="inline-flex border rounded-lg text-black no-underline p-4 my-2" style="background-color: #FFDA3A;" to="/sign-up/locum/credential-details" @click.native="">Next</nuxt-link>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
  export default {
    layout: 'index',

    async asyncData({ store, redirect }) {
      try {
        console.log('asyncData pages sign-up locum professional-details')

        if (!store.getters['sign-up/locum/isAccountDetailsValid']) {
          redirect('/sign-up/locum/account-details')

          return
        }

        if (!store.getters['sign-up/locum/isAddressDetailsValid']) {
          redirect('/sign-up/locum/address-details')

          return
        }
      } catch (err) {
        console.log('asyncData pages sign-up locum professional-details err', err)
      }
    },

    data() {
      return {
        professions: [
          {
            name: 'GP'
          },
          {
            name: 'Nurse | Advanced Nurse Practitioners (ANP)'
          },
          {
            name: 'Nurse | Emergency Nurse Practitioners (ENP)'
          },
          {
            name: 'Nurse | Nurse Practitioners'
          },
          {
            name: 'Nurse | Practice Nurses'
          },
          {
            name: 'Paramedic | Paramedic Practitioner'
          },
          {
            name: 'Paramedic | Urgent Care Practitioner (UCP)'
          },
          {
            name: 'Paramedic | Emergency Care Practitioner (ECP)'
          }
        ],

        showGMCNumberFocus: false,
        showMPLNumberFocus: false,
        showSmartCardIdNumberFocus: false,
        showPrefossionFocus: false,

        gmcNumberErrorMessage: '',
        mplNumberErrorMessage: '',
        smartCardIdNumberErrorMessage: '',
        professionErrorMessage: ''
      }
    },

    computed: {
      gmcNumber: {
        get() {
          return this.$store.getters['sign-up/locum/getGmcNumber']
        },
        set(gmcNumber) {
          this.$store.commit('sign-up/locum/setGmcNumber', gmcNumber)
        }
      },
      mplNumber: {
        get() {
          return this.$store.getters['sign-up/locum/getMplNumber']
        },
        set(mplNumber) {
          this.$store.commit('sign-up/locum/setMplNumber', mplNumber)
        }
      },
      smartCardIdNumber: {
        get() {
          return this.$store.getters['sign-up/locum/getSmartCardIdNumber']
        },
        set(smartCardIdNumber) {
          this.$store.commit('sign-up/locum/setSmartCardIdNumber', smartCardIdNumber)
        }
      },

      profession: {
        get() {
          return this.$store.getters['sign-up/locum/getProfession']
        },
        set(profession) {
          this.$store.commit('sign-up/locum/setProfession', profession)
        }
      },

      accountDetailsValid() {
        return this.$store.getters['sign-up/locum/isAccountDetailsValid']
      },

      addressDetailsValid() {
        return this.$store.getters['sign-up/locum/isAddressDetailsValid']
      }
    },

    watch: {
      accountDetailsValid() {
        if (!this.accountDetailsValid) {
          this.$router.replace('/sign-up/locum/account-details')
        }
      },

      addressDetailsValid() {
        if (!this.addressDetailsValid) {
          this.$router.replace('/sign-up/locum/address-details')
        }
      }
    },

    methods: {
      checkGMCNumber() {
        if (this.gmcNumber.trim() !== '') {
          this.gmcNumberErrorMessage = false
        } else {
          this.gmcNumberErrorMessage = 'Required'
        }
      },
      checkMPLNumber() {
        if (this.mplNumber.trim() !== '') {
          this.mplNumberErrorMessage = false
        } else {
          this.mplNumberErrorMessage = 'Required'
        }
      },
      checkSmartCardIdNumber() {
        if (this.smartCardIdNumber.trim() !== '') {
          this.smartCardIdNumberErrorMessage = false
        } else {
          this.smartCardIdNumberErrorMessage = 'Required'
        }
      },
      checkProfession() {
        if (this.profession.trim() !== '') {
          this.professionErrorMessage = false
        } else {
          this.professionErrorMessage = 'Required'
        }
      }
    }


  }
</script>
