<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="w-full p-0 lg:w-2/3 lg:pr-4 order-2 lg:order-1">
      <div class="relative rounded-lg shadow-lg w-full p-4 md:p-8">
        <AppLoading :loading="loading" spinner />

        <AppFormError v-if="formError.length > 0" :formError="formError" />

        <form v-if="!loading && user" class="w-full">
          <div>Profession</div>

          <div class="ml-2 font-bold my-2 mb-4">
            {{ user.profession.name }}
          </div>

          <AppInput
            v-if="false"
            v-model="form.profession_id"
            :type="'select'"
            :name="'profession_id'"
            :label="'Profession'"
            :placeholder="'Select...'"
            :items="professionsSelectionList"
            required
            :disabled="false"
          />

          <AppFilterSearch
            v-if="selectedProfession && selectedProfession.sub_professionable"
            v-model="selectedSubProfessionsSelectionList"
            label="Sub Professions"
            placeholder="Select..."
            :error="formError.find(item => item.field === 'sub_profession_ids')"
            info="Choose other professions if applicable"
            :selectionLists="subProfessionsSelectionList"
          />

          <div
            v-for="referenceLocumComplianceDocument in referenceLocumComplianceDocuments"
            :key="referenceLocumComplianceDocument.compliance_document_id"
          >
            <AppInput
              v-model="referenceLocumComplianceDocument.reference"
              type="text"
              :name="referenceLocumComplianceDocument.compliance_document_name.replace(/ /g, '_').toLowerCase()"
              :label="referenceLocumComplianceDocument.compliance_document_name"
              :error="formError.find(err => err.field === referenceLocumComplianceDocument.compliance_document_name.replace(/ /g, '_').toLowerCase())"
              :info="'For compliance; to be verified by the hubzz team'"
              :limit="getReferenceLimit(referenceLocumComplianceDocument.compliance_document_name)"
              required
              @blur="checkReferenceLocumCompliance(referenceLocumComplianceDocument.compliance_document_name)"
              @keydown="getReferenceIsInteger(referenceLocumComplianceDocument.compliance_document_name) ? inputNumberOnly($event) : alphaNumeric($event)"
            />
          </div>

          <AppFilterSearch
            v-model="form.qualification_id"
            :name="'qualification_id'"
            :label="'Specialty'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'qualification_id')"
            :info="'Choose at least one qualification'"
            :url="'/api/v1/qualifications'"
            :professionCategoryId="true ? null : professionCategoryId.toString()"
            required
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
            required
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

          <AppInput
            v-model="form.nhs_smart_card_id_number"
            :type="'text'"
            :name="'nhs_smart_card_id_number'"
            :label="'Your NHS Smart Card ID number'"
            :error="formError.find(item => item.field === 'nhs_smart_card_id_number')"
            :limit="12"
            @keydown="inputNumberOnly($event)"
            @submit="updateLocumProfile"
          />

          <AppInput
            v-model="form.headline"
            :type="'text'"
            :name="'headline'"
            :label="'Headline'"
            :info="'A short headline about yourself to show to Practices'"
            @submit="updateLocumProfile"
          />

          <AppInput
            v-model="form.short_biography"
            :type="'textarea'"
            :name="'short_biography'"
            :label="'Short Biography'"
            :info="'A little bit about yourself to inform to the Practices'"
            :resize="false"
            @submit="updateLocumProfile"
          />

          <AppInput
            v-model="form.special_requirements"
            :type="'textarea'"
            :name="'special_requirements'"
            :label="'Special requirements'"
            :info="'Information for Practices for your own needs'"
            :resize="false"
            @submit="updateLocumProfile"
          />

          <div>Select which jobs to view:</div>

          <AppInput
            v-model="form.view_locum_jobs"
            :type="'single-checkbox'"
            :name="'view_locum_jobs'"
            :label="'Hubzz Jobs'"
            :error="formError.find(item => item.field === 'view_locum_jobs')"
          />

          <AppInput
            v-model="form.view_permanent_jobs"
            :type="'single-checkbox'"
            :name="'view_permanent_jobs'"
            :label="'Permanent / Salaried Roles'"
            :error="formError.find(item => item.field === 'view_permanent_jobs')"
          />

          <div v-if="form.view_permanent_jobs" class="px-4">
            <div>Please Pick at least One(1) Salaried Role Work Hours</div>

            <AppInput
              v-model="form.view_permanent_jobs_full_time"
              :type="'single-checkbox'"
              :name="'view_permanent_jobs_full_time'"
              :label="'Full Time'"
              :error="formError.find(item => item.field === 'view_permanent_jobs_full_time')"
            />

            <AppInput
              v-model="form.view_permanent_jobs_part_time"
              :type="'single-checkbox'"
              :name="'view_permanent_jobs_part_time'"
              :label="'Part Time'"
              :error="formError.find(item => item.field === 'view_permanent_jobs_part_time')"
            />
          </div>

          <div class="flex flex-col my-8">
            <div class="relative flex flex-row flex-wrap justify-between">
              <label for="rates" class="text-xs sm:text-sm py-1">
                <span>Your preferred rates £</span>

                <small>(minimum)</small>
              </label>

              <div class="rounded bg-gray-300 p-1 text-xs sm:text-sm">
                <span>To match available jobs with</span>
              </div>
            </div>

            <div class="flex flex-row flex-wrap justify-between">
              <div class="flex flex-col w-full sm:w-1/3 px-1">
                <div class="flex flex-row flex-no-wrap">
                  <AppInput
                    v-model="form.min_rate_per_hour"
                    :type="'number'"
                    :name="'min_rate_per_hour'"
                    :label="'Per Hour £'"
                    :error="formError.find(item => item.field === 'min_rate_per_hour')"
                    required
                    @submit="updateLocumProfile"
                    @blur="CheckEmptyField(form.min_rate_per_hour, 'min_rate_per_hour')"
                  />

                  <div class="mx-1" />
                </div>
              </div>

              <div class="flex flex-col w-full sm:w-1/3 px-1">
                <div class="flex flex-row flex-no-wrap">
                  <AppInput
                    v-model="form.min_rate_per_half_day_session"
                    :type="'number'"
                    :name="'min_rate_per_half_day_session'"
                    :label="'Per Half Day Session £'"
                    :error="formError.find(item => item.field === 'min_rate_per_half_day_session')"
                    required
                    @submit="updateLocumProfile"
                    @blur="CheckEmptyField(form.min_rate_per_half_day_session, 'min_rate_per_half_day_session')"
                  />

                  <div class="mx-1" />
                </div>
              </div>

              <div class="flex flex-col w-full sm:w-1/3 px-1">
                <div class="flex flex-row flex-no-wrap">
                  <AppInput
                    v-model="form.min_rate_per_whole_day_session"
                    :type="'number'"
                    :name="'min_rate_per_whole_day_session'"
                    :label="'Per Whole Day Session £'"
                    :error="formError.find(item => item.field === 'min_rate_per_whole_day_session')"
                    required
                    @submit="updateLocumProfile"
                    @blur="CheckEmptyField(form.min_rate_per_whole_day_session, 'min_rate_per_whole_day_session')"
                  />

                  <div class="mx-1" />
                </div>
              </div>
            </div>
          </div>

          <AppInput
            v-model="form.mandatory_training_id"
            :type="'multi-checkbox'"
            :name="'mandatory_training_id'"
            :label="'Please select mandatory training courses completed.'"
            :lists="mandatoryTrainings"
            @checked="form.mandatory_training_id.push(parseInt($event))"
            @unchecked="form.mandatory_training_id = form.mandatory_training_id.filter(id => id !== parseInt($event))"
            @uncheckAll="form.mandatory_training_id = []"
          />

          <AppInput
            v-model="form.other_mandatory_training_id"
            :type="'multi-checkbox'"
            :name="'other_mandatory_training_id'"
            :label="'Other mandatory training courses you completed'"
            :lists="otherMandatoryTrainings"
            updatable
            @checked="form.other_mandatory_training_id.push(parseInt($event))"
            @unchecked="form.other_mandatory_training_id = form.other_mandatory_training_id.filter(id => id !== parseInt($event))"
            @uncheckAll="form.other_mandatory_training_id = []"
            @addList="addList"
            @updateList="updateList"
            @remove="toggleRemoveMandatoryModal"
          />

          <AppInput
            v-model="form.practice_type_id"
            :type="'multi-checkbox'"
            :name="'practice_type_id'"
            :label="'What type of Practice(s) would you like to work for?'"
            :error="formError.find(item => item.field === 'practice_type_id')"
            :lists="practiceTypesSelectionList"
            required
            :showSelectAll="true"
            @checked="form.practice_type_id.push(parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
            @unchecked="form.practice_type_id = form.practice_type_id.filter(id => id !== parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
            @selectAll="form.practice_type_id = practiceTypesSelectionList.map(({ value }) => value), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
          />

          <AppInput
            v-model="form.vat_registered"
            :type="'single-checkbox'"
            :name="'vat_registered'"
            :label="'Are you VAT Registered?'"
            :error="formError.find(item => item.field === 'vat_registered')"
          />

          <AppInput
            v-if="form.vat_registered === true"
            v-model="form.vat_number"
            :type="'numberDash'"
            :name="'vat_number'"
            :label="'VAT Number'"
            :error="formError.find(item => item.field === 'vat_number')"
            :limit="9"
            @submit="updateLocumProfile"
          />

          <div v-if="form.vat_registered === true" class="flex flex-col items-start mb-4">
            <p class="text-sm">
              VAT Certificate
              <span class="text-red-500">*</span>
            </p>
            <div class="flex items-center">
              <div
                class="flex flex-row flex-no-wrap justify-center items-center px-4 py-1 my-2 text-sm rounded bg-yellow-500 cursor-pointer hover:underline"
              >
                <input
                  id="file"
                  type="file"
                  class="inputfile hidden"
                  accept="image/jpeg, .pdf., .docx, .msword"
                  @input="onVATFileInput($event)"
                  @click.stop
                >

                <svgicon name="cloud-upload" height="18" width="18" />

                <label for="file" class="leading-loose mx-2 cursor-pointer">Upload</label>
              </div>
              <p
                v-if="form.vat_certificate && form.vat_certificate.name"
                class="text-sm mx-2"
              >
                {{ form.vat_certificate.name }}
              </p>
            </div>
            <transition name="drop-down">
              <div
                v-if="formError.find(item => item.field === 'vat_certificate')"
                class="text-red-500 py-1 text-xs text-white"
              >
                {{ formError.find(item => item.field === 'vat_certificate').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'vat_certificate').message.slice(1).replace(/_/g, " ") }}
              </div>
            </transition>
          </div>

          <AppInput
            v-model="form.employment_type"
            :type="'select'"
            :name="'employment_type'"
            :label="'Are you...?'"
            :items="employmentTypes"
            required
          />

          <template v-if="form.employment_type === 'Limited Company'">
            <AppInput
              v-model="form.company_registration_number"
              :type="'text'"
              :name="'company_registration_number'"
              :label="'Company Registration Number'"
              :error="formError.find(item => item.field === 'company_registration_number')"
              :placeholder="'The number of your company from Companies House'"
              required
            />
            <div class="flex flex-col items-start mb-4">
              <p class="text-sm">
                Certificate of Incorporation
                <span class="text-red-500">*</span>
              </p>
              <div class="flex items-center">
                <div
                  class="flex flex-row flex-no-wrap justify-center items-center px-4 py-1 my-2 text-sm rounded bg-yellow-500 cursor-pointer hover:underline"
                >
                  <input
                    id="fileInc"
                    type="file"
                    class="inputfile hidden"
                    accept="image/jpeg, .pdf., .docx, .msword"
                    @input="onIncFileInput($event)"
                    @click.stop
                  >

                  <svgicon name="cloud-upload" height="18" width="18" />

                  <label for="fileInc" class="leading-loose mx-2 cursor-pointer">Upload</label>
                </div>
                <p
                  v-if="form.certificate_of_incorporation && form.certificate_of_incorporation.name"
                  class="text-sm mx-2"
                >
                  {{ form.certificate_of_incorporation.name }}
                </p>
              </div>
              <transition name="drop-down">
                <div
                  v-if="formError.find(item => item.field === 'certificate_of_incorporation')"
                  class="text-red-500 py-1 text-xs text-white"
                >
                  {{ formError.find(item => item.field === 'certificate_of_incorporation').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'certificate_of_incorporation').message.slice(1).replace(/_/g, " ") }}
                </div>
              </transition>
            </div>
          </template>

          <template v-if="form.employment_type === 'Self-Employed'">
            <AppInput
              v-model="form.utr_number"
              :type="'text'"
              :name="'utr_number'"
              :label="'UTR number'"
              :error="formError.find(item => item.field === 'utr_number')"
              :placeholder="'0000000000'"
              :limit="10"
              required
              @keydown="alphaNumeric($event)"
            />
          </template>

          <AppInput
            v-model="form.paid_under_payroll"
            :type="'select'"
            :name="'paid_under_payroll'"
            :label="'Are you paid under payroll?'"
            :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
            required
          />

          <template v-if="form.paid_under_payroll == true || form.paid_under_payroll == 'true'">
            <div class="font-bold text-sm my-4">
              Payroll Details
            </div>

            <AppInput
              v-model="form.payroll_account_name"
              :type="'text'"
              :name="'payroll_account_name'"
              :label="'Payroll Company Name'"
              :error="formError.find(item => item.field === 'payroll_account_name')"
              required
            />

            <AppInput
              v-model="form.payroll_bank_name"
              :type="'text'"
              :name="'payroll_bank_name'"
              :label="'Bank Name'"
              :error="formError.find(item => item.field === 'payroll_bank_name')"
              required
            />

            <AppInput
              v-model="form.payroll_sort_code"
              :type="'numberDash'"
              :name="'payroll_sort_code'"
              :label="'Sort Code'"
              :error="formError.find(item => item.field === 'payroll_sort_code')"
              :limit="8"
              required
            />

            <AppInput
              v-model="form.payroll_account_number"
              :type="'number'"
              :name="'payroll_account_number'"
              :label="'Payroll Bank Account Number'"
              :error="formError.find(item => item.field === 'payroll_account_number')"
              :limit="8"
              required
              @keydown="inputNumberOnly($event)"
            />

            <AppInput
              v-model="form.payroll_reference_number"
              :type="'number'"
              :name="'payroll_reference_number'"
              :label="'Payroll Reference Number'"
              :error="formError.find(item => item.field === 'payroll_reference_number')"
              required
            />
          </template>

          <template v-if="form.paid_under_payroll == false || form.paid_under_payroll == 'false'">
            <div class="font-bold text-sm my-4">
              Bank Details
            </div>

            <AppInput
              v-model="form.account_name"
              :type="'text'"
              :name="'account_name'"
              :label="'Account Name'"
              :error="formError.find(item => item.field === 'account_name')"
              required
            />

            <AppInput
              v-model="form.bank_name"
              :type="'text'"
              :name="'bank_name'"
              :label="'Bank Name'"
              :error="formError.find(item => item.field === 'bank_name')"
              required
            />

            <AppInput
              v-model="form.sort_code"
              :type="'numberDash'"
              :name="'sort_code'"
              :label="'Sort Code'"
              :error="formError.find(item => item.field === 'sort_code')"
              :limit="8"
              required
              @keydown="inputNumberOnly($event)"
            />

            <AppInput
              v-model="form.account_number"
              :type="'text'"
              :name="'account_number'"
              :label="'Account Number'"
              :error="formError.find(item => item.field === 'account_number')"
              :limit="8"
              required
              @keydown="inputNumberOnly($event)"
            />
          </template>

          <template v-if="professionCategoryId === 1">
            <AppInput
              v-model="form.ir35"
              :type="'single-checkbox'"
              :name="'ir35'"
              :label="'Are you willing to work for a role captured within IR35 rules, subject to deduction of Tax and N.I.?'"
            />
          </template>

          <template v-if="professionCategoryId === 1">
            <AppInput
              v-model="form.claim_nhs"
              :type="'single-checkbox'"
              :name="'claim_nhs'"
              :label="'Are you willing to claim NHS Pension contributions?'"
            />

            <template v-if="form.claim_nhs == true || form.claim_nhs == 'true'">
              <AppInput
                v-model="form.epc_percentage_rate"
                :type="'select'"
                :name="'epc_percentage_rate'"
                :label="'Employee pension contribution rate'"
                :items="[
                  { label: '5%', value: 5 },
                  { label: '5.6%', value: 5.6 },
                  { label: '7.1%', value: 7.1 },
                  { label: '9.3%', value: 9.3 },
                  { label: '12.5%', value: 12.5 },
                  { label: '13.5%', value: 13.5 },
                  { label: '14.5%', value: 14.5 },
                ]"
                required
              />

              <AppInput
                v-model="form.section_scheme_year"
                :type="'select'"
                :name="'section_scheme_year'"
                :label="'NHS Pension Scheme Year?'"
                :items="schemeYearLists"
                required
              />

              <AppInput
                v-model="form.nhs_number"
                :type="'text'"
                :name="'nhs_number'"
                :label="'NHS Pension Scheme membership (SD) number'"
                :error="formError.find(item => item.field === 'nhs_number')"
                :limit="8"
                required
                @keypress="inputNumberOnly($event)"
              />
              <AppInput
                v-model="form.ni_number"
                :type="'text'"
                :name="'ni_number'"
                :label="'NI number'"
                :error="formError.find(item => item.field === 'ni_number')"
                :placeholder="'AA000000'"
                :limit="8"
                required
              />
              <AppInput
                v-model="form.ay_percentage_rate"
                :type="'number'"
                :name="'ay_percentage_rate'"
                :label="'Added Years % Rate'"
                :error="formError.find(item => item.field === 'ay_percentage_rate')"
              />
              <AppInput
                v-model="form.mpavc_percentage_rate"
                :type="'number'"
                :name="'mpavc_percentage_rate'"
                :label="'Money Purchase AVC % Rate'"
                :error="formError.find(item => item.field === 'mpavc_percentage_rate')"
              />
              <AppInput
                v-model="form.apc_percentage_rate"
                :type="'number'"
                :name="'apc_percentage_rate'"
                :label="'Additional Pension Contribution'"
                :error="formError.find(item => item.field === 'apc_percentage_rate')"
              />
              <AppInput
                v-model="form.errbo_percentage_rate"
                :type="'number'"
                :name="'errbo_percentage_rate'"
                :label="'Early Retirement Reduction Buy Out % Rate'"
                :error="formError.find(item => item.field === 'errbo_percentage_rate')"
              />
              <!-- <AppInput
                v-model="form.pcse_or_lhb_ea_code"
                :type="'text'"
                :name="'pcse_or_lhb_ea_code'"
                :label="'PCSE or LHB EA Code'"
                :error="formError.find(item => item.field === 'pcse_or_lhb_ea_code')"
              />-->
              <AppInput
                v-model="form.nhs_registration_number"
                :type="'text'"
                :name="'nhs_registration_number'"
                :label="'Registration Number'"
                :error="formError.find(item => item.field === 'nhs_registration_number')"
              />
            </template>
          </template>

          <AppPostCode
            v-model="form.post_code"
            :urlIndex="'/api/v1/postcode-coordinates'"
            :name="'post_code'"
            :label="'The post code where I will be available at'"
            :error="formError.find(item => item.field === 'post_code')"
            required
            @blur="CheckEmptyField(form.post_code, 'post_code')"
          />

          <AppInput
            v-model="form.miles"
            :type="'number'"
            :name="'miles'"
            :label="`I will travel up to ${form.miles ? form.miles : 0} miles from this postcode`"
            :error="formError.find(item => item.field === 'miles')"
            :limit="8"
            required
            @blur="CheckEmptyField(form.miles, 'miles')"
          />

          <div class="text-xs sm:text-sm">
            Referees
          </div>

          <div class="rounded-lg bg-gray-400 p-8 my-2">
            <AppInput
              v-model="form.referee_1_contact_name"
              :type="'text'"
              :name="'referee_1_contact_name'"
              :label="'Contact name'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              :error="formError.find(item => item.field === 'referee_1_contact_name')"
            />

            <AppInput
              v-model="form.referee_1_phone_number"
              :type="'text'"
              :name="'referee_1_phone_number'"
              :error="formError.find(item => item.field === 'referee_1_phone_number')"
              :label="'Telephone number'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              :limit="11"
              @keypress="inputTelephone($event)"
            />

            <AppInput
              v-model="form.referee_1_email"
              :type="'text'"
              :name="'referee_1_email'"
              :label="'Email address'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              :error="formError.find(item => item.field === 'referee_1_email')"
            />
          </div>

          <div class="rounded-lg bg-gray-400 p-8 my-2">
            <AppInput
              v-model="form.referee_2_contact_name"
              :type="'text'"
              :name="'referee_2_contact_name'"
              :label="'Contact name'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              :error="formError.find(item => item.field === 'referee_2_contact_name')"
            />

            <AppInput
              v-model="form.referee_2_phone_number"
              :type="'text'"
              :name="'referee_2_phone_number'"
              :error="formError.find(item => item.field === 'referee_2_phone_number')"
              :label="'Telephone number'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              :limit="11"
              @keypress="inputTelephone($event)"
            />

            <AppInput
              v-model="form.referee_2_email"
              :type="'text'"
              :name="'referee_2_email'"
              :label="'Email address'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              :error="formError.find(item => item.field === 'referee_2_email')"
            />
          </div>

          <div class="text-left mt-5">
            <AppButton :label="'Save changes'" @click="updateLocumProfile" />
          </div>
        </form>
      </div>
    </div>

    <div class="w-full lg:w-auto mb-4 lg:mb-0 p-0 lg:pr-4 order-1 lg:order-2">
      <div class="rounded-lg shadow-lg w-full py-8 px-12">
        <AppAvatar
          class="m-auto"
          :type="'update'"
          :src="profile && profile.avatar ? profile.avatar : ''"
        />

        <div class="leading-none text-center text-sm pt-4">
          <p class="font-bold">
            {{ profile ? profile.name : '' }}
          </p>

          <p>{{ profile ? profile.email : '' }}</p>
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Proceed to remove this mandatory traning?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="toggle_remove_mandatory_modal"
      @confirm="removeMandatory"
      @cancel="toggle_remove_mandatory_modal = false"
    />
  </div>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppFormError from "@/components/Base/AppFormError"
