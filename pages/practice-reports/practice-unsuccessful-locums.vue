<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm">
        <nuxt-link to="/practice-reports" class=" hover:text-sunglow p-1">
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

      <ReportPagination
        :count="count" 
        :pages="pages" 
        :page="activePage" 
        @page="setPage"
      />
      
      <div
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading"
            class="bg-sunglow hover:bg-sunglow-dark px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <div v-if="true" class=""> 
        <span>Count: {{ count }}</span>
        <br>
        <span>Order By: {{ orderBy.join(',') }}</span>
        <br>
        <span>Page {{ activePage }} of {{ pages }} pages</span>
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
            title: 'Area',
            key: 'user_postcode',
            sort_key: 'user_postcode',
            column: (item) => item.user_postcode,
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
          {
            title: 'Max Rate per Hour',
            key: 'max_rate_per_hour',
            sort_key: 'max_rate_per_hour',
            column: (item) => item.max_rate_per_hour ? item.max_rate_per_hour.toFixed(2) : null,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Half Day Session',
            key: 'min_rate_per_half_day_session',
            sort_key: 'min_rate_per_half_day_session',
            column: (item) => item.min_rate_per_half_day_session ? item.min_rate_per_half_day_session.toFixed(2) : null,
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Max Rate per Half Day Session',
            key: 'max_rate_per_half_day_session',
            sort_key: 'max_rate_per_half_day_session',
            column: (item) => item.max_rate_per_half_day_session ? item.max_rate_per_half_day_session.toFixed(2) : null,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Whole Day Session',
            key: 'min_rate_per_whole_day_session',
            sort_key: 'min_rate_per_whole_day_session',
            column: (item) => item.min_rate_per_whole_day_session ? item.min_rate_per_whole_day_session.toFixed(2) : null,
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Max Rate per Whole Day Session',
            key: 'max_rate_per_whole_day_session',
            sort_key: 'max_rate_per_whole_day_session',
            column: (item) => item.max_rate_per_whole_day_session ? item.max_rate_per_whole_day_session.toFixed(2) : null,
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
      orderBy () {
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
      // const {
      //   order_by: orderBy = [],
      //   page,
      // } = this.$route.query

      // this.orderBy = orderBy
      // this.activePage = page ? Number.parseInt(page) : 1

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
          }
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

        this.getPracticeUnsuccessfulLocums()
      },

      getPracticeUnsuccessfulLocums () {
        this.loading = true
        this.practiceUnsuccessfulLocums = []
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/practice-unsuccessful-locums/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/practice-unsuccessful-locums', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.practice_unsuccessful_locums
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
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

      downloadCsv () {
        this.downloading = true
        const params = {
          order_by: this.orderBy,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/practice-unsuccessful-locums/generate-key', {
          filename: `practice-unsuccessful-locums.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/practice-unsuccessful-locums/csv?token=${token}`)
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
