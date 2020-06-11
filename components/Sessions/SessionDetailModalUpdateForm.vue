<template>
  <div class="flex flex-col w-full">
    <AppFormError v-if="formError.length > 0" :formError="formError" />
    <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 mt-4">
      <AppLoading :loading="dataLoading" spinner />
      <div v-if="!dataLoading" class="flex flex-row flex-wrap">
        <div class="flex flex-col w-full lg:w-1/2 p-0 md:pr-4">
          <div class="font-bold text-sm sm:text-md">Job number</div>
          <div class="text-xs sm:text-sm mb-4">{{ job.job_number }}</div>
          <AppInput
            v-model="form.practice_id"
            :type="'select'"
            :name="'practice_id'"
            :label="'Practice'"
            :error="formError.find(item => item.field === 'practice_id')"
            :placeholder="'Select...'"
            :items="practice_lists"
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
            v-model="form.is_another_doctor"
            :type="'select'"
            :name="'is_another_doctor'"
            :label="'Is there another Dr on site?'"
            :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            :error="formError.find(item => item.field === 'is_another_doctor')"
          />
          <AppInput
            v-model="form.is_nurse_available"
            :type="'select'"
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
            v-model="form.opportunity_for_catch_up_slots"
            :type="'select'"
            :name="'opportunity_for_catch_up_slots'"
            :label="'Opportunity for catch up slots?'"
            :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
            :error="formError.find(item => item.field === 'opportunity_for_catch_up_slots')"
          />
          <AppInput
            v-model="form.session_requirements"
            :type="'multi-checkbox'"
            :name="'session_requirements'"
            :label="'Session requirements'"
            :lists="session_requirements_lists"
            :error="formError.find(item => item.field === 'session_requirements')"
            @checked="form.session_requirements.push($event)"
            @unchecked="form.session_requirements.splice(form.session_requirements.findIndex(item => item === $event), 1)"
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
            v-model="selectedUpdateRemarksValue"
            :type="'select'"
            :name="'selectedUpdateRemarksValue'"
            :label="'Choose one reason for session amendment?'"
            :items="updateRemarksOptions"
          />
          <AppInput
            v-if="!selectedUpdateRemarksValue"
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
              :items="setDeadlines"
            />
          </template>
        </div>
        <div class="flex flex-col w-full lg:w-1/2 p-0 md:pl-4">
          <div class="font-bold text-sm sm:text-md">Duration</div>
          <!-- <div class="px-1 w-full">
            <AppMultipleDates
              v-model="form.dates"
              :name="'dates'"
              :label="'Job Dates'"
              :error="formError.find(item => item.field === 'dates')"
              is-after
              multipleSelection
              @blur="CheckEmptyField(form.date_start,'date_start')"
            />
          </div>-->
          <p>{{ this.$moment(form.dates[0]).format('DD/MM/YYYY') }} - {{ this.$moment(form.dates[form.dates.length-1]).format('DD/MM/YYYY') }}</p>
          <p class="mb-2">{{ form.dates.length }} Day{{ form.dates.length > 1 ? 's' : ''}}</p>
          <div class="flex">
            <AppButton
              :label="'Edit Schedule'"
              :inStyle="'padding:8px 16px; font-size: 14px;'"
              @click="editSchedule=true"
            />
          </div>
          <p
            class="mt-2 text-red-500 flex items-center text-sm"
            v-if="formError.find(item => item.field === 'schedules')"
          >
            <span class="mr-2">
              <svgicon name="exclamation-mark" class="w-4 h-4 class fill-current" />
            </span>
            {{ formError.find(item => item.field === 'schedules').message }}
          </p>
          <div class="shield" style="z-index: 70;" v-if="toSaveSched"></div>
          <div
            class="message-modal job-notification-wrapper fixed z-50 bg-white p-4 rounded font-bold text-gray-700"
            v-if="toSaveSched"
          >
            <p
              class="text-center pb-2 mb-4 border-b-2 border-gray-600 text-lg font-bold"
            >JOB NOTIFICATION SUMMARY</p>
            <div class="px-4">
              <div class="flex justify-between pb-2">
                <p>Total Working Hours:</p>
                <p>{{ total_working_hours | hoursMinutes}}</p>
              </div>
              <div class="flex justify-between pb-2">
                <p>Total Gross Locum Wages:</p>
                <p>£ {{ total_gross_locum_wages | currency }}</p>
              </div>
              <div class="flex justify-between pb-2">
                <p>
                  Hubzz Fee*
                  <span
                    class="font-normal text-sm"
                  >(£{{ practice_rate.toFixed(2) }} per hour)</span>:
                </p>
                <p>£ {{ hubzz_fee | currency }}</p>
              </div>
            </div>
            <div class="flex justify-end items-center text-black mt-3">
              <AppButton
                :label="'Cancel'"
                class="mr-1"
                :disabled="loading"
                @click="toSaveSched=false"
              />
              <AppButton :label="'Confirm & Save'" :disabled="loading" @click="saveSchedule" />
            </div>
          </div>
          <div class="shield" v-if="editSchedule"></div>
          <transition name="fade">
            <div
              v-if="editSchedule"
              class="message-modal schedule-wrapper fixed z-40 bg-white px-8 py-4 rounded"
            >
              <p>Edit Schedule</p>
              <AppSchedules
                :shifts="shifts"
                :rate_lists="rate_lists"
                @getSchedule="getSchedule"
                :schedule="editedSchedule"
                :error="formError.find(err => err.field === 'schedules')"
                :shiftErrors="shiftErrors"
              />
              <div class="flex justify-end">
                <AppButton
                  :label="'Save'"
                  class="mr-2"
                  @click="canSaveSched"
                  :disabled="!form.schedules.length"
                />
                <AppButton :label="'Close'" @click="editSchedule=false" />
              </div>
            </div>
          </transition>
          <!-- <AppSchedule
						:rate_lists="rate_lists"
						:shifts="shifts"
						:formError="formError"
						:scheduleTemplates="job && job.schedule_templates ? job.schedule_templates : []"
						:jobSchedule="job && job.schedules ? job.schedules : []"
						@scheduleTemplates="getScheduleTemplates"
						@initialSchedule="getInitialSchedule"
          />-->
          <!-- <div class="flex flex-row flex-wrap justify-between">
            <div class="px-1 w-full md:w-1/2">
              <AppDate
                v-model="form.date_start"
                :name="'date_start'"
                :label="'Start Date'"
                :error="formError.find(item => item.field === 'date_start')"
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
              />
            </div>
            <div class="px-1 w-full md:w-1/2">
              <AppDate
                v-model="form.date_end"
                :name="'date_end'"
                :label="'End Date'"
                :error="formError.find(item => item.field === 'date_end')"
                :startDate="form.date_start"
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
              />
            </div>
            <div class="w-full">
              <AppInput
                v-if="show_saturday"
                v-model="form.include_saturday"
                :type="'select'"
                :name="'include_saturday'"
                :label="'Include Saturday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
              <AppInput
                v-if="show_sunday"
                v-model="form.include_sunday"
                :type="'select'"
                :name="'include_sunday'"
                :label="'Include Sunday'"
                :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
              />
            </div>
          </div>-->
          <!--<AppInput
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
          />-->

          <AppInput
            v-model="auto_assign_job"
            :type="'select'"
            :name="'auto_assign_job'"
            :label="'Use AUTO-MATCH on this Job?'"
            :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
            :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
            :disabled="job.status === 'Allocated'"
          />

          <template v-if="['false', false].includes(auto_assign_job)">
            <AppInput
              v-model="selection_notification"
              :type="'select'"
              :name="'selection_notification'"
              :label="'Add a selection date?'"
              :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
              :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
              :disabled="job.status === 'Allocated'"
            />
            <div
              v-if="selection_notification === true || selection_notification === 'true'"
              class="flex flex-row flex-wrap justify-between"
            >
              <div>Selection will be made and you will receive a notification by this date</div>
              <div class="px-1 w-full md:w-1/2">
                <AppDate
                  v-model="selection_date.date"
                  :name="'selection_date'"
                  :label="'Date'"
                  :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
                  :disabled="job.status === 'Allocated'"
                />
              </div>
              <div class="px-1 w-full md:w-1/2">
                <AppTime
                  v-model="selection_date.time"
                  :type="'time'"
                  :name="'time_end'"
                  :label="'Time'"
                  :error="formError.find(item => item.field === 'selection_date')"
                  :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
                  :disabled="job.status === 'Allocated'"
                />
              </div>
            </div>
          </template>

          <template v-if="hasBanks">
            <AppInput
              v-model="form.favorite_only"
              :type="'select'"
              :name="'favorite_only'"
              :label="'Make this Job available for Bank Only?'"
              :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
              :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
              :disabled="job.status === 'Allocated'"
            />
            <template v-if="['false', false].includes(form.favorite_only)">
              <AppInput
                v-model="bank_first"
                :type="'select'"
                :name="'bank_first'"
                :label="'Make this Job available for Bank First?'"
                :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
                :disabled="job.status === 'Allocated'"
              />
              <div
                v-if="bank_first === true || bank_first === 'true'"
                class="flex flex-row flex-wrap justify-between"
              >
                <div>Only favorite locum will be notified until this date</div>
                <div class="px-1 w-full md:w-1/2">
                  <AppDate
                    v-model="favorite_only_until.date"
                    :name="'favorite_only_until'"
                    :label="'Date'"
                    :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
                    :disabled="job.status === 'Allocated'"
                  />
                </div>
                <div class="px-1 w-full md:w-1/2">
                  <AppTime
                    v-model="favorite_only_until.time"
                    :type="'time'"
                    :name="'time_end'"
                    :label="'Time'"
                    :error="formError.find(item => item.field === 'favorite_only_until')"
                    :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
                    :disabled="job.status === 'Allocated'"
                  />
                </div>
              </div>
            </template>
          </template>

          <template
            v-if="selectedProfession && selectedProfession.profession_category.name === 'GP'"
          >
            <AppInput
              v-model="form.ir35"
              :type="'select'"
              :name="'ir35'"
              :label="'IR35 - role inside or outside of scope'"
              :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
              :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
              :disabled="job.status === 'Allocated'"
            />
          </template>

          <AppInput
            v-model="form.profession_id"
            :type="'select'"
            :name="'profession_id'"
            :label="'Role'"
            :items="professions"
            :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
            :disabled="job.status === 'Allocated'"
          />

          <AppFilterSearch
            v-model="form.qualification_id"
            :name="'qualification_id'"
            :label="'Specialty'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'qualification_id')"
            :info="'Choose at least one qualification'"
            :url="'/api/v1/qualifications'"
            :professionCategoryId="selectedProfession && selectedProfession.profession_category
              ? selectedProfession.profession_category.id.toString()
              : null
            "
            :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
            :disabled="job.status === 'Allocated'"
            @add="CheckEmptyField(form.qualification_id, 'qualification_id')"
            @remove="CheckEmptyField(form.qualification_id, 'qualification_id')"
          />

          <AppFilterSearch
            v-model="form.clinical_system_id"
            :name="'clinical_system_id'"
            :label="'Clinical systems'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'clinical_system_id')"
            :info="'Choose at least one IT system'"
            :url="'/api/v1/clinical-systems'"
            :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
            :disabled="job.status === 'Allocated'"
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
            :inStyle="job.status === 'Allocated' ? 'background-color:lightgray' : ''"
            :disabled="job.status === 'Allocated'"
          />
          <template v-if="form.practice_id">
            <div class="font-bold text-sm sm:text-md">Compliance documents</div>
            <AppInput
              v-model="form.compliance_document_id"
              :type="'multi-checkbox'"
              :error="formError.find(item => item.field === 'compliance_document_id')"
              :name="'compliance_document_id'"
              :label="`${complianceListLabel}`"
              :lists="compliances"
              :info="'Check all that apply'"
              :disabled="job.status === 'Allocated'"
              @checked="job.status === 'Allocated' ? '' : form.compliance_document_id.push(parseInt($event))"
              @unchecked="job.status === 'Allocated' ? '' : form.compliance_document_id.splice(form.compliance_document_id.findIndex(item => item === parseInt($event)), 1)"
              @uncheckAll="job.status === 'Allocated' ? '' : form.compliance_document_id = []"
            />
          </template>

          <div v-if="compliances.length === 0" class="mb-6 text-center md:text-left mt-2">
            <AppButton :label="'Go to Profile to add items here'" @click="goToProfile" />
          </div>

          <template v-if="form.practice_id">
            <div class="font-bold text-sm sm:text-md">Mandatory trainings</div>
            <AppInput
              v-model="form.mandatory_training_id"
              :type="'multi-checkbox'"
              :name="'mandatory_training_id'"
              :label="'Mandatory training required for this job'"
              :placeholder="'Select..'"
              :lists="mandatory_training_lists"
              :info="'Check all that apply'"
              @checked="form.mandatory_training_id.push($event)"
              @unchecked="uncheckMandatory($event)"
              @uncheckAll="form.mandatory_training_id = []"
            />

            <div class="font-bold text-sm sm:text-md">Other Mandatory trainings</div>
            <AppInput
              v-model="form.other_mandatory_training_id"
              :type="'multi-checkbox'"
              :name="'other_mandatory_training_id'"
              :label="'Other Mandatory training required for this job'"
              :placeholder="'Select..'"
              :lists="other_mandatory_training_lists"
              :info="'Check all that apply'"
              @checked="form.other_mandatory_training_id.push(parseInt($event))"
              @unchecked="uncheckOtherMandatory($event)"
              @uncheckAll="form.other_mandatory_training_id = []"
            />
          </template>

          <div v-if="compliances.length === 0" class="mb-6 text-center md:text-left mt-2">
            <AppButton :label="'Go to Profile to add items here'" @click="goToProfile" />
          </div>
        </div>
      </div>
      <div v-if="!dataLoading" class="mb-8">
        <AppButton
          :label="'Save changes'"
          :inStyle="'padding:8px'"
          :disabled="loading"
          @click="validateUpdate"
        />
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
import AppMultipleDates from "@/components/Base/AppMultipleDates";
import AppLoading from "@/components/Base/AppLoading";
import AppSchedule from "@/components/Base/AppSchedule";
import AppSchedules from "@/components/Base/AppSchedules";

