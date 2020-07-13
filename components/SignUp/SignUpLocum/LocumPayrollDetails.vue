<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex md:mx-4" style="flex: 0 1 600px;">
        <h4>Your Payroll details</h4>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="md:mx-4 flex flex-col p-4 md:p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
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
              :label="'Company registration number'"
              :placeholder="'The number of your company from Companies House'"
              :error="formError.find(item => item.field === 'company_registration_number')"
              required
              @blur="CheckEmptyField(form.company_registration_number, 'company_registration_number')"
            />
          </template>
          <template v-if="form.employment_type === 'Self-Employed'">
            <AppInput
              v-model="form.utr_number"
              :type="'text'"
              :name="'utr_number'"
              :label="'UTR number'"
              :limit="9"
              :placeholder="'AZ000000D'"
              :error="formError.find(item => item.field === 'utr_number')"
              required
              @blur="CheckEmptyField(form.utr_number, 'utr_number')"
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
              @blur="CheckEmptyField(form.payroll_account_name, 'payroll_account_name')"
            />
            <AppInput
              v-model="form.payroll_bank_name"
              :type="'text'"
              :name="'payroll_bank_name'"
              :label="'Bank Name'"
              :error="formError.find(item => item.field === 'payroll_bank_name')"
              required
              @blur="CheckEmptyField(form.payroll_bank_name, 'payroll_bank_name')"
            />
            <AppInput
              v-model="form.payroll_sort_code"
              :type="'text'"
              :name="'payroll_sort_code'"
              :label="'Sort Code'"
              :error="formError.find(item => item.field === 'payroll_sort_code')"
              required
              @blur="CheckEmptyField(form.payroll_sort_code, 'payroll_sort_code')"
            />
            <AppInput
              v-model="form.payroll_account_number"
              :type="'text'"
              :name="'payroll_account_number'"
              :label="'Payroll Reference Number'"
              :error="formError.find(item => item.field === 'payroll_account_number')"
              required
              @blur="CheckEmptyField(form.payroll_account_number, 'payroll_account_number')"
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
              @blur="CheckEmptyField(form.account_name, 'account_name')"
            />
            <AppInput
              v-model="form.bank_name"
              :type="'text'"
              :name="'bank_name'"
              :label="'Bank Name'"
              :error="formError.find(item => item.field === 'bank_name')"
              required
              @blur="CheckEmptyField(form.bank_name, 'bank_name')"
            />
            <AppInput
              v-model="form.sort_code"
              :type="'text'"
              :name="'sort_code'"
              :label="'Sort Code'"
              :error="formError.find(item => item.field === 'sort_code')"
              required
              @blur="CheckEmptyField(form.sort_code, 'sort_code')"
            />
            <AppInput
              v-model="form.account_number"
              :type="'text'"
              :name="'account_number'"
              :label="'Account Number'"
              :error="formError.find(item => item.field === 'account_number')"
              required
              @blur="CheckEmptyField(form.account_number, 'account_number')"
            />
          </template>
          <template v-if="professionCategoryId === 1">
            <AppInput
              v-model="form.ir35"
              :type="'single-checkbox'"
              :name="'ir35'"
              :label="'Are you willing to work for a role captured within IR35 rules, subject to deduction of Tax and N.I.?'"
              :error="formError.find(item => item.field === 'ir35')"
            />
            <AppInput
              v-model="form.claim_nhs"
              :type="'single-checkbox'"
              :name="'claim_nhs'"
              :label="'Are you willing to claim NHS Pension contributions?'"
              :error="formError.find(item => item.field === 'claim_nhs')"
            />
            <template v-if="[true,'true'].includes(form.claim_nhs)">
              <AppInput
                v-model="form.nhs_number"
                :type="'text'"
                :name="'nhs_number'"
                :label="'NHS Pension Scheme membership (SD) number'"
                :error="formError.find(item => item.field === 'nhs_number')"
                required
                @blur="CheckEmptyField(form.nhs_number, 'nhs_number')"
                @keypress="inputNumberOnly($event)"
              />
            </template>
          </template>
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton
        :label="'<<'"
        @click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumProfessionalDetails')"
      />
      <div class="mx-2" />
      <AppButton :label="'Next'" :in-style="'padding:6px 16px;'" @click="next" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
