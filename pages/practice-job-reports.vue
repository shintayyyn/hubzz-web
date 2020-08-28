<template>
  <section class="sessions-section">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div v-for="tab in tabs" :key="tab.title" class="relative">
        <nuxt-link
          :event="$store.state.jobs.loading_jobs ? '' : 'click'"
          :to="tab.route"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="tab.active ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          {{ tab.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="mt-5">
      <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
        <div class="flex flex-col">
          <nuxt-link
            v-for="practiceJobReport in practiceJobReports"
            :key="`practiceJobReports-${practiceJobReport.title}`"
            :to="practiceJobReport.url"
            class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-300 transition-hover my-2"
          >
            <div class="flex flex-no-wrap items-center text-sm w-full">
              <span class="px-2 whitespace-no-wrap font-semibold">{{ practiceJobReport.title }}</span>
              <span class="px-2 w-full leading-tight flex items-center">{{ practiceJobReport.subtitle }}</span>
              <div class="flex items-center px-1 md:px-0">
                <svgicon name="arrow-right" width="21" height="21" color="black" />
              </div>
            </div>
          </nuxt-link>
        </div>
        <nuxt-link
          v-if="$route.name !== 'practice-job-reports'"
          class="shield z-511 fixed inset-0 opacity-50"
          to="/practice-job-reports"
        />
        <nuxt-child />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  transition: (to, from) => {
    if (
      (from && from.name === 'sessions-index')
      || (from && from.name === 'sessions-index-id')
      || (from && from.name === 'sessions-index-id-job-parts-jobPartId')

      || (to && to.name === 'sessions-index')
      || (to && to.name === 'sessions-index-id')
      || (to && to.name === 'sessions-index-id-job-parts-jobPartId')

      || (from && from.name === 'job-parts-index')
      || (from && from.name === 'job-parts-index-jobPartId')

      || (to && to.name === 'job-parts-index')
      || (to && to.name === 'job-parts-index-jobPartId')
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
      practiceJobReports: [
        {
          title: 'REP-007',
          subtitle: 'Locums that have Declined',
          url: '/practice-job-reports/practice-declined-locums',
        },
        {
          title: 'REP-009',
          subtitle: 'Locums that Arrive Late',
          url: '/practice-job-reports/practice-late-locums',
        },
      ],
    }
  },

  computed: {
    practice () {
      return this.$auth.loggedIn && this.$auth.user.practice_detail
        ? this.$auth.user.practice_detail.practice
        : null
    },

    tabs () {
      const {
        name,
        query,
      } = this.$route

      const { status = 'Allocated', } = query

      const tabs = []

      if (this.practice && this.practice.type === 'Spoke') {
        tabs.push(
          ...[
            {
              title: 'Pending',
              route: {
                name: 'sessions-index',
                query: {
                  status: 'Pending',
                },
              },
              active: name === 'job-parts-index'
                && status
                && status.toLowerCase() === 'Pending'.toLowerCase(),
            },
          ]
        )
      }

      tabs.push(
        ...[
          {
            title: 'Allocated',
            route: {
              name: 'job-parts-index',
              query: {
                status: 'Allocated',
              },
            },
            active: name === 'job-parts-index'
              && status
              && status.toLowerCase() === 'Allocated'.toLowerCase(),
          },
          {
            title: 'Ongoing',
            route: {
              name: 'job-parts-index',
              query: {
                status: 'Ongoing',
              },
            },
            active: name === 'job-parts-index'
              && status
              && status.toLowerCase() === 'Ongoing'.toLowerCase(),
          },
          {
            title: 'Live',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Live',
              },
            },
            active: name === 'sessions-index'
              && status
              && status.toLowerCase() === 'Live'.toLowerCase(),
          },
          {
            title: 'Applied',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Applied',
              },
            },
            active: name === 'sessions-index'
              && status
              && status.toLowerCase() === 'Applied'.toLowerCase(),
          },
          {
            title: 'Unfilled',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Unfilled',
              },
            },
            active: name === 'sessions-index'
              && status
              && status.toLowerCase() === 'Unfilled'.toLowerCase(),
          },
          {
            title: 'Withdrawn',
            route: {
              name: 'job-parts-index',
              query: {
                status: 'Withdrawn',
              },
            },
            active: name === 'job-parts-index'
              && status
              && status.toLowerCase() === 'Withdrawn'.toLowerCase(),
          },
          {
            title: 'Cancelled',
            route: {
              name: 'job-parts-index',
              query: {
                status: 'Cancelled',
              },
            },
            active: name === 'job-parts-index'
              && status
              && status.toLowerCase() === 'Cancelled'.toLowerCase(),
          },
          {
            title: 'Completed',
            route: {
              name: 'job-parts-index',
              query: {
                status: 'Completed',
              },
            },
            active: name === 'job-parts-index'
              && status
              && status.toLowerCase() === 'Completed'.toLowerCase(),
          },
          {
            title: 'Approved',
            route: {
              name: 'job-parts-index',
              query: {
                status: 'Approved',
              },
            },
            active: name === 'job-parts-index'
              && status
              && status.toLowerCase() === 'Approved'.toLowerCase(),
          },
          {
            title: 'Reports',
            route: {
              name: 'practice-job-reports',
            },
            active: name === 'practice-job-reports',
          },
        ]
      )

      return tabs
    },
  },
}
</script>
