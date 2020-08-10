<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm ">
        <nuxt-link to="/locum-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Expenses
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-014
      </div>

      <div class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo my-2">
        <div class="flex flex-col md:flex-row w-full items-end">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="locumExpenseType"
              label="Type"
              type="select"
              placeholder="Select..."
              :items="locumExpenseTypesSelectionList"
              inClass="bg-white"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="practiceNameIncludes"
              label="Practice"
              type="text"
              placeholder="Search practice"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateStart"
              label="Date Start"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateEnd"
              label="Date End"
            />
          </div>
        </div>

        <div class="flex flex-col md:flex-row w-full items-end">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="descriptionIncludes"
              label="Description"
              type="text"
              placeholder="Search description"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="minTotal"
              label="Min Total"
              type="number"
              placeholder="0.00"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="maxTotal"
              label="Max Total"
              type="number"
              placeholder="0.00"
            />
          </div>
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
        :items="locumExpenses"
        :getItemKey="(item) => item.id"
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
            :disabled="downloading || locumExpenses.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumExpenses.length === 0 ? 'bg-gray-500' : 'bg-gradient-yellow hover:bg-gradient-yellow-active'"
            @click="downloadPDF"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />

            <span>{{ downloading ? 'Downloading PDF' : 'Download PDF' }}</span>
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
import AppDate from "@/components/Base/AppDate"

export default {
  components: {
    ReportTable,
    ReportPagination,
    AppInput,
    AppButton,
    AppDate,
  },

  data () {
    return {
      loading: false,
      count: 0,
      locumExpenses: [],
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
      locumExpenseType: '',
      locumExpenseTypesSelectionList: [
        {
          label: 'All',
          value: '',
        },
        {
          label: 'Private',
          value: 'Private',
        },
        {
          label: 'Platform',
          value: 'Platform',
        },
      ],
      dateStart: '',
      dateEnd: '',
      descriptionIncludes: '',
      minTotal: '',
      maxTotal: '',
      downloading: false,
    }
  },

  computed: {
    itemCountInfo () {
      const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumExpenses.length), this.count)
      
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
          title: 'Type',
          key: 'type',
          sort_key: 'type',
          column: (item) => item.type,
          justify: 'start',
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: 'auto',
        },
        {
          title: 'Practice',
          key: 'locum_expense_practice_name',
          sort_key: 'locum_expense_practice_name',
          column: (item) => item.locum_expense_practice_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Date',
          key: 'date',
          sort_key: 'date',
          column: (item) => item.date_formatted,
          justify: 'center',
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: 'auto',
        },
        {
          title: 'Description',
          key: 'description',
          sort_key: 'description',
          column: (item) => item.description,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Total',
          key: 'total',
          sort_key: 'total',
          column: (item) => item.total.toFixed(2),
          justify: 'end',
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: 'auto',
        },
      ]
    },

    pages () {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    },
  },

  mounted () {      
    const {
      practice_name_includes: practiceNameIncludes,
      locum_expense_type: locumExpenseType,
      date_start: dateStart,
      date_end: dateEnd,
      description_includes: descriptionIncludes,
      min_total: minTotal,
      max_total: maxTotal,
      order_by: orderBy = [],
      page,
    } = this.$route.query

    // this.orderBy = orderBy
    // this.activePage = page ? Number.parseInt(page) : 1
    this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''
    this.locumExpenseType = locumExpenseType ? locumExpenseType : ''
    this.dateStart = dateStart ? dateStart : ''
    this.dateEnd = dateEnd ? dateEnd : ''
    this.descriptionIncludes = descriptionIncludes ? descriptionIncludes : ''
    this.minTotal = minTotal ? minTotal : ''
    this.maxTotal = maxTotal ? maxTotal : ''
    this.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy,]

    this.activePage = page ? Number.parseInt(page) : 1

    this.getLocumExpenses()
  },

  methods: {
    filterReset () {
      this.practiceNameIncludes = ''
      this.locumExpenseType = ''
      this.dateStart = ''
      this.dateEnd = ''
      this.descriptionIncludes = ''
      this.minTotal = ''
      this.maxTotal = ''

      this.filterSearch()
    },

    filterSearch () {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        locum_expense_type: this.locumExpenseType ? this.locumExpenseType : undefined,
        date_start: this.dateStart ? this.dateStart : undefined,
        date_end: this.dateEnd ? this.dateEnd : undefined,
        description_includes: this.descriptionIncludes ? this.descriptionIncludes : undefined,
        min_rate: this.minTotal ? this.minTotal : undefined,
        max_rate: this.maxTotal ? this.maxTotal : undefined,
        order_by: this.orderBy ? this.orderBy : undefined,
        page: undefined,
      }

      if (this.$router.resolve({ query, }).href !== this.$route.fullPath) {
        this.$router.replace({ query, })
      }
      
      this.getLocumExpenses()
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

      this.getLocumExpenses()
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

      this.getLocumExpenses()
    },

    getLocumExpenses () {
      this.loading = true
      this.locumExpenses = []

      let params = {
        locum_expense_practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        type: this.locumExpenseType ? this.locumExpenseType : undefined,
        date_start: this.dateStart ? this.dateStart : undefined,
        date_end: this.dateEnd ? this.dateEnd : undefined,
        description_includes: this.descriptionIncludes ? this.descriptionIncludes : undefined,
        min_rate: this.minTotal ? this.minTotal : undefined,
        max_rate: this.maxTotal ? this.maxTotal : undefined,
      }

      Promise.all([
        this.$axios.get('/api/v1/locum/locum-expenses/count', {
          params,
        }).then((responses) => {
          return responses.data.data.count
        }),

        this.$axios.get('/api/v1/locum/locum-expenses', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.locum_expenses
        }),

        new Promise((resolve) => setTimeout(resolve, 500)),
      ]).then((results) => {
        const [
          count,
          locumExpenses,
        ] = results

        this.count = count
        this.locumExpenses = locumExpenses
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = false
      })
    },

    downloadPDF () {
      let params = {
        locum_expense_practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        type: this.locumExpenseType ? this.locumExpenseType : undefined,
        date_start: this.dateStart ? this.dateStart : undefined,
        date_end: this.dateEnd ? this.dateEnd : undefined,
        description_includes: this.descriptionIncludes ? this.descriptionIncludes : undefined,
        min_rate: this.minTotal ? this.minTotal : undefined,
        max_rate: this.maxTotal ? this.maxTotal : undefined,
        order_by: this.orderBy,
      }

      this.downloading = true
      this.$axios.post('/api/v1/locum/locum-expenses/generate-key', {
        filename: `expenses.pdf`,
      }, {
        params: {
          ...params,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/locum-expenses/pdf?token=${token}`)
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
