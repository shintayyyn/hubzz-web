<template>
  <div class="flex flex-col w-full">
    <AppFormError :formError="formError" v-if="formError.length > 0" />
    <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4">
      <div class="flex flex-row flex-wrap">
        <div class="flex flex-col w-full lg:w-1/2 p-0 md:pr-4">
          <div class="font-bold text-sm sm:text-md">Job number</div>
          <div class="text-xs sm:text-sm mb-4">{{job.job_number}}</div>
          <AppInput
            v-model="form.practice_id"
            :type="'select'"
            :name="'practice_id'"
            :label="'Practice'"
            :error="formError.find(item => item.field === 'practice_id')"
            :placeholder="'Select...'"
            :items="practice_lists"
          />
          <div class="text-xs sm:text-sm mt-2 mb-4 flex flex-row flex-wrap items-center">
            <div class="w-full">
              <AppInput
                v-model="form.rate"
                :type="'text'"
                :name="'rate'"
                :label="'Rate £'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'rate')"
              />
            </div>
            <div class="w-full">
              <AppInput
                v-model="form.locum_detail_rate_type_id"
                :type="'select'"
                :name="'locum_detail_rate_type_id'"
                :label="'per'"
                :error="formError.find(item => item.field === 'locum_detail_rate_type_id')"
                :placeholder="'Select...'"
                :items="rate_lists"
              />
            </div>
          </div>
          <AppInput
            v-model="form.total_hours"
            :type="'text'"
            :name="'total_hours'"
            :label="'Total hours'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'total_hours')"
          />
          <AppInput
            v-model="form.title"
            :type="'text'"
            :name="'title'"
            :label="'Title'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'title')"
          />
          <AppInput
            v-model="form.description"
            :type="'textarea'"
            :name="'description'"
            :label="'Job description'"
            :error="formError.find(item => item.field === 'description')"
            :resize="false"
          />
          <AppInput
            v-model="form.report_to"
            :type="'text'"
            :name="'report_to'"
            :label="'Report to'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'report_to')"
          />
          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email address'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'email')"
          />
          <AppInput
            v-model="form.phone_number"
            :type="'text'"
            :name="'phone_number'"
            :label="'Telephone number'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'phone_number')"
          />
          <AppInput
            :type="'select'"
            v-model="form.is_another_doctor"
            :name="'is_another_doctor'"
            :label="'Is there another Dr on site?'"
            :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            :error="formError.find(item => item.field === 'is_another_doctor')"
          />
          <AppInput
            :type="'select'"
            v-model="form.is_nurse_available"
            :name="'is_nurse_available'"
            :label="'Is nurse support available?'"
            :items="[ {value: 'true', label: 'YES'}, {value: 'false', label: 'NO'} ]"
            :error="formError.find(item => item.field === 'is_nurse_available')"
          />
          <AppInput
            v-model="form.number_of_patients"
            :type="'number'"
            :name="'number_of_patients'"
            :label="'Number of patients to be seen during the session?'"
            :inStyle="'text-align:right;'"
            :error="formError.find(item => item.field === 'number_of_patients')"
          />

          <AppInput
            v-model="form.duration_for_each_appointment"
            :type="'number'"
            :name="'duration_for_each_appointment'"
            :label="'Duration of each appointment?'"
            :inStyle="'text-align:right;'"
            :error="formError.find(item => item.field === 'duration_for_each_appointment')"
          />

          <AppInput
            :type="'select'"
            v-model="form.opportunity_for_catch_up_slots"
            :name="'opportunity_for_catch_up_slots'"
            :label="'Opportunity for catch up slots?'"
            :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            :error="formError.find(item => item.field === 'opportunity_for_catch_up_slots')"
          />
          <AppInput
            v-model="form.session_requirements"
            :type="'multi-checkbox'"
            @checked="form.session_requirements.push($event)"
            @unchecked="form.session_requirements.splice(form.session_requirements.findIndex(item => item === $event), 1)"
            :name="'session_requirements'"
            :label="'Session requirements'"
            :lists="session_requirements_lists"
            :error="formError.find(item => item.field === 'session_requirements')"
          />

          <AppInput
            v-model="form.session_structure_information"
            :type="'textarea'"
            :name="'session_structure_information'"
            :label="'Session structure information'"
            :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
            :error="formError.find(item => item.field === 'session_structure_information')"
            :resize="false"
          />

          <AppInput
            v-model="form.extra_information"
            :type="'textarea'"
            :name="'extra_information'"
            :label="'Extra information'"
            :placeholder="'For example, number of expected patients, nearby car park, etc.'"
            :error="formError.find(item => item.field === 'extra_information')"
            :resize="false"
          />

          <AppInput
            :type="'select'"
            v-model="session_amendment"
            :name="'session_amendment'"
            :label="'Choose one reason for session amendment?'"
            :items="session_amendment_list"
            :error="formError.find(item => item.field === 'session_amendment')"
          />
          <AppInput
            v-if="session_amendment === 'other'"
            v-model="form.update_remarks"
            :type="'textarea'"
            :name="'update_remarks'"
            :label="'Update Remarks'"
            :error="formError.find(item => item.field === 'update_remarks')"
            :resize="false"
          />
          <template v-if="['Allocated','Applied'].includes(job.status)">
            <AppInput
              v-model="form.update_accepted_until"
              :type="'select'"
              :name="'update_accepted_until'"
              :label="'Set deadline for appointed Locum to accept these changes (per hour)'"
              :error="formError.find(item => item.field === 'update_accepted_until')"
              :items="[
                { label: '12', value: 12 * 60 },
                { label: '13', value: 13 * 60 },
                { label: '14', value: 14 * 60 },
                { label: '15', value: 15 * 60 },
                { label: '16', value: 16 * 60 },
                { label: '17', value: 17 * 60 },
                { label: '18', value: 18 * 60 },
                { label: '19', value: 19 * 60 },
                { label: '20', value: 20 * 60 },
                { label: '21', value: 21 * 60 },
                { label: '22', value: 22 * 60 },
                { label: '23', value: 23 * 60 },
                { label: '24', value: 24 * 60 },
              ]"
            />
          </template>
        </div>
        <div class="flex flex-col w-full lg:w-1/2 p-0 md:pl-4">
          <div class="font-bold text-sm sm:text-md">Duration</div>
          <div class="flex flex-row flex-wrap justify-between">
            <div class="px-1 w-full md:w-1/2">
              <AppDate
                v-model="form.date_start"
                :name="'date_start'"
                :label="'Start Date'"
                :error="formError.find(item => item.field === 'date_start')"
              />
            </div>
            <div class="px-1 w-full md:w-1/2">
              <AppTime
                v-model="form.time_start"
                :type="'time'"
                :name="'time_start'"
                :label="'Start Time'"
                :error="formError.find(item => item.field === 'time_start')"
              />
            </div>
            <div class="px-1 w-full md:w-1/2">
              <AppDate
                v-model="form.date_end"
                :name="'date_end'"
                :label="'End Date'"
                :error="formError.find(item => item.field === 'date_end')"
              />
            </div>
            <div class="px-1 w-full md:w-1/2">
              <AppTime
                v-model="form.time_end"
                :type="'time'"
                :name="'time_end'"
                :label="'End Time'"
                :error="formError.find(item => item.field === 'time_end')"
              />
            </div>
            <div class="w-full">
              <AppInput
                v-if="show_saturday"
                :type="'select'"
                v-model="form.include_saturday"
                :name="'include_saturday'"
                :label="'Include Saturday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
              <AppInput
                v-if="show_sunday"
                :type="'select'"
                v-model="form.include_sunday"
                :name="'include_sunday'"
                :label="'Include Sunday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
          </div>
          <AppInput
            v-model="form.shift_id"
            :type="'select'"
            :name="'shift_id'"
            :label="'Shift'"
            :placeholder="'Select...'"
            :items="shifts"
            :error="formError.find(item => item.field === 'shift_id')"
          />
          <AppInput
            v-model="unpaid_breaks"
            :type="'select'"
            :name="'unpaid_breaks '"
            :label="'Unpaid break'"
            :items="[ {value: false, label: 'No'}, {value: 15, label: '15'}, {value: 30, label: '30'}, {value: 60, label: '60'}, {value: 'other', label: 'Other'} ]"
          />
          <AppInput
            v-if="unpaid_breaks === 'other'"
            v-model="form.unpaid_breaks_in_minutes"
            :type="'text'"
            :name="'unpaid_breaks_in_minutes'"
            :label="'Other'"
            :inStyle="'text-align:right;'"
            :error="formError.find(item => item.field === 'unpaid_breaks_in_minutes')"
          />

          <AppInput
            :type="'select'"
            v-model="auto_assign_job"
            :name="'auto_assign_job'"
            :label="'Use AUTO-MATCH on this Job?'"
            :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
          />

          <template v-if="['false', false].includes(auto_assign_job)">
            <AppInput
              :type="'select'"
              v-model="selection_notification"
              :name="'selection_notification'"
              :label="'Add a selection date?'"
              :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
            />
            <div
              class="flex flex-row flex-wrap justify-between"
              v-if="selection_notification === true || selection_notification === 'true'"
            >
              <div>Selection will be made and you will receive a notification by this date</div>
              <div class="px-1 w-full md:w-1/2">
                <AppDate v-model="selection_date.date" :name="'selection_date'" :label="'Date'" />
              </div>
              <div class="px-1 w-full md:w-1/2">
                <AppTime
                  v-model="selection_date.time"
                  :type="'time'"
                  :name="'time_end'"
                  :label="'Time'"
                  :error="formError.find(item => item.field === 'selection_date')"
                />
              </div>
            </div>
          </template>

          <AppInput
            :type="'select'"
            v-model="bank_only"
            :name="'bank_only'"
            :label="'Make this Job available for Bank Only?'"
            :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
          />

          <template v-if="['false', false].includes(bank_only)">
            <AppInput
              :type="'select'"
              v-model="bank_first"
              :name="'bank_first'"
              :label="'Make this Job available for Bank First?'"
              :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
            />
            <div
              class="flex flex-row flex-wrap justify-between"
              v-if="bank_first === true || bank_first === 'true'"
            >
              <div>Only favorite locum will be notified until this date</div>
              <div class="px-1 w-full md:w-1/2">
                <AppDate
                  v-model="favorite_only_until.date"
                  :name="'favorite_only_until'"
                  :label="'Date'"
                />
              </div>
              <div class="px-1 w-full md:w-1/2">
                <AppTime
                  v-model="favorite_only_until.time"
                  :type="'time'"
                  :name="'time_end'"
                  :label="'Time'"
                  :error="formError.find(item => item.field === 'favorite_only_until')"
                />
              </div>
            </div>
          </template>

          <AppInput
            v-model="form.ir35"
            :type="'select'"
            :name="'ir35'"
            :label="'IR35 - role inside or outside of scope'"
            :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
          />

          <AppInput
            v-model="form.profession_id"
            :type="'select'"
            :name="'profession_id'"
            :label="'Role'"
            :items="professions"
          />

          <AppFilterSearch
            v-model="form.qualification_id"
            :name="'qualification_id'"
            :label="'Specialty'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'qualification_id')"
            :info="'Choose at least one qualification'"
            :url="'/api/v1/qualifications'"
            @add="CheckEmptyField(form.qualification_id, 'qualification_id')"
            @remove="CheckEmptyField(form.qualification_id, 'qualification_id')"
            :professionCategoryId="selectedProfessionCategoryId"
          />
          <!-- :professionCategoryId="professionCategoryId.toString()" -->

          <AppFilterSearch
            v-model="form.clinical_system_id"
            :name="'clinical_system_id'"
            :label="'Clinical systems'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'clinical_system_id')"
            :info="'Choose at least one IT system'"
            :url="'/api/v1/clinical-systems'"
            @add="CheckEmptyField(form.clinical_system_id, 'clinical_system_id')"
            @remove="CheckEmptyField(form.clinical_system_id, 'clinical_system_id')"
          />
          <AppFilterSearch
            v-model="form.spoken_language_id"
            :name="'spoken_language_id'"
            :label="'Spoken languages'"
            :placeholder="'Select...'"
            :info="'Choose other languages you can speak'"
            :url="'/api/v1/spoken-languages'"
            :defaultItem="'English'"
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
        <AppButton :label="'Save changes'" :inStyle="'padding:8px'" @click="validateUpdate" />
      </div>
    </div>
    <AppConfirmationModal
      :label="'You might lose some of your candidates that are not qualified to the changes you made'"
      :confirmLabel="'Proceed'"
      :cancelLabel="'Cancel'"
      :modal="modal"
      @confirm="save"
      @cancel="modal = false"
    />
  </div>