const session_requirements_lists = [
  { label: "Practice admin", value: "Practice admin" },
  { label: "Telephone triage", value: "Telephone triage" },
  { label: "Home visits", value: "Home visits" }
];

export default {
  components: {
    AppInput,
    AppDate,
    AppTime,
    AppButton,
    AppFilterSearch,
    AppFormError,
    AppConfirmationModal,
    AppMultipleDates,
    AppLoading,
    AppSchedule,
    AppSchedules
  },

  mixins: [clickaway],

  props: {
    job: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      banksCount: 0,
      loading: false,
      dataLoading: false,
      modal: false,

      professionCategoryId: "",

      practices: [],
      practice_lists: [],
      rate_lists: [],
      mandatory_training: [],
      professions: [],
      session_requirements_lists,
      mandatory_training_lists: [],
      other_mandatory_training_lists: [],

      professions_categories: [],

      practiceProfessionComplianceCategoryComplianceDocuments: [],

      unpaid_breaks: false,
      auto_assign_job: false,
      selection_notification: false,
      shifts: [],
      selectedUpdateRemarksValue: null,
      updateRemarksOptions: [
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
          value: null
        }
      ],
      bank_first: false,

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

      // split jobs
      editSchedule: false,
      editedSchedule: [],
      toSaveSched: false,
      hasShiftError: false,
      total_working_hours: 0,
      total_gross_locum_wages: 0,
      shiftErrors: [],
      schedules: [],

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
        // rate: "",
        // hours: "",
        // minutes: "",
        // total_hours: "",
        // locum_detail_rate_type_id: 1,
        ir35: false,
        mandatory_training_id: [],
        other_mandatory_training_id: [],
        profession_id: null,
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        compliance_document_id: [],
        // dates: [],
        // date_start: null,
        // date_end: null,
        // time_start: null,
        // time_end: null,
        // include_saturday: true,
        // include_sunday: true,
        // unpaid_breaks_in_minutes: "",
        // shift_id: "",
        schedules: [],
        auto_assign_at: null,
        selection_date: null,
        favorite_only: false,
        favorite_only_until: null,
        update_accepted_until: null
      },
      formError: [],
      show_saturday: false,
      show_sunday: false
    };
  },

  computed: {
    setDeadlines() {
      let inputArray = [];
      for (let i = 1; i <= 24; i++) {
        inputArray.push({
          label: i.toString(),
          value: i * 60
        });
      }
      return inputArray;
    },

    hasBanks() {
      return this.banksCount > 0 ? true : false;
    },

    authPermissions() {
      return this.$store.getters["permissions"];
    },

    complianceListLabel() {
      return this.selectedProfessionComplianceCategory
        ? `For ${this.selectedProfessionComplianceCategory.name}:`
        : "";
    },

    google: gmapApi,

    latLang() {
      return this.job.platform_job.practice.surgery.address.coordinates;
    },

    selectedProfession() {
      if (!this.form.profession_id) {
        return null;
      }

      const profession = this.professions_categories.find(
        profession =>
          profession.id.toString() === this.form.profession_id.toString()
      );

      if (!profession) {
        return null;
      }

      return profession;
    },

    selectedProfessionComplianceCategory() {
      if (!this.form.profession_id) {
        return null;
      }

      const profession = this.professions_categories.find(
        profession =>
          profession.id.toString() === this.form.profession_id.toString()
      );

      if (!profession) {
        return null;
      }

      const professionComplianceCategory = this.professionComplianceCategories.find(
        professionComplianceCategory =>
          professionComplianceCategory.id ===
          profession.profession_compliance_category_id
      );

      return professionComplianceCategory || null;
    },

    emptyComplianceDocumentId: {
      get() {
        return this.form.compliance_document_id.length === 0;
      },
      set(emptyComplianceDocumentId) {
        if (emptyComplianceDocumentId) {
          this.form.compliance_document_id = [];
        }
      }
    },

    compliances() {
      if (!this.form.profession_id) {
        return [];
      }

      const profession = this.professions_categories.find(
        profession =>
          profession.id.toString() === this.form.profession_id.toString()
      );

      if (!profession) {
        return [];
      }

      const complianceDocuments = this.professionComplianceCategories.reduce(
        (compliances, professionComplianceCategory) => {
          const {
            reference_compliance_documents: referenceComplianceDocuments,
            mandatory_compliance_documents: mandatoryComplianceDocuments,
            optional_compliance_documents: optionalComplianceDocuments
          } = professionComplianceCategory;

          if (
            professionComplianceCategory.id ===
            this.selectedProfessionComplianceCategory.id
          ) {
            [
              referenceComplianceDocuments,
              mandatoryComplianceDocuments,
              optionalComplianceDocuments
            ].forEach(complianceDocuments => {
              complianceDocuments.forEach(complianceDocument => {
                const {
                  id,
                  name,
                  compliance_document_type_name: complianceDocumentTypeName,
                  child_compliance_documents: childComplianceDocuments
                } = complianceDocument;

                if (complianceDocumentTypeName === "Safeguarding") {
                  childComplianceDocuments.forEach(childComplianceDocument => {
                    const { id, name } = childComplianceDocument;

                    compliances.push({
                      label: name,
                      value: id
                    });
                  });
                } else {
                  compliances.push({
                    label: name,
                    value: id
                  });
                }
              });
            });
          }

          return compliances;
        },
        []
      );

      const complianceDocumentIds = complianceDocuments.map(
        ({ value }) => value
      );

      return this.practiceProfessionComplianceCategoryComplianceDocuments
        .filter(practiceProfessionComplianceCategoryComplianceDocument => {
          const {
            compliance_document_id: complianceDocumentId,
            profession_compliance_category_id: professionComplianceCategoryId
          } = practiceProfessionComplianceCategoryComplianceDocument;

          return (
            professionComplianceCategoryId ===
              this.selectedProfessionComplianceCategory.id &&
            complianceDocumentIds.includes(complianceDocumentId)
          );
        })
        .map(practiceProfessionComplianceCategoryComplianceDocument => {
          const {
            compliance_document_id: complianceDocumentId,
            compliance_document_name: complianceDocumentName
          } = practiceProfessionComplianceCategoryComplianceDocument;

          return {
            label: complianceDocumentName,
            value: complianceDocumentId
          };
        });
    },

    practice_rate() {
      let rate = 0;
      let practice_rates = this.$auth.user.practice_detail.practice
        .practice_rates;
      let practice_rate = practice_rates.find(
        item => item.id.toString() === this.form.profession_id.toString()
      );
      if (practice_rate) {
        rate = practice_rate.rate;
      } else {
        rate = practice_rates[practice_rates.length - 1].rate;
      }
      return rate;
    },

    hubzz_fee() {
      if (this.form.profession_id) {
        let hours = this.total_working_hours / 60;
        return (hours * this.practice_rate).toFixed(2);
      }
      return 0;
    }
  },

  watch: {
    selectedUpdateRemarksValue() {
      this.form.update_remarks = this.selectedUpdateRemarksValue || "";
    },

    selectedProfessionComplianceCategory() {
      if (this.selectedProfessionComplianceCategory) {
        const defaultSelectedComplianceDocumentIds = this.practiceProfessionComplianceCategoryComplianceDocuments
          .filter(
            practiceProfessionComplianceCategoryComplianceDocument =>
              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id ===
              this.selectedProfessionComplianceCategory.id
          )
          .map(
            practiceProfessionComplianceCategoryComplianceDocument =>
              practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id
          );

        this.form.compliance_document_id = defaultSelectedComplianceDocumentIds;

        return;
      }

      this.form.compliance_document_id = [];
    },

    "form.profession_id"(newValue, oldValue) {
      if (newValue && oldValue) {
        this.form.qualification_id = [];
      }
    },
    editSchedule(value) {
      if (value === true) {
        this.editedSchedule = this.form.schedules;
      } else {
        this.editedSchedule = [];
      }
    },
    "form.practice_id"(newValue, oldValue) {
      if (oldValue && newValue) {
        this.form.mandatory_training_id = [];
        this.form.other_mandatory_training_id = [];
        this.form.compliance_document_id = [];
      }
      if (newValue) {
        let foundPractice = this.practices.find(
          practice => practice.id === parseInt(newValue)
        );
        this.mandatory_training_lists = foundPractice.mandatory_trainings.map(
          mandatoryTraining => ({
            label: mandatoryTraining.name,
            value: mandatoryTraining.id
          })
        );

        this.other_mandatory_training_lists = foundPractice.other_mandatory_trainings.map(
          otherMandatoryTraining => ({
            label: otherMandatoryTraining.name,
            value: otherMandatoryTraining.id
          })
        );

        this.practiceProfessionComplianceCategoryComplianceDocuments =
          foundPractice.practice_profession_compliance_category_compliance_documents;
      }
    }
  },

  created() {
    this.dataLoading = true;

    Promise.all([
      this.$axios.get("/api/v1/practice/me/practice-practices"),
      this.$axios.get("/api/v1/locum-detail-rate-types").then(response =>
        response.data.data.locum_detail_rate_types.map(rateType => ({
          label: rateType.name,
          value: rateType.id
        }))
      ),
      this.$axios.get("/api/v1/shifts").then(response =>
        response.data.data.shifts.map(shift => ({
          label: shift.name,
          value: shift.id
        }))
      ),
      this.$axios
        .get("/api/v1/professions")
        .then(response => response.data.data.professions),
      this.$axios
        .get("/api/v1/practice/me/practice-profile")
        .then(response => response.data.data.practice),
      this.$axios
        .get("/api/v1/profession-compliance-categories")
        .then(response => {
          return response.data.data.profession_compliance_categories;
        })
    ])
      .then(responses => {
        const [
          responsePractices,
          rateLists,
          shiftLists,
          professions,
          profileProfile,
          professionComplianceCategories
        ] = responses;
        this.form.dates = this.job.dates;
        this.practices = responsePractices.data.data.practices;
        this.practice_lists = responsePractices.data.data.practices.map(
          practice => ({
            label: practice.name,
            value: practice.id
          })
        );
        this.rate_lists = rateLists;
        this.shifts = shiftLists;
        this.professions = professions.map(profession => ({
          label: profession.name,
          value: profession.id
        }));
        this.professions_categories = professions;
        this.professionComplianceCategories = professionComplianceCategories;

        const {
          report_to: reportTo,
          email,
          extra_information: extraInformation
        } = profileProfile;

        this.form.report_to = reportTo;
        this.form.email = email;
        this.form.extra_information = extraInformation;

        if (this.job) {
          let foundPractice = this.practices.find(
            practice => practice.id === parseInt(this.job.practice_id)
          );

          this.practiceProfessionComplianceCategoryComplianceDocuments =
            foundPractice.practice_profession_compliance_category_compliance_documents;

          const selectedProfession = this.professions_categories.find(
            profession => profession.id === this.job.platform_job.profession.id
          );

          const selectedProfessionCategoryId =
            selectedProfession.profession_category.id;

          this.$axios
            .get(`/api/v1/practice/locums/count`, {
              params: {
                profession_category_id: selectedProfessionCategoryId,
                practice_locum_type: "Favorite"
              }
            })
            .then(response => {
              this.banksCount = response.data.data.count;
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
          // this.form.locum_detail_rate_type_id = this.job.locum_detail_rate_type.id;
          // this.form.rate = this.job.rate;
          // this.form.total_hours = this.job.total_hours;

          // this.form.hours = Math.floor(this.form.total_hours / 60);
          // this.form.minutes = Math.floor(this.form.total_hours % 60);

          this.form.schedules = this.job.schedules;

          if (this.job.platform_job.unpaid_breaks_in_minutes === 0) {
            this.unpaid_breaks = false;
          } else if (
            ![15, 30, 60].includes(
              this.job.platform_job.unpaid_breaks_in_minutes
            )
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

          this.form.other_mandatory_training_id = this.job.platform_job.other_mandatory_trainings.map(
            item => item.id
          );

          this.form.profession_id = this.job.platform_job.profession.id;

          const complianceDocumentIds = this.practiceProfessionComplianceCategoryComplianceDocuments
            .filter(
              practiceProfessionComplianceCategoryComplianceDocument =>
                practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id ===
                selectedProfessionCategoryId
            )
            .map(
              ({ compliance_document_id: complianceDocumentId }) =>
                complianceDocumentId
            );

          this.$nextTick(() => {
            this.form.compliance_document_id = this.job.platform_job.compliance_documents
              .map(complianceDocument => complianceDocument.id)
              .filter(complianceDocumentId =>
                complianceDocumentIds.includes(complianceDocumentId)
              );
          });

          // this.form.date_start = this.job.date_start
          // this.form.date_end = this.job.date_end
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

          if (this.job.favorite_only) {
            this.form.favorite_only = true;
          } else if (
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
          }

          this.selectedUpdateRemarksValue =
            this.updateRemarksOptions
              .map(updateRemarksOption => updateRemarksOption.value)
              .find(
                updateRemarksOptionValue =>
                  updateRemarksOptionValue === this.job.update_remarks
              ) || null;

          this.form.update_remarks = this.job.update_remarks;

          if (this.job.platform_job.session_requirements === "") {
            this.form.session_requirements = [];
          } else {
            this.form.session_requirements = this.job.platform_job
              .session_requirements
              ? this.job.platform_job.session_requirements.split(",")
              : [];
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
        }
      })
      .finally(() => {
        this.dataLoading = false;
      });
  },

  methods: {
    getSchedule(
      schedule,
      total_gross_locum_wages,
      total_working_hours,
      hasError
    ) {
      this.editedSchedule = [];
      this.schedules = schedule;
      schedule.forEach((sched, index) => {
        if (sched.shifts && sched.shifts.length) {
          let dateErrIndex = this.shiftErrors.findIndex(
            err => err.field === `shift-${sched.date}`
          );
          if (dateErrIndex > -1) {
            this.shiftErrors.splice(dateErrIndex, 1);
          }
          sched.shifts.forEach((shift, i) => {
            this.editedSchedule.push({
              date: this.$moment(sched.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
              shift_id: shift.shift_id,
              time_start: shift.time_start,
              time_end: shift.time_end,
              locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
              rate: shift.rate
            });
            if (shift.time_start) {
              let startIndex = this.shiftErrors.findIndex(
                err => err.field === `time_start-s${index}-${i}`
              );
              if (startIndex > -1) {
                this.shiftErrors.splice(startIndex, 1);
              }
            }
            if (shift.time_end) {
              let endIndex = this.shiftErrors.findIndex(
                err => err.field === `time_end-s${index}-${i}`
              );
              if (endIndex > -1) {
                this.shiftErrors.splice(endIndex, 1);
              }
            }
            if (
              shift.locum_detail_rate_type_id !== 0 &&
              shift.locum_detail_rate_type_id !== ""
            ) {
              let rateTypeIndex = this.shiftErrors.findIndex(
                err => err.field === `locum_detail_rate_type_id-s${index}-${i}`
              );
              if (rateTypeIndex > -1) {
                this.shiftErrors.splice(rateTypeIndex, 1);
              }
            }
            if (shift.shift_id !== 0 && shift.shift_id !== "") {
              let shiftIdIndex = this.shiftErrors.findIndex(
                err => err.field === `shift_id-s${index}-${i}`
              );
              if (shiftIdIndex > -1) {
                this.shiftErrors.splice(shiftIdIndex, 1);
              }
            }
            if (shift.rate !== 0 && shift.rate !== "") {
              let rateIndex = this.shiftErrors.findIndex(
                err => err.field === `rate-s${index}-${i}`
              );
              if (rateIndex > -1) {
                this.shiftErrors.splice(rateIndex, 1);
              }
            }
          });
        }
      });
      this.total_working_hours = total_working_hours;
      this.total_gross_locum_wages = total_gross_locum_wages;
      this.hasShiftError = hasError;
    },

    saveSchedule() {
      this.form.schedules = [];
      this.form.schedules = this.editedSchedule;
      this.form.dates = [];
      this.form.schedules.forEach(sched => {
        if (!this.form.dates.includes(sched.date)) {
          this.form.dates.push(sched.date);
        }
      });
      this.toSaveSched = false;
      this.editSchedule = false;
    },

    hasValue(value, field) {
      if (value == 0) {
        this.form[field] = "";
      }
    },

    handleKeyDownEvent(e, formField, limit) {
      let acceptedKeys = [
        "Backspace",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight"
      ];
      if (
        this.form[formField].length >= limit &&
        !acceptedKeys.includes(e.key)
      ) {
        e.preventDefault();
      }
    },

    goToProfile() {
      window.open("/profile", "_blank");
    },

    getListofDays(days) {
      if (days.includes(6) && days.length > 1) {
        this.show_saturday = true;
        this.form.include_saturday = true;
      } else if (days.includes(6) && days.length === 1) {
        this.show_saturday = false;
        this.form.include_saturday = true;
      } else if (!days.includes(6)) {
        this.show_saturday = false;
        this.form.include_saturday = false;
      }
      if (days.includes(0) && days.length > 1) {
        this.show_sunday = true;
        this.form.include_sunday = true;
      } else if (days.includes(0) && days.length === 1) {
        this.show_sunday = false;
        this.form.include_sunday = true;
      } else if (!days.includes(0)) {
        this.show_sunday = false;
        this.form.include_sunday = false;
      }
      if (days.length === 2 && days.includes(0) && days.includes(6)) {
        this.show_saturday = false;
        this.show_sunday = false;
        this.form.include_saturday = true;
        this.form.include_sunday = true;
      }
    },

    uncheckMandatory(value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      );
    },

    uncheckOtherMandatory(value) {
      this.form.other_mandatory_training_id = this.form.other_mandatory_training_id.filter(
        id => id != value
      );
    },

    validateNumber(value, fieldName) {
      let displayFieldName =
        fieldName.charAt(0).toUpperCase() +
        fieldName.slice(1).replace(/_/g, " ");
      let index = this.formError.findIndex(item => item.field === fieldName);
      if (
        parseInt(value) < 1 ||
        value.toString().includes("e") ||
        value === ""
      ) {
        this.formError.push({
          field: fieldName,
          message: `${displayFieldName} is invalid`
        });
      } else {
        this.formError.splice(index, 1);
      }
    },

    validateUpdate() {
      if (this.job.status === "Applied") {
        this.modal = true;
      } else if (this.job.status !== "Applied") {
        this.save();
      }
    },

    canSaveSched() {
      this.shiftErrors = [];
      this.schedules.forEach((sched, index) => {
        if (!sched.shifts.length) {
          this.shiftErrors.push({
            field: `shift-${sched.date}`,
            message: "Schedule is required. Add Shift to create schedule."
          });
        } else {
          sched.shifts.forEach((shift, i) => {
            if (!shift.time_start) {
              this.shiftErrors.push({
                field: `time_start-s${index}-${i}`,
                message: "Start is required."
              });
            }
            if (!shift.time_end) {
              this.shiftErrors.push({
                field: `time_end-s${index}-${i}`,
                message: "End is required."
              });
            }
            if (shift.locum_detail_rate_type_id === 0) {
              this.shiftErrors.push({
                field: `locum_detail_rate_type_id-s${index}-${i}`,
                message: "Rate type is required."
              });
            }
            if (shift.shift_id === 0) {
              this.shiftErrors.push({
                field: `shift_id-s${index}-${i}`,
                message: "Shift is required."
              });
            }
            if (shift.rate === 0) {
              this.shiftErrors.push({
                field: `rate-s${index}-${i}`,
                message: "Rate is required."
              });
            }
          });
        }
      });
      if (
        !this.shiftErrors.length &&
        !this.hasShiftError &&
        !this.formError.length
      ) {
        this.toSaveSched = true;
      }
    },

    save() {
      this.modal = false;

      this.formError = [];

      let notRequired = [
        "title",
        "description",
        "extra_information",
        "is_another_doctor",
        "is_nurse_available",
        "opportunity_for_catch_up_slots",
        "spoken_language_id",
        "ir35",
        "mandatory_training_id",
        "other_mandatory_training_id",
        "include_saturday",
        "include_sunday",
        "compliance_document_id",
        "auto_assign_at",
        "session_requirements",
        "session_structure_information",
        "hours",
        "minutes",
        "favorite_only"
      ];

      if (!this.hasBanks) {
        this.form.favorite_only = false;
        this.bank_first = false;
        this.favorite_only_until.date = null;
        this.favorite_only_until.time = null;
      }

      if (!["Allocated", "Applied"].includes(this.job.status)) {
        notRequired.push("update_accepted_until");
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

      if (["true", true].includes(this.form.favorite_only)) {
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
      // !this.form.hours ? (this.form.hours = 0) : this.form.hours;

      // if (
      // 	parseInt(this.form.hours) === 0 &&
      // 	this.form.minutes &&
      // 	parseInt(this.form.minutes) === 0
      // ) {
      // 	this.formError.push({
      // 		field: "minutes",
      // 		message: "Minutes is invalid"
      // 	});
      // } else {
      // 	this.form.total_hours =
      // 		this.form.hours * 60 + parseInt(this.form.minutes);
      // }

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

        // this.form.date_start = this.$moment(
        //   this.form.date_start,
        //   "YYYY-MM-DD"
        // ).format("YYYY-MM-DD")
        // this.form.date_end = this.$moment(
        //   this.form.date_end,
        //   "YYYY-MM-DD"
        // ).format("YYYY-MM-DD")

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

        if (["15", 15, "30", 30, "60", 60].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = this.unpaid_breaks;
        }

        if (this.unpaid_breaks === "other") {
          this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes;
        }

        if (["false", false].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = "";
        }

        this.form.ir35 =
          this.selectedProfession &&
          this.selectedProfession.profession_category.name === "GP"
            ? this.form.ir35
            : false;

        this.loading = true;

        const oldJobId = this.job.id;
        this.$axios
          .put(`/api/v1/practice/jobs/${oldJobId}`, this.form)
          .then(response => {
            const newJobId = response.data.data.job.id;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Successfully updated job"]
            });
            this.$emit("updateJob", {
              newJobId,
              oldJobId
            });
          })
          .catch(err => {
            console.log("err", err.response || err);

            this.form.clinical_system_id = this.selectedClinicalSystem;

            this.form.qualification_id = this.selectedQualification;

            this.form.spoken_language_id = this.selectedSpokenLanguage;

            this.form.session_requirements = this.form.session_requirements
              ? this.form.session_requirements.split(",")
              : [];

            let message = null;

            if (err.response) {
              if (
                err.response.status === 400 ||
                err.response.data.error_messages
              ) {
                this.formError = err.response.data.error_messages;
              } else {
                message = err.response.data.message;
              }
            } else if (err.request) {
              message = "Something weng wrong!";
            } else {
              message = err.message;
            }

            if (message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${message}`]
              });
            }

            // if (err.response.status === 500) {
            //   this.formError.push({
            //     field: err.response.statusText,
            //     message: "Please check your inputs"
            //   })
            // } else if (err.response.status === 400) {
            //   // this.formError.push({
            //   //   field: "date_start",
            //   //   message: err.response.data.message
            //   // })
            //   // this.formError.push({
            //   //   field: "date_end",
            //   //   message: err.response.data.message
            //   // })
            // } else {
            //   this.formError = err.response.data.error_messages
            // }
            // throw err
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.$emit("scrollToTop");
      }
    }
  }
};
</script>
<style>
.schedule-wrapper {
  min-width: 75vw;
  min-height: 90vh;
  max-height: 90vh;
  overflow: auto;
}
.message-modal.job-notification-wrapper {
  min-width: 30vw;
  z-index: 80;
}
</style>
