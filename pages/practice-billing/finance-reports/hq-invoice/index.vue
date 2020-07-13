<template>
  <div>
    <div class="relative bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-3xl">
      <AppLoading :loading="loading" spinner />
      <AppFormError v-if="false && formError.length > 0" :formError="formError" />
      <div class="flex flex-wrap ">
        <div class="w-full">
          <AppInput
            v-model="selectedYearMonth"
            type="select"
            label="Month"
            :items="yearMonths"
            required
          />
        </div>
      </div>
    </div>

    <AppTable
      v-if="practiceInvoiceFinanceReports.length > 0"
      :total="count"
      :items="practiceInvoiceFinanceReports"
      :columns="columns"
      :loading="loading"
    />

    <AppButton
      v-if="!loading && practiceInvoiceFinanceReports.length > 0"
      :label="exporting ? 'Exporting as PDF...' : 'Export as PDF'"
      :inStyle="'padding: 5px 14px;'"
      @click="exportPracticeInvoiceFinanceReportsAsPdf"
    />

    <transition name="fade" mode="out-in">
      <div
        v-if="practiceInvoiceFinanceReports.length === 0 && !loading"
        class="flex justify-center py-4"
      >
        No reports found
      </div>
    </transition>
  </div>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import AppLoading from "@/components/Base/AppLoading"
  import AppFormError from "@/components/Base/AppFormError"
  import AppTable from "@/components/Base/AppTable"

  export default {
    transition: {
      name: 'fade',
      mode: 'out-in',
    },

    components: {
      AppInput,
      AppButton,
      AppLoading,
      AppFormError,
      AppTable,
    },

    data () {
      return {
        loading: false,
        yearMonths: [],
        selectedYearMonth: null,
        count: 0,
        practiceInvoiceFinanceReports: [],
        exporting: false,
      }
    },

    computed: {
      columns () {
        return [
					{
						name: 'Job Part Count',
						dataIndex: 'job_part_count',
					},
					{
						name: 'Total Hours',
						dataIndex: 'total_final_hours_formatted',
					},
					{
						name: '£ Total Amount',
						dataIndex: 'total_amount_formatted',
					},
        ]
      },
    },

    watch: {
      selectedYearMonth () {
        this.getPracticeInvoiceFinanceReports()
      },
    },

    mounted () {
      const minYearMonth = '2019-01'

      const selectedYearMonth = this.$moment.utc().startOf('month').subtract(1, 'months').format('YYYY-MM')

      let tempYearMonth = selectedYearMonth

      let yearMonthsValues = []

      while (this.$moment(minYearMonth, 'YYYY-MM').isSameOrBefore(this.$moment(tempYearMonth, 'YYYY-MM'))) {
        yearMonthsValues.unshift(tempYearMonth)
        tempYearMonth = this.$moment(tempYearMonth, 'YYYY-MM').subtract(1, 'months').format('YYYY-MM')
      }

      this.yearMonths = yearMonthsValues.map(yearMonthsValue => ({
        value: yearMonthsValue,
        label: this.$moment(yearMonthsValue, 'YYYY-MM').format('YYYY MMMM'),
      }))

      this.selectedYearMonth = selectedYearMonth
    },

    methods: {
      getPracticeInvoiceFinanceReports () {
        this.count = 0
        this.practiceInvoiceFinanceReports = []

        if (!this.selectedYearMonth) {
          return
        }

        const [
          year,
          month,
        ] = this.selectedYearMonth.split('-')

        this.loading = true

        Promise.all([
          // this.$axios.get(`/api/v1/practice/practice-invoice-finance-reports/${year}/${month}/count`).then((responses) => {
          //   return responses.data.data.count
          // }),
          this.$axios.get(`/api/v1/practice/practice-invoice-finance-reports/${year}/${month}`).then((responses) => {
            return responses.data.data.practice_invoice_finance_reports
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            // count,
            practiceInvoiceFinanceReports,
          ] = results

          // this.count = count
          this.practiceInvoiceFinanceReports = practiceInvoiceFinanceReports
        }).catch((err) => {
          console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },

      exportPracticeInvoiceFinanceReportsAsPdf () {
        if (!this.selectedYearMonth) {
          return
        }

        const [
          year,
          month,
        ] = this.selectedYearMonth.split('-')

        this.exporting = true

        const filename = `practice_invoice_finance_reports_${year}_${month}.pdf`

        this.$axios.post(`/api/v1/practice/practice-invoice-finance-reports/${year}/${month}/generate-key`).then((responses) => {
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/practice-invoice-finance-reports/pdf/${filename}?token=${token}`)
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.exporting = false
        })
      },
    },
    
  }
</script>
