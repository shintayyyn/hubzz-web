<template>
  <div class="flex flex-col items-center justify-center w-full">
    <div class="flex w-full justify-center xl:justify-start">
      <div class="flex mx-4" style="flex: 0 1 600px;">
        <h4>Your Payroll details</h4>
      </div>
    </div>

    <div class="flex w-full justify-center xl:justify-start">
      <div class="mx-4 flex flex-col p-8 m-1 rounded-lg shadow-lg" style="flex: 0 1 600px;">
        <form class="w-full">
          <AppInput
            v-model="form.employment_type"
            :type="'select'"
            :name="'employment_type'"
            :label="'Are you...?'"
            :items="employmentTypes"
          />
          <template v-if="form.employment_type === 'Limited company'">
            <AppInput
              v-model="form.company_registration_number"
              :type="'text'"
              :name="'company_registration_number'"
              :label="'Company_registration_number'"
              :placeholder="'The number of your company from Companies House'"
            />
          </template>
          <template v-else>
            <AppInput
              v-model="form.utr_number"
              :type="'text'"
              :name="'utr_number'"
              :label="'UTR number'"
              :placeholder="''"
            />
          </template>
          <AppInput
            v-model="form.paid_under_payroll"
            :type="'select'"
            :name="'paid_under_payroll'"
            :label="'Are you paid under payroll?'"
            :items="[{ label: 'Yes', value: true }, { label: 'No', value: false }]"
          />
          <template v-if="form.paid_under_payroll == true || form.paid_under_payroll == 'true'">
            <AppInput
              v-model="form.payroll_detail_account_name"
              :type="'text'"
              :name="'payroll_detail_account_name'"
              :label="'Account name'"
              :placeholder="''"
            />
            <AppInput
              v-model="form.payroll_detail_bank_name"
              :type="'text'"
              :name="'payroll_detail_bank_name'"
              :label="'Bank name'"
              :placeholder="''"
            />
            <AppInput
              v-model="form.payroll_detail_sort_code"
              :type="'text'"
              :name="'payroll_detail_sort_code'"
              :label="'Sort code'"
              :placeholder="''"
            />
            <AppInput
              v-model="form.payroll_detail_account_number"
              :type="'text'"
              :name="'payroll_detail_account_number'"
              :label="'Account number'"
              :placeholder="''"
            />
          </template>
          <AppInput
            v-model="form.ir35"
            :type="'single-checkbox'"
            :name="'ir35'"
            :label="'Are you willing to work for a role captured within IR35 rules, subject to deduction of Tax and N.I.?'"
            :placeholder="''"
            :error="this.formError.find(item => item.field === 'ir35')"
          />
        </form>
      </div>
    </div>

    <div class="flex justify-center mt-4">
      <AppButton
        :label="'<<'"
        @click="$store.commit('sign-up/SET_ACTIVE_COMPONENT', 'LocumCredentialDetails')"
      />
      <div class="mx-2"></div>
      <AppButton :label="'Next'" @click="next" />
    </div>
  </div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppPostCode from "@/components/Base/AppPostCode";
import AppButton from "@/components/Base/AppButton";
let employmentTypes = [
  { label: "Self-employed", value: "Self-employed" },
  { label: "Limited company", value: "Limited company" }
];
export default {
  components: {
    AppInput,
    AppPostCode,
    AppButton
  },
  data() {
    return {
      employmentTypes,
      form: {
        employment_type: "Self-employed",
        company_registration_number: "",
        utr_number: "",
        paid_under_payroll: false,
        payroll_detail_account_name: "",
        payroll_detail_bank_name: "",
        payroll_detail_sort_code: "",
        payroll_detail_account_number: "",
        ir35: false
      },
      formError: []
    };
  },
  computed: {
    payrollDetails() {
      return this.$store.getters["sign-up/payrollDetails"];
    },
    payrollFormError() {
      return this.$store.getters["sign-up/payrollFormError"];
    }
  },
  mounted() {
    this.form.employment_type = this.payrollDetails.employment_type;
    this.form.company_registration_number = this.payrollDetails.company_registration_number;
    this.form.utr_number = this.payrollDetails.utr_number;
    this.form.paid_under_payroll = this.payrollDetails.paid_under_payroll;
    this.form.payroll_detail_account_name = this.payrollDetails.payroll_detail_account_name;
    this.form.payroll_detail_bank_name = this.payrollDetails.payroll_detail_bank_name;
    this.form.payroll_detail_sort_code = this.payrollDetails.payroll_detail_sort_code;
    this.form.payroll_detail_account_number = this.payrollDetails.payroll_detail_account_number;
    this.form.ir35 = this.payrollDetails.ir35;
    if (this.payrollFormError.length > 0) {
      this.payrollFormError.forEach(item => {
        this.formError.push(item);
      });
    }
  },
  methods: {
    next() {
      this.formError = [];
      // this.Validate(this.form, [""]);
      if (!this.formError.length) {
        this.$store.commit("sign-up/SET_PAYROLL_DETAILS", this.form);
        this.$store.commit(
          "sign-up/SET_ACTIVE_COMPONENT",
          "LocumCredentialDetails"
        );
      }
    }
  }
};
</script>
