<template>
  <div class="modal-container shadow-lg" ref="modalContainer">
    <div class="p-4 md:p-8">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Create a new job</div>
      <AppFormError :formError="formError" v-if="formError.length" />

      <div class="flex flex-row flex-wrap justify-start mt-8">
        <div class="w-full md:w-1/2 pr-4 mb-4">
          <div class="flex flex-col">
            <h4 class="font-bold">Practice</h4>
            <div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
              <AppInput
                v-model="form.practice_id"
                :type="'select'"
                :name="'practice_id'"
                :placeholder="'Select...'"
                :error="formError.find(item => item.field === 'practice_id')"
                :items="practice_lists"
                @blur="CheckEmptyField(form.practice_id, 'practice_id')"
              />
            </div>
            <h4 class="font-bold mt-4">Overview</h4>
            <div class="bg-white rounded-lg shadow-lg px-4 md:px-8 pt-4 mt-4">
              <AppInput
                v-model="form.title"
                :type="'text'"
                :name="'title'"
                :label="'Title'"
                :error="formError.find(item => item.field === 'title')"
                @blur="CheckEmptyField(form.title,'title')"
              />

              <AppInput
                v-model="form.description"
                :type="'textarea'"
                :name="'description'"
                :label="'Description'"
                :resize="false"
                :error="formError.find(item => item.field === 'description')"
                @blur="CheckEmptyField(form.description,'description')"
              />
              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'report_to')"
                @blur="CheckEmptyField(form.report_to,'report_to')"
              />
              <AppInput
                v-model="form.email"
                :type="'text'"
                :name="'email'"
                :label="'Email'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'email')"
                @blur="CheckEmptyField(form.email,'email')"
              />
              <AppInput
                :type="'select'"
                v-model="form.is_another_doctor"
                :name="'is_another_doctor'"
                :label="'Is there another Dr on site?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />
              <AppInput
                :type="'select'"
                v-model="form.is_nurse_available"
                :name="'is_nurse_available'"
                :label="'Is nurse support available?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />
              <AppInput
                v-model="form.number_of_patients"
                :type="'number'"
                :name="'number_of_patients'"
                :label="'Number of patients to be seen during the session?'"
                :placeholder="''"
                :inStyle="'text-align:right;'"
                :error="formError.find(item => item.field === 'number_of_patients')"
                @blur="CheckEmptyField(form.number_of_patients,'number_of_patients')"
              />
              <AppInput
                v-model="form.duration_for_each_appointment"
                :type="'text'"
                :name="'duration_for_each_appointment'"
                :label="'Duration of each appointment?'"
                :placeholder="''"
                :inStyle="'text-align:right;'"
                :error="formError.find(item => item.field === 'duration_for_each_appointment')"
                @blur="CheckEmptyField(form.duration_for_each_appointment, 'duration_for_each_appointment')"
              />
              <AppInput
                :type="'select'"
                v-model="form.opportunity_for_catch_up_slots"
                :name="'opportunity_for_catch_up_slots'"
                :label="'Opportunity for catch up slots?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />
              <AppInput
                v-model="form.session_requirements"
                :type="'multi-checkbox'"
                @checked="form.session_requirements.push($event)"
                @unchecked="form.session_requirements.splice(form.session_requirements.findIndex(item => item === $event), 1)"
                :name="'session_requirements'"
                :label="'Session requirements'"
                :placeholder="''"
                :lists="session_requirements_lists"
                :error="formError.find(item => item.field === 'session_requirements')"
                @blur="CheckEmptyField(form.session_requirements, 'session_requirements')"
              />

              <AppInput
                v-model="form.session_structure_information"
                :type="'textarea'"
                :name="'session_structure_information'"
                :label="'Session structure information'"
                :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
                :resize="false"
                :error="formError.find(item => item.field === 'session_structure_information')"
                @blur="CheckEmptyField(form.session_structure_information, 'session_structure_information')"
              />
              <AppInput
                v-model="form.extra_information"
                :type="'textarea'"
                :name="'extra_information'"
                :label="'Extra information'"
                :placeholder="'For example, number of expected patients, nearby car park, etc.'"
                :resize="false"
              />
              <div class="flex flex-col py-2 mb-3 md:mb-6">
                <div class="relative flex flex-row flex-wrap justify-start">
                  <div class="mt-2">
                    <label for="rate" class="text-xs sm:text-sm mt-2">Rate £</label>
                    <input
                      v-model="form.rate"
                      type="number"
                      class="border-b-2 focus:border-yellow-400 focus:outline-none font-bold text-xs sm:text-sm mx-1 py-2"
                      :class="formError.find(item => item.field === 'rate')? 'border-red-500':''"
                      style="text-align:right;width:100px;"
                      :error="formError.find(item => item.field === 'rate')"
                      @blur="CheckEmptyField(form.rate,'rate')"
                    />
                    <label for="rate" class="text-xs sm:text-sm mt-2">hours</label>
                  </div>
                </div>
              </div>
              <div class="flex flex-col py-2 mb-3 md:mb-6">
                <div class="relative flex flex-row flex-no-wrap justify-between">
                  <label for="total_hours" class="text-xs sm:text-sm py-1 mt-2">Total hours</label>
                  <div
                    class="absolute right-0 bg-red-500 p-1 text-xs sm:text-base text-white"
                    v-if="this.formError.find(item => item.field === 'total_hours')"
                  >{{this.formError.find(item => item.field === 'total_hours').message}}</div>
                </div>
                <div class="flex flex-row flex-no-wrap justify-start mt-1">
                  <input
                    v-model="form.total_hours"
                    type="number"
                    class="border-b-2 focus:border-yellow-400 focus:outline-none font-bold py-2 text-xs sm:text-sm mx-1"
                    :class="this.formError.find(item => item.field === 'total_hours')? 'border-red-500':''"
                    @blur="CheckEmptyField(form.total_hours,'total_hours')"
                    style="text-align:right;'"
                    :error="formError.find(item => item.field === 'total_hours')"
                  />
                  <label for="total_hours" class="text-xs sm:text-sm mt-2">hours</label>
                </div>
              </div>
              <AppInput
                v-model="form.ir35"
                :type="'select'"
                :name="'ir35'"
                :label="'IR35 - role inside or outside of scope'"
                :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
              />
              <AppInput
                v-model="form.mandatory_training_id"
                :type="'multi-checkbox'"
                :error="formError.find(item => item.field === 'mandatory_training_id')"
                @checked="form.mandatory_training_id.push($event)"
                @unchecked="uncheckMandatory($event)"
                :name="'mandatory_training_id'"
                :label="'Mandatory training required for this job'"
                :placeholder="'Select..'"
                :lists="mandatory_training_lists"
                :info="'Check all that apply'"
              />
              <div class="mb-6" v-if="mandatory_training_lists.length === 0">
                <AppButton
                  :label="'Go to Profile to add items here'"
                  @click="addMandatory"
                  :inStyle="'padding: 5px 14px;'"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 lg:pl-4 mb-4">
          <div class="flex flex-col">
            <h4 class="font-bold">Criteria</h4>
            <div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
              <AppInput
                v-model="form.profession_id"
                :type="'select'"
                :name="'profession_id'"
                :label="'Role'"
                :placeholder="'Select...'"
                :items="professions"
                :error="formError.find(item => item.field === 'profession_id')"
                @blur="CheckEmptyField(form.profession_id,'profession_id')"
              />

              <template v-if="form.profession_id">
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
                  :professionCategoryId="form.profession_id.toString()"
                />

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

                <template v-if="form.profession_id">
                  <div class="relative flex flex-col pt-2">
                    <div class="text-xs sm:text-sm py-1">Compliance documents</div>
                  </div>
                  <AppInput
                    v-model="form.compliance_document_id"
                    :type="'multi-checkbox'"
                    :error="formError.find(item => item.field === 'compliance_document_id')"
                    @checked="form.compliance_document_id.push($event)"
                    @unchecked="form.compliance_document_id.splice(form.compliance_document_id.findIndex(item => item === $event), 1)"
                    :name="'compliance_document_id'"
                    :label="`${selectedProfession.profession_category.id === 1 ? 'For GPs:' : selectedProfession.profession_category.id === 2 ? 'For Nurses, et al:' : ''}`"
                    :placeholder="''"
                    :lists="compliances"
                  />
                </template>
              </template>
            </div>
          </div>
          <div class="flex flex-col">
            <h4 class="font-bold mt-4">Duration</h4>
            <div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
              <div class="flex flex-row flex-wrap justify-between">
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="form.date_start"
                    :name="'date_start'"
                    :label="'Start Date'"
                    :error="formError.find(item => item.field === 'date_start')"
                    @blur="CheckEmptyField(form.date_start,'date_start')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="form.time_start"
                    :type="'time'"
                    :name="'time_start'"
                    :label="'Start Time'"
                    :error="formError.find(item => item.field === 'time_start')"
                    @blur="CheckEmptyField(form.time_start,'time_start')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="form.date_end"
                    :name="'date_end'"
                    :label="'End Date'"
                    :error="formError.find(item => item.field === 'date_end')"
                    @blur="CheckEmptyField(form.date_end,'date_end')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="form.time_end"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'End Time'"
                    :error="formError.find(item => item.field === 'time_end')"
                    @blur="CheckEmptyField(form.time_end,'time_end')"
                  />
                </div>
              </div>
              <AppInput
                :type="'select'"
                v-model="form.include_saturday"
                :name="'include_saturday'"
                :label="'Include Saturday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
              <AppInput
                :type="'select'"
                v-model="form.include_sunday"
                :name="'include_sunday'"
                :label="'Include Sunday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
              <AppInput
                :type="'select'"
                v-model="unpaid_breaks"
                :name="'unpaid_breaks'"
                :label="'Unpaid break'"
                :items="[ {value: false, label: 'No'}, {value: 15, label: '15'}, {value: 30, label: '30'}, {value: 60, label: '60'}, {value: 'other', label: 'Other'} ]"
              />

              <AppInput
                v-if="unpaid_breaks === 'other'"
                v-model="form.unpaid_breaks_in_minutes"
                :type="'text'"
                :name="'unpaid_breaks_in_minutes'"
                :label="'Other'"
                :placeholder="''"
                :inStyle="'text-align:right;'"
                :error="formError.find(item => item.field === 'unpaid_breaks_in_minutes')"
                @blur="CheckEmptyField(form.unpaid_breaks_in_minutes,'unpaid_breaks_in_minutes')"
              />
              <AppInput
                v-model="form.shift_id"
                :type="'select'"
                :name="'shift_id'"
                :label="'Shifts'"
                :placeholder="'Select...'"
                :items="shifts"
                :error="formError.find(item => item.field === 'shift_id')"
                @blur="CheckEmptyField(form.shift_id, 'shift_id')"
              />

              <AppInput
                :type="'select'"
                v-model="auto_assign_job"
                :name="'auto_assign_job'"
                :label="'Auto-assign this job?'"
                :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
              />
              <div
                class="flex flex-row flex-wrap justify-between"
                v-if="auto_assign_job === true || auto_assign_job === 'true'"
              >
                <div>Auto-assign job to the first matching Favourite applicant by this date</div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate v-model="auto_assign_at.date" :name="'auto_assign_at'" :label="'Date'" />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="auto_assign_at.time"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'Time'"
                    :error="formError.find(item => item.field === 'auto_assign_at')"
                  />
                </div>
              </div>

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

              <AppInput
                :type="'select'"
                v-model="favorite_notification"
                :name="'favorite_notification'"
                :label="'Make this Job Private?'"
                :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
              />

              <div
                class="flex flex-row flex-wrap justify-between"
                v-if="favorite_notification === true || favorite_notification === 'true'"
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
            </div>
            <div class="mt-4">
              <AppButton
                :label="'Save and publish Job'"
                @click="publish"
                v-if="authPermissions.includes('Create Sessions Job')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mixin as clickaway } from "vue-clickaway";
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppTime from "@/components/Base/AppTime";
import AppFormError from "@/components/Base/AppFormError";
const session_requirements_lists = [
  { label: "Practice admin", value: "Practice admin" },
  { label: "Telephone triage", value: "Telephone triage" },
  { label: "Home visits", value: "Home visits" }
];
export default {
  mixins: [clickaway],
  components: {
    AppInput,
    AppFilterSearch,
    AppDate,
    AppButton,
    AppTime,
    AppFormError
  },
  data() {
    return {
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
      favorite_notification: false,
      shifts: [],

      auto_assign_at: {
        date: null,
        time: null
      },
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
        profession_id: "",
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
        favorite_only_until: null
      },
      formError: []
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    }
  },
  watch: {
    "form.profession_id"(newValue, oldValue) {
      this.CheckEmptyField(newValue, "profession_id");
      if (newValue) {
        this.form.qualification_id = [];
        this.form.clinical_system_id = [];
        this.form.spoken_language_id = [];
        this.form.compliance_document_id = [];
        this.selectedProfession = this.professions_categories.find(
          item => item.id == newValue
        );
        if (this.selectedProfession.profession_category.id == 1) {
          this.compliances = this.gp_compliance_documents_lists;
          return;
        }
        if (this.selectedProfession.profession_category.id == 2) {
          this.compliances = this.others_compliance_documents_lists;
          return;
        }
      }
    },

    "form.practice_id"(value) {
      this.CheckEmptyField(value, "practice_id");
    },

    "form.title"(value) {
      this.CheckEmptyField(value, "title");
    },

    "form.description"(value) {
      this.CheckEmptyField(value, "description");
    },

    "form.report_to"(value) {
      this.CheckEmptyField(value, "report_to");
    },

    "form.rate"(value) {
      this.CheckEmptyField(value, "rate");
    },

    "form.date_start"(value) {
      this.CheckEmptyField(value, "date_start");
    },

    "form.date_end"(value) {
      this.CheckEmptyField(value, "date_end");
    },

    "form.time_start"(value) {
      this.CheckEmptyField(value, "time_start");
    },

    "form.time_end"(value) {
      this.CheckEmptyField(value, "time_end");
    },

    "form.total_hours"(value) {
      this.CheckEmptyField(value, "total_hours");
    },

    "form.qualification_id"(value) {
      this.CheckEmptyField(value, "qualification_id");
    },

    "form.clinical_system_id"(value) {
      this.CheckEmptyField(value, "clinical_system_id");
    },

    "form.unpaid_breaks_in_minutes"(value) {
      this.CheckEmptyField(value, "unpaid_breaks_in_minutes");
    },

    "form.shift_id"(value) {
      this.CheckEmptyField(value, "shift_id");
    },

    "form.email"(value) {
      let index = this.formError.findIndex(item => item.field === "email");
      if (index >= 0) {
        this.formError.splice(index, 1);
      }

      if (!value) {
        this.formError.push({ field: "email", message: "Required" });
      } else {
        const error = this.ValidateEmail(value);
        if (error) {
          this.formError.push(error);
        }
      }
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
      this.form.report_to = res.data.user.practice_detail.practice.report_to;
      this.form.email = res.data.user.practice_detail.practice.email;
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
  },

  methods: {
    close() {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);
    },
    addMandatory() {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);
      this.$router.push("/profile/practice");
    },
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      );
    },
    addMandatory() {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);
      this.$router.push("/profile/practice");
    },
    publish() {
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
        "compliance_document_id"
      ];

      if (["15", "30", "60", false, "false"].includes(this.unpaid_breaks)) {
        notRequired.push("unpaid_breaks_in_minutes");
      }

      if (this.auto_assign_job === false || this.auto_assign_job === "false") {
        notRequired.push("auto_assign_at");
      } else {
        if (this.auto_assign_job === true || this.auto_assign_job === "true") {
          if (this.auto_assign_at.date && this.auto_assign_at.time) {
            notRequired.push("auto_assign_at");
          }
        }
      }

      if (
        this.selection_notification == false ||
        this.selection_notification == "false"
      ) {
        notRequired.push("selection_date");
      } else {
        if (
          this.selection_notification === true ||
          this.selection_notification === "true"
        ) {
          if (this.selection_date.date && this.selection_date.time) {
            notRequired.push("selection_date");
          }
        }
      }

      if (
        this.favorite_notification == false ||
        this.favorite_notification == "false"
      ) {
        notRequired.push("favorite_only_until");
      } else {
        if (
          this.favorite_notification === true ||
          this.favorite_notification === "true"
        ) {
          if (this.favorite_only_until.date && this.favorite_only_until.time) {
            notRequired.push("favorite_only_until");
          }
        }
      }
      console.log("notRequired", notRequired);
      this.Validate(this.form, notRequired);
      console.log("formError", this.formError.map(err => err.field));
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
        this.form.date_start = this.$moment(this.form.date_start).format(
          "YYYY-MM-DD"
        );
        this.form.date_end = this.$moment(this.form.date_end).format(
          "YYYY-MM-DD"
        );

        this.form.session_requirements.length > 0
          ? (this.form.session_requirements = this.form.session_requirements.join())
          : (this.form.session_requirements = "");

        this.form.auto_assign_at =
          this.auto_assign_job === true
            ? `${this.$moment(this.auto_assign_at.date).format("YYYY-MM-DD")} ${
                this.auto_assign_at.time
              }`
            : null;

        this.form.selection_date =
          this.selection_notification === true
            ? `${this.$moment(this.selection_date.date).format("YYYY-MM-DD")} ${
                this.selection_date.time
              }`
            : null;

        this.form.favorite_only_until =
          this.favorite_notification === true
            ? `${this.$moment(this.favorite_only_until.date).format(
                "YYYY-MM-DD"
              )} ${this.favorite_only_until.time}`
            : null;

        if (["15", "30", "60"].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = this.unpaid_breaks;
        }
        if (this.unpaid_breaks === "other") {
          this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes;
        }

        this.$axios
          .$post(`/api/v1/practice/jobs`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Successfully created job"]
            });
            this.$store.commit("calendar/CREATE_JOB_MODAL", false);
          })
          .catch(err => {
            this.$refs.modalContainer.scrollTop = 0;
            this.form.clinical_system_id = this.selectedClinicalSystem;
            // this.clinical_system_lists.forEach((clinicalSystem, index) => {
            //   if (this.form.clinical_system_id.includes(clinicalSystem.value)) {
            //     this.form.clinical_system_id.splice(index, 1, clinicalSystem);
            //   }
            // });
            this.form.qualification_id = this.selectedQualification;
            // this.qualifications.forEach((qualification, index) => {
            //   if (this.form.qualification_id.includes(qualification.value)) {
            //     this.form.qualification_id.splice(index, 1, qualification);
            //   }
            // });
            this.form.spoken_language_id = this.selectedSpokenLanguage;
            // this.spoken_language_lists.forEach((spokenLanguage, index) => {
            //   if (this.form.spoken_language_id.includes(spokenLanguage.value)) {
            //     this.form.spoken_language_id.splice(index, 1, spokenLanguage);
            //   }
            // });
            this.form.session_requirements = this.form.session_requirements.split(
              ","
            );

            this.formError = err.response.data.error_messages;
          });
      } else {
        this.$nextTick(() => {
          this.$refs.modalContainer.scrollTop = 0;
        });
      }
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
</style>