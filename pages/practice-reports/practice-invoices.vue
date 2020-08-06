<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm">
        <nuxt-link to="/practice-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Hubzz Invoices
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-010
      </div>

      <!-- FILTER -->
      <div
        class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo  my-2"
      >
        <div class="md:px-1 w-full">
          <label class="text-md md:text-lg text-bold">Filters</label>
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="dateStart"
            placeholder="Date From"
            type="text"
            label="Date From"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="dateEnd"
            placeholder="Date To"
            type="text"
            label="Date To"
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
      <!-- FILTER ENDS HERE -->

      <div v-if="false">
        <div>
          <label class="">Limit: </label>
          <select v-model="limit">
            <option v-for="limit in limits" :key="`limit_${limit}`" :value="limit">
              {{ limit }}
            </option>
          </select>
        </div>
        <div>
          <label class="">Page: </label>
          <select v-model="activePage">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">
              {{ page }}
            </option>
          </select>
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="practiceInvoices"
        :getItemKey="(item) => item.invoice_number"
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
            :disabled="downloading || practiceInvoices.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="practiceInvoices.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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
import ReportTable from '@/components/Reports/ReportTable'
import ReportPagination from '@/components/Reports/ReportPagination'
import AppButton from '@/components/Base/AppButton'
import AppDate from '@/components/Base/AppDate'
export default {
  components: {
    ReportTable,
    ReportPagination,
    AppButton,
    AppDate,
  },

  data () {
    return {
      loading: false,
      downloading: false,
      count: 0,
      practiceInvoices: [],
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
      dateStart: '',
      dateEnd: '',
    }
  },

  computed: {
    itemCountInfo () {
      const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.practiceInvoices.length), this.count)
      
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
          title: 'Date Start',
          key: 'date_start',
          sort_key: 'date_start',
          column: (item) => this.$moment(item.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          justify: 'center',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Date End',
          key: 'date_end',
          sort_key: 'date_end',
          column: (item) => this.$moment(item.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          justify: 'center',
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
          title: '£ Amount',
          key: 'total_amount',
          sort_key: 'total_amount',
          column: (item) => item.total_amount ? item.total_amount.toFixed(2) : null,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Hours',
          key: 'hours',
          sort_key: 'hours',
          column: (item) => item.hours_with_minutes,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Discount',
          key: 'total_credit',
          sort_key: 'total_credit',
          column: (item) => item.total_credit ? item.total_credit.toFixed(2) : null,
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
      this.getPracticeInvoices()
    },

    limit () {
      this.page = 1
      this.getPracticeInvoices()
    },

    activePage () {
      this.getPracticeInvoices()
    },
  },

  mounted () {
    const {
      order_by: orderBy = [],
      page,
      date_start: dateStart,
      date_end: dateEnd,
    } = this.$route.query

    this.orderBy = orderBy
    this.activePage = page ? Number.parseInt(page) : 1
    this.dateStart = dateStart ? dateStart : ''
    this.dateEnd = dateEnd ? dateEnd : ''

    this.getPracticeInvoices()
  },

  methods: {
    filterReset () {
      this.dateStart = ''
      this.dateEnd = ''

      this.filterSearch()
    },

    filterSearch () {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        date_start: this.dateStart ? this.dateStart : undefined,
        dateEnd: this.dateEnd ? this.dateEnd : undefined,
        page: undefined,
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.$router.replace({ query })
      }
      
      this.getPracticeInvoices()
    },

    setPage (page) {
      this.activePage = page

      if (this.activePage === 1) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: undefined,
          }
        })
      } else {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: this.activePage,
          }
        })
      }

      this.getPracticeInvoices()
    },

    setOrderBy (orderBy) {
      this.orderBy = orderBy
      this.activePage = 1

      this.$router.replace({
        query: {
          ...this.$route.query,
          order_by: this.orderBy,
          page: undefined,
        }
      })

      this.getPracticeInvoices()
    },

    getPracticeInvoices () {
      this.loading = true
      this.practiceInvoices = []
      let params = {
        practice_id: this.$auth.user.practice_detail.practice.id,
        date_start: this.dateStart ? this.dateStart : undefined,
        date_end: this.dateEnd ? this.dateEnd : undefined,
      }
      Promise.all([
        this.$axios.get('/api/v1/admin/reports/practice-invoices/count', {
          params
        }).then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/admin/reports/practice-invoices', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.practice_invoices
        }),
        new Promise((resolve) => setTimeout(resolve, 500))
      ]).then((results) => {
        const [
          count,
          practiceInvoices,
        ] = results

        this.count = count
        this.practiceInvoices = practiceInvoices
      }).catch((err) => {
        console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.loading = false
      })
    },

    downloadCsv () {
      this.downloading = true
      const params = {
        practice_id: this.$auth.user.practice_detail.practice.id,
        date_start: this.dateStart ? this.dateStart : undefined,
        date_end: this.dateEnd ? this.dateEnd : undefined,
        order_by: this.orderBy,
        limit: 999,
        offset: 0,
      }

      this.$axios.post('/api/v1/admin/reports/practice-invoices/generate-key', {
        filename: `practiceInvoices.csv`,
      }, {
        params: {
          ...params,
          practice_id: this.$auth.user.practice_detail.practice.id,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/admin/reports/practice-invoices/csv?token=${token}`)
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
