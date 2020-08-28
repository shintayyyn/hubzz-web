<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm">
        <nuxt-link to="/practice-billing-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl">
        Payments
      </div>
  
      <div class="text-sm md:text-lg">
        Rep-002
      </div>

      <div
        class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo my-2"
      >
        <div class="md:px-1 w-full">
          <label class="text-md md:text-lg text-bold">Filters</label>
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="practiceNameIncludes"
            placeholder="Search practice"
            type="text"
            label="Practice"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="locumNameIncudes"
            placeholder="Search locum"
            type="text"
            label="Locum"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="professionNameIncludes"
            placeholder="Search profession"
            type="text"
            label="Profession"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="invoiceNumberIncludes"
            placeholder="Search invoice number"
            type="text"
            label="Invoice Number"
          />
        </div>
        
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="jobPartNumberIncludes"
            placeholder="Search job part number"
            type="text"
            label="Job Part Number"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="minTotalAmount"
            placeholder="0.00"
            type="number"
            label="Min £ Paid"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="maxTotalAmount"
            placeholder="0.00"
            type="number"
            label="Max £ Paid"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="paidDateStart"
            label="Date Paid Start"
            format="YYYY-MM-DD"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="paidDateEnd"
            label="Date Paid End"
            format="YYYY-MM-DD"
          />
        </div>

        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <AppButton
            label="Reset"
            :in-style="'padding:5px 14px;margin-bottom:5px'"
            @click="filterReset"
          />

          <AppButton
            class="mx-2"
            label="Submit"
            :in-style="'padding:5px 14px;margin-bottom:5px'"
            @click="filterSearch"
          />
        </div>
      </div>

      <div v-if="false">
        <div>
          <label class="text-white">Limit: </label>
          <select v-model="limit">
            <option v-for="limit in limits" :key="`limit_${limit}`" :value="limit">
              {{ limit }}
            </option>
          </select>
        </div>
        <div>
          <label class="text-white">Page: </label>
          <select v-model="activePage">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">
              {{ page }}
            </option>
          </select>
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="locumInvoiceReports"
        :getItemKey="(item) => item.locum_invoice_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="setOrderBy"
      />

      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class="text-gray-700 w-full md:w-auto text-center md:text-left">
            <div class="whitespace-no-wrap">
              {{ itemCountInfo }}
            </div>
            <div class="whitespace-no-wrap">
              Page: {{ activePage }} / {{ pages }}
            </div>
            <div class="whitespace-no-wrap">
              Order By: {{ orderByProcessed }}
            </div>
          </div>
        </div>
  
        <ReportPagination 
          :count="count" 
          :pages="pages" 
          :page="activePage" 
          @page="setPage" 
        />
      </div>

      <div
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || locumInvoiceReports.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumInvoiceReports.length === 0 ? 'bg-gray-500' : 'bg-gradient-yellow hover:bg-gradient-yellow-active'"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from '@/components/Base/AppButton'
import AppInput from '@/components/Base/AppInput'
import AppDate from '@/components/Base/AppDate'

import ReportTable from '@/components/Reports/ReportTable'
import ReportPagination from '@/components/Reports/ReportPagination'

