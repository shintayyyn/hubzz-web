<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm ">
        <nuxt-link to="/locum-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Locum Practice Referrals
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-021
      </div>
  
      <div v-if="false">
        <div>
          <label class="">Limit: </label>
          <select v-model="limit">
            <option v-for="(item, index) in limits" :key="`limit_${index}`" :value="item">
              {{ item }}
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
        :items="locumPracticeReferrals"
        :getItemKey="(item) => item.id"
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
          locumPracticeReferrals: [],
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
              title: 'Locum Name',
              key: 'locum_name',
              sort_key: 'locum_name',
              column: (item) => item.locum_name,
              justify: 'start',
              flexGrow: 1,
              flexShrink: 0,
            },
            {
              title: 'Practice Name',
              key: 'practice_name',
              sort_key: 'practice_name',
              column: (item) => item.practice_name,
              justify: 'start',
              flexGrow: 1,
              flexShrink: 0,
            },
            {
              title: 'Area',
              key: 'area',
              sort_key: 'area',
              column: (item) => item.area,
              justify: 'start',
              flexGrow: 1,
              flexShrink: 0,
            },
            {
              title: 'Date Practice Registered',
              key: 'date_practice_registered',
              sort_key: 'date_practice_registered',
              column: (item) => this.$moment(item.date_practice_registered, 'YYYY-MM-DD').format('DD/MM/YYYY'),
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
          this.getLocumPracticeReferrals()
        },
  
        limit () {
          this.page = 1
          this.getLocumPracticeReferrals()
        },
  
        activePage () {
          this.getLocumPracticeReferrals()
        },
      },
  
      mounted () {      
        // const {
        //   order_by: orderBy = [],
        //   page,
        // } = this.$route.query
  
        // this.orderBy = orderBy
        // this.activePage = page ? Number.parseInt(page) : 1
  
        this.getLocumPracticeReferrals()
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

          this.getLocumPracticeReferrals()
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

          this.getLocumPracticeReferrals()
        },
        
        getLocumPracticeReferrals () {
          this.loading = true
          this.locumPracticeReferrals = []
          Promise.all([
            this.$axios.get('/api/v1/admin/reports/locum-practice-referrals/count').then((responses) => {
              return responses.data.data.count
            }),
            this.$axios.get('/api/v1/admin/reports/locum-practice-referrals', {
              params: {
                order_by: this.orderBy,
                limit: this.limit,
                offset: this.offset,
              },
            }).then((responses) => {
              return responses.data.data.locum_practice_referrals
            }),
            new Promise((resolve) => setTimeout(resolve, 500))
          ]).then((results) => {
            const [
              count,
              locumPracticeReferrals,
            ] = results
  
            this.count = count
            this.locumPracticeReferrals = locumPracticeReferrals
          }).catch((err) => {
            console.log('err', err)
            this.$nuxt.error(err.response ? err.response.data : err)
          }).finally(() => {
            this.loading = false
          })
        },
      },
  
    }
  </script>
  