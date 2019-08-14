<template>
  <div class="h-full w-full flex flex-col overflow-auto">
    <div class="flex flex-col items-center justify-center w-full pb-16">
      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex mx-4" style="flex: 0 1 600px;">
          <h3>Your professional details</h3>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
          <div class="flex flex-col mb-8" ref="inputGmcNumber">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Your GMC / NMC Number *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span
                  class="text-xs p-1 bg-gray-300"
                  v-if="!gmcNumberErrorMessage || showGMCNumberFocus"
                >For compliance; to be verified by the hubzz team</span>
                <span
                  class="text-xs bg-red-500 p-1 text-white"
                  v-if="gmcNumberErrorMessage && !showGMCNumberFocus"
                >{{ gmcNumberErrorMessage }}</span>
              </div>
            </div>
            <input
              class="outline-none py-1 mt-1 border-b"
              :class="showGMCNumberFocus ? 'border-yellow-500' : gmcNumberErrorMessage ? 'border-red-500' : 'border-gray-500'"
              v-model="gmcNumber"
              @focus="showGMCNumberFocus = true"
              @blur="showGMCNumberFocus = false, checkGMCNumber()"
              placeholder="GMC / NMC Number"
            />
          </div>

          <div class="flex flex-col mb-8" ref="inputMplNumber">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Your MPL / NPL Number *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span
                  class="text-xs p-1 bg-gray-300"
                  v-if="!mplNumberErrorMessage || showMPLNumberFocus"
                >For compliance; to be verified by the hubzz team</span>
                <span
                  class="text-xs bg-red-500 p-1 text-white"
                  v-if="mplNumberErrorMessage && !showMPLNumberFocus"
                >{{ mplNumberErrorMessage }}</span>
              </div>
            </div>
            <input
              class="outline-none py-1 mt-1 border-b"
              :class="showMPLNumberFocus ? 'border-yellow-500' : mplNumberErrorMessage ? 'border-red-500' : 'border-gray-500'"
              v-model="mplNumber"
              @focus="showMPLNumberFocus = true"
              @blur="showMPLNumberFocus = false, checkMPLNumber()"
              placeholder="Your last name"
            />
          </div>

          <div class="flex flex-col mb-8">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Your NHS Smart Card ID number *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span
                  class="text-xs bg-red-500 p-1 text-white"
                  v-if="smartCardIdNumberErrorMessage && !showSmartCardIdNumberFocus"
                >{{ smartCardIdNumberErrorMessage }}</span>
              </div>
            </div>
            <input
              class="outline-none py-1 mt-1 border-b"
              :class="showSmartCardIdNumberFocus ? 'border-yellow-500' : smartCardIdNumberErrorMessage ? 'border-red-500' : 'border-gray-500'"
              v-model="smartCardIdNumber"
              @focus="showSmartCardIdNumberFocus = true"
              @blur="showSmartCardIdNumberFocus = false, checkSmartCardIdNumber()"
            />
          </div>

          <div class="flex flex-col mb-8" ref="inputProfession">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Profession *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span
                  class="text-xs bg-red-500 p-1 text-white"
                  v-if="professionErrorMessage && !showPrefossionFocus"
                >{{ professionErrorMessage }}</span>
              </div>
            </div>
            <select
              class="outline-none py-2 mt-1 border-b w-full bg-gray-300"
              :class="showPrefossionFocus ? 'border-yellow-500' : professionErrorMessage ? 'border-red-500' : 'border-gray-500'"
              v-model="profession"
              @focus="showPrefossionFocus = true"
              @blur="showPrefossionFocus = false, checkProfession()"
            >
              <option value>Select</option>
              <option
                v-for="profession in professions"
                :value="profession._id"
              >{{ profession.name }}</option>
            </select>
          </div>

          <!-- QUALIFICATIONS -->
          <div class="flex flex-col mb-8">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Speciality *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span
                  class="text-xs p-1 bg-gray-300"
                  v-if="!selectedQualificationsErrorMessage || showQualificationsSelect"
                >Choose at least one qualification</span>
                <span
                  class="text-xs bg-red-500 p-1 text-white"
                  v-if="selectedQualificationsErrorMessage && !showQualificationsSelect"
                >{{ selectedQualificationsErrorMessage }}</span>
              </div>
            </div>
            <div class="relative" v-on-clickaway="hideQualificationsSelect">
              <div
                class="flex items-center flex-wrap border-b"
                :class="showQualificationsSelect ? 'border-yellow-500' : selectedQualificationsErrorMessage ? 'border-red-500' : 'border-gray-500'"
              >
                <div
                  class="px-2 py-1 rounded-lg m-1"
                  style="background-color: #FFDA3A;"
                  v-for="selectedQualification in selectedQualifications"
                >
                  <span class="text-sm">{{ selectedQualification.name }}</span>
                  <button @click="removeQualification(selectedQualification)">x</button>
                </div>
                <div style="flex: 1 0 50%;">
                  <input
                    class="w-full bg-gray-300 outline-none px-1 py-2 mt-1"
                    ref="inputQualificationsSearch"
                    v-model="qualificationsSearch"
                    @click="showQualificationsSelect = true"
                    @keydown="inputQualificationSearchKeydownHandler"
                    @focus="showQualificationsSelect = true"
                    @blur="checkSelectedQualifications"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div
                class="bg-white absolute left-0 right-0 z-10 border shadow-lg rounded-lg overflow-auto"
                ref="qualificationsContainer"
                style="top: 100%; max-height: 175px;"
                v-if="showQualificationsSelect"
              >
                <div
                  v-for="(qualification, index) in filteredQualifications"
                  :ref="`qualification-${index}`"
                  class="p-2 cursor-pointer"
                  :class="`${index !== qualifications.length ? 'border-b' : ''} ${index === qualificationIndex ? 'bg-gray-300' : ''}`"
                  @click="addQualification(qualification)"
                  @mouseover="qualificationIndex = index"
                >
                  <strong class>{{ qualification.name }}</strong>
                </div>
              </div>
            </div>
          </div>
          <!-- QUALIFICATIONS -->

          <!-- SYSTEMS -->
          <div class="flex flex-col mb-8">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Clinical systems *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span
                  class="text-xs p-1 bg-gray-300"
                  v-if="!selectedSystemsErrorMessage || showSystemsSelect"
                >Choose at least one IT system</span>
                <span
                  class="text-xs bg-red-500 p-1 text-white"
                  v-if="selectedSystemsErrorMessage && !showSystemsSelect"
                >{{ selectedSystemsErrorMessage }}</span>
              </div>
            </div>
            <div class="relative" v-on-clickaway="hideSystemSelect">
              <div
                class="flex items-center flex-wrap border-b"
                :class="showSystemsSelect ? 'border-yellow-500' : selectedSystemsErrorMessage ? 'border-red-500' : 'border-gray-500'"
              >
                <div
                  class="px-2 py-1 rounded-lg m-1"
                  style="background-color: #FFDA3A;"
                  v-for="selectedSystem in selectedSystems"
                >
                  <span class="text-sm">{{ selectedSystem.name }}</span>
                  <button @click="removeSystem(selectedSystem)">x</button>
                </div>
                <div style="flex: 1 0 50%;">
                  <input
                    class="w-full bg-gray-300 outline-none px-1 py-2 mt-1"
                    ref="inputSystemsSearch"
                    v-model="systemsSearch"
                    @click="showSystemsSelect = true"
                    @keydown="inputSystemSearchKeydownHandler"
                    @focus="showSystemsSelect = true"
                    @blur="checkSelectedSystems"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div
                class="bg-white absolute left-0 right-0 z-10 border shadow-lg rounded-lg overflow-auto"
                ref="systemsContainer"
                style="top: 100%; max-height: 175px;"
                v-if="showSystemsSelect"
              >
                <div
                  v-for="(system, index) in filteredSystems"
                  :ref="`system-${index}`"
                  class="p-2 cursor-pointer"
                  :class="`${index !== systems.length ? 'border-b' : ''} ${index === systemIndex ? 'bg-gray-300' : ''}`"
                  @click="addSystem(system)"
                  @mouseover="systemIndex = index"
                >
                  <strong class>{{ system.name }}</strong>
                </div>
              </div>
            </div>
          </div>
          <!-- SYSTEMS -->

          <!-- LANGUAGES -->
          <div class="flex flex-col mb-8">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Spoken languages *</label>
              <div class="m-1 flex-auto flex justify-end">
                <span
                  class="text-xs p-1 bg-gray-300"
                  v-if="!selectedLanguagesErrorMessage || showLanguagesSelect"
                >Choose other languages you can speak</span>
                <span
                  class="text-xs bg-red-500 p-1 text-white"
                  v-if="selectedLanguagesErrorMessage && !showLanguagesSelect"
                >{{ selectedLanguagesErrorMessage }}</span>
              </div>
            </div>
            <div class="relative" v-on-clickaway="hideLanguageSelect">
              <div
                class="flex items-center flex-wrap border-b"
                :class="showLanguagesSelect ? 'border-yellow-500' : selectedLanguagesErrorMessage ? 'border-red-500' : 'border-gray-500'"
              >
                <div class="px-2 py-1 rounded-lg m-1" style="background-color: #FFDA3A;">
                  <span class="text-sm">English</span>
                </div>
                <div
                  class="px-2 py-1 rounded-lg m-1"
                  style="background-color: #FFDA3A;"
                  v-for="selectedLanguage in selectedLanguages"
                >
                  <span class="text-sm">{{ selectedLanguage.name }}</span>
                  <button @click="removeLanguage(selectedLanguage)">x</button>
                </div>
                <div style="flex: 1 0 50%;">
                  <input
                    class="w-full bg-gray-300 outline-none px-1 py-2 mt-1"
                    ref="inputLanguagesSearch"
                    v-model="languagesSearch"
                    @click="showLanguagesSelect = true"
                    @keydown="inputLanguageSearchKeydownHandler"
                    @focus="showLanguagesSelect = true"
                    @blur="checkSelectedLanguages"
                    placeholder="Select"
                  />
                </div>
              </div>
              <div
                class="bg-white absolute left-0 right-0 z-10 border shadow-lg rounded-lg overflow-auto"
                ref="languagesContainer"
                style="top: 100%; max-height: 175px;"
                v-if="showLanguagesSelect"
              >
                <div
                  v-for="(language, index) in filteredLanguages"
                  :ref="`language-${index}`"
                  class="p-2 cursor-pointer"
                  :class="`${index !== languages.length ? 'border-b' : ''} ${index === languageIndex ? 'bg-gray-300' : ''}`"
                  @click="addLanguage(language)"
                  @mouseover="languageIndex = index"
                >
                  <strong class>{{ language.name }}</strong>
                </div>
              </div>
            </div>
          </div>
          <!-- LANGUAGES -->

          <div class="flex flex-col mb-8">
            <div class="flex flex-wrap justify-between">
              <label class="text-xs my-1 py-1">Your preferred rates £</label>
              <div class="m-1 flex-auto flex justify-end">
                <span class="text-xs p-1 bg-gray-300">To match available jobs with</span>
              </div>
            </div>
            <div class="flex flex-wrap">
              <div class="flex-1 flex flex-col mr-4">
                <div class="flex flex-wrap justify-between">
                  <label class="text-xs my-1 py-1">Per hour</label>
                  <div class="m-1 flex-auto flex justify-end">
                    <span
                      class="text-xs bg-red-500 p-1 text-white"
                      v-if="ratePerHourErrorMessage && !showRatePerHourFocus"
                    >{{ ratePerHourErrorMessage }}</span>
                  </div>
                </div>
                <input
                  class="outline-none py-1 mt-1 border-b w-full text-right"
                  :class="showRatePerHourFocus ? 'border-yellow-500' : ratePerHourErrorMessage ? 'border-red-500' : 'border-gray-500'"
                  v-model="ratePerHour"
                  @focus="showRatePerHourFocus = true"
                  @blur="showRatePerHourFocus = false, checkRatePerHour()"
                />
              </div>
              <div class="flex-1 flex flex-col">
                <div class="flex flex-wrap justify-between">
                  <label class="text-xs my-1 py-1">Per session</label>
                  <div class="m-1 flex-auto flex justify-end">
                    <span
                      class="text-xs bg-red-500 p-1 text-white"
                      v-if="ratePerSessionErrorMessage && !showRatePerSessionFocus"
                    >{{ ratePerSessionErrorMessage }}</span>
                  </div>
                </div>
                <input
                  class="outline-none py-1 mt-1 border-b w-full text-right"
                  :class="showRatePerSessionFocus ? 'border-yellow-500' : ratePerSessionErrorMessage ? 'border-red-500' : 'border-gray-500'"
                  v-model="ratePerSession"
                  @focus="showRatePerSessionFocus = true"
                  @blur="showRatePerSessionFocus = false, checkRatePerSession()"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col mb-8">
            <div class="flex flex-wrap justify-between">
              <label
                class="text-xs my-1 py-1"
              >Are you OK to work with Practices that are inside of scope for IR35?</label>
            </div>
            <select
              class="outline-none py-2 mt-1 border-b w-full bg-gray-300"
              :class="showScopeIR35Focus ? 'border-yellow-500' : false ? 'border-red-500' : 'border-gray-500'"
              v-model="scopeIR35"
              @focus="showScopeIR35Focus = true"
              @blur="showScopeIR35Focus = false"
            >
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex w-full justify-center xl:justify-start">
        <div class="flex justify-center" style="flex: 0 1 600px;">
          <nuxt-link
            class="inline-flex border rounded-lg text-black no-underline p-4 my-2"
            style="background-color: #FFDA3A;"
            to="/sign-up/locum/address-details"
          ></nuxt-link>
          <nuxt-link
            class="inline-flex border rounded-lg text-black no-underline p-4 my-2"
            style="background-color: #FFDA3A;"
            to="/sign-up/locum/credential-details"
            :event="''"
            @click.native.prevent="next"
          >Next</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { mixin as clickaway } from 'vue-clickaway'