import AppLoading from "@/components/Base/AppLoading"
import AppInput from "@/components/Base/AppInput"
import AppPostCode from "@/components/Base/AppPostCode"
import AppFilterSearch from "@/components/Base/AppFilterSearch"
import AppButton from "@/components/Base/AppButton"
import AppAvatar from "@/components/Base/AppAvatar"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppConfirmationModal,
    AppFormError,
    AppLoading,
    AppInput,
    AppPostCode,
    AppFilterSearch,
    AppButton,
    AppAvatar,
  },

  data () {
    return {
      loading: false,
      user: null,
      professions: [],
      subProfessionIds: [],
      referenceLocumComplianceDocuments: [],

      selectedMandatory: null,
      toggle_remove_mandatory_modal: false,
      employmentTypes: [
        {
          label: "Self-Employed",
          value: "Self-Employed",
        },
        {
          label: "Limited Company",
          value: "Limited Company",
        },
      ],
      selectedQualification: [],
      selectedClinicalSystem: [],
      selectedSpokenLanguage: [],
      professions_categories: [],
      form: {
        other_mandatory_training_id: [],
        nhs_smart_card_id_number: "",
        headline: "",
        short_biography: "",
        special_requirements: "",
        profession_id: "",
        qualification_id: [],
        clinical_system_id: [],
        spoken_language_id: [],
        view_locum_jobs: false,
        view_permanent_jobs: false,
        view_permanent_jobs_full_time: false,
        view_permanent_jobs_part_time: false,
        min_rate_per_hour: "",
        max_rate_per_hour: "",
        min_rate_per_half_day_session: "",
        max_rate_per_half_day_session: "",
        min_rate_per_whole_day_session: "",
        max_rate_per_whole_day_session: "",
        mandatory_training_id: [],
        practice_type_id: [],
        post_code: "",
        miles: 0,
        referee_1_contact_name: "",
        referee_1_phone_number: "",
        referee_1_email: "",
        referee_2_contact_name: "",
        referee_2_phone_number: "",
        referee_2_email: "",
        vat_registered: false,
        vat_number: "",
        employment_type: "Self-Employed",
        company_registration_number: "",
        utr_number: "",
        paid_under_payroll: false,
        payroll_account_name: "",
        payroll_bank_name: "",
        payroll_sort_code: "",
        payroll_account_number: "",
        payroll_reference_number: "",
        account_name: "",
        bank_name: "",
        sort_code: "",
        account_number: "",
        ir35: false,
        claim_nhs: false,
        epc_percentage_rate: 0,
        section_scheme_year: false,
        nhs_number: "",
        ni_number: "",
        ay_percentage_rate: 0,
        mpavc_percentage_rate: 0,
        apc_percentage_rate: 0,
        errbo_percentage_rate: 0,
        pcse_or_lhb_ea_code: "",
        nhs_registration_number: "",
        vat_certificate: null,
        certificate_of_incorporation: null,
      },
      activeLoading: [],
      file: "",
      files: [],
      vat_cartificate: {
        file_created_at: null,
        file_filename: null,
        file_id: null,
        file_size: null,
        file_subtype: null,
        file_type: null,
        file_url: null,
      },
      certificate_of_incorporation: {
        file_created_at: null,
        file_filename: null,
        file_id: null,
        file_size: null,
        file_subtype: null,
        file_type: null,
        file_url: null,
      },
      profile: {
        avatar: null,
        name: "",
        email: "",
      },
      formError: [],

      new_vat_certificate: false,
      new_certificate_of_incorporation: false,

      practiceTypes: [],
      mandatoryTrainings: [],
      otherMandatoryTrainings: [],
    }
  },

  computed: {
    referenceValidations () {
      return [
        {
          name: "GMC Number",
          limit: 7,
          integer: true,
        },
        {
          name: "Medical Performers List reference check",
          limit: 7,
          integer: true,
        },
        {
          name: "NMC reference check",
          limit: 8,
          integer: false,
        },
        {
          name: "HCPC reference check",
          limit: 8,
          integer: false,
        },
        {
          name: "GpHc reference check",
          limit: 7,
          integer: true,
        },
        {
          name: "Medical Performers List Number",
          limit: 7,
          integer: true,
        },
        {
          name: "NMC Number",
          limit: 8,
          integer: false,
        },
        {
          name: "HCPC Number",
          limit: 8,
          integer: false,
        },
        {
          name: "GpHc Number",
          limit: 7,
          integer: true,
        },
      ]
    },

    getReferenceLimit () {
      return complianceDocumentName => {
        const referenceLimit = this.referenceValidations.find(
          ({ name, }) => name === complianceDocumentName
        )

        return referenceLimit ? referenceLimit.limit : null
      }
    },

    getReferenceIsInteger () {
      return complianceDocumentName => {
        const referenceLimit = this.referenceValidations.find(
          ({ name, }) => name === complianceDocumentName
        )

        return referenceLimit ? referenceLimit.integer : false
      }
    },

    professionsSelectionList () {
      return this.professions.map(profession => ({
        label: profession.name,
        value: profession.id,
        reference_compliance_documents:
          profession.profession_compliance_category
            .reference_compliance_documents,
      }))
    },

    subProfessionsSelectionList () {
      return this.professions
        .filter(
          profession =>
            profession.sub_professionable
            && (!this.selectedProfession
              || profession.id !== this.selectedProfession.id)
        )
        .map(profession => ({
          label: profession.name,
          value: profession.id,
        }))
    },

    professionId () {
      return this.form.profession_id ? parseInt(this.form.profession_id) : null
    },

    selectedProfession () {
      return this.professions.find(({ id, }) => id === this.professionId)
    },

    professionCategoryId () {
      return this.selectedProfession
        ? this.selectedProfession.profession_category_id
        : null
    },

    selectedSubProfessionsSelectionList: {
      get () {
        return this.subProfessionsSelectionList.filter(
          ({ value, }) => this.subProfessionIds.indexOf(value) !== -1
        )
      },

      set (selectedSubProfessionsSelectionList) {
        console.log(
          "set selectedSubProfessionsSelectionList",
          selectedSubProfessionsSelectionList
        )
        this.subProfessionIds = selectedSubProfessionsSelectionList.map(
          ({ value, }) => value
        )
      },
    },

    selectedSubProfessions () {
      return this.professions.filter(
        ({ id, }) => this.subProfessionIds.indexOf(id) !== -1
      )
    },

    referenceComplianceDocuments () {
      return this.professions
        .filter(
          ({ id, }) =>
            id === this.professionId
            || (true && this.subProfessionIds.indexOf(id) !== -1)
        )
        .reduce((referenceComplianceDocuments, profession) => {
          if (
            profession.profession_compliance_category
            && profession.profession_compliance_category
              .reference_compliance_documents
            && profession.profession_compliance_category
              .reference_compliance_documents.length > 0
          ) {
            referenceComplianceDocuments.push(
              ...profession.profession_compliance_category
                .reference_compliance_documents
            )
          }

          return referenceComplianceDocuments
        }, [])
        .filter(
          ({ compliance_document_id: idA, }, i, a) =>
            i === a.findIndex(({ compliance_document_id: idB, }) => idA === idB)
        )
    },

    schemeYearLists () {
      let defaultDate = 2020
      let currentDate = this.$moment().year()
      let lists = []
      while (currentDate >= defaultDate) {
        lists.push({
          label: `${currentDate}-${this.$moment(currentDate, "YYYY")
            .add(1, "years")
            .year()}`,
          value: `${currentDate}-${this.$moment(currentDate, "YYYY")
            .add(1, "years")
            .year()}`,
        })
        currentDate = currentDate - 1
      }
      return lists
    },

    practiceTypesSelectionList () {
      return this.practiceTypes.map(practiceType => ({
        label: practiceType.name,
        value: practiceType.id,
      }))
    },
  },

  watch: {
    selectedProfession () {
      if (this.selectedProfession) {
        if (this.selectedProfession.sub_professionable) {
          const index = this.subProfessionIds.findIndex(
            professionId => professionId === this.selectedProfession.id
          )

          if (index > -1) {
            this.subProfessionIds.splice(index, 1)
          }
        } else {
          this.subProfessionIds = []
        }
      }
    },

    referenceComplianceDocuments () {
      const oldCompliances = this.referenceLocumComplianceDocuments.map(
        referenceLocumComplianceDocument =>
          referenceLocumComplianceDocument.compliance_document_name
            .replace(/ /g, "_")
            .toLowerCase()
      )

      this.formError.forEach((err, index) => {
        if (oldCompliances.includes(err.field)) {
          this.formError.splice(index, 1)
        }
      })

      this.referenceLocumComplianceDocuments = this.referenceComplianceDocuments.map(
        referenceComplianceDocument => {
          const {
            compliance_document_id: id,
            compliance_document_name: name,
          } = referenceComplianceDocument

          const referenceLocumComplianceDocument
            = this.user
            && this.user.reference_locum_compliance_documents
            && this.user.reference_locum_compliance_documents.find(
              referenceLocumComplianceDocument =>
                referenceLocumComplianceDocument.compliance_document_id === id
            )

          return {
            compliance_document_id: id,
            compliance_document_name: name,
            reference: referenceLocumComplianceDocument
              ? referenceLocumComplianceDocument.reference
              : "",
            type: "compliance_documents",
          }
        }
      )
    },

    "form.payroll_sort_code" (value) {
      let final = ""
      if (value && value.length > 0) {
        let digit = value.split("-").join("")

        final = digit.match(/.{1,2}/g).join("-")
        this.form.payroll_sort_code = final
      } else {
        return ""
      }
    },

    "form.sort_code" (value) {
      let final = ""
      if (value && value.length > 0) {
        let digit = value.split("-").join("")

        final = digit.match(/.{1,2}/g).join("-")
        this.form.sort_code = final
      } else {
        return ""
      }
    },

    "form.view_permanent_jobs" (value) {
      if (value === false) {
        this.form.view_permanent_jobs_full_time = false
        this.form.view_permanent_jobs_part_time = false
      }
      if (
        value === true
        && this.user
        && this.user.view_permanent_jobs === false
      ) {
        this.form.view_permanent_jobs_full_time = true
        this.form.view_permanent_jobs_part_time = true
      }
      if (
        value === true
        && this.user
        && this.user.view_permanent_jobs === true
      ) {
        this.form.view_permanent_jobs_full_time = this.user.view_permanent_jobs_full_time
        this.form.view_permanent_jobs_part_time = this.user.view_permanent_jobs_part_time
      }
    },

    "form.view_permanent_jobs_full_time" (value) {
      if (
        value === false
        && this.form.view_permanent_jobs_part_time === false
      ) {
        this.form.view_permanent_jobs = false
      }
    },

    "form.view_permanent_jobs_part_time" (value) {
      if (
        value === false
        && this.form.view_permanent_jobs_full_time === false
      ) {
        this.form.view_permanent_jobs = false
      }
    },
  },

  mounted () {
    this.loading = true
    Promise.all([
      this.$axios
        .get(`/api/v1/locum/me/profile`)
        .then(response => response.data.data.user),

      this.$axios
        .get("/api/v1/professions?limit=1000000")
        .then(response => response.data.data.professions),

      this.$axios
        .get("/api/v1/mandatory-trainings?limit=1000000")
        .then(response =>
          response.data.data.mandatory_trainings.map(mandatoryTraining => ({
            label: mandatoryTraining.name,
            value: mandatoryTraining.id,
          }))
        ),

      this.$axios
        .get("/api/v1/locum/other-mandatory-training", {
          params: {
            user_id: this.$auth.user.id,
          },
        })
        .then(response =>
          response.data.data.locum_other_mandatory_trainings.map(
            otherMandatoryTraining => ({
              label: otherMandatoryTraining.name,
              value: otherMandatoryTraining.id,
            })
          )
        ),

      this.$axios.get("/api/v1/practice-types?limit=1000000")
        .then(response => response.data.data.practice_types),
    ])
      .then(responses => {
        const [
          user,
          professions,
          mandatoryTrainings,
          otherMandatoryTrainings,
          practiceTypes,
        ] = responses

        this.professions = professions
        this.mandatoryTrainings = mandatoryTrainings
        this.user = user
        this.otherMandatoryTrainings = otherMandatoryTrainings
        this.practiceTypes = practiceTypes
        this.initialize()
      })
      .catch(this.errorHandler)
      .finally(() => {
        this.loading = false
      })
  },

  methods: {
    errorHandler (err) {
      console.log("err", err.response || err)

      let message = null

      if (err.response) {
        if (err.response.status === 400 && err.response.data.error_messages) {
          this.formError = err.response.data.error_messages
        } else {
          message = err.response.data.message
        }
      } else if (err.request) {
        message = "Something went wrong!"
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
    },

    initialize () {
      console.log("user", this.user)
      const {
        profession_id: professionId,
        sub_profession_ids: subProfessionIds,
      } = this.user

      this.form.profession_id = professionId
      this.subProfessionIds = subProfessionIds

      this.profile.avatar = this.user.file_url ? this.user.file_url : null
      this.profile.name = `${this.user.first_name} ${this.user.last_name}`
      this.profile.email = this.user.email
      this.form.nhs_smart_card_id_number = this.user.nhs_smart_card_id_number
      this.form.headline = this.user.headline
      this.form.short_biography = this.user.short_biography
      this.form.special_requirements = this.user.special_requirements

      this.form.qualification_id = this.user.qualifications.map(
        qualification => {
          return { label: qualification.name, value: qualification.id, }
        }
      )
      this.form.clinical_system_id = this.user.clinical_systems.map(
        clinicalSystem => {
          return { label: clinicalSystem.name, value: clinicalSystem.id, }
        }
      )
      this.form.spoken_language_id = this.user.spoken_languages.map(
        spokenLanguage => {
          return { label: spokenLanguage.name, value: spokenLanguage.id, }
        }
      )
      this.form.view_locum_jobs = this.user.view_locum_jobs
      this.form.view_permanent_jobs = this.user.view_permanent_jobs
      this.form.view_permanent_jobs_full_time = this.user.view_permanent_jobs_full_time
      this.form.view_permanent_jobs_part_time = this.user.view_permanent_jobs_part_time
      this.form.min_rate_per_hour = this.user.min_rate_per_hour
      this.form.max_rate_per_hour = this.user.max_rate_per_hour
      this.form.min_rate_per_half_day_session = this.user.min_rate_per_half_day_session
      this.form.max_rate_per_half_day_session = this.user.max_rate_per_half_day_session
      this.form.min_rate_per_whole_day_session = this.user.min_rate_per_whole_day_session
      this.form.max_rate_per_whole_day_session = this.user.max_rate_per_whole_day_session
      this.form.practice_type_id = this.user.practice_types.map(
        practiceType => practiceType.id
      )
      this.form.mandatory_training_id = this.user.mandatory_trainings.map(
        mandatoryTraining => mandatoryTraining.mandatory_training.id
      )
      this.form.other_mandatory_training_id = this.user.other_mandatory_trainings.map(
        otherMandatoryTraining =>
          otherMandatoryTraining.locum_other_mandatory_training.id
      )
      this.form.post_code = this.user.locum_postcode
      this.form.miles = this.user.miles

      this.form.referee_1_contact_name = this.user.referee_1_contact_name
      this.form.referee_1_phone_number = this.user.referee_1_phone_number
      this.form.referee_1_email = this.user.referee_1_email
      this.form.referee_2_contact_name = this.user.referee_2_contact_name
      this.form.referee_2_phone_number = this.user.referee_2_phone_number
      this.form.referee_2_email = this.user.referee_2_email

      this.form.vat_registered = this.user.vat_registered
      this.form.vat_number = this.user.vat_number

      this.form.employment_type = this.user.employment_type
      this.form.utr_number = this.user.utr_number
      this.form.company_registration_number = this.user.company_registration_number

      this.form.ir35 = this.user.ir35
      // claim nhs
      this.form.claim_nhs = this.user.claim_nhs
      this.form.epc_percentage_rate = this.user.epc_percentage_rate
      this.form.section_scheme_year = this.user.section_scheme_year
      this.form.nhs_number = this.user.nhs_number
      this.form.ni_number = this.user.ni_number
      this.form.ay_percentage_rate = this.user.ay_percentage_rate
      this.form.mpavc_percentage_rate = this.user.mpavc_percentage_rate
      this.form.apc_percentage_rate = this.user.apc_percentage_rate
      this.form.errbo_percentage_rate = this.user.errbo_percentage_rate
      this.form.pcse_or_lhb_ea_code = this.user.pcse_or_lhb_ea_code
      this.form.nhs_registration_number = this.user.nhs_registration_number

      this.form.paid_under_payroll = this.user.paid_under_payroll

      this.form.payroll_account_name = this.user.payroll_account_name
      this.form.payroll_account_number = this.user.payroll_account_number
      this.form.payroll_reference_number = this.user.payroll_reference_number
      this.form.payroll_sort_code = this.user.payroll_sort_code
      this.form.payroll_bank_name = this.user.payroll_bank_name

      this.form.account_name = this.user.account_name
      this.form.account_number = this.user.account_number
      this.form.sort_code = this.user.sort_code
      this.form.bank_name = this.user.bank_name

      this.form.vat_certificate = {
        name: this.user.vat_cert_file_filename,
      }

      this.form.certificate_of_incorporation = {
        name: this.user.cert_of_incorp_file_filename,
      }
      this.vat_cartificate.file_created_at = this.user.vat_cert_file_created_at
      this.vat_cartificate.file_filename = this.user.vat_cert_file_filename
      this.vat_cartificate.file_id = this.user.vat_cert_file_id
      this.vat_cartificate.file_size = this.user.vat_cert_file_size
      this.vat_cartificate.file_subtype = this.user.vat_cert_file_subtype
      this.vat_cartificate.file_type = this.user.vat_cert_file_type
      this.vat_cartificate.file_url = this.user.vat_cert_file_url

      this.certificate_of_incorporation.file_created_at = this.user.cert_of_incorp_file_created_at
      this.certificate_of_incorporation.file_filename = this.user.cert_of_incorp_file_filename
      this.certificate_of_incorporation.file_id = this.user.cert_of_incorp_file_id
      this.certificate_of_incorporation.file_size = this.user.cert_of_incorp_file_size
      this.certificate_of_incorporation.file_subtype = this.user.cert_of_incorp_file_subtype
      this.certificate_of_incorporation.file_type = this.user.cert_of_incorp_file_type
      this.certificate_of_incorporation.file_url = this.user.cert_of_incorp_file_url

      this.new_vat_certificate = false
      this.new_certificate_of_incorporation = false
    },

    async addList (payload) {
      console.log('anakangputangina')
      await this.$axios
        .$post(`/api/v1/locum/other-mandatory-training`, { name: payload, })
        .then(res => {
          let index = this.otherMandatoryTrainings.findIndex(
            item =>
              item.value === res.data.locum_other_mandatory_training.id
          )

          if (index < 0) {
            this.otherMandatoryTrainings.push({
              label: res.data.locum_other_mandatory_training.name,
              value: res.data.locum_other_mandatory_training.id,
            })
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          
        })
        .finally(() => {
          this.form.other_mandatory_training_id = this.user.other_mandatory_trainings.map(
            otherMandatoryTraining =>
              otherMandatoryTraining.locum_other_mandatory_training.id
          )
        })
        .catch(err => {
          console.log("err", err)
        })
    },

    updateList (payload) {
      this.$axios
        .$put(`/api/v1/locum/other-mandatory-training/${payload.value}`, {
          name: payload.label,
        })
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          let index = this.otherMandatoryTrainings.findIndex(
            item => item.value === payload.value
          )
          if (index >= 0) {
            this.otherMandatoryTrainings.splice(index, 1, payload)
          }
        })
    },

    toggleRemoveMandatoryModal (payload) {
      this.selectedMandatory = payload
      this.toggle_remove_mandatory_modal = true
    },

    removeMandatory () {
      this.$axios
        .$delete(
          `/api/v1/locum/other-mandatory-training/${this.selectedMandatory.value}`
        )
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          let index = this.otherMandatoryTrainings.findIndex(
            item => item.value === this.selectedMandatory.value
          )
          if (index >= 0) {
            this.otherMandatoryTrainings.splice(index, 1)
          }
        })
        .catch(err => {
          console.log("err", err.response || err)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.data.message}`,],
          })
        })
        .finally(() => {
          this.toggle_remove_mandatory_modal = false
          this.selectedMandatory = null
          this.initialize()
        })
    },

    checkReferenceLocumCompliance (complianceDocumentName) {
      let fieldName = complianceDocumentName.replace(/ /g, "_").toLowerCase()

      this.formError = this.formError.filter(
        ({ field, }) => field !== fieldName
      )

      const referenceLocumComplianceDocument = this.referenceLocumComplianceDocuments.find(
        referenceLocumComplianceDocument =>
          referenceLocumComplianceDocument.compliance_document_name
          === complianceDocumentName
      )

      if (
        !referenceLocumComplianceDocument
        || !referenceLocumComplianceDocument.reference
      ) {
        this.formError.push({
          field: fieldName,
          message: `${complianceDocumentName} is required`,
          validation: "required",
        })

        return
      }

      if (complianceDocumentName === "GMC Number") {
        if (referenceLocumComplianceDocument.reference.length < 7) {
          this.formError.push({
            field: fieldName,
            message: `${complianceDocumentName} must be 7 characters.`,
            validation: "limit",
          })

          return
        }

        return
      }

      if (
        complianceDocumentName === "Medical Performers List reference check"
        || complianceDocumentName === "Medical Performers List Number"
      ) {
        if (referenceLocumComplianceDocument.reference.length < 7) {
          this.formError.push({
            field: fieldName,
            message: `${complianceDocumentName} must be 7 characters.`,
            validation: "limit",
          })

          return
        }

        return
      }

      if (
        complianceDocumentName === "NMC reference check"
        || complianceDocumentName === "NMC Number"
      ) {
        if (referenceLocumComplianceDocument.reference.length < 8) {
          this.formError.push({
            field: fieldName,
            message: `${complianceDocumentName} must be 8 characters.`,
            validation: "limit",
          })

          return
        }

        return
      }

      if (
        complianceDocumentName === "HCPC reference check"
        || complianceDocumentName === "HCPC Number"
      ) {
        if (
          referenceLocumComplianceDocument.reference.length >= 2
          && !/^[a-zA-Z]+$/.test(
            referenceLocumComplianceDocument.reference.substring(0, 2)
          )
        ) {
          this.formError.push({
            field: fieldName,
            message: `${complianceDocumentName} must start with 2 letters.`,
            validation: "first_2_letters",
          })

          return
        }

        if (referenceLocumComplianceDocument.reference.length < 7) {
          this.formError.push({
            field: fieldName,
            message: `${complianceDocumentName} must be at least 7 characters.`,
            validation: "limit",
          })

          return
        }

        if (
          !/^[0-9]+$/.test(
            referenceLocumComplianceDocument.reference.substring(2)
          )
        ) {
          this.formError.push({
            field: fieldName,
            message: `${complianceDocumentName} must end with 5 or 6 numbers.`,
            validation: "last_numbers",
          })

          return
        }

        return
      }

      if (
        complianceDocumentName === "GpHc reference check"
        || complianceDocumentName === "GpHc Number"
      ) {
        if (referenceLocumComplianceDocument.reference.length < 7) {
          this.formError.push({
            field: fieldName,
            message: `${complianceDocumentName} must be 7 characters.`,
            validation: "limit",
          })

          return
        }

        return
      }
    },

    async updateLocumProfile () {
      this.form.reference_locum_compliance_documents = this.referenceLocumComplianceDocuments
      this.form.sub_profession_ids
        = this.selectedProfession && this.selectedProfession.sub_professionable
          ? this.subProfessionIds
          : []

      this.formError = []

      let notRequired = [
        "sub_profession_ids",
        "reference_locum_compliance_documents",
        "other_mandatory_training_id",
        "nhs_smart_card_id_number",
        "headline",
        "short_biography",
        "special_requirements",
        "spoken_language_id",
        "referee_1_contact_name",
        "referee_1_phone_number",
        "referee_1_email",
        "referee_2_contact_name",
        "referee_2_phone_number",
        "referee_2_email",
        "paid_under_payroll",
        "mandatory_training_id",
        "ir35",
        "claim_nhs",
        "epc_percentage_rate",
        "section_scheme_year",
        "max_rate_per_hour",
        "max_rate_per_half_day_session",
        "max_rate_per_whole_day_session",
        "mpl_or_npl_number",
        "ay_percentage_rate",
        "mpavc_percentage_rate",
        "apc_percentage_rate",
        "errbo_percentage_rate",
        "pcse_or_lhb_ea_code",
        "nhs_registration_number",
        "vat_registered",
        "vat_number",
      ]

      this.form.max_rate_per_hour = 999999999
      this.form.max_rate_per_half_day_session = 999999999
      this.form.max_rate_per_whole_day_session = 999999999

      if (!this.form.vat_registered) {
        notRequired.push("vat_certificate")
      } else {
        if (this.form.vat_number) {
          const firstSlice = this.form.vat_number.slice(0, 3)
          const secondSlice = this.form.vat_number.slice(3, 7)
          const thirdSlice = this.form.vat_number.slice(7, 9)
          this.form.vat_number = firstSlice.concat(
            " ",
            secondSlice,
            " ",
            thirdSlice
          )
        }
      }

      if (this.form.employment_type === "Self-Employed") {
        notRequired.push(
          "company_registration_number",
          "certificate_of_incorporation"
        )
        // if (
        //   !this.form.utr_number.substring(0, 2).match(/[A-Z]/g)
        //   || this.form.utr_number.substring(0, 2).match(/[A-Z]/g).length !== 2
        //   || !this.form.utr_number.substring(2, 8).match(/[0-9]/g)
        //   || this.form.utr_number.substring(2, 8).match(/[0-9]/g).length !== 6
        //   // || !this.form.utr_number.substring(8, 9).match(/[A-D]/g)
        //   // || !this.form.utr_number.substring(8, 9).match(/[A-D]/g).length
        // ) {
        //   this.formError.push({
        //     field: "utr_number",
        //     message: "UTR Number is invalid."
        //   })
        // }
        if (
          this.form.utr_number
          && (!this.form.utr_number.substring(0, 10).match(/[0-9]/g)
            || this.form.utr_number.substring(0, 10).match(/[0-9]/g).length !== 10)
        ) {
          this.formError.push({
            field: "utr_number",
            message: "UTR Number is invalid.",
          })
        }
      } else if (this.form.employment_type === "Limited Company") {
        notRequired.push("utr_number")
      }

      if (this.professionCategoryId === 2) {
        this.form.claim_nhs = false
      }

      if (["false", false,].includes(this.form.claim_nhs)) {
        notRequired.push("nhs_number")
        this.form.nhs_number = null
        notRequired.push("ni_number")
        this.form.ni_number = null
      }

      if (["true", true,].includes(this.form.claim_nhs)) {
        if (
          this.form.nhs_number
          && (!this.form.nhs_number.substring(0, 8).match(/[A-Za-z0-9]/g)
            || this.form.nhs_number.substring(0, 8).match(/[A-Za-z0-9]/g)
              .length !== 8)
        ) {
          this.formError.push({
            field: "nhs_number",
            message: "NHS Pension Scheme membership (SD) number is invalid.",
          })
        }

        if (
          this.form.ni_number
          && (!this.form.ni_number.substring(0, 2).match(/[A-Za-z]/g)
            || this.form.ni_number.substring(0, 2).match(/[A-Za-z]/g).length
              !== 2
            || !this.form.ni_number.substring(2, 8).match(/[0-9]/g)
            || this.form.ni_number.substring(2, 8).match(/[0-9]/g).length !== 6)
        ) {
          this.formError.push({
            field: "ni_number",
            message: "NI number is invalid.",
          })
        }
      }

      if (["false", false,].includes(this.form.paid_under_payroll)) {
        // this.form.payroll_account_name = ""
        // this.form.payroll_account_number = ""
        // this.form.payroll_reference_number = ""
        // this.form.payroll_sort_code = ""
        // this.form.payroll_bank_name = ""
        notRequired.push(
          "payroll_account_name",
          "payroll_bank_name",
          "payroll_sort_code",
          "payroll_account_number",
          "payroll_reference_number"
        )
      }

      if (["true", true,].includes(this.form.paid_under_payroll)) {
        // this.form.account_name = ""
        // this.form.account_number = ""
        // this.form.sort_code = ""
        // this.form.bank_name = ""
        notRequired.push(
          "account_name",
          "bank_name",
          "sort_code",
          "account_number"
        )
      }

      if (
        ["true", true,].includes(this.form.view_locum_jobs)
        || ["true", true,].includes(this.form.view_permanent_jobs)
      ) {
        notRequired.push("view_locum_jobs", "view_permanent_jobs")
      }

      notRequired.push(
        "view_permanent_jobs_full_time",
        "view_permanent_jobs_part_time"
      )

      this.referenceComplianceDocuments.forEach(referenceComplianceDocument => {
        this.checkReferenceLocumCompliance(
          referenceComplianceDocument.compliance_document_name
        )
      })

      if (
        this.form.referee_1_phone_number
        && this.form.referee_1_phone_number.length < 11
      ) {
        this.formError.push({
          field: "referee_1_phone_number",
          message: "Telephone number should be 11 digits",
        })
      }

      if (
        this.form.referee_2_phone_number
        && this.form.referee_2_phone_number.length < 11
      ) {
        this.formError.push({
          field: "referee_2_phone_number",
          message: "Telephone number should be 11 digits",
        })
      }

      if (
        this.form.nhs_smart_card_id_number
        && this.form.nhs_smart_card_id_number.length < 12
      ) {
        this.formError.push({
          field: "nhs_smart_card_id_number",
          message: "NHS Smart Card ID should be 12 digits",
        })
      }

      if (["true", true,].includes(this.form.paid_under_payroll)) {
        if (
          this.form.payroll_sort_code
          && this.form.payroll_sort_code.length !== 8
        ) {
          this.formError.push({
            field: "payroll_sort_code",
            message: "Sort Code should be 8 digits (dashes included)",
          })
        }

        if (
          this.form.payroll_account_number
          && this.form.payroll_account_number.length !== 8
        ) {
          this.formError.push({
            field: "payroll_account_number",
            message: "Payroll account number should be 8 digits",
          })
        }
      } else if (["false", false,].includes(this.form.paid_under_payroll)) {
        if (this.form.sort_code && this.form.sort_code.length !== 8) {
          this.formError.push({
            field: "sort_code",
            message: "Sort Code should be 8 digits (dashes included)",
          })
        }

        if (this.form.account_number && this.form.account_number.length !== 8) {
          this.formError.push({
            field: "account_number",
            message: "Account number should be 8 digits",
          })
        }
      }

      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.loading = true

        this.selectedClinicalSystem = [...this.form.clinical_system_id,]

        this.form.clinical_system_id = this.form.clinical_system_id.map(
          item => item.value
        )

        this.selectedQualification = [...this.form.qualification_id,]

        this.form.qualification_id = this.form.qualification_id.map(
          item => item.value
        )

        this.selectedSpokenLanguage = [...this.form.spoken_language_id,]

        this.form.spoken_language_id = this.form.spoken_language_id.map(
          item => item.value
        )

        this.form.profession_id = this.form.profession_id.toString()

        this.form.ir35
          = this.professionCategoryId === 1 ? this.form.ir35 : false

        this.$axios
          .put(`/api/v1/locum/me/profile`, this.form)
          .then(response => {
            if (
              !this.new_certificate_of_incorporation || !this.new_vat_certificate
            ) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`Profile successfully updated.`,],
              })
              this.user = response.data.data.user
              this.initialize()
            }

            this.$store.commit(
              "SET_VIEW_LOCUM_JOBS",
              this.form.view_locum_jobs
            )
            this.$store.commit(
              "SET_VIEW_PERMANENT_JOBS",
              this.form.view_permanent_jobs
            )
            this.CheckUserVerification()
          })
          .catch(this.errorHandler)
          .finally(() => {
            this.form.clinical_system_id = this.selectedClinicalSystem
            this.form.qualification_id = this.selectedQualification
            this.form.spoken_language_id = this.selectedSpokenLanguage
            if (
              !this.new_certificate_of_incorporation || !this.new_vat_certificate
            ) {
              this.loading = false
              this.scrollToTop()
            }
          })

        if (this.form.vat_registered && this.new_vat_certificate) {
          const formData1 = await new FormData()

          await formData1.append("file", this.form.vat_certificate)
          await formData1.append("locum_user_id", this.user.id)
          await formData1.append("type", "VAT Certificate")
          
          console.log('vat file', formData1)

          // post request to API / send file
          await this.$axios
            .$post(`/api/v1/locum/me/profile/vat-document`, formData1)
            .then(res => {
              console.log('res', res)
              if (!this.new_certificate_of_incorporation) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "success",
                  text: [`Profile successfully updated.`,],
                })
                this.user = res.data.user
                this.initialize()
              }
              this.vat_cartificate.file_created_at
                = res.data.user.vat_cert_file_created_at
              this.vat_cartificate.file_filename
                = res.data.user.vat_cert_file_filename
              this.vat_cartificate.file_id = res.data.user.vat_cert_file_id
              this.vat_cartificate.file_size = res.data.user.vat_cert_file_size
              this.vat_cartificate.file_subtype
                = res.data.user.vat_cert_file_subtype
              this.vat_cartificate.file_type = res.data.user.vat_cert_file_type
              this.vat_cartificate.file_url = res.data.user.vat_cert_file_url
            })
            .catch(err => {
              console.log('err', err)
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`,],
              })
            })
            .finally(() => {
              if (!this.new_certificate_of_incorporation) {
                this.loading = false
                this.scrollToTop()
              }
            })
        }

        if (this.form.employment_type === "Limited Company" && this.new_certificate_of_incorporation) {
          const formData2 = await new FormData()

          await formData2.append("file", this.form.certificate_of_incorporation)
          await formData2.append("locum_user_id", this.user.id)
          await formData2.append("type", "Certificate of Incorporation")

          console.log('cert file', formData2)
          
          // post request to API / send file
          await this.$axios
            .$post(`/api/v1/locum/me/profile/vat-document`, formData2)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`Profile successfully updated.`,],
              })
              console.log('res', res)
              this.user = res.data.user
              this.initialize()
              this.certificate_of_incorporation.file_created_at
                = res.data.user.cert_of_incorp_file_created_at
              this.certificate_of_incorporation.file_filename
                = res.data.user.cert_of_incorp_file_filename
              this.certificate_of_incorporation.file_id
                = res.data.user.cert_of_incorp_file_id
              this.certificate_of_incorporation.file_size
                = res.data.user.cert_of_incorp_file_size
              this.certificate_of_incorporation.file_subtype
                = res.data.user.cert_of_incorp_file_subtype
              this.certificate_of_incorporation.file_type
                = res.data.user.cert_of_incorp_file_type
              this.certificate_of_incorporation.file_url
                = res.data.user.cert_of_incorp_file_url
            })
            .catch(err => {
              console.log('err', err)
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`,],
              })
            })
            .finally(() => {
              this.loading = false
              this.scrollToTop()
            })
        }
      } else {
        this.scrollToTop()
      }
    },

    onVATFileInput (e) {
      if (!e.target.files.length) {
        return
      }

      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12",
      ]

      let file = e.target.files[0]

      let fileType = file.type.split("/")[1]

      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      this.form.vat_certificate = file
      this.new_vat_certificate = true
      console.log('vat file',this.form.vat_certificate)
    },

    onIncFileInput (e) {
      
      if (!e.target.files.length) {
        return
      }

      let types = [
        "pdf",
        "jpeg",
        "msword",
        "tiff",
        "vnd.openxmlformats-officedocument.wordprocessingml.document",
        "vnd.openxmlformats-officedocument.wordprocessingml.template",
        "vnd.ms-word.document.macroEnabled.12",
        "vnd.ms-word.template.macroEnabled.12",
      ]

      let file = e.target.files[0]

      let fileType = file.type.split("/")[1]

      if (!types.includes(fileType)) {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "alert",
          text: ["Invalid File Format",],
        })

        return
      }

      this.form.certificate_of_incorporation = file
      this.new_certificate_of_incorporation = true

      console.log('cert file', this.form.certificate_of_incorporation)
    },
  },
}
</script>
