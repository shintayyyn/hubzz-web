<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end ">
      <div class="flex justify-between text-sm">
        <nuxt-link to="/locum-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl">
        Locum Lead Time for Compliance Completed
      </div>
  
      <div class="text-sm md:text-lg">
        Rep-017
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
        :items="locumCompletedCompliances"
        :getItemKey="(item) => item.locum_user_id"
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

      <div v-if="false" class=""> 
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
        locumCompletedCompliances: [],
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
            title: 'Date Registered',
            key: 'date_registered',
            sort_key: 'date_registered',
            column: (item) => this.$moment(item.date_registered, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Compliance Status',
            key: 'compliance_status',
            sort_key: 'compliance_status',
            column: (item) => item.compliance_status,
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date of Approved',
            key: 'first_actived_at',
            sort_key: 'first_actived_at',
            column: (item) => item.first_actived_at ? this.$moment(item.first_actived_at, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
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
      orderBy () {
        this.getLocumCompletedCompliances()
      },

      limit () {
        this.page = 1
        this.getLocumCompletedCompliances()
      },

      activePage () {
        this.getLocumCompletedCompliances()
      },
    },

    mounted () {      
      // const {
      //   order_by: orderBy = [],
      //   page,
      // } = this.$route.query

      // this.orderBy = orderBy
      // this.activePage = page ? Number.parseInt(page) : 1

      this.getLocumCompletedCompliances()
    },

    methods: {
      filterReset () {

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getLocumCompletedCompliances()
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

        this.getLocumCompletedCompliances()
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

        this.getLocumCompletedCompliances()
      },

      getLocumCompletedCompliances () {
        this.loading = true
        this.locumCompletedCompliances = []
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-completed-compliances/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/locum-completed-compliances', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_completed_compliances
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumCompletedCompliances,
          ] = results

          this.count = count
          this.locumCompletedCompliances = locumCompletedCompliances
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },
    },

  }
</script>
