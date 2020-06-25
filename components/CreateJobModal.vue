<template>
	<transition name="slide" mode="out-in">
		<div ref="modalContainer" class="wrapper p-4 md:p-8">
			<div>
				<svgicon name="left-arrow" height="32" width="32" class="cursor-pointer" @click="close" />
			</div>

			<div class="flex justify-between items-center font-bold text-sm sm:text-xl mt-8">
				Create a new job
				<div class="flex text-sm">
					<p
						class="px-3 py-2 bg-green-500"
						:class="tabActive !== 'details' ? 'text-green-200 border-r' : 'text-white font-bold'"
					>1. Job Details</p>
					<p
						class="px-3 py-2"
						:class="tabActive !== 'schedule' ? 'text-gray-500' : 'bg-green-500 text-white font-bold'"
					>2. Job Schedule</p>
				</div>
			</div>
			<transition name="fade">
				<div
					class="message-modal job-notification bg-white p-4 rounded font-bold text-gray-700"
					v-if="toPublish"
				>
					<p
						class="text-center pb-2 mb-4 border-b-2 border-gray-600 text-lg font-bold"
					>JOB NOTIFICATION SUMMARY</p>
					<div class="px-4">
						<div class="flex justify-between pb-2">
							<p>Total Working Hours:</p>
							<p class="pl-1">{{ total_working_hours | hoursMinutes}}</p>
						</div>
						<div class="flex justify-between pb-2">
							<p>Total Gross Locum Wages:</p>
							<p class="pl-1">£ {{ total_gross_locum_wages | currency }}</p>
						</div>
						<div class="flex justify-between pb-2">
							<p>
								Hubzz Fee*
								<span class="font-normal text-sm">(£{{ practice_rate.toFixed(2) }} per hour)</span>:
							</p>
							<p class="pl-1">£ {{ hubzz_fee | currency }}</p>
						</div>
					</div>
					<div class="flex justify-end items-center text-black mt-3">
						<AppButton :label="'Cancel'" class="mr-1" :disabled="loading" @click="toPublish=false" />
						<AppButton :label="'Confirm & Publish'" :disabled="loading" @click="createJob" />
					</div>
				</div>
			</transition>
			<div class="shield" v-if="toPublish"></div>

			<transition name="slide">
				<div v-if="tabActive === 'details'" class="relative flex flex-row flex-wrap justify-start mt-8">
					<AppLoading :loading="dataLoading" spinner />
					<template v-if="!dataLoading">
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

								<div class="flex flex-col">
									<h4 class="font-bold mt-4">Criteria</h4>
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

											<template v-if="form.practice_id">
												<div class="relative flex flex-col pt-2">
													<div class>Compliance documents</div>
												</div>

												<!-- <div v-if="true" class="flex flex-row flex-wrap justify-bettwen">
                          <template v-if="selectedProfessionComplianceCategory">
                            <div class="flex flex-col w-full px-2">
                              <div>For {{ selectedProfessionComplianceCategory.name }}:</div>
                              <div class="ml-4">
                                <input
                                  :id="`${selectedProfessionComplianceCategory.id}-${selectedProfessionComplianceCategory.name}`"
                                  v-model="emptyComplianceDocumentId"
                                  type="checkbox"
                                  :disabled="emptyComplianceDocumentId"
                                />
                                <label
                                  :for="`${selectedProfessionComplianceCategory.id}-${selectedProfessionComplianceCategory.name}`"
                                >N/A</label>
                              </div>
                              <div class="ml-2">Reference</div>
                              <template
                                v-for="complianceDocument in selectedProfessionComplianceCategory.reference_compliance_documents"
                              >
                                <div
                                  :key="`${complianceDocument.id}-${complianceDocument.name}`"
                                  class="ml-4 flex flex-row justify-start items-center"
                                >
                                  <input
                                    :id="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                    v-model="form.compliance_document_id"
                                    type="checkbox"
                                    :value="complianceDocument.id"
                                  />
                                  <label
                                    :for="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                  >{{ complianceDocument.name }}</label>
                                </div>
                              </template>
                              <div class="ml-2">Mandatory</div>
                              <template
                                v-for="complianceDocument in selectedProfessionComplianceCategory.mandatory_compliance_documents"
                              >
                                <div
                                  v-if="complianceDocument.compliance_document_type_name !== 'Safeguarding'"
                                  :key="`${complianceDocument.id}-${complianceDocument.name}`"
                                  class="ml-4 flex flex-row justify-start items-center"
                                >
                                  <input
                                    :id="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                    v-model="form.compliance_document_id"
                                    type="checkbox"
                                    :value="complianceDocument.id"
                                  />
                                  <label
                                    :for="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                  >{{ complianceDocument.name }}</label>
                                </div>
                                <div
                                  v-for="childComplianceDocument in complianceDocument.child_compliance_documents"
                                  v-if="complianceDocument.compliance_document_type_name === 'Safeguarding'"
                                  :key="`${childComplianceDocument.id}-${childComplianceDocument.name}`"
                                  class="ml-4 flex flex-row justify-start items-center"
                                >
                                  <input
                                    :id="`${childComplianceDocument.id}-${childComplianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                    v-model="form.compliance_document_id"
                                    type="checkbox"
                                    :value="childComplianceDocument.id"
                                  />
                                  <label
                                    :for="`${childComplianceDocument.id}-${childComplianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                  >{{ childComplianceDocument.name }}</label>
                                </div>
                              </template>
                              <div class="ml-2">Optional</div>
                              <template
                                v-for="complianceDocument in selectedProfessionComplianceCategory.optional_compliance_documents"
                              >
                                <div
                                  :key="`${complianceDocument.id}-${complianceDocument.name}`"
                                  class="ml-4 flex flex-row justify-start items-center"
                                >
                                  <input
                                    :id="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                    v-model="form.compliance_document_id"
                                    type="checkbox"
                                    :value="complianceDocument.id"
                                  />
                                  <label
                                    :for="`${complianceDocument.id}-${complianceDocument.name}-${selectedProfessionComplianceCategory.id}`"
                                  >{{ complianceDocument.name }}</label>
                                </div>
                              </template>
                            </div>
                          </template>
												</div>-->

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

											<template v-else-if="!form.practice_id">
												<div class="mb-2">Compliance Documents</div>
												<div class="mb-4 text-sm">Please Select a Practice first</div>
											</template>
										</template>
									</div>
								</div>

								<div class="flex flex-col">
									<h4 class="font-bold mt-4">Duration</h4>
									<div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
										<template v-if="['false', false].includes(auto_assign_job)">
											<AppInput
												v-model="selection_notification"
												:type="'select'"
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
												<div
													v-if="bank_first === true || bank_first === 'true'"
													class="flex flex-row flex-wrap justify-between items-end"
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
							<h4 class="font-bold mt-4">Overview</h4>

							<div class="bg-white rounded-lg shadow-lg px-4 md:px-8 py-4 mt-4">
								<AppInput v-model="form.title" :type="'text'" :name="'title'" :label="'Title'" />

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

								<!-- <div class="flex flex-row flex-wrap justify-start items-center mt-4 max-w-2xl">
									<div class="px-1 w-full">
										<AppInput
											v-model="form.rate"
											:type="'text'"
											:name="'rate'"
											:label="'Rate £'"
											:min="1"
											:error="formError.find(item => item.field === 'rate')"
											:in-style="'text-align:right'"
											:limit="8"
											required
											@blur="CheckEmptyField(form.rate,'rate')"
											@keydown="isNumber($event)"
										/>
									</div>

									<div class="px-1 w-full">
										<AppInput
											v-model="form.locum_detail_rate_type_id"
											:type="'select'"
											:name="'locum_detail_rate_type_id'"
											:label="'per'"
											:items="rate_lists"
											required
										/>
									</div>
								</div>

								<label class="text-sm">
									Total hours
									<span class="text-red-500">*</span>
								</label> 
								<div class="flex flex-row flex-wrap justify-start mt-1">
									<div class="flex items-center mr-2">
										<div class="flex flex-col">
											<input
												v-model="form.hours"
												type="number"
												class="border-b-2 focus:border-yellow-400 focus:outline-none font-bold py-2 text-xs sm:text-sm mx-1 shadow-none"
												:class="formError.find(item => item.field === 'hours')? 'border-red-500':''"
												style="text-align:right;"
												min="1"
												maxlength="8"
												@keydown="inputNumberOnly($event), handleKeyDownEvent($event, 'hours', 8)"
												@focus="hasValue(form.hours, 'hours')"
											/>
											<div
												v-if="formError.find(item => item.field === 'hours')"
												class="text-red-500 p-1 text-xs"
											>{{ formError.find(item => item.field === 'hours').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'hours').message.slice(1).replace(/_/g, " ") }}</div>
											<label for="hours" class="text-xs sm:text-sm mt-2">hours</label>
										</div>
									</div>
									<div class="flex items-center">
										<div class="flex flex-col">
											<input
												v-model="form.minutes"
												type="number"
												class="border-b-2 focus:border-yellow-400 focus:outline-none font-bold py-2 text-xs sm:text-sm mx-1 shadow-none"
												:class="formError.find(item => item.field === 'minutes')? 'border-red-500':''"
												style="text-align:right;"
												max="60"
												min="1"
												maxlength="2"
												@keydown="inputNumberOnly($event), handleKeyDownEvent($event, 'minutes', 2)"
												@focus="hasValue(form.minutes, 'minutes')"
											/>
											<div
												v-if="formError.find(item => item.field === 'minutes')"
												class="text-red-500 p-1 text-xs"
											>{{ formError.find(item => item.field === 'minutes').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'minutes').message.slice(1).replace(/_/g, " ") }}</div>
											<label for="minutes" class="text-xs sm:text-sm mt-2">minutes</label>
										</div>
									</div>
								</div>-->

								<template v-if="selectedProfession && selectedProfession.profession_category.name === 'GP'">
									<AppInput
										v-model="form.ir35"
										:type="'select'"
										:name="'ir35'"
										:label="'IR35 - role inside or outside of scope'"
										:items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
									/>
								</template>

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
								</template>

								<template v-else-if="!form.practice_id">
									<div class="mb-2">Mandatory Training List</div>
									<div class="mb-4 text-sm">Please Select a Practice first</div>
								</template>

								<div class="mb-6 text-center md:text-left">
									<AppButton :label="'Go to Profile to add items here'" @click="goToProfile" />
								</div>
							</div>
						</div>

						<!-- <div class="pt-4 pb-8 w-full flex">
                <AppButton
                  v-if="authPermissions.includes('Create Sessions Job')"
                  class="ml-auto"
                  :label="'Save and publish Job'"
                  :disabled="loading"
                  @click="createJob"
                />
						</div>-->
						<div class="pt-4 pb-8 w-full flex">
							<AppButton class="ml-auto" :label="'Next'" :disabled="loading" @click="next" />
						</div>
					</template>
				</div>
				<div v-if="tabActive === 'schedule'">
					<AppSchedules
						:shifts="shifts"
						:rate_lists="rate_lists"
						@getSchedule="getSchedule"
						:schedule="form.schedules"
						:error="formError.find(err => err.field === 'schedules')"
						:shiftErrors="shiftErrors"
						:type="'create'"
					/>
					<div class="pt-4 pb-8 w-full flex justify-between">
						<AppButton class="mr-2" :label="'Back'" :disabled="loading" @click="tabActive='details'" />
						<AppButton
							:disabled="!form.schedules.length || loading"
							v-if="authPermissions.includes('Create Sessions Job')"
							:label="'Publish'"
							@click="canPublish"
						/>
					</div>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppDate from "@/components/Base/AppDate";
