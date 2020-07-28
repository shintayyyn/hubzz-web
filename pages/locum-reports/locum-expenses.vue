<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm ">
        <nuxt-link to="/locum-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Locum - Expenses (WIP)
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-014
      </div>

      <!-- <div
        class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo  my-2"
      >
        <div class="md:px-1 w-full">
          <label class="text-md md:text-lg text-bold">Filters</label>
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="locumNameIncludes"
            placeholder="Search locum"
            type="text"
            label="Locum"
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
        :items="locumComplianceDocuments"
        :getItemKey="(item) => item.locum_compliance_document_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
      />
      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class="text-gray-500 w-full md:w-auto text-center md:text-left">
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

      <div v-if="true" class=""> 
        <span>Count: {{ count }}</span>
        <br>
        <span>Order By: {{ orderBy.join(',') }}</span>
        <br>
        <span>Page {{ activePage }} of {{ pages }} pages</span>
      </div> -->
    </div>
  </div>
</template>

<script>
// import ReportTable from '@/components/Reports/ReportTable'
// import ReportPagination from '@/components/Reports/ReportPagination'
// import AppButton from '@/components/Base/AppButton'
// import AppInput from '@/components/Base/AppInput'
export default {
  components: {
    // ReportTable,
    // ReportPagination,
    // AppButton,
    // AppInput,
  },

  data () {
    return {
      loading: false,
      count: 0,
      locumComplianceDocuments: [],
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
    itemCountInfo () {
      const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumComplianceDocuments.length), this.count)
      
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
          key: 'compliance_document_name',
          sort_key: 'compliance_document_name',
          column: (item) => item.compliance_document_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Expiry Date',
          key: 'expired_at',
          sort_key: 'expired_at',
          column: (item) => item.expired_at ? this.$moment(item.expired_at, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
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
      this.getLocumComplianceDocuments()
    },

    limit () {
      this.page = 1
      this.getLocumComplianceDocuments()
    },

    activePage () {
      this.getLocumComplianceDocuments()
    },
  },

  mounted () {      
    // const {
    //   order_by: orderBy = [],
    //   page,
    // } = this.$route.query

    // this.orderBy = orderBy
    // this.activePage = page ? Number.parseInt(page) : 1

    this.getLocumComplianceDocuments()
  },

  methods: {
    filterReset () {
      this.locumNameIncludes = ''

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
      
      this.getLocumComplianceDocuments()
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

      this.getLocumComplianceDocuments()
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

      this.getLocumComplianceDocuments()
    },

    getLocumComplianceDocuments () {
      this.loading = true
      this.locumComplianceDocuments = []
      Promise.all([
        this.$axios.get('/api/v1/admin/reports/locum-compliance-documents/count').then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/admin/reports/locum-compliance-documents', {
          params: {
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.locum_compliance_documents
        }),
        new Promise((resolve) => setTimeout(resolve, 500))
      ]).then((results) => {
        const [
          count,
          locumComplianceDocuments,
        ] = results

        this.count = count
        this.locumComplianceDocuments = locumComplianceDocuments
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
