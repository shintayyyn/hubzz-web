<template>
  <section class="relative">
    <div class="flex flex-row flex-wrap justify-start items-center p-2">
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
    </transition>
  </section>
</template>

<script>
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"
import AppInput from "@/components/Base/AppInput"

export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppTable,
    AppButton,
    AppDate,
    AppInput,
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
    }
  },

  computed: {
    columns () {
      return [
        {
          name: "Name",
          dataIndex: "name",
          class: "text-left",
        },
        {
          name: "Reason",
          dataIndex: "reason",
          class: "text-center",
        },
      ]
    },
  },

  methods: {
    getReportsPromiseAll () {
      this.total = 3
      return (this.reports = [
        {
          name: "Locum 1",
          reason: "sample reason",
        },
        {
          name: "Locum 1",
          reason: "sample reason",
        },
        {
          name: "Locum 1",
          reason: "sample reason",
        },
      ])
    },

    search () {
      this.total = 3
      this.reports = [
        {
          name: "Locum 1",
          reason: "sample reason",
        },
        {
          name: "Locum 1",
          reason: "sample reason",
        },
        {
          name: "Locum 1",
          reason: "sample reason",
        },
      ]
    },
    pagechanged () {},
    limitchanged () {},
    sorted () {},
  },
}
</script>
