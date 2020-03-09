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
            :error="this.formError.find(item => item.field === 'type')"
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
            :error="this.formError.find(item => item.field === 'hub_type')"
            :items="hub_types"
            required
          />
          <div v-if="form.type === 'Hub'" class="m-2 bg-gray-300 rounded-lg">
            <div v-if="form.hub_type === 'Type 1'" class="m-3 p-2 my-2">
              <p class="font-semibold text-lg">
                Hub
              </p>
              <p>Hubs can create jobs for their own surgeries, and can invite Spokes, and create jobs for them.</p>
            </div>
            <div v-if="form.hub_type === 'Type 2'" class="m-3 p-2 my-2">
              <p class="font-semibold text-lg">
                Hub - Healthboard
              </p>
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
            :error="this.formError.find(item => item.field === 'first_name')"
            required
            @blur="CheckEmptyField(form.first_name,'first_name')"
          />
          <AppInput
            v-model="form.last_name"
            :type="'text'"
            :name="'last_name'"
            :label="'Last name'"
            :placeholder="'Your last name'"
            :error="this.formError.find(item => item.field === 'last_name')"
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
          <div class="font-bold text-sm my-4">
            Bank Details
          </div>
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
            v-model="form.email"
            :type="'email'"
            :name="'email'"
            :label="'Email'"
            :placeholder="'Your email address'"
            :error="this.formError.find(item => item.field === 'email')"
            required
            @blur="CheckEmptyField(form.email,'email')"
          />
          <AppInput
            v-model="form.password"
            :type="'password'"
            :name="'password'"
            :label="'Password'"
            :placeholder="'Your password'"
            :error="this.formError.find(item => item.field === 'password')"
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
            :error="this.formError.find(item => item.field === 'password_confirmation')"
            required
            @blur="CheckEmptyField(form.password_confirmation,'password_confirmation')"
          />

          <div class="flex flex-col py-2 mb-6">
            <div class="flex flex-row flex-no-wrap justify-between">
              <input
                id="privacy_policy"
                v-model="form.privacy_policy"
                type="checkbox"
                class="checkbox mt-1 mr-1"
              >
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
              >
                {{ formError.find(item => item.field === 'privacy_policy').message.charAt(0).toUpperCase() + formError.find(item => item.field === 'privacy_policy').message.slice(1).replace(/_/g, " ") }}
              </div>
            </transition>
          </div>
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton :label="'<<'" @click="$emit('nextTab', 'PracticeSurgeryDetails')" />
      <div class="mx-2" />
      <AppButton :label="'Next'" @click="signUp" />
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
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppFilterSearch from "@/components/Base/AppFilterSearch"
import AppFormError from "@/components/Base/AppFormError"
import TermsAndConditions from "@/components/TermsAndConditions"

const types = [
  { value: "Hub", label: "Hub" },
  { value: "Spoke", label: "Spoke" },
  { value: "Stand Alone", label: "Stand Alone" }
]
const hub_types = [
  { value: "Type 1", label: "Type 1" },
  { value: "Type 2", label: "Type 2" }
]
const practice_roles = [
  { value: "Partner", label: "Partner" },
  { value: "Practice Manager", label: "Practice Manager" },
  { value: "Practice Staff", label: "Practice Staff" }
]
export default {
  components: {
    AppInput,
    AppDate,
    AppButton,
    AppFilterSearch,
    AppFormError,
    TermsAndConditions
  },
  data () {
    return {
      types,
      hub_types,
      practice_roles,
      form: {
        type: "",
        hub_type: "",
        title: "",
        first_name: "",
        last_name: "",
        suffix: "",
        practice_role: "",
        practice_type_id: [],
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
        account_number: ""
      },
      formError: [],
      modal: false
    }
  },
  computed: {
    practiceTypes () {
      return this.$store.getters["sign-up/getPracticeTypes"]
    },
    practiceAccountDetails () {
      return this.$store.getters["sign-up/practiceAccountDetails"]
    },
    practiceAccountFormError () {
      return this.$store.getters["sign-up/practiceAccountFormError"]
    }
  },
  watch: {
    practiceAccountFormError (value) {
      if (value.length > 0) {
        value.forEach(item => {
          this.formError.push({
            field:
              item.validation === "confirmed"
                ? "password_confirmation"
                : item.field,
            message: item.message,
            validation: item.validation
          })
        })
      }
    }
  },
  created () {
    this.practiceAccountDetails.practice_type_id.forEach(id => {
      this.form.practice_type_id.push(
        this.practiceTypes.find(item => item.value === id)
      )
    })
  },
  mounted () {
    if (this.practiceAccountFormError.length > 0) {
      this.practiceAccountFormError.forEach(item => {
        this.formError.push({
          field:
            item.validation === "confirmed"
              ? "password_confirmation"
              : item.field,
          message: item.message,
          validation: item.validation
        })
      })
    }
  },
  methods: {
    signUp () {
      this.formError = []
      let notRequired = ["title", "suffix", "vat_registered"]
      if (["Spoke", "Stand Alone"].includes(this.form.type)) {
        notRequired.push("hub_type")
      }
      if (["false", false].includes(this.form.vat_registered)) {
        notRequired.push("vat_number", "tax_year_end_date")
      }
      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        let submitForm = {}
        submitForm = {
          ...this.form
        }
        this.$store.commit("sign-up/SET_PRACTICE_ACCOUNT_DETAILS", submitForm)
        setTimeout(() => {
          this.$store.dispatch("sign-up/registeredPractice")
        }, 1000)
      }
    },
    checkPracticeType (value) {
      let selectedArr = []
      selectedArr.push(value)
      this.form.practice_type_id = [
        ...this.form.practice_type_id,
        ...selectedArr
      ]
    },
    uncheckPracticeType (value) {
      this.form.practice_type_id = this.form.practice_type_id.filter(
        id => id != value
      )
    }
  }
}
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
