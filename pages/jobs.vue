<template>
  <section class="jobs-section">
    <div class="flex flex-wrap items-center justify-between w-full border-b border-sunglow">
      <div class="flex overflow-x-auto items-center">
        <template v-for="tab in tabs" >
          <nuxt-link
            :key="tab.title"
            :event="$store.state.jobs.loading_jobs ? '' : 'click'"
            :to="tab.route"
            class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="tab.active ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            {{ tab.title }}
          </nuxt-link>
        </template>
      </div>
    </div>

    <div class="mt-5">
      <nuxt-child :invoiceStatusList="invoiceStatusList" :practiceTypeList="practiceTypeList" />
    </div>
  </section>
</template>

<script>
export default {
  transition: (to, from) => {
    if (
      (to && to.name === 'locum-job-parts-index' && from && from.name === 'jobs-index')
      || (from && from.name === 'locum-job-parts-index' && to && to.name === 'jobs-index')
      || (to && to.name === 'locum-job-parts-index-jobPartId' && from && from.name === 'jobs-index')
      || (from && from.name === 'locum-job-parts-index-jobPartId' && to && to.name === 'jobs-index')
      || (to && to.name === 'locum-job-parts-index' && from && from.name === 'jobs-index-id')
      || (from && from.name === 'locum-job-parts-index' && to && to.name === 'jobs-index-id')
      || (to && to.name === 'jobs-index-id')
      || (to && to.name === 'jobs-index-id-job-parts-jobPartId')

      || (from && from.name.includes('locum-job-reports'))
      || (to && to.name.includes('locum-job-reports'))
    ) {
      return {
        name: '',
        mode: 'out-in',
      }
    }
    
    return {
      name: 'page',
      mode: 'out-in',
    }
  },

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
        name,
        query,
      } = this.$route

      const {
        status = 'Allocated',
      } = query

      return [
        {
          title: 'Allocated',
          route: {
            name: 'locum-job-parts-index',
            query: {
              status: 'Allocated',
            },
          },
          active: name === 'locum-job-parts-index'
            && status
            && status.toLowerCase() === ('Allocated').toLowerCase(),
        },
        {
          title: 'Ongoing',
          route: {
            name: 'locum-job-parts-index',
            query: {
              status: 'Ongoing',
            },
          },
          active: name === 'locum-job-parts-index'
            && status
            && status.toLowerCase() === ('Ongoing').toLowerCase(),
        },
        {
          title: 'Available',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Available',
            },
          },
          active: name === 'jobs-index'
            && status
            && status.toLowerCase() === ('Available').toLowerCase(),
        },
        {
          title: 'Applied',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Applied',
            },
          },
          active: name === 'jobs-index'
            && status
            && status.toLowerCase() === ('Applied').toLowerCase(),
        },
        {
          title: 'Unsuccessful',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Unsuccessful',
            },
          },
          active: name === 'jobs-index'
            && status
            && status.toLowerCase() === ('Unsuccessful').toLowerCase(),
        },
        {
          title: 'Withdrawn',
          route: {
            name: 'locum-job-parts-index',
            query: {
              status: 'Withdrawn',
            },
          },
          active: name === 'locum-job-parts-index'
            && status
            && status.toLowerCase() === ('Withdrawn').toLowerCase(),
        },
        {
          title: 'Cancelled',
          route: {
            name: 'locum-job-parts-index',
            query: {
              status: 'Cancelled',
            },
          },
          active: name === 'locum-job-parts-index'
            && status
            && status.toLowerCase() === ('Cancelled').toLowerCase(),
        },
        {
          title: 'Completed',
          route: {
            name: 'locum-job-parts-index',
            query: {
              status: 'Completed',
            },
          },
          active: name === 'locum-job-parts-index'
            && status
            && status.toLowerCase() === ('Completed').toLowerCase(),
        },
        {
          title: 'Approved',
          route: {
            name: 'locum-job-parts-index',
            query: {
              status: 'Approved',
            },
          },
          active: name === 'locum-job-parts-index'
            && status
            && status.toLowerCase() === ('Approved').toLowerCase(),
        },
        {
          title: 'Private',
          route: {
            name: 'jobs-index',
            query: {
              status: 'Private',
            },
          },
          active: name === 'jobs-index'
            && status
            && status.toLowerCase() === ('Private').toLowerCase(),
        },
        {
          title: 'Reports',
          route: {
            name: 'locum-job-reports',
          },
          active: name === 'locum-job-reports',
        },
      ]
    },
  },

}
</script>
