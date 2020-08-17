<template>
  <section class="relative">
    <!-- OLD -->
    <!-- <div class="flex flex-row flex-wrap justify-start items-center p-2">
      <AppDate v-model="date_start" :name="'date_start'" :label="'Start Date'" />
      <div class="mx-1" />

      <AppDate v-model="date_end" :name="'date_end'" :label="'End Date'" />

      <div class="mx-1" />

      <AppInput
        v-model="filter_by"
        class="w-1/4"
        :type="'select'"
        :name="'filter_by'"
        :label="'Filter by'"
        :items="[
          {
            label: 'All',
            value: null
          },
          {
            label: 'Lates',
            value: 'lates'
          },
          {
            label: 'No shows',
            value: 'No shows'
          },
          {
            label: 'Withdrawns',
            value: 'Withdrawns'
          },
        ]"
      />
    </div>

    <div class="flex">
      <AppButton label="Search" :inStyle="'padding:2px 10px;'" @click="search" />
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppTable
          v-if="reports.length > 0"
          :total="total"
          :items="reports"
          :currentPage="current_page"
          :perPage="limit"
          :columns="columns"
          :orderBy="order_by"
          :loading="loading"
          :customWidth="480"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        />
      </div>
    </transition> -->
    <!-- <div class="text-sm md:text-xl">
      My Banks - Reports
    </div> -->

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
// import AppTable from "@/components/Base/AppTable"
// import AppButton from "@/components/Base/AppButton"
// import AppDate from "@/components/Base/AppDate"
// import AppInput from "@/components/Base/AppInput"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    // AppTable,
    // AppButton,
    // AppDate,
    // AppInput,
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
     
        {
          title: 'REP-004',
          subtitle: 'Locums on System',
          url: '/my-banks/reports/locums',
        },
        {
          title: 'REP-005',
          subtitle: 'Locums Used/Bank',
          url: '/my-banks/reports/practice-locums',
        },
        {
          title: 'REP-006',
          subtitle: 'Locums Not Successful',
          url: '/my-banks/reports/practice-unsuccessful-locums',
        },
        {
          title: 'REP-008',
          subtitle: 'Compliance - Expiring',
          url: '/my-banks/reports/locum-compliance-documents',
        },
      ],
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
