<template>
  <div class="p-8 max-w-xl">
    <div @click="$emit('close')" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32"/>
    </div>
    <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Create a new job</div>
    <div class="flex flex-row flex-wrap justify-start mt-8">
      <div class="w-full md:w-1/2 pr-4 mb-4">
        <div class="flex flex-col">
          <h4 class="font-bold">Practice</h4>
          <div class="rounded-lg shadow-lg px-8 pt-4 mt-4">
            <AppSelect
              v-model="form.practice_id"
              :name="'practice_id'"
              :error="formError.find(item => item.field === 'practice_id')"
              :items="practices"
              :placeholder="'Select..'"
            />
          </div>
          <h4 class="font-bold mt-4">Overview</h4>
          <div class="rounded-lg shadow-lg px-8 pt-4 mt-4">
            <AppInput
              v-model="form.title"
              :type="'text'"
              :name="'title'"
              :label="'Title'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'title')"
            />
            <AppTextarea
              v-model="form.description"
              :name="'description'"
              :label="'Description'"
              :placeholder="''"
              :error="this.formError.find(item => item.field === 'description')"
            />
            <AppSelect
              v-model="form.is_another_doctor"
              :name="'is_another_doctor'"
              :label="'Is there another Dr on site?'"
              :error="formError.find(item => item.field === 'is_another_doctor')"
              :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            />
            <AppSelect
              v-model="form.is_nurse_available"
              :name="'is_nurse_available'"
              :label="'Is nurse support available?'"
              :error="formError.find(item => item.field === 'is_nurse_available')"
              :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            />
            <AppInput
              v-model="form.number_of_patients"
              :type="'text'"
              :name="'number_of_patients'"
              :label="'Number of patients to be seen during the session?'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'number_of_patients')"
              :inStyle="'text-align:right;'"
            />
            <AppInput
              v-model="form.duration_for_each_appointment"
              :type="'text'"
              :name="'duration_for_each_appointment'"
              :label="'Duration of each appointment?'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'duration_for_each_appointment')"
              :inStyle="'text-align:right;'"
            />
            <AppSelect
              v-model="form.opportunity_for_catch_up_slots"
              :name="'opportunity_for_catch_up_slots'"
              :label="'Opportunity for catch up slots?'"
              :error="formError.find(item => item.field === 'opportunity_for_catch_up_slots')"
              :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            />
            <AppInput
              :type="'multi-checkbox'"
              @checked="form.session_requirements.push($event)"
              @unchecked="form.session_requirements.splice(form.session_requirements.findIndex(item => item === $event), 1)"
              :name="'session_requirements'"
              :label="'Session requirements'"
              :placeholder="''"
              :error="this.formError.find(item => item.field === 'session_requirements')"
              :lists="session_requirements"
            />
            <AppTextarea
              v-model="form.session_structure_information"
              :name="'session_structure_information'"
              :label="'Session structure information'"
              :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
              :error="this.formError.find(item => item.field === 'session_structure_information')"
            />
            <AppTextarea
              v-model="form.extra_information"
              :name="'extra_information'"
              :label="'Extra information'"
              :placeholder="'For example, number of expected patients, nearby car park, etc.'"
              :error="this.formError.find(item => item.field === 'extra_information')"
            />
            <div class="flex flex-col py-2 mb-6">
              <div class="relative flex flex-row flex-wrap justify-start">
                <div class="mt-2">
                  <label for="rate" class="text-xs sm:text-sm mt-2">Rate £</label>
                  <input
                    v-model="form.rate"
                    type="text"
                    class="border-b-2 focus:border-yellow focus:outline-none font-bold text-xs sm:text-sm mx-1 py-2"
                    :class="formError.find(item => item.field === 'rate')? 'border-red':''"
                    @keypress="ValidateInput"
                    style="text-align:right;width:100px;"
                  >
                </div>
                <div class="mt-2">
                  <label for="locum_detail_rate_type_id" class="text-xs sm:text-sm mt-2">per</label>
                  <select
                    v-model="form.locum_detail_rate_type_id"
                    class="border-b-2 focus:border-yellow focus:outline-none font-bold text-xs sm:text-sm mx-1 py-2"
                    :class="formError.find(item => item.field === 'locum_detail_rate_type_id')? 'border-red':''"
                  >
                    <option
                      v-for="(item, index) in rate_types"
                      :key="index"
                      :value="item.value"
                    >{{item.label}}</option>
                  </select>
                </div>
                <div
                  class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
                  v-if="formError.find(item => item.field === 'rate')"
                >{{formError.find(item => item.field === 'rate').message}}</div>
              </div>
            </div>
            <div class="flex flex-col py-2 mb-6">
              <div class="relative flex flex-row flex-nowrap justify-between">
                <label for="total_hours" class="text-xs sm:text-sm py-1 mt-2">Total hours</label>
                <div
                  class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
                  v-if="this.formError.find(item => item.field === 'total_hours')"
                >{{this.formError.find(item => item.field === 'total_hours').message}}</div>
              </div>
              <div class="flex flex-row flex-nowrap justify-start mt-1">
                <input
                  v-model="form.total_hours"
                  type="text"
                  class="border-b-2 focus:border-yellow focus:outline-none font-bold py-2 text-xs sm:text-sm mx-1"
                  :class="this.formError.find(item => item.field === 'total_hours')? 'border-red':''"
                  @keypress="ValidateInput"
                  style="text-align:right;'"
                >
                <label for="total_hours" class="text-xs sm:text-sm mt-2">hours</label>
              </div>
            </div>
            <AppSelect
              v-model="form.ir35"
              :name="'ir35'"
              :label="'IR35 - role inside or outside of scope'"
              :error="formError.find(item => item.field === 'ir35')"
              :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
            />
            <!-- // ! Mandatory Training -->
            <AppSelect
              v-model="form.mandatory_training_id"
              :name="'mandatory_training_id'"
              :label="'Mandatory training required for this job'"
              :error="formError.find(item => item.field === 'mandatory_training_id')"
              :items="mandatory_training"
              :info="'Check all that apply'"
            />
            <div class="mb-6" v-if="mandatory_training.length === 0">
              <AppButton :label="'Go to Profile to add items here'" @click="addMandatory"/>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 pl-4 mb-4">
        <div class="flex flex-col">
          <h4 class="font-bold">Criteria</h4>
          <div class="rounded-lg shadow-lg px-8 py-4 mt-4">
            <AppSelect
              v-model="form.profession_id"
              :name="'profession_id'"
              :label="'Role'"
              :error="formError.find(item => item.field === 'profession_id')"
              :items="professions"
              :placeholder="'Select..'"
            />
            <div class="relative flex flex-col py-2 mb-6">
              <div class="relative flex flex-row flex-nowrap justify-between">
                <label for="spoken_language_id" class="text-xs sm:text-sm py-1">Specialty</label>
                <div
                  class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
                  v-if="formError.find(item => item.field === 'spoken_language_id')"
                >{{formError.find(item => item.field === 'spoken_language_id').message}}</div>
                <div
                  class="rounded-lg bg-grey-light px-2 py-1 text-xs sm:text-sm"
                >Choose at least one specialty</div>
              </div>
              <!-- selected -->
              <div class="flex flex-row flex-wrap justify-start">
                <div
                  class="rounded-lg bg-yellow-dark py-2 px-3 m-1 text-xs sm:text-sm"
                  v-for="(item, index) in form.qualification_id"
                  :key="index"
                >
                  {{item.label}}
                  <span
                    class="font-bold cursor-pointer text-base"
                    @click="form.qualification_id.splice(index, 1)"
                  >X</span>
                </div>
                <div>
                  <input
                    v-model="searchQualification"
                    type="text"
                    placeholder="Select.."
                    class="qualification border-b-2 focus:border-yellow focus:outline-none py-3 font-bold text-xs sm:text-sm"
                    @focus="setFocus('qualification')"
                    @blur="setBlur('qualification')"
                  >
                </div>
              </div>
              <!-- options-->
              <div class="qualification-list flex flex-col bg-white shadow-md overflow-y-auto">
                <div
                  class="py-2 px-3 hover:bg-grey-light cursor-pointer text-xs sm:text-sm"
                  v-for="item in filteredQualification"
                  :key="item.id"
                  @click="addQualification(item)"
                >{{item.label}}</div>
              </div>
            </div>
            <div class="relative flex flex-col py-2 mb-6">
              <div class="relative flex flex-row flex-nowrap justify-between">
                <label for="clinical_system_id" class="text-xs sm:text-sm py-1">Clinical systems</label>
                <div
                  class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
                  v-if="formError.find(item => item.field === 'clinical_system_id')"
                >{{formError.find(item => item.field === 'clinical_system_id').message}}</div>
                <div
                  class="rounded-lg bg-grey-light px-2 py-1 text-xs sm:text-sm"
                >Choose at least one IT system</div>
              </div>
              <!-- selected -->
              <div class="flex flex-row flex-wrap justify-start">
                <div
                  class="rounded-lg bg-yellow-dark py-2 px-3 m-1 text-xs sm:text-sm"
                  v-for="(item, index) in form.clinical_system_id"
                  :key="index"
                >
                  {{item.label}}
                  <span
                    class="font-bold cursor-pointer text-base"
                    @click="form.clinical_system_id.splice(index, 1)"
                  >X</span>
                </div>
                <div>
                  <input
                    v-model="searchClinicalSystem"
                    type="text"
                    placeholder="Select.."
                    class="clinical-system border-b-2 focus:border-yellow focus:outline-none py-3 font-bold text-xs sm:text-sm"
                    @focus="setFocus('clinical_system')"
                    @blur="setBlur('clinical_system')"
                  >
                </div>
              </div>
              <!-- options-->
              <div class="clinical-system-list flex flex-col bg-white shadow-md overflow-y-auto">
                <div
                  class="py-2 px-3 hover:bg-grey-light cursor-pointer text-xs sm:text-sm"
                  v-for="item in filteredClinicalSystem"
                  :key="item.id"
                  @click="addClinicalSystem(item)"
                >{{item.label}}</div>
              </div>
            </div>
            <div class="relative flex flex-col py-2 mb-6">
              <div class="relative flex flex-row flex-nowrap justify-between">
                <label for="spoken_language_id" class="text-xs sm:text-sm py-1">Spoken languages</label>
                <div
                  class="absolute pin-r bg-red p-1 text-xs sm:text-base text-white"
                  v-if="formError.find(item => item.field === 'spoken_language_id')"
                >{{formError.find(item => item.field === 'spoken_language_id').message}}</div>
              </div>
              <!-- selected -->
              <div class="flex flex-row flex-wrap justify-start">
                <div class="rounded-lg bg-yellow-dark py-2 px-3 m-1 text-xs sm:text-sm">English</div>
                <div
                  class="rounded-lg bg-yellow-dark py-2 px-3 m-1 text-xs sm:text-sm"
                  v-for="(item, index) in form.spoken_language_id"
                  :key="index"
                >
                  {{item.label}}
                  <span
                    class="font-bold cursor-pointer text-base"
                    @click="form.spoken_language_id.splice(index, 1)"
                  >X</span>
                </div>
                <div>
                  <input
                    v-model="searchLanguage"
                    type="text"
                    placeholder="Select.."
                    class="spoken-language border-b-2 focus:border-yellow focus:outline-none py-3 font-bold text-xs sm:text-sm"
                    @focus="setFocus('spoken_language')"
                    @blur="setBlur('spoken_language')"
                  >
                </div>
              </div>
              <!-- options-->
              <div class="spoken-language-list flex flex-col bg-white shadow-md overflow-y-auto">
                <div
                  class="py-2 px-3 hover:bg-grey-light cursor-pointer text-xs sm:text-sm"
                  v-for="item in filteredSpokenLanguages"
                  :key="item.id"
                  @click="addLanguage(item)"
                >{{item.label}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <h4 class="font-bold mt-4">Duration</h4>
          <div class="rounded-lg shadow-lg px-8 py-4 mt-4">
            <div class="flex flex-row flex-wrap justify-between">
              <div class="px-1 w-full md:w-1/2">
                <AppInput
                  v-model="form.date_start"
                  :type="'date'"
                  :name="'date_start'"
                  :label="'Start Date'"
                  :placeholder="''"
                  :error="formError.find(item => item.field === 'date_start')"
                />
              </div>
              <div class="px-1 w-full md:w-1/2">
                <AppInput
                  v-model="form.time_start"
                  :type="'time'"
                  :name="'time_start'"
                  :label="'Start Time'"
                  :placeholder="''"
                  :error="formError.find(item => item.field === 'time_start')"
                />
              </div>
              <div class="px-1 w-full md:w-1/2">
                <AppInput
                  v-model="form.date_end"
                  :type="'date'"
                  :name="'date_end'"
                  :label="'End Date'"
                  :placeholder="''"
                  :error="formError.find(item => item.field === 'date_end')"
                />
              </div>
              <div class="px-1 w-full md:w-1/2">
                <AppInput
                  v-model="form.time_end"
                  :type="'time'"
                  :name="'time_end'"
                  :label="'End Time'"
                  :placeholder="''"
                  :error="formError.find(item => item.field === 'time_end')"
                />
              </div>
            </div>
            <AppSelect
              v-model="unpaid_breaks"
              :name="'unpaid_breaks '"
              :label="'Unpaid break'"
              :error="formError.find(item => item.field === 'unpaid_breaks_in_minutes')"
              :items="[ {value: 15, label: '15'}, {value: 30, label: '30'}, {value: 60, label: '60'}, {value: 'other', label: 'Other'} ]"
              :placeholder="'Select..'"
            />
            <AppInput
              v-if="unpaid_breaks === 'other'"
              v-model="form.unpaid_breaks_in_minutes"
              :type="'text'"
              :name="'unpaid_breaks_in_minutes'"
              :label="'Other'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'unpaid_breaks_in_minutes')"
              :inStyle="'text-align:right;'"
            />
            <AppSelect
              v-model="form.shift_id"
              :name="'shift_id'"
              :label="'Shifts'"
              :error="formError.find(item => item.field === 'shift_id')"
              :items="shifts"
              :placeholder="'Select..'"
            />
            <AppInput
              v-model="form.auto_assign_at"
              :type="'date'"
              :name="'auto_assign_at'"
              :label="'Auto -assign job to the first matching Favourite applicant?'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'auto_assign_at')"
            />
            <AppInput
              v-model="form.selection_date"
              :type="'date'"
              :name="'selection_date'"
              :label="'Selection will be made and you will receive a notification by this date'"
              :placeholder="''"
              :error="formError.find(item => item.field === 'selection_date')"
            />
          </div>
        </div>
        <div class="mt-4">
          <AppButton :label="'Save and publish Job'" @click="publish"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway'
import AppInput from '@/components/Base/AppInput'
import AppSelect from '@/components/Base/AppSelect'
import AppTextarea from '@/components/Base/AppTextarea'
import AppButton from '@/components/Base/AppButton'
const session_requirements = [
  { label: 'Practice admin', value: 'Practice admin' },
  { label: 'Telephone triage', value: 'Telephone triage' },
  { label: 'Home visits', value: 'Home visits' },
]
export default {
  mixins: [clickaway],
  components: {
    AppInput,
    AppSelect,
    AppTextarea,
    AppButton
  },
  data() {
    return {
      practices: [],
      session_requirements,
      rate_types: [],
      mandatory_training: [],
      professions: [],
      spoken_languages: [],
      searchLanguage: '',
      gp_qualifications: [],
      other_qualifications: [],
      qualification: [],
      searchQualification: '',
      clinical_system: [],
      searchClinicalSystem: '',
      unpaid_breaks: '',
      shifts: [],
      form: {
        practice_id: '',
        title: '',
        description: '',
        is_another_doctor: false,
        is_nurse_available: false,
        number_of_patients: '',
        duration_for_each_appointment: '',
        opportunity_for_catch_up_slots: false,
        session_requirements: [],
        session_structure_information: '',
        extra_information: '',
        rate: '',
        locum_detail_rate_type_id: 1,
        ir35: false,
        mandatory_training_id: [],
        profession_id: '',
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        date_start: null,
        time_start: null,
        date_end: null,
        time_end: null,
        unpaid_breaks_in_minutes: '',
        shift_id: '',
        selection_date: null
      },
      formError: []
    }
  },
  computed: {
    filteredSpokenLanguages() {
      return this.spoken_languages.filter(language => {
        const index = this.form.spoken_language_id.findIndex((item) => {
          return item.value === language.value
        })
        return index === -1 && language && language.label.includes(this.searchLanguage)
      })
    },
    filteredQualification() {
      return this.qualification.filter(qualification => {
        const index = this.form.qualification_id.findIndex((item) => {
          return item.value === qualification.value
        })
        return index === -1 && qualification && qualification.label.includes(this.searchQualification)
      })
    },
    filteredClinicalSystem() {
      return this.clinical_system.filter(clinicalSystem => {
        const index = this.form.clinical_system_id.findIndex((item) => {
          return item.value === clinicalSystem.value
        })
        return index === -1 && clinicalSystem && clinicalSystem.label.includes(this.searchClinicalSystem)
      })
    }
  },
  watch: {
    // get qualification list base on selected role 
    'form.profession_id'(value) {
      if (value == 1) {
        this.qualification = this.gp_qualifications
      } else {
        this.qualification = this.other_qualifications
      }
    },
  },
  created() {
    // get practice list included from the profile practice and surgeries
    this.practices.push({ label: this.$auth.user.practice_detail.practice.surgery.name, value: this.$auth.user.practice_detail.practice.surgery.id })
    // get mandatory training from the profile practice added mandatory trainings

    // get public profession
    this.$axios.$get(`/api/v1/professions`).then(res => {
      this.professions = []
      res.data.professions.forEach(item => {
        this.professions.push({ label: item.name, value: item.id })
      })
    })
    // get qualification based on profession
    this.$axios.$get(`/api/v1/profession-categories`).then(res => {
      this.gp_qualifications = []
      res.data.profession_categories.find(item => item.id === 1).qualifications.forEach(item => {
        this.gp_qualifications.push({ label: item.name, value: item.id })
      })
      this.other_qualifications
      res.data.profession_categories.find(item => item.id === 2).qualifications.forEach(item => {
        this.other_qualifications.push({ label: item.name, value: item.id })
      })
      this.qualification = this.gp_qualifications
    })
    // get clinical system
    this.$axios.$get(`/api/v1/clinical-systems`).then(res => {
      this.clinical_system = []
      res.data.clinical_systems.forEach(item => {
        this.clinical_system.push({ label: item.name, value: item.id })
      })
    })
    // get spoken language
    this.$axios.$get(`/api/v1/spoken-languages`).then(res => {
      this.spoken_languages = []
      res.data.spoken_languages.forEach(item => {
        this.spoken_languages.push({ label: item.name, value: item.id })
      })
    })
    // get shifts
    this.$axios.$get(`/api/v1/shifts`).then(res => {
      this.shifts = []
      res.data.shifts.forEach(item => {
        this.shifts.push({ label: item.name, value: item.id })
      })
    })
    // get rate type
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rate_types = []
      res.data.locum_detail_rate_types.forEach(item => {
        this.rate_types.push({ label: item.name, value: item.id })
      })
    })
  },
  methods: {
    addMandatory() {
      this.$router.push('/profile')
      document.getElementsByClassName('create-job-modal')[0].classList.toggle('toggled-right')
      this.$store.commit('SET_CREATEJOB_SHIELD', false)
      document.body.style.overflow = 'auto'
    },
    setFocus(list) {
      if (list === 'spoken_language') {
        let d = document.getElementsByClassName('spoken-language-list')[0]
        d.classList.toggle('toggle-list')
      }
      if (list === 'qualification') {
        let d = document.getElementsByClassName('qualification-list')[0]
        d.classList.toggle('toggle-list')
      }
      if (list === 'clinical_system') {
        let d = document.getElementsByClassName('clinical-system-list')[0]
        d.classList.toggle('toggle-list')
      }
    },
    setBlur(list) {
      if (list === 'spoken_language') {
        let d = document.getElementsByClassName('spoken-language-list')[0]
        d.classList.toggle('toggle-list')
      }
      if (list === 'qualification') {
        let d = document.getElementsByClassName('qualification-list')[0]
        d.classList.toggle('toggle-list')
      }
      if (list === 'clinical_system') {
        let d = document.getElementsByClassName('clinical-system-list')[0]
        d.classList.toggle('toggle-list')
      }
    },
    addLanguage(value) {
      this.form.spoken_language_id.push(value)
      let d = document.getElementsByClassName('spoken-language')[0]
      d.focus()
    },
    addQualification(value) {
      this.form.qualification_id.push(value)
      let d = document.getElementsByClassName('qualification')[0]
      d.focus()
    },
    addClinicalSystem(value) {
      this.form.clinical_system_id.push(value)
      let d = document.getElementsByClassName('clinical-system')[0]
      d.focus()
    },
    publish() {
      console.log(this.form)
      this.unpaid_breaks !== 'other' ? this.form.unpaid_breaks_in_minutes = this.unpaid_breaks : this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes
      this.form.spoken_language_id = this.form.spoken_language_id.map(item => item.value)
      this.form.qualification_id = this.form.qualification_id.map(item => item.value)
      this.form.clinical_system_id = this.form.clinical_system_id.map(item => item.value)

      this.$axios.$post(`/api/v1/practice/jobs`, this.form).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style>
.clinical-system-list {
  max-height: 0;
  transition: all 0.3s ease-in-out;
}
.qualification-list {
  max-height: 0;
  transition: all 0.3s ease-in-out;
}
.spoken-language-list {
  max-height: 0;
  transition: all 0.3s ease-in-out;
}
.spoken-language-list::-webkit-scrollbar {
  width: 10px;
}
.spoken-language-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.spoken-language-list::-webkit-scrollbar-thumb {
  background: lightgrey;
}
.spoken-language-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.toggle-list {
  max-height: 150px;
}
</style>


