<template>
  <section>
    <div class="rounded-lg bg-gray-300 p-4 mb-4">
      <div class="flex flex-col py-2 mb-1 md:mb-2">
        <div class="relative flex flex-wrap leading-none items-center">
          <label class="text-xs sm:text-sm py-1">Sage Reference</label>
        </div>

        <div class="flex flex-row justify-start mt-1">
          <div class="flex flex-col w-full mt-1">
            <span class="ml-6 text-md sm:text-lg font-bold">{{ (practice && practice.sage_ref) || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <div class="relative flex flex-wrap leading-none items-center">
        <label class="text-xs sm:text-sm py-1">Rates</label>
      </div>

      <div v-for="practiceRate in practice.practice_rates" v-if="practice" :key="`practice_rate_${practiceRate.type}`"
           class="pl-2"
      >
        <div class="flex flex-col py-2 mb-1 md:mb-2">
          <div class="relative flex flex-wrap leading-none items-center">
            <label class="text-xs sm:text-sm py-1">{{ practiceRate.type }}</label>
          </div>

          <div class="flex flex-row justify-start mt-1">
            <div class="flex flex-col w-full mt-1">
              <span class="ml-6 text-md sm:text-lg font-bold">£
                {{ practiceRate.rate ? practiceRate.rate.toFixed(2) : 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

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

    <AppButton :label="'Save'" :inStyle="'padding:5px 14px;'" @click="save" />
  </section>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import AppDate from "@/components/Base/AppDate"
  export default {
    components: {
      AppInput,
      AppButton,
      AppDate
    },
    data () {
      return {
        form: {
          vat_registered: false,
          vat_number: "",
          tax_year_end_date: "",
          account_name: "",
          bank_name: "",
          sort_code: "",
          account_number: ""
        },
        practice: null,
        formError: []
      }
    },
    async asyncData ({ app, store }) {
      try {
        let response = await app.$axios.$get(
          `/api/v1/practice/me/practice-profile`
        )
        const practice =
          response.data && response.data.practice ? response.data.practice : null

        return {
          practice
        }
      } catch (err) {
        console.log("err", err.response || err)
        if (err.response.message) {
          store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [`${err.response.message}`]
          })
        }
        throw err
      }
    },
    mounted () {
      this.form.vat_registered = this.practice.vat_registered
      this.form.vat_number = this.practice.vat_number
      this.form.tax_year_end_date = this.practice.tax_year_end_date
      this.form.account_name = this.practice.account_name
      this.form.bank_name = this.practice.bank_name
      this.form.sort_code = this.practice.sort_code
      this.form.account_number = this.practice.account_number
    },

    methods: {
      save () {
        this.formError = []
        let notRequired = ["vat_registered"]
        if (["false", false].includes(this.form.vat_registered)) {
          notRequired.push("vat_number", "tax_year_end_date")
        }
        this.Validate(this.form, notRequired)
        if (!this.formError.length) {
          this.$axios
            .$put(`/api/v1/practice/me/practice-invoice-detail`, this.form)
            .then(res => {
              console.log(res)
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`]
              })
            })
            .catch(err => {
              console.log("err", err.response || err)
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "danger",
                  text: [`${err.response.data.message}`]
                })
              }
              throw err
            })
        }
      }
    }
  }
</script>