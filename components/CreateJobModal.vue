<template>
  <div class="modal-container shadow-lg" ref="modalContainer">
    <div class="p-8 max-w-5xl">
      <div @click="close" class="cursor-pointer">
        <svgicon name="left-arrow" height="32" width="32" />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Create a new job</div>
      <AppFormError :formError="formError" v-if="formError.length" />

      <div class="flex flex-row flex-wrap justify-start mt-8">
        <div class="w-full md:w-1/2 pr-4 mb-4">
          <div class="flex flex-col">
            <h4 class="font-bold">Practice</h4>
            <div class="rounded-lg shadow-lg px-8 pt-4 mt-4">
              <AppSelect
                v-model="form.practice_id"
                :name="'practice_id'"
                :items="practice_lists"
                :placeholder="'Select..'"
                @blur="CheckEmptyField(form.practice_id,'practice_id')"
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
                @blur="CheckEmptyField(form.title,'title')"
              />
              <AppTextarea
                v-model="form.description"
                :name="'description'"
                :label="'Description'"
                :placeholder="''"
                @blur="CheckEmptyField(form.description,'description')"
              />
              <!-- report to -->
              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :placeholder="''"
                @blur="CheckEmptyField(form.report_to,'report_to')"
              />
              <!-- email -->
              <AppInput
                v-model="form.email"
                :type="'text'"
                :name="'email'"
                :label="'Email'"
                :placeholder="''"
                @blur="CheckEmptyField(form.email,'email')"
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
                @blur="CheckEmptyField(form.number_of_patients,'number_of_patients')"
              />
              <AppInput
                v-model="form.duration_for_each_appointment"
                :type="'text'"
                :name="'duration_for_each_appointment'"
                :label="'Duration of each appointment?'"
                :placeholder="''"
                :inStyle="'text-align:right;'"
                @blur="CheckEmptyField(form.duration_for_each_appointment, 'duration_for_each_appointment')"
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
                @blur="CheckEmptyField(form.session_requirements, 'session_requirements')"
              />
              <AppTextarea
                v-model="form.session_structure_information"
                :name="'session_structure_information'"
                :label="'Session structure information'"
                :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
                @blur="CheckEmptyField(form.session_structure_information, 'session_structure_information')"
              />
              <AppTextarea
                v-model="form.extra_information"
                :name="'extra_information'"
                :label="'Extra information'"
                :placeholder="'For example, number of expected patients, nearby car park, etc.'"
              />
              <div class="flex flex-col py-2 mb-6">
                <div class="relative flex flex-row flex-wrap justify-start">
                  <div class="mt-2">
                    <label for="rate" class="text-xs sm:text-sm mt-2">Rate £</label>
                    <input
                      v-model="form.rate"
                      type="text"
                      class="border-b-2 focus:border-yellow-400 focus:outline-none font-bold text-xs sm:text-sm mx-1 py-2"
                      :class="formError.find(item => item.field === 'rate')? 'border-red-500':''"
                      style="text-align:right;width:100px;"
                      @blur="CheckEmptyField(form.rate,'rate')"
                    />
                    <label for="rate" class="text-xs sm:text-sm mt-2">hours</label>
                  </div>
                </div>
              </div>
              <div class="flex flex-col py-2 mb-6">
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
                    type="text"
                    class="border-b-2 focus:border-yellow-400 focus:outline-none font-bold py-2 text-xs sm:text-sm mx-1"
                    :class="this.formError.find(item => item.field === 'total_hours')? 'border-red-500':''"
                    @blur="CheckEmptyField(form.total_hours,'total_hours')"
                    style="text-align:right;'"
                  />
                  <label for="total_hours" class="text-xs sm:text-sm mt-2">hours</label>
                </div>
              </div>
              <AppSelect
                v-model="form.ir35"
                :name="'ir35'"
                :label="'IR35 - role inside or outside of scope'"
                :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
              />
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
        <div class="w-full md:w-1/2 pl-4 mb-4">
          <div class="flex flex-col">
            <h4 class="font-bold">Criteria</h4>
            <div class="rounded-lg shadow-lg px-8 py-4 mt-4">
              <AppSelect
                v-model="form.profession_id"
                :name="'profession_id'"
                :label="'Role'"
                :items="professions"
                :placeholder="'Select..'"
              />
              <template v-if="form.profession_id">
                <AppFilterSearch
                  v-model="form.qualification_id"
                  :name="'qualification_id'"
                  :label="'Specialty'"
                  :placeholder="'Select...'"
                  :items="qualifications"
                  :info="'Choose at least one qualification'"
                  @blur="CheckEmptyField(form.qualification_id,'qualification_id')"
                />
                <template v-if="form.profession_id">
                  <!-- <AppFilterSearch
                  v-model="form.qualification_id"
                  :name="'qualification_id'"
                  :label="'Specialty'"
                  :placeholder="'Select...'"
                  :items="qualifications"
                  :info="'Choose at least one qualification'"
                  @blur="checkEmptyField(form.qualification_id,'qualification_id')"
                  />-->
                  <AppFilterSearch
                    v-model="form.clinical_system_id"
                    :name="'clinical_system_id'"
                    :label="'Clinical systems'"
                    :placeholder="'Select...'"
                    :items="clinical_system_lists"
                    :info="'Choose at least one qualification'"
                  />
                </template>

                <AppFilterSearch
                  v-model="form.spoken_language_id"
                  :name="'spoken_language_id'"
                  :label="'Spoken languages'"
                  :placeholder="'Select...'"
                  :items="spoken_language_lists"
                  :info="'Choose at least one qualification'"
                  :defaultItem="'English'"
                />
                <template v-if="form.profession_id">
                  <div class="relative flex flex-col pt-2">
                    <div class="text-xs sm:text-sm py-1">Compliance documents</div>
                  </div>
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
                </template>
              </template>
            </div>
          </div>
          <!-- <div class="flex flex-col">
          <h4 class="font-bold mt-4">Duration</h4>
          <div class="rounded-lg shadow-lg px-8 py-4 mt-4">
            <template>
              <div class="flex flex-row flex-wrap justify-between">
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="form.date_start"
                    :name="'date_start'"
                    :label="'Start Date'"
                    @blur="checkEmptyField(form.date_start,'date_start')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="form.time_start"
                    :type="'time'"
                    :name="'time_start'"
                    :label="'Start Time'"
                    @blur="checkEmptyField(form.time_start,'time_start')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="form.date_end"
                    :name="'date_end'"
                    :label="'End Date'"
                    @blur="checkEmptyField(form.date_end,'date_end')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="form.time_end"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'End Time'"
                    @blur="checkEmptyField(form.time_end,'time_end')"
                  />
                </div>
              </div>
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
            </template>
          </div>
          </div>-->
          <div class="flex flex-col">
            <h4 class="font-bold mt-4">Duration</h4>
            <div class="rounded-lg shadow-lg px-8 py-4 mt-4">
              <div class="flex flex-row flex-wrap justify-between">
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="form.date_start"
                    :name="'date_start'"
                    :label="'Start Date'"
                    @blur="CheckEmptyField(form.date_start,'date_start')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="form.time_start"
                    :type="'time'"
                    :name="'time_start'"
                    :label="'Start Time'"
                    @blur="CheckEmptyField(form.time_start,'time_start')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="form.date_end"
                    :name="'date_end'"
                    :label="'End Date'"
                    @blur="CheckEmptyField(form.date_end,'date_end')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="form.time_end"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'End Time'"
                    @blur="CheckEmptyField(form.time_end,'time_end')"
                  />
                </div>
              </div>
              <AppSelect
                v-model="form.include_saturday"
                :name="'include_saturday'"
                :label="'Include Saturday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                :placeholder="'Select..'"
              />
              <AppSelect
                v-model="form.include_sunday"
                :name="'include_sunday'"
                :label="'Include Sunday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
                :placeholder="'Select..'"
              />
              <AppSelect
                v-model="unpaid_breaks"
                :name="'unpaid_breaks'"
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
                @blur="CheckEmptyField(form.unpaid_breaks_in_minutes,'unpaid_breaks_in_minutes')"
              />
              <AppSelect
                v-model="form.shift_id"
                :name="'shift_id'"
                :label="'Shifts'"
                :items="shifts"
                :placeholder="'Select..'"
                @blur="CheckEmptyField(form.shift_id,'shift_id')"
              />
              <div class="flex flex-row flex-wrap justify-between">
                <div>Auto -assign job to the first matching Favourite applicant?</div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="auto_assign_at.date"
                    :name="'auto_assign_at'"
                    :label="'Date'"
                    @blur="CheckEmptyField(form.auto_assign_at,'auto_assign_at')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="auto_assign_at.time"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'Time'"
                  />
                </div>
              </div>

              <div class="flex flex-row flex-wrap justify-between">
                <div>Selection will be made and you will receive a notification by this date</div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="selection_date.date"
                    :name="'selection_date'"
                    :label="'Date'"
                    @blur="CheckEmptyField(form.selection_date,'selection_date')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="selection_date.time"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'Time'"
                  />
                </div>
              </div>

              <div class="flex flex-row flex-wrap justify-between">
                <div>Only favorite locum will be notified until this date</div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="favorite_only_until.date"
                    :name="'favorite_only_until'"
                    :label="'Date'"
                    @blur="CheckEmptyField(form.favorite_only_until,'favorite_only_until')"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="favorite_only_until.time"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'Time'"
                  />
                </div>
              </div>
            </div>
            <div class="mt-4">
              <AppButton :label="'Save and publish Job'" @click="publish" />
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
import AppSelect from "@/components/Base/AppSelect";
import AppTextarea from "@/components/Base/AppTextarea";
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
    AppSelect,
    AppTextarea,
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
      gp_qualification_lists: [],
      other_qualification_lists: [],
      clinical_system_lists: [],
      spoken_language_lists: [],
      gp_compliance_documents_lists: [],
      others_compliance_documents_lists: [],

      professions_categories: [],
      selectedProfession: {
        profession_category: {}
      },
      qualifications: [],
      compliances: [],
      unpaid_breaks: "",
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
  watch: {
    "form.profession_id"(value) {
      this.CheckEmptyField(value, "profession_id");
      if (value) {
        this.selectedProfession = this.professions_categories.find(
          item => item.id == value
        );
        if (this.selectedProfession.profession_category.id == 1) {
          this.qualifications = this.gp_qualification_lists;
          this.compliances = this.gp_compliance_documents_lists;
          return;
        }
        if (this.selectedProfession.profession_category.id == 2) {
          this.qualifications = this.other_qualification_lists;
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

    "form.spoken_language_id"(value) {
      this.CheckEmptyField(value, "spoken_language_id");
    },

    "form.compliance_document_id"(value) {
      this.CheckEmptyField(value, "compliance_document_id");
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
    this.$axios.$get(`/api/v1/clinical-systems`).then(res => {
      this.clinical_system_lists = [];
      res.data.clinical_systems.forEach(item => {
        this.clinical_system_lists.push({ label: item.name, value: item.id });
      });
    });
    this.$axios.$get(`/api/v1/spoken-languages`).then(res => {
      this.spoken_language_lists = [];
      res.data.spoken_languages.forEach(item => {
        this.spoken_language_lists.push({ label: item.name, value: item.id });
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

      this.Validate(this.form, [
        "extra_information",
        "is_another_doctor",
        "is_nurse_available",
        "duration_for_each_appointment",
        "opportunity_for_catch_up_slots",
        "session_requirements",
        "spoken_language_id",
        "ir35",
        "unpaid_breaks_in_minutes",
        "mandatory_training_id",
        "include_saturday",
        "include_sunday",
        "auto_assign_at",
        "selection_date",
        "favorite_only_until"
      ]);

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
        this.form.date_start = this.$moment(this.form.date_start).format(
          "YYYY-MM-DD"
        );
        this.form.date_end = this.$moment(this.form.date_end).format(
          "YYYY-MM-DD"
        );

        this.form.auto_assign_at = `${this.$moment(
          this.auto_assign_at.date
        ).format("YYYY-MM-DD")} ${this.auto_assign_at.time}`;
        this.form.selection_date = `${this.$moment(
          this.selection_date.date
        ).format("YYYY-MM-DD")} ${this.selection_date.time}`;
        this.form.favorite_only_until = `${this.$moment(
          this.favorite_only_until.date
        ).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`;

        this.form.session_requirements.length > 0
          ? (this.form.session_requirements = this.form.session_requirements.join())
          : (this.form.session_requirements = "");
        this.unpaid_breaks !== "other"
          ? (this.form.unpaid_breaks_in_minutes = this.unpaid_breaks)
          : (this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes);

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
            this.clinical_system_lists.forEach((clinicalSystem, index) => {
              if (this.form.clinical_system_id.includes(clinicalSystem.value)) {
                this.form.clinical_system_id.splice(index, 1, clinicalSystem);
              }
            });
            this.qualifications.forEach((qualification, index) => {
              if (this.form.qualification_id.includes(qualification.value)) {
                this.form.qualification_id.splice(index, 1, qualification);
              }
            });
            this.spoken_language_lists.forEach((spokenLanguage, index) => {
              if (this.form.spoken_language_id.includes(spokenLanguage.value)) {
                this.form.spoken_language_id.splice(index, 1, spokenLanguage);
              }
            });
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