import AppMultipleDates from "@/components/Base/AppMultipleDates";
import AppSchedule from "@/components/Base/AppSchedule";
import AppSchedules from "@/components/Base/AppSchedules";
import AppButton from "@/components/Base/AppButton";
import AppTime from "@/components/Base/AppTime";
import AppLoading from "@/components/Base/AppLoading";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import JobPartDetailModalInfoVue from "./Jobs/JobPart/JobPartDetailModalInfo.vue";

const session_requirements_lists = [
	{ label: "Practice admin", value: "Practice admin" },
	{ label: "Telephone triage", value: "Telephone triage" },
	{ label: "Home visits", value: "Home visits" }
];

export default {
	components: {
		AppInput,
		AppFilterSearch,
		AppMultipleDates,
		AppSchedule,
		AppSchedules,
		AppDate,
		AppButton,
		AppTime,
		AppLoading,
		AppConfirmationModal
	},

	data() {
		return {
			banksCount: 0,
			loading: false,
			dataLoading: false,

			// show_saturday: false,
			// show_sunday: false,

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
				time: null
			},
			favorite_only_until: {
				date: null,
				time: null
			},

			selectedQualification: [],
			selectedClinicalSystem: [],
			selectedSpokenLanguage: [],

			// SPLIT JOBS
			tabActive: "details",
			hasShiftError: false,
			total_working_hours: 0,
			total_gross_locum_wages: 0,
			shiftErrors: [],
			toPublish: false,
			schedules: [],
			job_parts: [],

			// schedule_dates: [],
			// shift_schedule: [],
			// initial_schedule: [],
			// {
			//   value: "1",
			//   label: 'Sample Shift',
			//   shift: 1,
			//   time_start: '00:00',
			//   time_end: '10:00',
			//   locum_detail_rate_type_id: 1,
			//   rate: 50,
			//   appliedToAll: false,
			// }
			// select_dates: false, //Not used
			// selected_dates: [], //Not used
			// schedules: [],
			// schedule: [],
			// selected_sched_shift: "", //Not used
			// overlayData: [],
			// applyToAllDates: false, //Not used
			// editingDates: false, //Not used
			// showShifts: false,
			// confirmClosing: false,
			// shiftError: [],
			// shift_saving: "",
			// editShiftId: "",
			// savedShifts: [],

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
				other_mandatory_training_id: [],
				role: "",
				specialty: [],
				clinical_system: [],
				spoken_language_id: [],
				compliance_document_id: [],
				// dates: [],
				schedules: [],
				schedule_templates: [],
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
		};
	},

	computed: {
		authPermissions() {
			return this.$store.getters["permissions"];
		},

		repostJob() {
			return this.$store.state.calendar.repost_job;
		},

		hasBanks() {
			return this.banksCount > 0 ? true : false;
		},

		complianceListLabel() {
			return `For ${this.selectedProfession.profession_compliance_category_name}:`;
		},

		selectedProfession() {
			if (!this.form.role) {
				return null;
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
			);

			if (!profession) {
				return null;
			}

			return profession;
		},

		selectedProfessionComplianceCategory() {
			if (!this.form.role) {
				return null;
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
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
			if (!this.form.role) {
				return [];
			}

			const profession = this.professions_categories.find(
				profession => profession.id.toString() === this.form.role.toString()
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
			let profession = this.professions.find(
				item => item.value.toString() === this.form.role.toString()
			);
			let practice_rates = this.$auth.user.practice_detail.practice
				.practice_rates;
			let practice_rate = practice_rates.find(
				item => item.type === profession.label
			);
			let rate = 0;
			if (practice_rate) {
				rate = practice_rate.rate;
			} else {
				rate = practice_rates[practice_rates.length - 1].rate;
			}
			return rate;
		},

		hubzz_fee() {
			if (this.form.role) {
				let hours = this.total_working_hours / 60;
				return (hours * this.practice_rate).toFixed(2);
			}
			return 0;
		}
	},

	watch: {
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
			} else {
				this.form.compliance_document_id = [];
			}
		},
		async "form.role"(newValue, oldValue) {
			this.CheckEmptyField(newValue, "role");

			if (newValue && oldValue) {
				this.form.specialty = [];
			}
		},
		selectedProfession() {
			if (this.selectedProfession) {
				this.$axios
					.get("/api/v1/practice/locums/count", {
						params: {
							profession_category_id: this.selectedProfession
								.profession_category.id,
							practice_locum_type: "Favorite"
						}
					})
					.then(response => {
						this.banksCount = response.data.data.count;
					});
			}
		},
		"form.specialty"(value) {
			this.CheckEmptyField(value, "specialty");
		},
		"form.clinical_system"(value) {
			this.CheckEmptyField(value, "clinical_system");
		},
		"form.time_start"(value) {
			console.log(value);
			// console.log(this.form.date_start, this.form.date_end)
			// if (this.form.date_start === this.form.date_end) {
			// console.log(this.form.time_start, this.form.time_end)
			// let fullDateStart = this.form.date_start
			// }
		},
		schedule(value) {
			console.log(value);
		},
		schedule_dates(value) {
			if (value.length) {
				let removedAnItem = false;
				this.schedule.forEach((sched, index) => {
					let dateStillExist = value
						.map(date => sched.date === date)
						.includes(true);
					if (!dateStillExist) {
						this.schedule.splice(index, 1);
						removedAnItem = true;
					}
				});
				if (!removedAnItem) {
					this.schedule.push({ date: value[value.length - 1], shift_id: [] });
				}
			}
			if (this.applyToAllDates) {
				this.editingDates = true;
			}
		},
		toEditShift(newValue, oldValue) {
			console.log("watch toEditShift", newValue, oldValue);
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

	destroyed() {
		this.$store.commit("calendar/CLEAR_REPOST_JOB");
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
					// practice_profession_compliance_category_compliance_documents: practiceProfessionComplianceCategoryComplianceDocuments,
					// mandatory_trainings: mandatoryTrainings,
					// other_mandatory_trainings: otherMandatoryTrainings
				} = profileProfile;

				this.form.report_to = reportTo;
				this.form.email = email;
				this.form.extra_information = extraInformation;
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
					);

					const selectedProfessionCategoryId =
						selectedProfession.profession_category.id;
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
						this.form.session_requirements = this.repostJob.platform_job
							.session_requirements
							? this.repostJob.platform_job.session_requirements.split(",")
							: [];
					}
					this.form.session_structure_information = this.repostJob.platform_job.session_structure_information;
					this.form.extra_information = this.repostJob.platform_job.extra_information;

					// this.form.rate = this.repostJob.rate;
					// this.form.total_hours = this.repostJob.total_hours;
					// this.form.locum_detail_rate_type_id = this.repostJob.locum_detail_rate_type.id;
					this.form.ir35 = this.repostJob.platform_job.ir35;

					this.form.mandatory_training_id = this.repostJob.platform_job.mandatory_trainings.map(
						item => item.id
					);
					this.form.role = this.repostJob.platform_job.profession.id;

					this.repostJob.platform_job.qualifications.forEach(qualification => {
						this.form.specialty.push({
							label: qualification.name,
							value: qualification.id
						});
					});
					this.repostJob.platform_job.clinical_systems.forEach(
						clinicalSystem => {
							this.form.clinical_system.push({
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
						this.form.compliance_document_id = this.repostJob.platform_job.compliance_documents
							.map(complianceDocument => complianceDocument.id)
							.filter(complianceDocumentId =>
								complianceDocumentIds.includes(complianceDocumentId)
							);
					});

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

					this.form.auto_assign_at = this.repostJob.platform_job.auto_assign_at;
					if (this.form.auto_assign_at) {
						this.auto_assign_job = true;
					}

					if (this.repostJob.platform_job.selection_date) {
						this.selection_date.date = this.$moment().isBefore(
							this.repostJob.platform_job.selection_date
						)
							? this.$moment(this.repostJob.platform_job.selection_date).format(
									"YYYY-MM-DD"
							  )
							: null;
						this.selection_date.time = this.$moment().isBefore(
							this.repostJob.platform_job.selection_date
						)
							? this.$moment(this.repostJob.platform_job.selection_date).format(
									"HH:mm"
							  )
							: null;
					}

					if (this.repostJob.favorite_only) {
						this.form.favorite_only = true;
					} else if (
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
					}
				}
			})
			.finally(() => {
				this.dataLoading = false;
			});
	},

	methods: {
		// FOR APP SCHEDULE COMPONENT
		getScheduleTemplates(shift_schedule) {
			console.log("shift_schedule", shift_schedule);
			this.form.schedule_templates = [];
			shift_schedule.forEach(shift => {
				this.form.schedule_templates.push({
					name: shift.label,
					shift_id: shift.shift_id,
					time_start: shift.time_start,
					time_end: shift.time_end,
					locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
					rate: shift.rate
				});
			});
		},
		getInitialSchedule(payload) {
			this.form.schedules = [];
			if (payload.schedule) {
				payload.schedule.forEach(sched => {
					sched.shift_id.forEach(id => {
						let shift = payload.shift_schedule.find(
							shift => shift.value === id
						);
						this.form.schedules.push({
							date: sched.date,
							shift_id: shift.shift_id,
							time_start: shift.time_start,
							time_end: shift.time_end,
							locum_detail_rate_type_id: shift.locum_detail_rate_type_id,
							rate: shift.rate,
							schedule_template_name: shift.label
						});
					});
				});
			}
		},
		// revised app schedule
		next() {
			this.formError = [];
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
				"unpaid_breaks_in_minutes"
			];
			if (!this.hasBanks) {
				this.form.favorite_only = false;
				this.bank_first = false;
				this.favorite_only_until.date = null;
				this.favorite_only_until.time = null;
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
			console.log("formError", this.formError);
			if (!this.formError.length) {
				this.tabActive = "schedule";
			} else {
				this.$nextTick(() => {
					this.$refs.modalContainer.scrollTop = 0;
				});
			}
		},
		getSchedule(
			schedule,
			total_gross_locum_wages,
			total_working_hours,
			hasError,
			job_parts
		) {
			this.form.schedules = [];
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
						this.form.schedules.push({
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
			this.job_parts = job_parts;
		},
		canPublish() {
			this.shiftErrors = [];
			this.formError = [];
			let has_conflict = false;
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
			if (!this.shiftErrors.length) {
				this.form.profession_id = this.form.role;
				this.form.shift_id = this.form.shift;
				this.selectedClinicalSystem = [...this.form.clinical_system];
				this.form.clinical_system_id = this.form.clinical_system.map(
					item => item.value
				);
				this.selectedQualification = [...this.form.specialty];
				this.form.qualification_id = this.form.specialty.map(
					item => item.value
				);
				this.selectedSpokenLanguage = [...this.form.spoken_language_id];
				this.form.spoken_language_id = this.form.spoken_language_id.map(
					item => item.value
				);

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
				this.$axios
					.$post(`/api/v1/practice/jobs/check`, {
						...this.form,
						old_job_id: this.repostJob ? this.repostJob.id : null
					})
					.then(res => {
						if (
							!this.shiftErrors.length &&
							!this.hasShiftError &&
							!this.formError.length &&
							!has_conflict
						) {
							this.toPublish = true;
						}
						this.loading = false;
					})
					.catch(err => {
						console.log("err", err.response || err);

						this.$refs.modalContainer.scrollTop = 0;

						this.form.clinical_system = this.selectedClinicalSystem;

						this.form.specialty = this.selectedQualification;

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
								this.shiftErrors = err.response.data.error_messages;
								let detailsError = [
									"practice_id",
									"number_of_patients",
									"duration_for_each_appointment",
									"role",
									"specialty",
									"clinical_system"
								];
								let sched_has_conflict = this.shiftErrors.find(
									err => err.field === "schedules"
								);
								if (sched_has_conflict) {
									has_conflict = true;
									sched_has_conflict.conflictSchedules.forEach(item => {
										this.shiftErrors.push({
											field: `conflict-${this.$moment(
												item.date,
												"YYYY-MM-DD"
											).format("DD/MM/YYYY")}-${item.index}`,
											message:
												"This schedule has a conflict with another schedule."
										});
									});
									let conflictDates = sched_has_conflict.conflictSchedules
										.map(item => item.date)
										.filter(item => item);
									let job_parts = [];
									conflictDates.forEach(date => {
										let job_part = this.job_parts.find(item =>
											item.dates.includes(date)
										);
										if (!job_parts.includes(job_part.value)) {
											job_parts.push(job_part.value);
										}
									});

									console.log(job_parts);
									console.log(JSON.stringify(job_parts).join(","));
									console.log(conflictDates, this.job_parts);
									this.$store.commit("SET_NOTIFICATION", {
										enabled: true,
										status: "danger",
										text: [`Conflict schedule on Job Part/s ()`],
										duration: 3000
									});
								}
							} else {
								message = err.response.data.message;
							}
							if (this.shiftErrors.length) {
								let sched_has_conflict = this.shiftErrors.find(
									err => err.field === "schedules"
								);
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
						this.loading = false;
					});
			}
			if (this.shiftErrors.length) {
				let has_empty_sched_dates = this.shiftErrors.filter(err =>
					err.field.includes("shift-")
				);
				let job_parts = [];
				if (has_empty_sched_dates.length) {
					has_empty_sched_dates.forEach(err => {
						let empty_date = err.field.split("-")[1];
						let job_part = this.job_parts.find(part =>
							part.dates.includes(
								this.$moment(empty_date, "DD/MM/YYYY").format("YYYY-MM-DD")
							)
						);
						let exist = job_parts.find(item => item === `${job_part.value}`);
						if (job_part && !exist) {
							job_parts.push(`${job_part.value}`);
						}
					});
					let partsLabel = "";
					job_parts.forEach((item, index) => {
						if (job_parts.length > 1) {
							if (index !== job_parts.length - 1) {
								partsLabel += `${item}, `;
							} else if (index === job_parts.length - 1) {
								partsLabel += `${item}`;
							}
							//  else {
							// partsLabel += ` and ${item}`;
							// }
						} else {
							partsLabel += item;
						}
					});
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: [`Empty schedule on Job Part/s (${partsLabel})`],
						duration: 3000
					});
				}
			}
		},
		// -- END FOR APP SCHEDULE COMPONENT
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
		getListofDays(days) {
			// if (days.includes(6) && days.length > 1) {
			//   this.show_saturday = true
			//   this.form.include_saturday = true
			// } else if (days.includes(6) && days.length === 1) {
			//   this.show_saturday = false
			//   this.form.include_saturday = true
			// } else if (!days.includes(6)) {
			//   this.show_saturday = false
			//   this.form.include_saturday = false
			// }
			// if (days.includes(0) && days.length > 1) {
			//   this.show_sunday = true
			//   this.form.include_sunday = true
			// } else if (days.includes(0) && days.length === 1) {
			//   this.show_sunday = false
			//   this.form.include_sunday = true
			// } else if (!days.includes(0)) {
			//   this.show_sunday = false
			//   this.form.include_sunday = false
			// }
		},

		close() {
			this.$store.commit("calendar/CREATE_JOB_MODAL", false);
			this.$store.commit("calendar/CREATE_JOB_SURGERY_MODAL", false);
			this.$store.commit("calendar/CLEAR_REPOST_JOB");
			this.$emit("close");
		},

		goToProfile() {
			this.$store.commit("calendar/CREATE_JOB_MODAL", false);
			this.$store.commit("calendar/CLEAR_REPOST_JOB");
			window.open("/profile", "_blank");
		},

		uncheckMandatory(value) {
			this.form.mandatory_training_id = this.form.mandatory_training_id.filter(
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

		createJob() {
			this.formError = [];
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
				"unpaid_breaks_in_minutes"
			];
			if (!this.hasBanks) {
				this.form.favorite_only = false;
				this.bank_first = false;
				this.favorite_only_until.date = null;
				this.favorite_only_until.time = null;
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

			if (!this.formError.length) {
				this.form.profession_id = this.form.role;
				this.form.shift_id = this.form.shift;
				this.selectedClinicalSystem = [...this.form.clinical_system];
				this.form.clinical_system_id = this.form.clinical_system.map(
					item => item.value
				);
				this.selectedQualification = [...this.form.specialty];
				this.form.qualification_id = this.form.specialty.map(
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

				this.$axios
					.$post(`/api/v1/practice/jobs`, {
						...this.form,
						old_job_id: this.repostJob ? this.repostJob.id : null
					})
					.then(res => {
						if (this.$route.name === "dashboard-create") {
							this.$router.push("/dashboard");
						} else if (this.$route.name !== "dashboard-create") {
							this.$store.commit("calendar/CREATE_JOB_MODAL", false);
						}

						this.$store.commit("jobs/ADD_PRACTICE_AVAILABLE_JOB", res.data.job);

						if (this.repostJob) {
							this.$store.commit(
								"jobs/REMOVE_PRACTICE_UNFILLED_JOB",
								this.repostJob.id
							);
						}
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: ["Successfully created job"]
						});
					})
					.catch(err => {
						console.log("err", err.response || err);

						this.$refs.modalContainer.scrollTop = 0;

						this.form.clinical_system = this.selectedClinicalSystem;

						this.form.specialty = this.selectedQualification;

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
								let detailsError = [
									"practice_id",
									"number_of_patients",
									"duration_for_each_appointment",
									"role",
									"specialty",
									"clinical_system"
								];
								let hasDetailsError = this.formError
									.map(err => detailsError.includes(err.field))
									.includes(true);
								if (hasDetailsError) {
									this.tabActive = "details";
								} else if (
									this.formError
										.map(err => ["schedules", "dates"].includes(err.field))
										.includes(true)
								) {
									this.tabActive = "schedule";
								}
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
					})
					.finally(() => {
						this.toPublish = false;
						this.loading = false;
					});
			} else {
				let detailsError = [
					"practice_id",
					"number_of_patients",
					"duration_for_each_appointment",
					"role",
					"specialty",
					"clinical_system"
				];
				let hasDetailsError = this.formError
					.map(err => detailsError.includes(err.field))
					.includes(true);
				if (hasDetailsError) {
					this.tabActive = "details";
				}
				console.log("errors", this.formError);
				this.toPublish = false;
				this.$nextTick(() => {
					this.$refs.modalContainer.scrollTop = 0;
				});
			}
		}
	}
};
</script>

<style scoped>
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