<template>
  <div>
    <AppLoading :loading="dataLoading" spinner />
    <div v-if="practice_hubzz_fee_rate.gp_rate > 0 && practice_hubzz_fee_rate.others_rate > 0">
      <AppBreadcrumbs v-if="repostJob" :links="links" />
      <div class="flex justify-between items-center font-bold text-sm sm:text-xl">
        <div class="flex flex-col pt-2">
          <div>CREATE JOB</div>
          <div
            v-if="$auth.user.domain === 'Practice' &&
              $auth.user.status === 'Active' &&
              ($auth.user.practice_detail.practice.status === 'Active' 
              || $auth.user.practice_detail.practice.status === 'Dormant') &&
              ($auth.user.practice_detail.practice.type === 'Spoke' &&
              $auth.user.practice_detail.practice.parent_practice_id) &&
              $auth.user.practice_detail.practice.allow_surgery_create_sessions === false"
            class="hidden md:block text-gray-600 italic text-sm"
          >
            *Session status is Pending once created. No permission to create a job, thus required approval from your Hub.
          </div>
        </div>
      </div>

      <transition name="fade">
        <div
          v-if="toPublish"
          class="message-modal job-notification bg-white p-4 rounded font-bold text-gray-700"
        >
          <p
            class="text-center pb-2 mb-4 border-b-2 border-gray-600 text-lg font-bold"
          >
            JOB NOTIFICATION SUMMARY
          </p>
          <div class="px-4">
            <div class="flex justify-between pb-2">
              <p>Working Hours:</p>

              <p class="pl-1">
                {{ totalHoursInMinutes | hoursMinutes }}
              </p>
            </div>

            <div class="flex justify-between pb-2">
              <p>Unpaid Break:</p>

              <p class="pl-1">
                <template v-if="!totalUnpaidBreakInMinutes">0</template>
                {{ totalUnpaidBreakInMinutes | hoursMinutes }}
              </p>
            </div>

            <div class="flex justify-between pb-2">
              <p>Total Working Hours:</p>

              <p class="pl-1">
                {{ totalHoursInMinutes - totalUnpaidBreakInMinutes | hoursMinutes }}
              </p>
            </div>

            <div class="flex justify-between pb-2">
              <p>Total Gross Locum Wages:</p>
              <p class="pl-1">
                £ {{ total_gross_locum_wages | currency }}
              </p>
            </div>
            <div class="flex justify-between pb-2 text-red-600">
              <p>Total Gross Locum Wages (If VAT Registered):</p>
              <p class="pl-1">
                £ {{ taxed_total_gross_locum_wages_preview | currency }}
              </p>
            </div>
            <div class="flex justify-between pb-2">
              <p>
                Hubzz Fee*
                <span class="font-normal text-sm">(£{{ practice_rate.toFixed(2) }} per hour)</span>:
              </p>
              <p class="pl-1">
                £ {{ hubzz_fee | currency }}
              </p>
            </div>

            <div class="flex justify-between pb-2">
              <p>
                Hubzz Fee VAT
              </p>
              <p class="pl-1">
                £ {{ hubzz_fee_taxed - hubzz_fee | currency }}
              </p>
            </div>

            <div class="flex justify-between pb-2 text-red-600">
              <p>
                Hubzz Fee with VAT*
                <span class="font-normal text-sm">(+{{ tax_rates_for_preview && tax_rate_for_preview ? tax_rates_for_preview.practice_tax_rate : 0 }}%)</span>:
              </p>
              <p class="pl-1">
                £ {{ hubzz_fee_taxed | currency }}
              </p>
            </div>
          </div>
          <div class="flex justify-end items-center text-black mt-3">
            <AppButton :label="'Cancel'" class="mr-1" :disabled="loading" @click="toPublish=false" />
            <AppButton :label="'Confirm & Publish'" :disabled="loading" @click="createJob" />
          </div>
        </div>
      </transition>

      <div 
        v-if="toPublish" 
        class="shield"
      />

      <transition name="slide">
        <div class="flex items-start flex-col md:flex-row">
          <template v-if="!dataLoading">
            <AppLoading :loading="dataLoading" spinner />
            <div class="w-full md:w-1/3 lg:w-45p flex flex-col xl:flex-row">
              <div class="w-full xl:w-5/12 xl:pr-2 mt-2">
                <div class="flex flex-col">
                  <div class="border rounded-lg px-2 py-3">
                    <h4 class="text-gray-500 mb-1">
                      Practice
                    </h4>
                    <AppInput
                      v-model="form.practice_id"
                      :type="'select'"
                      :name="'practice_id'"
                      :placeholder="'Choose a Surgery'"
                      :error="formError.find(item => item.field === 'practice_id')"
                      :items="practice_lists"
                      class="px-2"
                      @blur="CheckEmptyField(form.practice_id, 'practice_id')"
                    />
                  </div>

                  <div class="flex flex-col border rounded-lg px-2 pt-3 mt-4">
                    <h4 class="text-gray-500 mb-1">
                      Duration
                    </h4>
                    <div class="px-2">
                      <AppInput
                        v-model="auto_assign_job"
                        :type="'single-checkbox'"
                        :name="'auto_assign_job'"
                        :label="'Use AUTO-MATCH on this Job?'"
                        :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                      />

                      <template v-if="['false', false].includes(auto_assign_job)">
                        <AppInput
                          v-model="selection_notification"
                          :type="'single-checkbox'"
                          :name="'selection_notification'"
                          :label="'Add a selection date?'"
                          :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                        />
                        <template v-if="selection_notification === true || selection_notification === 'true'">
                          <div>Selection will be made and you will receive a notification by this date</div>
                          <div class="flex flex-row flex-wrap justify-between items-end">
                            <div class="px-1 w-full md:w-1/2">
                              <AppDate
                                v-model="selection_date.date"
                                :name="'selection_date'"
                                :label="'Date'"
                                is-after
                                :error="formError.find(item => item.field === 'selection_date')"
                                required
                              />
                            </div>
                            <div class="px-1 w-full md:w-1/2">
                              <AppTime
                                v-model="selection_date.time"
                                :type="'time'"
                                :name="'time_end'"
                                :label="'Time'"
                                :error="formError.find(item => item.field === 'selection_date')"
                                required
                              />
                            </div>
                          </div>
                        </template>
                      </template>

                      <template v-if="hasBanks">
                        <AppInput
                          v-model="form.favorite_only"
                          :type="'select'"
                          :name="'favorite_only'"
                          :label="'Make this Job available for Bank Only?'"
                          :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                          required
                        />
                        <template v-if="['false', false].includes(form.favorite_only)">
                          <AppInput
                            v-model="bank_first"
                            :type="'select'"
                            :name="'bank_first'"
                            :label="'Make this Job available for Bank First?'"
                            :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                            required
                          />
                          <template v-if="bank_first === true || bank_first === 'true'">
                            <div>Only favorite locum will be notified until this date</div>
                            <div class="flex flex-row flex-wrap justify-between items-end">
                              <div class="px-1 w-full md:w-1/2">
                                <AppDate
                                  v-model="favorite_only_until.date"
                                  :name="'favorite_only_until'"
                                  :label="'Date'"
                                  is-after
                                  :error="formError.find(item => item.field === 'favorite_only_until')"
                                  required
                                />
                              </div>
                              <div class="px-1 w-full md:w-1/2">
                                <AppTime
                                  v-model="favorite_only_until.time"
                                  :type="'time'"
                                  :name="'time_end'"
                                  :label="'Time'"
                                  :error="formError.find(item => item.field === 'favorite_only_until')"
                                  required
                                />
                              </div>
                            </div>
                          </template>
                        </template>
                      </template>
                    </div>
                  </div>

                  <div class="flex flex-col border rounded-lg px-2 py-3 mt-4">
                    <h4 class="text-gray-500 mb-1">
                      Job Details
                    </h4>

                    <div class="px-2">
                      <AppInput v-model="form.title" :type="'text'" :name="'title'" :placeholder="'Title'" />

                      <AppInput
                        v-model="form.description"
                        :type="'textarea'"
                        :name="'description'"
                        :placeholder="'Description'"
                        :resize="false"
                        :rows="4"
                      />

                      <AppInput
                        v-model="form.report_to"
                        :type="'text'"
                        :name="'report_to'"
                        :placeholder="'Report to'"
                        :error="formError.find(item => item.field === 'report_to')"
                        required
                        @blur="CheckEmptyField(form.report_to,'report_to')"
                      />

                      <AppInput
                        v-model="form.email"
                        :type="'text'"
                        :name="'email'"
                        :placeholder="'Email'"
                        :error="formError.find(item => item.field === 'email')"
                        required
                        @blur="CheckEmptyField(form.email,'email')"
                      />

                      <AppInput
                        v-model="form.number_of_patients"
                        :type="'number'"
                        :name="'number_of_patients'"
                        :placeholder="'Number of session patients'"
                        :error="formError.find(item => item.field === 'number_of_patients')"
                        required
                        :limit="4"
                        @blur="CheckEmptyField(form.number_of_patients,'number_of_patients')"
                      />

                      <AppInput
                        v-model="form.duration_for_each_appointment"
                        :type="'number'"
                        :name="'duration_for_each_appointment'"
                        :placeholder="'Duration per patient (Hourly)'"
                        :error="formError.find(item => item.field === 'duration_for_each_appointment')"
                        required
                        :limit="4"
                        @blur="CheckEmptyField(form.duration_for_each_appointment, 'duration_for_each_appointment')"
                      />

                      <AppInput
                        v-model="form.is_another_doctor"
                        :type="'single-checkbox'"
                        :name="'is_another_doctor'"
                        :label="'Is there another Dr on site?'"
                        :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
                      />

                      <AppInput
                        v-model="form.is_nurse_available"
                        :type="'single-checkbox'"
                        :name="'is_nurse_available'"
                        :label="'Is nurse support available?'"
                        :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
                      />

                      <AppInput
                        v-model="form.opportunity_for_catch_up_slots"
                        :type="'single-checkbox'"
                        :name="'opportunity_for_catch_up_slots'"
                        :label="'Opportunity for catch up slots?'"
                        :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
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
                        @uncheckAll="form.session_requirements = []"
                      />

                      <AppInput
                        v-model="form.session_structure_information"
                        :type="'textarea'"
                        :name="'session_structure_information'"
                        :placeholder="'Session structure information'"
                        :resize="false"
                        :rows="4"
                      />

                      <AppInput
                        v-model="form.extra_information"
                        :type="'textarea'"
                        :name="'extra_information'"
                        :placeholder="'Extra information'"
                        :resize="false"
                        :rows="4"
                      />

                      <template v-if="selectedProfession && selectedProfession.profession_category.name === 'GP'">
                        <AppInput
                          v-model="form.ir35"
                          :type="'select'"
                          :name="'ir35'"
                          :label="'IR35 - role inside or outside of scope'"
                          :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
                        />
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full xl:w-7/12 xl:pl-2 mt-2 flex flex-col">
                <div class="flex flex-col border rounded-lg px-2" :class="form.role ? 'pt-3' : 'py-3'">
                  <h4 class="text-gray-500 mb-1">
                    Matching Criteria
                  </h4>
                  <div class="px-2">
                    <AppInput
                      v-model="form.role"
                      :type="'select'"
                      :name="'role'"
                      :placeholder="'Choose Locum Role'"
                      :items="professions"
                      :error="formError.find(item => item.field === 'role')"
                      required
                      @blur="CheckEmptyField(form.role,'role')"
                    />

                    <template v-if="form.role">
                      <AppFilterSearch
                        v-model="form.specialty"
                        :name="'specialty'"
                        :placeholder="'Choose Specialty'"
                        :url="'/api/v1/qualifications'"
                        :professionCategoryId="selectedProfession && selectedProfession.profession_category
                          ? selectedProfession.profession_category.id.toString()
                          : null
                        "
                        :error="formError.find(item => item.field === 'specialty')"
                        required
                      />

                      <AppFilterSearch
                        v-model="form.clinical_system"
                        :name="'clinical_system'"
                        :placeholder="'Choose Clinical systems'"
                        :url="'/api/v1/clinical-systems'"
                        :error="formError.find(item => item.field === 'clinical_system')"
                        required
                      />

                      <AppFilterSearch
                        v-model="form.spoken_language_id"
                        :name="'spoken_language_id'"
                        :placeholder="'Choose Spoken languages'"
                        :url="'/api/v1/spoken-languages'"
                        :default-item="'English'"
                      />

                      <template v-if="form.practice_id">
                        <div class="relative flex flex-col pt-2">
                          <div class>
                            Compliance documents
                          </div>
                        </div>

                        <AppInput
                          v-model="form.compliance_document_id"
                          :type="'multi-checkbox'"
                          :error="formError.find(item => item.field === 'compliance_document_id')"
                          :name="'compliance_document_id'"
                          :label="`${complianceListLabel}`"
                          :lists="compliances"
                          :info="'Check all that apply'"
                          @checked="form.compliance_document_id.push(parseInt($event))"
                          @unchecked="form.compliance_document_id.splice(form.compliance_document_id.findIndex(item => item === parseInt($event)), 1)"
                          @uncheckAll="form.compliance_document_id = []"
                        />

                        <div class="mb-6 text-center md:text-left mt-2">
                          <AppButton :label="'Add Compliance Document (Profile Page)'" class="w-full mt-1" :customTheme="'bg-white shadow border hover:bg-gray-100'" @click="goToProfile" />
                        </div>
                      </template>
                      <template v-else-if="!form.practice_id">
                        <div class="mb-2">
                          Compliance Documents
                        </div>
                        <div class="mb-4 text-sm italic text-gray-800">
                          Please select a Practice first
                        </div>
                      </template>
                    </template>
                  </div>
                </div>

                <div class="border rounded-lg w-full h-full my-4">
                  <p class="text-gray-700 text-center text-lg font-bold pt-6">
                    <span>DATES</span>
                  </p>

                  <p class="text-center text-xs text-gray-700">
                    <span>Select date range or use the calendar</span>
                    <br>
                    <span>to pick out specific dates</span>
                  </p>

                  <div class="px-4 pb-4 pt-6">
                    <div class="flex">
                      <div class="px-1 w-full md:w-1/2">
                        <AppDate v-model="start_date" :name="'date_start'" :label="'Start Date'" isAfter />
                      </div>

                      <div class="px-1 w-full md:w-1/2">
                        <AppDate
                          v-model="end_date"
                          :name="'date_end'"
                          :label="'End Date'"
                          :startDate="start_date"
                          isAfter
                        />
                      </div>
                    </div>

                    <AppMultipleDates
                      v-model="scheduleDates"
                      :name="'dates'"
                      is-after
                      multipleSelection
                      isDisplay
                      class="multiple-date-picker"
                      :format="'DD/MM/YYYY'"
                      :overlayData="overlayData"
                      @focus="toggleCalendar = true"
                      @blur="toggleCalendar = false"
                    />

                    <div v-if="scheduleDates.length">
                      <div>
                        <p class="text-gray-700">
                          <span>Selected:</span>
                          <span class="font-bold">{{ scheduleDates.length }}</span>
                          <span class="font-bold">Date{{ scheduleDates.length > 1 ? 's' : '' }}</span>
                        </p>

                        <p class="text-gray-700">
                          <span>Job Parts:</span>
                          <span class="font-bold">{{ job_parts_sched.length }}</span>
                          <span class="font-bold">Part{{ job_parts_sched.length > 1 ? 's' : '' }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border rounded-lg w-full h-full pt-3 px-2">
                  <div class="mb-1 text-gray-500">
                    Mandatory Training List
                  </div>
                  <template v-if="form.practice_id">
                    <AppInput
                      v-model="form.mandatory_training_id"
                      :type="'multi-checkbox'"
                      :error="formError.find(item => item.field === 'mandatory_training_id')"
                      :name="'mandatory_training_id'"
                      :label="'Mandatory training required for this job'"
                      :lists="mandatory_training_lists"
                      :info="'Check all that apply'"
                      @checked="form.mandatory_training_id.push(parseInt($event))"
                      @unchecked="form.mandatory_training_id.splice(form.mandatory_training_id.findIndex(item => item === parseInt($event)), 1)"
                      @uncheckAll="form.mandatory_training_id = []"
                    />

                    <AppInput
                      v-model="form.other_mandatory_training_id"
                      :type="'multi-checkbox'"
                      :error="formError.find(item => item.field === 'other_mandatory_training_id')"
                      :name="'other_mandatory_training_id'"
                      :label="'Other Mandatory training required for this job'"
                      :lists="other_mandatory_training_lists"
                      :info="'Check all that apply'"
                      @checked="form.other_mandatory_training_id.push(parseInt($event))"
                      @unchecked="form.other_mandatory_training_id.splice(form.other_mandatory_training_id.findIndex(item => item === parseInt($event)), 1)"
                      @uncheckAll="form.other_mandatory_training_id = []"
                    />

                    <div class="mb-6 text-center md:text-left">
                      <AppButton :label="'Add Compliance Document (Profile Page)'" class="w-full mt-1" :customTheme="'bg-white shadow border hover:bg-gray-100'" @click="goToProfile" />
                    </div>
                  </template>

                  <template v-else-if="!form.practice_id">
                    <div class="mb-4 text-sm italic text-gray-800">
                      Please Select a Practice first
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="w-full md:w-2/3 lg:w-55p">
              <AppSchedules
                :shifts="shifts"
                :rate_lists="rate_lists"
                :schedule="form.schedules"
                :error="formError.find(err => err.field === 'schedules')"
                :shiftErrors="shiftErrors"
                :type="'create'"
                :tax_rates_for_preview="tax_rates_for_preview"
                hideDates
                :importedSchedule="scheduleDates"
                :importedDateRange="{start_date: start_date, end_date: end_date}"
                @getSchedule="getSchedule"
                @getJobParts="getJobParts"
                @exportSched="value=> scheduleDates = value"
              />
              <div class="pt-4 pb-8 w-full flex justify-end">
                <AppButton
                  v-if="authPermissions.includes('Create Sessions Job')"
                  :disabled="!form.schedules.length || loading"
                  :label="'Publish Session'"
                  @click="canPublish"
                />
              </div>
            </div>
          </template>
        </div>
      </transition>
    </div>
    <div v-else class="disabled-modal flex flex-col justify-center">
      <div class="flex">
        <div class="mx-2">
          <svgicon name="exclamation-mark" height="40" width="40" color="red" />
        </div>
        <div>
          Job Creation is currently disabled. No Practice Rate Assigned. Please contact HUBZZ support.
        </div>
      </div>
      <div class="m-8">
        <nuxt-link to="/">
          Go Back
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput"
import AppFilterSearch from "@/components/Base/AppFilterSearch"
import AppDate from "@/components/Base/AppDate"
import AppMultipleDates from "@/components/Base/AppMultipleDates"
import AppSchedules from "@/components/Base/AppSchedules"
import AppButton from "@/components/Base/AppButton"
import AppTime from "@/components/Base/AppTime"
import AppLoading from "@/components/Base/AppLoading"
import AppBreadcrumbs from "@/components/Base/AppBreadcrumbs"

const session_requirements_lists = [
  { label: "Practice admin", value: "Practice admin", },
  { label: "Telephone triage", value: "Telephone triage", },
  { label: "Home visits", value: "Home visits", },
]

export default {
  components: {
    AppInput,
    AppFilterSearch,
    AppSchedules,
    AppDate,
    AppButton,
    AppTime,
    AppLoading,
    AppMultipleDates,
    AppBreadcrumbs,
  },

  data () {
    return {
      practice_hubzz_fee_rate:{
        gp_rate: 0,
        others_rate: 0,
      },
      banksCount: 0,
      loading: false,
      dataLoading: false,
      links: [],

      // sched dates
      start_date: null,
      end_date: null, 
      scheduleDates: [],
      overlayData: [],
      toggleCalendar: false,
      job_parts_sched: [],

      practices: [],
      practice_lists: [],
      rate_lists: [],
      mandatory_training: [],
      professions: [],
      session_requirements_lists,
      mandatory_training_lists: [],
      other_mandatory_training_lists: [],

      professions_categories: [],

      professionComplianceCategories: [],
      practiceProfessionComplianceCategoryComplianceDocuments: [],

      unpaid_breaks: false,
      auto_assign_job: false,
      selection_notification: false,
      bank_first: false,
      shifts: [],

      selection_date: {
        date: null,
        time: null,
      },
      favorite_only_until: {
        date: null,
        time: null,
      },

      selectedQualification: [],
      selectedClinicalSystem: [],
      selectedSpokenLanguage: [],

      // SPLIT JOBS
      tabActive: "details",
      hasShiftError: false,
      totalHoursInMinutes: 0,
      total_gross_locum_wages: 0,
      tax_rate_preview: 0,
      taxed_total_gross_locum_wages_preview: 0,
      shiftErrors: [],
      toPublish: false,
      schedules: [],
      job_parts: [],

      // TAX RATES FOR PREVIEW
      tax_rates_for_preview: {},

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
        ir35: false,
        mandatory_training_id: [],
        other_mandatory_training_id: [],
        role: "",
        specialty: [],
        clinical_system: [],
        spoken_language_id: [],
        compliance_document_id: [],
        schedules: [],
        schedule_templates: [],
        auto_assign_at: null,
        selection_date: null,
        favorite_only: false,
        favorite_only_until: null,
      },
      formError: [],
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    repostJob () {
      return this.$store.state.calendar.repost_job
    },

    hasBanks () {
      return this.banksCount > 0 ? true : false
    },

    complianceListLabel () {
      return `For ${this.selectedProfession.profession_compliance_category_name}:`
    },

    selectedProfession () {
      if (!this.form.role) {
        return null
      }

      const profession = this.professions_categories.find(
        profession => profession.id.toString() === this.form.role.toString()
      )

      if (!profession) {
        return null
      }

      return profession
    },

    selectedProfessionComplianceCategory () {
      if (!this.form.role) {
        return null
      }

      const profession = this.professions_categories.find(
        profession => profession.id.toString() === this.form.role.toString()
      )

      if (!profession) {
        return null
      }

      const professionComplianceCategory = this.professionComplianceCategories.find(
        professionComplianceCategory =>
          professionComplianceCategory.id
          === profession.profession_compliance_category_id
      )

      return professionComplianceCategory || null
    },

    emptyComplianceDocumentId: {
      get () {
        return this.form.compliance_document_id.length === 0
      },
      set (emptyComplianceDocumentId) {
        if (emptyComplianceDocumentId) {
          this.form.compliance_document_id = []
        }
      },
    },

    compliances () {
      if (!this.form.role) {
        return []
      }

      const profession = this.professions_categories.find(
        profession => profession.id.toString() === this.form.role.toString()
      )

      if (!profession) {
        return []
      }

      const complianceDocuments = this.professionComplianceCategories.reduce(
        (compliances, professionComplianceCategory) => {
          const {
            reference_compliance_documents: referenceComplianceDocuments,
            mandatory_compliance_documents: mandatoryComplianceDocuments,
            optional_compliance_documents: optionalComplianceDocuments,
          } = professionComplianceCategory

          if (
            professionComplianceCategory.id
            === this.selectedProfessionComplianceCategory.id
          ) {
            [
              referenceComplianceDocuments,
              mandatoryComplianceDocuments,
              optionalComplianceDocuments,
            ].forEach(complianceDocuments => {
              complianceDocuments.forEach(complianceDocument => {
                const {
                  id,
                  name,
                  compliance_document_type_name: complianceDocumentTypeName,
                  child_compliance_documents: childComplianceDocuments,
                } = complianceDocument

                if (complianceDocumentTypeName === "Safeguarding") {
                  childComplianceDocuments.forEach(childComplianceDocument => {
                    const { id, name, } = childComplianceDocument

                    compliances.push({
                      label: name,
                      value: id,
                    })
                  })
                } else {
                  compliances.push({
                    label: name,
                    value: id,
                  })
                }
              })
            })
          }

          return compliances
        },
        []
      )

      const complianceDocumentIds = complianceDocuments.map(
        ({ value, }) => value
      )

      return this.practiceProfessionComplianceCategoryComplianceDocuments
        .filter(practiceProfessionComplianceCategoryComplianceDocument => {
          const {
            compliance_document_id: complianceDocumentId,
            profession_compliance_category_id: professionComplianceCategoryId,
          } = practiceProfessionComplianceCategoryComplianceDocument

          return (
            professionComplianceCategoryId
              === this.selectedProfessionComplianceCategory.id
            && complianceDocumentIds.includes(complianceDocumentId)
          )
        })
        .map(practiceProfessionComplianceCategoryComplianceDocument => {
          const {
            compliance_document_id: complianceDocumentId,
            compliance_document_name: complianceDocumentName,
          } = practiceProfessionComplianceCategoryComplianceDocument

          return {
            label: complianceDocumentName,
            value: complianceDocumentId,
          }
        })
    },

    practice_rate () {
      const profession = this.professions_categories.find(
        profession => profession.id.toString() === this.form.role.toString()
      )

      const practiceRates
        = this.$auth.user
        && this.$auth.user.practice_detail
        && this.$auth.user.practice_detail.practice
          ? this.$auth.user.practice_detail.practice.practice_rates
          : []

      const practiceRate = practiceRates.find(
        item => item.type === profession.profession_category_name
      )

      return practiceRate ? practiceRate.rate : 0
    },

    hubzz_fee () {
      return this.schedules
        .reduce((scheduleTotal, sched) => {
          const shiftTotal = sched.shifts.reduce((shiftTotal, shift) => {
            const timeStart = shift.time_start

            const timeEnd = shift.time_end

            const unpaidBreakInMinutes = (shift.posted_break_payable === 'false' || !shift.posted_break_payable) && shift.posted_break_in_minutes
              ? parseFloat(shift.posted_break_in_minutes)
              : 0

            const totalHoursInMinutes = this.totalHours(timeStart, timeEnd, sched.date)

            const totalPaidHoursInMinutes = totalHoursInMinutes - unpaidBreakInMinutes

            const totalPaidHours = Math.round((totalPaidHoursInMinutes / 60) * 100) / 100

            const scheduleShiftHubzzFee = Math.round(totalPaidHours * this.practice_rate * 100) / 100

            return shiftTotal + scheduleShiftHubzzFee
          }, 0)

          return scheduleTotal + shiftTotal
        }, 0)
        .toFixed(2)
    },

    hubzz_fee_taxed () {
      console.log('this.tax_rates_for_preview', this.tax_rates_for_preview)
      const taxed_hubzz_fee 
        = parseFloat(this.hubzz_fee) 
          + (parseFloat(this.hubzz_fee) 
          * (this.tax_rates_for_preview 
            && this.tax_rates_for_preview.practice_tax_rate_formatted 
            ? parseFloat(this.tax_rates_for_preview.practice_tax_rate_formatted) 
            : 0))
      return taxed_hubzz_fee
    },

    totalUnpaidBreakInMinutes () {
      return this.form.schedules.reduce((totalUnpaidBreakInMinutes, schedule) => {
        const unpaidBreakInMinutes = (schedule.posted_break_payable === 'false' || !schedule.posted_break_payable) && schedule.posted_break_in_minutes
          ? parseFloat(schedule.posted_break_in_minutes)
          : 0

        return totalUnpaidBreakInMinutes + unpaidBreakInMinutes
      }, 0)
    },
  },

  watch: {
    selectedProfessionComplianceCategory () {
      if (this.selectedProfessionComplianceCategory) {
        const defaultSelectedComplianceDocumentIds = this.practiceProfessionComplianceCategoryComplianceDocuments
          .filter(
            practiceProfessionComplianceCategoryComplianceDocument =>
              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
              === this.selectedProfessionComplianceCategory.id
          )
          .map(
            practiceProfessionComplianceCategoryComplianceDocument =>
              practiceProfessionComplianceCategoryComplianceDocument.compliance_document_id
          )

        this.form.compliance_document_id = defaultSelectedComplianceDocumentIds
      } else {
        this.form.compliance_document_id = []
      }
    },
    async "form.role" (newValue, oldValue) {
      this.CheckEmptyField(newValue, "role")

      if (newValue && oldValue) {
        this.form.specialty = []
      }
    },
    selectedProfession () {
      if (this.selectedProfession) {
        this.$axios
          .get("/api/v1/practice/locums/count", {
            params: {
              profession_category_id: this.selectedProfession
                .profession_category.id,
              practice_locum_type: "Favorite",
            },
          })
          .then(response => {
            this.banksCount = response.data.data.count
          })
      }
    },
    "form.specialty" (value) {
      this.CheckEmptyField(value, "specialty")
    },
    "form.clinical_system" (value) {
      this.CheckEmptyField(value, "clinical_system")
    },
    "form.time_start" (value) {
      console.log(value)
      // console.log(this.form.date_start, this.form.date_end)
      // if (this.form.date_start === this.form.date_end) {
      // console.log(this.form.time_start, this.form.time_end)
      // let fullDateStart = this.form.date_start
      // }
    },
    scheduleDates (value) {
      console.log("dates", value)
    },
    schedule (value) {
      console.log(value)
    },
    schedule_dates (value) {
      if (value.length) {
        let removedAnItem = false
        this.schedule.forEach((sched, index) => {
          let dateStillExist = value
            .map(date => sched.date === date)
            .includes(true)
          if (!dateStillExist) {
            this.schedule.splice(index, 1)
            removedAnItem = true
          }
        })
        if (!removedAnItem) {
          this.schedule.push({ date: value[value.length - 1], shift_id: [], })
        }
      }
      if (this.applyToAllDates) {
        this.editingDates = true
      }
    },
    toEditShift (newValue, oldValue) {
      console.log("watch toEditShift", newValue, oldValue)
    },
    "form.practice_id" (newValue, oldValue) {
      if (oldValue && newValue) {
        this.form.mandatory_training_id = []
        this.form.other_mandatory_training_id = []
        this.form.compliance_document_id = []
      }
      if (newValue) {
        let foundPractice = this.practices.find(
          practice => practice.id === parseInt(newValue)
        )
        this.mandatory_training_lists = foundPractice.mandatory_trainings.map(
          mandatoryTraining => ({
            label: mandatoryTraining.name,
            value: mandatoryTraining.id,
          })
        )

        this.other_mandatory_training_lists = foundPractice.other_mandatory_trainings.map(
          otherMandatoryTraining => ({
            label: otherMandatoryTraining.name,
            value: otherMandatoryTraining.id,
          })
        )

        this.practiceProfessionComplianceCategoryComplianceDocuments
          = foundPractice.practice_profession_compliance_category_compliance_documents
      }
    },
  },

  destroyed () {
    this.$store.commit("calendar/CLEAR_REPOST_JOB")
  },

  created () {
    console.log(this.repostJob)
    this.dataLoading = true

    Promise.all([
      this.$axios.get("/api/v1/practice/me/practice-practices"),
      this.$axios.get("/api/v1/locum-detail-rate-types").then(response =>
        response.data.data.locum_detail_rate_types.map(rateType => ({
          label: rateType.name,
          value: rateType.id,
        }))
      ),
      this.$axios.get("/api/v1/shifts").then(response =>
        response.data.data.shifts.map(shift => ({
          label: shift.name,
          value: shift.id,
        }))
      ),
      this.$axios.get("/api/v1/professions")
        .then(response => response.data.data.professions),
      this.$axios.get("/api/v1/practice/me/practice-profile")
        .then(response => response.data.data.practice),
      this.$axios.get("/api/v1/profession-compliance-categories")
        .then(response => {
          return response.data.data.profession_compliance_categories
        }),
      this.$axios.get("/api/v1/tax-rates")
        .then(response => 
          response.data.data.tax_rates
        ),
      ])
      .then(responses => {
        const [
          responsePractices,
          rateLists,
          shiftLists,
          professions,
          profileProfile,
          professionComplianceCategories,
          taxRates,
        ] = responses
        this.practices = responsePractices.data.data.practices
        this.practice_lists = responsePractices.data.data.practices.map(
          practice => ({
            label: practice.name,
            value: practice.id,
          })
        )
        this.rate_lists = rateLists
        this.shifts = shiftLists
        this.professions = professions.map(profession => ({
          label: profession.name,
          value: profession.id,
        }))
        this.professions_categories = professions
        this.professionComplianceCategories = professionComplianceCategories

        const {
          report_to: reportTo,
          email,
          extra_information: extraInformation,
          // practice_profession_compliance_category_compliance_documents: practiceProfessionComplianceCategoryComplianceDocuments,
          // mandatory_trainings: mandatoryTrainings,
          // other_mandatory_trainings: otherMandatoryTrainings
        } = profileProfile

        this.form.report_to = reportTo
        this.form.email = email
        this.form.extra_information = extraInformation
        // this.practiceProfessionComplianceCategoryComplianceDocuments = practiceProfessionComplianceCategoryComplianceDocuments;

        // this.mandatory_training_lists = mandatoryTrainings.map(
        // 	mandatoryTraining => ({
        // 		label: mandatoryTraining.name,
        // 		value: mandatoryTraining.id
        // 	})
        // );

        // this.other_mandatory_training_lists = otherMandatoryTrainings.map(
        // 	otherMandatoryTraining => ({
        // 		label: otherMandatoryTraining.name,
        // 		value: otherMandatoryTraining.id
        // 	})
        // );

        if (this.repostJob) {
          const selectedProfession = this.professions_categories.find(
            profession =>
              profession.id === this.repostJob.platform_job.profession.id
          )

          this.links = [
            {
              title: 'Dashboard',
              url: '/dashboard',
            },
            {
              title: this.repostJob.title,
              url: `/dashboard/${this.repostJob.id}`,
            },
            {
              title: 'Repost Job',
            },
          ]

          const selectedProfessionCategoryId
            = selectedProfession.profession_category.id
          this.form.practice_id = this.repostJob.platform_job.practice.id
          this.form.title = this.repostJob.title
          this.form.description = this.repostJob.description
          this.form.email = this.repostJob.platform_job.email
          this.form.report_to = this.repostJob.platform_job.report_to

          this.form.is_another_doctor = this.repostJob.platform_job.is_another_doctor
          this.form.is_nurse_available = this.repostJob.platform_job.is_nurse_available
          this.form.number_of_patients = this.repostJob.platform_job.number_of_patients
          this.form.duration_for_each_appointment = this.repostJob.platform_job.duration_for_each_appointment
          this.form.opportunity_for_catch_up_slots = this.repostJob.platform_job.opportunity_for_catch_up_slots
          if (this.repostJob.platform_job.session_requirements === "") {
            this.form.session_requirements = []
          } else {
            this.form.session_requirements = this.repostJob.platform_job
              .session_requirements
              ? this.repostJob.platform_job.session_requirements.split(",")
              : []
          }
          this.form.session_structure_information = this.repostJob.platform_job.session_structure_information
          this.form.extra_information = this.repostJob.platform_job.extra_information

          // this.form.rate = this.repostJob.rate;
          // this.form.total_hours = this.repostJob.total_hours;
          // this.form.locum_detail_rate_type_id = this.repostJob.locum_detail_rate_type.id;
          this.form.ir35 = this.repostJob.platform_job.ir35

          this.form.mandatory_training_id = this.repostJob.platform_job.mandatory_trainings.map(
            item => item.id
          )
          this.form.role = this.repostJob.platform_job.profession.id

          this.repostJob.platform_job.qualifications.forEach(qualification => {
            this.form.specialty.push({
              label: qualification.name,
              value: qualification.id,
            })
          })
          this.repostJob.platform_job.clinical_systems.forEach(
            clinicalSystem => {
              this.form.clinical_system.push({
                label: clinicalSystem.name,
                value: clinicalSystem.id,
              })
            }
          )

          this.repostJob.platform_job.spoken_languages.forEach(
            spokenLanguage => {
              this.form.spoken_language_id.push({
                label: spokenLanguage.name,
                value: spokenLanguage.id,
              })
            }
          )

          const complianceDocumentIds = this.practiceProfessionComplianceCategoryComplianceDocuments
            .filter(
              practiceProfessionComplianceCategoryComplianceDocument =>
                practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                === selectedProfessionCategoryId
            )
            .map(
              ({ compliance_document_id: complianceDocumentId, }) =>
                complianceDocumentId
            )

          this.$nextTick(() => {
            this.form.compliance_document_id = this.repostJob.platform_job.compliance_documents
              .map(complianceDocument => complianceDocument.id)
              .filter(complianceDocumentId =>
                complianceDocumentIds.includes(complianceDocumentId)
              )
          })

          // this.form.dates = this.repostJob.dates

          // this.form.date_start = this.$moment().isBefore(
          //   this.repostJob.date_start
          // )
          //   ? this.repostJob.date_start
          //   : null

          // this.form.date_end = this.$moment().isBefore(
          //   this.repostJob.date_end
          // )
          //   ? this.repostJob.date_end
          //   : null

          // this.form.include_saturday = this.repostJob.include_saturday
          // this.form.include_sunday = this.repostJob.include_sunday

          // this.form.time_start = this.$moment().isBefore(
          //   this.repostJob.dates[0])
          //   ? this.repostJob.time_start
          //   : null
          //   this.form.time_end = this.$moment().isBefore(
          // this.repostJob.dates[this.repostJob.dates.length-1])
          //   ? this.repostJob.time_end
          //   : null

          // if (this.$moment().isBefore(this.repostJob.dates[this.repostJob.dates.length-1])) {
          //   this.repostJob.dates.forEach(date => this.form.dates.push(date))
          // }
          // if (this.repostJob.platform_job.unpaid_breaks_in_minutes === 0) {
          // 	this.unpaid_breaks = false;
          // } else if (
          // 	![15, 30, 60].includes(
          // 		this.repostJob.platform_job.unpaid_breaks_in_minutes
          // 	)
          // ) {
          // 	this.unpaid_breaks = "other";
          // 	this.form.unpaid_breaks_in_minutes = this.repostJob.platform_job.unpaid_breaks_in_minutes;
          // } else {
          // 	this.unpaid_breaks = this.repostJob.platform_job.unpaid_breaks_in_minutes;
          // }

          // this.form.shift = this.repostJob.shift.id;

          this.form.auto_assign_at = this.repostJob.platform_job.auto_assign_at
          if (this.form.auto_assign_at) {
            this.auto_assign_job = true
          }

          if (this.repostJob.platform_job.selection_date) {
            this.selection_date.date = this.$moment().isBefore(
              this.repostJob.platform_job.selection_date
            )
              ? this.$moment(this.repostJob.platform_job.selection_date).format(
                "YYYY-MM-DD"
              )
              : null
            this.selection_date.time = this.$moment().isBefore(
              this.repostJob.platform_job.selection_date
            )
              ? this.$moment(this.repostJob.platform_job.selection_date).format(
                "HH:mm"
              )
              : null
          }

          if (this.repostJob.favorite_only) {
            this.form.favorite_only = true
          } else if (
            this.$moment(this.repostJob.date_start, "YYYY-MM-DD").diff(
              this.repostJob.platform_job.favorite_only_until,
              "seconds"
            ) > 0
          ) {
            this.bank_first = true
            this.favorite_only_until.date = this.$moment(
              this.repostJob.platform_job.favorite_only_until,
              "YYYY-MM-DDTHH:mm:ss:sssZ"
            ).format("YYYY-MM-DD")
            this.favorite_only_until.time = this.$moment(
              this.repostJob.platform_job.favorite_only_until,
              "YYYY-MM-DDTHH:mm:ss:sssZ"
            ).format("HH:mm")
          }
        }

        this.tax_rates_for_preview = taxRates

        this.$auth.user.practice_detail.practice.rates.forEach(item => {
          if (item.type === 'GP') {
            this.practice_hubzz_fee_rate.gp_rate = item.rate
          }else if (item.type === 'Others') {
            this.practice_hubzz_fee_rate.others_rate = item.rate
          }
        })
      })
      .finally(() => {
        this.dataLoading = false
      })
  },

  methods: {
    totalHours (start, end, date) {
      let startDate = this.$moment(date + " " + start, "DD/MM/YYYY HH:mm")
      let endDate = this.$moment(date + " " + end, "DD/MM/YYYY HH:mm")
      return start && end
        ? this.$moment(endDate, "DD/MM/YYYY HH:mm").diff(startDate, "minutes")
        : 0
    },

    getJobParts (job_parts) {
      this.job_parts_sched = job_parts
    },

    // FOR APP SCHEDULE COMPONENT
    getTemplateSchedules (shift_schedule) {
      console.log("shift_schedule", shift_schedule)
      this.form.schedule_templates = []
      shift_schedule.forEach(shift => {
        this.form.schedule_templates.push({
          name: shift.label,
          shift_id: shift.shift_id,
          time_start: shift.time_start,
          time_end: shift.time_end,
          locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
          rate: shift.rate,
        })
      })
    },

    getInitialSchedule (payload) {
      this.form.schedules = []

      if (payload.schedule) {
        payload.schedule.forEach(sched => {
          sched.shift_id.forEach(id => {
            let shift = payload.shift_schedule.find(
              shift => shift.value === id
            )

            this.form.schedules.push({
              date: sched.date,
              shift_id: shift.shift_id,
              time_start: shift.time_start,
              time_end: shift.time_end,
              locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
              rate: shift.rate,
              schedule_template_name: shift.label,
            })
          })
        })
      }
    },

    // revised app schedule
    next () {
      this.formError = []
      let notRequired = [
        "title",
        "description",
        "session_requirements",
        "session_structure_information",
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
        "total_hours",
        "hours",
        "minutes",
        "favorite_only",
        "shift_id",
        "schedule_templates",
        "schedules",
        "unpaid_breaks_in_minutes",
      ]
      if (!this.hasBanks) {
        this.form.favorite_only = false
        this.bank_first = false
        this.favorite_only_until.date = null
        this.favorite_only_until.time = null
      }

      if (["true", true,].includes(this.auto_assign_job)) {
        this.selection_notification = false
      }

      if (["false", false,].includes(this.selection_notification)) {
        notRequired.push("selection_date")
      } else if (
        ["true", true,].includes(this.selection_notification)
        && this.selection_date.date
        && this.selection_date.time
      ) {
        notRequired.push("selection_date")
      }

      if (["true", true,].includes(this.form.favorite_only)) {
        this.bank_first = false
      }

      if (["false", false,].includes(this.bank_first)) {
        notRequired.push("favorite_only_until")
      } else if (
        ["true", true,].includes(this.bank_first)
        && this.favorite_only_until.date
        && this.favorite_only_until.time
      ) {
        notRequired.push("favorite_only_until")
      }

      this.Validate(this.form, notRequired)
      console.log("formError", this.formError)
      if (!this.formError.length) {
        this.tabActive = "schedule"
      } else {
        this.$nextTick(() => {
          //this.$refs.modalContainer.scrollTop = 0
        })
      }
    },

    getSchedule (
      schedule,
      total_gross_locum_wages,
      totalHoursInMinutes,
      deductions,
      total_lates,
      hasError,
      job_parts
    ) {
      this.form.schedules = []

      this.schedules = schedule

      console.log({
        schedule,
        total_gross_locum_wages,
        totalHoursInMinutes,
        deductions,
        total_lates,
        hasError,
        job_parts
      })

      schedule.forEach((sched, scheduleIndex) => {
        if (sched.shifts && sched.shifts.length) {
          let dateErrIndex = this.shiftErrors.findIndex(
            err => err.field === `shift-${sched.date}`
          )

          if (dateErrIndex > -1) {
            this.shiftErrors.splice(dateErrIndex, 1)
          }

          sched.shifts.forEach((shift, shiftIndex) => {
            this.form.schedules.push({
              date: this.$moment(sched.date, "DD/MM/YYYY").format("YYYY-MM-DD"),
              shift_id: shift.shift_id,
              time_start: shift.time_start,
              time_end: shift.time_end,
              locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
              rate: shift.rate,
              posted_break_in_minutes: shift.posted_break_in_minutes,
              posted_break_payable: shift.posted_break_payable,
            })

            if (shift.time_start) {
              const index = this.shiftErrors.findIndex(
                err => err.field === `time_start-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                this.shiftErrors.splice(index, 1)
              }
            }

            if (shift.time_end) {
              const index = this.shiftErrors.findIndex(
                err => err.field === `time_end-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                this.shiftErrors.splice(index, 1)
              }
            }

            if (
              shift.locum_detail_rate_type_id !== 0
              && shift.locum_detail_rate_type_id !== ""
            ) {
              const index = this.shiftErrors.findIndex(
                err => err.field === `locum_detail_rate_type_id-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                this.shiftErrors.splice(index, 1)
              }
            }

            if (shift.shift_id !== 0 && shift.shift_id !== "") {
              const index = this.shiftErrors.findIndex(
                err => err.field === `shift_id-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                this.shiftErrors.splice(index, 1)
              }
            }

            if (shift.rate !== 0 && shift.rate !== "") {
              const index = this.shiftErrors.findIndex(
                err => err.field === `rate-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                this.shiftErrors.splice(index, 1)
              }
            }

            if (
              shift.posted_break_in_minutes
              && shift.time_start
              && shift.time_end
              && sched.date
              && parseInt(shift.posted_break_in_minutes) > this.totalHours(shift.time_start, shift.time_end, sched.date)
            ) {
              this.shiftErrors.push({
                field: `posted_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
                message: "Invalid break in minutes.",
              })
            } else {
              const index = this.shiftErrors.findIndex(
                err => err.field === `posted_break_in_minutes-s${scheduleIndex}-${shiftIndex}`
              )

              if (index > -1) {
                // this.shiftErrors.splice(index, 1)
                this.shiftErrors = this.shiftErrors.filter(item => item.field !== `posted_break_in_minutes-s${scheduleIndex}-${shiftIndex}`)
              }
            }
          })
        }
      })

      this.totalHoursInMinutes = totalHoursInMinutes

      this.total_gross_locum_wages = total_gross_locum_wages
      
      const tax_rate_for_preview = parseFloat(total_gross_locum_wages) * parseFloat(this.tax_rates_for_preview.locum_tax_rate_formatted)

      const taxed_total_gross_locum_wages_preview = parseFloat(total_gross_locum_wages) + parseFloat(tax_rate_for_preview)
      
      this.tax_rate_for_preview = tax_rate_for_preview

      this.taxed_total_gross_locum_wages_preview = taxed_total_gross_locum_wages_preview

      this.hasShiftError = hasError

      this.job_parts = job_parts
    },

    canPublish () {
      this.shiftErrors = []

      this.formError = []

      let notRequired = [
        "title",
        "description",
        "session_requirements",
        "session_structure_information",
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
        "total_hours",
        "hours",
        "minutes",
        "favorite_only",
        "shift_id",
        "schedule_templates",
        "schedules",
        "unpaid_breaks_in_minutes",
      ]
      
      let has_conflict = false

      if (!this.hasBanks) {
        this.form.favorite_only = false
        this.bank_first = false
        this.favorite_only_until.date = null
        this.favorite_only_until.time = null
      }

      if (["true", true,].includes(this.auto_assign_job)) {
        this.selection_notification = false
      }

      if (["false", false,].includes(this.selection_notification)) {
        notRequired.push("selection_date")
      } else if (
        ["true", true,].includes(this.selection_notification)
        && this.selection_date.date
        && this.selection_date.time
      ) {
        notRequired.push("selection_date")
      }

      if (["true", true,].includes(this.form.favorite_only)) {
        this.bank_first = false
      }

      if (["false", false,].includes(this.bank_first)) {
        notRequired.push("favorite_only_until")
      } else if (
        ["true", true,].includes(this.bank_first)
        && this.favorite_only_until.date
        && this.favorite_only_until.time
      ) {
        notRequired.push("favorite_only_until")
      }

      this.Validate(this.form, notRequired)

      this.schedules.forEach((sched, scheduleIndex) => {
        if (!sched.shifts.length) {
          this.shiftErrors.push({
            field: `shift-${sched.date}`,
            message: "Schedule is required. Add Shift to create schedule.",
          })
        } else {
          sched.shifts.forEach((shift, shiftIndex) => {
            if (!shift.time_start) {
              this.shiftErrors.push({
                field: `time_start-s${scheduleIndex}-${shiftIndex}`,
                message: "Start is required.",
              })
            }

            if (!shift.time_end) {
              this.shiftErrors.push({
                field: `time_end-s${scheduleIndex}-${shiftIndex}`,
                message: "End is required.",
              })
            }

            if (shift.locum_detail_rate_type_id === 0) {
              this.shiftErrors.push({
                field: `locum_detail_rate_type_id-s${scheduleIndex}-${shiftIndex}`,
                message: "Rate type is required.",
              })
            }

            if (shift.shift_id === 0) {
              this.shiftErrors.push({
                field: `shift_id-s${scheduleIndex}-${shiftIndex}`,
                message: "Shift is required.",
              })
            }

            if (shift.rate === 0) {
              this.shiftErrors.push({
                field: `rate-s${scheduleIndex}-${shiftIndex}`,
                message: "Rate is required.",
              })
            }

            if (
              shift.posted_break_in_minutes
              && shift.time_start
              && shift.time_end
              && sched.date
              && parseInt(shift.posted_break_in_minutes) > this.totalHours(shift.time_start, shift.time_end, sched.date)
            ) {
              this.shiftErrors.push({
                field: `posted_break_in_minutes-s${scheduleIndex}-${shiftIndex}`,
                message: "Invalid break in minutes.",
              })
            }
          })
        }
      })

      if (!this.shiftErrors.length) {
        this.form.profession_id = this.form.role

        this.form.shift_id = this.form.shift

        this.selectedClinicalSystem = [...this.form.clinical_system,]

        this.form.clinical_system_id = this.form.clinical_system.map(
          item => item.value
        )

        this.selectedQualification = [...this.form.specialty,]

        this.form.qualification_id = this.form.specialty.map(
          item => item.value
        )

        this.selectedSpokenLanguage = [...this.form.spoken_language_id,]

        this.form.spoken_language_id = this.form.spoken_language_id.map(
          item => item.value
        )

        if (Array.isArray(this.form.session_requirements)) {
          if (this.form.session_requirements.length === 1) {
            this.form.session_requirements = this.form.session_requirements[0]
          } else if (this.form.session_requirements.length > 0) {
            this.form.session_requirements = this.form.session_requirements.join()
          } else if (this.form.session_requirements.length === 0) {
            this.form.session_requirements = ""
          }
        }

        this.form.auto_assign_at = null

        if (["true", true,].includes(this.auto_assign_job)) {
          this.form.auto_assign_at = "1970-01-01 00:00"
        }

        this.form.selection_date = null

        if (["false", false,].includes(this.auto_assign_job)) {
          if (["true", true,].includes(this.selection_notification)) {
            this.form.selection_date = `${this.$moment(
              this.selection_date.date,
              "YYYY-MM-DD"
            ).format("YYYY-MM-DD")} ${this.selection_date.time}`
          }
        }

        this.form.favorite_only_until = null

        if (["true", true,].includes(this.bank_first)) {
          this.form.favorite_only_until = `${this.$moment(
            this.favorite_only_until.date,
            "YYYY-MM-DD"
          ).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`
        }

        if (["15", 15, "30", 30, "60", 60,].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = this.unpaid_breaks
        }

        if (this.unpaid_breaks === "other") {
          this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes
        }

        if (["false", false,].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = ""
        }

        this.form.ir35
          = this.selectedProfession
          && this.selectedProfession.profession_category.name === "GP"
            ? this.form.ir35
            : false

        this.loading = true

        this.$axios
          .$post(`/api/v1/practice/jobs/check`, {
            ...this.form,
            old_job_id:
              this.repostJob && !["Cancelled",].includes(this.repostJob.status)
                ? this.repostJob.id
                : null,
          })
          .then(() => {
            if (
              !this.shiftErrors.length
              && !this.hasShiftError
              && !this.formError.length
              && !has_conflict
            ) {
              this.toPublish = true
            }
          })
          .catch(err => {
            console.log("err", err.response || err)

            this.loading = false

            //this.$refs.modalContainer.scrollTop = 0

            this.form.clinical_system = this.selectedClinicalSystem

            this.form.specialty = this.selectedQualification

            this.form.spoken_language_id = this.selectedSpokenLanguage

            this.form.session_requirements = this.form.session_requirements
              ? this.form.session_requirements.split(",")
              : []

            let message = null

            if (err.response) {
              if (
                err.response.data.error_messages
                && err.response.data.error_messages.length > 0
              ) {
                this.shiftErrors = err.response.data.error_messages
                // let detailsError = [
                //   "practice_id",
                //   "number_of_patients",
                //   "duration_for_each_appointment",
                //   "role",
                //   "specialty",
                //   "clinical_system",
                // ]
                let sched_has_conflict = this.shiftErrors.find(
                  err => err.field === "schedules"
                )
                if (sched_has_conflict) {
                  has_conflict = true
                  sched_has_conflict.conflictSchedules.forEach(item => {
                    this.shiftErrors.push({
                      field: `conflict-${this.$moment(
                        item.date,
                        "YYYY-MM-DD"
                      ).format("DD/MM/YYYY")}-${item.index}`,
                      message:
                        "This schedule has a conflict with another schedule.",
                    })
                  })
                  let conflictDates = sched_has_conflict.conflictSchedules
                    .map(item => item.date)
                    .filter(item => item)
                  let job_parts = []
                  conflictDates.forEach(date => {
                    let job_part = this.job_parts.find(item =>
                      item.dates.includes(date)
                    )
                    if (!job_parts.includes(job_part.value)) {
                      job_parts.push(job_part.value)
                    }
                  })
                  this.$store.commit("SET_NOTIFICATION", {
                    enabled: true,
                    status: "danger",
                    text: [
                      `Conflict schedule on Job Part/s (${job_parts.join(",")})`,
                    ],
                    duration: 3000,
                  })
                }

                this.formError = err.response.data.error_messages

                console.log("formErropr", this.formError)
                let detailsError = [
                  "practice_id",
                  "number_of_patients",
                  "duration_for_each_appointment",
                  "role",
                  "specialty",
                  "clinical_system",
                ]

                let hasDetailsError = this.formError
                  .map(err => detailsError.includes(err.field))
                  .includes(true)
                if (hasDetailsError) {
                  this.tabActive = "details"
                } else if (
                  this.formError
                    .map(err => ["schedules", "dates",].includes(err.field))
                    .includes(true)
                ) {
                  this.tabActive = "schedule"
                }
              } else {
                message = err.response.data.message
              }
              // if (this.shiftErrors.length) {
              //   let sched_has_conflict = this.shiftErrors.find(
              //     err => err.field === "schedules"
              //   )
              // }
            } else if (err.request) {
              message = "Something went wrong!"
            } else {
              message = err.message
            }

            if (message) {
              console.log('umabot ba dito', message)
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${message}`,],
              })
            }
          }).finally(() => {
            this.loading = false
          })
      }
      if (this.shiftErrors.length) {
        let has_empty_sched_dates = this.shiftErrors.filter(err =>
          err.field.includes("shift-")
        )
        let job_parts = []
        if (has_empty_sched_dates.length) {
          has_empty_sched_dates.forEach(err => {
            let empty_date = err.field.split("-")[1]
            let job_part = this.job_parts.find(part =>
              part.dates.includes(
                this.$moment(empty_date, "DD/MM/YYYY").format("YYYY-MM-DD")
              )
            )
            let exist = job_parts.find(item => item === `${job_part.value}`)
            if (job_part && !exist) {
              job_parts.push(`${job_part.value}`)
            }
          })
          let partsLabel = ""
          job_parts.forEach((item, index) => {
            if (job_parts.length > 1) {
              if (index !== job_parts.length - 1) {
                partsLabel += `${item}, `
              } else if (index === job_parts.length - 1) {
                partsLabel += `${item}`
              }
              //  else {
              // partsLabel += ` and ${item}`;
              // }
            } else {
              partsLabel += item
            }
          })
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`Empty schedule on Job Part/s (${partsLabel})`,],
            duration: 3000,
          })
        }
      }
    },

    // -- END FOR APP SCHEDULE COMPONENT
    hasValue (value, field) {
      if (value == 0) {
        this.form[field] = ""
      }
    },

    handleKeyDownEvent (e, formField, limit) {
      let acceptedKeys = [
        "Backspace",
        "Tab",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ]
      if (
        this.form[formField].length >= limit
        && !acceptedKeys.includes(e.key)
      ) {
        e.preventDefault()
      }
    },

    // getListofDays (days) {
    //   // if (days.includes(6) && days.length > 1) {
    //   //   this.show_saturday = true
    //   //   this.form.include_saturday = true
    //   // } else if (days.includes(6) && days.length === 1) {
    //   //   this.show_saturday = false
    //   //   this.form.include_saturday = true
    //   // } else if (!days.includes(6)) {
    //   //   this.show_saturday = false
    //   //   this.form.include_saturday = false
    //   // }
    //   // if (days.includes(0) && days.length > 1) {
    //   //   this.show_sunday = true
    //   //   this.form.include_sunday = true
    //   // } else if (days.includes(0) && days.length === 1) {
    //   //   this.show_sunday = false
    //   //   this.form.include_sunday = true
    //   // } else if (!days.includes(0)) {
    //   //   this.show_sunday = false
    //   //   this.form.include_sunday = false
    //   // }
    // },

    close () {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false)
      this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", false)
      this.$store.commit("calendar/CLEAR_REPOST_JOB")
      this.$emit("close")
    },

    goToProfile () {
      this.$store.commit("calendar/CREATE_JOB_MODAL", false)
      this.$store.commit("calendar/CLEAR_REPOST_JOB")
      window.open("/profile", "_blank")
    },

    uncheckMandatory (value) {
      this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
        id => id != value
      )
    },

    validateNumber (value, fieldName) {
      let displayFieldName
        = fieldName.charAt(0).toUpperCase()
        + fieldName.slice(1).replace(/_/g, " ")
      let index = this.formError.findIndex(item => item.field === fieldName)
      if (
        parseInt(value) < 1
        || value.toString().includes("e")
        || value === ""
      ) {
        this.formError.push({
          field: fieldName,
          message: `${displayFieldName} is invalid`,
        })
      } else {
        this.formError.splice(index, 1)
      }
    },

    createJob () {
      this.formError = []

      let notRequired = [
        "title",
        "description",
        "session_requirements",
        "session_structure_information",
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
        "total_hours",
        "hours",
        "minutes",
        "favorite_only",
        "shift_id",
        "schedule_templates",
        "unpaid_breaks_in_minutes",
      ]

      if (!this.hasBanks) {
        this.form.favorite_only = false
        this.bank_first = false
        this.favorite_only_until.date = null
        this.favorite_only_until.time = null
      }

      if (["true", true,].includes(this.auto_assign_job)) {
        this.selection_notification = false
      }

      if (["false", false,].includes(this.selection_notification)) {
        notRequired.push("selection_date")
      } else if (
        ["true", true,].includes(this.selection_notification)
        && this.selection_date.date
        && this.selection_date.time
      ) {
        notRequired.push("selection_date")
      }

      if (["true", true,].includes(this.form.favorite_only)) {
        this.bank_first = false
      }

      if (["false", false,].includes(this.bank_first)) {
        notRequired.push("favorite_only_until")
      } else if (
        ["true", true,].includes(this.bank_first)
        && this.favorite_only_until.date
        && this.favorite_only_until.time
      ) {
        notRequired.push("favorite_only_until")
      }

      this.Validate(this.form, notRequired)

      if (!this.formError.length) {
        this.form.profession_id = this.form.role

        this.form.shift_id = this.form.shift

        this.selectedClinicalSystem = [...this.form.clinical_system,]

        this.form.clinical_system_id = this.form.clinical_system.map(
          item => item.value
        )

        this.selectedQualification = [...this.form.specialty,]

        this.form.qualification_id = this.form.specialty.map(
          item => item.value
        )

        this.selectedSpokenLanguage = [...this.form.spoken_language_id,]

        this.form.spoken_language_id = this.form.spoken_language_id.map(
          item => item.value
        )

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
            this.form.session_requirements = this.form.session_requirements[0]
          } else if (this.form.session_requirements.length > 0) {
            this.form.session_requirements = this.form.session_requirements.join()
          } else if (this.form.session_requirements.length === 0) {
            this.form.session_requirements = ""
          }
        }

        this.form.auto_assign_at = null

        if (["true", true,].includes(this.auto_assign_job)) {
          this.form.auto_assign_at = "1970-01-01 00:00"
        }

        this.form.selection_date = null

        if (["false", false,].includes(this.auto_assign_job)) {
          if (["true", true,].includes(this.selection_notification)) {
            this.form.selection_date = `${this.$moment(
              this.selection_date.date,
              "YYYY-MM-DD"
            ).format("YYYY-MM-DD")} ${this.selection_date.time}`
          }
        }

        this.form.favorite_only_until = null

        if (["true", true,].includes(this.bank_first)) {
          this.form.favorite_only_until = `${this.$moment(
            this.favorite_only_until.date,
            "YYYY-MM-DD"
          ).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`
        }

        if (["15", 15, "30", 30, "60", 60,].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = this.unpaid_breaks
        }

        if (this.unpaid_breaks === "other") {
          this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes
        }

        if (["false", false,].includes(this.unpaid_breaks)) {
          this.form.unpaid_breaks_in_minutes = ""
        }

        this.form.ir35
          = this.selectedProfession
          && this.selectedProfession.profession_category.name === "GP"
            ? this.form.ir35
            : false

        this.loading = true

        this.$axios
          .$post(`/api/v1/practice/jobs`, {
            ...this.form,
            old_job_id:
              this.repostJob && !["Cancelled",].includes(this.repostJob.status)
                ? this.repostJob.id
                : null,
          })
          .then(res => {
            if (this.$route.name === "dashboard-create") {
              this.$router.push("/dashboard")
            } else if (this.$route.name !== "dashboard-create") {
              this.$store.commit("calendar/CREATE_JOB_MODAL", false)

              console.log("res.data", res.data)
            }

            const job = res.data.job

            if (job.status === "Live") {
              this.$store.commit("jobs/ADD_PRACTICE_AVAILABLE_JOB", job)
            }

            if (this.repostJob) {
              if (this.repostJob.status === "Unfilled") {
                this.$store.commit(
                  "jobs/REMOVE_PRACTICE_UNFILLED_JOB",
                  this.repostJob.id
                )
              }

              if (this.repostJob.status === "Withdrawn") {
                this.$store.commit(
                  "jobs/REMOVE_PRACTICE_WITHDRAWN_JOB_PARTS_WHERE_JOB_ID_IS",
                  this.repostJob.id
                )
              }
            }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: ["Successfully created job",],
            })
            this.$router.push('/sessions/?status=Live')
          })
          .catch(err => {
            console.log("err", err.response || err)

            //this.$refs.modalContainer.scrollTop = 0

            this.form.clinical_system = this.selectedClinicalSystem

            this.form.specialty = this.selectedQualification

            this.form.spoken_language_id = this.selectedSpokenLanguage

            this.form.session_requirements = this.form.session_requirements
              ? this.form.session_requirements.split(",")
              : []

            let message = null

            if (err.response) {
              if (
                err.response.data.error_messages
                && err.response.data.error_messages.length > 0
              ) {
                this.formError = err.response.data.error_messages
                let detailsError = [
                  "practice_id",
                  "number_of_patients",
                  "duration_for_each_appointment",
                  "role",
                  "specialty",
                  "clinical_system",
                ]

                let hasDetailsError = this.formError
                  .map(err => detailsError.includes(err.field))
                  .includes(true)
                if (hasDetailsError) {
                  this.tabActive = "details"
                } else if (
                  this.formError
                    .map(err => ["schedules", "dates",].includes(err.field))
                    .includes(true)
                ) {
                  this.tabActive = "schedule"
                }
              } else {
                message = err.response.data.message
              }
            } else if (err.request) {
              message = "Something weng wrong!"
            } else {
              message = err.message
            }

            if (message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${message}`,],
              })
            }
          })
          .finally(() => {
            this.toPublish = false
            this.loading = false
          })
      } else {
        let detailsError = [
          "practice_id",
          "number_of_patients",
          "duration_for_each_appointment",
          "role",
          "specialty",
          "clinical_system",
        ]

        let hasDetailsError = this.formError
          .map(err => detailsError.includes(err.field))
          .includes(true)

        if (hasDetailsError) {
          this.tabActive = "details"
        }

        console.log("errors", this.formError)

        this.toPublish = false

        this.$nextTick(() => {
          //this.$refs.modalContainer.scrollTop = 0
        })
      }
    },
  },
}
</script>

<style scoped>
.disabled-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
  width: 500px;
	max-width: 95%;
	max-height: 70%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: white;
	z-index: 512;
}
.message-modal.job-notification {
  min-width: 50vw;
}
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  transition: all 0.3s ease-in-out;
  scroll-behavior: smooth;
}
.err-shield {
  background-color: rgba(0, 0, 0, 0.4);
}
@media (min-width: 768px) {
  .message-modal.job-notification {
    min-width: 25vw;
  }
}
</style>
