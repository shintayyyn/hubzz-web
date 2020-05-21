<template>
  <div ref="container" class="flex flex-col items-center justify-center xl:mx-4 w-full">
    <AppFormError v-if="formError.length > 0" class="w-full mb-4" :formError="formError" />
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex flex-col w-full p-4 md:p-8 m-1 rounded-lg shadow-lg">
        <form class="w-full">
          <AppInput
            v-model="form.type"
            :type="'select'"
            :name="'type'"
            :label="'Type'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'type')"
            :items="types"
            required
            @blur="CheckEmptyField(form.type, 'type')"
          />
          <AppInput
            v-if="form.type === 'Hub'"
            v-model="form.hub_type"
            :type="'select'"
            :name="'hub_type'"
            :label="'Hub Type'"
            :placeholder="'Select...'"
            :error="formError.find(item => item.field === 'hub_type')"
            :items="hub_types"
            required
          />
          <div v-if="form.type === 'Hub'" class="m-2 bg-gray-300 rounded-lg">
            <div v-if="form.hub_type === 'Type 1'" class="m-3 p-2 my-2">
              <p class="font-semibold text-lg">Hub</p>
              <p>Hubs can create jobs for their own surgeries, and can invite Spokes, and create jobs for them.</p>
            </div>
            <div v-if="form.hub_type === 'Type 2'" class="m-3 p-2 my-2">
              <p class="font-semibold text-lg">Hub - Healthboard</p>
              <p>Healthboard Hubs can only create jobs for its spokes but not for itself.</p>
            </div>
          </div>

          <AppInput
            v-model="form.title"
            :type="'text'"
            :name="'title'"
            :label="'Title'"
            :placeholder="'(ex. Mr., Ms., Mrs.)'"
          />
          <AppInput
            v-model="form.first_name"
            :type="'text'"
            :name="'first_name'"
            :label="'First name'"
            :placeholder="'Your first name'"
            :error="formError.find(item => item.field === 'first_name')"
            required
            @blur="CheckEmptyField(form.first_name,'first_name')"
          />
          <AppInput
            v-model="form.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last name'"
            :placeholder="'Your last name'"
            :error="formError.find(item => item.field === 'last_name')"
            required
            @blur="CheckEmptyField(form.last_name,'last_name')"
          />
          <AppInput
            v-model="form.suffix"
            :type="'text'"
            :name="'suffix'"
            :label="'Suffix'"
            :placeholder="'(ex. Ph.D., M.D., etc.)'"
          />
          <AppInput
            v-model="form.practice_role"
            :type="'select'"
            :name="'practice_role'"
            :label="'Role'"
            :error="formError.find(item => item.field === 'practice_role')"
            :placeholder="'Select...'"
            :items="practice_roles"
            required
            @blur="CheckEmptyField(form.practice_role,'practice_role')"
          />
          <AppInput
            v-model="form.practice_type_id"
            :type="'multi-checkbox'"
            :name="'practice_type_id'"
            :label="'What type of Practice(s) do you do?'"
            :error="formError.find(item => item.field === 'practice_type_id')"
            :lists="practiceTypes"
            required
            @checked="checkPracticeType($event)"
            @unchecked="uncheckPracticeType($event)"
          />
          <template v-if="isOOH">
            <AppInput
              v-model="form.national_insurance_number"
              :type="'text'"
              :name="'national_insurance_number'"
              :label="'National Insurance number'"
              :error="formError.find(item => item.field === 'national_insurance_number')"
              required
              @blur="CheckEmptyField(form.national_insurance_number, 'national_insurance_number')"
              @keypress="inputNumberOnly($event)"
            />
            <AppInput
              v-model="form.sd_number"
              :type="'text'"
              :name="'sd_number'"
              :label="'NHS Pension Scheme Membership number'"
              :error="formError.find(item => item.field === 'sd_number')"
              required
              @blur="CheckEmptyField(form.sd_number, 'sd_number')"
              @keypress="inputNumberOnly($event)"
            />
            <AppInput
              v-model="form.paying_reference"
              :type="'text'"
              :name="'paying_reference'"
              :label="'Paying reference number'"
              :error="formError.find(item => item.field === 'paying_reference')"
              required
              @blur="CheckEmptyField(form.paying_reference, 'paying_reference')"
              @keypress="inputNumberOnly($event)"
            />
            <AppInput
              v-model="form.ea_code"
              :type="'text'"
              :name="'ea_code'"
              :label="'EA Code'"
              :error="formError.find(item => item.field === 'ea_code')"
              required
              @blur="CheckEmptyField(form.ea_code, 'ea_code')"
            />
            <AppInput
              v-model="form.section_scheme_year"
              :type="'select'"
              :name="'section_scheme_year'"
              :label="'NHS Pension Scheme Year?'"
              :items="[{ label: '1995/2008', value: '1995/2008' }, { label: '2015', value: '2015' }]"
              required
            />
            <AppInput
              v-model="form.professional_nhs_expenses"
              :type="'text'"
              :name="'professional_nhs_expenses'"
              :label="'Professional NHS Expense'"
              :error="formError.find(item => item.field === 'professional_nhs_expenses')"
              required
              @blur="CheckEmptyField(form.professional_nhs_expenses, 'professional_nhs_expenses')"
            />
            <AppInput
              v-model="form.added_year_contributions"
              :type="'text'"
              :name="'added_year_contributions'"
              :label="'Additional contributions for Added Years, Additional Pension, NHS AVC Scheme'"
              :error="formError.find(item => item.field === 'added_year_contributions')"
              required
              @blur="CheckEmptyField(form.added_year_contributions, 'added_year_contributions')"
            />
            <AppInput
              v-model="form.added_early_retirement_contributions"
              :type="'text'"
              :name="'added_early_retirement_contributions'"
              :label="'Additional contributions for Early Retirement Reduction Buy Out'"
              :error="formError.find(item => item.field === 'added_early_retirement_contributions')"
              required
              @blur="CheckEmptyField(form.added_early_retirement_contributions, 'added_early_retirement_contributions')"
            />
            <AppInput
              v-model="form.nhsps_employer_contributions"
              :type="'text'"
              :name="'nhsps_employer_contributions'"
              :label="'NHSPS employer contributions'"
              :error="formError.find(item => item.field === 'nhsps_employer_contributions')"
              required
              @blur="CheckEmptyField(form.nhsps_employer_contributions, 'nhsps_employer_contributions')"
            />
            <AppInput
              v-model="form.nhs_pension_scheme_employing_authority_name"
              :type="'text'"
              :name="'nhs_pension_scheme_employing_authority_name'"
              :label="'NHSPS employing authority name'"
              :error="formError.find(item => item.field === 'nhs_pension_scheme_employing_authority_name')"
              required
              @blur="CheckEmptyField(form.nhs_pension_scheme_employing_authority_name, 'nhs_pension_scheme_employing_authority_name')"
            />
          </template>
          <AppInput
            v-model="form.vat_registered"
            :type="'single-checkbox'"
            :name="'vat_registered'"
            :label="'Are you VAT registered?'"
          />
          <template v-if="form.vat_registered">
            <AppInput
              v-model="form.vat_number"
              :type="'text'"
              :name="'vat_number'"
              :label="'VAT Number'"
              :error="formError.find(item => item.field === 'vat_number')"
            />
            <AppDate
              v-model="form.tax_year_end_date"
              :name="'tax_year_end_date'"
              :label="'Tax Year End Date'"
              :error="formError.find(item => item.field === 'tax_year_end_date')"
            />
          </template>

          <template v-if="['Spoke', 'Stand Alone'].includes(form.type)">
            <div class="font-bold text-sm mt-4">Your Practice Hub</div>
            <template v-if="practice_hub">
              <div class="flex flex-col">
                <div class="flex justify-start">
                  <div>Name:</div>
                  <div class="ml-2">{{practice_hub.name}}</div>
                </div>
                <div class="flex justify-start">
                  <div>CCG:</div>
                  <div class="ml-2">{{practice_hub.clinical_commissioning_group_name}}</div>
                </div>
                <div class="flex justify-start">
                  <div>Code:</div>
                  <div class="ml-2">{{practice_hub.code}}</div>
                </div>
                <div class="flex justify-start">
                  <div>Hub Type:</div>
                  <div class="ml-2">{{practice_hub.hub_type}}</div>
                </div>
              </div>
              <div
                class="my-2 text-sm cursor-pointer bg-yellow-500 w-1/4 flex justify-center px-2 py-1 rounded-lg shadow-lg font-bold"
                @click="removePracticeHub"
              >Select another Hub</div>
            </template>
            <template v-if="!practice_hub">
              <AppInput
                v-model="search_text"
                :type="'text'"
                :name="'search'"
                :placeholder="'Surgery Name, Surgery Code, or keywords'"
                @submit="search"
                :error="formError.find(item => item.field === 'hub_practice_id')"
              />
              <AppButton :label="'Search'" @click="search" :inStyle="'padding:5px 14px;'" />

              <div v-if="showResult && practiceHubs.length === 0" class="mt-5">
                <div
                  class="text-xs xl:text-base font-bold"
                >No practice matched that name. Try again with whole words, practice code or CCG.</div>
              </div>
              <div
                class="rounded-lg shadow-lg overflow-auto mt-5 bg-white"
                v-if="showResult && practiceHubs.length > 0"
              >
                <div
                  class="text-xs lg:text-base font-bold p-4"
                >Select by clicking on the practice that you wish to add</div>

                <div
                  class="border-t-2 p-4 cursor-pointer hover:bg-gray-400"
                  v-for="(item) in practiceHubs"
                  :key="item.id"
                  @click="select(item)"
                >
                  <div class="flex flex-col justify-start text-xs xl:text-base">
                    <div class="flex flex-col font-bold">
                      <div>
                        <span>{{item.surgery.name}}</span>
                        <span
                          class="p-1 px-4 rounded-lg text-sm mx-2 text-white"
                          :class="item.type == 'Spoke' ? 'bg-blue-400' : 'bg-purple-400'"
                        >{{item.type}}</span>
                        <span
                          v-if="item.invited === true"
                          class="justify-right p-1 px-4 text-sm text-white font-semibold rounded-lg bg-green-400"
                        >Invited</span>
                      </div>
                    </div>
                    <div class="flex flex-row flex-no-wrap mt-1">
                      <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">CCG</div>
                      <div
                        class="flex items-center"
                      >{{item.surgery.clinical_commissioning_group ? item.surgery.clinical_commissioning_group.name : 'N/A'}}</div>
                    </div>
                    <div class="flex flex-row flex-no-wrap mt-1">
                      <div class="rounded-lg bg-gray-300 py-1 px-2 mr-1">Practice Code</div>
                      <div class="flex items-center">{{item.surgery.code}}</div>
                    </div>
                  </div>
                </div>
                <div class="border-t-2 p-4 text-xs xl:text-base">
                  <p class="font-bold">These are just top 10 matches from your search term.</p>
                  <p
                    class="font-bold"
                  >Try again with practice code or its full name if the practice isn't in the result.</p>
                </div>
              </div>
            </template>
          </template>

          <div class="font-bold text-sm my-4">Bank Details</div>
          <AppInput
            v-model="form.account_name"
            :type="'text'"
            :name="'account_name'"
            :label="'Account name'"
            :error="formError.find(item => item.field === 'account_name')"
            required
          />
          <AppInput
            v-model="form.bank_name"
            :type="'text'"
            :name="'bank_name'"
            :label="'Bank name'"
            :error="formError.find(item => item.field === 'bank_name')"
            required
          />
          <AppInput
            v-model="form.sort_code"
            :type="'text'"
            :name="'sort_code'"
            :label="'Sort code'"
            :error="formError.find(item => item.field === 'sort_code')"
            required
          />
          <AppInput
            v-model="form.account_number"
            :type="'text'"
            :name="'account_number'"
            :label="'Account number'"
            :error="formError.find(item => item.field === 'account_number')"
            required
          />

          <AppInput
            v-model="form.username"
            :type="'text'"
            :name="'username'"
            :label="'Username'"
            :error="formError.find(item => item.field === 'username')"
            required
            @blur="CheckEmptyField(form.username,'username')"
          />

          <AppInput
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email'"
            :placeholder="'Your email address'"
            :error="formError.find(item => item.field === 'email')"
            required
            @blur="CheckEmptyField(form.email,'email')"
          />

          <AppInput
            v-model="form.password"
            :type="'password'"
            :name="'password'"
            :label="'Password'"
            :placeholder="'Your password'"
            :error="formError.find(item => item.field === 'password')"
            required
            @blur="CheckEmptyField(form.password,'password')"
          />
          <AppInput
            v-model="form.password_confirmation"
            :type="'password'"
            :name="'password_confirmation'"
            :label="'Repeat password to verify'"
            :placeholder="'Repeat password'"
            :password="form.password"
            :error="formError.find(item => item.field === 'password_confirmation')"
            required
            @blur="CheckEmptyField(form.password_confirmation,'password_confirmation')"
          />

          <AppInput
            v-model="has_referral"
            :type="'single-checkbox'"
            :name="'has_referral'"
            :label="'Do you have any referral code with you?'"
          />

          <template v-if="has_referral">
            <AppInput
              v-model="form.referral_code"
              :type="'text'"
              :name="'referral_code'"
              :label="'Referral Code'"
              :error="formError.find(item => item.field === 'referral_code')"
              required
            />
          </template>

          <div class="flex flex-col py-2 mb-6">
            <div class="flex flex-row flex-no-wrap justify-between">
              <input
                id="privacy_policy"
                v-model="form.privacy_policy"
                type="checkbox"
                class="checkbox mt-1 mr-1"
              />
              <label for="privacy_policy" class="text-xs sm:text-sm py-1">
                I agree with the
                <span
                  class="cursor-pointer underline"
                  @click="modal = true"
                >Terms and Conditions and Privacy Policy</span> of Hubzz
                <span class="text-red-500">*</span>
              </label>
            </div>
            <transition name="drop-down">
              <div
                v-if="formError.find(item => item.field === 'privacy_policy')"
                class="py-1 text-xs text-red-500"
              >{{ formError.find(item => item.field === 'privacy_policy').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'privacy_policy').message.slice(1).replace(/_/g, " ") }}</div>
            </transition>
          </div>
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton :label="'<<'" @click="$emit('nextTab', 'PracticeSurgeryDetails')" />
      <div class="mx-2" />
      <AppButton :label="'Sign Up'" @click="signUp" />
    </div>

    <div v-if="modal" class="shield" @click="modal=false" />
    <transition name="slide" mode="out-in">
      <div v-if="modal" class="py-8 modal-container">
        <div class="px-4 lg:px-10 pb-4">
          <svgicon
            name="left-arrow"
            height="32"
            width="32"
            class="cursor-pointer"
            @click="modal = false"
          />
        </div>
        <TermsAndConditions />
      </div>
    </transition>

    <AppConfirmationModal
      :label="'Proceed to invite this Hub?'"
      :confirmLabel="'Yes'"
      :cancelLabel="'Cancel'"
      :modal="toggle_invite_modal"
      @confirm="invite"
      @cancel="toggle_invite_modal = false"
    />
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppFormError from "@/components/Base/AppFormError";
import TermsAndConditions from "@/components/TermsAndConditions";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";

