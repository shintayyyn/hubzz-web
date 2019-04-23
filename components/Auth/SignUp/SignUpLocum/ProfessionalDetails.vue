<template>
    <div class="flex flex-col items-center justify-center w-full">

        <div class="flex w-full justify-center xl:justify-start">
          <div class="flex m-4" style="flex: 0 1 600px;">
            <h4>Your professional details {{setFocus}}</h4>
          </div>
        </div>

        <div class="flex w-full justify-center xl:justify-start">
          <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">

            <form class="w-full">

              <div class="relative flex flex-col mt-8">
                <div class="flex flex-row justify-between">
                  <label for="gmc_nmc_number" class="text-sm" style="width:50%">Your GMC / NMC Number</label>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'gmc_nmc_number' ? 'border-yellow':'', formError.find(item => item.field === 'gmc_nmc_number') ? 'border-red':'']">
                    <input type="text" name="gmc_nmc_number" id="gmc_nmc_number" ref="gmc_nmc_number" class="focus:outline-none font-bold text-sm"
                      style="height:40px;" @focus="setFocus = 'gmc_nmc_number'" @blur="setFocus = ''" v-model="form.gmc_nmc_number"
                      placeholder="GMC / NMC Number">
                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1" v-if="formError.find(item => item.field === 'gmc_nmc_number')">
                  {{formError.find(item => item.field === 'gmc_nmc_number').message}}
                </div>
              </div>

              <div class="relative flex flex-col mt-8">
                <div class="flex flex-row justify-between">
                  <label for="mpl_npl_number" class="text-sm" style="width:50%">Your MPL / NPL Number</label>
                  <div class="text-sm rounded-lg bg-grey-light px-2 py-1">For compliance; to be verified by the hubzz team</div>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'mpl_npl_number' ? 'border-yellow':'', formError.find(item => item.field === 'mpl_npl_number') ? 'border-red':'']">
                    <input type="text" name="mpl_npl_number" id="mpl_npl_number" ref="mpl_npl_number" class="focus:outline-none font-bold text-sm"
                      style="height:40px;" @focus="setFocus = 'mpl_npl_number'" @blur="setFocus = ''" v-model="form.mpl_npl_number"
                      placeholder="GMC / NMC Number">
                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1" v-if="formError.find(item => item.field === 'mpl_npl_number')">
                  {{formError.find(item => item.field === 'mpl_npl_number').message}}
                </div>
              </div>

              <div class="relative flex flex-col mt-8">
                <div class="flex flex-row justify-between">
                  <label for="nhs_smart_card_number" class="text-sm" style="width:50%">Your NHS Smart Card ID number</label>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'nhs_smart_card_number' ? 'border-yellow':'', formError.find(item => item.field === 'nhs_smart_card_number') ? 'border-red':'']">
                    <input type="text" name="nhs_smart_card_number" id="nhs_smart_card_number" ref="nhs_smart_card_number" class="focus:outline-none font-bold text-sm"
                      style="height:40px;" @focus="setFocus = 'nhs_smart_card_number'" @blur="setFocus = ''" v-model="form.nhs_smart_card_number"
                      placeholder="NHS Smart Card ID number">
                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1 " v-if="formError.find(item => item.field === 'nhs_smart_card_number')">
                  {{formError.find(item => item.field === 'nhs_smart_card_number').message}}
                </div>
              </div>

              <div class="relative flex flex-col mt-8">
                <div class="flex flex-row justify-between">
                  <label for="profession" class="text-sm" style="width:50%">Profession</label>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'profession' ? 'border-yellow':'', formError.find(item => item.field === 'profession') ? 'border-red':'']">
                    <select class="focus:outline-none font-bold text-sm" style="height:40px;"
                      @focus="setFocus = 'profession'" @blur="setFocus = ''" v-model="form.profession">
                      <option value="" selected disabled>Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1 " v-if="formError.find(item => item.field === 'profession')">
                  {{formError.find(item => item.field === 'profession').message}}
                </div>
              </div>

              <div class="relative flex flex-col mt-8" >
                <div class="flex flex-row justify-between">
                  <label for="specialty" class="text-sm" style="width:50%">Specialty</label>
                  <div class="text-sm rounded-lg bg-grey-light px-2 py-1">Choose at least one qualification</div>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'specialty' ? 'border-yellow':'', formError.find(item => item.field === 'specialty') ? 'border-red':'']">

                    <div class="flex flex-row flex-wrap">
                      <div class="rounded-lg bg-yellow font-bold p-2 m-1" v-for="(item, index) in selectedSpecialties" :key="`${item}-${index}`">
                        {{item}} <span class="font-bold cursor-pointer text-lg" @click="removeSpecialty(item, index)">X</span>
                      </div>
                    </div>

                    <div class="relative" >
                      <input type="text" name="specialty" id="specialty" ref="specialty" class="focus:outline-none font-bold text-sm"
                        style="height:40px;width:100%;" @focus="setFocus = 'specialty'" @blur="setFocus = ''" v-model="searchSpecialties"
                        placeholder="Select.." @click.prevent="showSpecialties=true, setFocus = 'specialty'" @keydown="specialtyKeyDownHandler">

                      <transition name="fade">
                        <div class="bg-white shadow-lg overflow-auto absolute pin-x z-10" v-if="showSpecialties" style="height:100px" v-on-clickaway="hideSpecialties">
                          <div v-for="(item, index) in filteredSpecialties" :key="`${item}-${index}`" class="p-2 cursor-pointer" @mouseover="specialtiesIndex=index"
                              :class="specialtiesIndex === index ? 'bg-grey':''" @click="selectSpecialty(item, index)">
                              <strong>{{item}}</strong>
                          </div>
                        </div>
                      </transition>

                    </div>

                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1 " v-if="formError.find(item => item.field === 'specialty')">
                  {{formError.find(item => item.field === 'specialty').message}}
                </div>
              </div>

              <div class="relative flex flex-col mt-8" >
                <div class="flex flex-row justify-between">
                  <label for="clinical_systems" class="text-sm" style="width:50%">Clinical Systems</label>
                  <div class="text-sm rounded-lg bg-grey-light px-2 py-1">Choose at least one IT system</div>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'clinical_systems' ? 'border-yellow':'', formError.find(item => item.field === 'clinical_systems') ? 'border-red':'']">

                    <div class="flex flex-row flex-wrap">
                      <div class="rounded-lg bg-yellow font-bold p-2 m-1" v-for="(item, index) in selectedClinicalSystems" :key="`${item}-${index}`">
                        {{item}} <span class="font-bold cursor-pointer text-lg" @click="removeClinicalSystems(item, index)">X</span>
                      </div>
                    </div>

                    <div class="relative" >
                      <input type="text" name="clinical_systems" id="clinical_systems" ref="clinical_systems" class="focus:outline-none font-bold text-sm"
                        style="height:40px;width:100%;" @focus="setFocus = 'clinical_systems'" @blur="setFocus = ''" v-model="searchClinicalSystems"
                        placeholder="Select.." @click.prevent="showClinicalSystems=true, setFocus = 'clinical_systems'" @keydown="clinicalSystemsKeyDownHandler">

                      <transition name="fade">
                        <div class="bg-white shadow-lg overflow-auto absolute pin-x z-10" v-if="showClinicalSystems" style="height:100px;" v-on-clickaway="hideClinicalSystems">
                          <div v-for="(item, index) in filteredClinicalSystems" :key="`${item}-${index}`" class="p-2 cursor-pointer" @mouseover="clinicalSystemsIndex=index"
                              :class="clinicalSystemsIndex === index ? 'bg-grey':''" @click="selectClinicalSystems(item, index)">
                              <strong>{{item}}</strong>
                          </div>
                        </div>
                      </transition>

                    </div>

                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1 " v-if="formError.find(item => item.field === 'clinical_systems')">
                  {{formError.find(item => item.field === 'clinical_systems').message}}
                </div>
              </div>

              <div class="relative flex flex-col mt-8">
                <div class="flex flex-row justify-between">
                  <label for="clinical_systems" class="text-sm" style="width:50%">Spoken Languages</label>
                  <div class="text-sm rounded-lg bg-grey-light px-2 py-1">Choose other languages you can speak</div>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'spoken_languages' ? 'border-yellow':'', formError.find(item => item.field === 'spoken_languages') ? 'border-red':'']">

                    <div class="flex flex-row flex-wrap">
                      <div class="rounded-lg bg-yellow font-bold p-2 m-1" v-for="(item, index) in selectedSpokenLanguages" :key="`${item}-${index}`">
                        {{item}} <span class="font-bold cursor-pointer text-lg" @click="removeSpokenLanguages(item, index)">X</span>
                      </div>
                    </div>

                    <div class="relative" >
                      <input type="text" name="spoken_languages" id="spoken_languages" ref="spoken_languages" class="focus:outline-none font-bold text-sm"
                        style="height:40px;width:100%;" @focus="setFocus = 'spoken_languages'" @blur="setFocus = ''" v-model="searchSpokenLanguages"
                        placeholder="Select.." @click.prevent="showSpokenLanguages=true, setFocus = 'spoken_languages'" @keydown="spokenLanguagesKeyDownHandler">

                      <div class="bg-white shadow-lg overflow-auto absolute pin-x z-10" v-if="showSpokenLanguages" style="height:100px;" v-on-clickaway="hideSpokenLanguages">
                        <div v-for="(item, index) in filteredSpokenLanguages" :key="`${item}-${index}`" class="p-2 cursor-pointer" @mouseover="spokenLanguagesIndex=index"
                            :class="spokenLanguagesIndex === index ? 'bg-grey':''"  @click="selectSpokenLanguages(item, index)">
                            <strong>{{item}}</strong>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1 " v-if="formError.find(item => item.field === 'spoken_languages')">
                  {{formError.find(item => item.field === 'spoken_languages').message}}
                </div>
              </div>

              <div class="relative flex flex-col mt-8">
                <div class="flex flex-row justify-between">
                  <label for="rates" class="text-sm">Your preferred rates £</label>
                  <div class="text-sm rounded-lg bg-grey-light px-2 py-1">To match available jobs with</div>
                </div>
                <div class="flex flex-row flex-wrap justify-between mt-4">
                  <div class="relative flex flex-col border-b-2 border-grey-light" style="width:49%"
                    :class="[setFocus === 'rates_per_hour' ? 'border-yellow':'', formError.find(item => item.field === 'rates_per_hour') ? 'border-red':'']">
                    <label for="rates_per_hour" class="text-sm">Per hour</label>
                    <input type="text" name="rates_per_hour" ref="rates_per_hour" id="rates_per_hour" class="focus:outline-none font-bold text-sm text-right"
                        style="height:40px" @focus="setFocus = 'rates_per_hour'" @blur="setFocus = ''"
                        @click="setFocus = 'rates_per_hour'" v-model="form.rates_per_hour">
                  </div>
                  <div class="relative flex flex-col border-b-2 border-grey-light" style="width:49%"
                    :class="[setFocus === 'rates_per_session' ? 'border-yellow':'', formError.find(item => item.field === 'rates_per_session') ? 'border-red':'']">
                    <label for="rates_per_session" class="text-sm">Per session</label>
                    <input type="text" name="rates_per_session" ref="rates_per_session" id="rates_per_session" class="focus:outline-none font-bold text-sm text-right"
                        style="height:40px" @focus="setFocus = 'rates_per_session'" @blur="setFocus = ''"
                        @click="setFocus = 'rates_per_session'" v-model="form.rates_per_session">
                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1 " v-if="formError.find(item => item.field === 'rates_per_hour' || item.field === 'rates_per_session')">
                  {{formError.find(item => item.field === 'rates_per_hour' || item.field === 'rates_per_session').message}}
                </div>
              </div>
              
              <div class="relative flex flex-col mt-24">
                <div class="flex flex-row justify-between">
                  <label for="ir35_scoped" class="text-sm" style="width:50%">Are you OK to work with Practices that are inside of scope for IR35?</label>
                </div>
                <div class="flex flex-row justify-between mt-4">
                  <div class="flex flex-col border-b-2 border-grey-light" style="width:100%"
                    :class="[setFocus === 'ir35_scoped' ? 'border-yellow':'', formError.find(item => item.field === 'ir35_scoped') ? 'border-red':'']">
                    <select class="focus:outline-none font-bold text-sm" style="height:40px;"
                      @focus="setFocus = 'ir35_scoped'" @blur="setFocus = ''" v-model="form.ir35_scoped">
                      <option :value="false">No</option>
                      <option :value="true">Yes</option>
                    </select>
                  </div>
                </div>
                <div class="absolute pin-t pin-r bg-red text-white p-1 " v-if="formError.find(item => item.field === 'ir35_scoped')">
                  {{formError.find(item => item.field === 'ir35_scoped').message}}
                </div>
              </div>

            </form>
            
          </div>
        </div>

        <div class="flex w-full justify-center xl:justify-start mt-5">
          <div class="flex justify-center" style="width:600px">
              <button class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none mx-1" @click.prevent="$store.commit('signUp/SET_ACTIVE_TAB', 'address_details')" v-text="'<<'"></button>
            <button class="rounded-lg p-6 bg-yellow text-lg font-bold hover:text-white focus:outline-none" @click.prevent="next">Next</button>
          </div>
        </div>

      </div>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway'
