<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="w-full p-0 lg:w-2/3 lg:pr-4 order-2 lg:order-1">
      <div class="relative rounded-lg shadow-lg w-full p-4 md:p-8">
        <AppLoading :loading="loading" spinner />
        <AppFormError :formError="formError" v-if="formError.length > 0" />
        <form class="w-full">
          <AppInput
            v-model="form.profession_id"
            :type="'select'"
            :name="'profession_id'"
            :label="'Profession'"
            :placeholder="'Select...'"
            :items="professions"
            required
          />
          <div
            v-for="item in reference_locum_compliance_documents_list"
            :key="item.compliance_document_id"
          >
            <AppInput
              v-model="form[item.compliance_document_name.replace(/ /g, '_').toLowerCase()]"
              :type="'text'"
              :name="item.compliance_document_name.replace(/ /g, '_').toLowerCase()"
              :label="item.compliance_document_name"
              :error="formError.find(err => err.field === item.compliance_document_name.replace(/ /g, '_').toLowerCase())"
              :info="'For compliance; to be verified by the hubzz team'"
							:limit="parseInt(form.profession_id) !== 1 && parseInt(form.profession_id) <=5 ? 8 : 7"
              required
              @blur="CheckEmptyField(form[item.compliance_document_name.replace(/ /g, '_').toLowerCase()], item.compliance_document_name.replace(/ /g, '_').toLowerCase()), checkValidation(item.compliance_document_name, parseInt(form.profession_id) !== 1 && parseInt(form.profession_id) <=5 ? 8 : 7)"
              @keydown="[1, 10, '1','10'].includes(form.profession_id) ? inputNumberOnly($event) : alphaNumeric($event)"
            />
          </div>
          <!-- <AppInput
            v-model="form.gmc_or_nmc_number"
            :type="'text'"
            :name="'gmc_or_nmc_number'"
            :label="'GMC / NMC Number'"
            :error="formError.find(item => item.field === 'gmc_or_nmc_number')"
            :info="'For compliance; to be verified by the hubzz team'"
            @submit="save"
            @blur="CheckEmptyField(form.gmc_or_nmc_number, 'gmc_or_nmc_number')"
            @keypress="inputNumberOnly($event)"
            required
          />
          <AppInput
            v-model="form.mpl_or_npl_number"
            :type="'text'"
            :name="'mpl_or_npl_number'"
            :label="'MPL / NPL Number'"
            :error="formError.find(item => item.field === 'mpl_or_npl_number')"
            @submit="save"
            @blur="CheckEmptyField(form.mpl_or_npl_number, 'mpl_or_npl_number')"
            @keypress="inputNumberOnly($event)"
          /> -->
          <AppFilterSearch
            v-model="form.qualification_id"
            :name="'qualification_id'"
            :label="'Specialty'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'qualification_id')"
            :info="'Choose at least one qualification'"
            :url="'/api/v1/qualifications'"
            :professionCategoryId="professionCategoryId.toString()"
            @add="CheckEmptyField(form.qualification_id, 'qualification_id')"
            @remove="CheckEmptyField(form.qualification_id, 'qualification_id')"
            required
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
            required
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
            @keypress="inputNumberOnly($event)"
            @submit="save"
          />
          <AppInput
            v-model="form.headline"
            :type="'text'"
            :name="'headline'"
            :label="'Headline'"
            :info="'A short headline about yourself to show to Practices'"
            @submit="save"
          />
          <AppInput
            v-model="form.short_biography"
            :type="'textarea'"
            :name="'short_biography'"
            :label="'Short Biography'"
            :info="'A little bit about yourself to inform to the Practices'"
            :resize="false"
            @submit="save"
          />
          <AppInput
            v-model="form.special_requirements"
            :type="'textarea'"
            :name="'special_requirements'"
            :label="'Special requirements'"
            :info="'Information for Practices for your own needs'"
            :resize="false"
            @submit="save"
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

          <div class="flex flex-col my-8">
            <div class="relative flex flex-row flex-wrap justify-between">
              <label for="rates" class="text-xs sm:text-sm py-1">
                Your preferred rates £
                <small>(minimum)</small>
              </label>
              <div class="rounded bg-gray-300 p-1 text-xs sm:text-sm">To match available jobs with</div>
            </div>
            <div class="flex flex-row flex-wrap justify-between">
              <div class="flex flex-col w-full sm:w-1/3 px-1">
                <!-- <label for="rates" class="text-xs sm:text-sm py-1">Per Hour</label> -->
                <div class="flex flex-row flex-no-wrap">
                  <AppInput
                    v-model="form.min_rate_per_hour"
                    :type="'number'"
                    :name="'min_rate_per_hour'"
                    :label="'Per Hour £'"
                    :error="formError.find(item => item.field === 'min_rate_per_hour')"
                    @submit="save"
                    @blur="CheckEmptyField(form.min_rate_per_hour, 'min_rate_per_hour')"
                    class="w-1/2 px-1"
                    required
                  />
                  <!-- <AppInput
                    v-model="form.max_rate_per_hour"
                    :type="'number'"
                    :name="'max_rate_per_hour'"
                    :label="'To £'"
                    :error="formError.find(item => item.field === 'max_rate_per_hour')"
                    @submit="save"
                    @blur="CheckEmptyField(form.max_rate_per_hour, 'max_rate_per_hour')"
                    class="w-1/2 px-1"
                    required
                  />-->
                </div>
              </div>
              <div class="flex flex-col w-full sm:w-1/3 px-1">
                <!-- <label for="rates" class="text-xs sm:text-sm py-1">Per Half Day Session</label> -->
                <div class="flex flex-row flex-no-wrap">
                  <AppInput
                    v-model="form.min_rate_per_half_day_session"
                    :type="'number'"
                    :name="'min_rate_per_half_day_session'"
                    :label="'Per Half Day Session £'"
                    :error="formError.find(item => item.field === 'min_rate_per_half_day_session')"
                    @submit="save"
                    @blur="CheckEmptyField(form.min_rate_per_half_day_session, 'min_rate_per_half_day_session')"
                    required
                  />
                  <div class="mx-1"></div>
                  <!-- <AppInput
                    v-model="form.max_rate_per_half_day_session"
                    :type="'number'"
                    :name="'max_rate_per_half_day_session'"
                    :label="'To £'"
                    :error="formError.find(item => item.field === 'max_rate_per_half_day_session')"
                    @submit="save"
                    @blur="CheckEmptyField(form.max_rate_per_half_day_session, 'max_rate_per_half_day_session')"
                    required
                  />-->
                </div>
              </div>
              <div class="flex flex-col w-full sm:w-1/3 px-1">
                <!-- <label for="rates" class="text-xs sm:text-sm py-1">Per Whole Day Session</label> -->
                <div class="flex flex-row flex-no-wrap">
                  <AppInput
                    v-model="form.min_rate_per_whole_day_session"
                    :type="'number'"
                    :name="'min_rate_per_whole_day_session'"
                    :label="'Per Whole Day Session £'"
                    :error="formError.find(item => item.field === 'min_rate_per_whole_day_session')"
                    @submit="save"
                    @blur="CheckEmptyField(form.min_rate_per_whole_day_session, 'min_rate_per_whole_day_session')"
                    required
                  />
                  <div class="mx-1"></div>
                  <!-- <AppInput
                    v-model="form.max_rate_per_whole_day_session"
                    :type="'number'"
                    :name="'max_rate_per_whole_day_session'"
                    :label="'To £'"
                    :error="formError.find(item => item.field === 'max_rate_per_whole_day_session')"
                    @submit="save"
                    @blur="CheckEmptyField(form.max_rate_per_whole_day_session, 'max_rate_per_whole_day_session')"
                    required
                  />-->
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
            v-model="form.practice_type_id"
            :type="'multi-checkbox'"
            :name="'practice_type_id'"
            :label="'What type of Practice(s) would you like to work for?'"
            :error="formError.find(item => item.field === 'practice_type_id')"
            :lists="practiceTypes"
            @checked="form.practice_type_id.push(parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
            @unchecked="form.practice_type_id = form.practice_type_id.filter(id => id !== parseInt($event)), CheckEmptyField(form.practice_type_id, 'practice_type_id')"
            required
          />
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
          </template>
          <template v-if="form.employment_type === 'Self-Employed'">
            <AppInput
              v-model="form.utr_number"
              :type="'text'"
              :name="'utr_number'"
              :label="'UTR number'"
              :error="formError.find(item => item.field === 'utr_number')"
              :placeholder="''"
              @keypress="inputNumberOnly($event)"
              required
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
            <div class="font-bold text-sm my-4">Payroll Details</div>
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
              :type="'text'"
              :name="'payroll_sort_code'"
              :label="'Sort Code'"
              :error="formError.find(item => item.field === 'payroll_sort_code')"
              required
            />
            <AppInput
              v-model="form.payroll_account_number"
              :type="'text'"
              :name="'payroll_account_number'"
              :label="'Payroll Reference Number'"
              :error="formError.find(item => item.field === 'payroll_account_number')"
              required
            />
          </template>
          <template v-if="form.paid_under_payroll == false || form.paid_under_payroll == 'false'">
            <div class="font-bold text-sm my-4">Bank Details</div>
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
              :type="'text'"
              :name="'sort_code'"
              :label="'Sort Code'"
              :error="formError.find(item => item.field === 'sort_code')"
              :limit="6"
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
                v-model="form.nhs_number"
                :type="'text'"
                :name="'nhs_number'"
                :label="'NHS number'"
                :error="formError.find(item => item.field === 'nhs_number')"
                required
                @keypress="inputNumberOnly($event)"
              />
            </template>
          </template>

          <AppPostCode
            :urlIndex="'/api/v1/postcode-coordinates'"
            v-model="form.post_code"
            :name="'post_code'"
            :label="'The post code where I will be available at'"
            :error="formError.find(item => item.field === 'post_code')"
            @blur="CheckEmptyField(form.post_code, 'post_code')"
            required
          />
          <AppInput
            v-model="form.miles"
            :type="'number'"
            :name="'miles'"
            :label="`I will travel up to ${form.miles ? form.miles : 'n'} miles from this postcode`"
            :error="formError.find(item => item.field === 'miles')"
            :inStyle="'text-align:right;'"
            @blur="CheckEmptyField(form.miles, 'miles')"
            required
          />
          <div class="text-xs sm:text-sm">Referees</div>
          <div class="rounded-lg bg-gray-400 p-8 my-2">
            <AppInput
              v-model="form.referee_1_contact_name"
              :type="'text'"
              :name="'referee_1_contact_name'"
              :label="'Contact name'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
            />
            <AppInput
              v-model="form.referee_1_phone_number"
              :type="'text'"
              :name="'referee_1_phone_number'"
              :label="'Telephone number'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              @keypress="inputTelephone($event)"
            />
            <AppInput
              v-model="form.referee_1_email"
              :type="'text'"
              :name="'referee_1_email'"
              :label="'Email address'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
            />
          </div>
          <div class="rounded-lg bg-gray-400 p-8 my-2">
            <AppInput
              v-model="form.referee_2_contact_name"
              :type="'text'"
              :name="'referee_2_contact_name'"
              :label="'Contact name'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
            />
            <AppInput
              v-model="form.referee_2_phone_number"
              :type="'text'"
              :name="'referee_2_phone_number'"
              :label="'Telephone number'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
              @keypress="inputTelephone($event)"
            />
            <AppInput
              v-model="form.referee_2_email"
              :type="'text'"
              :name="'referee_2_email'"
              :label="'Email address'"
              :inStyle="'background-color:#dae1e7;border-color:white'"
            />
          </div>
          <div class="text-left mt-5">
            <AppButton :label="'Save changes'" @click="save" />
          </div>
        </form>
      </div>
    </div>
    <div class="w-full lg:w-auto mb-4 lg:mb-0 p-0 lg:pr-4 order-1 lg:order-2">
      <div class="rounded-lg shadow-lg w-full py-8 px-12">
        <AppAvatar
          class="m-auto"
          :type="'update'"
          :src="profile.avatar ? profile.avatar : ''"
        />
        <div class="leading-none text-center text-sm pt-4">
          <p class="font-bold">{{ profile.name }}</p>
          <p>{{ profile.email }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let employmentTypes = [
  { label: "Self-Employed", value: "Self-Employed" },
  { label: "Limited Company", value: "Limited Company" }
];
import AppFormError from "@/components/Base/AppFormError";
import AppLoading from "@/components/Base/AppLoading";
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import AppButton from "@/components/Base/AppButton";
import AppAvatar from "@/components/Base/AppAvatar";
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppFormError,
    AppLoading,
    AppInput,
    AppPostCode,
    AppFilterSearch,
    AppButton,
    AppAvatar
  },
  data() {
    return {
      employmentTypes,
      professionCategoryId: "",
      selectedQualification: [],
      selectedClinicalSystem: [],
      selectedSpokenLanguage: [],
      professions_categories: [],
      reference_locum_compliance_documents_list: [],
      form: {
				reference_locum_compliance_documents: [],
        // gmc_or_nmc_number: "",
        // mpl_or_npl_number: "",
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
        min_rate_per_hour: "",
        max_rate_per_hour: "",
        min_rate_per_half_day_session: "",
        max_rate_per_half_day_session: "",
        min_rate_per_whole_day_session: "",
        max_rate_per_whole_day_session: "",
        mandatory_training_id: [],
        practice_type_id: [],
        post_code: "",
        miles: "",
        referee_1_contact_name: "",
        referee_1_phone_number: "",
        referee_1_email: "",
        referee_2_contact_name: "",
        referee_2_phone_number: "",
        referee_2_email: "",
        employment_type: "Self-Employed",
        company_registration_number: "",
        utr_number: "",
        paid_under_payroll: false,
        payroll_account_name: "",
        payroll_bank_name: "",
        payroll_sort_code: "",
        payroll_account_number: "",
        account_name: "",
        bank_name: "",
        sort_code: "",
        account_number: "",
        ir35: false,
        claim_nhs: false,
        nhs_number: ""
      },
      profile: {
        avatar: null,
        name: "",
        email: ""
      },
      formError: [],
      loading: false
    };
  },
  watch: {
    "form.profession_id"(value) {
      let profession = this.professions.find(item => item.value == value);
      if (profession.label === "GP") {
        this.professionCategoryId = 1;
      } else if (profession.label !== "GP") {
        this.professionCategoryId = 2;
      }
      let findprofession = this.professions.find(
				item =>item.value === parseInt(value));
			this.reference_locum_compliance_documents_list = findprofession.reference_compliance_documents;
    }
  },
  async asyncData({ app, store, error }) {
    try {
      const [
        professions,
        practiceTypes,
        mandatoryTrainings,
        user
      ] = await Promise.all([
        app.$axios.$get(`/api/v1/professions`).then(responseProfessions => {
          const professions = [];
          responseProfessions.data.professions.forEach(profession => {
            professions.push({ label: profession.name, value: profession.id, reference_compliance_documents: profession.profession_compliance_category.reference_compliance_documents });
          });
          return professions;
        }),
        app.$axios
          .$get(`/api/v1/practice-types`)
          .then(responsePracticeTypes => {
            const practice_types = [];
            responsePracticeTypes.data.practice_types.forEach(practiceType => {
              practice_types.push({
                label: practiceType.name,
                value: practiceType.id
              });
            });
            return practice_types;
          }),
        app.$axios
          .$get(`/api/v1/mandatory-trainings`)
          .then(responseMandatoryTrainings => {
            const mandatory_trainings = [];
            responseMandatoryTrainings.data.mandatory_trainings.forEach(
              mandatoryTraining => {
                mandatory_trainings.push({
                  label: mandatoryTraining.name,
                  value: mandatoryTraining.id
                });
              }
            );
            return mandatory_trainings;
          }),
        app.$axios.$get(`/api/v1/locum/me/profile`).then(responseMe => {
          const user =
            responseMe.data && responseMe.data.user
              ? responseMe.data.user
              : null;
          return user;
        })
      ]);

      return {
        professions,
        // professions_categories,
        practiceTypes,
        mandatoryTrainings,
        user
      };
    } catch (err) {
      console.log("err", err);
      if (err.response.data.message) {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: [`${err.response.data.message}`]
        });
      }
      throw err;
    }
  },
  mounted() {
    this.profile.avatar = this.user.file_url;
    this.profile.name = `${this.user.first_name} ${this.user.last_name}`;
    this.profile.email = this.user.email;
    // this.form.gmc_or_nmc_number =
    //   this.user.locum_detail && this.user.locum_detail.gmc_or_nmc_number
    //     ? this.user.locum_detail.gmc_or_nmc_number.number
    //     : null;
    // this.form.mpl_or_npl_number =
    //   this.user.locum_detail && this.user.locum_detail.mpl_or_npl_number
    //     ? this.user.locum_detail.mpl_or_npl_number.number
    //     : null;
    // if (this.user.locum_detail.gmc_or_nmc_number.status === "Rejected") {
    //   this.formError.push({
    //     field: "gmc_or_nmc_number",
    //     message: "Rejected"
    //   });
    // }
    // if (this.user.locum_detail.mpl_or_npl_number.status === "Rejected") {
    //   this.formError.push({
    //     field: "mpl_or_npl_number",
    //     message: "Rejected"
    //   });
    // }
    this.form.nhs_smart_card_id_number = this.user.nhs_smart_card_id_number;
    this.form.headline = this.user.headline;
    this.form.short_biography = this.user.short_biography;
    this.form.special_requirements = this.user.special_requirements;
    this.form.profession_id = this.user.profession.id;
    // this.professionCategoryId = this.user.profession.profession_category.id;

    this.form.qualification_id = this.user.qualifications.map(
      qualification => {
        return { label: qualification.name, value: qualification.id };
      }
    );
    this.form.clinical_system_id = this.user.clinical_systems.map(
      clinicalSystem => {
        return { label: clinicalSystem.name, value: clinicalSystem.id };
      }
    );
    this.form.spoken_language_id = this.user.spoken_languages.map(
      spokenLanguage => {
        return { label: spokenLanguage.name, value: spokenLanguage.id };
      }
    );
    this.form.view_locum_jobs = this.user.view_locum_jobs;
    this.form.view_permanent_jobs = this.user.view_permanent_jobs;
    this.form.min_rate_per_hour = this.user.min_rate_per_hour
    this.form.max_rate_per_hour = this.user.max_rate_per_hour
    this.form.min_rate_per_half_day_session = this.user.min_rate_per_half_day_session
    this.form.max_rate_per_half_day_session = this.user.max_rate_per_half_day_session
    this.form.min_rate_per_whole_day_session = this.user.min_rate_per_whole_day_session
    this.form.max_rate_per_whole_day_session = this.user.max_rate_per_whole_day_session
    this.form.practice_type_id = this.user.practice_types.map(
      practiceType => practiceType.id
    );
    this.form.mandatory_training_id = this.user.mandatory_trainings.map(
      mandatoryTraining => mandatoryTraining.mandatory_training.id
    );
    this.form.post_code = this.user.locum_postcode;
    this.form.miles = this.user.miles;


    let findprofession = this.professions.find(
				item =>item.value === parseInt(this.user.profession.id));
    this.reference_locum_compliance_documents_list = findprofession.reference_compliance_documents;

    this.reference_locum_compliance_documents_list.forEach(item => {
      this.form[item.compliance_document_name.replace(/ /g, '_').toLowerCase()] = this.user.reference_locum_compliance_documents.find(ref => ref.compliance_document_id === item.compliance_document_id).reference
    })

    this.form.referee_1_contact_name = this.user.referee_1_contact_name;
    this.form.referee_1_phone_number = this.user.referee_1_phone_number;
    this.form.referee_1_email = this.user.referee_1_email;
    this.form.referee_2_contact_name = this.user.referee_2_contact_name;
    this.form.referee_2_phone_number = this.user.referee_2_phone_number;
    this.form.referee_2_email = this.user.referee_2_email;

    // this.user.referees.forEach((referee, index) => {
    //   if (index == 0) {
    //     this.form.referee_1_contact_name = referee.name;
    //     this.form.referee_1_phone_number = referee.phone_number;
    //     this.form.referee_1_email = referee.email;
    //   }
    //   if (index == 1) {
    //     this.form.referee_2_contact_name = referee.name;
    //     this.form.referee_2_phone_number = referee.phone_number;
    //     this.form.referee_2_email = referee.email;
    //   }
    // });
    // if (this.user.locum_detail.invoice_detail) {
      this.form.employment_type = this.user.employment_type
      this.form.utr_number = this.user.utr_number;
      this.form.company_registration_number = this.user.company_registration_number;
      this.form.ir35 = this.user.ir35;
      // claim nhs
      this.form.claim_nhs = this.user.claim_nhs;
      this.form.nhs_number = this.user.nhs_number;
      this.form.paid_under_payroll = this.user.paid_under_payroll;
    // }
    // if (
    //   this.user.locum_detail.invoice_detail &&
    //   this.user.locum_detail.invoice_detail.payroll_detail
    // ) {
      this.form.payroll_account_name = this.user.payroll_account_name;
      this.form.payroll_account_number = this.user.payroll_account_number;
      this.form.payroll_sort_code = this.user.payroll_sort_code;
      this.form.payroll_bank_name = this.user.payroll_bank_name;
    // }
    // if (
    //   this.user.locum_detail.invoice_detail &&
    //   this.user.locum_detail.invoice_detail.bank_account
    // ) {
      this.form.account_name = this.user.account_name;
      this.form.account_number = this.user.account_number;
      this.form.sort_code = this.user.sort_code;
      this.form.bank_name = this.user.bank_name;
    // }
  },
  methods: {
    checkValidation(name, limit) {
      let fieldName = name.replace(/ /g, "_").toLowerCase();
			let field = this.form.reference_locum_compliance_documents.find(
				item => item.name === name
			);
			if (field.reference.length < limit) {
				this.formError.push({
					field: fieldName,
					message: `${name} must be ${limit} characters.`
				});
			}
    },
    save() {
      let notRequired = [
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
        "max_rate_per_hour",
        "max_rate_per_half_day_session",
        "max_rate_per_whole_day_session",
        "mpl_or_npl_number"
      ];
      this.form.max_rate_per_hour = 999999999;
      this.form.max_rate_per_half_day_session = 999999999;
      this.form.max_rate_per_whole_day_session = 999999999;

      if (this.form.employment_type === "Self-Employed") {
        notRequired.push("company_registration_number");
      } else if (this.form.employment_type === "Limited Company") {
        notRequired.push("utr_number");
      }

      if (this.professionCategoryId === 2) {
        this.form.claim_nhs = false;
      }

      if (["false", false].includes(this.form.claim_nhs)) {
        notRequired.push("nhs_number");
        this.form.nhs_number = null;
      }

      if (["false", false].includes(this.form.paid_under_payroll)) {
        this.form.payroll_account_name = "";
        this.form.payroll_account_number = "";
        this.form.payroll_sort_code = "";
        this.form.payroll_bank_name = "";
        notRequired.push(
          "payroll_account_name",
          "payroll_bank_name",
          "payroll_sort_code",
          "payroll_account_number"
        );
      }

      if (["true", true].includes(this.form.paid_under_payroll)) {
        this.form.account_name = "";
        this.form.account_number = "";
        this.form.sort_code = "";
        this.form.bank_name = "";
        notRequired.push(
          "account_name",
          "bank_name",
          "sort_code",
          "account_number"
        );
      }

      if (
        ["true", true].includes(this.form.view_locum_jobs) ||
        ["true", true].includes(this.form.view_permanent_jobs)
      ) {
        notRequired.push("view_locum_jobs", "view_permanent_jobs");
      }

      if (this.form.profession_id) {
				let profession = this.professions.find(
					item => item.value === parseInt(this.form.profession_id)
				);
				profession.reference_compliance_documents.forEach(
					item => {
						if (
							this.form[
								item.compliance_document_name.replace(/ /g, "_").toLowerCase()
							]
						) {
							this.form.reference_locum_compliance_documents.push({
								compliance_document_id: item.compliance_document_id,
								reference: this.form[
									item.compliance_document_name.replace(/ /g, "_").toLowerCase()
								]
							});
						} else {
							this.formError.push({
								field: item.compliance_document_name
									.replace(/ /g, "_")
									.toLowerCase(),
								message: `${item.compliance_document_name} is required`
							});
						}
					}
				);
			}

      this.formError = [];

      this.Validate(this.form, notRequired);

      if (!this.formError.length) {
        this.loading = true;
        this.selectedClinicalSystem = [...this.form.clinical_system_id];
        this.form.clinical_system_id = this.form.clinical_system_id.length
          ? this.form.clinical_system_id.map(item => item.value)
          : [];
        this.selectedQualification = [...this.form.qualification_id];
        this.form.qualification_id = this.form.qualification_id.length
          ? this.form.qualification_id.map(item => item.value)
          : [];
        this.selectedSpokenLanguage = [...this.form.spoken_language_id];
        this.form.spoken_language_id = this.form.spoken_language_id.length
          ? this.form.spoken_language_id.map(item => item.value)
          : [];
        this.form.profession_id = this.form.profession_id.toString();
        this.form.ir35 =
          this.professionCategoryId === 1 ? this.form.ir35 : false;

        this.$axios
          .$put(`/api/v1/locum/me/profile`, this.form)
          .then(res => {
            this.form.clinical_system_id = this.selectedClinicalSystem;
            this.form.qualification_id = this.selectedQualification;
            this.form.spoken_language_id = this.selectedSpokenLanguage;
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$store.commit("SET_VIEW_LOCUM_JOBS", this.form.view_locum_jobs)
            this.$store.commit("SET_VIEW_PERMANENT_JOBS", this.form.view_permanent_jobs)
            this.CheckUserVerification();
          })
          .catch(err => {
            console.log("err", err.response || err);
            this.form.clinical_system_id = this.selectedClinicalSystem;
            this.form.qualification_id = this.selectedQualification;
            this.form.spoken_language_id = this.selectedSpokenLanguage;
            if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${err.response.data.message}`]
              });
            }
            if (
              err.response &&
              err.response.data &&
              err.response.data.error_messages
            ) {
              err.response.data.error_messages.forEach(error => {
                this.formError.push(error);
              });
            }
            throw err;
          })
          .finally(() => {
            this.loading = false;
            this.scrollToTop();
          });
      } else {
        // this.$store.commit("SET_NOTIFICATION", {
        //   enabled: true,
        //   status: "danger",
        //   text: ["Please fill up all the forms"]
        // });
        this.form;
        this.scrollToTop();
      }
    }
  }
};
</script>


