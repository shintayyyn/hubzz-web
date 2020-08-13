<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm">
        <nuxt-link :to="{ name: 'my-banks-reports'}" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Locums Not Successful
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-006
      </div>

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
        :items="practiceUnsuccessfulLocums"
        :getItemKey="(item) => `${item.practice_id}_${item.locum_user_id}`"
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
            :disabled="downloading || practiceUnsuccessfulLocums.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="practiceUnsuccessfulLocums.length === 0 ? 'bg-gray-500' : 'bg-gradient-yellow hover:bg-gradient-yellow-active'"
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
      practiceUnsuccessfulLocums: [],
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
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.practiceUnsuccessfulLocums.length), this.count)
      
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
          title: 'Locum',
          key: 'locum_user_name',
          sort_key: 'locum_user_name',
          column: (item) => item.locum_user_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Compliance',
          key: 'compliance_status',
          sort_key: 'compliance_status',
          column: (item) => item.compliance_status,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Min Rate per Hour',
          key: 'min_rate_per_hour',
          sort_key: 'min_rate_per_hour',
          column: (item) => item.min_rate_per_hour ? item.min_rate_per_hour.toFixed(2) : null,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        // {
        //   title: 'Max Rate per Hour',
        //   key: 'max_rate_per_hour',
        //   sort_key: 'max_rate_per_hour',
        //   column: (item) => item.max_rate_per_hour ? item.max_rate_per_hour.toFixed(2) : null,
        //   justify: 'start',
        //   flexGrow: 1,
        //   flexShrink: 0,
        // },
        {
          title: 'Min Rate per Half Day Session',
          key: 'min_rate_per_half_day_session',
          sort_key: 'min_rate_per_half_day_session',
          column: (item) => item.min_rate_per_half_day_session ? item.min_rate_per_half_day_session.toFixed(2) : null,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        // {
        //   title: 'Max Rate per Half Day Session',
        //   key: 'max_rate_per_half_day_session',
        //   sort_key: 'max_rate_per_half_day_session',
        //   column: (item) => item.max_rate_per_half_day_session ? item.max_rate_per_half_day_session.toFixed(2) : null,
        //   justify: 'start',
        //   flexGrow: 1,
        //   flexShrink: 0,
        // },
        {
          title: 'Min Rate per Whole Day Session',
          key: 'min_rate_per_whole_day_session',
          sort_key: 'min_rate_per_whole_day_session',
          column: (item) => item.min_rate_per_whole_day_session ? item.min_rate_per_whole_day_session.toFixed(2) : null,
          justify: 'end',
          flexGrow: 1,
          flexShrink: 0,
        },
        // {
        //   title: 'Max Rate per Whole Day Session',
        //   key: 'max_rate_per_whole_day_session',
        //   sort_key: 'max_rate_per_whole_day_session',
        //   column: (item) => item.max_rate_per_whole_day_session ? item.max_rate_per_whole_day_session.toFixed(2) : null,
        //   justify: 'start',
        //   flexGrow: 1,
        //   flexShrink: 0,
        // },
        {
          title: 'Area',
          key: 'user_postcode',
          sort_key: 'user_postcode',
          column: (item) => item.user_postcode,
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
      this.getPracticeUnsuccessfulLocums()
    },
    limit () {
      this.page = 1
      this.getPracticeUnsuccessfulLocums()
    },

    activePage () {
      this.getPracticeUnsuccessfulLocums()
    },
  },

  mounted () {      
    const {
      order_by: orderBy = [],
      page,
    } = this.$route.query

    this.orderBy = orderBy
    this.activePage = page ? Number.parseInt(page) : 1

    this.getPracticeUnsuccessfulLocums()
  },

  methods: {
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

      this.getPracticeUnsuccessfulLocums()
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

      this.getPracticeUnsuccessfulLocums()
    },

    getPracticeUnsuccessfulLocums () {
      this.loading = true
      this.practiceUnsuccessfulLocums = []
      let params = {
        practice_id: this.$auth.user.practice_detail.practice.id,
      }
      Promise.all([
        this.$axios.get('/api/v1/admin/reports/practice-unsuccessful-locums/count',{
          params: {
            ...params,
          },
        }).then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/admin/reports/practice-unsuccessful-locums', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.practice_unsuccessful_locums
        }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]).then((results) => {
        const [
          count,
          practiceUnsuccessfulLocums,
        ] = results

        this.count = count
        this.practiceUnsuccessfulLocums = practiceUnsuccessfulLocums
      }).catch((err) => {
        console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.loading = false
      })
    },

    async downloadPDF () {
      this.downloading = true
      let params = await {
        practice_id: this.$auth.user.practice_detail.practice.id,
        order_by: this.orderBy,
        limit: 999,
      }

      await this.$axios.post('/api/v1/practice-reports/practice-unsuccessful-locums-report/generate-key', {
        filename: `practiceUnsuccessfulReport.pdf`,
      }, {
        params: {
          ...params,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/practice-reports/practice-unsuccessful-locums-report/pdf?token=${token}`)
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