export default {
  components: {
    ReportTable,
    ReportPagination,
    AppButton,
    AppInput,
    AppDate,
  },

  data () {
    return {
      loading: false,
      downloading: false,
      count: 0,
      locumInvoiceReports: [],
      orderBy: [],
      orderByProcessed: '',
      orderBys: [
        {
          title: 'Practice Name (Ascending)',
          column: 'practice_name',
          direction: 'asc',
        },
        {
          title: 'Practice Name (Descending)',
          column: 'practice_name',
          direction: 'desc',
        },
      ],
      limit: 10,
      limits: [
        1,
        2,
        3,
        4,
        5,
        10,
        15,
        20,
        25,
      ],
      activePage: 1,

      invoiceNumberIncludes: '',
      locumNameIncudes: '',
      practiceNameIncludes: '',
      professionNameIncludes: '',
      jobPartNumberIncludes: '',
      maxNiAmount: '',
      minTotalAmount: '',
      maxTotalAmount: '',
      calendarDateStart: '',
      calendarDateEnd: '',
      paidDateStart: '',
      paidDateEnd: '',
    }
  },

  computed: {
    itemCountInfo () {
      const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumInvoiceReports.length), this.count)
      
      return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
    },

    offset () {
      return this.activePage * this.limit - this.limit
    },

    columnDetails () {
      return [
        {
          title: '#',
          key: 'index',
          sort_key: null,
          column: (item, index) => this.offset + index + 1,
          justify: 'end',
          flexGrow: 0,
          flexShrink: 0,
        },
        {
          title: 'Practice',
          key: 'practice_name',
          sort_key: 'practice_name',
          column: (item) => item.practice_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Locum',
          key: 'locum_user_name',
          sort_key: 'locum_user_name',
          column: (item) => item.locum_user_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Profession',
          key: 'profession_name',
          sort_key: 'profession_name',
          column: (item) => item.profession_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Invoice Number',
          key: 'invoice_number',
          sort_key: 'invoice_number',
          column: (item) => item.invoice_number,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Job Number',
          key: 'job_part_number',
          sort_key: 'job_part_number',
          column: (item) => item.job_part_number,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: '£ Paid',
          key: 'total_amount',
          sort_key: 'total_amount',
          column: (item) => item.total_amount ? '£ ' + item.total_amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '£ 0.00',
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Date Paid',
          key: 'paid_at',
          sort_key: 'paid_at',
          column: (item) => this.$moment(item.paid_at, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          justify: 'center',
          flexGrow: 1,
          flexShrink: 0,
        },
      ]
    },

    pages () {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    },
  },

  watch: {
    limit () {
      this.page = 1
      this.getLocumInvoiceReportPayments()
    },
    orderBy (value) {
      let replaced = ''
      if(value.length > 0) {
        replaced = value[0].replace(/_/g, ' ')
        replaced = replaced.replace(/:/g, ' - ')
        replaced = replaced.replace(/(^\w{1})|(\s{1}\w{1})/g, word => word.toUpperCase())
        replaced = replaced.replace('Desc', 'Descending')
        replaced = replaced.replace('Asc', 'Ascending')
      } 
      this.orderByProcessed = replaced
    },
  },

  mounted () {      
    const {
      invoice_number_includes: invoiceNumberIncludes,
      locum_name_includes: locumNameIncudes,
      practice_name_includes: practiceNameIncludes,
      profession_name_includes: professionNameIncludes,
      job_part_number_includes: jobPartNumberIncludes,
      min_total_amount: minTotalAmount,
      max_total_amount: maxTotalAmount,
      calendar_date_start: calendarDateStart,
      calendar_date_end: calendarDateEnd,
      paid_date_start: paidDateStart,
      paid_date_end: paidDateEnd,
      order_by: orderBy = [],
      page,
    } = this.$route.query
    
    this.invoiceNumberIncludes = invoiceNumberIncludes ? invoiceNumberIncludes : ''
    this.locumNameIncudes = locumNameIncudes ? locumNameIncudes : ''
    this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''
    this.professionNameIncludes = professionNameIncludes ? professionNameIncludes : ''
    this.jobPartNumberIncludes = jobPartNumberIncludes ? jobPartNumberIncludes : ''
    this.minTotalAmount = minTotalAmount ? minTotalAmount : ''
    this.maxTotalAmount = maxTotalAmount ? maxTotalAmount : ''
    this.calendarDateStart = calendarDateStart ? calendarDateStart : ''
    this.calendarDateEnd = calendarDateEnd ? calendarDateEnd : ''
    this.paidDateStart = paidDateStart ? paidDateStart : ''
    this.paidDateEnd = paidDateEnd ? paidDateEnd : ''

    this.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy,]

    this.activePage = page ? Number.parseInt(page) : 1

    this.getLocumInvoiceReportPayments()
  },

  methods: {
    filterReset () {
      this.invoiceNumberIncludes = ''
      this.locumNameIncudes = ''
      this.practiceNameIncludes = ''
      this.professionNameIncludes = ''
      this.jobPartNumberIncludes = ''
      this.minTotalAmount = ''
      this.maxTotalAmount = ''
      this.calendarDateStart = ''
      this.calendarDateEnd = ''
      this.paidDateStart = ''
      this.paidDateEnd = ''

      this.filterSearch()
    },

    filterSearch () {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        invoice_number_includes: this.invoiceNumberIncludes ? this.invoiceNumberIncludes : undefined,
        locum_name_includes: this.locumNameIncudes ? this.locumNameIncudes : undefined,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        profession_name_includes: this.professionNameIncludes ? this.professionNameIncludes : undefined,
        job_part_number_includes: this.jobPartNumberIncludes ? this.jobPartNumberIncludes : undefined,
        min_total_amount: this.minTotalAmount ? this.minTotalAmount : undefined,
        max_total_amount: this.maxTotalAmount ? this.maxTotalAmount : undefined,
        calendar_date_start: this.calendarDateStart ? this.calendarDateStart : undefined,
        calendar_date_end: this.calendarDateEnd ? this.calendarDateEnd : undefined,
        paid_date_start: this.paidDateStart ? this.paidDateStart : undefined,
        paid_date_end: this.paidDateEnd ? this.paidDateEnd : undefined,
        order_by: this.orderBy ? this.orderBy : undefined,
        page: undefined,
      }

      if (this.$router.resolve({ query, }).href !== this.$route.fullPath) {
        this.$router.replace({ query, })
      }
      
      this.getLocumInvoiceReportPayments()
    },

    setPage (page) {
      this.activePage = page

      if (this.activePage === 1) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: undefined,
          },
        })
      } else {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: this.activePage,
          },
        })
      }

      this.getLocumInvoiceReportPayments()
    },

    setOrderBy (orderBy) {
      this.orderBy = orderBy
      this.activePage = 1

      this.$router.replace({
        query: {
          ...this.$route.query,
          order_by: this.orderBy,
          page: undefined,
        },
      })

      this.getLocumInvoiceReportPayments()
    },

    getLocumInvoiceReportPayments () {
      this.loading = true
      this.locumInvoiceReports = []

      const params = {
        invoice_number_includes: this.invoiceNumberIncludes ? this.invoiceNumberIncludes : undefined,
        locum_name_includes: this.locumNameIncudes ? this.locumNameIncudes : undefined,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        profession_name_includes: this.professionNameIncludes ? this.professionNameIncludes : undefined,
        job_part_number_includes: this.jobPartNumberIncludes ? this.jobPartNumberIncludes : undefined,
        min_total_amount: this.minTotalAmount ? this.minTotalAmount : undefined,
        max_total_amount: this.maxTotalAmount ? this.maxTotalAmount : undefined,
        calendar_date_start: this.calendarDateStart ? this.calendarDateStart : undefined,
        calendar_date_end: this.calendarDateEnd ? this.calendarDateEnd : undefined,
        paid_date_start: this.paidDateStart ? this.paidDateStart : undefined,
        paid_date_end: this.paidDateEnd ? this.paidDateEnd : undefined,
      }

      Promise.all([
        this.$axios.get('/api/v1/admin/reports/payments/count', {
          params: {
            ...params,
          },
        }).then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/admin/reports/payments', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.payments
        }),
        new Promise((resolve) => setTimeout(resolve, 200)),
      ]).then((results) => {
        const [
          count,
          locumInvoiceReports,
        ] = results

        this.count = count
        this.locumInvoiceReports = locumInvoiceReports
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.loading = false
      })
    },

    downloadCsv () {
      this.downloading = true
      const params = {
        invoice_number_includes: this.invoiceNumberIncludes ? this.invoiceNumberIncludes : undefined,
        locum_name_includes: this.locumNameIncudes ? this.locumNameIncudes : undefined,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        profession_name_includes: this.professionNameIncludes ? this.professionNameIncludes : undefined,
        job_part_number_includes: this.jobPartNumberIncludes ? this.jobPartNumberIncludes : undefined,
        min_total_amount: this.minTotalAmount ? this.minTotalAmount : undefined,
        max_total_amount: this.maxTotalAmount ? this.maxTotalAmount : undefined,
        calendar_date_start: this.calendarDateStart ? this.calendarDateStart : undefined,
        calendar_date_end: this.calendarDateEnd ? this.calendarDateEnd : undefined,
        paid_date_start: this.paidDateStart ? this.paidDateStart : undefined,
        paid_date_end: this.paidDateEnd ? this.paidDateEnd : undefined,
        order_by: this.orderBy,
        limit: 999,
        offset: 0,
      }

      
      console.log('poractice ids', this.practiceIds)

      this.$axios.post('/api/v1/admin/reports/payments/generate-key', {
        filename: `payments.csv`,
      }, {
        params: {
          ...params,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/admin/reports/payments/csv?token=${token}`)
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.downloading = false
      })
    },
  },
}
</script>
