<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm ">
        <nuxt-link to="/locum-job-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Practices Worked
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-013
      </div>

      <div v-if="false">
        <div>
          <label class="">Limit: </label>
          <select v-model="limit">
            <option v-for="limitOption in limits" :key="`limit_${limitOption}`" :value="limitOption">
              {{ limitOption }}
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
        :items="locumPracticesWorkedReports"
        :getItemKey="(item) => item.job_part_id"
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
        class="flex-wrap justify-end items-center w-full p-3 flex my-2"
      >
        <button
          :disabled="downloading || locumPracticesWorkedReports.length === 0"
          class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
          :class="locumPracticesWorkedReports.length === 0 ? 'bg-gray-500' : 'bg-gradient-yellow hover:bg-gradient-yellow-active'"
          @click="downloadPDF"
        >
          <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ReportTable from '@/components/Reports/ReportTable'
import ReportPagination from '@/components/Reports/ReportPagination'
export default {
  components: {
    ReportTable,
    ReportPagination,
  },

  data () {
    return {
      loading: false,
      downloading: false,
      count: 0,
      locumPracticesWorkedReports: [],
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
    }
  },

  computed: {
    itemCountInfo () {
      const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumPracticesWorkedReports.length), this.count)
      
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
          title: 'Area',
          key: 'postcode',
          sort_key: 'postcode',
          column: (item) => item.postcode,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Job Part Number',
          key: 'job_part_number',
          sort_key: 'job_part_number',
          column: (item) => item.job_part_number,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Date Start',
          key: 'date_start',
          sort_key: 'date_start',
          column: (item) => item.date_start ? this.$moment(item.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Date End',
          key: 'date_end',
          sort_key: 'date_end',
          column: (item) => item.date_end ? this.$moment(item.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Rate',
          key: 'job_part_rate_ranged_formatted',
          sort_key: 'job_part_rate_ranged_formatted',
          column: (item) => item.job_part_rate_ranged_formatted,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Rate Type',
          key: 'job_part_rate_types_formatted',
          sort_key: 'job_part_rate_types_formatted',
          column: (item) => item.job_part_rate_types_formatted,
          justify: 'start',
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
      this.getLocumPractices()
    },

    limit () {
      this.page = 1
      this.getLocumPractices()
    },

    activePage () {
      this.getLocumPractices()
    },
  },

  mounted () {      
    // const {
    //   order_by: orderBy = [],
    //   page,
    // } = this.$route.query

    // this.orderBy = orderBy
    // this.activePage = page ? Number.parseInt(page) : 1

    this.getLocumPractices()
  },

  methods: {
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

      this.getLocumPractices()
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

      this.getLocumPractices()
    },

    getLocumPractices () {
      this.loading = true
      this.locumPracticesWorkedReports = []
      let params = {}
      Promise.all([
        this.$axios.get('/api/v1/locum/locum-practices-worked-reports/count', {
          params: {
            ...params,
          },
        }).then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/locum/locum-practices-worked-reports', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.locum_practices_worked_reports
        }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]).then((results) => {
        const [
          count,
          locumPracticesWorkedReports,
        ] = results

        this.count = count
        this.locumPracticesWorkedReports = locumPracticesWorkedReports
      }).catch((err) => {
        console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.loading = false
      })
    },

    downloadPDF () {
      let params = {
        order_by: this.orderBy,
      }
      this.downloading = true
      this.$axios.post('/api/v1/locum/locum-practices-worked-reports/generate-key', {
        filename: 'locum-practices-worked-reports.pdf',
      }, {
        params: {
          ...params,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/locum-practices-worked-reports/pdf?token=${token}`)
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
