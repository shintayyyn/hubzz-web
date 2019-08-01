<template>
  <div class="flex flex-col w-full lg:w-2/3 p-0 lg:pr-4">
    <div class="rounded-lg shadow-lg p-8 mt-4">
      <div class="flex flex-row flex-wrap">
        <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
          <div class="font-bold text-sm sm:text-md">Job number</div>
          <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
          <AppSelect
            v-model="form.practice_id"
            :name="'practice_id'"
            :items="practice_lists"
            :label="'Practice'"
            :placeholder="'Select..'"
            :error="this.formError.find(error => error.field === 'practice_id')"
          />
          <div class="text-xs sm:text-sm mt-2 mb-4 flex flex-row flex-wrap">
            <div class="w-full md:w-1/2 p-1">
              <AppInput
                v-model="form.rate"
                :type="'text'"
                :name="'rate'"
                :label="'Rate £'"
                :placeholder="''"
                :error="this.formError.find(error => error.field === 'rate')"
              />
            </div>
            <div class="w-full md:w-1/2 p-1">
              <AppSelect
                v-model="form.locum_detail_rate_type_id"
                :name="'locum_detail_rate_type_id'"
                :label="'per'"
                :items="rate_types"
                :error="this.formError.find(error => error.field === 'locum_detail_rate_type_id')"
              />
            </div>
          </div>
          <AppInput
            v-model="form.total_hours"
            :type="'text'"
            :name="'total_hours'"
            :label="'Total hours'"
            :placeholder="''"
            :error="this.formError.find(error => error.field === 'total_hourse')"
          />
          <AppInput
            v-model="form.title"
            :type="'text'"
            :name="'title'"
            :label="'Title'"
            :placeholder="''"
            :error="this.formError.find(error => error.field === 'title')"
          />
          <AppTextarea
            v-model="form.description"
            :name="'description'"
            :label="'Job description'"
            :placeholder="''"
            :error="this.formError.find(error => error.field === 'description')"
          />
          <AppInput
            v-model="form.report_to"
            :type="'text'"
            :name="'report_to'"
            :label="'Report to'"
            :placeholder="''"
            :error="this.formError.find(error => error.field === 'report_to')"
          />
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email address'"
            :placeholder="''"
            :error="this.formError.find(error => error.field === 'email')"
          />
          <AppInput
            v-model="form.phone_number"
            :type="'text'"
            :name="'phone_number'"
            :label="'Telephone number'"
            :placeholder="''"
            :error="this.formError.find(error => error.field === 'phone_number')"
          />
          <AppSelect
            v-model="form.is_another_doctor"
            :name="'is_another_doctor'"
            :label="'Is there another Dr on site?'"
            :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            :error="this.formError.find(error => error.field === 'is_another_doctor')"
          />
          <AppSelect
            v-model="form.is_nurse_available"
            :name="'is_nurse_available'"
            :label="'Is nurse support available?'"
            :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            :error="this.formError.find(error => error.field === 'is_nurse_available')"
          />
          <AppInput
            v-model="form.number_of_patients"
            :type="'text'"
            :name="'number_of_patients'"
            :label="'Number of patients to be seen during the session?'"
            :placeholder="''"
            :inStyle="'text-align:right;'"
            :error="this.formError.find(error => error.field === 'number_if_patients')"
          />
          <AppInput
            v-model="form.duration_for_each_appointment"
            :type="'text'"
            :name="'duration_for_each_appointment'"
            :label="'Duration of each appointment?'"
            :placeholder="''"
            :inStyle="'text-align:right;'"
            :error="this.formError.find(error => error.field === 'duration_for_each_appointment')"
          />
          <AppSelect
            v-model="form.opportunity_for_catch_up_slots"
            :name="'opportunity_for_catch_up_slots'"
            :label="'Opportunity for catch up slots?'"
            :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            :error="this.formError.find(error => error.field === 'oppotunity_for_catch_up_slots')"
          />
          <AppInput
            :type="'multi-checkbox'"
            v-model="form.session_requirements"
            @checked="form.session_requirements.push($event)"
            @unchecked="form.session_requirements.splice(form.session_requirements.findIndex(item => item === $event), 1)"
            :name="'session_requirements'"
            :label="'Session requirements'"
            :placeholder="''"
            :lists="session_requirements_lists"
            :error="this.formError.find(error => error.field === 'session_requirements')"
          />
          <AppTextarea
            v-model="form.session_structure_information"
            :name="'session_structure_information'"
            :label="'Session structure information'"
            :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
            :error="this.formError.find(error => error.field === 'session_structure_information')"
          />
          <AppTextarea
            v-model="form.extra_information"
            :name="'extra_information'"
            :label="'Extra information'"
            :placeholder="'For example, number of expected patients, nearby car park, etc.'"
            :error="this.formError.find(error => error.field === 'extra_information')"
          />
          <AppTextarea
            v-model="form.update_remarks"
            :name="'update_remarks'"
            :label="'Update Remarks'"
            :placeholder="''"
            :error="this.formError.find(error => error.field === 'update_remarks')"
          />
        </div>
        <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
          <div class="font-bold text-sm sm:text-md">Duration</div>
          <div class="flex flex-row flex-wrap justify-between">
            <div class="px-1 w-full md:w-1/2">
              <AppDate
                v-model="form.date_start"
                :name="'date_start'"
                :label="'Start Date'"
                :error="this.formError.find(error => error.field === 'date_start')"
              />
            </div>
            <div class="px-1 w-full md:w-1/2">
              <AppTime
                v-model="form.time_start"
                :type="'time'"
                :name="'time_start'"
                :label="'Start Time'"
                :error="this.formError.find(error => error.field === 'time_start')"
              />
            </div>
            <div class="px-1 w-full md:w-1/2">
              <AppDate
                v-model="form.date_end"
                :name="'date_end'"
                :label="'End Date'"
                :error="this.formError.find(error => error.field === 'date_end')"
              />
            </div>
            <div class="px-1 w-full md:w-1/2">
              <AppTime
                v-model="form.time_end"
                :type="'time'"
                :name="'time_end'"
                :label="'End Time'"
                :error="this.formError.find(error => error.field === 'time_end')"
              />
            </div>
          </div>
          <AppSelect
            v-model="form.shift_id"
            :name="'shift_id'"
            :label="'Shift'"
            :placeholder="'Select...'"
            :items="shifts"
            :error="this.formError.find(error => error.field === 'shift_id')"
          />
          <AppSelect
            v-model="unpaid_breaks"
            :name="'unpaid_breaks '"
            :label="'Unpaid break'"
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
            :inStyle="'text-align:right;'"
            :error="this.formError.find(error => error.field === 'unpaid_breaks_in_minutes')"
          />
          <AppDate
            v-model="form.auto_assign_at"
            :name="'auto_assign_at'"
            :label="'Auto-assigns this job to the first, matching Favourite applicant'"
            :error="this.formError.find(error => error.field === 'auto_assign_at')"
          />
          <AppDate
            v-model="form.selection_date"
            :name="'selection_date'"
            :label="'Selection will be made and you will receive a notification by this date'"
            :error="this.formError.find(error => error.field === 'selection_date')"
          />
           <AppDate
            v-model="form.favorite_only_until"
            :name="'favorite_only_until'"
            :label="'Only Favorite locums can apply until'"
            :error="this.formError.find(error => error.field === 'favorite_only_until')"
          />
          <AppSelect
            v-model="form.ir35"
            :name="'ir35'"
            :label="'IR35 - role inside or outside of scope'"
            :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
            :error="this.formError.find(error => error.field === 'ir35')"
          />
          <AppSelect
            v-model="form.profession_id"
            :name="'profession_id'"
            :label="'Role'"
            :items="professions"
            :placeholder="'Select..'"
            :error="this.formError.find(error => error.field === 'profession_id')"
          />
          <AppFilterSearch
            v-model="form.qualification_id"
            :name="'qualification_id'"
            :label="'Specialty'"
            :placeholder="'Select...'"
            :items="qualifications"
            :info="'Choose at least one qualification'"
            :error="this.formError.find(error => error.field === 'qualification_id')"
          />
          <AppFilterSearch
            v-model="form.clinical_system_id"
            :name="'clinical_system_id'"
            :label="'Clnical systems'"
            :placeholder="'Select...'"
            :items="clinical_system_lists"
            :info="'Choose at least one qualification'"
            :error="this.formError.find(error => error.field === 'clinical_system_id')"
          />
          <AppFilterSearch
            v-model="form.spoken_language_id"
            :name="'spoken_language_id'"
            :label="'Spoken languages'"
            :placeholder="'Select...'"
            :items="spoken_language_lists"
            :info="'Choose at least one qualification'"
            :defaultItem="'English'"
            :error="this.formError.find(error => error.field === 'spoken_language_id')"
          />

          <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
          <AppInput
            v-model="form.compliance_document_id"
            :type="'multi-checkbox'"
            @checked="form.compliance_document_id.push($event)"
            @unchecked="form.compliance_document_id.splice(form.compliance_document_id.findIndex(item => item === $event), 1)"
            :name="'compliance_document_id'"
            :label="`${selectedProfession.profession_category.id === 1 ? 'For GPs:' : selectedProfession.profession_category.id === 2 ? 'For Nurses, et al:' : ''}`"
            :placeholder="''"
            :lists="compliances"
            :error="this.formError.find(error => error.field === 'compliance_document_id')"
          />
          <div class="font-bold text-sm sm:text-md">Mandatory trainings</div>
          <AppInput
            v-model="form.mandatory_training_id"
            :type="'multi-checkbox'"
            @checked="form.mandatory_training_id.push($event)"
            @unchecked="uncheckMandatory($event)"
            :name="'mandatory_training_id'"
            :label="'Mandatory training required for this job'"
            :placeholder="'Select..'"
            :lists="mandatory_training_lists"
            :info="'Check all that apply'"
            :error="this.formError.find(error => error.field === 'mandatory_training_id')"
          />
          <div class="my-3" v-if="mandatory_training_lists.length === 0">
            <AppButton
              :label="'Go to Profile to add items here'"
              @click="$router.push('/profile')"
              :inStyle="'padding:4px;'"
            />
          </div>
        </div>
      </div>
      <div class="mb-8">
        <AppButton :label="'Save changes'" :inStyle="'padding:8px'" @click="save" />
      </div>
      <div class="flex flex-col">
        <div class="font-bold text-xs sm:text-sm">Practice</div>
        <div class="font-bold text-sm sm:text-md">{{job.platform_job.practice.surgery.name}}</div>
        <div
          class="text-sm sm:text-md"
        >{{job.platform_job.practice.surgery.address.line_1}} {{job.platform_job.practice.surgery.address.line_2}} {{job.platform_job.practice.surgery.address.line_3}} {{job.platform_job.practice.surgery.address.post_code}}</div>
        <div class="mt-4">
          <!-- google map -->
          <GmapMap
            :center="{lat:latLang.y, lng:latLang.x}"
            :zoom="15"
            map-type-id="terrain"
            style="width: 100%; height:300px"
          >
            <GmapMarker :position="google && new google.maps.LatLng(latLang.y, latLang.x)" />
          </GmapMap>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import AppInput from '@/components/Base/AppInput'
