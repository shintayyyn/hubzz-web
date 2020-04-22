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
      <nuxt-child :invoiceStatusList="invoiceStatusList" />
    </div>

    <AppConfirmationModal
      :label="'You\'ve been revoked to view this Page'"
      :confirmLabel="'OK'"
      :modal="confirmation_modal"
      @confirm="goTo"
    />
  </section>
</template>

<script>
  import AppConfirmationModal from "@/components/Base/AppConfirmationModal"

  export default {
    middleware: 'isVerified',
    
    components: {
      AppConfirmationModal,
    },

    data () {
      return {
        confirmation_modal: false,
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
          }
        ],
      }
    },

    computed: {
      practice () {
        return this.$auth.loggedIn && this.$auth.user.practice_detail
          ? this.$auth.user.practice_detail.practice
          : null
      },
      authPermissions () {
        return this.$store.getters['permissions']
      },
      tabs () {
        const {
          query,
        } = this.$route

        const {
          status = 'Allocated',
        } = query

        const tabs = []
        

        if (this.practice && this.practice.type === 'Spoke') {
          tabs.push(...[
            {
              title: 'Pending',
              route: {
                name: 'sessions-index',
                query: {
                  status: 'Pending',
                },
              },
              active: status.toLowerCase() === ('Pending').toLowerCase(),
            },
          ])
        }

        tabs.push(...[
          {
            title: 'Allocated',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Allocated',
              },
            },
            active: status.toLowerCase() === ('Allocated').toLowerCase(),
          },
          {
            title: 'Ongoing',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Ongoing',
              },
            },
            active: status.toLowerCase() === ('Ongoing').toLowerCase(),
          },
          {
            title: 'Live',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Live',
              },
            },
            active: status.toLowerCase() === ('Live').toLowerCase(),
          },
          {
            title: 'Applied',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Applied',
              },
            },
            active: status.toLowerCase() === ('Applied').toLowerCase(),
          },
          {
            title: 'Unfilled',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Unfilled',
              },
            },
            active: status.toLowerCase() === ('Unfilled').toLowerCase(),
          },
          {
            title: 'Withdrawn',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Withdrawn',
              },
            },
            active: status.toLowerCase() === ('Withdrawn').toLowerCase(),
          },
          {
            title: 'Cancelled',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Cancelled',
              },
            },
            active: status.toLowerCase() === ('Cancelled').toLowerCase(),
          },
          {
            title: 'Completed',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Completed',
              },
            },
            active: status.toLowerCase() === ('Completed').toLowerCase(),
          },
          {
            title: 'Approved',
            route: {
              name: 'sessions-index',
              query: {
                status: 'Approved',
              },
            },
            active: status.toLowerCase() === ('Approved').toLowerCase(),
          },
        ])

        return tabs
      },
    },

    watch: {
      authPermissions (value) {
        if (!this.CheckPermissions(value).hasPermission) {
          this.confirmation_modal = true
        }
      },
    },

    methods: {
      goTo () {
        this.confirmation_modal = false
        setTimeout(() => {
          this.$router.push('/')
        }, 500)
      },
    },

  }
</script>
