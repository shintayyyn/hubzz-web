<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm ">
        <nuxt-link to="/locum-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Locum Usages
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-029
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
        :items="locumUsages"
        :getItemKey="(item) => `${item.locum_user_id}-${item.practice_id}`"
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
        count: 0,
        locumUsages: [],
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
            title: 'Locum',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: (item) => item.locum_user_name,
            justify: 'start',
            flexGrow: 1,
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
            title: 'Total Hours Assigned/Completed or Approved',
            key: 'completed_terminated_job_part_total_hours',
            sort_key: 'completed_terminated_job_part_total_hours',
            column: (item) => item.completed_terminated_job_part_total_hours.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Hour',
            key: 'min_rate_per_hour',
            sort_key: 'min_rate_per_hour',
            column: (item) => item.min_rate_per_hour.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Half Day Session',
            key: 'min_rate_per_half_day_session',
            sort_key: 'min_rate_per_half_day_session',
            column: (item) => item.min_rate_per_half_day_session.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Whole Day Session',
            key: 'min_rate_per_whole_day_session',
            sort_key: 'min_rate_per_whole_day_session',
            column: (item) => item.min_rate_per_whole_day_session.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Marked as Favourite',
            key: 'locum_is_favorite_of_practice',
            sort_key: 'locum_is_favorite_of_practice',
            column: (item) => item.locum_is_favorite_of_practice ? 'Yes' : 'No',
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Area',
            key: 'locum_postcode',
            sort_key: 'locum_postcode',
            column: (item) => item.locum_postcode,
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
        this.getPracticeLocums()
      },

      limit () {
        this.page = 1
        this.getPracticeLocums()
      },

      activePage () {
        this.getPracticeLocums()
      },
    },

    mounted () {      
      // const {
      //   order_by: orderBy = [],
      //   page,
      // } = this.$route.query

      // this.orderBy = orderBy
      // this.activePage = page ? Number.parseInt(page) : 1

      this.getPracticeLocums()
    },

    methods: {
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

        this.getPracticeLocums()
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

        this.getPracticeLocums()
      },

      getPracticeLocums () {
        this.loading = true
        this.locumUsages = []
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-usages/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/locum-usages', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_usages
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumUsages,
          ] = results

          this.count = count
          this.locumUsages = locumUsages
        }).catch((err) => {
          console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },
    },

  }
</script>