export default {
  layout: 'index',

  mixins: [clickaway],

  scrollToTop: true,

  async asyncData({ app, store, redirect }) {
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

      const getProfessionsPromise = app.$axios.get('/api/v1/professions')

      const getQualificationsPromise = app.$axios.get('/api/v1/qualifications')

      const getSystemsPromise = app.$axios.get('/api/v1/systems')

      const getLanguagesPromise = app.$axios.get('/api/v1/languages')

      let response

      response = await getProfessionsPromise

      const professions = response.data.data.professions

      response = await getQualificationsPromise

      const qualifications = response.data.data.qualifications

      response = await getSystemsPromise

      const systems = response.data.data.systems

      response = await getLanguagesPromise

      const languages = response.data.data.languages

      return {
        professions,
        qualifications,
        systems,
        languages
      }
    } catch (err) {
      console.log('asyncData pages sign-up locum professional-details err', err)
    }
  },

  data() {
    return {
      professions: [],
      qualifications: [],
      systems: [],
      languages: [],

      showGMCNumberFocus: false,
      showMPLNumberFocus: false,
      showSmartCardIdNumberFocus: false,
      showPrefossionFocus: false,

      smartCardIdNumberErrorMessage: '',

      // QUALIFICATIONS
      selectedQualificationsErrorMessage: '',
      showQualificationsSelect: false,
      qualificationsSearch: '',
      qualificationIndex: -1,
      // QUALIFICATIONS

      // SYSTEMS
      selectedSystemsErrorMessage: '',
      showSystemsSelect: false,
      systemsSearch: '',
      systemIndex: -1,
      // SYSTEMS

      // LANGUAGES
      selectedLanguagesErrorMessage: '',
      showLanguagesSelect: false,
      languagesSearch: '',
      languageIndex: -1,
      // LANGUAGES

      showRatePerHourFocus: false,
      ratePerHourErrorMessage: '',

      showRatePerSessionFocus: false,
      ratePerSessionErrorMessage: '',

      showScopeIR35Focus: false,
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
    gmcNumberErrorMessage: {
      get() {
        return this.$store.getters['sign-up/locum/getGmcNumberErrorMessage']
      },
      set(gmcNumberErrorMessage) {
        this.$store.commit('sign-up/locum/setGmcNumberErrorMessage', gmcNumberErrorMessage)
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
    mplNumberErrorMessage: {
      get() {
        return this.$store.getters['sign-up/locum/getMplNumberErrorMessage']
      },
      set(mplNumberErrorMessage) {
        this.$store.commit('sign-up/locum/setMplNumberErrorMessage', mplNumberErrorMessage)
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
    professionErrorMessage: {
      get() {
        return this.$store.getters['sign-up/locum/getProfessionErrorMessage']
      },
      set(professionErrorMessage) {
        this.$store.commit('sign-up/locum/setProfessionErrorMessage', professionErrorMessage)
      }
    },

    accountDetailsValid() {
      return this.$store.getters['sign-up/locum/isAccountDetailsValid']
    },

    addressDetailsValid() {
      return this.$store.getters['sign-up/locum/isAddressDetailsValid']
    },

    professionalDetailsValid() {
      return this.$store.getters['sign-up/locum/isProfessionalDetailsValid']
    },


    // QUALICATIONS
    selectedQualifications() {
      return this.$store.getters['sign-up/locum/getSelectedQualifications']
    },
    filteredQualifications() {
      return this.qualifications.filter((qualification) => {
        const index = this.selectedQualifications.findIndex((selectedQualification) => {
          return selectedQualification._id === qualification._id
        })

        return index === -1 && qualification.name && qualification.name.includes(this.qualificationsSearch)
      })
    },
    // QUALICATIONS

    // SYSTEMS
    selectedSystems() {
      return this.$store.getters['sign-up/locum/getSelectedSystems']
    },
    filteredSystems() {
      return this.systems.filter((system) => {
        const index = this.selectedSystems.findIndex((selectedSystem) => {
          return selectedSystem._id === system._id
        })

        return index === -1 && system.name && system.name.includes(this.systemsSearch)
      })
    },
    // SYSTEMS

    // LANGUAGES
    selectedLanguages() {
      return this.$store.getters['sign-up/locum/getSelectedLanguages']
    },
    filteredLanguages() {
      return this.languages.filter((language) => {
        const index = this.selectedLanguages.findIndex((selectedLanguage) => {
          return selectedLanguage._id === language._id
        })

        return index === -1 && language.name && language.name.includes(this.languagesSearch)
      })
    },
    // LANGUAGES

    ratePerHour: {
      get() {
        return this.$store.getters['sign-up/locum/getRatePerHour']
      },
      set(ratePerHour) {
        this.$store.commit('sign-up/locum/setRatePerHour', ratePerHour)
      }
    },

    ratePerSession: {
      get() {
        return this.$store.getters['sign-up/locum/getRatePerSession']
      },
      set(ratePerSession) {
        this.$store.commit('sign-up/locum/setRatePerSession', ratePerSession)
      }
    },

    scopeIR35: {
      get() {
        return this.$store.getters['sign-up/locum/getScopeIR35']
      },
      set(scopeIR35) {
        this.$store.commit('sign-up/locum/setScopeIR35', scopeIR35)
      }
    },
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
    },

    // QUALICATIONS
    qualificationsSearch() {
      this.showQualificationsSelect = true

      this.qualificationIndex = -1
    },

    qualificationIndex() {
      if (this.qualificationIndex > -1) {
        const element = this.$refs[`qualification-${this.qualificationIndex}`][0]

        if (!element) {
          return
        }

        if (!this.checkInView(this.$refs.qualificationsContainer, element, false)) {
          element.scrollIntoView({ block: 'nearest' })
        }
      }
    },
    // QUALICATIONS

    // SYSTEMS
    systemsSearch() {
      this.showSystemsSelect = true

      this.systemIndex = -1
    },

    systemIndex() {
      if (this.systemIndex > -1) {
        const element = this.$refs[`system-${this.systemIndex}`][0]

        if (!element) {
          return
        }

        if (!this.checkInView(this.$refs.systemsContainer, element, false)) {
          element.scrollIntoView({ block: 'nearest' })
        }
      }
    },
    // SYSTEMS

    // LANGUAGES
    languagesSearch() {
      this.showLanguagesSelect = true

      this.languageIndex = -1
    },

    languageIndex() {
      if (this.languageIndex > -1) {
        const element = this.$refs[`language-${this.languageIndex}`][0]

        if (!element) {
          return
        }

        if (!this.checkInView(this.$refs.languagesContainer, element, false)) {
          element.scrollIntoView({ block: 'nearest' })
        }
      }
    },
    // LANGUAGES

    ratePerHour() {
      this.checkRatePerHour()
    },

    ratePerSession() {
      this.checkRatePerSession()
    },
  },

  methods: {
    checkInView(container, elem, partial) {
      const contHeight = Number(getComputedStyle(container).height.replace('px', ''))
      const contTop = container.scrollTop
      const contBottom = contTop + contHeight

      const elemTop = elem.getBoundingClientRect().top + document.body.scrollTop - container.getBoundingClientRect().top + document.body.scrollTop
      const elemBottom = elemTop + Number(getComputedStyle(elem).height.replace('px', ''))
      const isTotal = elemTop >= 0 && elemBottom <= contHeight
      const isPart = ((elemTop < 0 && elemBottom > 0) || (elemTop > 0 && elemTop <= contHeight)) && partial
      return isTotal || isPart
    },

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
      // if (this.smartCardIdNumber.trim() !== '') {
      //   this.smartCardIdNumberErrorMessage = false
      // } else {
      //   this.smartCardIdNumberErrorMessage = 'Required'
      // }
    },
    checkProfession() {
      if (this.profession.trim() !== '') {
        this.professionErrorMessage = false
      } else {
        this.professionErrorMessage = 'Required'
      }
    },

    // QUALIFICATIONS
    hideQualificationsSelect() {
      this.showQualificationsSelect = false
    },

    inputQualificationSearchKeydownHandler(event) {
      if (event.key === 'ArrowUp') {
        if (this.qualificationIndex > 0) {
          this.qualificationIndex--
        }

        return
      }

      if (event.key === 'ArrowDown') {
        if (this.qualificationIndex < this.filteredQualifications.length - 1) {
          this.qualificationIndex++
        }

        return
      }

      if (event.key === 'Enter') {
        if (this.qualificationIndex > -1 && this.qualificationIndex < this.filteredQualifications.length) {
          this.addQualification(this.filteredQualifications[this.qualificationIndex])
        }

        return
      }

      if (event.key === 'Backspace') {
        if (this.qualificationsSearch === '' && this.selectedQualifications.length > 0) {
          this.removeQualification(this.selectedQualifications[this.selectedQualifications.length - 1])
        }

        return
      }

      if (event.key === 'Escape') {
        this.showQualificationsSelect = false

        this.qualificationIndex = -1

        return
      }

      if (event.key === 'Tab') {
        this.showQualificationsSelect = false

        this.qualificationIndex = -1

        return
      }
    },

    checkSelectedQualifications() {
      // this.$nextTick(() => {
      //   if (this.selectedQualifications.length === 0) {
      //     this.selectedQualificationsErrorMessage = 'Required'
      //   } else {
      //     this.selectedQualificationsErrorMessage = ''
      //   }
      // })
    },

    addQualification(qualification) {
      this.$store.commit('sign-up/locum/addSelectedQualification', qualification)

      this.qualificationIndex = -1

      this.$refs.inputQualificationsSearch.focus()

      this.checkSelectedQualifications()
    },

    removeQualification(qualification) {
      this.$store.commit('sign-up/locum/removeSelectedQualification', qualification)
    },
    // QUALIFICATIONS


    // SYSTEMS
    hideSystemSelect() {
      this.showSystemsSelect = false
    },

    inputSystemSearchKeydownHandler(event) {
      if (event.key === 'ArrowUp') {
        if (this.systemIndex > 0) {
          this.systemIndex--
        }

        return
      }

      if (event.key === 'ArrowDown') {
        if (this.systemIndex < this.filteredSystems.length - 1) {
          this.systemIndex++
        }

        return
      }

      if (event.key === 'Enter') {
        if (this.systemIndex > -1 && this.systemIndex < this.filteredSystems.length) {
          this.addSystem(this.filteredSystems[this.systemIndex])
        }

        return
      }

      if (event.key === 'Backspace') {
        if (this.systemsSearch === '' && this.selectedSystems.length > 0) {
          this.removeSystem(this.selectedSystems[this.selectedSystems.length - 1])
        }

        return
      }

      if (event.key === 'Escape') {
        this.showSystemsSelect = false

        this.systemIndex = -1

        return
      }

      if (event.key === 'Tab') {
        this.showSystemsSelect = false

        this.systemIndex = -1

        return
      }
    },

    checkSelectedSystems() {
      // this.$nextTick(() => {
      //   if (this.selectedSystems.length === 0) {
      //     this.selectedSystemsErrorMessage = 'Required'
      //   } else {
      //     this.selectedSystemsErrorMessage = ''
      //   }
      // })
    },

    addSystem(system) {
      this.$store.commit('sign-up/locum/addSelectedSystem', system)

      this.systemIndex = -1

      this.$refs.inputSystemsSearch.focus()

      this.checkSelectedSystems()
    },

    removeSystem(system) {
      this.$store.commit('sign-up/locum/removeSelectedSystem', system)
    },
    // SYSTEMS


    // LANGUAGES
    hideLanguageSelect() {
      this.showLanguagesSelect = false
    },

    inputLanguageSearchKeydownHandler(event) {
      if (event.key === 'ArrowUp') {
        if (this.languageIndex > 0) {
          this.languageIndex--
        }

        return
      }

      if (event.key === 'ArrowDown') {
        if (this.languageIndex < this.filteredLanguages.length - 1) {
          this.languageIndex++
        }

        return
      }

      if (event.key === 'Enter') {
        if (this.languageIndex > -1 && this.languageIndex < this.filteredLanguages.length) {
          this.addLanguage(this.filteredLanguages[this.languageIndex])
        }

        return
      }

      if (event.key === 'Backspace') {
        if (this.languagesSearch === '' && this.selectedLanguages.length > 0) {
          this.removeLanguage(this.selectedLanguages[this.selectedLanguages.length - 1])
        }

        return
      }

      if (event.key === 'Escape') {
        this.showLanguagesSelect = false

        this.languageIndex = -1

        return
      }

      if (event.key === 'Tab') {
        this.showLanguagesSelect = false

        this.languageIndex = -1

        return
      }
    },

    checkSelectedLanguages() {
    },

    addLanguage(language) {
      this.$store.commit('sign-up/locum/addSelectedLanguage', language)

      this.languageIndex = -1

      this.$refs.inputLanguagesSearch.focus()

      this.checkSelectedLanguages()
    },

    removeLanguage(language) {
      this.$store.commit('sign-up/locum/removeSelectedLanguage', language)
    },
    // LANGUAGES

    checkRatePerHour() {
      if (this.ratePerHour && isNaN(this.ratePerHour)) {
        this.ratePerHourErrorMessage = 'Please enter a valid number.'
      } else {
        this.ratePerHourErrorMessage = ''
      }
    },

    checkRatePerSession() {
      if (this.ratePerSession && isNaN(this.ratePerSession)) {
        this.ratePerSessionErrorMessage = 'Please enter a valid number.'
      } else {
        this.ratePerSessionErrorMessage = ''
      }
    },

    next(event) {
      this.$store.dispatch('sign-up/locum/professionalDetailsNext').then(() => {

        if (this.gmcNumberErrorMessage) {
          this.$refs.inputGmcNumber.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })

          return
        }

        if (this.mplNumberErrorMessage) {
          this.$refs.inputMplNumber.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })

          return
        }

        if (this.professionErrorMessage) {
          this.$refs.inputProfession.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })

          return
        }

        this.$router.push('/sign-up/locum/credential-details')
      })
    }
  },

  mounted() {
    this.gmcNumberErrorMessage = ''
    this.mplNumberErrorMessage = ''
    this.professionErrorMessage = ''
  }
}
</script>
