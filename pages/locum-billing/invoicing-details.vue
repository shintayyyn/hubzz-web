<template>
  <div class="flex flex-row flex-wrap justify-start">
    <AppFormError class="w-full" :formError="formError" v-if="formError.length > 0" />

    <div class="w-full md:w-1/2 py-2 md:px-2">
      <p class="text-sm font-bold">Bank account</p>
      <div class="border-solid rounded-lg shadow-lg mt-5 p-4 md:p-8">
        <AppInput
          v-model="form.account_name"
          :type="'text'"
          :name="'account_name'"
          :label="'Account name'"
          :placeholder="''"
          @submit="save"
          @blur="CheckEmptyField(form.account_name, 'account_name')"
          :error="formError.find(item => item.field === 'account_name')"
        />
        <AppInput
          v-model="form.bank_name"
          :type="'text'"
          :name="'bank_name'"
          :label="'Bank name'"
          :placeholder="''"
          @submit="save"
          @blur="CheckEmptyField(form.bank_name, 'bank_name')"
          :error="formError.find(item => item.field === 'bank_name')"
        />
        <AppInput
          v-model="form.sort_code"
          :type="'text'"
          :name="'sort_code'"
          :label="'Sort code'"
          :placeholder="''"
          @submit="save"
          @blur="CheckEmptyField(form.sort_code, 'sort_code')"
          :error="formError.find(item => item.field === 'sort_code')"
        />
        <AppInput
          v-model="form.account_number"
          :type="'text'"
          :name="'account_number'"
          :label="'Account number'"
          :placeholder="''"
          @submit="save"
          @blur="CheckEmptyField(form.account_number, 'account_number')"
          :error="formError.find(item => item.field === 'account_number')"
        />
      </div>
    </div>

    <div class="w-full md:w-1/2 py-2 md:px-2">
      <p class="text-sm font-bold">Payroll Details</p>
      <div class="border-solid rounded-lg shadow-lg mt-5 p-4 md:p-8">
        <div class="flex flex-col">
          <div class="w-full text-xs sm:text-base flex items-center">Your tax year end date</div>
          <div class="w-full flex flex-row flex-no-wrap">
            <div class="mr-1 w-1/2">
              <AppInput
                v-model="form.tax_year_end_month"
                :type="'select'"
                :name="'tax_year_end_month'"
                :placeholder="'Month'"
                :items="months"
                @submit="save"
                @blur="CheckEmptyField(form.tax_year_end_month, 'tax_year_end_month')"
                :error="formError.find(item => item.field === 'tax_year_end_month')"
              />
            </div>
            <div class="ml-1 w-1/2">
              <AppInput
                v-model="form.tax_year_end_date"
                :type="'select'"
                :name="'tax_year_end_date'"
                :placeholder="'Day'"
                :items="days"
                @submit="save"
                @blur="CheckEmptyField(form.tax_year_end_date, 'tax_year_end_date')"
                :error="formError.find(item => item.field === 'tax_year_end_date')"
              />
            </div>
          </div>
        </div>
        <AppInput
          v-model="form.employment_type"
          :type="'select'"
          :name="'employment_type'"
          :label="'Are you...?'"
          :items="employmentTypes"
          @submit="save"
          @blur="CheckEmptyField(form.employment_type, 'employment_type')"
          :error="formError.find(item => item.field === 'employment_type')"
        />
        <template v-if="form.employment_type === 'Limited company'">
          <AppInput
            v-model="form.company_registration_number"
            :type="'text'"
            :name="'Company registration number'"
            :label="'Company_registration_number'"
            :placeholder="'The number of your company from Companies House'"
            @submit="save"
            @blur="CheckEmptyField(form.company_registration_number, 'company_registration_number')"
            :error="formError.find(item => item.field === 'company_registration_number')"
          />
        </template>
        <template v-if="form.employment_type === 'Self-Employed'">
          <AppInput
            v-model="form.utr_number"
            :type="'text'"
            :name="'utr_number'"
            :label="'UTR number'"
            :placeholder="''"
            @submit="save"
            @blur="CheckEmptyField(form.utr_number, 'utr_number')"
            :error="formError.find(item => item.field === 'utr_number')"
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
            :error="formError.find(item => item.field === 'payroll_detail_account_name')"
          />
          <AppInput
            v-model="form.payroll_detail_bank_name"
            :type="'text'"
            :name="'payroll_detail_bank_name'"
            :label="'Bank name'"
            :error="formError.find(item => item.field === 'payroll_detail_bank_name')"
          />
          <AppInput
            v-model="form.payroll_detail_sort_code"
            :type="'text'"
            :name="'payroll_detail_sort_code'"
            :label="'Sort code'"
            :error="formError.find(item => item.field === 'payroll_detail_sort_code')"
          />
          <AppInput
            v-model="form.payroll_detail_account_number"
            :type="'text'"
            :name="'payroll_detail_account_number'"
            :label="'Account number'"
            :error="formError.find(item => item.field === 'payroll_detail_account_number')"
          />
        </template>

        <AppInput
          v-model="form.ir35"
          :type="'select'"
          :name="'ir35'"
          :label="'IR35 - role inside or outside of scope'"
          :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
          @submit="save"
        />
      </div>

      <div class="mt-4">
        <AppButton :label="'Save changes'" @click="save" />
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFormError from "@/components/Base/AppFormError";
let months = [
  { label: "Jan", value: "1" },
  { label: "Feb", value: "2" },
  { label: "Mar", value: "3" },
  { label: "Apr", value: "4" },
  { label: "May", value: "5" },
  { label: "Jun", value: "6" },
  { label: "Jul", value: "7" },
  { label: "Aug", value: "8" },
  { label: "Sep", value: "9" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" }
];
let employmentTypes = [
  { label: "Self-Employed", value: "Self-Employed" },
  { label: "Limited Company", value: "Limited Company" }
];
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    AppInput,
    AppButton,
    AppFormError
  },
  data() {
    return {
      months,
      employmentTypes,
      form: {
        account_name: "",
        bank_name: "",
        sort_code: "",
        account_number: "",
        tax_year_end_month: "",
        tax_year_end_date: "",
        employment_type: "Self-Employed",
        utr_number: "",
        company_registration_number: "",
        ir35: false,
        paid_under_payroll: false,
        payroll_detail_account_name: "",
        payroll_detail_bank_name: "",
        payroll_detail_sort_code: "",
        payroll_detail_account_number: ""
      },
      formError: []
    };
  },
  computed: {
    days() {
      let days = [];
      let maxDays = 30;
      if (
        ["01", "03", "05", "07", "08", "10", "12"].includes(
          this.form.tax_year_end_month
        )
      ) {
        maxDays = 31;
      }
      for (let i = 1; i <= maxDays; i++) {
        days.push({ value: i, label: i });
      }
      return days;
    }
  },
  async asyncData({ app, error }) {
    try {
      if (process.client) {
        document.body.style.cursor = "wait";
      }

      const response = await app.$axios.get("/api/v1/me");

      const user =
        response.data && response.data.data && response.data.data.user
          ? response.data.data.user
          : null;
      if (process.client) {
        document.body.style.cursor = "auto";
      }

      return {
        user
      };
    } catch (err) {
      console.log("invoicing-details create err", err.response || err);
      console.log("invoicing-details create error", {
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      });
      error({
        statusCode: err.status || 500,
        message: err.message || "Something went wrong!"
      });
    }
  },
  mounted() {
    if (this.user.locum_detail.invoice_detail) {
      if (this.user.locum_detail.invoice_detail.bank_account) {
        this.form.account_name = this.user.locum_detail.invoice_detail.bank_account.account_name;
        this.form.bank_name = this.user.locum_detail.invoice_detail.bank_account.bank_name;
        this.form.sort_code = this.user.locum_detail.invoice_detail.bank_account.sort_code;
        this.form.account_number = this.user.locum_detail.invoice_detail.bank_account.account_number;
      }

      this.form.tax_year_end_month = null;
      this.form.tax_year_end_date = null;
      this.form.employment_type = this.user.locum_detail.invoice_detail.employment_type ? this.user.locum_detail.invoice_detail.employment_type : this.form.employment_type
      this.form.utr_number = this.user.locum_detail.invoice_detail.utr_number;
      this.form.company_registration_number = this.user.locum_detail.invoice_detail.company_registration_number;
      this.form.ir35 = this.user.locum_detail.invoice_detail.ir35;
      this.form.paid_under_payroll = this.user.locum_detail.invoice_detail.paid_under_payroll;

      if (this.user.locum_detail.invoice_detail.payroll_detail) {
        this.form.payroll_detail_account_name = this.user.locum_detail.invoice_detail.payroll_detail.account_name;
        this.form.payroll_detail_bank_name = this.user.locum_detail.invoice_detail.payroll_detail.bank_name;
        this.form.payroll_detail_sort_code = this.user.locum_detail.invoice_detail.payroll_detail.sort_code;
        this.form.payroll_detail_account_number = this.user.locum_detail.invoice_detail.payroll_detail.account_number;
      }
    }
  },
  watch: {
    "form.account_name"(value) {
      this.CheckEmptyField(this.form.account_name, "account_name");
    },
    "form.bank_name"(value) {
      this.CheckEmptyField(this.form.bank_name, "bank_name");
    },
    "form.sort_code"(value) {
      this.CheckEmptyField(this.form.sort_code, "sort_code");
    },
    "form.account_number"(value) {
      this.CheckEmptyField(this.form.account_number, "account_number");
    },
    // "form.tax_year_end_month"(value) {
    //   this.CheckEmptyField(this.form.tax_year_end_month, "tax_year_end_month");
    // },
    // "form.tax_year_end_date"(value) {
    //   this.CheckEmptyField(this.form.tax_year_end_date, "tax_year_end_date");
    // },
    "form.employment_type"(value){
      if (value === 'Limited Company'){
        let index = this.formError.findIndex(err => err.field === "utr_number")
        if (index > 0){
          this.formError.splice(index, 1)
        }
      }
    },
    // "form.ir35"(value) {
    //   this.CheckEmptyField(this.form.ir35, "ir35");
    // },
    "form.payroll_detail_account_name"(value) {
      this.CheckEmptyField(
        this.form.payroll_detail_account_name,
        "payroll_detail_account_name"
      );
    },
    "form.payroll_detail_bank_name"(value) {
      this.CheckEmptyField(
        this.form.payroll_detail_bank_name,
        "payroll_detail_bank_name"
      );
    },
    "form.payroll_detail_sort_code"(value) {
      this.CheckEmptyField(
        this.form.payroll_detail_sort_code,
        "payroll_detail_sort_code"
      );
    },
    "form.payroll_detail_account_number"(value) {
      this.CheckEmptyField(
        this.form.payroll_detail_account_number,
        "payroll_detail_account_number"
      );
    }
  },
  methods: {
    save() {
      this.formError = []
      let notRequired = ["ir35"];

      if (this.form.employment_type === "Self-Employed") {
        notRequired.push("company_registration_number");
      } else {
        notRequired.push("utr_number");
      }

      if (
        this.form.paid_under_payroll == false ||
        this.form.paid_under_payroll == "false"
      ) {
        notRequired.push(
          "payroll_detail_account_name",
          "payroll_detail_bank_name",
          "payroll_detail_sort_code",
          "payroll_detail_account_number"
        );
      }

      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.$axios
          .$put(`/api/v1/locum/me/billing_details`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [res.message]
            });
          });
      }
    }
  }
};
</script>