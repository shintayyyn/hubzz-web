<template>
  <div class="flex flex-col w-full">
    <AppFormError :formError="formError" v-if="formError.length > 0" />
    <div class="rounded-lg shadow-lg p-4 md:p-8 mt-4">
      <div class="flex flex-row flex-wrap">
        <div class="flex flex-col w-full md:w-1/2 p-0 md:pr-4">
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
            <div class="w-full md:w-1/2 p-1">
              <AppInput
                v-model="form.rate"
                :type="'text'"
                :name="'rate'"
                :label="'Rate £'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'rate')"
              />
            </div>
            <div class="w-full md:w-1/2 p-1">
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
            :type="'text'"
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
            v-model="form.update_remarks"
            :type="'textarea'"
            :name="'update_remarks'"
            :label="'Update Remarks'"
            :error="formError.find(item => item.field === 'update_remarks')"
            :resize="false"
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
            :label="'Gender'"
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

          <!-- <AppDate
            v-model="form.auto_assign_at"
            :name="'auto_assign_at'"
            :label="'Auto-assigns this job to the first, matching Favourite applicant'"
          />-->
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

          <!-- <AppDate
            v-model="form.selection_date"
            :name="'selection_date'"
            :label="'Selection will be made and you will receive a notification by this date'"
          />-->
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

          <!-- <AppDate
            v-model="form.favorite_only_until"
            :name="'favorite_only_until'"
            :label="'Only Favorite locums can apply until'"
          />-->
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
            :professionCategoryId="form.profession_id.toString()"
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
        <AppButton :label="'Save changes'" :inStyle="'padding:8px'" @click="save" />
      </div>
      <div class="flex flex-col">
        <div class="font-bold text-xs sm:text-sm">Practice</div>
        <div class="font-bold text-sm sm:text-md">{{job.platform_job.practice.surgery.name}}</div>
        <div
          class="text-sm sm:text-md"
        >{{job.platform_job.practice.surgery.address.line_1}} {{job.platform_job.practice.surgery.address.line_2}} {{job.platform_job.practice.surgery.address.line_3}} {{job.platform_job.practice.surgery.address.post_code}}</div>
        <div class="mt-4">
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
import { gmapApi } from "vue2-google-maps";
import { mixin as clickaway } from "vue-clickaway";
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppTime from "@/components/Base/AppTime";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppFormError from "@/components/Base/AppFormError";
const session_requirements_lists = [
  { label: "Practice admin", value: "Practice admin" },
  { label: "Telephone triage", value: "Telephone triage" },
  { label: "Home visits", value: "Home visits" }
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
    AppFormError
  },
  data() {
    return {
      professionCategoryId: "",

      practice_lists: [],
      rate_lists: [],
      mandatory_training: [],
      professions: [],
      session_requirements_lists,
      mandatory_training_lists: [],

      // gp_qualification_lists: [],
      // other_qualification_lists: [],
      // clinical_system_lists: [],
      // spoken_language_lists: [],

      gp_compliance_documents_lists: [],
      others_compliance_documents_lists: [],

      professions_categories: [],
      selectedProfession: {
        profession_category: {}
      },
      // qualifications: [],
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
      formError: [],
      show_saturday: false,
      show_sunday: false
    };
  },
  watch: {
    "form.profession_id"(value) {
      if (value && this.professions_categories.length > 0) {
        this.selectedProfession = this.professions_categories.find(
          item => item.id == value
        );
        // this.form.qualification_id = [];
        // this.form.clinical_system_id = [];
        // this.form.spoken_language_id = [];
        // this.form.compliance_document_id = [];
        // this.professionCategoryId = this.selectedProfession.profession_category.id;
        if (this.selectedProfession.profession_category.id == 1) {
          // this.qualifications = this.gp_qualification_lists;
          this.compliances = this.gp_compliance_documents_lists;
          return;
        }
        if (this.selectedProfession.profession_category.id == 2) {
          // this.qualifications = this.other_qualification_lists;
          this.compliances = this.others_compliance_documents_lists;
          return;
        }
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
      if (days.includes(6)) {
        this.show_saturday = true;
      } else if (days.includes(7)) {
        this.show_sunday = true;
      } else {
        this.show_saturday = false;
        this.show_sunday = false;
      }
    }
  },
  computed: {
    authPermissions() {
      return this.$store.getters["auth/permissions"];
    },
    google: gmapApi,
    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates;
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
    // this.$axios.$get(`/api/v1/profession-categories`).then(res => {
    //   this.gp_qualification_lists = [];
    //   res.data.profession_categories
    //     .find(item => item.id === 1)
    //     .qualifications.forEach(item => {
    //       this.gp_qualification_lists.push({
    //         label: item.name,
    //         value: item.id
    //       });
    //     });
    //   this.other_qualification_lists = [];
    //   res.data.profession_categories
    //     .find(item => item.id === 2)
    //     .qualifications.forEach(item => {
    //       this.other_qualification_lists.push({
    //         label: item.name,
    //         value: item.id
    //       });
    //     });
    // });
    this.$axios.$get(`/api/v1/professions`).then(res => {
      this.professions = [];
      res.data.professions.forEach(item => {
        this.professions.push({ label: item.name, value: item.id });
        this.professions_categories.push(item);
      });
      // this.selectedProfession = this.professions_categories.find(
      //   item => item.id == this.form.profession_id
      // );

      // this.professionCategoryId = this.selectedProfession.profession_category.id;

      // if (this.selectedProfession.profession_category.id == 1) {
      //   this.qualifications = this.gp_qualification_lists;
      //   this.compliances = this.gp_compliance_documents_lists;
      //   return;
      // }
      // if (this.selectedProfession.profession_category.id == 2) {
      //   this.qualifications = this.other_qualification_lists;
      //   this.compliances = this.others_compliance_documents_lists;
      //   return;
      // }
    });

    // this.$axios.$get(`/api/v1/clinical-systems`).then(res => {
    //   this.clinical_system_lists = [];
    //   res.data.clinical_systems.forEach(item => {
    //     this.clinical_system_lists.push({ label: item.name, value: item.id });
    //   });
    // });
    // this.$axios.$get(`/api/v1/spoken-languages`).then(res => {
    //   this.spoken_language_lists = [];
    //   res.data.spoken_languages.forEach(item => {
    //     this.spoken_language_lists.push({ label: item.name, value: item.id });
    //   });
    // });
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
    this.form.phone_number = this.job.platform_job.phone_number;
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

    if (
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

    if (this.job.platform_job.auto_assign_at) {
      this.auto_assign_at.date = this.$moment(
        this.job.platform_job.auto_assign_at
      ).format("YYYY-MM-DD");
      this.auto_assign_at.time = this.$moment(
        this.job.platform_job.auto_assign_at
      ).format("HH:mm");
    }

    if (this.job.platform_job.selection_date) {
      this.selection_date.date = this.$moment(
        this.job.platform_job.selection_date
      ).format("YYYY-MM-DD");
      this.selection_date.time = this.$moment(
        this.job.platform_job.selection_date
      ).format("HH:mm");
    }

    if (this.job.platform_job.favorite_only_until) {
      this.favorite_only_until.date = this.$moment(
        this.job.platform_job.favorite_only_until
      ).format("YYYY-MM-DD");
      this.favorite_only_until.time = this.$moment(
        this.job.platform_job.favorite_only_until
      ).format("HH:mm");
    }

    this.form.update_remarks = this.job.update_remarks;

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
    console.log("prop job", this.job);
    console.log("update form", this.form);
  },
  methods: {
    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      );
    },
    save() {
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
      console.log("form", this.form);
      this.Validate(this.form, notRequired);
      console.log("formError", this.formError.map(err => err.field));
      if (this.formError.length == 0) {
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

        this.form.session_requirements.length > 0
          ? (this.form.session_requirements = this.form.session_requirements.join())
          : (this.form.session_requirements = "");

        if (["15", "30", "60"].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = this.unpaid_breaks;
        }
        if (this.unpaid_breaks === "other") {
          this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes;
        }

        this.$axios
          .$put(`/api/v1/practice/jobs/${this.job.id}`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [res.message]
            });
            this.$emit("close");
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

