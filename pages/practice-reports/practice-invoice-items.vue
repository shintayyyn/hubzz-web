
<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm">
        <nuxt-link to="/practice-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Invoices
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-031
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
        :items="locumInvoiceJobParts"
        :getItemKey="(item) => item.practice_invoice_item_id"
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
        locumInvoiceJobParts: [],
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
            title: 'Job Number',
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
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date End',
            key: 'date_end',
            sort_key: 'date_end',
            column: (item) => item.date_end ? this.$moment(item.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          // {
          //   title: 'Total Hours',
          //   key: 'final_hours',
          //   sort_key: 'final_hours',
          //   column: (item) => item.final_hours.toFixed(2),
          //   justify: 'end',
          //   flexGrow: 1,
          //   flexShrink: 0,
          // },
          // {
          //   title: 'Invoice Status',
          //   key: 'invoice_status',
          //   sort_key: 'invoice_status',
          //   column: (item) => item.invoice_status,
          //   justify: 'start',
          //   flexGrow: 1,
          //   flexShrink: 0,
          // },
        ]
      },

      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },
    },

    watch: {
      orderBy () {
        this.getPracticeInvoiceItems()
      },

      limit () {
        this.page = 1
        this.getPracticeInvoiceItems()
      },

      activePage () {
        this.getPracticeInvoiceItems()
      },
    },

    mounted () {      
      // const {
      //   order_by: orderBy = [],
      //   page,
      // } = this.$route.query

      // this.orderBy = orderBy
      // this.activePage = page ? Number.parseInt(page) : 1

      this.getPracticeInvoiceItems()
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

        this.getPracticeInvoiceItems()
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

        this.getPracticeInvoiceItems()
      },

      getPracticeInvoiceItems () {
        this.loading = true
        this.locumInvoiceJobParts = []
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/practice-invoice-items/count').then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/practice-invoice-items', {
            params: {
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.practice_invoice_items
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumInvoiceJobParts,
          ] = results

          this.count = count
          this.locumInvoiceJobParts = locumInvoiceJobParts
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
