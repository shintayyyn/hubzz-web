<template>
  <section class="jobs-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div v-for="tab in tabs" :key="tab.title" class="relative">
        <nuxt-link :event="$store.state.jobs.loading_jobs ? '' : 'click'"
                   :to="tab.route"
                   class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
                   :class="tab.active ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          {{ tab.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="mt-5">
      <nuxt-child :invoiceStatusList="invoiceStatusList" :practiceTypeList="practiceTypeList" />
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      invoiceStatusList: [
        {
          label: 'All',
          value: '',
        },
        {
          label: 'To Be Invoice',
          value: 'To Be Invoice',
        },
        {
          label: 'Disputed',
          value: 'Disputed',
        },
        {
          label: 'Invoiced',
          value: 'Invoiced',
        },
      ],
      practiceTypeList: [
        {
          label: 'All',
          value: '',
        },
        {
          label: 'Platform',
          value: 'Platform',
        },
        {
          label: 'Private',
          value: 'Private',
        },
      ],
    }
  },

  computed: {
    tabs () {
      const {
        query,
      } = this.$route

      const {
        status = 'Allocated',
      } = query

      return [
        {
          title: 'Allocated',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Allocated',
            },
          },
          active: status && status.toLowerCase() === ('Allocated').toLowerCase(),
        },
        {
          title: 'Ongoing',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Ongoing',
            },
          },
          active: status && status.toLowerCase() === ('Ongoing').toLowerCase(),
        },
        {
          title: 'Available',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Available',
            },
          },
          active: status && status.toLowerCase() === ('Available').toLowerCase(),
        },
        {
          title: 'Applied',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Applied',
            },
          },
          active: status && status.toLowerCase() === ('Applied').toLowerCase(),
        },
        {
          title: 'Unsuccessful',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Unsuccessful',
            },
          },
          active: status && status.toLowerCase() === ('Unsuccessful').toLowerCase(),
        },
        {
          title: 'Withdrawn',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Withdrawn',
            },
          },
          active: status && status.toLowerCase() === ('Withdrawn').toLowerCase(),
        },
        {
          title: 'Cancelled',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Cancelled',
            },
          },
          active: status && status.toLowerCase() === ('Cancelled').toLowerCase(),
        },
        {
          title: 'Completed',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Completed',
            },
          },
          active: status && status.toLowerCase() === ('Completed').toLowerCase(),
        },
        {
          title: 'Approved',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Approved',
            },
          },
          active: status && status.toLowerCase() === ('Approved').toLowerCase(),
        },
        {
          title: 'Private',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Private',
            },
          },
          active: status && status.toLowerCase() === ('Private').toLowerCase(),
        },
      ]
    },
  },

}
</script>