</template>
<script>
import { gmapApi } from "vue2-google-maps";
import { mixin as clickaway } from "vue-clickaway";
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppTime from "@/components/Base/AppTime";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppFormError from "@/components/Base/AppFormError";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
const session_requirements_lists = [
  { label: "Practice admin", value: "Practice admin" },
  { label: "Telephone triage", value: "Telephone triage" },
  { label: "Home visits", value: "Home visits" }
];
const session_amendment_list = [
  {
    label: "Change job rate",
    value: "Change job rate"
  },
  {
    label: "Change required compliance levels",
    value: "Change required compliance levels"
  },
  {
    label: "Change work hours",
    value: "Change work hours"
  },
  {
    label: "Change work shift",
    value: "Change work shift"
  },
  {
    label: "Other",
    value: "other"
  }
];
export default {
  mixins: [clickaway],
  props: ["job"],
  components: {
    AppInput,
    AppDate,
    AppTime,
    AppButton,
    AppFilterSearch,
    AppFormError,
    AppConfirmationModal
  },
  data() {
    return {
      modal: false,

      professionCategoryId: "",

      practice_lists: [],
      rate_lists: [],
      mandatory_training: [],
      professions: [],
      session_requirements_lists,
      mandatory_training_lists: [],

      gp_compliance_documents_lists: [],
      others_compliance_documents_lists: [],

      professions_categories: [],
      selectedProfession: {
        profession_category: {}
      },
      compliances: [],
      unpaid_breaks: false,
      auto_assign_job: false,
      selection_notification: false,
      shifts: [],
      session_amendment: "other",
      session_amendment_list,
      bank_first: false,
      bank_only: false,

      selection_date: {
        date: null,
        time: null
      },
      favorite_only_until: {
        date: null,
        time: null
      },

      selectedQualification: [],
      selectedClinicalSystem: [],
      selectedSpokenLanguage: [],

      form: {
        practice_id: "",
        title: "",
        description: "",
        email: "",
        report_to: "",
        is_another_doctor: false,
        is_nurse_available: false,
        number_of_patients: "",
        duration_for_each_appointment: "",
        opportunity_for_catch_up_slots: false,
        session_requirements: [],
        session_structure_information: "",
        extra_information: "",
        rate: "",
        total_hours: "",
        locum_detail_rate_type_id: 1,
        ir35: false,
        mandatory_training_id: [],
        profession_id: null,
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        compliance_document_id: [],
        date_start: null,
        time_start: null,
        date_end: null,
        time_end: null,
        include_saturday: false,
        include_sunday: false,
        unpaid_breaks_in_minutes: "",
        shift_id: "",
        auto_assign_at: null,
        selection_date: null,
        favorite_only_until: null,
        update_accepted_until: null
      },
      formError: [],
      show_saturday: false,
      show_sunday: false
    };
  },
  watch: {
    "form.profession_id"(newValue, oldValue) {
      if (newValue && this.professions_categories.length > 0) {
        this.selectedProfession = this.professions_categories.find(
          item => item.id == newValue
        );

        if (this.selectedProfession.profession_category.id == 1) {
          this.compliances = this.gp_compliance_documents_lists;
        } else if (this.selectedProfession.profession_category.id == 2) {
          this.compliances = this.others_compliance_documents_lists;
        }
      }
      if (newValue && oldValue) {
        this.form.compliance_document_id = [];
        console.log(this.form.compliance_document_id);
      }
    },
    "form.date_end"(value) {
      let end = this.$moment(value);
      let days = [];
      let day = this.$moment(this.form.date_start);
      while (day <= end) {
        days.push(day.day());
        day = day.clone().add(1, "d");
      }
      this.show_saturday = false;
      this.show_sunday = false;
      if (days.includes(6)) {
        this.show_saturday = true;
      }
      if (days.includes(0)) {
        this.show_sunday = true;
      }
    },
    session_amendment(value) {
      if (value !== "other") {
        this.form.update_remarks = value;
      }
    }
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    },
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates;
    },
    selectedProfessionCategoryId() {
      return this.selectedProfession &&
        this.selectedProfession.profession_category &&
        this.selectedProfession.profession_category.id
        ? this.selectedProfession.profession_category.id.toString()
        : null;
    }
  },
  created() {
    this.$axios.$get(`/api/v1/practice/me/practice-practices`).then(res => {
      this.practice_lists = [];
      res.data.practices.forEach(item => {
        this.practice_lists.push({ label: item.surgery.name, value: item.id });
      });
    });
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rate_lists = [];
      res.data.locum_detail_rate_types.forEach(item => {
        this.rate_lists.push({ label: item.name, value: item.id });
      });
    });
    this.$axios.$get(`/api/v1/shifts`).then(res => {
      this.shifts = [];
      res.data.shifts.forEach(item => {
        this.shifts.push({ label: item.name, value: item.id });
      });
    });

    this.$axios.$get(`/api/v1/professions`).then(res => {
      this.professions = [];
      res.data.professions.forEach(item => {
        this.professions.push({ label: item.name, value: item.id });
        this.professions_categories.push(item);
      });
    });

    this.$axios.$get(`/api/v1/me`).then(res => {
      res.data.user.practice_detail.practice.mandatory_trainings.forEach(
        item => {
          this.mandatory_training_lists.push({
            label: item.name,
            value: item.id
          });
        }
      );
      res.data.user.practice_detail.practice.gp_compliance_documents.forEach(
        item => {
          this.gp_compliance_documents_lists.push({
            label: item.name,
            value: item.id
          });
        }
      );
      res.data.user.practice_detail.practice.others_compliance_documents.forEach(
        item => {
          this.others_compliance_documents_lists.push({
            label: item.name,
            value: item.id
          });
        }
      );
    });
    this.form.practice_id = this.job.platform_job.practice.id;
    this.form.title = this.job.title;
    this.form.description = this.job.description;
    this.form.report_to = this.job.platform_job.report_to;
    this.form.email = this.job.platform_job.email;
    this.form.phone_number = this.job.platform_job.practice.phone_number;
    this.form.extra_information = this.job.platform_job.extra_information;
    this.form.is_another_doctor = this.job.platform_job.is_another_doctor;
    this.form.is_nurse_available = this.job.platform_job.is_nurse_available;
    this.form.number_of_patients = this.job.platform_job.number_of_patients;
    this.form.duration_for_each_appointment = this.job.platform_job.duration_for_each_appointment;
    this.form.opportunity_for_catch_up_slots = this.job.platform_job.opportunity_for_catch_up_slots;
    this.form.session_structure_information = this.job.platform_job.session_structure_information;
    this.form.locum_detail_rate_type_id = this.job.locum_detail_rate_type.id;
    this.form.rate = this.job.rate;
    this.form.total_hours = this.job.total_hours;
    if (this.job.platform_job.unpaid_breaks_in_minutes === 0) {
      this.unpaid_breaks = false;
    } else if (
      ![15, 30, 60].includes(this.job.platform_job.unpaid_breaks_in_minutes)
    ) {
      this.unpaid_breaks = "other";
      this.form.unpaid_breaks_in_minutes = this.job.platform_job.unpaid_breaks_in_minutes;
    } else {
      this.unpaid_breaks = this.job.platform_job.unpaid_breaks_in_minutes;
    }

    this.form.ir35 = this.job.platform_job.ir35;
    this.form.mandatory_training_id = this.job.platform_job.mandatory_trainings.map(
      item => item.id
    );
    this.form.compliance_document_id = this.job.platform_job.compliance_documents.map(
      item => item.id
    );
    this.form.date_start = this.job.date_start;
    this.form.date_end = this.job.date_end;
    this.form.time_start = this.job.time_start;
    this.form.time_end = this.job.time_end;
    this.form.shift_id = this.job.shift.id;

    this.form.include_saturday = this.job.include_saturday;
    this.form.include_sunday = this.job.include_sunday;

    this.form.auto_assign_at = this.job.platform_job.auto_assign_at;
    if (this.form.auto_assign_at) {
      this.auto_assign_job = true;
    }

    if (this.job.selection_date) {
      this.selection_date.date = this.$moment(
        this.job.selection_date,
        "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
      ).format("YYYY-MM-DD");
      this.selection_date.time = this.$moment(
        this.job.selection_date,
        "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
      ).format("HH:mm");
      this.selection_notification = true;
    }

    if (
      this.$moment(this.job.date_start, "YYYY-MM-DD").diff(
        this.job.platform_job.favorite_only_until,
        "seconds"
      ) > 0
    ) {
      this.bank_first = true;
      this.favorite_only_until.date = this.$moment(
        this.job.platform_job.favorite_only_until,
        "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
      ).format("YYYY-MM-DD");
      this.favorite_only_until.time = this.$moment(
        this.job.platform_job.favorite_only_until,
        "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
      ).format("HH:mm");
    } else if (
      this.$moment(this.job.date_start, "YYYY-MM-DD").diff(
        this.job.platform_job.favorite_only_until,
        "seconds"
      ) <= 0
    ) {
      this.bank_only = true;
    }

    this.form.update_remarks = this.job.update_remarks;
    if (
      this.session_amendment_list
        .map(items => items.value)
        .includes(this.job.update_remarks)
    ) {
      this.session_amendment = this.job.update_remarks;
    } else if (
      !this.session_amendment_list
        .map(items => items.value)
        .includes(this.job.update_remarks)
    ) {
      this.session_amendment = "other";
    }

    if (this.job.platform_job.session_requirements === "") {
      this.form.session_requirements = [];
    } else {
      this.form.session_requirements = this.job.platform_job.session_requirements.split(
        ","
      );
    }

    this.job.platform_job.qualifications.forEach(qualication => {
      this.form.qualification_id.push({
        label: qualication.name,
        value: qualication.id
      });
    });

    this.job.platform_job.clinical_systems.forEach(clinicalSystem => {
      this.form.clinical_system_id.push({
        label: clinicalSystem.name,
        value: clinicalSystem.id
      });
    });

    this.job.platform_job.spoken_languages.forEach(spokenLanguage => {
      this.form.spoken_language_id.push({
        label: spokenLanguage.name,
        value: spokenLanguage.id
      });
    });

    this.form.profession_id = this.job.platform_job.profession.id;
    if (this.job.type === "Platform") {
      if (this.job.platform_job.profession.name === "GP") {
        this.compliances = this.gp_compliance_documents_lists;
      }
      if (this.job.platform_job.profession.name !== "GP") {
        this.compliances = this.others_compliance_documents_lists;
      }
    }
    if (this.job.type === "Private") {
      if (this.job.private_job.profession.name === "GP") {
        this.compliances = this.gp_compliance_documents_lists;
      }
      if (this.job.private_job.profession.name !== "GP") {
        this.compliances = this.others_compliance_documents_lists;
      }
    }
  },
  methods: {
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      );
    },
    validateUpdate() {
      if (this.job.status === "Applied") {
        this.modal = true;
      } else if (this.job.status !== "Applied") {
        this.save();
      }
    },
    save() {
      this.modal = false;

      this.formError = [];

      let notRequired = [
        "extra_information",
        "is_another_doctor",
        "is_nurse_available",
        "opportunity_for_catch_up_slots",
        "spoken_language_id",
        "ir35",
        "mandatory_training_id",
        "include_saturday",
        "include_sunday",
        "compliance_document_id",
        "bank_only",
        "auto_assign_at"
      ];

      if (!["Allocated", "Applied"].includes(this.job.status)) {
        notRequired.push("update_accepted_until");
      }

      let startDateTime = this.$moment(
        `${this.form.date_start} ${this.form.time_start}`,
        "YYYY-MM-DD HH:mm"
      ).format("YYYY-MM-DD HH:mm");
      let endDateTime = this.$moment(
        `${this.form.date_end} ${this.form.time_end}`,
        "YYYY-MM-DD HH:mm"
      ).format("YYYY-MM-DD HH:mm");

      if (this.$moment(this.startDateTime).isSameOrAfter(this.endDateTime)) {
        this.formError.push({
          field: "date_end",
          message: "Invalid End Date"
        });
        this.formError.push({
          field: "date_start",
          message: "Invalid Start Date"
        });
      }

      if (
        ["15", 15, "30", 30, "60", 60, false, "false"].includes(
          this.unpaid_breaks
        )
      ) {
        notRequired.push("unpaid_breaks_in_minutes");
      }

      if (["true", true].includes(this.auto_assign_job)) {
        this.selection_notification = false;
      }

      if (["false", false].includes(this.selection_notification)) {
        notRequired.push("selection_date");
      } else if (
        ["true", true].includes(this.selection_notification) &&
        this.selection_date.date &&
        this.selection_date.time
      ) {
        notRequired.push("selection_date");
      }

      if (["true", true].includes(this.bank_only)) {
        this.bank_first = false;
      }

      if (["false", false].includes(this.bank_first)) {
        notRequired.push("favorite_only_until");
      } else if (
        ["true", true].includes(this.bank_first) &&
        this.favorite_only_until.date &&
        this.favorite_only_until.time
      ) {
        notRequired.push("favorite_only_until");
      }

      this.Validate(this.form, notRequired);

      if (!this.formError.length) {
        this.selectedClinicalSystem = [...this.form.clinical_system_id];
        this.form.clinical_system_id = this.form.clinical_system_id.map(
          item => item.value
        );
        this.selectedQualification = [...this.form.qualification_id];
        this.form.qualification_id = this.form.qualification_id.map(
          item => item.value
        );
        this.selectedSpokenLanguage = [...this.form.spoken_language_id];
        this.form.spoken_language_id = this.form.spoken_language_id.map(
          item => item.value
        );

        this.form.date_start = this.$moment(
          this.form.date_start,
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD");
        this.form.date_end = this.$moment(
          this.form.date_end,
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD");

        if (Array.isArray(this.form.session_requirements)) {
          if (this.form.session_requirements.length === 1) {
            this.form.session_requirements = this.form.session_requirements[0];
          } else if (this.form.session_requirements.length > 0) {
            this.form.session_requirements = this.form.session_requirements.join();
          } else if (this.form.session_requirements.length === 0) {
            this.form.session_requirements = "";
          }
        }

        this.form.auto_assign_at = null;
        if (["true", true].includes(this.auto_assign_job)) {
          this.form.auto_assign_at = "1970-01-01 00:00";
        }

        this.form.selection_date = null;
        if (["false", false].includes(this.auto_assign_job)) {
          if (["true", true].includes(this.selection_notification)) {
            this.form.selection_date = `${this.$moment(
              this.selection_date.date,
              "YYYY-MM-DD"
            ).format("YYYY-MM-DD")} ${this.selection_date.time}`;
          }
        }

        this.form.favorite_only_until = null;
        if (["true", true].includes(this.bank_first)) {
          this.form.favorite_only_until = `${this.$moment(
            this.favorite_only_until.date,
            "YYYY-MM-DD"
          ).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`;
        }
        if (["true", true].includes(this.bank_only)) {
          this.form.favorite_only_until = `${this.$moment(
            this.form.date_start,
            "YYYY-MM-DD"
          )
            .add(1, "days")
            .format("YYYY-MM-DD HH:mm")}`;
        }

        if (["15", 15, "30", 30, "60", 60].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = this.unpaid_breaks;
        }
        if (this.unpaid_breaks === "other") {
          this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes;
        }
        if (["false", false].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = "";
        }

        this.$axios
          .$put(`/api/v1/practice/jobs/${this.job.id}`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Successfully updated job"]
            });
            this.$emit("updateJob", {
              newJob: res.data.new_job,
              oldJob: res.data.job
            });
          })
          .catch(err => {
            console.log("err", err.response || err);
            this.form.clinical_system_id = this.selectedClinicalSystem;
            this.form.qualification_id = this.selectedQualification;
            this.form.spoken_language_id = this.selectedSpokenLanguage;

            this.form.session_requirements = this.form.session_requirements.split(
              ","
            );

            if (err.response.status === 500) {
              this.formError.push({
                field: err.response.statusText,
                message: "Please check your inputs"
              });
            } else if (err.response.status === 400) {
              this.formError.push({
                field: "date_start",
                message: err.response.data.message
              });
              this.formError.push({
                field: "date_end",
                message: err.response.data.message
              });
            } else {
              this.formError = err.response.data.error_messages;
            }
            throw err;
          });
      } else {
        this.$nextTick(() => {
          // this.$refs.formError.scrollIntoView({
          //   behavior: "smooth",
          //   block: "end"
          // });
          // this.$parent.$refs.modalContainer.scrollTop = 0;
        });
      }
    }
  }
};
</script>

