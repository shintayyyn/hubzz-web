<template>
  <section class="jobs-section">
    <div class="mt-5">
        <nuxt-child />
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