const professions = [
  'GP', 'ANP', 'ENP', 'ECP', 'UCP'
]
const specialties = [
    'A&E', 'Allergy', 'Anaphylaxis', 'Asthma',
    'Aviation Medicinde', 'Baby Clinics', 'COPD/Respiratory'
]
const clinicalSystems = [
    'Adastra', 'Cerner', 'Cleo', 'DGL'
]
const spokenLanguages = [
  'English', 'Chinese', 'Arabic'
]
export default {
    mixins: [ clickaway ],
    data () {
      return {
        searchSpecialties: '',
        specialties,
        specialtiesIndex: 0,
        showSpecialties: false,
        selectedSpecialties: [],

        searchClinicalSystems: '',
        clinicalSystems,
        clinicalSystemsIndex: 0,
        showClinicalSystems: false,
        selectedClinicalSystems: [],

        searchSpokenLanguages: '',
        spokenLanguages,
        spokenLanguagesIndex: 0,
        showSpokenLanguages: false,
        selectedSpokenLanguages: [],

        form: {
            gmc_nmc_number: '',
            mpl_npl_number: '',
            nhs_smart_card_number: '',
            profession: '',
            specialty: [],
            clinical_systems: [],
            spoken_languages: [],
            rates_per_hour: '',
            rates_per_session: '',
            ir35_scoped: false
        },
        formError: [],
        setFocus: ''
      }
    },
    computed: {
      professionalDetails () {
        return this.$store.state.signUp.professional_details
      },
      //! Add RegExp on these filtered seach
      filteredSpecialties () {
        return this.specialties.filter((specialty) => {
          const index = this.selectedSpecialties.findIndex((item) => {
            return item === specialty
          })
          return index === -1 && specialty && specialty.includes(this.searchSpecialties)
          // let regex = new RegExp('//')
          // console.log(specialty.match(regex))
          // return index === -1 && specialty && specialty.match(regex)
        })
      },
      filteredClinicalSystems () {
        return this.clinicalSystems.filter((clinicalSystem) => {
          const index = this.selectedClinicalSystems.findIndex((item) => {
            return item === clinicalSystem
          })
          return index === -1 && clinicalSystem && clinicalSystem.includes(this.searchClinicalSystems)
        })
      },
      filteredSpokenLanguages () {
        return this.spokenLanguages.filter((spokenLanguage) => {
          const index = this.selectedSpokenLanguages.findIndex((item) => {
            return item === spokenLanguage
          })
          return index === -1 && spokenLanguage && spokenLanguage.includes(this.searchSpokenLanguages)
        })
      }
    },
    mounted () {
      this.form.gmc_nmc_number = this.professionalDetails.gmc_nmc_number
      this.form.mpl_npl_number = this.professionalDetails.mpl_npl_number
      this.form.nhs_smart_card_number = this.professionalDetails.nhs_smart_card_number
      this.form.profession = this.professionalDetails.profession
      this.professionalDetails.specialty.forEach(item => {
          this.selectedSpecialties.push(item)
      })
      this.professionalDetails.clinical_systems.forEach(item => {
        this.selectedClinicalSystems.push(item)
      })
      this.professionalDetails.spoken_languages.forEach(item => {
        this.selectedSpokenLanguages.push(item)
      })
      this.form.rates_per_hour = this.professionalDetails.rates_per_hour
      this.form.rates_per_session = this.professionalDetails.rates_per_session
      this.form.ir35_scoped = this.professionalDetails.ir35_scoped
    },
    methods: {
        hideSpecialties () {
          // this.setFocus = ''
          this.showSpecialties = false
        },
        selectSpecialty (item, index) {
            this.selectedSpecialties.push(item)
            this.specialties.splice(index, 1)
            this.setFocus = 'specialty'
        },
        removeSpecialty (item, index) {
            this.selectedSpecialties.splice(index, 1)
            this.specialties.push(item)
        },
        specialtyKeyDownHandler (event) {
          if (this.setFocus !== 'specialty') {
            return
          } else {
            if (event.key === 'ArrowUp') {
              if (this.specialtiesIndex > 0) {
                this.specialtiesIndex--
              } else {
                this.specialtiesIndex = this.specialties.length - 1
              }
            }
  
            if (event.key === 'ArrowDown') {
              if (this.specialtiesIndex === this.specialties.length - 1) {
                this.specialtiesIndex = 0
              } else {
                this.specialtiesIndex++
              }
            }
  
            if (event.key === 'Enter') {
              if (this.specialties[this.specialtiesIndex]) {
                this.selectSpecialty (this.specialties[this.specialtiesIndex], this.specialtiesIndex)
              }
            }
  
            if (event.key === 'Backspace') {
              if (!this.searchSpecialties) {
                this.removeSpecialty (this.selectedSpecialties[this.selectedSpecialties.length - 1], this.selectedSpecialties.length - 1)
              }
            }
  
            if (event.key === 'Escape') {
              this.setFocus = ''  
            }
          }

        },

        hideClinicalSystems () {
          // this.setFocus = ''
          this.showClinicalSystems = false
        },
        selectClinicalSystems (item, index) {
            this.selectedClinicalSystems.push(item)
            this.clinicalSystems.splice(index, 1)
            this.setFocus = 'clinical_systems'
        },
        removeClinicalSystems (item, index) {
            this.selectedClinicalSystems.splice(index, 1)
            this.clinicalSystems.push(item)
        },
        clinicalSystemsKeyDownHandler (event) {
          if (this.setFocus !== 'clinical_systems') {
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
              if (this.clinicalSystems[this.clinicalSystemsIndex]) {
                this.selectClinicalSystems (this.clinicalSystems[this.clinicalSystemsIndex], this.clinicalSystemsIndex)
              }
            }
  
            if (event.key === 'Backspace') {
              if (!this.searchClinicalSystems) {
                this.removeClinicalSystems (this.selectedClinicalSystems[this.selectedClinicalSystems.length - 1], this.selectedClinicalSystems.length - 1)
              }
            }
  
            if (event.key === 'Escape') {
              this.setFocus = ''  
            }
          }

        },

        hideSpokenLanguages () {
          // this.setFocus = ''
          this.showSpokenLanguages = false
        },
        selectSpokenLanguages (item, index) {
          this.selectedSpokenLanguages.push(item)
          this.spokenLanguages.splice(index, 1)
          this.setFocus = 'spoken_languages'
        },
        removeSpokenLanguages (item, index) {
            this.selectedSpokenLanguages.splice(index, 1)
            this.spokenLanguages.push(item)
        },
        spokenLanguagesKeyDownHandler (event) {
          if (this.setFocus !== 'spoken_languages') {
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
              if (this.spokenLanguages[this.spokenLanguagesIndex]) {
                this.selectSpokenLanguages (this.spokenLanguages[this.spokenLanguagesIndex], this.spokenLanguagesIndex)
              }
            }
  
            if (event.key === 'Backspace') {
              if(!this.searchSpokenLanguages) {
                this.removeSpokenLanguages (this.selectedSpokenLanguages[this.selectedSpokenLanguages.length - 1], this.selectedSpokenLanguages.length - 1)
              }
            }
  
            if (event.key === 'Escape') {
              this.setFocus = ''  
            }
          }

        },
        
      next () {
        try {
          this.formError = []

          this.selectedSpecialties.forEach(item => {
            this.form.specialty.push(item)
          })
          this.selectedClinicalSystems.forEach(item => {
            this.form.clinical_systems.push(item)
          })
          this.selectedSpokenLanguages.forEach(item => {
            this.form.spoken_languages.push(item)
          })

          this.Validate(this.form)
          if (!this.formError.length) {
            // alert('Waiting for API')
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
  transform: translate(5px, 5px)
}
.fade-enter-active, .fade-leave-active {
  transition: all .3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  transform: translateY(10px);
}
</style>
