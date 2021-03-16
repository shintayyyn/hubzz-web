<template>
  <section class="relative">
    <div class="relative flex flex-col md:flex-row justify-between items-end md:items-center border-b border-sunglow">
      <div class="flex w-full md:w-4/5 overflow-x-auto">
        <nuxt-link
          v-if="authPermissions.includes('View My Banks')"
          to="/my-banks"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="
            !$route.name.includes('reports') && (!$route.query.practice_locum_type || $route.query.practice_locum_type.toLowerCase() === 'favorite')
              ? 'border-b-4 border-sunglow' 
              : 'text-gray-600'
          "
        >
          Favourites
        </nuxt-link>

        <nuxt-link
          v-if="authPermissions.includes('View My Banks')"
          to="/my-banks?practice_locum_type=Completed"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'completed'
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Completed
        </nuxt-link>

        <nuxt-link
          v-if="authPermissions.includes('View My Banks')"
          to="/my-banks?practice_locum_type=Applied"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'applied'
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Applied
        </nuxt-link>

        <nuxt-link
          v-if="authPermissions.includes('View My Banks')"
          to="/my-banks?practice_locum_type=Appointed"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'appointed'
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Appointed
        </nuxt-link>

        <nuxt-link
          v-if="authPermissions.includes('View My Banks')"
          to="/my-banks?practice_locum_type=Rejected"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'rejected'
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Rejected
        </nuxt-link>

        <nuxt-link
          v-if="authPermissions.includes('View My Banks')"
          to="/my-banks?practice_locum_type=Withdrawn"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'withdrawn'
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Withdrawn
        </nuxt-link>

        <nuxt-link
          v-if="authPermissions.includes('View My Banks')"
          to="/my-banks?practice_locum_type=Lates"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="
            $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'lates'
              ? 'border-b-4 border-sunglow'
              : 'text-gray-600'
          "
        >
          Lates
        </nuxt-link>

        <nuxt-link
            to="/my-banks?practice_locum_type=All"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="
              $route.query.practice_locum_type && $route.query.practice_locum_type.toLowerCase() === 'all'
                ? 'border-b-4 border-sunglow'
                : 'text-gray-600'
            "
          >
            All
          </nuxt-link>
        
        <nuxt-link
          v-if="authPermissions.includes('View Practice Reports')"
          to="/my-banks-reports"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
          :class="$route.name === 'my-banks-reports' ? 'border-b-4 border-sunglow' : 'text-gray-600'"
        >
          Reports
        </nuxt-link>
      </div>
      
      <div class="flex mt-2 md:mt-0">
        <nuxt-link
          to="/invite"
          class="md:mr-5 px-3 py-1 text-sm font-bold cursor-pointer"
          :class="'rounded-lg bg-sunglow hover:bg-sunglow-dark'"
        >
          Invite Locum
        </nuxt-link>
      </div>
    </div>
    <div class="flex flex-col">
      <nuxt-link
        v-for="myBanksReport in myBanksReports"
        :key="`myBanksReports-${myBanksReport.title}`"
        :to="myBanksReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ myBanksReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ myBanksReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="black" />
          </div>
        </div>
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name !== 'my-banks-reports'"
      class="shield z-511 fixed inset-0 opacity-50"
      :to="{ name: 'my-banks-reports'}"
    />
    <nuxt-child />
  </section>
</template>

<script>

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  data () {
    return {
      initialLoading: false,
      loading: false,
      date_start: null,
      date_end: null,
      filter_by: null,
      offset: 0,
      limit: 5,
      current_page: 1,
      order_by: [],
      reports: [],
      total: 0,
      myBanksReports: [
        // {
        //   title: 'REP-004',
        //   subtitle: 'Locums on System',
        //   url: '/my-banks/reports/locums',
        // },
        {
          title: 'REP-005',
          subtitle: 'Locums Used/Bank',
          url: '/my-banks-reports/practice-locums',
        },
        {
          title: 'REP-006',
          subtitle: 'Locums Not Successful',
          url: '/my-banks-reports/practice-unsuccessful-locums',
        },
        {
          title: 'REP-008',
          subtitle: 'Compliance - Expiring',
          url: '/my-banks-reports/locum-compliance-documents',
        },
      ],
    }
  },
  computed: {
    authPermissions () {
      return this.$store.getters["permissions"]
    },
  },

  async asyncData ({ app, error, store, }) {
    try {
      const authPermissions = store.getters["permissions"]

      if (authPermissions.includes('View Practice Reports') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

      if (app.$auth.user.domain === 'Practice' 
        && app.$auth.user.practice_detail 
        && app.$auth.user.practice_detail.practice
        && app.$auth.user.practice_detail.practice.type === 'Spoke'
        && app.$auth.user.practice_detail.practice.parent_practice_id === null) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })

        return
      }
    } catch (err) {
      console.log('err', err.response || err)
      error(err)
    }
  },

  // computed: {
  //   columns () {
  //     return [
  //       {
  //         name: "Name",
  //         dataIndex: "name",
  //         class: "text-left",
  //       },
  //       {
  //         name: "Reason",
  //         dataIndex: "reason",
  //         class: "text-center",
  //       },
  //     ]
  //   },
  // },

  // methods: {
  //   getReportsPromiseAll () {
  //     this.total = 3
  //     return (this.reports = [
  //       {
  //         name: "Locum 1",
  //         reason: "sample reason",
  //       },
  //       {
  //         name: "Locum 1",
  //         reason: "sample reason",
  //       },
  //       {
  //         name: "Locum 1",
  //         reason: "sample reason",
  //       },
  //     ])
  //   },

  //   search () {
  //     this.total = 3
  //     this.reports = [
  //       {
  //         name: "Locum 1",
  //         reason: "sample reason",
  //       },
  //       {
  //         name: "Locum 1",
  //         reason: "sample reason",
  //       },
  //       {
  //         name: "Locum 1",
  //         reason: "sample reason",
  //       },
  //     ]
  //   },
  //   pagechanged () {},
  //   limitchanged () {},
  //   sorted () {},
  // },
}
</script>
