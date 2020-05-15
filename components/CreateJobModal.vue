<template>
  <transition name="slide" mode="out-in">
    <div ref="modalContainer" class="wrapper p-4 md:p-8">
      <div>
        <svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" @click="close" />
      </div>

      <div class="flex justify-start font-bold text-sm sm:text-xl mt-8">
        Create a new job
      </div>
      <transition name="fade">
       <div v-if="showShifts" class="fixed m-auto z-50 left-0 right-0 top-0 bottom-0 err-shield flex items-center justify-center" >
          <div class="bg-white border rounded mx-2 md:mx-0 md:w-4/5 xl:w-3/5">
            <div class="flex items-center justify-between px-4 pt-2 pb-2 border-b">
              <p class="font-bold">Manage Shifts</p>
              <svgicon name="times-solid" width="18" height="18" @click="showShifts=false" class="fill-current hover:text-gray-700 cursor-pointer"/>
            </div>
            <div class="px-4 pb-8">
              <div class="border-b-2" :class="shift_schedule.length >= 4 ? 'overflow-x-hidden overflow-y-auto' : ''" :style="shift_schedule.length >= 4 ? 'max-height: 600px' : ''" ref="scheduleWrapper">
                <div  class="pt-2 pb-4" :class="[index%2?'bg-gray-200':'', shift_schedule.length >= 4 ? 'px-1 lg:pl-0 lg:pr-2' : 'px-1']" v-for="(item, index) in shift_schedule" :key="index">
                  <div>
                    <AppInput
                      v-model="item.label"
                      :type="'text'"
                      :label="'Shift Name'"
                      :in-style="'background-color: transparent;'"
                      :info="'Add Shift Name to easily assign the shift to dates'"
                      required
                    />
                  </div>
                  <div class="relative flex flex-row flex-wrap justify-between items-end">
                    <div class="w-full md:w-1/5 px-1">
                        <AppInput
                          v-model="item.shift"
                          :type="'select'"
                          :name="'shift'"
                          :label="'Shifts'"
                          :placeholder="'Select...'"
                          :items="shifts"
                          :error="formError.find(item => item.field === 'shift')"
                          required
                          @blur="CheckEmptyField(item.shift, 'shift')"
                        />
                    </div>
                    <div class="w-full md:w-1/5 px-1">
                      <AppTime
                        v-model="item.time_start"
                        :type="'time'"
                        :name="'time_start'"
                        :label="'Start Time'"
                        :error="formError.find(item => item.field === 'time_start')"
                        required
                        :inClass="index%2?'bg-gray-200':''"
                        @blur="CheckEmptyField(item.time_start,'time_start')"
                      />
                    </div>
                    <div class="w-full md:w-1/5 px-1">
                      <AppTime
                        v-model="item.time_end"
                        :type="'time'"
                        :name="'time_end'"
                        :label="'End Time'"
                        :error="formError.find(item => item.field === 'time_end')"
                        required
                        :inClass="index%2?'bg-gray-200':''"
                        @blur="CheckEmptyField(item.time_end,'time_end')"
                      />
                    </div>
                    <div class="w-full md:w-1/5 px-1">
                      <AppInput
                        v-model="item.locum_detail_rate_type_id"
                        :type="'select'"
                        :name="'locum_detail_rate_type_id'"
                        :label="'Rate type'"
                        :items="rate_lists"
                        required
                      />
                    </div>
                    <div class="w-full md:w-1/5 px-1 flex items-center">
                      <AppInput
                        class="w-full"
                        v-model="item.rate"
                        :type="'text'"
                        :name="'rate'"
                        :label="'Rate £'"
                        :min="1"
                        :in-style="'text-align:right; background-color: transparent;'"
                        :limit="8"
                        :inClass="index%2?'bg-gray-200':''"
                        :required="[1, '1'].includes(form.locum_detail_rate_type_id)"
                        @blur="CheckEmptyField(item.rate,'rate'), item.rate === '' ? item.rate = 0 : item.rate"
                        @focus="item.rate === 0 ? item.rate = '' : item.rate"
                        @keydown="isNumber($event)"
                      />
                    <!-- <svgicon v-if="shift_schedule.length > 1" name="minus" width="20" height="20" class="ml-2 text-red-600 hover:text-red-700 fill-current cursor-pointer"  @click="removeSchedule(item.id, index)"/> -->
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row md:justify-end">
                    <AppButton  v-if="shift_schedule.length > 1"  :label="'Remove'" :inStyle="'padding:5px 14px;'" class="md:mr-1 mb-1 md:mb-0" @click="removeSchedule(item.id, index)" :disabled="select_dates"/>
                    <AppButton :label="item.appliedToAll ? 'Cancel Apply to All' : 'Apply to All'" class="md:mr-1" @click="applyToAll(item)" :disabled="(!item.shift || !item.time_start || !item.time_end) || ([1, '1'].includes(form.locum_detail_rate_type_id) && !item.rate) || ((item.time_start && item.time_end) && item.time_start === item.time_end) || (select_dates && selected_sched_shift !== item.id)"/>
                    <!-- <AppButton 
                      :label="select_dates && selected_sched_shift === item.id ? schedules && schedules.length && schedules.find(sched => sched.shift_schedule === item.id) ? 'Update' : 'Apply' : schedules && schedules.length && schedules.find(sched => sched.shift_schedule === item.id) ? 'Edit Dates' : 'Select Dates'" 
                      :inStyle="'padding:5px 14px;'" 
                      @click="applyToDates(item, select_dates && selected_sched_shift === item.id ? schedules && schedules.length && schedules.find(sched => sched.shift_schedule === item.id) ? 'update' : 'apply' : schedules && schedules.length && schedules.find(sched => sched.shift_schedule === item.id) ? 'edit' : 'select')"
                      :disabled="(!item.shift || !item.time_start || !item.time_end) || ([1, '1'].includes(form.locum_detail_rate_type_id) && !item.rate) || ((item.time_start && item.time_end) && item.time_start === item.time_end) || (select_dates && selected_sched_shift !== item.id)"/> -->
                  </div>
                </div> 
              </div>
              <div class="flex items-center justify-end mt-4">
                <p class="text-gray-700 font-bold text-xs mx-2 px-2 flex items-center justify-center border-b-2">{{ shift_schedule.length }}</p>
                <AppButton :label="'Add Shift'" :inStyle="'padding:5px 14px;'" class="mr-1" @click="addShiftSchedule" :disabled="(!shift_schedule[shift_schedule.length-1].shift || !shift_schedule[shift_schedule.length-1].time_start || !shift_schedule[shift_schedule.length-1].time_end || ([1, '1'].includes(form.locum_detail_rate_type_id) && !shift_schedule[shift_schedule.length-1].rate) || ((shift_schedule[shift_schedule.length-1].time_start && shift_schedule[shift_schedule.length-1].time_end) && shift_schedule[shift_schedule.length-1].time_start === shift_schedule[shift_schedule.length-1].time_end))"/>
                <!-- <AppButton v-if="schedules.length" :label="'View Schedule'" :inStyle="'padding:5px 14px;'" @click="viewSchedule" :disabled="selected_sched_shift !== ''"/> -->
                <AppButton :label="'Close'" :inStyle="'padding:5px 14px;'" @click="showShifts=false"/>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div class="relative flex flex-row flex-wrap justify-start mt-8">
        <AppLoading :loading="dataLoading" spinner />
        <template v-if="!dataLoading">
          <div class="w-full md:w-1/2 md:pr-4 mb-4">
            <div class="flex flex-col">
              <h4 class="font-bold">
                Practice
              </h4>

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

              <div class="flex flex-col">
                <h4 class="font-bold mt-4">
                  Criteria
                </h4>
                <div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
                  <AppInput
                    v-model="form.role"
                    :type="'select'"
                    :name="'role'"
                    :label="'Role'"
                    :placeholder="'Select...'"
                    :items="professions"
                    :error="formError.find(item => item.field === 'role')"
                    required
                    @blur="CheckEmptyField(form.role,'role')"
                  />

                  <template v-if="form.role">
                    <AppFilterSearch
                      v-model="form.specialty"
                      :name="'specialty'"
                      :label="'Specialty'"
                      :placeholder="'Select...'"
                      :info="'Choose at least one qualification'"
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
                      :label="'Clinical systems'"
                      :placeholder="'Select...'"
                      :info="'Choose at least one IT system'"
                      :url="'/api/v1/clinical-systems'"
                      :error="formError.find(item => item.field === 'clinical_system')"
                      required
                    />

                    <AppFilterSearch
                      v-model="form.spoken_language_id"
                      :name="'spoken_language_id'"
                      :label="'Spoken languages'"
                      :placeholder="'Select...'"
                      :info="'Choose other languages you can speak'"
                      :url="'/api/v1/spoken-languages'"
                      :default-item="'English'"
                    />

                    <template v-if="form.role">
                      <div class="relative flex flex-col pt-2">
                        <div class>
                          Compliance documents
                        </div>
                      </div>

                      <div v-if="false" class="flex flex-row flex-wrap justify-bettwen">
                        <template v-if="selectedProfessionComplianceCategory">
                          <div class="flex flex-col w-full px-2">
                            <div>For {{ selectedProfessionComplianceCategory.name }}:</div>
                            <div class="ml-4">
                              <input :id="`${selectedProfessionComplianceCategory.id}-${selectedProfessionComplianceCategory.name}`"
                                     v-model="emptyComplianceDocumentId"
                                     type="checkbox"
                                     :disabled="emptyComplianceDocumentId"
                              >
                              <label
                                :for="`${selectedProfessionComplianceCategory.id}-${selectedProfessionComplianceCategory.name}`"
                              >N/A</label>
                            </div>
                            <div class="ml-2">
                              Reference
                            </div>
                            <template
                              v-for="complianceDocument in selectedProfessionComplianceCategory.reference_compliance_documents"
                            >
                              <div :key="`${complianceDocument.id}-${complianceDocument.name}`"
                                   class="ml-4 flex flex-row justify-start items-center"
                              >
                                <input :id="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                       v-model="form.compliance_document_id"
                                       type="checkbox" :value="complianceDocument.id"
                                >
                                <label
                                  :for="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                >{{ complianceDocument.name }}</label>
                              </div>
                            </template>
                            <div class="ml-2">
                              Mandatory
                            </div>
                            <template
                              v-for="complianceDocument in selectedProfessionComplianceCategory.mandatory_compliance_documents"
                            >
                              <div v-if="complianceDocument.compliance_document_type_name !== 'Safeguarding'"
                                   :key="`${complianceDocument.id}-${complianceDocument.name}`"
                                   class="ml-4 flex flex-row justify-start items-center"
                              >
                                <input :id="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                       v-model="form.compliance_document_id"
                                       type="checkbox" :value="complianceDocument.id"
                                >
                                <label
                                  :for="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                >{{ complianceDocument.name }}</label>
                              </div>
                              <div v-for="childComplianceDocument in complianceDocument.child_compliance_documents"
                                   v-if="complianceDocument.compliance_document_type_name === 'Safeguarding'"
                                   :key="`${childComplianceDocument.id}-${childComplianceDocument.name}`"
                                   class="ml-4 flex flex-row justify-start items-center"
                              >
                                <input :id="`${childComplianceDocument.id}-${childComplianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                       v-model="form.compliance_document_id"
                                       type="checkbox" :value="childComplianceDocument.id"
                                >
                                <label
                                  :for="`${childComplianceDocument.id}-${childComplianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                >{{ childComplianceDocument.name }}</label>
                              </div>
                            </template>
                            <div class="ml-2">
                              Optional
                            </div>
                            <template v-for="complianceDocument in selectedProfessionComplianceCategory.optional_compliance_documents">
                              <div :key="`${complianceDocument.id}-${complianceDocument.name}`"
                                   class="ml-4 flex flex-row justify-start items-center"
                              >
                                <input :id="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                       v-model="form.compliance_document_id"
                                       type="checkbox" :value="complianceDocument.id"
                                >
                                <label
                                  :for="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                >{{ complianceDocument.name }}</label>
                              </div>
                            </template>
                          </div>
                        </template>
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

                      <div v-if="compliances.length === 0" class="mb-6 text-center md:text-left mt-2">
                        <AppButton :label="'Go to Profile to add items here'" @click="goToProfile" />
                      </div>
                    </template>
                  </template>
                </div>
              </div>

              <div class="flex flex-col">
                <h4 class="font-bold mt-4">
                  Duration
                </h4>
                <div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
                  <div class="relative pb-4 pt-2">
                    <div class="w-full">
                      <AppMultipleDates
                        v-model="schedule_dates"
                        :name="'dates'"
                        :label="'Job Dates'"
                        is-after
                        multipleSelection
                        required
                        :disableSelection="select_dates && !selected_sched_shift"
                        :overlayData="overlayData"
                        :error="formError.find(err => err.field === 'dates')"
                      />
                    </div>
                    <AppButton :label="'Mange Shifts'" @click="showShifts = true" :inStyle="'padding:5px 14px;'"/>
                    <div v-if="schedule.length" class="w-full pt-4">
                      <p class="font-bold">Job Dates</p>
                      <div class="overflow-x-hidden overflow-y-auto" style="max-height: 350px;">
                        <div v-for="(sched, index) in schedule" :key="index">
                          <p :class="shift_schedule.length && shift_schedule[0].label ? '-mb-4' : ''">{{ $moment(sched.date).format('DD/MM/YYYY') }}</p>
                          <AppInput
                            v-if="shift_schedule.length && shift_schedule[0].label"
                            v-model="sched.shift_id"
                            :type="'multi-checkbox'"
                            :name="`shift-${index+1}`"
                            :placeholder="''"
                            :isHorizontal="true"
                            :lists="shift_schedule"
                            @checked="shiftCheckAction('checked', sched.shift_id, index, $event)"
                            @unchecked="shiftCheckAction('unchecked', sched.shift_id, index, $event)"
                            @uncheckAll="shiftCheckAction('unCheckAll', sched.shift_id, index, $event)"
                          />
                          <!-- @checked="sched.shift_id.push($event)"
                          @unchecked="sched.shift_id.splice(sched.shift_id.findIndex(item => item === $event), 1)"
                          @uncheckAll="sched.shift_id=[]" -->
                        </div>
                      </div>
                      <div class="flex mt-2" v-if="!shift_schedule[0].label" >
                        <svgicon name="exclamation-mark" width="18" height="18" class="fill-current text-orange-500 mr-2" />
                        <p class="text-sm">Seems like your shifts hasn't been set-up yet.<br/>Click <span class="underline text-blue-500 cursor-pointer hover:text-blue-700" @click="showShifts=true">here</span> to add shift.</p>
                      </div>
                    </div>
                  </div>

                  <AppInput
                    v-if="unpaid_breaks === 'other'"
                    v-model="form.unpaid_breaks_in_minutes"
                    :type="'text'"
                    :name="'unpaid_breaks_in_minutes'"
                    :info="'Unpaid breaks in minutes'"
                    :label="'Other'"
                    :placeholder="''"
                    :in-style="'text-align:right;'"
                    :error="formError.find(item => item.field === 'unpaid_breaks_in_minutes')"
                    required
                    @blur="CheckEmptyField(form.unpaid_breaks_in_minutes,'unpaid_breaks_in_minutes')"
                    @keydown="inputNumberOnly($event)"
                  />
                  <AppInput
                    v-model="auto_assign_job"
                    :type="'select'"
                    :name="'auto_assign_job'"
                    :label="'Use AUTO-MATCH on this Job?'"
                    :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
                  />

                  <template v-if="['false', false].includes(auto_assign_job)">
                    <AppInput
                      v-model="selection_notification"
                      :type="'select'"
                      :name="'selection_notification'"
                      :label="'Add a selection date?'"
                      :items="[ {value: false, label: 'No'}, {value: true, label: 'Yes'} ]"
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
                </div>
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/2 lg:pl-4 mb-4">
            <h4 class="font-bold mt-4">
              Overview
            </h4>

            <div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
              <AppInput
                v-model="form.title"
                :type="'text'"
                :name="'title'"
                :label="'Title'"
              />

              <AppInput
                v-model="form.description"
                :type="'textarea'"
                :name="'description'"
                :label="'Description'"
                :resize="false"
              />

              <AppInput
                v-model="form.report_to"
                :type="'text'"
                :name="'report_to'"
                :label="'Report to'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'report_to')"
                required
                @blur="CheckEmptyField(form.report_to,'report_to')"
              />

              <AppInput
                v-model="form.email"
                :type="'text'"
                :name="'email'"
                :label="'Email'"
                :placeholder="''"
                :error="formError.find(item => item.field === 'email')"
                required
                @blur="CheckEmptyField(form.email,'email')"
              />

              <AppInput
                v-model="form.is_another_doctor"
                :type="'select'"
                :name="'is_another_doctor'"
                :label="'Is there another Dr on site?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />

              <AppInput
                v-model="form.is_nurse_available"
                :type="'select'"
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
                :in-style="'text-align:right;'"
                :error="formError.find(item => item.field === 'number_of_patients')"
                required
                @blur="CheckEmptyField(form.number_of_patients,'number_of_patients')"
              />

              <AppInput
                v-model="form.duration_for_each_appointment"
                :type="'number'"
                :name="'duration_for_each_appointment'"
                :label="'Duration of each appointment?'"
                :placeholder="''"
                :in-style="'text-align:right;'"
                :error="formError.find(item => item.field === 'duration_for_each_appointment')"
                required
                @blur="CheckEmptyField(form.duration_for_each_appointment, 'duration_for_each_appointment')"
              />

              <AppInput
                v-model="form.opportunity_for_catch_up_slots"
                :type="'select'"
                :name="'opportunity_for_catch_up_slots'"
                :label="'Opportunity for catch up slots?'"
                :items="[ {value: true, label: 'YES'}, {value: false, label: 'NO'} ]"
              />

              <AppInput
                v-model="form.session_requirements"
                :type="'multi-checkbox'"
                :name="'session_requirements'"
                :label="'Session requirements'"
                :placeholder="''"
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
                :label="'Session structure information'"
                :placeholder="'For e.g. the first 2 hours of the session is for booked appointments, 3rd hour is walk-ins, and home visits to x number of patients to the end of the session'"
                :resize="false"
              />

              <AppInput
                v-model="form.extra_information"
                :type="'textarea'"
                :name="'extra_information'"
                :label="'Extra information'"
                :placeholder="'For example, number of expected patients, nearby car park, etc.'"
                :resize="false"
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

              <div v-if="mandatory_training_lists.length === 0" class="mb-6 text-center md:text-left">
                <AppButton :label="'Go to Profile to add items here'" @click="goToProfile" />
              </div>
            </div>
          </div>

          <div class="pt-4 pb-8 w-full flex">
            <AppButton
              v-if="authPermissions.includes('Create Sessions Job')"
              class="ml-auto"
              :label="'Save and publish Job'"
              :disabled="loading"
              @click="createJob"
            />
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppFilterSearch from "@/components/Base/AppFilterSearch"
  import AppDate from "@/components/Base/AppDate"
  import AppMultipleDates from "@/components/Base/AppMultipleDates"
  import AppSchedule from "@/components/Base/AppSchedule"
  import AppButton from "@/components/Base/AppButton"
  import AppTime from "@/components/Base/AppTime"
  import AppLoading from "@/components/Base/AppLoading"

  const session_requirements_lists = [
    { label: "Practice admin", value: "Practice admin" },
    { label: "Telephone triage", value: "Telephone triage" },
    { label: "Home visits", value: "Home visits" }
  ]

  export default {
    components: {
      AppInput,
      AppFilterSearch,
      AppMultipleDates,
      AppSchedule,
      AppDate,
      AppButton,
      AppTime,
      AppLoading
    },

    data () {
      return {
        banksCount: 0,
        loading: false,
        dataLoading: false,
        error_modal: false,
        error_message: '',

        // show_saturday: false,
        // show_sunday: false,

        practice_lists: [],
        rate_lists: [],
        mandatory_training: [],
        professions: [],
        session_requirements_lists,
        mandatory_training_lists: [],

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
          time: null
        },
        favorite_only_until: {
          date: null,
          time: null
        },
        
        // SPLIT JOBS
        schedule_dates: [],
        shift_schedule: [{
          value: "1",
          label: 'Sample Shift',
          shift: 1,
          time_start: '00:00',
          time_end: '10:00',
          locum_detail_rate_type_id: 1,
          rate: 50,
          appliedToAll: false,
        }],
        select_dates: false,
        selected_dates: [],
        schedules: [],
        schedule: [],
        selected_sched_shift: '',
        overlayData: [],
        applyToAllDates: false,
        editingDates: false,
        showShifts: false,

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
          // rate: "",
          // hours: 0,
          // minutes: 0,
          // total_hours: "",
          // locum_detail_rate_type_id: 1,
          ir35: false,
          mandatory_training_id: [],
          role: "",
          specialty: [],
          clinical_system: [],
          spoken_language_id: [],
          compliance_document_id: [],
          // dates: [],
          schedules: [],
          // date_start: null,
          // date_end: null,
          // time_start: null,
          // time_end: null,
          // include_saturday: true,
          // include_sunday: true,
          // unpaid_breaks_in_minutes: "",
          // shift: "",
          auto_assign_at: null,
          selection_date: null,
          favorite_only: false,
          favorite_only_until: null
        },
        formError: []
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

        const profession = this.professions_categories
          .find(profession => profession.id.toString() === this.form.role.toString())
        
        if (!profession) {
          return null
        }

        return profession
      },

      selectedProfessionComplianceCategory () {
        if (!this.form.role) {
          return null
        }

        const profession = this.professions_categories
          .find(profession => profession.id.toString() === this.form.role.toString())
        
        if (!profession) {
          return null
        }

        const professionComplianceCategory = this.professionComplianceCategories
          .find(professionComplianceCategory => professionComplianceCategory.id === profession.profession_compliance_category_id)

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
        }
      },

      compliances () {
        if (!this.form.role) {
          return []
        }

        const profession = this.professions_categories
          .find(profession => profession.id.toString() === this.form.role.toString())
        
        if (!profession) {
          return []
        }

        const complianceDocuments = this.professionComplianceCategories
          .reduce((compliances, professionComplianceCategory) => {
            const {
              reference_compliance_documents: referenceComplianceDocuments,
              mandatory_compliance_documents: mandatoryComplianceDocuments,
              optional_compliance_documents: optionalComplianceDocuments,
            } = professionComplianceCategory

            if (professionComplianceCategory.id === this.selectedProfessionComplianceCategory.id) {
              [
                referenceComplianceDocuments,
                mandatoryComplianceDocuments,
                optionalComplianceDocuments,
              ].forEach((complianceDocuments) => {
                complianceDocuments.forEach((complianceDocument) => {
                  const {
                    id,
                    name,
                    compliance_document_type_name: complianceDocumentTypeName,
                    child_compliance_documents: childComplianceDocuments,
                  } = complianceDocument

                  if (complianceDocumentTypeName === 'Safeguarding') {
                    childComplianceDocuments.forEach((childComplianceDocument) => {
                      const {
                        id,
                        name,
                      } = childComplianceDocument

                      compliances.push({
                        label: name,
                        value: id
                      })
                    })
                  } else {
                    compliances.push({
                      label: name,
                      value: id
                    })
                  }
                })
              })
            }

            return compliances
          }, [])

        const complianceDocumentIds = complianceDocuments.map(({ value }) => value)

        return this.practiceProfessionComplianceCategoryComplianceDocuments
          .filter((practiceProfessionComplianceCategoryComplianceDocument) => {
            const {
              compliance_document_id: complianceDocumentId,
              profession_compliance_category_id: professionComplianceCategoryId,
            } = practiceProfessionComplianceCategoryComplianceDocument

            return professionComplianceCategoryId === this.selectedProfessionComplianceCategory.id
              && complianceDocumentIds.includes(complianceDocumentId)
          })
          .map((practiceProfessionComplianceCategoryComplianceDocument) => {
            const {
              compliance_document_id: complianceDocumentId,
              compliance_document_name: complianceDocumentName,
            } = practiceProfessionComplianceCategoryComplianceDocument

            return {
              label: complianceDocumentName,
              value: complianceDocumentId
            }
          })
      },

    },

    watch: {
      selectedProfessionComplianceCategory () {
        if (this.selectedProfessionComplianceCategory) {
          const defaultSelectedComplianceDocumentIds = this.practiceProfessionComplianceCategoryComplianceDocuments
            .filter(practiceProfessionComplianceCategoryComplianceDocument =>
              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                === this.selectedProfessionComplianceCategory.id
            )
            .map(practiceProfessionComplianceCategoryComplianceDocument =>
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
          this.$axios.get('/api/v1/practice/locums/count', {
            params: {
              profession_category_id: this.selectedProfession.profession_category.id,
              practice_locum_type: 'Favorite',
            },
          }).then((response) => {
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

      "form.rate" () {
        this.validateNumber(this.form.rate, "rate")
      },

      "form.total_hours" () {
        this.validateNumber(this.form.total_hours, "total_hours")
      },

      "form.time_start" (value) {
        console.log(value)
        // console.log(this.form.date_start, this.form.date_end)
        // if (this.form.date_start === this.form.date_end) {
        // console.log(this.form.time_start, this.form.time_end)
        // let fullDateStart = this.form.date_start
        // }
      },

      schedule(value) {
        console.log(value)
      },
      
      schedule_dates(value) {
        if (value.length) {
          let removedAnItem=false;
          this.schedule.forEach((sched, index) => {
            let dateStillExist = value.map(date => sched.date === date).includes(true)
            if (!dateStillExist) {
              this.schedule.splice(index, 1)
              removedAnItem=true
            }
          })
          if (!removedAnItem) {
            this.schedule.push({ date: value[value.length-1], shift_id: []})
          }
        }
        if (this.applyToAllDates) {
          this.editingDates = true
        }
      },

      "form.date_end" (value) {
        if (this.form.date_start && !this.$moment(this.form.date_start).isSameOrAfter(this.$moment(value))) {
          let diff = this.$moment(value).diff(this.$moment(this.form.date_start), 'days')
          this.selected_dates = []
          for (let i = 0; i <= diff; i++) {
            this.selected_dates.push(
              this.$moment(this.form.date_start)
                .add(i, "days")
                .format("DD/MM/YYYY")
            );
          }
        }
      },

       "form.date_start" (value) {
         if (this.form.date_end && !this.$moment(value).isSameOrAfter(this.$moment(this.form.date_start))) {
          let diff = this.$moment(this.form.date_end).diff(this.$moment(value), 'days')
          this.selected_dates = []
          for (let i = 0; i <= diff; i++) {
            this.selected_dates.push(
              this.$moment(value)
                .add(i, "days")
                .format("DD/MM/YYYY")
            );
          }
        }
       }


      // "form.date_end" (value) {
      //   let end = this.$moment(value, "YYYY-MM-DD")
      //   let days = []
      //   let startDay = this.$moment(this.form.date_start, "YYYY-MM-DD")
      //   while (startDay <= end) {
      //     days.push(startDay.day())
      //     startDay = startDay.clone().add(1, "d")
      //   }
      //   this.getListofDays(days)
      // },

      // "form.date_start" (value) {
      //   let start = this.$moment(value, "YYYY-MM-DD")
      //   let days = []
      //   let endDay = this.$moment(this.form.date_end, "YYYY-MM-DD")
      //   while (endDay >= start) {
      //     days.push(endDay.day())
      //     endDay = endDay.clone().subtract(1, "d")
      //   }
      //   this.getListofDays(days)
      // },

    },

    destroyed () {
      this.$store.commit("calendar/CLEAR_REPOST_JOB")
    },

    created () {
      this.dataLoading = true
      Promise.all([
        this.$axios.get('/api/v1/practice/me/practice-practices')
          .then((response) => response.data.data.practices.map(practice => ({
            label: practice.name,
            value: practice.id,
          }))),
        this.$axios.get('/api/v1/locum-detail-rate-types')
          .then((response) => response.data.data.locum_detail_rate_types.map(rateType => ({
            label: rateType.name,
            value: rateType.id,
          }))),
        this.$axios.get('/api/v1/shifts')
          .then((response) => response.data.data.shifts.map(shift => ({
            label: shift.name,
            value: shift.id,
          }))),
        this.$axios.get('/api/v1/professions')
          .then((response) => response.data.data.professions),
        this.$axios.get('/api/v1/practice/me/practice-profile')
          .then((response) => response.data.data.practice),
        this.$axios.get('/api/v1/profession-compliance-categories')
          .then((response) => {
            return response.data.data.profession_compliance_categories
          }),
      ]).then((responses) => {
        const [
          practiceLists,
          rateLists,
          shiftLists,
          professions,
          profileProfile,
          professionComplianceCategories,
        ] = responses

        this.practice_lists = practiceLists
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
          practice_profession_compliance_category_compliance_documents: practiceProfessionComplianceCategoryComplianceDocuments,
          mandatory_trainings: mandatoryTrainings,
        } = profileProfile

        this.form.report_to = reportTo
        this.form.email = email
        this.form.extra_information = extraInformation
        this.practiceProfessionComplianceCategoryComplianceDocuments = practiceProfessionComplianceCategoryComplianceDocuments

        this.mandatory_training_lists = mandatoryTrainings.map(mandatoryTraining => ({
          label: mandatoryTraining.name,
          value: mandatoryTraining.id
        }))

        if (this.repostJob) {
          const selectedProfession = this.professions_categories
            .find(profession => profession.id === this.repostJob.platform_job.profession.id)

          const selectedProfessionCategoryId = selectedProfession.profession_category.id
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

          this.form.rate = this.repostJob.rate
          this.form.total_hours = this.repostJob.total_hours
          this.form.locum_detail_rate_type_id = this.repostJob.locum_detail_rate_type.id
          this.form.ir35 = this.repostJob.platform_job.ir35

          this.form.mandatory_training_id = this.repostJob.platform_job.mandatory_trainings.map(
            item => item.id
          )
          this.form.role = this.repostJob.platform_job.profession.id

          this.repostJob.platform_job.qualifications.forEach(
            qualification => {
              this.form.specialty.push({
                label: qualification.name,
                value: qualification.id
              })
            }
          )
          this.repostJob.platform_job.clinical_systems.forEach(
            clinicalSystem => {
              this.form.clinical_system.push({
                label: clinicalSystem.name,
                value: clinicalSystem.id
              })
            }
          )

          this.repostJob.platform_job.spoken_languages.forEach(
            spokenLanguage => {
              this.form.spoken_language_id.push({
                label: spokenLanguage.name,
                value: spokenLanguage.id
              })
            }
          )

          const complianceDocumentIds = this.practiceProfessionComplianceCategoryComplianceDocuments
            .filter(practiceProfessionComplianceCategoryComplianceDocument =>
              practiceProfessionComplianceCategoryComplianceDocument.profession_compliance_category_id
                === selectedProfessionCategoryId
            )
            .map(({ compliance_document_id: complianceDocumentId }) => complianceDocumentId)

          this.$nextTick(() => {
            this.form.compliance_document_id = this.repostJob.platform_job.compliance_documents
              .map(complianceDocument => complianceDocument.id)
              .filter((complianceDocumentId) => complianceDocumentIds.includes(complianceDocumentId))
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
          if (this.repostJob.platform_job.unpaid_breaks_in_minutes === 0) {
            this.unpaid_breaks = false
          } else if (
            ![15, 30, 60].includes(
              this.repostJob.platform_job.unpaid_breaks_in_minutes
            )
          ) {
            this.unpaid_breaks = "other"
            this.form.unpaid_breaks_in_minutes = this.repostJob.platform_job.unpaid_breaks_in_minutes
          } else {
            this.unpaid_breaks = this.repostJob.platform_job.unpaid_breaks_in_minutes
          }

          this.form.shift = this.repostJob.shift.id

          this.form.auto_assign_at = this.repostJob.platform_job.auto_assign_at
          if (this.form.auto_assign_at) {
            this.auto_assign_job = true
          }

          if (this.repostJob.platform_job.selection_date) {
            this.selection_date.date = this.$moment().isBefore(
              this.repostJob.platform_job.selection_date
            )
              ? this.$moment(
                  this.repostJob.platform_job.selection_date
                ).format("YYYY-MM-DD")
              : null
            this.selection_date.time = this.$moment().isBefore(
              this.repostJob.platform_job.selection_date
            )
              ? this.$moment(
                  this.repostJob.platform_job.selection_date
                ).format("HH:mm")
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
      }).finally(() => {
        this.dataLoading = false
      })
    },

    methods: {
      shiftCheckAction(action, shifts, i, e) {
        let shift = this.schedule.find((item,index) => index === i)
        if (action === 'checked') {
          shift.shift_id.push(e.toString())
        }else if (action === 'unchecked') {
          let shift_id_index = shift.shift_id.findIndex(id => id === e)
          shift.shift_id.splice(shift_id_index, 1)
        }else if (action === 'unCheckAll') {
          shift.shift_id=[]
        }
      },
      applyToAll(shift) {
        shift.appliedToAll = !shift.appliedToAll 
        this.applyToAllDates = !this.applyToAllDates
        this.selected_dates = this.schedule_dates
         this.schedule.forEach( item => {
          if (shift.appliedToAll) {
            if (!item.shift_id.includes(shift.value.toString())) {
                item.shift_id.push(shift.value.toString())
              }
          }else {
            let index = item.shift_id.findIndex(id => id === shift.value.toString())
            if (index > -1) {
              item.shift_id.splice(index, 1)
            }
          }
        }) 
      },
      viewSchedule() {
        this.overlayData = []
        this.schedules.forEach(sched => {
            if (parseInt(this.form.locum_detail_rate_type_id) === 1) {
                this.overlayData.push({
                  date: sched.date,
                  shift_id: sched.shift_id,
                  time_start: sched.time_start,
                  time_end: sched.time_end,
                  rate: sched.rate
                })
            }else {
               this.overlayData.push({
                  date: sched.date,
                  shift_id: sched.shift_id,
                  time_start: sched.time_start,
                  time_end: sched.time_end,
                })
            }
          })
        this.schedules.forEach(item => {
          if (!this.schedule_dates.includes(item.date)) this.schedule_dates.push(item.date)
        })
        this.select_dates = !this.select_dates
      },
      removeSchedule(id, index) {
        let schedule = this.schedules.filter(sched => sched.shift_schedule !== id)
        this.schedules = schedule
        this.shift_schedule.splice(index, 1)
        if (this.select_dates) this.select_dates =false
      },
      addShiftSchedule() {
        // this.schedule_dates = []
        this.shift_schedule.push({
          value: (this.shift_schedule.length + 1).toString(),
          label: '',
          shift: "",
          time_start: '',
          time_end: '',
          locum_detail_rate_type_id: 0,
          rate: 0,
          appliedToAll: false,
        })
        // this.shift_schedule.push({
        //   id: this.shift_schedule.length + 1,
        //   rate: '',
        //   shift: "",
        //   time_start: '',
        //   time_end: '',
        // })
         this.$nextTick(() => {
					this.$refs.scheduleWrapper.scrollTop = this.$refs.scheduleWrapper.scrollHeight;
				});
      },  
      applyToDates(item, action) {
        this.selected_sched_shift = item.id
        this.selected_dates = this.schedule_dates
        if (action == 'select') {
          this.selected_dates = this.schedule_dates
          // Nested Format
          // this.selected_dates.forEach(date => {
          //   let dateExist = this.schedules.find(sched => sched.date === date)
          //   if (!dateExist) {
          //     this.schedules.push({
          //       shift_schedule: item.id,
          //       date: date,
          //       rate: item.rate,
          //       shifts: [{
          //         shift_id: item.shift,
          //         time_start: item.time_start,
          //         time_end: item.time_end
          //       }]
          //     })
          //   }else {
          //     dateExist.rate = item.rate
          //     console.log("dateExist", dateExist)
          //     console.log("item", item)
          //     let hasOverlap = false
          //     dateExist.shifts.forEach(shift => {
          //       let start_hour = shift.time_start.split(':')[0] 
          //       let end_hour = shift.time_end.split(':')[0] 
          //       let item_start_hour = item.time_start.split(':')[0] 
          //       let item_end_hour = item.time_end.split(':')[0] 
          //       if (item_start_hour >= item_start_hour && item_start_hour <= end_hour) {
          //         this.error_modal = true
          //         this.error_message = `Please check selected date and time.`
          //         hasOverlap = true
          //         return
          //       }else if (item_end_hour < item_start_hour) {
          //         this.error_modal = true
          //         this.error_message = `There's an error on time. Kindly check the start and end time.`
          //         return
          //       }
          //       else {
          //         console.log("---- input didnt overlap existing shift", date)
                  
          //       }
          //       console.log("hour", start_hour, end_hour)
          //       console.log("item", item_start_hour, item_end_hour)
          //     })
          //     if (!hasOverlap) {
          //       dateExist.shifts.push({
          //         shift_id: item.shift,
          //         time_start: item.time_start,
          //         time_end: item.time_end
          //       })
          //     }
          //   }
          // })

          // Flat format
          if (!this.applyToAllDates) {
            if (!this.schedules.find(sched => sched.shift_schedule === item.id)) {
              this.selected_dates.forEach(date => {
                if (parseInt(this.form.locum_detail_rate_type_id) === 1){
                  this.schedules.push({
                    shift_schedule: item.id,
                    date: date,
                    shift_id: item.shift,
                    time_start: item.time_start,
                    time_end: item.time_end,
                    rate: item.rate
                  })
                }else {
                  this.schedules.push({
                    shift_schedule: item.id,
                    date: date,
                    shift_id: item.shift,
                    time_start: item.time_start,
                    time_end: item.time_end,
                  })
                }
              })
            }else {
              this.selected_dates.forEach(date => {
                let existingSched = this.schedules.find(sched => sched.date === item.date)
                if (existingSched) {
                  existingSched.shift_id = item.shift
                  existingSched.time_start = item.time_start
                  existingSched.time_end = item.time_end
                  if (parseInt(this.form.locum_detail_rate_type_id) === 1){
                    existingSched.rate = item.rate
                  }
                }else {
                  if (parseInt(this.form.locum_detail_rate_type_id) === 1){
                    this.schedules.push({
                      shift_schedule: item.id,
                      date: date,
                      shift_id: item.shift,
                      time_start: item.time_start,
                      time_end: item.time_end,
                      rate: item.rate
                    })
                  }else {
                    this.schedules.push({
                      shift_schedule: item.id,
                      date: date,
                      shift_id: item.shift,
                      time_start: item.time_start,
                      time_end: item.time_end,
                    })
                  }
                }
              })
            }
          }else {
            this.selected_dates.forEach(date => {
              if (parseInt(this.form.locum_detail_rate_type_id) === 1){
                this.schedules.push({
                  shift_schedule: item.id,
                  date: date,
                  shift_id: item.shift,
                  time_start: item.time_start,
                  time_end: item.time_end,
                  rate: item.rate
                })
              }else {
                this.schedules.push({
                  shift_schedule: item.id,
                  date: date,
                  shift_id: item.shift,
                  time_start: item.time_start,
                  time_end: item.time_end,
                })
              }
            })
          }
          console.log("schedules", this.schedules)
          this.selected_sched_shift = ""
          this.selected_dates = []
          this.select_dates = false
        }else {
          this.schedule_dates = []
          let schedByShiftSched = this.schedules.filter(sched => sched.shift_schedule === item.id)
          this.overlayData = schedByShiftSched
          if (this.schedules.find(sched => sched.shift_schedule === item.id)) {
            this.schedules.forEach(sched => {
              if (sched.shift_schedule === item.id) {
                if (!this.schedule_dates.includes(sched.date)) this.schedule_dates.push(sched.date)
              }
            })
          }
          this.select_dates = true
        }
      },
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
          "ArrowRight"
        ]
        if (
          this.form[formField].length >= limit &&
          !acceptedKeys.includes(e.key)
        ) {
          e.preventDefault()
        }
      },

      // getListofDays (days) {
      //   if (days.includes(6) && days.length > 1) {
      //     this.show_saturday = true
      //     this.form.include_saturday = true
      //   } else if (days.includes(6) && days.length === 1) {
      //     this.show_saturday = false
      //     this.form.include_saturday = true
      //   } else if (!days.includes(6)) {
      //     this.show_saturday = false
      //     this.form.include_saturday = false
      //   }
      //   if (days.includes(0) && days.length > 1) {
      //     this.show_sunday = true
      //     this.form.include_sunday = true
      //   } else if (days.includes(0) && days.length === 1) {
      //     this.show_sunday = false
      //     this.form.include_sunday = true
      //   } else if (!days.includes(0)) {
      //     this.show_sunday = false
      //     this.form.include_sunday = false
      //   }
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
        let displayFieldName =
          fieldName.charAt(0).toUpperCase() +
          fieldName.slice(1).replace(/_/g, " ")
        let index = this.formError.findIndex(item => item.field === fieldName)
        if (
          parseInt(value) < 1 ||
          value.toString().includes("e") ||
          value === ""
        ) {
          this.formError.push({
            field: fieldName,
            message: `${displayFieldName} is invalid`
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
          "include_saturday",
          "include_sunday",
          "compliance_document_id",
          "auto_assign_at",
          "total_hours",
          "hours",
          "minutes",
          "favorite_only",
          "shift_id"
        ]
        if (!this.hasBanks) {
          this.form.favorite_only = false
          this.bank_first = false
          this.favorite_only_until.date = null
          this.favorite_only_until.time = null
        }

        // if (
        //   [15, "15", 30, "30", 60, "60", false, "false"].includes(
        //     this.unpaid_breaks
        //   )
        // ) {
        //   notRequired.push("unpaid_breaks_in_minutes")
        // }

        if (["true", true].includes(this.auto_assign_job)) {
          this.selection_notification = false
        }

        if (["false", false].includes(this.selection_notification)) {
          notRequired.push("selection_date")
        } else if (
          ["true", true].includes(this.selection_notification) &&
          this.selection_date.date &&
          this.selection_date.time
        ) {
          notRequired.push("selection_date")
        }

        if (["true", true].includes(this.form.favorite_only)) {
          this.bank_first = false
        }

        if (["false", false].includes(this.bank_first)) {
          notRequired.push("favorite_only_until")
        } else if (
          ["true", true].includes(this.bank_first) &&
          this.favorite_only_until.date &&
          this.favorite_only_until.time
        ) {
          notRequired.push("favorite_only_until")
        }

        // if (
        //   [0, "0"].includes(this.form.hours) &&
        //   [0, "0"].includes(this.form.minutes)
        // ) {
        //   this.formError.push({
        //     field: "minutes",
        //     message: "Minutes is required"
        //   })
        //   // this.formError.push({
        //   //   field: "hours",
        //   //   message: "Hours is required"
        //   // });
        // } else {
        //   this.form.hours = !this.form.hours ? 0 : this.form.hours
        //   this.form.minutes = !this.form.minutes ? 0 : this.form.minutes
        //   this.form.total_hours =
        //     this.form.hours * 60 + parseInt(this.form.minutes)
        // }

        this.form.schedules = []

        // this.schedules.forEach(sched => {
        //     if (parseInt(this.form.locum_detail_rate_type_id) === 1) {
        //         this.form.schedules.push({
        //           date: sched.date,
        //           shift_id: sched.shift_id,
        //           time_start: sched.time_start,
        //           time_end: sched.time_end,
        //           rate: sched.rate
        //         })
        //     }else {
        //        this.form.schedules.push({
        //           date: sched.date,
        //           shift_id: sched.shift_id,
        //           time_start: sched.time_start,
        //           time_end: sched.time_end,
        //         })
        //     }
        //   })
        this.schedule.forEach(sched => {
          sched.shift_id.forEach(id => {
            let shift = this.shift_schedule.find(shift => shift.value === id)
            this.form.schedules.push({
              date: sched.date,
              shift_id: shift.shift,
              time_start: shift.time_start,
              time_end: shift.time_end,
              locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
              rate: shift.rate
            })
          })
        })

        this.Validate(this.form, notRequired)

        if (!this.formError.length) {
          this.form.profession_id = this.form.role
          // this.form.shift_id = this.form.shift
          this.selectedClinicalSystem = [...this.form.clinical_system]
          this.form.clinical_system_id = this.form.clinical_system.map(
            item => item.value
          )
          this.selectedQualification = [...this.form.specialty]
          this.form.qualification_id = this.form.specialty.map(
            item => item.value
          )
          this.selectedSpokenLanguage = [...this.form.spoken_language_id]
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
          if (["true", true].includes(this.auto_assign_job)) {
            this.form.auto_assign_at = "1970-01-01 00:00"
          }

          this.form.selection_date = null
          if (["false", false].includes(this.auto_assign_job)) {
            if (["true", true].includes(this.selection_notification)) {
              this.form.selection_date = `${this.$moment(
                this.selection_date.date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD")} ${this.selection_date.time}`
            }
          }

          this.form.favorite_only_until = null
          if (["true", true].includes(this.bank_first)) {
            this.form.favorite_only_until = `${this.$moment(
              this.favorite_only_until.date,
              "YYYY-MM-DD"
            ).format("YYYY-MM-DD")} ${this.favorite_only_until.time}`
          }

          // if (["15", 15, "30", 30, "60", 60].includes(this.unpaid_breaks)) {
          //   this.form.unpaid_breaks_in_minutes = this.unpaid_breaks
          // }
          // if (this.unpaid_breaks === "other") {
          //   this.form.unpaid_breaks_in_minutes = this.form.unpaid_breaks_in_minutes
          // }
          // if (["false", false].includes(this.unpaid_breaks)) {
          //   this.form.unpaid_breaks_in_minutes = ""
          // }

          this.form.ir35 = this.selectedProfession && this.selectedProfession.profession_category.name === 'GP'
            ? this.form.ir35
            : false

          this.loading = true

          this.$axios
            .$post(`/api/v1/practice/jobs`, this.form)
            .then(res => {
              if (this.$route.name === "dashboard-create") {
                this.$router.push("/dashboard")
              } else if (this.$route.name !== "dashboard-create") {
                this.$store.commit("calendar/CREATE_JOB_MODAL", false)
              }

              this.$store.commit("jobs/ADD_PRACTICE_AVAILABLE_JOB", res.data.job)
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: ["Successfully created job"]
              })
            })
            .catch(err => {
              console.log("err", err.response || err)

              this.$refs.modalContainer.scrollTop = 0

              this.form.clinical_system = this.selectedClinicalSystem

              this.form.specialty = this.selectedQualification

              this.form.spoken_language_id = this.selectedSpokenLanguage

              this.form.session_requirements = this.form.session_requirements
                ? this.form.session_requirements.split(",")
                : []

              let message = null

              if (err.response) {
                if (err.response.status === 400 || err.response.data.error_messages) {
                  this.formError = err.response.data.error_messages
                } else {
                  message = err.response.data.message
                }
              } else if (err.request) {
                message = 'Something weng wrong!'
              } else {
                message = err.message
              }

              if (message) {
                this.$store.commit('SET_NOTIFICATION', {
                  enabled: true,
                  status: 'danger',
                  text: [`${message}`],
                })
              }

            }).finally(() => {
              this.loading = false
            })
        } else {
          console.log("errors", this.formError)
          this.$nextTick(() => {
            this.$refs.modalContainer.scrollTop = 0
          })
        }
      },

    },

  }
</script>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden auto;
    transition: all 0.3s ease-in-out;
    scroll-behavior: smooth;
  }
  .err-shield {
    background-color: rgba(0, 0, 0, .40)
  }
</style>