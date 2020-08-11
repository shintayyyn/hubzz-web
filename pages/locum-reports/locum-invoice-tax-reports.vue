<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm ">
        <nuxt-link to="/locum-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Tax Reporting - Money Earnt and Tax and NI Paid
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-012
      </div>

      <div class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo my-2">
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="practiceNameIncludes"
            placeholder="Search practice"
            type="text"
            label="Practice"
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
          <label>Limit: </label>

          <select v-model="limit">
            <option v-for="limitOption in limits" :key="`limit_${limitOption}`" :value="limitOption">
              {{ limitOption }}
            </option>
          </select>
        </div>

        <div>
          <label>Page: </label>

          <select v-model="activePage">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">
              {{ page }}
            </option>
          </select>
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="locumInvoiceTaxReports"
        :getItemKey="(item) => item.locum_invoice_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
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
          </div>
        </div>

        <ReportPagination
          :count="count" 
          :pages="pages" 
          :page="activePage"
          @page="setPage" 
        />
      </div>

      <div class="flex-wrap justify-start items-center w-full p-3 flex my-2">
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || locumInvoiceTaxReports.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumInvoiceTaxReports.length === 0 ? 'bg-gray-500' : 'bg-gradient-yellow hover:bg-gradient-yellow-active'"
            @click="downloadPDF"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />

            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReportTable from '@/components/Reports/ReportTable'
import ReportPagination from '@/components/Reports/ReportPagination'
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
export default {
  components: {
    ReportTable,
    ReportPagination,
    AppInput,
    AppButton,
  },

  data () {
    return {
      loading: false,
      count: 0,
      locumInvoiceTaxReports: [],
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

      practiceNameIncludes: '',

      downloading: false,
    }
  },

  computed: {
    itemCountInfo () {
      const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumInvoiceTaxReports.length), this.count)
      
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
          title: 'Invoice Number',
          key: 'invoice_number',
          sort_key: 'invoice_number',
          column: (item) => item.invoice_number,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Gross',
          key: 'total_amount_formatted',
          sort_key: 'total_amount',
          column: (item) => item.total_amount_formatted,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Tax',
          key: 'paye_amount_formatted',
          sort_key: 'paye_amount',
          column: (item) => item.paye_amount_formatted,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'NI',
          key: 'ni_amount_formatted',
          sort_key: 'ni_amount',
          column: (item) => item.ni_amount_formatted,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Nett',
          key: 'nett_amount_formatted',
          sort_key: 'nett_amount',
          column: (item) => item.nett_amount_formatted,
          justify: 'end',
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
      this.getLocumInvoices()
    },

    limit () {
      this.page = 1
      this.getLocumInvoices()
    },

    activePage () {
      this.getLocumInvoices()
    },
  },

  mounted () {      
    const {
      practice_name_includes: practiceNameIncludes,
      order_by: orderBy = [],
      page,
    } = this.$route.query

    // this.orderBy = orderBy
    // this.activePage = page ? Number.parseInt(page) : 1
    this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''
    this.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy,]

    this.activePage = page ? Number.parseInt(page) : 1

    this.getLocumInvoices()
  },

  methods: {
    filterReset () {
      this.practiceNameIncludes = ''

      this.filterSearch()
    },

    filterSearch () {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        order_by: this.orderBy ? this.orderBy : undefined,
        page: undefined,
      }

      if (this.$router.resolve({ query, }).href !== this.$route.fullPath) {
        this.$router.replace({ query, })
      }
      
      this.getLocumInvoices()
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

      this.getLocumInvoices()
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

      this.getLocumInvoices()
    },

    getLocumInvoices () {
      this.loading = true
      this.locumInvoiceTaxReports = []
      let params = {
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
      }
      Promise.all([
        this.$axios.get('/api/v1/locum/locum-invoice-tax-reports/count', {
          params,
        }).then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/locum/locum-invoice-tax-reports', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.locum_invoice_tax_reports
        }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]).then((results) => {
        const [
          count,
          locumInvoiceTaxReports,
        ] = results

        this.count = count
        this.locumInvoiceTaxReports = locumInvoiceTaxReports
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = false
      })
    },

    downloadPDF () {
      let params = {
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        order_by: this.orderBy,
      }
      this.downloading = true
      this.$axios.post('/api/v1/locum/locum-invoice-tax-reports/generate-key', {
        filename: `tax-reports.pdf`,
      }, {
        params: {
          ...params,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/locum-invoice-tax-reports/pdf?token=${token}`)
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