const types = [
  { value: "Hub", label: "Hub" },
  { value: "Spoke", label: "Spoke" },
  { value: "Stand Alone", label: "Stand Alone" }
];

const hub_types = [
  { value: "Type 1", label: "Type 1" },
  { value: "Type 2", label: "Type 2" }
];

const practice_roles = [
  { value: "Partner", label: "Partner" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Practice Staff", label: "Practice Staff" }
];

export default {
  components: {
    AppInput,
    AppDate,
    AppButton,
    AppFormError,
    TermsAndConditions,
    AppConfirmationModal
  },

  data() {
    return {
      search_text: "",
      practiceHubs: [],
      showResult: false,
      selectedPracticeId: null,
      toggle_invite_modal: false,
      practice_hub: null,
      //
      isOOH: false,
      types,
      hub_types,
      practice_roles,
      form: {
        hub_practice_id: null,
        type: "",
        hub_type: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "",
        practice_type_id: [],
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        privacy_policy: false,
        vat_registered: false,
        vat_number: "",
        tax_year_end_date: "",
        account_name: "",
        bank_name: "",
        sort_code: "",
        account_number: "",
        referral_code: null,
        national_insurance_number: null,
        sd_number: null,
        paying_reference: null,
        ea_code: null,
        professional_nhs_expenses: null,
        section_scheme_year: null,
        added_year_contributions: null,
        added_early_retirement_contributions: null,
        nhsps_employer_contributions: null,
        nhs_pension_scheme_employing_authority_name: null
      },
      has_referral: false,
      formError: [],
      modal: false
    };
  },

  computed: {
    practiceTypes() {
      return this.$store.getters["sign-up/getPracticeTypes"];
    },

    practiceAccountDetails() {
      return this.$store.getters["sign-up/practiceAccountDetails"];
    },

    practiceAccountFormError() {
      return this.$store.getters["sign-up/practiceAccountFormError"];
    }
  },

  watch: {
    practiceAccountFormError(value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push({
            field:
              item.validation === "confirmed"
                ? "password_confirmation"
                : item.field,
            message: item.message,
            validation: item.validation
          });
        });
      }
    },
    "form.practice_type_id"(newValue, oldValue) {
      this.isOOH = newValue.includes("8") ? true : false;
    }
  },

  created() {
    this.practiceAccountDetails.practice_type_id.forEach(id => {
      this.form.practice_type_id.push(
        this.practiceTypes.find(item => item.value === id)
      );
    });
  },

  mounted() {
    if (this.practiceAccountFormError.length > 0) {
      this.practiceAccountFormError.forEach(item => {
        this.formError.push({
          field:
            item.validation === "confirmed"
              ? "password_confirmation"
              : item.field,
          message: item.message,
          validation: item.validation
        });
      });
    }
  },

  methods: {
    select(item) {
      this.selectedPracticeId = item.id;
      this.toggle_invite_modal = true;
    },
    invite() {
      this.practice_hub = this.practiceHubs.find(
        practiceHub => practiceHub.id === this.selectedPracticeId
      );
      this.toggle_invite_modal = false;
      this.showResult = false;
    },
    removePracticeHub() {
      this.practice_hub = null;
      this.selectedPracticeId = null;
      this.showResult = true;
    },
    search() {
      if (this.search_text) {
        this.$axios
          .$get(
            `/api/v1/practice/practice-spokes?search=${this.search_text}&limit=10`,
            {
              params: {
                practice_type: "Hub"
              }
            }
          )
          .then(res => {
            this.practiceHubs =
              res.data && res.data.practices ? res.data.practices : [];
            this.showResult = true;
          })
          .catch(err => {
            console.log(err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: ["Something went wrong!"]
            });
          });
      }
    },
    signUp() {
      this.formError = [];

      this.form.hub_practice_id = this.selectedPracticeId;
      if (["Hub"].includes(this.form.type)) {
        notRequired.push("hub_practice_id");
        this.form.hub_practice_id = null;
      }

      let notRequired = ["title", "suffix", "vat_registered"];
      if (["Spoke", "Stand Alone"].includes(this.form.type)) {
        notRequired.push("hub_type");
      }
      if (["false", false].includes(this.form.vat_registered)) {
        notRequired.push("vat_number", "tax_year_end_date");
      }
      if ([false, "false"].includes(this.has_referral)) {
        notRequired.push("referral_code");
        this.form.referral_code = null;
      }
      if (!this.form.practice_type_id.includes("8")) {
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
          "nhs_pension_scheme_employing_authority_name"
        );
        this.form.national_insurance_number = null;
        this.form.sd_number = null;
        this.form.paying_reference = null;
        this.form.ea_code = null;
        this.form.professional_nhs_expenses = 0;
        this.form.section_scheme_year = null;
        this.form.added_year_contributions = 0;
        this.form.added_early_retirement_contributions = 0;
        this.form.nhsps_employer_contributions = 0;
        this.form.nhs_pension_scheme_employing_authority_name = null;
      }

      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.$store.commit("sign-up/SET_PRACTICE_ACCOUNT_DETAILS", this.form);
        setTimeout(() => {
          this.$store.dispatch("sign-up/registeredPractice");
        }, 1000);
      }
    },

    checkPracticeType(value) {
      let selectedArr = [];
      selectedArr.push(value);
      this.form.practice_type_id = [
        ...this.form.practice_type_id,
        ...selectedArr
      ];
    },

    uncheckPracticeType(value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(
        id => id != value
      );
    }
  }
};
</script>

<style scoped>
button:active {
  transform: translate(5px, 5px);
}
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 50%;
  }
}
.shield {
  z-index: 509;
}
</style>