let employmentTypes = [
	{ label: "Self-Employed", value: "Self-Employed" },
	{ label: "Limited Company", value: "Limited Company" }
]
export default {
	components: {
		AppInput,
		AppButton
	},
	data () {
		return {
			employmentTypes,
			form: {
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
			formError: []
		}
	},
	computed: {
		professionalDetails () {
			return this.$store.getters["sign-up/professionalDetails"]
		},
		payrollDetails () {
			return this.$store.getters["sign-up/payrollDetails"]
		},
		payrollFormError () {
			return this.$store.getters["sign-up/payrollFormError"]
		},
		professionCategoryId () {
			return this.$store.getters["sign-up/professionCategoryId"]
		}
	},
	mounted () {
		this.form.employment_type = this.payrollDetails.employment_type
		this.form.company_registration_number = this.payrollDetails.company_registration_number
		this.form.utr_number = this.payrollDetails.utr_number
		this.form.paid_under_payroll = this.payrollDetails.paid_under_payroll
		this.form.payroll_account_name = this.payrollDetails.payroll_account_name
		this.form.payroll_bank_name = this.payrollDetails.payroll_bank_name
		this.form.payroll_sort_code = this.payrollDetails.payroll_sort_code
		this.form.payroll_account_number = this.payrollDetails.payroll_account_number
		this.form.account_name = this.payrollDetails.account_name
		this.form.bank_name = this.payrollDetails.bank_name
		this.form.sort_code = this.payrollDetails.sort_code
		this.form.account_number = this.payrollDetails.account_number
		this.form.ir35 = this.payrollDetails.ir35
		this.form.claim_nhs = this.payrollDetails.claim_nhs
		this.form.nhs_number = this.payrollDetails.nhs_number
		if (this.payrollFormError.length > 0) {
			this.payrollFormError.forEach(item => {
				this.formError.push(item)
			})
		}
	},
	methods: {
		next () {
			this.formError = []
			let notRequired = [
				"employment_type",
				"paid_under_payroll",
				"ir35",
				"claim_nhs"
			]
			if (this.professionCategoryId === 2) {
				this.form.ir35 = false
				this.form.claim_nhs = false
			}
			if (this.form.employment_type === "Self-Employed") {
				this.form.company_registration_number = ""
				notRequired.push("company_registration_number")
			}
			if (this.form.employment_type === "Limited Company") {
				this.form.utr_number = ""
				notRequired.push("utr_number")
			}
			if (["false", false].includes(this.form.claim_nhs)) {
				notRequired.push("nhs_number")
				this.form.nhs_number = null
			}
			if (["false", false].includes(this.form.paid_under_payroll)) {
				this.form.payroll_account_name = ""
				this.form.payroll_bank_name = ""
				this.form.payroll_sort_code = ""
				this.form.payroll_account_number = ""
				notRequired.push(
					"payroll_account_name",
					"payroll_bank_name",
					"payroll_sort_code",
					"payroll_account_number"
				)
			}
			if (["true", true].includes(this.form.paid_under_payroll)) {
				this.form.account_name = ""
				this.form.bank_name = ""
				this.form.sort_code = ""
				this.form.account_number = ""
				notRequired.push(
					"account_name",
					"bank_name",
					"sort_code",
					"account_number"
				)
			}
			this.Validate(this.form, notRequired)
			if (!this.formError.length) {
				this.$store.commit("sign-up/SET_PAYROLL_DETAILS", this.form)
				this.$store.commit("sign-up/SET_PAYROLL_DETAIL_FORM_ERROR", [])

				this.$store.commit(
					"sign-up/SET_ACTIVE_COMPONENT",
					"LocumCredentialDetails"
				)
			}
		}
	}
}
</script>
