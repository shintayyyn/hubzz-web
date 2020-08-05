<template>
  <div>
    <div>
      <!-- FILTER -->
      <div
        class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo text-black my-2"
      >
        <div class="md:px-1 w-full">
          <label class="text-md md:text-lg text-bold">Filters</label>
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="locumNameIncudes"
            placeholder="Search locum"
            type="text"
            label="Locum"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="professionNameIncludes"
            placeholder="Search profession"
            type="text"
            label="Profession"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="userPostcode"
            placeholder="Search Area"
            type="text"
            label="Area"
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
      <div>
        <label class="text-black">Limit: </label>
        <select v-model="limit">
          <option v-for="limit in limits" :key="`limit_${limit}`" :value="limit">
            {{ limit }}
          </option>
        </select>
      </div>
      <div>
        <label class="text-black">Page: </label>
        <select v-model="activePage">
          <option v-for="page in pages" :key="`page_${page}`" :value="page">
            {{ page }}
          </option>
        </select>
      </div>
    </div>

    <ReportTable
      :limit="limit"
      :items="locums"
      :getItemKey="(item) => item.locum_user_id"
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
    
    <div class="flex-wrap justify-start items-center w-full p-3 flex my-2">
      <div class="md:px-1 flex flex-wrap w-full justify-end">
        <button
          :disabled="downloading || locums.length === 0"
          class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
          :class="locums.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
          @click="downloadCsv"
        >
          <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
          <span>Download CSV</span>
        </button>
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

  transition: 'fade',

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
      locums: [],
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
      locumNameIncudes: '',
      professionNameIncludes: '',
      userPostcode: '',
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
      const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locums.length), this.count)
      
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
          title: 'Profession',
          key: 'profession_name',
          sort_key: 'profession_name',
          column: (item) => item.profession_name,
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
          justify: 'start',
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
          justify: 'start',
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
          justify: 'start',
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
      this.getLocums()
    },

    limit () {
      this.page = 1
      this.getLocums()
    },

    activePage () {
      this.getLocums()
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
      locum_name_includes: locumNameIncudes,
      profession_name_includes: professionNameIncludes,
      user_postcode: userPostcode,
    } = this.$route.query

    this.locumNameIncudes = locumNameIncudes ? locumNameIncudes : ''
    this.professionNameIncludes = professionNameIncludes ? professionNameIncludes : ''
    this.userPostcode = userPostcode ? userPostcode : ''
    this.getLocums()
  },

  methods: {
    filterReset () {
      this.locumNameIncudes = ''
      this.professionNameIncludes = ''

      this.filterSearch()
    },

    filterSearch () {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        locum_name_includes: this.locumNameIncudes ? this.locumNameIncudes : undefined,
        profession_name_includes: this.professionNameIncludes ? this.professionNameIncludes : undefined,
        user_postcode: this.userPostcode ? this.userPostcode : undefined,
        page: undefined,
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.$router.replace({ query })
      }
      
      this.getLocums()
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

      this.getLocums()
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

      this.getLocums()
    },

    getLocums () {
      this.loading = true
      this.locums = []
      // console.log('this.$auth.user', this.$auth.user)
      const params = {
        practice_id: this.$auth.user.practice_id,
        locum_name_includes: this.locumNameIncudes ? this.locumNameIncudes : undefined,
        profession_name_includes : this.professionNameIncludes ? this.professionNameIncludes : undefined,
        user_postcode: this.userPostcode ? this.userPostcode : undefined,
      }
      Promise.all([
        this.$axios.get('/api/v1/admin/reports/locums/count',{
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.count
        }),
        this.$axios.get('/api/v1/admin/reports/locums', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit: this.limit,
            offset: this.offset,
          },
        }).then((responses) => {
          return responses.data.data.locums
        }),
        new Promise((resolve) => setTimeout(resolve, 500))
      ]).then((results) => {
        console.log('results', results)
        const [
          count,
          locums,
        ] = results

        this.count = count
        this.locums = locums
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
        practice_id: this.$auth.user.practice_id,
        locum_name_includes: this.locumNameIncudes ? this.locumNameIncudes : undefined,
        profession_name_includes: this.professionNameIncludes ? this.professionNameIncludes : undefined,
        user_postcode: this.userPostcode ? this.userPostcode : undefined,
        order_by: this.orderBy,
        limit: 999,
        offset: 0,
      }

      this.$axios.post('/api/v1/admin/reports/locums/generate-key', {
        filename: `locums.csv`,
      }, {
        params: {
          ...params,
        },
      }).then((responses) => {
        const token = responses.data.data.token

        window.open(`${process.env.API_URL}/api/v1/admin/reports/locums/csv?token=${token}`)
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
