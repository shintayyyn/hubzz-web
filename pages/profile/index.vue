<template>
  <section>
    <div class="flex flex-col">
      <div class="h-full flex flex-row flex-wrap justify-between">
        <div class="w-full lg:w-3/5 p-1">
          <div class="bg-white rounded-lg shadow-lg p-4 md:p-8 h-full">
            <div class="flex flex-row flex-wrap">
              <div class="flex flex-col w-full lg:w-1/2 xl:w-2/5 p-1">
                <div class="text-xs sm:text-sm">
                  Practice name
                </div>
                <div class="text-xs font-bold py-2">
                  {{ practice.name }}
                </div>
                <div class="text-xs sm:text-sm mt-4">
                  CCG
                </div>
                <div class="text-xs font-bold py-2">
                  {{ practice.clinical_commissioning_group_name }}
                </div>
              </div>
              <div class="flex flex-col w-full lg:w-1/2 xl:w-1/5 p-1">
                <div class="text-xs sm:text-sm" mt-4>
                  Practice code
                </div>
                <div class="text-xs font-bold py-2">
                  {{ practice.code }}
                </div>
                <div class="text-xs sm:text-sm mt-4">
                  Phone number
                </div>
                <div class="text-xs font-bold py-2">
                  {{ practice.phone_number }}
                </div>
              </div>
              <div class="flex flex-col lg:flex-row xl:flex-col w-full xl:w-2/5 p-1">
                <div class="flex flex-col w-full lg:w-1/2 xl:w-full">
                  <div class="text-xs sm:text-sm">
                    Type
                  </div>
                  <div class="text-xs font-bold py-2">
                    {{ !practice.hub_type || practice.hub_type !== 'Type 2' ? practice.type : 'Hub - Health Board' }}
                  </div>
                </div>
                <div class="flex flex-col w-full lg:w-1/2 xl:w-full">
                  <div class="text-xs sm:text-sm">
                    Address
                  </div>
                  <div class="text-xs font-bold py-2">
                    {{ practice.address_line_1 }} {{ practice.address_line_2 }}
                    {{ practice.address_line_3 }} {{ practice.address_line_4 }} {{ practice.address_line_5 }}
                    {{ practice.postcode }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full lg:w-2/5 p-1">
          <div class="relative bg-white rounded-lg shadow-lg p-4 lg:p-8 h-full">
            <AppLoading spinner :loading="input_file_loading" />
            <div class="flex flex-col">
              <div class="pb-2">
                <input id="use_standard_terms" v-model="form.use_variation_terms" type="radio" name="standard_terms"
                       :value="false"
                >
                <label for="use_standard_terms">Use Standard Terms with Locum</label>
              </div>
              <div class="pb-2">
                <input id="variation_terms_file" v-model="form.use_variation_terms" type="radio" name="standard_terms"
                       :value="true"
                >
                <label for="variation_terms_file">Use Variation to Standard Terms</label>
              </div>
              <div class="relative">
                <div v-if="form.use_variation_terms" class="relative">
                  <div class="flex flex-row flex-wrap justify-between items-center">
                    <div class="text-xs sm:text-sm">
                      Your Practice's standard terms
                    </div>
                    <div v-if="authPermissions.includes('Update Profile Practice')"
                         class="flex justify-start items-center"
                    >
                      <label v-if="input_file_loading === false" for="file-upload">
                        <div class="flex flex-row flex-no-wrap cursor-pointer hover:underline">
                          <svgicon name="cloud-upload" height="24" width="24" />
                          <div class="ml-2 text-xs sm:text-sm leading-loose">
                            {{ practice.variation_terms_file ? 'Update' : 'Upload' }}</div>
                        </div>
                      </label>
                      <input id="file-upload" type="file" class="hidden" @input="onFileInput($event)">
                    </div>
                  </div>
                  <div v-if="!input_file_loading" class="bg-gray-300 rounded-lg px-4 py-2">
                    <div class="flex flex-no-wrap justify-between items-center">
                      <div class="text-xs sm:text-sm document-filename">
                        {{ practice.variation_terms_file && practice.variation_terms_file.filename ? practice.variation_terms_file.filename : 'Upload File' }}
                      </div>
                      <div v-if="practice.variation_terms_file"
                           class="font-bold text-md sm:text-lg hover:null cursor-pointer text-gray-600 hover:text-black" @click="modal = true"
                      >
                        x
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full p-1">
        <div class="relative bg-white rounded-lg shadow-lg p-2 md:p-6">
          <AppLoading :loading="loading" spinner />
          <AppFormError v-if="formError.length" :formError="formError" />
          <div class="flex flex-row flex-wrap justify-between">
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput v-model="form.phone_number" :type="'text'" :name="'phone_number'" :label="'Phone number'"
                        :error="formError.find(item => item.field === 'phone_number')" required
                        @submit="save" @blur="CheckEmptyField(form.phone_number, 'phone_number')"
              />
              <AppInput v-model="form.report_to" :type="'text'" :name="'report_to'" :label="'Report to'"
                        :error="formError.find(item => item.field === 'report_to')" required
                        @submit="save" @blur="CheckEmptyField(form.report_to, 'report_to')"
              />
              <AppInput v-model="form.email" :type="'email'" :name="'email'" :label="'Email Address'"
                        :error="formError.find(item => item.field === 'email')" required
                        @submit="save" @blur="CheckEmptyField(form.email, 'email')"
              />
              <template v-if="isOOH">
                <AppInput v-model="form.national_insurance_number" :type="'text'" :name="'national_insurance_number'" :label="'National Insurance number'"
                        :error="formError.find(item => item.field === 'national_insurance_number')" required
                        @submit="save" @blur="CheckEmptyField(form.national_insurance_number, 'national_insurance_number')"
                        @keypress="inputNumberOnly($event)"
                />
                <AppInput v-model="form.sd_number" :type="'text'" :name="'sd_number'" :label="'NHS Pension Scheme Membership number'"
                        :error="formError.find(item => item.field === 'sd_number')" required
                        @submit="save" @blur="CheckEmptyField(form.sd_number, 'sd_number')"
                        @keypress="inputNumberOnly($event)"
                />
                <AppInput v-model="form.paying_reference" :type="'text'" :name="'paying_reference'" :label="'Paying reference number'"
                        :error="formError.find(item => item.field === 'paying_reference')" required
                        @submit="save" @blur="CheckEmptyField(form.paying_reference, 'paying_reference')"
                        @keypress="inputNumberOnly($event)"
                />
                <AppInput v-model="form.ea_code" :type="'text'" :name="'ea_code'" :label="'EA Code'"
                        :error="formError.find(item => item.field === 'ea_code')" required
                        @submit="save" @blur="CheckEmptyField(form.ea_code, 'ea_code')"
                />
                <AppInput
                  v-model="form.section_scheme_year"
                  :type="'select'"
                  :name="'section_scheme_year'"
                  :label="'NHS Pension Scheme Year?'"
                  :items="[{ label: '1995/2008', value: '1995/2008' }, { label: '2015', value: '2015' }]"
                  required
                />
                <AppInput v-model="form.professional_nhs_expenses" :type="'text'" :name="'professional_nhs_expenses'" :label="'Professional NHS Expense'"
                        :error="formError.find(item => item.field === 'professional_nhs_expenses')" required
                        @submit="save" @blur="CheckEmptyField(form.professional_nhs_expenses, 'professional_nhs_expenses')"
                />
                <AppInput v-model="form.added_year_contributions" :type="'text'" :name="'added_year_contributions'" :label="'Additional contributions for Added Years, Additional Pension, NHS AVC Scheme'"
                        :error="formError.find(item => item.field === 'added_year_contributions')" required
                        @submit="save" @blur="CheckEmptyField(form.added_year_contributions, 'added_year_contributions')"
                />
                <AppInput v-model="form.added_early_retirement_contributions" :type="'text'" :name="'added_early_retirement_contributions'" :label="'Additional contributions for Early Retirement Reduction Buy Out'"
                        :error="formError.find(item => item.field === 'added_early_retirement_contributions')" required
                        @submit="save" @blur="CheckEmptyField(form.added_early_retirement_contributions, 'added_early_retirement_contributions')"
                />
                <AppInput v-model="form.nhsps_employer_contributions" :type="'text'" :name="'nhsps_employer_contributions'" :label="'NHSPS employer contributions'"
                        :error="formError.find(item => item.field === 'nhsps_employer_contributions')" required
                        @submit="save" @blur="CheckEmptyField(form.nhsps_employer_contributions, 'nhsps_employer_contributions')"
                />
                <AppInput v-model="form.nhs_pension_scheme_employing_authority_name" :type="'text'" :name="'nhs_pension_scheme_employing_authority_name'" :label="'NHSPS employing authority name'"
                        :error="formError.find(item => item.field === 'nhs_pension_scheme_employing_authority_name')" required
                        @submit="save" @blur="CheckEmptyField(form.nhs_pension_scheme_employing_authority_name, 'nhs_pension_scheme_employing_authority_name')"
                />
              </template>
            </div>
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput v-model="form.practice_type_id" :type="'multi-checkbox'"
                        :error="formError.find(item => item.field === 'practice_type_id')"
                        :name="'practice_type_id'"
                        :label="'What type of Practice are you?'"
                        :lists="practice_types" required @checked="form.practice_type_id.push(parseInt($event))" @unchecked="form.practice_type_id = form.practice_type_id.filter(id => id !== parseInt($event))"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-xs sm:text-sm mt-3 px-2">
              Compliance Documents
            </div>
            <div class="flex flex-row flex-wrap justify-bettwen">
              <template v-for="profession_compliance_category in profession_compliance_categories">
                <div :key="`${profession_compliance_category.id}-${profession_compliance_category.name}`"
                     class="flex flex-col w-full md:w-1/2 px-2"
                >
                  <div>For {{ profession_compliance_category.name }}</div>
                  <div class="ml-4">
                    <input :id="`${profession_compliance_category.id}-${profession_compliance_category.name}`"
                           v-model="empty_profession_compliance_category_ids"
                           type="checkbox" :value="profession_compliance_category.id"
                           :disabled="empty_profession_compliance_category_ids.includes(profession_compliance_category.id)"
                    >
                    <label
                      :for="`${profession_compliance_category.id}-${profession_compliance_category.name}`"
                    >N/A</label>
                  </div>
                  <div class="ml-2">
                    Reference
                  </div>
                  <template
                    v-for="compliance_document in profession_compliance_category.reference_compliance_documents"
                  >
                    <div :key="`${compliance_document.id}-${compliance_document.name}`"
                         class="ml-4 flex flex-row justify-start items-center"
                    >
                      <input :id="`${compliance_document.id}-${compliance_document.name}-${profession_compliance_category.id}`"
                             v-model="form.practice_profession_compliance_category_compliance_documents"
                             type="checkbox" :value="{
                               profession_compliance_category_id: profession_compliance_category.id,
                               compliance_document_id: compliance_document.id
                             }"
                      >
                      <label
                        :for="`${compliance_document.id}-${compliance_document.name}-${profession_compliance_category.id}`"
                      >{{ compliance_document.name }}</label>
                    </div>
                  </template>
                  <div class="ml-2">
                    Mandatory
                  </div>
                  <template
                    v-for="compliance_document in profession_compliance_category.mandatory_compliance_documents"
                  >
                    <div v-if="compliance_document.compliance_document_type_name !== 'Safeguarding'"
                         :key="`${compliance_document.id}-${compliance_document.name}`"
                         class="ml-4 flex flex-row justify-start items-center"
                    >
                      <input :id="`${compliance_document.id}-${compliance_document.name}-${profession_compliance_category.id}`"
                             v-model="form.practice_profession_compliance_category_compliance_documents"
                             type="checkbox" :value="{
                               profession_compliance_category_id: profession_compliance_category.id,
                               compliance_document_id: compliance_document.id
                             }"
                      >
                      <label
                        :for="`${compliance_document.id}-${compliance_document.name}-${profession_compliance_category.id}`"
                      >{{ compliance_document.name }}</label>
                    </div>
                    <div v-for="child_compliance_document in compliance_document.child_compliance_documents"
                         v-if="compliance_document.compliance_document_type_name === 'Safeguarding'"
                         :key="`${child_compliance_document.id}-${child_compliance_document.name}`"
                         class="ml-4 flex flex-row justify-start items-center"
                    >
                      <input :id="`${child_compliance_document.id}-${child_compliance_document.name}-${profession_compliance_category.id}`"
                             v-model="form.practice_profession_compliance_category_compliance_documents"
                             type="checkbox" :value="{
                               profession_compliance_category_id: profession_compliance_category.id,
                               compliance_document_id: child_compliance_document.id
                             }"
                      >
                      <label
                        :for="`${child_compliance_document.id}-${child_compliance_document.name}-${profession_compliance_category.id}`"
                      >{{ child_compliance_document.name }}</label>
                    </div>
                  </template>
                  <div class="ml-2">
                    Optional
                  </div>
                  <template v-for="compliance_document in profession_compliance_category.optional_compliance_documents">
                    <div :key="`${compliance_document.id}-${compliance_document.name}`"
                         class="ml-4 flex flex-row justify-start items-center"
                    >
                      <input :id="`${compliance_document.id}-${compliance_document.name}-${profession_compliance_category.id}`"
                             v-model="form.practice_profession_compliance_category_compliance_documents"
                             type="checkbox" :value="{
                               profession_compliance_category_id: profession_compliance_category.id,
                               compliance_document_id: compliance_document.id
                             }"
                      >
                      <label
                        :for="`${compliance_document.id}-${compliance_document.name}-${profession_compliance_category.id}`"
                      >{{ compliance_document.name }}</label>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>
          <div class="flex flex-row flex-wrap justify-between">
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput v-model="form.mandatory_training_id" :type="'multi-checkbox'" :name="'mandatory_training_id'"
                        :label="'Mandatory training required from Locums:'" :lists="mandatory_trainings"
                        @checked="form.mandatory_training_id.push(parseInt($event))"
                        @unchecked="form.mandatory_training_id = form.mandatory_training_id.filter(id => id !== parseInt($event))"
                        @uncheckAll="form.mandatory_training_id = []"
              />
            </div>
            <div class="flex flex-col w-full md:w-1/2 px-2">
              <AppInput v-model="form.vat_registered" :type="'single-checkbox'" :name="'vat_registered'"
                        :label="'Are you VAT registered?'"
              />
              <template v-if="form.vat_registered">
                <AppInput v-model="form.vat_number" :type="'text'" :name="'vat_number'" :label="'VAT Number'"
                          :error="formError.find(item => item.field === 'vat_number')"
                />
                <AppDate v-model="form.tax_year_end_date" :name="'tax_year_end_date'" :label="'Tax Year End Date'"
                         :error="formError.find(item => item.field === 'tax_year_end_date')"
                />
              </template>
              <div class="font-bold text-sm my-4">
                Bank Details
              </div>
              <AppInput v-model="form.account_name" :type="'text'" :name="'account_name'" :label="'Account name'"
                        :error="formError.find(item => item.field === 'account_name')" required
              />
              <AppInput v-model="form.bank_name" :type="'text'" :name="'bank_name'" :label="'Bank name'"
                        :error="formError.find(item => item.field === 'bank_name')" required
              />
              <AppInput v-model="form.sort_code" :type="'text'" :name="'sort_code'" :label="'Sort code'"
                        :error="formError.find(item => item.field === 'sort_code')" required
              />
              <AppInput v-model="form.account_number" :type="'text'" :name="'account_number'" :label="'Account number'"
                        :error="formError.find(item => item.field === 'account_number')" required
              />
            </div>
          </div>
          <div class="flex flex-row flex-wrap justify-between px-2">
            <AppInput v-model="form.extra_information" :type="'textarea'" :name="'extra_information'"
                      :label="'Extra Information (Pracking restrictions, transport links, etc.)'" :resize="false"
            />
          </div>
          <div class="p-2">
            <AppButton v-if="authPermissions.includes('Update Profile Practice')" :label="'Save changes'" :disabled="loading"
                       @click="save"
            />
          </div>
        </div>
      </div>
    </div>

    <AppConfirmationModal :label="'Proceed to remove the uploaded document?'" :confirmLabel="'Yes'"
                          :cancelLabel="'Cancel'" :modal="modal" @confirm="remove" @cancel="modal = false"
    />
  </section>