import AppDate from '@/components/Base/AppDate'
import AppTime from '@/components/Base/AppTime'
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
import AppTextarea from '@/components/Base/AppTextarea'
import AppFilterSearch from '@/components/Base/AppFilterSearch'
const session_requirements_lists = [
  { label: "Practice admin", value: "Practice admin" },
  { label: "Telephone triage", value: "Telephone triage" },
  { label: "Home visits", value: "Home visits" }
];
export default {
  props: ['job'],
  components: {
    AppInput,
    AppDate,
    AppTime,
    AppSelect,
    AppButton,
    AppTextarea,
    AppFilterSearch,
  },
  data() {
    return {
      practice_lists: [],
      gp_qualification_lists: [],
      other_qualification_lists: [],
      gp_compliance_documents_lists: [],
      others_compliance_documents_lists: [],
      professions_categories: [],
      selectedProfession: {
        profession_category: {}
      },
      session_requirements_lists,
      rate_types: [],
      shifts: [],
      professions: [],
      clinical_system_lists: [],
      spoken_language_lists: [],
      mandatory_training_lists: [],
      unpaid_breaks: '',
      form: {
        practice_id: '',
        title: '',
        description: '',
        report_to: '',
        email: '',
        extra_information: '',
        is_another_doctor: '',
        is_nurse_available: '',
        number_of_patients: '',
        duration_for_each_appointment: '',
        opportunity_for_catch_up_slots: false,
        session_requirements: [],
        session_structure_information: '',
        locum_detail_rate_type_id: '',
        rate: '',
        total_hours: '',
        unpaid_breaks_in_minutes: '',
        ir35: false,
        mandatory_training_id: [],
        profession_id: '',
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        compliance_document_id: [],
        date_start: null,
        date_end: null,
        time_start: null,
        time_end: null,
        shift_id: '',
        auto_assign_at: null,
        selection_date: null,
        favorite_only_until: null,
        update_remarks: '',
      },
      formError: []
    }
  },
  watch: {
    'form.profession_id'(value) {
      if (value && this.professions_categories.length > 0) {
        this.selectedProfession = this.professions_categories.find(
          item => item.id == value
        );
      }
    }
  },
  computed: {
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates
    },
    qualifications() {
      return this.selectedProfession.profession_category.id == 1 ? this.gp_qualification_lists : this.other_qualification_lists
    },
    compliances() {
      return this.selectedProfession.profession_category.id == 1 ? this.gp_compliance_documents_lists : this.others_compliance_documents_lists
    }
  },
  created() {
    this.getPracticeLists()
    this.getRateTypes()
    this.getShifts()
    this.getProfessions()
    this.getQualifications()
    this.getClinicalSystems()
    this.getSpokenLanguages()
    this.getMandatoryTrainings()
    this.form.practice_id = this.job.platform_job.practice.id,
      this.form.title = this.job.platform_job.title,
      this.form.description = this.job.platform_job.description,
      this.form.report_to = this.job.platform_job.report_to,
      this.form.email = this.job.platform_job.email,
      this.form.phone_number = this.job.platform_job.phone_number,
      this.form.extra_information = this.job.platform_job.extra_information,
      this.form.is_another_doctor = this.job.platform_job.is_another_doctor,
      this.form.is_nurse_available = this.job.platform_job.is_nurse_available,
      this.form.number_of_patients = this.job.platform_job.number_of_patients,
      this.form.duration_for_each_appointment = this.job.platform_job.duration_for_each_appointment,
      this.form.opportunity_for_catch_up_slots = this.job.platform_job.opportunity_for_catch_up_slots,
      this.form.session_structure_information = this.job.platform_job.session_structure_information
      this.form.locum_detail_rate_type_id = this.job.locum_detail_rate_type.id,
      this.form.rate = this.job.platform_job.rate,
      this.form.total_hours = this.job.platform_job.total_hours,
      this.form.unpaid_breaks_in_minutes = this.job.platform_job.unpaid_breaks_in_minutes,
      this.form.ir35 = this.job.platform_job.ir35,
      this.form.mandatory_training_id = this.job.platform_job.mandatory_trainings.map(mandatoryTraining => mandatoryTraining.id),
      this.form.compliance_document_id = this.job.platform_job.compliance_documents.map(complianceDocument => complianceDocument.id),
      this.form.date_start = this.job.date_start,
      this.form.date_end = this.job.date_end,
      this.form.time_start = this.job.time_start,
      this.form.time_end = this.job.time_end,
      this.form.shift_id = this.job.shift.id,
      this.form.auto_assign_at = this.job.platform_job.auto_assign_at,
      this.form.selection_date = this.job.platform_job.selection_date,
      this.form.favorite_only_until = this.job.platform_job.favorite_only_until,
      this.form.update_remarks = this.job.update_remarks

    this.job.platform_job.session_requirements === '' ? this.form.session_requirements = [] : this.form.session_requirements = this.job.platform_job.session_requirements.split(",")

    this.job.platform_job.qualifications.forEach(qualication => {
      this.form.qualification_id.push({ label: qualication.name, value: qualication.id })
    })
    this.job.platform_job.clinical_systems.forEach(clinicalSystem => {
      this.form.clinical_system_id.push({ label: clinicalSystem.name, value: clinicalSystem.id })
    })
    this.job.platform_job.spoken_languages.forEach(spokenLanguage => {
      this.form.spoken_language_id.push({ label: spokenLanguage.name, value: spokenLanguage.id })
    })
    this.job.platform_job.mandatory_trainings.forEach(mandatoryTraining => {
      this.form.mandatory_training_id.push({ label: mandatoryTraining.name, value: mandatoryTraining.id })
    })
    this.form.profession_id = this.job.platform_job.profession.id
  },
  methods: {
    getPracticeLists() {
      this.$axios.$get(`/api/v1/practice/practice-children`).then(res => {
        this.practice_lists = [];
        this.practice_lists.push({
          label: this.$auth.user.practice_detail.practice.surgery.name,
          value: this.$auth.user.practice_detail.practice.id
        });
        res.data.practice_children.forEach(item => {
          this.practice_lists.push({ label: item.surgery.name, value: item.id });
        });
      });
    },
    getRateTypes() {
      this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
        this.rate_types = []
        res.data.locum_detail_rate_types.forEach(item => {
          this.rate_types.push({ label: item.name, value: item.id })
        })
      })
    },
    getShifts() {
      this.$axios.$get(`/api/v1/shifts`).then(res => {
        this.shifts = []
        res.data.shifts.forEach(item => {
          this.shifts.push({ label: item.name, value: item.id })
        })
      })
    },
    getProfessions() {
      this.$axios.$get(`/api/v1/professions`).then(res => {
        this.professions = [];
        res.data.professions.forEach(item => {
          this.professions.push({ label: item.name, value: item.id });
          this.professions_categories.push(item)
        });
        this.selectedProfession = this.professions_categories.find(item => item.id == this.form.profession_id);
      });
    },
    getQualifications() {
      this.$axios.$get(`/api/v1/profession-categories`).then(res => {
        this.gp_qualification_lists = [];
        res.data.profession_categories
          .find(item => item.id === 1)
          .qualifications.forEach(item => {
            this.gp_qualification_lists.push({
              label: item.name,
              value: item.id
            });
          });
        this.other_qualification_lists = [];
        res.data.profession_categories
          .find(item => item.id === 2)
          .qualifications.forEach(item => {
            this.other_qualification_lists.push({
              label: item.name,
              value: item.id
            });
          });
      });
    },
    getClinicalSystems() {
      this.$axios.$get(`/api/v1/clinical-systems`).then(res => {
        this.clinical_system_lists = [];
        res.data.clinical_systems.forEach(item => {
          this.clinical_system_lists.push({ label: item.name, value: item.id });
        });
      });
    },
    getSpokenLanguages() {
      this.$axios.$get(`/api/v1/spoken-languages`).then(res => {
        this.spoken_language_lists = [];
        res.data.spoken_languages.forEach(item => {
          this.spoken_language_lists.push({ label: item.name, value: item.id });
        });
      });
    },
    getMandatoryTrainings() {
      this.$axios.$get(`/api/v1/me`).then(res => {
        res.data.user.practice_detail.practice.mandatory_trainings.forEach(item => {
          this.mandatory_training_lists.push({ label: item.name, value: item.id })
        })
        res.data.user.practice_detail.practice.gp_compliance_documents.forEach(item => {
          this.gp_compliance_documents_lists.push({ label: item.name, value: item.id });
        })
        res.data.user.practice_detail.practice.others_compliance_documents.forEach(item => {
          this.others_compliance_documents_lists.push({ label: item.name, value: item.id });
        })
      })
    },
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(id => id != value);
    },
    close() {
      if (this.$route.fullPath === '/dashboard') {
        this.$emit('close')
      } else {
        const query = {
          ...this.$route.query
        }
        this.$router.push({ path: `/sessions`, query })
      }
    },
    save() {
      this.formError = []
      this.Validate(this.form, ['spoken_language_id'])
      
      console.log("form",this.form)
      console.log("error",this.formError)
      if (!this.formError.length) {
        this.form.clinical_system_id = this.form.clinical_system_id.map(
          item => item.value
        );
        this.form.qualification_id = this.form.qualification_id.map(
          item => item.value
        );
        this.form.spoken_language_id = this.form.spoken_language_id.map(
          item => item.value
        );
        this.form.mandatory_training_id = this.form.mandatory_training_id.map(
          item => item.value
        );
        this.form.date_start = this.$moment(this.form.date_start).format(
          "YYYY-MM-DD"
        );
        this.form.date_end = this.$moment(this.form.date_end).format(
          "YYYY-MM-DD"
        );
        this.form.selection_date = this.$moment(this.form.selection_date).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.form.auto_assign_at = this.$moment(this.form.auto_assign_at).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.form.session_requirements.length > 0
          ? (this.form.session_requirements = this.form.session_requirements.join())
          : (this.form.session_requirements = "");
        this.unpaid_breaks !== "other"
          ? (this.form.unpaid_breaks_in_minutes = this.unpaid_breaks)
          : (this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes);
        this.$axios.$put(`/api/v1/practice/jobs/${this.job.id}`, this.form).then(res => {
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [res.message] })
          this.close()
        })
      }
    },
    cancel() {
      let jobId = this.$route.params.id || this.job.id
      this.$axios.$put(`/api/v1/practice/jobs/${jobId}/cancel`, this.form_cancel).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: ['Job cancelled'] })
        this.close()
      })
    }
  }
}
</script>

