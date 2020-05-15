<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm ">
        <nuxt-link to="/locum-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        NHS Pension Contributions
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-011
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
        :items="locumPensionContributions"
        :getItemKey="(item) => item.locum_invoice_id"
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
  import AppInput from '@/components/Base/AppInput'
  import AppButton from '@/components/Base/AppButton'
  export default {
    components: {
      ReportTable,
      ReportPagination,
      AppInput,
      AppButton
    },

    data () {
      return {
        loading: false,
        count: 0,
        locumPensionContributions: [],
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

        practiceNameIncludes: '',
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
            title: 'Job Number',
            key: 'job_part_number',
            sort_key: 'job_part_number',
            column: (item) => item.job_part_number,
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
            title: 'Date Paid',
            key: 'paid_at',
            sort_key: 'paid_at',
            column: (item) => this.$moment(item.paid_at, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: '£ NI Amount',
            key: 'ni_amount',
            sort_key: 'ni_amount',
            column: (item) => item.ni_amount.toFixed(2),
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Status',
            key: 'status',
            sort_key: 'status',
            column: (item) => item.status,
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
        this.getLocumPensionContributions()
      },

      limit () {
        this.page = 1
        this.getLocumPensionContributions()
      },

      activePage () {
        this.getLocumPensionContributions()
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
      this.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy]

      this.activePage = page ? Number.parseInt(page) : 1

      this.getLocumPensionContributions()
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

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getLocumPensionContributions()
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

        this.getLocumPensionContributions()
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

        this.getLocumPensionContributions()
      },

      getLocumPensionContributions () {
        this.loading = true
        this.locumPensionContributions = []
        let params = {
          locum_user_id: this.$auth.user.id,
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
        }
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-pension-contributions/count',{
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/locum-pension-contributions', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_pension_contributions
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumPensionContributions,
          ] = results

          this.count = count
          this.locumPensionContributions = locumPensionContributions
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
