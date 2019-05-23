<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex m-4" style="flex: 0 1 600px;">
        <h4>Your professional details</h4>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <AppInput
            v-model="form.gmc_or_nmc_number"
            :type="'text'"
            :name="'gmc_or_nmc_number'"
            :label="'Your GMC / NMC Number'"
            :placeholder="'GMC / NMC Number'"
            :error="formError.find(item => item.field === 'gmc_or_nmc_number')"
            :info="'For compliance; to be verified by the hubzz team'"
          />
          <AppInput
            v-model="form.mpl_or_npl_number"
            :type="'text'"
            :name="'mpl_or_npl_number'"
            :label="'Your MPL / NPL Number'"
            :placeholder="'MPL / NPL Number'"
            :error="formError.find(item => item.field === 'mpl_or_npl_number')"
            :info="'For compliance; to be verified by the hubzz team'"
          />
          <AppInput
            v-model="form.nhs_smart_card_id_number"
            :type="'text'"
            :name="'nhs_smart_card_id_number'"
            :label="'Your NHS Smart Card ID number'"
            :placeholder="'NHS Smart Card ID number'"
          />

          <AppSelect
            v-model="form.profession_id"
            :name="'profession_id'"
            :label="'Profession'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'profession_id')"
            :items="professions"
          />

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="profession" class="text-xs lg:text-base mb-4 w-1/2">Specialty</label>
              <div
                class="text-xs lg:text-base rounded-lg bg-grey-light px-2 py-1"
              >Choose at least one qualification</div>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div class="w-full">
                <div class="flex flex-row flex-wrap text-xs lg:text-base">
                  <div
                    class="rounded-lg bg-yellow font-bold p-2 m-1"
                    v-for="(item, index) in selectedQualifications"
                    :key="`${item}-${index}`"
                  >
                    {{item.name}}
                    <span
                      class="font-bold cursor-pointer text-sm lg:text-lg"
                      @click="removeQualification(item, index)"
                    >X</span>
                  </div>
                </div>
                <div class="relative">
                  <input
                    type="text"
                    ref="qualification_id"
                    class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow w-full"
                    :class="formError.find(item => item.field === 'qualification_id') ? 'border-red':''"
                    @focus="''"
                    @blur="''"
                    v-model="searchQualifications"
                    placeholder="Select.."
                    @keydown="qualificationKeyDownHandler"
                    @click.prevent="showQualifications=true"
                  >
                  <transition name="fade">
                    <div
                      class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                      v-if="showQualifications"
                      style="height:100px"
                      v-on-clickaway="hideQualifications"
                    >
                      <div
                        v-for="(item, index) in filteredQualifications"
                        :key="`${item}-${index}`"
                        class="p-2 cursor-pointer"
                        @mouseover="qualificationsIndex=index"
                        :class="qualificationsIndex === index ? 'bg-grey':''"
                        @click="selectQualification(item, index)"
                      >
                        <strong>{{item.name}}</strong>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'qualification_id')"
            >{{formError.find(item => item.field === 'qualification_id').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="profession" class="text-xs lg:text-base mb-4 w-1/2">Clinical Systems</label>
              <div
                class="text-xs lg:text-base rounded-lg bg-grey-light px-2 py-1"
              >Choose at least one IT system</div>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div class="w-full">
                <div class="flex flex-row flex-wrap text-xs lg:text-base">
                  <div
                    class="rounded-lg bg-yellow font-bold p-2 m-1"
                    v-for="(item, index) in selectedClinicalSystems"
                    :key="`${item}-${index}`"
                  >
                    {{item.name}}
                    <span
                      class="font-bold cursor-pointer text-sm lg:text-lg"
                      @click="removeClinicalSystems(item, index)"
                    >X</span>
                  </div>
                </div>
                <div class="relative">
                  <input
                    type="text"
                    ref="clinical_system_id"
                    class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow w-full"
                    :class="formError.find(item => item.field === 'clinical_system_id') ? 'border-red':''"
                    @focus="''"
                    @blur="''"
                    v-model="searchClinicalSystems"
                    placeholder="Select.."
                    @keydown="clinicalSystemsKeyDownHandler"
                    @click.prevent="showClinicalSystems=true"
                  >
                  <transition name="fade">
                    <div
                      class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                      v-if="showClinicalSystems"
                      style="height:100px"
                      v-on-clickaway="hideClinicalSystems"
                    >
                      <div
                        v-for="(item, index) in filteredClinicalSystems"
                        :key="`${item}-${index}`"
                        class="p-2 cursor-pointer"
                        @mouseover="clinicalSystemsIndex=index"
                        :class="clinicalSystemsIndex === index ? 'bg-grey':''"
                        @click="selectClinicalSystems(item, index)"
                      >
                        <strong>{{item.name}}</strong>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'clinical_system_id')"
            >{{formError.find(item => item.field === 'clinical_system_id').message}}</div>
          </div>

          <div class="relative flex flex-col mt-8">
            <div class="flex flex-row justify-between">
              <label for="profession" class="text-xs lg:text-base mb-4 w-1/2">Spoken Languages</label>
              <div
                class="text-xs lg:text-base rounded-lg bg-grey-light px-2 py-1"
              >Choose other languages you can speak</div>
            </div>
            <div class="flex flex-row justify-between mt-4">
              <div class="w-full">
                <div class="flex flex-row flex-wrap text-xs lg:text-base">
                  <div class="rounded-lg bg-yellow font-bold p-2 m-1">English</div>
                  <div
                    class="rounded-lg bg-yellow font-bold p-2 m-1"
                    v-for="(item, index) in selectedSpokenLanguages"
                    :key="`${item}-${index}`"
                  >
                    {{item.name}}
                    <span
                      class="font-bold cursor-pointer text-sm lg:text-lg"
                      @click="removeSpokenLanguages(item, index)"
                    >X</span>
                  </div>
                </div>
                <div class="relative">
                  <input
                    type="text"
                    ref="spoken_language_id"
                    class="py-2 font-bold text-xs lg:text-base border-b-2 focus:outline-none focus:border-yellow w-full"
                    :class="formError.find(item => item.field === 'spoken_language_id') ? 'border-red':''"
                    @focus="''"
                    @blur="''"
                    v-model="searchSpokenLanguages"
                    placeholder="Select.."
                    @keydown="spokenLanguagesKeyDownHandler"
                    @click.prevent="showSpokenLanguages=true"
                  >
                  <transition name="fade">
                    <div
                      class="bg-white shadow-lg overflow-auto absolute pin-x z-10"
                      v-if="showSpokenLanguages"
                      style="height:100px"
                      v-on-clickaway="hideSpokenLanguages"
                    >
                      <div
                        v-for="(item, index) in filteredSpokenLanguages"
                        :key="`${item}-${index}`"
                        class="p-2 cursor-pointer"
                        @mouseover="spokenLanguagesIndex=index"
                        :class="spokenLanguagesIndex === index ? 'bg-grey':''"
                        @click="selectSpokenLanguages(item, index)"
                      >
                        <strong>{{item.name}}</strong>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'spoken_language_id')"
            >{{formError.find(item => item.field === 'spoken_language_id').message}}</div>
          </div>

          <div class="relative flex flex-col my-8">
            <div class="flex flex-row justify-between">
              <label for="rates" class="text-sm">Your preferred rates £</label>
              <div class="text-sm rounded-lg bg-grey-light px-2 py-1">To match available jobs with</div>
            </div>
            <div class="flex flex-row flex-wrap justify-between mt-4">
              <div class="relative w-full lg:w-1/3 px-1 mt-4">
                <label for="rate_per_hour" class="text-sm">Per hour</label>
                <div
                  class="border-b-2 p-2 cursor-pointer text-xs lg:text-base font-bold"
                  :class="rateRangeModal && modalType === 'rate_range_per_hour'?'border-yellow':''"
                  @click="openDateRangeModal('rate_range_per_hour')"
                >£ {{form.min_rate_per_hour}} - £ {{form.max_rate_per_hour}}</div>
              </div>
              <div class="relative w-full lg:w-1/3 px-1 mt-4">
                <label for="rate_per_half_day" class="text-sm">Per half day session</label>
                <div
                  class="border-b-2 p-2 cursor-pointer text-xs lg:text-base font-bold"
                  :class="rateRangeModal && modalType === 'rate_range_per_half_day_session'?'border-yellow':''"
                  @click="openDateRangeModal('rate_range_per_half_day_session')"
                >£ {{form.min_rate_per_half_day_session}} - £ {{form.max_rate_per_half_day_session}}</div>
              </div>
              <div class="relative w-full lg:w-1/3 px-1 mt-4">
                <label for="rate_per_whole_day" class="text-sm">Per whole day session</label>
                <div
                  class="border-b-2 p-2 cursor-pointer text-xs lg:text-base font-bold"
                  :class="rateRangeModal && modalType === 'rate_range_per_whole_day_session'?'border-yellow':''"
                  @click="openDateRangeModal('rate_range_per_whole_day_session')"
                >£ {{form.min_rate_per_whole_day_session}} - £ {{form.max_rate_per_whole_day_session}}</div>
              </div>
            </div>
            <div
              class="absolute pin-t pin-r bg-red text-white p-1"
              v-if="formError.find(item => item.field === 'min_rate_per_hour' || item.field === 'max_rate_per_hour' || item.field === 'min_rate_per_half_day_session' || item.field === 'max_rate_per_half_day_session' || item.field === 'min_rate_per_whole_day_session' || item.field === 'max_rate_per_whole_day_session')"
            >{{formError.find(item => item.field === 'min_rate_per_hour' || item.field === 'max_rate_per_hour' || item.field === 'min_rate_per_half_day_session' || item.field === 'max_rate_per_half_day_session' || item.field === 'min_rate_per_whole_day_session' || item.field === 'max_rate_per_whole_day_session').message}}</div>
            <RateRangeModal v-if="rateRangeModal" @close="close" @save="save" :data="rate_range"/>
          </div>

          <AppSelect
            v-model="form.ir35"
            :name="'ir35'"
            :label="'Are you OK to work with Practices that are inside of scope for IR35?'"
            :placeholder="'Select'"
            :error="formError.find(item => item.field === 'ir35')"
            :items="[{value: false, label: 'No'},{value: true, label: 'Yes'}]"
            :info="'Only apply if you are self-employed'"
          />

          <AppInput
            :type="'multi-checkbox'"
            @checked="form.practice_type_id.push(parseInt($event))"
            @unchecked="form.practice_type_id.splice(form.practice_type_id.findIndex(item => item == $event), 1)"
            :name="'practice_type_id'"
            :label="'What type of Practice(s) are you?'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'practice_type_id')"
            :lists="practiceTypes"
            :selected="form.practice_type_id"
          />
        </form>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start mt-5">
      <div class="flex justify-center" style="width:600px">
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none mx-1"
          @click.prevent="$store.commit('signUp/SET_ACTIVE_TAB', 'address_details')"
          v-text="'<<'"
        ></button>
        <button
          class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none"
          @click.prevent="next"
        >Next</button>
      </div>
    </div>
  </div>