</template>
<script>
  import AppInput from "@/components/Base/AppInput"
  import AppDate from "@/components/Base/AppDate"
  import AppButton from "@/components/Base/AppButton"
  import AppFormError from "@/components/Base/AppFormError"
  import AppLoading from "@/components/Base/AppLoading"
  import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
  export default {
    transition: {
      name: "fade",
      mode: "out-in"
    },
    components: {
      AppInput,
      AppDate,
      AppButton,
      AppFormError,
      AppLoading,
      AppConfirmationModal
    },
    data () {
      return {
        // surgery: null,
        isOOH: false,
        modal: false,
        loading: false,
        input_file_loading: false,
        terms: [],
        form: {
          phone_number: "",
          report_to: "",
          email: "",
          extra_information: "",
          practice_type_id: [],
          mandatory_training_id: [],
          use_variation_terms: false,
          vat_registered: false,
          vat_number: null,
          tax_year_end_date: null,
          account_name: "",
          bank_name: "",
          sort_code: "",
          account_number: "",
          practice_profession_compliance_category_compliance_documents: [],
          national_insurance_number: null,
          sd_number: null,
          paying_reference: null,
          ea_code: null,
          professional_nhs_expenses: null,
          section_scheme_year: null,
          added_year_contributions: null,
          added_early_retirement_contributions: null,
          nhsps_employer_contributions: null,
          nhs_pension_scheme_employing_authority_name: null,
        },
        name: "",
        formError: []
      }
    },
    computed: {
      authPermissions () {
        return this.$store.getters["permissions"]
      },
      empty_profession_compliance_category_ids: {
        get () {
          return this.profession_compliance_categories
            .filter(profession_compliance_category => {
              return !this.form.practice_profession_compliance_category_compliance_documents.some(
                value => {
                  return (
                    value.profession_compliance_category_id ===
                    profession_compliance_category.id
                  )
                }
              )
            })
            .map(profession_compliance_category => {
              return profession_compliance_category.id
            })
        },
        set (empty_profession_compliance_category_ids) {
          this.form.practice_profession_compliance_category_compliance_documents = this.form.practice_profession_compliance_category_compliance_documents.filter(
            value => {
              return !empty_profession_compliance_category_ids.some(
                empty_profession_compliance_category => {
                  return (
                    empty_profession_compliance_category ===
                    value.profession_compliance_category_id
                  )
                }
              )
            }
          )
        }
      }
    },
    watch: {
      modal (value) {
        value
          ? (document.body.style.overflow = "hidden")
          : (document.body.style.overflow = "auto")
      },
      'form.practice_type_id'(newValue, oldValue) {
        this.isOOH = newValue.includes(8) ? true : false
      }
    },
    async asyncData ({ app, store, redirect, error }) {
      if (app.$auth.user.domain === "Practice") {
        let permissions = app.$auth.user.practice_detail.role.permissions.map(
          permission => permission.name
        )
        if (permissions.includes("View Profile Practice")) {
          try {
            const [
              [practice],
              practice_types,
              mandatory_trainings,
              profession_compliance_categories
            ] = await Promise.all([
              app.$axios
                .$get("/api/v1/practice/me/practice")
                .then(responsePractice => {
                  // const surgery =
                  //   responsePractice.data &&
                  //   responsePractice.data.practice &&
                  //   responsePractice.data.practice.surgery
                  //     ? responsePractice.data.practice.surgery
                  //     : null;
                  const practice =
                    responsePractice.data && responsePractice.data.practice
                      ? responsePractice.data.practice
                      : null
                  return [practice]
                }),

              app.$axios
                .$get("/api/v1/practice-types")
                .then(responsePracticeTypes => {
                  let practice_types =
                    responsePracticeTypes.data &&
                      responsePracticeTypes.data.practice_types &&
                      responsePracticeTypes.data.practice_types.length
                      ? responsePracticeTypes.data.practice_types
                      : []
                  practice_types = practice_types.map(practiceType => {
                    return { label: practiceType.name, value: practiceType.id }
                  })
                  return practice_types
                }),

              app.$axios
                .$get("/api/v1/mandatory-trainings")
                .then(responseMandatoryTrainings => {
                  let mandatory_trainings =
                    responseMandatoryTrainings.data &&
                      responseMandatoryTrainings.data.mandatory_trainings &&
                      responseMandatoryTrainings.data.mandatory_trainings.length
                      ? responseMandatoryTrainings.data.mandatory_trainings
                      : []
                  mandatory_trainings = mandatory_trainings.map(
                    mandatoryTraining => {
                      return {
                        label: mandatoryTraining.name,
                        value: mandatoryTraining.id
                      }
                    }
                  )
                  return mandatory_trainings
                }),

              app.$axios
                .$get(`/api/v1/profession-compliance-categories`)
                .then(res => {
                  return res.data.profession_compliance_categories
                })
            ])

            return {
              // surgery,
              practice,
              practice_types,
              mandatory_trainings,
              profession_compliance_categories
            }
          } catch (err) {
            console.log("err", err.response || err)
            if (err.response.data.message) {
              store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              })
            }
            error({ statusCode: 401, message: err.response.data.message })
            throw err
          }
        } else if (permissions.includes("View Profile Users")) {
          redirect(`/profile/users`)
        } else if (permissions.includes("View Profile Practice Document")) {
          redirect(`/profile/practice-documents`)
        } else {
          error({ statusCode: 401, message: "Your Practice is Not Authorized" })
        }
      }
    },
    mounted () {
      this.form.phone_number = this.practice.phone_number
      this.form.report_to = this.practice.report_to
      this.form.email = this.practice.email
      this.form.extra_information = this.practice.extra_information
      this.practice.practice_types.forEach(item => {
        this.form.practice_type_id.push(item.id)
      })
      this.isOOH = this.form.practice_type_id.includes(8) ? true : false
      this.practice.mandatory_trainings.forEach(item => {
        this.form.mandatory_training_id.push(item.id)
      })
      this.form.use_variation_terms = this.practice.use_variation_terms
      this.form.vat_registered = this.practice.vat_registered
      this.form.vat_number = this.practice.vat_number
      this.form.tax_year_end_date = this.practice.tax_year_end_date
      this.form.account_name = this.practice.account_name
      this.form.bank_name = this.practice.bank_name
      this.form.sort_code = this.practice.sort_code
      this.form.account_number = this.practice.account_number
      this.form.practice_profession_compliance_category_compliance_documents = this.practice.practice_profession_compliance_category_compliance_documents.map(
        item => {
          return {
            profession_compliance_category_id:
              item.profession_compliance_category_id,
            compliance_document_id: item.compliance_document_id
          }
        }
      )
      this.form.national_insurance_number = this.practice.national_insurance_number
      this.form.sd_number = this.practice.sd_number
      this.form.paying_reference = this.practice.paying_reference
      this.form.ea_code = this.practice.ea_code
      this.form.professional_nhs_expenses = this.practice.professional_nhs_expenses
      this.form.section_scheme_year = this.practice.section_scheme_year
      this.form.added_year_contributions = this.practice.added_year_contributions
      this.form.added_early_retirement_contributions = this.practice.added_early_retirement_contributions
      this.form.nhsps_employer_contributions = this.practice.nhsps_employer_contributions
      this.form.nhs_pension_scheme_employing_authority_name = this.practice.nhs_pension_scheme_employing_authority_name
    },
    methods: {
      async onFileInput (e) {
        if (!e.target.files.length) {
          return
        }
        this.formError = []
        let types = [
          "pdf",
          "jpeg",
          "msword",
          "tiff",
          "vnd.openxmlformats-officedocument.wordprocessingml.document",
          "vnd.openxmlformats-officedocument.wordprocessingml.template",
          "vnd.ms-word.document.macroEnabled.12",
          "vnd.ms-word.template.macroEnabled.12"
        ]
        let file = e.target.files[0]
        let fileType = file.type.split("/")[1]
        if (!types.includes(fileType)) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "alert",
            text: ["Invalid File Format"]
          })
          return
        }
        let variation_terms_file = {
          filename: file.name,
          size: file.size,
          subtype: file.type.split("/")[1],
          type: file.type.split("/")[0]
        }
        const formData = new FormData()
        formData.append("file", file)
        this.input_file_loading = true
        this.$axios
          .$put(`/api/v1/practice/me/practice-variation-term`, formData)
          .then(res => {
            this.practice.variation_terms_file = variation_terms_file
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [res.message]
            })
          })
          .catch(err => {
            console.log("err", err.response)
            if (err.response.status === 500) {
              if (err.response.data.message.includes("File size")) {
                this.formError.push({
                  field: "use_standard_terms",
                  message: err.response.data.message
                })
              } else {
                this.formError.push({
                  field: "",
                  message: "Something went wrong"
                })
              }
            }
          })
          .finally(() => {
            this.input_file_loading = false
          })
      },
      remove () {
        this.input_file_loading = true
        this.modal = false
        this.$axios
          .$delete(`/api/v1/practice/me/practice-variation-term`)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [res.message]
            })
            this.practice.variation_terms_file = null
            document.getElementById("file-upload").value = ""
          })
          .catch(err => {
            console.log("err", err.response || err)
            if (err.response.data) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [err.response.data.message]
              })
            }
          })
          .finally(() => {
            this.input_file_loading = false
          })
      },
      save () {
        this.formError = []
        let notRequired = [
          "mandatory_training_id",
          "extra_information",
          "vat_registered",
          "practice_profession_compliance_category_compliance_documents"
        ]

        if (!this.form.practice_type_id.includes(8)) {
          notRequired.push(
            "national_insurance_number",
            "sd_number",
            "paying_reference",
            "ea_code",
            "professional_nhs_expenses",
            "section_scheme_year",
            "added_year_contributions",
            "added_early_retirement_contributions",
            "nhsps_employer_contributions",
            "nhs_pension_scheme_employing_authority_name",
          )
        }

        if (
          this.form.use_variation_terms === false ||
          (this.form.use_variation_terms === true &&
            this.practice.variation_terms_file !== null)
        ) {
          notRequired.push("use_variation_terms")
        }
        if (["false", false].includes(this.form.vat_registered)) {
          notRequired.push("vat_number", "tax_year_end_date")
        }
        this.Validate(this.form, notRequired)
        if (!this.formError.length) {
          this.loading = true

          return this.$axios
            .$put(`/api/v1/practice/me/practice-profile`, this.form)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [res.message]
              })
            })
            .catch(err => {
              console.log("err", err.response || err)
              if (
                err.response &&
                err.response.data &&
                err.response.data.error_messages
              ) {
                this.formError = err.response.data.error_messages
              }
              // throw err;
            })
            .finally(() => {
              this.scrollToTop()
              this.loading = false
            })
        } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: ["Please fill up all the forms"]
          })
          this.scrollToTop()
        }
      }
    }
  }
</script>
<style scoped>
  .document-filename {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>