<template>
  <div class="p-8 max-w-xl">
    <div @click="close" class="cursor-pointer">
      <svgicon name="left-arrow" height="32" width="32" />
    </div>
    <div class="flex flex-row justify-start mt-8">
      <div class="leading-loose font-bold text-md sm:text-lg">{{job.platform_job.title}}</div>
      <div class="mx-2 bg-yellow-dark text-sm sm:text-sm p-2">LIVE</div>
    </div>
    <div class="flex flex-row flex-wrap justify-between mt-4">
      <div class="w-full">
        <div
          class="text-xs sm:text-sm"
        >Posted {{$moment(job.platform_job.date_created).format('DD/MM/YYYY')}}</div>
        <div class="rounded-lg shadow-lg p-8 mt-4 w-full md:w-3/4">
          <div class="flex flex-row flex-wrap">
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
              <div class="font-bold text-sm sm:text-md">Job number</div>
              <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
              <div class="font-bold text-sm sm:text-md">Rate</div>
              <div class="text-xs sm:text-sm mt-2 mb-4 flex flex-row flex-wrap">
                <input
                  v-model="form.rate"
                  type="text"
                  class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs w-1/4 text-right"
                />
                <div class="leading-loose mx-2">per</div>
                <select
                  v-model="form.locum_detail_rate_type_id"
                  class="border-b-2 focus:border-yellow focus:outline-none py-2 font-bold text-xs"
                >
                  <option
                    v-for="item in rate_types"
                    :key="item.id"
                    :value="item.value"
                  >{{item.label}}</option>
                </select>
              </div>
              <AppInput
                v-model="form.total_hours"
                :type="'text'"
                :name="'total_hours'"
                :label="'Total hours'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.title"
                :type="'text'"
                :name="'title'"
                :label="'Title'"
                :placeholder="''"
              />
              <AppTextarea
                v-model="form.description"
                :name="'description'"
                :label="'Job description'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.email"
                :type="'email'"
                :name="'email'"
                :label="'Email address'"
                :placeholder="''"
              />
              <AppInput
                v-model="form.phone_number"
                :type="'text'"
                :name="'phone_number'"
                :label="'Telephone number'"
                :placeholder="''"
              />
              <AppSelect
                v-model="form.is_another_doctor"
                :name="'is_another_doctor'"
                :label="'Is there another Dr on site?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />
              <AppSelect
                v-model="form.is_nurse_available"
                :name="'is_nurse_available'"
                :label="'Is nurse support available?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />
              <AppInput
                v-model="form.number_of_patients"
                :type="'text'"
                :name="'number_of_patients'"
                :label="'Number of patients to be seen during the session?'"
                :placeholder="''"
                :inStyle="'text-align:right;'"
              />
              <AppInput
                v-model="form.duration_for_each_appointment"
                :type="'text'"
                :name="'duration_for_each_appointment'"
                :label="'Duration of each appointment?'"
                :placeholder="''"
                :inStyle="'text-align:right;'"
              />
              <AppSelect
                v-model="form.opportunity_for_catch_up_slots"
                :name="'opportunity_for_catch_up_slots'"
                :label="'Opportunity for catch up slots?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />
              <AppInput
                :type="'multi-checkbox'"
                @checked="form.session_requirements.push($event)"
                @unchecked="form.session_requirements.splice(form.session_requirements.findIndex(item => item === $event), 1)"
                :name="'session_requirements'"
                :label="'Session requirements'"
                :placeholder="''"
                :lists="session_requirements_lists"
              />
              <AppTextarea
                v-model="form.session_structure_information"
                :name="'session_structure_information'"
                :label="'Session structure information'"
                :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
              />
              <AppTextarea
                v-model="form.extra_information"
                :name="'extra_information'"
                :label="'Job description'"
                :placeholder="'For example, number of expected patients, nearby car park, etc.'"
              />
              <AppTextarea
                v-model="form.update_remarks"
                :name="'update_remarks'"
                :label="'Update Remarks'"
                :placeholder="''"
              />
            </div>
            <div class="flex flex-col w-full md:w-1/2 p-0 md:pl-4">
              <div class="font-bold text-sm sm:text-md">Duration</div>
              <div class="flex flex-row flex-wrap justify-between">
                <div class="px-1 w-full md:w-1/2">
                  <AppDate v-model="form.date_start" :name="'date_start'" :label="'Start Date'" />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppInput
                    v-model="form.time_start"
                    :type="'time'"
                    :name="'time_start'"
                    :label="'Start Time'"
                    :placeholder="''"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate v-model="form.date_end" :name="'date_end'" :label="'End Date'" />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppInput
                    v-model="form.time_end"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'End Time'"
                    :placeholder="''"
                  />
                </div>
              </div>
              <AppSelect
                v-model="form.shift_id"
                :name="'shift_id'"
                :label="'Shift'"
                :placeholder="'Select...'"
                :items="shifts"
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
                @blur="checkEmptyField(form.unpaid_breaks_in_minutes,'unpaid_breaks_in_minutes')"
              />
              <AppDate
                v-model="form.auto_assign_at"
                :name="'auto_assign_at'"
                :label="'Auto-assigns this job to the first, matching Favourite applicant'"
              />
              <AppDate
                v-model="form.selection_date"
                :name="'selection_date'"
                :label="'Selection will be made and you will receive a notification by this date'"
              />
              <AppSelect
                v-model="form.ir35"
                :name="'ir35'"
                :label="'IR35 - role inside or outside of scope'"
                :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
              />
              <AppSelect
                v-model="form.profession_id"
                :name="'profession_id'"
                :label="'Role'"
                :items="professions"
                :placeholder="'Select..'"
              />
              <AppFilterSearch
                v-model="form.qualification_id"
                :name="'qualification_id'"
                :label="'Specialty'"
                :placeholder="'Select...'"
                :items="qualifications"
                :info="'Choose at least one qualification'"
              />
              <AppFilterSearch
                v-model="form.clinical_system_id"
                :name="'clinical_system_id'"
                :label="'Clnical systems'"
                :placeholder="'Select...'"
                :items="clinical_system_lists"
                :info="'Choose at least one qualification'"
              />
              <AppFilterSearch
                v-model="form.spoken_language_id"
                :name="'spoken_language_id'"
                :label="'Spoken languages'"
                :placeholder="'Select...'"
                :items="spoken_language_lists"
                :info="'Choose at least one qualification'"
                :defaultItem="'English'"
              />

              <div class="font-bold text-sm sm:text-md">Compliance requirements</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="mt-1" v-if="job.platform_job.compliance_documents.length === 0">(none)</div>
                <div
                  v-else
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in job.platform_job.compliance_documents"
                  :key="item.id"
                >{{item.name}}</div>
              </div>
              <div class="font-bold text-sm sm:text-md">Mandatory training</div>
              <div class="text-xs sm:text-sm mb-8 flex flex-row flex-wrap">
                <div class="mt-1" v-if="job.platform_job.mandatory_trainings.length === 0">(none)</div>
                <div
                  v-else
                  class="rounded-lg bg-yellow-dark p-2 m-1"
                  v-for="item in job.platform_job.mandatory_trainings"
                  :key="item.id"
                >{{item.name}}</div>
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

        <div class="rounded-lg shadow-lg p-8 mt-4 w-full md:w-3/4">
          <div class="font-bold text-md sm:text-lg">Cancel this job</div>
          <AppSelect
            v-model="form_cancel.cancelled_reason"
            :name="'cancelled_reason'"
            :label="'Please select your reason'"
            :placeholder="'Select..'"
            :items="reasons"
          />
          <AppButton :label="'Cancel job'" @click="cancel" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
