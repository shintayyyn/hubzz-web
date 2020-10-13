
<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm">
        <nuxt-link to="/practice-job-reports" class=" hover:text-sunglow p-1">
          <svgicon name="left-arrow" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl ">
        Locums that have Declined
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-007
      </div>

      <!-- FILTER -->
      <div
        class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo  my-2"
      >
        <div class="md:px-1 w-full">
          <label class="text-md md:text-lg text-bold">Filters</label>
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="practiceNameIncludes"
            placeholder="Search Practice Name"
            type="text"
            label="Practice Name"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="locumUserNameIncludes"
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
      <!-- FILTER ENDS HERE -->

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
        :items="declinedJobReports"
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

            <!-- <div class="whitespace-no-wrap">
              Order By: {{ orderByProcessed }}
            </div> -->
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
        v-if="authPermissions.includes('Export Practice Reports')"
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || declinedJobReports.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="declinedJobReports.length === 0 ? 'bg-gray-500' : 'bg-gradient-yellow hover:bg-gradient-yellow-active'"
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
import AppButton from '@/components/Base/AppButton'
import AppInput from '@/components/Base/AppInput'
export default {
  components: {
    ReportTable,
    ReportPagination,
    AppButton,
    AppInput,
  },

  data () {
    return {
      loading: false,
      downloading: false,
      count: 0,
      declinedJobReports: [],
      orderBy: [],
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
      locumUserNameIncludes: '',
      practiceNameIncludes: '',
    }
  },

  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },

    itemCountInfo () {
      const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.declinedJobReports.length), this.count)
      
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
          justify: 'start',
          flexGrow: 0,
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
          title: 'Locum',
          key: 'locum_user_name',
          sort_key: 'locum_user_name',
          column: (item) => item.locum_user_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Rates',
          key: 'job_rate_ranged_formatted',
          sort_key: 'job_rate_ranged_formatted',
          column: (item) => item.job_rate_ranged_formatted,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Rate Types',
          key: 'job_rate_type_names_formatted',
          sort_key: 'job_rate_type_names_formatted',
          column: (item) => item.job_rate_type_names_formatted,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Job Number',
          key: 'job_number',
          sort_key: 'job_number',
          column: (item) => item.job_number,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
        {
          title: 'Reason',
          key: 'declined_reason',
          sort_key: 'declined_reason',
          column: (item) => item.declined_reason,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0,
        },
      ]
    },

    pages () {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    },

    orderByProcessed () {
      let replaced = ''

      if(this.orderBy.length > 0) {
        replaced = this.orderBy[0].replace(/_/g, ' ')
        replaced = replaced.replace(/:/g, ' - ')
        replaced = replaced.replace(/(^\w{1})|(\s{1}\w{1})/g, word => word.toUpperCase())
        replaced = replaced.replace('Desc', 'Descending')
        replaced = replaced.replace('Asc', 'Ascending')
      } 

      return replaced
    },
  },

  watch: {
    limit () {
      this.activePage = 1
      this.getPracticeDeclinedLocums()
    },
  },

  mounted () {      
    // const {
    //   order_by: orderBy = [],
    //   page,
    // } = this.$route.query

    // this.orderBy = orderBy
    // this.activePage = page ? Number.parseInt(page) : 1
    const {
      locum_user_name_includes: locumUserNameIncludes,
      practice_name_includes: practiceNameIncludes,
    } = this.$route.query

    this.locumUserNameIncludes = locumUserNameIncludes ? locumUserNameIncludes : ''
    this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''

    this.getPracticeDeclinedLocums()
  },

  methods: {
    async filterReset () {
      this.locumUserNameIncludes = ''
      this.practiceNameIncludes = ''
      this.orderBy = []

      await this.filterSearch()
    },

    filterSearch () {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        locum_user_name_includes: this.locumUserNameIncludes ? this.locumUserNameIncludes : null,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : null,
        page: undefined,
      }

      if (this.$router.resolve({ query, }).href !== this.$route.fullPath) {
        this.$router.replace({ query, })
      }
      
      this.getPracticeDeclinedLocums()
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

      this.getPracticeDeclinedLocums()
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

      this.getPracticeDeclinedLocums()
    },

    getPracticeDeclinedLocums () {
      this.loading = true
      this.declinedJobReports = []

      const params = {
        locum_user_name_includes: this.locumUserNameIncludes ? this.locumUserNameIncludes : undefined,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
      }

      Promise.all([
        this.$axios.get('/api/v1/practice/declined-job-reports/count', {
          params: {
            ...params,
          },
        }).then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/practice/declined-job-reports', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.declined_job_reports
        }),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]).then((results) => {
        const [
          count,
          declinedJobReports,
        ] = results

        this.count = count
        this.declinedJobReports = declinedJobReports
      }).catch((err) => {
        console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.loading = false
      })
    },

    async downloadPDF () {
      let params = await {
        locum_user_name_includes: this.locumUserNameIncludes ? this.locumUserNameIncludes : null,
        practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : null,
        limit: 999,
        order_by: this.orderBy,
      }

      await this.$axios.post('/api/v1/practice/declined-job-reports/generate-key', {
        filename: `declined-job-reports.pdf`,
        filter: {
          ...params,
        },
      }, {
        params: {
          ...params,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/declined-job-reports/pdf?token=${token}`)
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
