<template>
  <transition name="slide" mode="out-in">
    <div class="wrapper p-4 md:p-8" ref="modalContainer">
      <div>
        <svgicon name="left-arrow" height="32" width="32" @click="close" class="cursor-pointer" />
      </div>
      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">Create a new job</div>
      <!-- <AppFormError :formError="formError" v-if="formError.length" /> -->

      <div class="flex flex-row flex-wrap justify-start mt-8">
        <div class="w-full md:w-1/2 md:pr-4 mb-4">
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
                :type="'number'"
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

              <div class="flex flex-row flex-wrap justify-start items-center mt-4 max-w-2xl">
                <div class="px-1 w-full">
                  <AppInput
                    v-model="form.rate"
                    :type="'number'"
                    :name="'rate'"
                    :label="'Rate £'"
                    :error="formError.find(item => item.field === 'rate')"
                    @blur="CheckEmptyField(form.rate,'rate')"
                    :inStyle="'text-align:right'"
                  />
                </div>
                <div class="px-1 w-full">
                  <AppInput
                    v-model="form.locum_detail_rate_type_id"
                    :type="'select'"
                    :name="'locum_detail_rate_type_id'"
                    :label="'per'"
                    :items="rate_lists"
                  />
                </div>
              </div>
              <div class="flex flex-col py-2 mb-3 md:mb-6">
                <div class="relative flex flex-row flex-no-wrap justify-between">
                  <label for="total_hours" class="text-xs sm:text-sm py-1 mt-2">Total hours</label>
                </div>
                <div class="flex flex-row flex-no-wrap justify-start mt-1">
                  <div class="flex flex-col">
                    <input
                      v-model="form.total_hours"
                      type="number"
                      class="border-b-2 focus:border-yellow-400 focus:outline-none font-bold py-2 text-xs sm:text-sm mx-1"
                      :class="this.formError.find(item => item.field === 'total_hours')? 'border-red-500':''"
                      @blur="CheckEmptyField(form.total_hours,'total_hours')"
                      style="text-align:right;'"
                      :error="formError.find(item => item.field === 'total_hours')"
                    />
                    <div
                      class="text-red-500 p-1 text-xs"
                      v-if="this.formError.find(item => item.field === 'total_hours')"
                    >{{this.formError.find(item => item.field === 'total_hours').message.charAt(0).toUpperCase() + this.formError.find(item => item.field === 'total_hours').message.slice(1).replace(/_/g, " ")}}</div>
                  </div>
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
              <div
                class="mb-6 text-center md:text-left"
                v-if="mandatory_training_lists.length === 0"
              >
                <AppButton :label="'Go to Profile to add items here'" @click="addMandatory" />
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
                  :professionCategoryId="selectedProfession.profession_category.id.toString()"
                />

                <AppFilterSearch
                  v-model="form.clinical_system_id"
                  :name="'clinical_system_id'"
                  :label="'Clinical systems'"
                  :placeholder="'Select...'"
                  :error="formError.find(item => item.field === 'clinical_system_id')"
                  :info="'Choose at least one IT system'"
                  :url="'/api/v1/clinical-systems'"
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
                    isAfter
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
                    isAfter
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
                :label="'Use AUTO-MATCH on this Job?'"
                :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
              />

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
                  <AppDate
                    v-model="selection_date.date"
                    :name="'selection_date'"
                    :label="'Date'"
                    isAfter
                  />
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
                v-if="bank_only === 'false' || bank_only === false"
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
                    isAfter
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

              <AppInput
                v-if="bank_first === 'false' || bank_first === false"
                :type="'select'"
                v-model="bank_only"
                :name="'bank_only'"
                :label="'Make this Job available for Bank Only?'"
                :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
              />
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

      <AppLoading :loading="loading" spinner />
    </div>
  </transition>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppTime from "@/components/Base/AppTime";
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
const session_requirements_lists = [
  { label: "Practice admin", value: "Practice admin" },
  { label: "Telephone triage", value: "Telephone triage" },
  { label: "Home visits", value: "Home visits" }
];
export default {
  components: {
    AppInput,
    AppFilterSearch,
    AppDate,
    AppButton,
    AppTime,
    AppFormError,
    AppLoading
  },
  data() {
    return {
      loading: false,

      show_saturday: false,
      show_sunday: false,

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
      bank_first: false,
      bank_only: false,
      shifts: [],

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
    },
    repostJob() {
      return this.$store.state.calendar.repost_job;
    }
  },
  watch: {
    "$auth.user"(value) {
      console.log("watch auth user");
    },
    "form.profession_id"(newValue, oldValue) {
      this.CheckEmptyField(newValue, "profession_id");
      if (newValue && oldValue) {
        this.form.qualification_id = [];
      }
      if (newValue) {
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
    "form.date_end"(value) {
      let end = this.$moment(value, "YYYY-MM-DD");
      let days = [];
      let day = this.$moment(this.form.date_start, "YYYY-MM-DD");
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
    }
  },
  created() {
    this.loading = true;
    Promise.all([
      this.$axios.$get("/api/v1/practice/me/practice-practices"),
      this.$axios.$get("/api/v1/locum-detail-rate-types"),
      this.$axios.$get("/api/v1/shifts"),
      this.$axios.$get("/api/v1/professions"),
      this.$axios.$get("/api/v1/me")
    ])
      .then(
        ([
          responsePracticeLists,
          responseRateLists,
          responseShifts,
          responseProfessions,
          responseMe
        ]) => {
          this.practice_lists = [];
          responsePracticeLists.data.practices.forEach(item => {
            this.practice_lists.push({
              label: item.surgery.name,
              value: item.id
            });
          });
          this.rate_lists = [];
          responseRateLists.data.locum_detail_rate_types.forEach(item => {
            this.rate_lists.push({ label: item.name, value: item.id });
          });
          this.shifts = [];
          responseShifts.data.shifts.forEach(item => {
            this.shifts.push({ label: item.name, value: item.id });
          });
          this.professions = [];
          responseProfessions.data.professions.forEach(item => {
            this.professions.push({ label: item.name, value: item.id });
            this.professions_categories.push(item);
          });
          this.form.report_to =
            responseMe.data.user.practice_detail.practice.report_to;
          this.form.email = responseMe.data.user.practice_detail.practice.email;
          responseMe.data.user.practice_detail.practice.mandatory_trainings.forEach(
            item => {
              this.mandatory_training_lists.push({
                label: item.name,
                value: item.id
              });
            }
          );
          responseMe.data.user.practice_detail.practice.gp_compliance_documents.forEach(
            item => {
              this.gp_compliance_documents_lists.push({
                label: item.name,
                value: item.id
              });
            }
          );
          responseMe.data.user.practice_detail.practice.others_compliance_documents.forEach(
            item => {
              this.others_compliance_documents_lists.push({
                label: item.name,
                value: item.id
              });
            }
          );

          if (this.repostJob) {
            this.form.practice_id = this.repostJob.platform_job.practice.id;
            this.form.title = this.repostJob.title;
            this.form.description = this.repostJob.description;
            this.form.email = this.repostJob.platform_job.email;
            this.form.report_to = this.repostJob.platform_job.report_to;

            this.form.is_another_doctor = this.repostJob.platform_job.is_another_doctor;
            this.form.is_nurse_available = this.repostJob.platform_job.is_nurse_available;
            this.form.number_of_patients = this.repostJob.platform_job.number_of_patients;
            this.form.duration_for_each_appointment = this.repostJob.platform_job.duration_for_each_appointment;
            this.form.opportunity_for_catch_up_slots = this.repostJob.platform_job.opportunity_for_catch_up_slots;
            if (this.repostJob.platform_job.session_requirements === "") {
              this.form.session_requirements = [];
            } else {
              this.form.session_requirements = this.repostJob.platform_job.session_requirements.split(
                ","
              );
            }
            this.form.session_structure_information = this.repostJob.platform_job.session_structure_information;
            this.form.extra_information = this.repostJob.platform_job.extra_information;

            this.form.rate = this.repostJob.rate;
            this.form.total_hours = this.repostJob.total_hours;
            this.form.locum_detail_rate_type_id = this.repostJob.locum_detail_rate_type.id;
            this.form.ir35 = this.repostJob.platform_job.ir35;

            this.form.mandatory_training_id = this.repostJob.platform_job.mandatory_trainings.map(
              item => item.id
            );
            this.form.profession_id = this.repostJob.platform_job.profession.id;

            this.repostJob.platform_job.qualifications.forEach(
              qualification => {
                this.form.qualification_id.push({
                  label: qualification.name,
                  value: qualification.id
                });
              }
            );
            this.repostJob.platform_job.clinical_systems.forEach(
              clinicalSystem => {
                this.form.clinical_system_id.push({
                  label: clinicalSystem.name,
                  value: clinicalSystem.id
                });
              }
            );
            this.repostJob.platform_job.spoken_languages.forEach(
              spokenLanguage => {
                this.form.spoken_language_id.push({
                  label: spokenLanguage.name,
                  value: spokenLanguage.id
                });
              }
            );
            this.form.compliance_document_id = this.repostJob.platform_job.compliance_documents.map(
              item => item.id
            );

            this.form.date_start = this.repostJob.date_start;
            this.form.time_start = this.repostJob.time_start;
            this.form.date_end = this.repostJob.date_end;
            this.form.time_end = this.repostJob.time_end;

            this.form.include_saturday = this.repostJob.include_saturday;
            this.form.include_sunday = this.repostJob.include_sunday;

            if (this.repostJob.platform_job.unpaid_breaks_in_minutes === 0) {
              this.unpaid_breaks = false;
            } else if (
              ![15, 30, 60].includes(
                this.repostJob.platform_job.unpaid_breaks_in_minutes
              )
            ) {
              this.unpaid_breaks = "other";
              this.form.unpaid_breaks_in_minutes = this.repostJob.platform_job.unpaid_breaks_in_minutes;
            } else {
              this.unpaid_breaks = this.repostJob.platform_job.unpaid_breaks_in_minutes;
            }

            this.form.shift_id = this.repostJob.shift.id;

            this.form.auto_assign_at = this.repostJob.platform_job.auto_assign_at;
            if (this.form.auto_assign_at) {
              this.auto_assign_job = true;
            }

            if (this.repostJob.platform_job.selection_date) {
              this.selection_date.date = this.$moment(
                this.repostJob.platform_job.selection_date
              ).format("YYYY-MM-DD");
              this.selection_date.time = this.$moment(
                this.repostJob.platform_job.selection_date
              ).format("HH:mm");
            }

            if (
              this.$moment(this.repostJob.date_start, "YYYY-MM-DD").diff(
                this.repostJob.platform_job.favorite_only_until,
                "seconds"
              ) > 0
            ) {
              this.bank_first = true;
              this.favorite_only_until.date = this.$moment(
                this.repostJob.platform_job.favorite_only_until,
                "YYYY-MM-DDTHH:mm:ss:sssZ"
              ).format("YYYY-MM-DD");
              this.favorite_only_until.time = this.$moment(
                this.repostJob.platform_job.favorite_only_until,
                "YYYY-MM-DDTHH:mm:ss:sssZ"
              ).format("HH:mm");
            } else if (
              this.$moment(this.repostJob.date_start, "YYYY-MM-DD").diff(
                this.repostJob.platform_job.favorite_only_until,
                "seconds"
              ) <= 0
            ) {
              this.bank_only = true;
            }
          }
        }
      )
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    close() {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);
      this.$store.commit("calendar/CLEAR_REPOST_JOB");
      this.$emit("close");
    },
    addMandatory() {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false);
      this.$store.commit("calendar/CLEAR_REPOST_JOB");
      this.$router.push("/profile");
    },
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      );
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
        "compliance_document_id",
        "auto_assign_at"
      ];

      if (
        [15, "15", 30, "30", 60, "60", false, "false"].includes(
          this.unpaid_breaks
        )
      ) {
        notRequired.push("unpaid_breaks_in_minutes");
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

      if (this.bank_first == false || this.bank_first == "false") {
        notRequired.push("favorite_only_until");
      } else {
        if (this.bank_first === true || this.bank_first === "true") {
          if (this.favorite_only_until.date && this.favorite_only_until.time) {
            notRequired.push("favorite_only_until");
          }
        }
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

        this.form.session_requirements.length > 0
          ? (this.form.session_requirements = this.form.session_requirements.join())
          : (this.form.session_requirements = "");

        this.form.auto_assign_at =
          this.auto_assign_job === true || this.auto_assign_job === "true"
            ? "1970-01-01 00:00"
            : null;

        this.form.selection_date =
          this.selection_notification === true ||
          this.selection_notification === "true"
            ? `${this.$moment(this.selection_date.date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              )} ${this.selection_date.time}`
            : null;

        if (this.bank_first === true || this.bank_first === "true") {
          this.form.favorite_only_until = `${this.$moment(
            this.favorite_only_until.date,
            "YYYY-MM-DD"
          ).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`;
        }

        if (this.bank_only === true || this.bank_only === "true") {
          this.form.favorite_only_until = `${this.$moment(
            this.form.date_start,
            "YYYY-MM-DD"
          )
            .format("YYYY-MM-DD")
            .add(1, "days")}`;
        }

        if (["15", 15, "30", 30, "60", 60].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = this.unpaid_breaks;
        }
        if (this.unpaid_breaks === "other") {
          this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes;
        }
        this.$axios
          .$post(`/api/v1/practice/jobs`, this.form)
          .then(res => {
            // if in /sessions, push to store
            if (this.$route.path.includes("/sessions")) {
              this.$store.commit(
                "jobs/ADD_PRACTICE_AVAILABLE_JOB",
                res.data.job
              );
            }
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
          this.$refs.modalContainer.scrollTop = 0;
        });
      }
    }
  }
};
</script>

<style>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  scroll-behavior: smooth;
}
</style>