import AppInput from '@/components/Base/AppInput'
import AppDate from '@/components/Base/AppDate'
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
    AppSelect,
    AppButton,
    AppTextarea,
    AppFilterSearch,
  },
  data() {
    return {
      session_requirements_lists,
      rate_types: [],
      shifts: [],
      professions: [],
      gp_qualification_lists: [],
      other_qualification_lists: [],
      clinical_system_lists: [],
      spoken_language_lists: [],
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
        opporunity_for_catch_up_slots: '',
        session_requirements: '',
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
      form_cancel: {
        cancelled_reason: ''
      },
    }
  },
  computed: {
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates
    },
    reasons() {
      return this.$store.state.session.reasons
    },
    qualifications() {
      return this.gp_qualification_lists || this.other_qualification_lists
    }
  },
  created() {
    this.form.practice_id = this.job.platform_job.practice.id,
      this.form.title = this.job.platform_job.title,
      this.form.description = this.job.platform_job.description,
      this.form.report_to = this.job.platform_job.report_to,
      this.form.email = this.job.platform_job.email,
      this.form.extra_information = this.job.platform_job.extra_information,
      this.form.is_another_doctor = this.job.platform_job.is_another_doctor,
      this.form.is_nurse_available = this.job.platform_job.is_nurse_available,
      this.form.number_of_patients = this.job.platform_job.number_of_patients,
      this.form.duration_for_each_appointment = this.job.platform_job.duration_for_each_appointment,
      this.form.opporunity_for_catch_up_slots = this.job.platform_job.opporunity_for_catch_up_slots,

      this.form.locum_detail_rate_type_id = this.job.platform_job.locum_detail_rate_type.id,
      this.form.rate = this.job.platform_job.rate,
      this.form.total_hours = this.job.platform_job.total_hours,
      this.form.unpaid_breaks_in_minutes = this.job.platform_job.unpaid_breaks_in_minutes,
      this.form.ir35 = this.job.platform_job.ir35,
      this.form.mandatory_training_id = this.job.platform_job.mandatory_trainings.map(mandatoryTraining => mandatoryTraining.id),
      this.form.profession_id = this.job.platform_job.profession.id,
      this.form.compliance_document_id = this.job.platform_job.compliance_documents.map(complianceDocument => complianceDocument.id),
      this.form.date_start = this.job.platform_job.date_start,
      this.form.date_end = this.job.platform_job.date_end,
      this.form.time_start = this.job.platform_job.time_start,
      this.form.time_end = this.job.platform_job.time_end,
      this.form.shift_id = this.job.platform_job.shift.id,
      this.form.auto_assign_at = this.job.platform_job.auto_assign_at,
      this.form.selection_date = this.job.platform_job.selection_date,
      this.form.favorite_only_until = this.job.platform_job.favorite_only_until,
      this.form.update_remarks = this.job.update_remarks

    this.job.platform_job.session_requirements === '' ? this.form.session_requirements = [] : this.job.platform_job.session_requirements.split("")

    this.job.platform_job.qualifications.forEach(qualication => {
      this.form.qualification_id.push({ label: qualication.name, value: qualication.id })
    })
    this.job.platform_job.clinical_systems.forEach(qualication => {
      this.form.clinical_system_id.push({ label: qualication.name, value: qualication.id })
    })
    this.job.platform_job.spoken_languages.forEach(qualication => {
      this.form.spoken_language_id.push({ label: qualication.name, value: qualication.id })
    })
    this.getRateTypes()
    this.getShifts()
    this.getProfessions()
    this.getQualifications()
    this.getClinicalSystems()
    this.getSpokenLanguages()
  },
  methods: {
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
        });
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
        // remove old job
        console.log(res.data.job)
        // push new job
        console.log(res.data.new_job)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: res.message })
        this.close()
      })
    },
    cancel() {
      let jobId = this.$route.params.id || this.job.id
      this.$axios.$put(`/api/v1/practice/jobs/${jobId}/cancel`, this.form_cancel).then(res => {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Job cancelled' })
        this.close()
      })
    }
  }
}
</script>


