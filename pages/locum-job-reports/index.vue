<template>
  <section class="jobs-section">
    <div class="flex flex-wrap items-center justify-between w-full border-b border-sunglow">
      <div class="flex overflow-x-auto items-center">
        <template v-for="tab in tabs">
          <nuxt-link
            :key="tab.title"
            :event="$store.state.jobs.loading_jobs ? '' : 'click'"
            :to="tab.route"
            class="md:mr-2 px-3 py-2 text-sm font-bold cursor-pointer"
            :class="tab.active ? 'border-b-4 border-sunglow' : 'text-gray-600'"
          >
            {{ tab.title }}
          </nuxt-link>
        </template>
      </div>
    </div>

    <div class="mt-5">
      <div class="flex-1 flex flex-col py-2 ">
        <div class="flex flex-col">
          <nuxt-link
            v-for="locumJobReport in locumJobReports"
            :key="`locumJobReports-${locumJobReport.title}`"
            :to="locumJobReport.url"
            class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-hover my-2"
          >
            <div class="flex flex-no-wrap items-center text-sm w-full">
              <span class="px-2 whitespace-no-wrap font-semibold">{{ locumJobReport.title }}</span>
              <span class="px-2 w-full leading-tight flex items-center">{{ locumJobReport.subtitle }}</span>
              <div class="flex items-center px-1 md:px-0">
                <svgicon name="arrow-right" width="21" height="21" color="black" />
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  transition: (to, from) => {
    if (
      (from && from.name === 'jobs-index')
      || (from && from.name === 'jobs-index-id')
      || (from && from.name === 'jobs-index-id-job-parts-jobPartId')

      || (to && to.name === 'jobs-index')
      || (to && to.name === 'jobs-index-id')
      || (to && to.name === 'jobs-index-id-job-parts-jobPartId')

      || (from && from.name === 'locum-job-parts-index')
      || (from && from.name === 'locum-job-parts-index-jobPartId')

      || (to && to.name === 'locum-job-parts-index')
      || (to && to.name === 'locum-job-parts-index-jobPartId')
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
      locumJobReports: [
        {
          title: 'REP-013',
          subtitle: 'Practices Worked',
          url: '/locum-job-reports/locum-practices',
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