</template>
<script>
import RateRangeModal from '@/components/SignUp/SignUpLocum/RateRangeModal'
import AppInput from '@/components/Base/AppInput'
import AppSelect from '@/components/Base/AppSelect'
import { mixin as clickaway } from 'vue-clickaway'
export default {
  components: {
    AppInput,
    AppSelect,
    RateRangeModal
  },
  mixins: [clickaway],
  data() {
    return {
      modalType: '',
      rate_range: {
        min: 0,
        max: 0
      },
      rateRangeModal: false,

      searchQualifications: '',
      qualificationsIndex: 0,
      showQualifications: false,
      selectedQualifications: [],

      searchClinicalSystems: '',
      clinicalSystemsIndex: 0,
      showClinicalSystems: false,
      selectedClinicalSystems: [],

      searchSpokenLanguages: '',
      spokenLanguagesIndex: 0,
      showSpokenLanguages: false,
      selectedSpokenLanguages: [],

      searchPracticeTypes: '',
      practiceTypesIndex: 0,
      showPracticeTypes: false,
      selectedPracticeTypes: [],

      form: {
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
        ir35: false,
        practice_type_id: [],
        // ! ask arvi
        mandatory_training_id: []
      },
      formError: [],
      setFocus: ''
    }
  },
  watch: {
    // ! ask arvi how to validate this, with spaces
    'form.gmc_or_nmc_number'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'gmc_or_nmc_number')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'gmc_or_nmc_number', message: 'Required' })
      }
    },
    'form.mpl_or_npl_number'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'mpl_or_npl_number')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (!value) {
        // required
        this.formError.push({ field: 'mpl_or_npl_number', message: 'Required' })
      }
    },
    'form.practice_type_id'(value) {
      // splice from formerror
      let index = this.formError.findIndex(item => item.field === 'practice_type_id')
      if (index >= 0) {
        this.formError.splice(index, 1)
      }
      // validate
      if (value.length < 1) {
        // required
        this.formError.push({ field: 'practice_type_id', message: 'Required' })
      }
    },
    showQualifications(value) {
      if (!value) {
        this.ValidateArray(this.selectedQualifications, 'qualification_id')
      }
    },
    showClinicalSystems(value) {
      if (!value) {
        this.ValidateArray(this.selectedClinicalSystems, 'clinical_system_id')
      }
    },
    showSpokenLanguages(value) {
      if (!value) {
        this.ValidateArray(this.selectedSpokenLanguages, 'spoken_language_id')
      }
    },
  },
  computed: {
    professions() {
      return this.$store.getters['signUp/getProfessions']
    },
    qualifications() {
      return this.$store.state.signUp.qualifications
    },
    clinicalSystems() {
      return this.$store.state.signUp.clinicalSystems
    },
    spokenLanguages() {
      return this.$store.state.signUp.spokenLanguages
    },
    practiceTypes() {
      return this.$store.getters['signUp/getPracticeTypes']
    },
    //! Add RegExp on these filtered seach
    filteredQualifications() {
      return this.qualifications.filter((qualification) => {
        const index = this.selectedQualifications.findIndex((item) => {
          return item.id === qualification.id
        })
        return index === -1 && qualification.id && qualification.name.includes(this.searchQualifications)
        // let regex = new RegExp('//')
        // console.log(specialty.match(regex))
        // return index === -1 && specialty && specialty.match(regex)
      })
    },
    filteredClinicalSystems() {
      return this.clinicalSystems.filter((clinicalSystem) => {
        const index = this.selectedClinicalSystems.findIndex((item) => {
          return item.id === clinicalSystem.id
        })
        return index === -1 && clinicalSystem.id && clinicalSystem.name.includes(this.searchClinicalSystems)
      })
    },
    filteredSpokenLanguages() {
      return this.spokenLanguages.filter((spokenLanguage) => {
        const index = this.selectedSpokenLanguages.findIndex((item) => {
          return item.id === spokenLanguage.id
        })
        return index === -1 && spokenLanguage.id && spokenLanguage.name.includes(this.searchSpokenLanguages)
      })
    },
    filteredPracticeTypes() {
      return this.practiceTypes.filter((practiceType) => {
        const index = this.selectedPracticeTypes.findIndex((item) => {
          return item.id === practiceType.id
        })
        return index === -1 && practiceType.id && practiceType.name.includes(this.searchPracticeTypes)
      })
    },
    professionalDetails() {
      return this.$store.state.signUp.professional_details
    },
    professionalFormError() {
      return this.$store.state.signUp.professional_detail_form_error
    }
  },
  mounted() {
    this.form.gmc_or_nmc_number = this.professionalDetails.gmc_or_nmc_number
    this.form.mpl_or_npl_number = this.professionalDetails.mpl_or_npl_number
    this.form.nhs_smart_card_id_number = this.professionalDetails.nhs_smart_card_id_number
    this.form.profession_id = this.professionalDetails.profession_id
    this.selectedQualifications = []
    this.qualifications.forEach(item => {
      if (this.professionalDetails.qualification_id.includes(item.id)) {
        this.selectedQualifications.push(item)
      }
    })
    this.selectedClinicalSystems = []
    this.clinicalSystems.forEach(item => {
      if (this.professionalDetails.clinical_system_id.includes(item.id)) {
        this.selectedClinicalSystems.push(item)
      }
    })

    this.selectedSpokenLanguages = []
    this.spokenLanguages.forEach(item => {
      if (this.professionalDetails.spoken_language_id.includes(item.id)) {
        this.selectedSpokenLanguages.push(item)
      }
    })

    this.form.min_rate_per_hour = this.professionalDetails.min_rate_per_hour
    this.form.max_rate_per_hour = this.professionalDetails.max_rate_per_hour
    this.form.min_rate_per_half_day_session = this.professionalDetails.min_rate_per_half_day_session
    this.form.max_rate_per_half_day_session = this.professionalDetails.max_rate_per_half_day_session
    this.form.min_rate_per_whole_day_session = this.professionalDetails.min_rate_per_whole_day_session
    this.form.max_rate_per_whole_day_session = this.professionalDetails.max_rate_per_whole_day_session
    this.form.ir35 = this.professionalDetails.ir35

    this.form.practice_type_id = []
    this.practiceTypes.forEach(item => {
      if (this.professionalDetails.practice_type_id.includes(item.value)) {
        this.form.practice_type_id.push(item.value)
      }
    })

    if (this.professionalFormError.length > 0) {
      this.professionalFormError.forEach(item => {
        this.formError.push(item)
      })
    }
  },
  methods: {
    close() {
      this.modalType = ''
      this.rateRangeModal = false
    },
    openDateRangeModal(type) {
      this.modalType = type
      this.rateRangeModal = true
      switch (type) {
        case 'rate_range_per_hour':
          this.rate_range.min = this.form.min_rate_per_hour
          this.rate_range.max = this.form.max_rate_per_hour
          break;
        case 'rate_range_per_half_day_session':
          this.rate_range.min = this.form.min_rate_per_half_day_session
          this.rate_range.max = this.form.max_rate_per_half_day_session
          break;
        case 'rate_range_per_whole_day_session':
          this.rate_range.min = this.form.min_rate_per_whole_day_session
          this.rate_range.max = this.form.max_rate_per_whole_day_session
          break;
        default:
          return
      }
    },
    save(data) {
      this.rateRangeModal = false
      switch (this.modalType) {
        case 'rate_range_per_hour':
          this.form.min_rate_per_hour = data.min
          this.form.max_rate_per_hour = data.max
          break;
        case 'rate_range_per_half_day_session':
          this.form.min_rate_per_half_day_session = data.min
          this.form.max_rate_per_half_day_session = data.max
          break;
        case 'rate_range_per_whole_day_session':
          this.form.min_rate_per_whole_day_session = data.min
          this.form.max_rate_per_whole_day_session = data.max
          break;
        default:
          return
      }
    },

    hideQualifications() {
      this.showQualifications = false
    },
    selectQualification(item, index) {
      this.selectedQualifications.push(item)
    },
    removeQualification(item, index) {
      this.selectedQualifications.splice(index, 1)
      this.ValidateArray(this.selectedQualifications, 'qualification_id')
    },
    qualificationKeyDownHandler(event) {
      // if (this.setFocus !== 'specialty') {
      //   return
      // } else {
      if (event.key === 'ArrowUp') {
        if (this.qualificationsIndex > 0) {
          this.qualificationsIndex--
        } else {
          this.qualificationsIndex = this.qualifications.length - 1
        }
      }

      if (event.key === 'ArrowDown') {
        if (this.qualificationsIndex === this.qualifications.length - 1) {
          this.qualificationsIndex = 0
        } else {
          this.qualificationsIndex++
        }
      }

      if (event.key === 'Enter') {
        if (this.filteredQualifications.find((item, index) => index === this.qualificationsIndex)) {
          this.selectQualification(this.filteredQualifications.find((item, index) => index === this.qualificationsIndex), this.qualificationsIndex)
        }
      }

      if (event.key === 'Backspace') {
        if (!this.searchQualifications) {
          this.removeQualification(this.selectedQualifications[this.selectedQualifications.length - 1], this.selectedQualifications.length - 1)
        }
      }

      if (event.key === 'Escape') {
        this.setFocus = ''
      }


    },

    hideClinicalSystems() {
      // this.setFocus = ''
      this.showClinicalSystems = false
    },
    selectClinicalSystems(item, index) {
      this.selectedClinicalSystems.push(item)
    },
    removeClinicalSystems(item, index) {
      this.selectedClinicalSystems.splice(index, 1)
      this.ValidateArray(this.selectedClinicalSystems, 'clinical_system_id')
    },
    clinicalSystemsKeyDownHandler(event) {
      if (this.setFocus !== 'clinical_system_id') {
        return
      } else {
        if (event.key === 'ArrowUp') {
          if (this.clinicalSystemsIndex > 0) {
            this.clinicalSystemsIndex--
          } else {
            this.clinicalSystemsIndex = this.clinicalSystems.length - 1
          }
        }

        if (event.key === 'ArrowDown') {
          if (this.clinicalSystemsIndex === this.clinicalSystems.length - 1) {
            this.clinicalSystemsIndex = 0
          } else {
            this.clinicalSystemsIndex++
          }
        }

        if (event.key === 'Enter') {
          if (this.filteredClinicalSystems.find((item, index) => index === this.clinicalSystemsIndex)) {
            this.selectClinicalSystems(this.filteredClinicalSystems.find((item, index) => index === this.clinicalSystemsIndex), this.clinicalSystemsIndex)
          }
        }

        if (event.key === 'Backspace') {
          if (!this.searchClinicalSystems) {
            this.removeClinicalSystems(this.selectedClinicalSystems[this.selectedClinicalSystems.length - 1], this.selectedClinicalSystems.length - 1)
          }
        }

        if (event.key === 'Escape') {
          this.setFocus = ''
        }
      }

    },

    hideSpokenLanguages() {
      // this.setFocus = ''
      this.showSpokenLanguages = false
    },
    selectSpokenLanguages(item, index) {
      this.selectedSpokenLanguages.push(item)
    },
    removeSpokenLanguages(item, index) {
      this.selectedSpokenLanguages.splice(index, 1)
      this.ValidateArray(this.selectedSpokenLanguages, 'spoken_language_id')
    },
    spokenLanguagesKeyDownHandler(event) {
      if (this.setFocus !== 'spoken_language_id') {
        return
      } else {
        if (event.key === 'ArrowUp') {
          if (this.spokenLanguagesIndex > 0) {
            this.spokenLanguagesIndex--
          } else {
            this.spokenLanguagesIndex = this.spokenLanguages.length - 1
          }
        }

        if (event.key === 'ArrowDown') {
          if (this.spokenLanguagesIndex === this.spokenLanguages.length - 1) {
            this.spokenLanguagesIndex = 0
          } else {
            this.spokenLanguagesIndex++
          }
        }

        if (event.key === 'Enter') {
          if (this.filteredSpokenLanguages.find((item, index) => index === this.spokenLanguagesIndex)) {
            this.selectSpokenLanguages(this.filteredSpokenLanguages.find((item, index) => index === this.spokenLanguagesIndex), this.spokenLanguagesIndex)
          }
        }

        if (event.key === 'Backspace') {
          if (!this.searchSpokenLanguages) {
            this.removeSpokenLanguages(this.selectedSpokenLanguages[this.selectedSpokenLanguages.length - 1], this.selectedSpokenLanguages.length - 1)
          }
        }

        if (event.key === 'Escape') {
          this.setFocus = ''
        }
      }

    },

    next() {
      try {
        this.formError = []
        this.form.qualification_id = []
        this.selectedQualifications.forEach(item => {
          this.form.qualification_id.push(item.id)
        })
        this.selectedClinicalSystems.forEach(item => {
          this.form.clinical_system_id.push(item.id)
        })
        this.selectedSpokenLanguages.forEach(item => {
          this.form.spoken_language_id.push(item.id)
        })
        this.Validate(this.form, ['nhs_smart_card_id_number', 'spoken_language_id', 'mandatory_training_id'])
        if (!this.formError.length) {
          this.$store.commit('signUp/SET_PROFESSIONAL_DETAILS', this.form)
          this.$store.commit('signUp/SET_ACTIVE_TAB', 'credential_details')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped>
button:active {
  transform: translate(5px, 5px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  transform: translateY(10px);
}
</style>
