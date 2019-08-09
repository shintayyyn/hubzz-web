<template>
  <div class="flex flex-row flex-wrap justify-start">
    <div class="w-full md:w-1/2 p-2">
      <p style="font-family:Nunito" class="text-sm font-bold">Bank account</p>
      <div class="border-solid rounded-lg shadow-lg mt-5 p-10">
        <AppInput
          v-model="form.account_name"
          :type="'text'"
          :name="'account_name'"
          :label="'Account name'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'account_name')"
        />
        <AppInput
          v-model="form.bank_name"
          :type="'text'"
          :name="'bank_name'"
          :label="'Bank name'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'bank_name')"
        />
        <AppInput
          v-model="form.sort_code"
          :type="'text'"
          :name="'sort_code'"
          :label="'Sort code'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'sort_code')"
        />
        <AppInput
          v-model="form.account_number"
          :type="'text'"
          :name="'account_number'"
          :label="'Account number'"
          :placeholder="''"
          :error="formError.find(item => item.field === 'account_number')"
        />
      </div>
    </div>

    <div class="w-full md:w-1/2 p-2">
      <p style="font-family:Nunito" class="text-sm font-bold">Details</p>
      <div class="border-solid rounded-lg shadow-lg mt-5 p-10">
        <div class="flex flex-col">
          <div class="w-full text-xs sm:text-base flex items-center">Your tax year end date</div>
          <div class="w-full flex flex-row flex-nowrap">
            <div class="mr-1 w-1/2">
              <AppSelect
                v-model="form.tax_year_end_month"
                :name="'tax_year_end_month'"
                :placeholder="'Select...'"
                :error="formError.find(item => item.field === 'tax_year_end_month')"
                :items="months"
              />
            </div>
            <div class="ml-1 w-1/2">
              <AppSelect
                v-model="form.tax_year_end_date"
                :name="'tax_year_end_date'"
                :placeholder="'Select...'"
                :error="formError.find(item => item.field === 'tax_year_end_date')"
                :items="days"
              />
            </div>
          </div>
        </div>
        <AppSelect
          v-model="form.employment_type"
          :name="'employment_type'"
          :label="'Are you...?'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'employment_type')"
          :items="employmentTypes"
        />
        <template v-if="form.employment_type === 'Limited company'">
          <AppInput
            v-model="form.company_registration_number"
            :type="'text'"
            :name="'company_registration_number'"
            :label="'Company_registration_number'"
            :placeholder="'The number of your company from Companies House'"
            :error="formError.find(item => item.field === 'company_registration_number')"
          />
        </template>
        <template v-else>
          <AppInput
            v-model="form.utr_number"
            :type="'text'"
            :name="'utr_number'"
            :label="'UTR number'"
            :placeholder="''"
            :error="formError.find(item => item.field === 'utr_number')"
          />
        </template>

        <AppSelect
          v-model="form.ir35"
          :name="'ir35'"
          :label="'IR35 - role inside or outside of scope'"
          :placeholder="'Select...'"
          :error="formError.find(item => item.field === 'ir35')"
          :items="[ {value: true, label: 'Inside of Scope'}, {value: false, label: 'Outside of Scope'} ]"
        />
      </div>

      <div class="mt-4">
        <AppButton :label="'Save changes'" @click="save" />
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from '@/components/Base/AppInput'
import AppSelect from '@/components/Base/AppSelect'
import AppButton from '@/components/Base/AppButton'
let months = [
  { label: "Jan", value: '1' },
  { label: "Feb", value: '2' },
  { label: "Mar", value: '3' },
  { label: "Apr", value: '4' },
  { label: "May", value: '5' },
  { label: "Jun", value: '6' },
  { label: "Jul", value: '7' },
  { label: "Aug", value: '8' },
  { label: "Sep", value: '9' },
  { label: "Oct", value: '10' },
  { label: "Nov", value: '11' },
  { label: "Dec", value: '12' },
];
let employmentTypes = [
  { label: 'Self-employed', value: 'Self-employed' },
  { label: 'Limited company', value: 'Limited company' },
]
export default {
  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  components: {
    AppInput,
    AppSelect,
    AppButton,
  },
  async asyncData({ app, error }) {
    try {

      if (process.client) {
        document.body.style.cursor = 'wait'
      }

      const response = await app.$axios.get('/api/v1/me')

      const user = response.data && response.data.data && response.data.data.user ? response.data.data.user : null
      console.log('user', user)
      if (process.client) {
        document.body.style.cursor = 'auto'
      }

      return {
        user
      }
    } catch (err) {
      console.log('invoicing-details create err', err.response || err)
      console.log('invoicing-details create error', {
        statusCode: err.status || 500,
        message: err.message || 'Something went wrong!',
      })
      error({
        statusCode: err.status || 500,
        message: err.message || 'Something went wrong!',
      })
    }
  },
  mounted() {
    this.form.tax_year_end_month = this.user.locum_detail.invoice_detail.tax_year_end_month
    this.form.tax_year_end_date = this.user.locum_detail.invoice_detail.tax_year_end_date
    this.form.utr_number = this.user.locum_detail.invoice_detail.utr_number
    this.form.company_registration_number = this.user.locum_detail.invoice_detail.company_registration_number
    this.form.employment_type = this.user.locum_detail.invoice_detail.employment_type
    this.form.ir35 = this.user.locum_detail.invoice_detail.ir35
    this.form.account_name = this.user.locum_detail.bank_account.account_name
    this.form.bank_name = this.user.locum_detail.bank_account.bank_name
    this.form.account_number = this.user.locum_detail.bank_account.account_number
    this.form.sort_code = this.user.locum_detail.bank_account.sort_code
  },
  data() {
    return {
      months,
      employmentTypes,
      form: {
        account_name: '',
        bank_name: '',
        sort_code: '',
        account_number: '',
        tax_year_end_month: '',
        tax_year_end_date: '',
        employment_type: '',
        utr_number: '',
        company_registration_number: '',
        ir35: false
      },
      formError: []
    }
  },
  computed: {
    days() {
      let days = []
      let maxDays = 30
      if (['01', '03', '05', '07', '08', '10', '12'].includes(this.form.tax_year_end_month)) {
        maxDays = 31
      }
      for (let i = 1; i <= maxDays; i++) {
        days.push({ value: i, label: i })
      }
      return days
    }
  },
  watch: {
    'form.employment_type'(value) {
      this.formError = []
    }
  },
  methods: {
    save() {
      let notRequired = []
      if (this.form.employment_type === 'Self-employed') {
        notRequired.push('company_registration_number')
      } else {
        notRequired.push('utr_number')
      }
      this.Validate(this.form, notRequired)
      if (!this.formError.length) {
        this.$axios.$put(`/api/v1/locum/me/billing_details`, this.form).then(res => {
          console.log(res.message)
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: [res.message] })
        })
      }
    },
  }
}
</script>